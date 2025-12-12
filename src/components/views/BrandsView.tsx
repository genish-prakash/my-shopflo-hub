import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Plus, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProductDetailSheet from "@/components/ProductDetailSheet";
import { discoverApi, brandFollowApi, wishlistApi } from "@/services/mystique";
import WishlistView from "./WishlistView";
import type {
  DiscoverBrand,
  DiscoverProduct,
  WishlistItem,
  FollowedBrand,
} from "@/services/mystique/types";

type FilterType = "all" | "following" | "wishlisted";

interface BrandsViewProps {
  initialFilter?: FilterType;
}

const BrandsView = ({ initialFilter = "all" }: BrandsViewProps) => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<DiscoverBrand[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [followedBrands, setFollowedBrands] = useState<FollowedBrand[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastBrandElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await discoverApi.getDiscoverBrands(page, 10);
      setBrands((prev) => {
        // Filter out duplicates based on ID
        const newBrands = response.brands.filter(
          (newBrand) =>
            !prev.some((existingBrand) => existingBrand.id === newBrand.id)
        );
        return [...prev, ...newBrands];
      });
      setHasMore(response.has_more);
    } catch (error) {
      console.error("Failed to fetch brands", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [page]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const items = await wishlistApi.getAllWishlist();
        setWishlistItems(items);
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      }
    };
    fetchWishlist();
  }, []);

  useEffect(() => {
    const fetchFollowed = async () => {
      if (activeFilter === "following") {
        try {
          const items = await brandFollowApi.getAllFollowedBrands();
          setFollowedBrands(items);
        } catch (error) {
          console.error("Failed to fetch followed brands", error);
        }
      }
    };
    fetchFollowed();
  }, [activeFilter]);

  const toggleFollow = async (e: React.MouseEvent, brandId: string) => {
    e.stopPropagation();
    const brand = brands.find((b) => b.id === brandId);
    if (!brand) return;

    // Optimistic update
    setBrands(
      brands.map((b) =>
        b.id === brandId ? { ...b, is_followed: !b.is_followed } : b
      )
    );

    try {
      if (brand.is_followed) {
        await brandFollowApi.unfollowBrand(brand.merchant_id);
      } else {
        await brandFollowApi.followBrand({
          merchant_id: brand.merchant_id,
          brand_name: brand.name,
          brand_logo_url: brand.logo,
        });
      }
    } catch (error) {
      console.error("Failed to toggle follow", error);
      // Revert optimistic update
      setBrands(
        brands.map((b) =>
          b.id === brandId ? { ...b, is_followed: brand.is_followed } : b
        )
      );
    }
  };

  const toggleWishlist = async (
    e: React.MouseEvent,
    brandId: string,
    productId: string
  ) => {
    e.stopPropagation();

    // Find the product and brand
    const brand = brands.find((b) => b.id === brandId);
    const product = brand?.products.find((p) => p.id === productId);

    if (!brand || !product) return;

    // Check if item is already in wishlistItems to determine action
    const existingItem = wishlistItems.find(
      (item) => item.product_id === product.id
    );

    // Optimistic Update
    if (existingItem) {
      setWishlistItems((prev) =>
        prev.filter((item) => item.product_id !== product.id)
      );
    } else {
      const optimisticItem: WishlistItem = {
        id: `temp-${Date.now()}`,
        user_id: "user", // Placeholder
        merchant_id: brand.merchant_id,
        product_id: product.id,
        variant_id: product.id,
        product_title: product.name,
        variant_title: "Default",
        product_image_url: product.image || "",
        price: product.price,
        compare_at_price: product.original_price || undefined,
        currency: "INR",
        created_at: Date.now(),
        is_active: true,
      };
      setWishlistItems((prev) => [...prev, optimisticItem]);
    }

    try {
      if (existingItem) {
        await wishlistApi.removeFromWishlist(
          existingItem.merchant_id,
          existingItem.variant_id
        );
      } else {
        await wishlistApi.addToWishlist({
          merchant_id: brand.merchant_id,
          product_id: product.id,
          variant_id: product.id,
          product_title: product.name,
          variant_title: "Default",
          product_image_url: product.image || "",
          price: product.price,
          compare_at_price: product.original_price || undefined,
          currency: "INR",
        });
      }
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
      // Revert optimistic update
      if (existingItem) {
        setWishlistItems((prev) => [...prev, existingItem]);
      } else {
        setWishlistItems((prev) =>
          prev.filter((item) => item.product_id !== product.id)
        );
      }
    }
  };

  const getFilteredContent = () => {
    if (activeFilter === "following") {
      return [];
    }
    if (activeFilter === "wishlisted") {
      return [];
    }
    return brands;
  };

  const filteredContent = getFilteredContent();

  const navigateToBrand = (brandId: string) => {
    navigate(`/brand/${brandId}`);
  };

  const openProductDetail = (
    brand: DiscoverBrand,
    product: DiscoverProduct
  ) => {
    setSelectedProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      images: [product.image],
      brand: brand,
      description:
        product.description || `Premium ${product.name} from ${brand.name}.`,
      variants: [],
      isWishlisted: wishlistItems.some(
        (item) => item.product_id === product.id
      ),
    });
  };

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Discover Brands
        </h1>
        <p className="text-sm text-muted-foreground">
          Your favourite Indian D2C brands
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "All" },
          { key: "following", label: "Following" },
          { key: "wishlisted", label: "Wishlisted" },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key as FilterType)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === filter.key
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Followed Brands View */}
      {activeFilter === "following" && (
        <div className="space-y-4">
          {followedBrands.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No followed brands yet
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {followedBrands.map((brand) => (
                <div
                  key={brand.id}
                  className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth p-4 flex flex-col items-center text-center space-y-3 cursor-pointer"
                  onClick={() => navigateToBrand(brand.merchant_id)}
                >
                  <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden">
                    {brand.brand_logo_url ? (
                      <img
                        src={brand.brand_logo_url}
                        alt={brand.brand_name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl">
                        {brand.brand_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {brand.brand_name}
                    </h3>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFollowedBrands((prev) =>
                        prev.filter((b) => b.id !== brand.id)
                      );
                      brandFollowApi
                        .unfollowBrand(brand.merchant_id)
                        .catch(() => {
                          setFollowedBrands((prev) => [...prev, brand]);
                        });
                    }}
                  >
                    Following
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlisted Products View */}
      {activeFilter === "wishlisted" && (
        <div className="space-y-4">
          <WishlistView />
        </div>
      )}

      {/* Brands View (All) */}
      {activeFilter === "all" && (
        <div className="space-y-6">
          {(filteredContent as DiscoverBrand[]).length === 0 && !loading ? (
            <div className="text-center py-12 text-muted-foreground">
              No brands found
            </div>
          ) : (
            (filteredContent as DiscoverBrand[]).map((brand, index) => {
              const isLastElement =
                index === (filteredContent as DiscoverBrand[]).length - 1;
              return (
                <div
                  key={brand.id}
                  ref={isLastElement ? lastBrandElementRef : null}
                  className="rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-all hover:scale-[1.01] border border-white/20 relative"
                  style={{
                    background: `linear-gradient(145deg, ${brand.color}15 0%, ${brand.color}05 100%)`,
                    backdropFilter: "blur(20px)",
                  }}
                  onClick={() => navigateToBrand(brand.merchant_id)}
                >
                  {/* Decorative Background Blob */}
                  <div
                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: brand.color }}
                  />

                  {/* Header with Logo and Follow */}
                  <div className="flex items-center justify-between p-5 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm p-1">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <h2 className="text-xl font-bold text-foreground tracking-tight">
                        {brand.name}
                      </h2>
                    </div>
                    <Button
                      variant={brand.is_followed ? "default" : "outline"}
                      size="sm"
                      className={`rounded-full px-5 h-9 text-xs font-semibold transition-all ${
                        brand.is_followed
                          ? "bg-foreground text-background shadow-md hover:bg-foreground/90"
                          : "bg-white/50 border-foreground/10 hover:bg-white hover:border-foreground/20 backdrop-blur-sm"
                      }`}
                      onClick={(e) => toggleFollow(e, brand.id)}
                    >
                      {brand.is_followed ? (
                        <>Following</>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 mr-1.5" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Products Grid - 2x2 */}
                  <div className="px-5 pb-3 relative z-10">
                    <div className="grid grid-cols-2 gap-3">
                      {brand.products.slice(0, 4).map((product) => {
                        const isWishlisted = wishlistItems.some(
                          (item) => item.product_id === product.id
                        );
                        return (
                          <div
                            key={product.id}
                            className="group relative bg-white rounded-2xl aspect-[3/4] flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent hover:border-opacity-20"
                            style={{
                              borderColor: `${brand.color}30`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openProductDetail(brand, product);
                            }}
                          >
                            {/* Image Container */}
                            <div className="relative flex-1 w-full rounded-xl overflow-hidden bg-gray-50/50">
                              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-inner">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-4xl">
                                    🛍️
                                  </div>
                                )}
                              </div>

                              {/* Price Badge - Top Left */}
                              <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-baseline gap-1 border border-black/5 z-10">
                                <span className="text-xs font-bold text-foreground">
                                  ₹{product.price.toLocaleString()}
                                </span>
                              </div>

                              {/* Wishlist Button - Top Right */}
                              <button
                                onClick={(e) =>
                                  toggleWishlist(e, brand.id, product.id)
                                }
                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-sm transition-transform active:scale-90 border border-black/5 hover:bg-red-50 z-10"
                              >
                                <Heart
                                  className={`w-4 h-4 transition-colors ${
                                    isWishlisted
                                      ? "fill-red-500 text-red-500"
                                      : "text-gray-400 hover:text-red-500"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shop All CTA */}
                  <div className="p-5 pt-2 relative z-10">
                    <Button
                      className="w-full rounded-2xl h-11 font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                      style={{
                        backgroundColor: `${brand.color}`,
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToBrand(brand.merchant_id);
                      }}
                    >
                      Shop All Collection
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      )}

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        brand={selectedProduct?.brand}
        onToggleWishlist={(product) => {
          // Pass the product to toggleWishlist
          if (selectedProduct && selectedProduct.brand) {
            toggleWishlist(
              { stopPropagation: () => {} } as any,
              selectedProduct.brand.id,
              product.id
            );
            // Update local state for sheet
            setSelectedProduct((prev: any) => ({
              ...prev,
              isWishlisted: !prev.isWishlisted,
            }));
          }
        }}
      />
    </div>
  );
};

export default BrandsView;
