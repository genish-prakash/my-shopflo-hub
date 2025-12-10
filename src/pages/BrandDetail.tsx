import { useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ChevronDown, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockBrands, Brand, Product } from "@/data/brands";
import ProductDetailSheet from "@/components/ProductDetailSheet";
import shopfloLogo from "@/assets/shopflo-logo.png";

type SortOption = "best-selling" | "newest" | "price-low-high" | "price-high-low";

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
  
  const [brand, setBrand] = useState<Brand | null>(() => {
    return mockBrands.find(b => b.id === brandId) || null;
  });
  
  const [sortBy, setSortBy] = useState<SortOption>("best-selling");
  const [showOnSale, setShowOnSale] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const toggleWishlist = (productId: string) => {
    if (!brand) return;
    setBrand({
      ...brand,
      products: brand.products.map(product =>
        product.id === productId 
          ? { ...product, isWishlisted: !product.isWishlisted }
          : product
      )
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    if (!brand) return [];
    
    let products = [...brand.products];
    
    // Apply filters
    if (showOnSale) {
      products = products.filter(p => p.isOnSale);
    }
    if (showInStock) {
      products = products.filter(p => p.inStock);
    }
    
    // Apply sorting
    switch (sortBy) {
      case "best-selling":
        products.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case "newest":
        products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 8);
  }, [brand]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const openProductDetail = (product: Product) => {
    if (!brand) return;
    setSelectedProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      images: [product.image, product.image, product.image],
      brand: {
        name: brand.name,
        logo: brand.logo,
        color: brand.color,
        website: `https://${brand.name.toLowerCase().replace(/\s+/g, '')}.com`,
      },
      description: `Premium ${product.name} from ${brand.name}. High quality product with excellent craftsmanship.`,
      variants: [
        { id: "s", name: "S", available: true },
        { id: "m", name: "M", available: true },
        { id: "l", name: "L", available: product.inStock },
        { id: "xl", name: "XL", available: true },
      ],
      isWishlisted: product.isWishlisted,
    });
  };

  if (!brand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Brand not found</p>
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
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-xl font-bold text-foreground">{brand.name}</h1>
          </div>
          {/* Shopflo Logo */}
          <div className="flex items-center">
            <img src={shopfloLogo} alt="Shopflo" className="h-6" />
          </div>
        </div>

        <div className="px-4 pb-24">
          {/* Recommended Section - Carousel */}
          <section className="py-6">
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recommended for you</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => scrollCarousel('left')}
                    className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => scrollCarousel('right')}
                    className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div 
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {recommendedProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="flex-shrink-0 w-[75%] snap-start"
                    onClick={() => openProductDetail(product)}
                  >
                    <RecommendedProductCard 
                      product={product}
                      brandColor={brand.color}
                      onToggleWishlist={() => toggleWishlist(product.id)}
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
                  <Button variant="outline" size="sm" className="rounded-full bg-background">
                    {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
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
                      {sortBy === option.value && <Check className="w-4 h-4 ml-2" />}
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
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No products match your filters
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredAndSortedProducts.map((product) => (
                  <div key={product.id} onClick={() => openProductDetail(product)}>
                    <ProductCard 
                      product={product}
                      brandColor={brand.color}
                      onToggleWishlist={() => toggleWishlist(product.id)}
                    />
                  </div>
                ))}
              </div>
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
      />
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  brandColor: string;
  onToggleWishlist: () => void;
}

const ProductCard = ({ product, brandColor, onToggleWishlist }: ProductCardProps) => (
  <div
    className="relative bg-card rounded-2xl p-3 shadow-sm cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
    style={{
      background: `linear-gradient(135deg, ${brandColor}08 0%, ${brandColor}04 100%)`,
    }}
  >
    {/* Price - Top Left */}
    <div className="flex items-center gap-1 pr-8">
      <span className="text-sm font-semibold text-foreground">
        ₹{product.price.toLocaleString()}
      </span>
      {product.originalPrice && (
        <span className="text-xs text-muted-foreground line-through truncate">
          ₹{product.originalPrice.toLocaleString()}
        </span>
      )}
    </div>

    {/* Sale Badge */}
    {product.isOnSale && (
      <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
        SALE
      </span>
    )}

    {/* Product Icon */}
    <div className="flex items-center justify-center text-5xl py-8">
      {product.image}
    </div>

    {/* Product Name & Stock */}
    <div className="space-y-1 pr-8">
      <p className="text-sm text-foreground font-medium truncate">{product.name}</p>
      {!product.inStock && (
        <p className="text-xs text-red-500">Out of Stock</p>
      )}
    </div>

    {/* Wishlist - Bottom Right */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleWishlist();
      }}
      className="absolute bottom-3 right-3 p-1"
    >
      <Heart
        className={`w-5 h-5 transition-all ${
          product.isWishlisted
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground hover:text-red-400"
        }`}
      />
    </button>
  </div>
);

const RecommendedProductCard = ({ product, brandColor, onToggleWishlist }: ProductCardProps) => (
  <div
    className="relative bg-card rounded-2xl p-4 shadow-sm cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
    style={{
      background: `linear-gradient(135deg, ${brandColor}12 0%, ${brandColor}06 100%)`,
    }}
  >
    {/* Price - Top Left */}
    <div className="flex items-center gap-2 pr-8">
      <span className="text-lg font-bold text-foreground">
        ₹{product.price.toLocaleString()}
      </span>
      {product.originalPrice && (
        <span className="text-sm text-muted-foreground line-through">
          ₹{product.originalPrice.toLocaleString()}
        </span>
      )}
    </div>

    {/* Sale Badge */}
    {product.isOnSale && (
      <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
        SALE
      </span>
    )}

    {/* Product Icon */}
    <div className="flex items-center justify-center text-7xl py-10">
      {product.image}
    </div>

    {/* Product Name & Stock */}
    <div className="space-y-1 pr-10">
      <p className="text-base text-foreground font-medium truncate">{product.name}</p>
      {!product.inStock && (
        <p className="text-sm text-red-500">Out of Stock</p>
      )}
    </div>

    {/* Wishlist - Bottom Right */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleWishlist();
      }}
      className="absolute bottom-4 right-4 p-2 bg-background/80 rounded-full shadow-sm"
    >
      <Heart
        className={`w-6 h-6 transition-all ${
          product.isWishlisted
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground hover:text-red-400"
        }`}
      />
    </button>
  </div>
);

export default BrandDetail;