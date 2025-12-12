import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { discoverApi } from "@/services/mystique/discoverApi";
import { DiscoverBrand, DiscoverProduct } from "@/services/mystique/types";
import ProductDetailSheet from "@/components/ProductDetailSheet";

// Extend DiscoverProduct to include local state like is_wishlisted
interface BrandDetailProduct extends DiscoverProduct {
  is_wishlisted?: boolean;
}

interface BrandDetailState extends Omit<DiscoverBrand, "products"> {
  products: BrandDetailProduct[];
}

type SortOption =
  | "best-selling"
  | "newest"
  | "price-low-high"
  | "price-high-low";

const SORT_OPTIONS = [
  { value: "best-selling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "price-low-high", label: "Price: Low - High" },
  { value: "price-high-low", label: "Price: High - Low" },
];

const BrandDetail = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const [brand, setBrand] = useState<BrandDetailState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [sortBy, setSortBy] = useState<SortOption>("best-selling");
  const [showOnSale, setShowOnSale] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Fetch brand details (without products)
  useEffect(() => {
    const fetchBrand = async () => {
      if (!brandId) return;

      try {
        setIsLoading(true);
        const data = await discoverApi.getBrandDetails(brandId);

        setBrand({
          ...data,
          products: [], // We'll load products separately
        });
      } catch (err) {
        console.error("Failed to fetch brand details:", err);
        setError("Failed to load brand details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [brandId]);

  // Fetch products with pagination
  const fetchProducts = useCallback(async () => {
    if (!brandId || !hasMore) {
      return;
    }

    // Prevent duplicate calls using state check
    setIsLoadingMore((currentLoading) => {
      if (currentLoading) {
        return true; // Already loading, don't proceed
      }

      // Start loading
      (async () => {
        try {
          const response = await discoverApi.getMerchantProducts(
            brandId,
            offset,
            50
          );

          const productsWithWishlist = response.products.map((p) => ({
            ...p,
            is_wishlisted: false,
          }));

          setBrand((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              products: [...prev.products, ...productsWithWishlist],
            };
          });

          // Update pagination state
          setOffset((prev) => prev + response.products.length);

          // Only stop when API returns empty array
          if (response.products.length === 0) {
            setHasMore(false);
          }
        } catch (err) {
          console.error("Failed to fetch products:", err);
          // Stop fetching on error
          setHasMore(false);
        } finally {
          setIsLoadingMore(false);
        }
      })();

      return true;
    });
  }, [brandId, offset, hasMore]);

  // Store fetchProducts in a ref to use in observer without causing re-renders
  const fetchProductsRef = useRef(fetchProducts);
  useEffect(() => {
    fetchProductsRef.current = fetchProducts;
  }, [fetchProducts]);

  // Initial product load - only trigger once when brand is loaded
  useEffect(() => {
    if (brand && brand.products.length === 0 && !isLoadingMore) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand?.id]); // Only re-run when brand ID changes

  const toggleWishlist = (productId: string) => {
    if (!brand) return;
    setBrand({
      ...brand,
      products: brand.products.map((product) =>
        product.id === productId
          ? { ...product, is_wishlisted: !product.is_wishlisted }
          : product
      ),
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    if (!brand) return [];

    let products = [...brand.products];

    // Apply filters
    if (showOnSale) {
      products = products.filter((p) => p.is_on_sale);
    }
    if (showInStock) {
      products = products.filter((p) => p.in_stock);
    }

    // Apply sorting
    switch (sortBy) {
      case "best-selling":
        products.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
        break;
      case "newest":
        products.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
        break;
      case "price-low-high":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        products.sort((a, b) => b.price - a.price);
        break;
    }

    return products;
  }, [brand, sortBy, showOnSale, showInStock]);

  const recommendedProducts = useMemo(() => {
    if (!brand) return [];
    return [...brand.products]
      .sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
      .slice(0, 8);
  }, [brand]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Infinite scroll observer
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchProductsRef.current();
          }
        },
        {
          rootMargin: "300px", // Trigger 300px before reaching the element
        }
      );

      if (node) observer.current.observe(node);
    },
    [isLoadingMore, hasMore, brand?.products.length]
  );

  const openProductDetail = (product: BrandDetailProduct) => {
    if (!brand) return;
    setSelectedProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      images: [product.image, product.image, product.image],
      brand: {
        name: brand.name,
        logo: brand.logo,
        color: brand.color,
        website:
          brand.shop_domain ||
          `https://${brand.name.toLowerCase().replace(/\s+/g, "")}.com`,
      },
      description:
        product.description ||
        `Premium ${product.name} from ${brand.name}. High quality product with excellent craftsmanship.`,
      variants: [
        { id: "s", name: "S", available: true },
        { id: "m", name: "M", available: true },
        { id: "l", name: "L", available: product.in_stock },
        { id: "xl", name: "XL", available: true },
      ],
      isWishlisted: product.is_wishlisted,
      merchantId: brand.merchant_id,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{error || "Brand not found"}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `linear-gradient(180deg, ${brand.color}15 0%, ${brand.color}05 30%, hsl(var(--background)) 60%)`,
      }}
    >
      {/* Blurred background overlay */}
      <div
        className="absolute inset-0 backdrop-blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top, ${brand.color}20 0%, transparent 50%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 py-4 flex items-center gap-4 bg-background/80 backdrop-blur-md">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <h1 className="text-xl font-bold text-foreground">{brand.name}</h1>
          </div>
        </div>

        <div className="px-4 pb-24">
          {/* Recommended Section - Carousel */}
          <section className="py-6">
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Recommended for you
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollCarousel("left")}
                    className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollCarousel("right")}
                    className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {recommendedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[75%] snap-start"
                    onClick={() => openProductDetail(product)}
                  >
                    <RecommendedProductCard
                      product={product}
                      brandColor={brand.color}
                      onToggleWishlist={() => toggleWishlist(product.id)}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="py-4 border-t border-border/50">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-background"
                  >
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-card z-50">
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value as SortOption)}
                      className="flex items-center justify-between"
                    >
                      {option.label}
                      {sortBy === option.value && (
                        <Check className="w-4 h-4 ml-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* On Sale Toggle */}
              <button
                onClick={() => setShowOnSale(!showOnSale)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  showOnSale
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                On Sale
              </button>

              {/* In Stock Toggle */}
              <button
                onClick={() => setShowInStock(!showInStock)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  showInStock
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                In Stock
              </button>
            </div>
          </section>

          {/* All Products */}
          <section className="py-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              All Products ({filteredAndSortedProducts.length})
            </h2>
            {filteredAndSortedProducts.length === 0 && !isLoadingMore ? (
              <div className="text-center py-12 text-muted-foreground">
                No products match your filters
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {filteredAndSortedProducts.map((product, index) => {
                    const isLastElement =
                      index === filteredAndSortedProducts.length - 1;
                    return (
                      <div
                        key={product.id}
                        ref={isLastElement ? lastProductElementRef : null}
                        onClick={() => openProductDetail(product)}
                      >
                        <ProductCard
                          product={product}
                          brandColor={brand.color}
                          onToggleWishlist={() => toggleWishlist(product.id)}
                        />
                      </div>
                    );
                  })}
                </div>

                {isLoadingMore && (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onToggleWishlist={(id) => {
          toggleWishlist(id);
          setSelectedProduct(null);
        }}
        brand={brand}
      />
    </div>
  );
};

interface ProductCardProps {
  product: BrandDetailProduct;
  brandColor: string;
  onToggleWishlist: () => void;
  index?: number;
}

const ProductCard = ({
  product,
  brandColor,
  onToggleWishlist,
}: ProductCardProps) => (
  <div
    className="relative bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col border border-border/50"
    style={{
      background: `linear-gradient(135deg, ${brandColor}0A 0%, ${brandColor}05 100%)`,
    }}
  >
    {/* Sale Badge - Top Left */}
    {product.is_on_sale && (
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] px-2.5 py-1 rounded-full font-semibold shadow-md">
          SALE
        </span>
      </div>
    )}

    {/* Wishlist - Top Right */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleWishlist();
      }}
      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm"
    >
      <Heart
        className={`w-4 h-4 transition-all ${
          product.is_wishlisted
            ? "fill-red-500 text-red-500 scale-110"
            : "text-muted-foreground group-hover:text-red-400"
        }`}
      />
    </button>

    {/* Product Image Container - Fixed Aspect Ratio */}
    <div className="relative w-full pt-3 px-3">
      <div className="aspect-square w-full bg-white/50 rounded-xl overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E';
          }}
        />
      </div>
    </div>

    {/* Product Info - Flex Grow to Fill Space */}
    <div className="flex-1 flex flex-col p-3 pt-2">
      {/* Product Name - Clamped to 2 Lines */}
      <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">
        {product.name}
      </h3>

      {/* Stock Status */}
      {!product.in_stock && (
        <p className="text-xs text-red-500 font-medium mb-2">Out of Stock</p>
      )}

      {/* Spacer to push price to bottom */}
      <div className="flex-1" />

      {/* Price - Always at Bottom */}
      <div className="flex items-center gap-2 mt-auto">
        <span
          className="text-base font-bold text-foreground"
          style={{ color: brandColor }}
        >
          ₹{product.price.toLocaleString()}
        </span>
        {product.original_price && (
          <span className="text-xs text-muted-foreground line-through">
            ₹{product.original_price.toLocaleString()}
          </span>
        )}
      </div>

      {/* Discount Percentage */}
      {product.original_price && product.original_price > product.price && (
        <p className="text-xs font-semibold mt-1" style={{ color: "#22c55e" }}>
          {Math.round(
            ((product.original_price - product.price) /
              product.original_price) *
              100
          )}
          % OFF
        </p>
      )}
    </div>

    {/* Hover Effect Border */}
    <div
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      style={{
        background: `linear-gradient(135deg, ${brandColor}20, transparent)`,
      }}
    />
  </div>
);

const RecommendedProductCard = ({
  product,
  brandColor,
  onToggleWishlist,
  index = 0,
}: ProductCardProps) => {
  // Alternate heights: 360px for even indices, 336px for odd indices
  const cardHeight =  "h-[336px]";

  return (
    <div
      className={`relative bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col border-2 border-border/30 min-w-[200px] ${cardHeight}`}
      style={{
        background: `linear-gradient(135deg, ${brandColor}15 0%, ${brandColor}08 100%)`,
      }}
    >
      {/* Sale Badge - Top Left */}
      {product.is_on_sale && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] px-2.5 py-1 rounded-full font-semibold shadow-lg">
            SALE
          </span>
        </div>
      )}

      {/* Wishlist - Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist();
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-md"
      >
        <Heart
          className={`w-4 h-4 transition-all ${
            product.is_wishlisted
              ? "fill-red-500 text-red-500 scale-110"
              : "text-muted-foreground group-hover:text-red-400"
          }`}
        />
      </button>

      {/* Product Image Container - Compact */}
      <div className="relative w-full pt-3 px-3">
        <div className="h-[200px] w-full bg-gradient-to-br from-white/60 to-white/40 rounded-2xl overflow-hidden flex items-center justify-center p-4 shadow-inner">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%23f0f0f0" width="120" height="120"/%3E%3C/svg%3E';
            }}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col p-3 pt-2">
        {/* Product Name - Clamped to 2 Lines */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Stock Status */}
        {!product.in_stock && (
          <p className="text-xs text-red-500 font-semibold mb-2">
            Out of Stock
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span
              className="text-base font-bold text-foreground"
              style={{ color: brandColor }}
            >
              ₹{product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.original_price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {product.original_price && product.original_price > product.price && (
            <div className="inline-block">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {Math.round(
                  ((product.original_price - product.price) /
                    product.original_price) *
                    100
                )}
                % OFF
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Badge - Bottom Accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-80"
        style={{
          background: `linear-gradient(90deg, ${brandColor}, transparent)`,
        }}
      />

      {/* Hover Effect Border Glow */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${brandColor}25, transparent)`,
          boxShadow: `0 0 30px ${brandColor}30`,
        }}
      />
    </div>
  );
};

export default BrandDetail;
