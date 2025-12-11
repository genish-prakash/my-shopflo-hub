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

const BrandsView = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<DiscoverBrand[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]); // Keep for toggle logic if needed, or refactor
  const [followedBrands, setFollowedBrands] = useState<FollowedBrand[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  console.log(brands)

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

  // Wishlist fetching moved to WishlistView, but we might need to know wishlist state for the heart icon on brands
  // For now, we'll fetch it here too if we want to sync, or just rely on local toggle updates.
  // To keep it simple and avoid double fetching, let's remove the fetch here if it's only for the view.
  // However, toggleWishlist uses wishlistItems to check existence.
  useEffect(() => {
    const fetchWishlist = async () => {
      // We fetch this to know what is wishlisted for the toggle logic
      try {
        const items = await wishlistApi.getAllWishlist();
        setWishlistItems(items);
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      }
    };
    fetchWishlist();
  }, []); // Fetch once on mount to populate state

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

    try {
      // We need a variant ID, but DiscoverProduct doesn't have it.
      // We'll use product ID as variant ID for now or a placeholder
      const variantId = product.id;

      // Check if item is already in wishlistItems to determine action
      const existingItem = wishlistItems.find(
        (item) => item.product_id === product.id
      );

      if (existingItem) {
        await wishlistApi.removeFromWishlist(
          existingItem.merchant_id,
          existingItem.variant_id
        );
        setWishlistItems((prev) =>
          prev.filter((item) => item.product_id !== product.id)
        );
      } else {
        await wishlistApi.addToWishlist({
          merchant_id: brand.merchant_id,
          product_id: product.id,
          variant_id: variantId,
          product_title: product.name,
          variant_title: "Default", // Placeholder
          product_image_url: product.image || "",
          price: product.price,
          compare_at_price: product.original_price || undefined,
          currency: "INR",
        });
        // Refresh wishlist to get the new item with correct ID
        // We update local state to reflect change immediately for other toggles
        const newItem = await wishlistApi.getAllWishlist(); // Or just add optimistic
        setWishlistItems(newItem);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
    }
  };

  const getFilteredContent = () => {
    if (activeFilter === "following") {
      // Return empty array here as we handle rendering separately for followed brands
      return [];
    }
    if (activeFilter === "wishlisted") {
      // Since we don't have wishlist status in the DiscoverProduct type yet,
      // we'll just return empty or implement when available.
      // For now returning empty to avoid errors
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
      brand: {
        name: brand.name,
        logo: brand.logo,
        color: brand.color,
        website: "", // Not available in API
      },
      description: `Premium ${product.name} from ${brand.name}.`,
      variants: [], // Not available in API
      isWishlisted: false, // Not available in API
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
                      // Optimistic update
                      setFollowedBrands((prev) =>
                        prev.filter((b) => b.id !== brand.id)
                      );
                      brandFollowApi
                        .unfollowBrand(brand.merchant_id)
                        .catch(() => {
                          // Revert if failed
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
                  className="rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-[1.01]"
                  style={{
                    background: `linear-gradient(135deg, ${brand.color}12 0%, ${brand.color}06 100%)`,
                  }}
                  onClick={() => navigateToBrand(brand.merchant_id)}
                >
                  {/* Header with Logo and Follow */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-white">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <h2 className="text-lg font-bold text-foreground">
                        {brand.name}
                      </h2>
                    </div>
                    <Button
                      variant={brand.is_followed ? "default" : "outline"}
                      size="sm"
                      className={`rounded-full px-4 h-8 text-xs font-medium ${
                        brand.is_followed
                          ? "bg-foreground text-background hover:bg-foreground/90"
                          : "border-foreground/30 hover:bg-foreground/10"
                      }`}
                      onClick={(e) => toggleFollow(e, brand.id)}
                    >
                      {brand.is_followed ? (
                        <>Following</>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Products Grid - 2x2 - No product names */}
                  <div className="px-4 pb-2">
                    <div className="grid grid-cols-2 gap-3">
                      {brand.products.slice(0, 4).map((product) => (
                        <div
                          key={product.id}
                          className="relative bg-white/90 backdrop-blur-sm rounded-xl p-3 aspect-square flex flex-col"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductDetail(brand, product);
                          }}
                        >
                          {/* Price - Top Left */}
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-foreground">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.original_price && (
                              <span className="text-xs text-muted-foreground line-through">
                                ₹{product.original_price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Product Icon */}
                          <div className="flex-1 flex items-center justify-center overflow-hidden my-2">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <span className="text-4xl">🛍️</span>
                            )}
                          </div>

                          {/* Wishlist - Bottom Right */}
                          <button
                            onClick={(e) =>
                              toggleWishlist(e, brand.id, product.id)
                            }
                            className="absolute bottom-3 right-3 p-1"
                          >
                            <Heart
                              className={`w-5 h-5 transition-all text-muted-foreground hover:text-red-400`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shop All CTA - Blurred */}
                  <div className="p-4 pt-2">
                    <Button
                      className="w-full rounded-full h-10 font-medium text-sm backdrop-blur-md border border-white/30"
                      style={{
                        backgroundColor: `${brand.color}90`,
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToBrand(brand.id);
                      }}
                    >
                      Shop All
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
        onToggleWishlist={(id) => {
          // TODO: Implement wishlist toggle
          console.log("Toggle wishlist from sheet", id);
        }}
      />
    </div>
  );
};

export default BrandsView;
