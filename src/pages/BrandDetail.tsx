import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockBrands, Brand, Product } from "@/data/brands";

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
  
  const [brand, setBrand] = useState<Brand | null>(() => {
    return mockBrands.find(b => b.id === brandId) || null;
  });
  
  const [sortBy, setSortBy] = useState<SortOption>("best-selling");
  const [showOnSale, setShowOnSale] = useState(false);
  const [showInStock, setShowInStock] = useState(false);

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
      .slice(0, 4);
  }, [brand]);

  if (!brand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Brand not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div 
        className="sticky top-0 z-10 px-4 py-4 flex items-center gap-4"
        style={{
          background: `linear-gradient(135deg, ${brand.color}20 0%, ${brand.color}10 100%)`,
        }}
      >
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm"
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
      </div>

      <div className="px-4 pb-24">
        {/* Recommended Section */}
        <section className="py-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recommended for you</h2>
          <div className="grid grid-cols-2 gap-3">
            {recommendedProducts.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                brandColor={brand.color}
                onToggleWishlist={() => toggleWishlist(product.id)}
              />
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="py-4 border-t border-border">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
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
                <ProductCard 
                  key={product.id}
                  product={product}
                  brandColor={brand.color}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
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
    className="relative bg-card rounded-2xl p-3 shadow-sm"
    style={{
      background: `linear-gradient(135deg, ${brandColor}08 0%, ${brandColor}04 100%)`,
    }}
  >
    {/* Price - Top Left */}
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-sm font-semibold text-foreground">
        ₹{product.price.toLocaleString()}
      </span>
      {product.originalPrice && (
        <span className="text-xs text-muted-foreground line-through">
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
    <div className="space-y-1">
      <p className="text-sm text-foreground font-medium truncate">{product.name}</p>
      {!product.inStock && (
        <p className="text-xs text-red-500">Out of Stock</p>
      )}
    </div>

    {/* Wishlist - Bottom Right */}
    <button
      onClick={onToggleWishlist}
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

export default BrandDetail;
