import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";

interface ProductVariant {
  id: string;
  name: string;
  available: boolean;
}

interface ProductDetailProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images: string[];
    brand: {
      name: string;
      logo: string;
      color: string;
      website?: string;
    };
    description: string;
    variants?: ProductVariant[];
    isWishlisted?: boolean;
  } | null;
  onToggleWishlist?: (productId: string) => void;
}

const ProductDetailSheet = ({ isOpen, onClose, product, onToggleWishlist }: ProductDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  if (!product) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleVisitBrand = () => {
    if (product.brand.website) {
      window.open(product.brand.website, "_blank");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] rounded-t-3xl p-0 overflow-hidden"
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Header with Brand Logo */}
          <SheetHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: `${product.brand.color}15` }}
                >
                  <img 
                    src={product.brand.logo} 
                    alt={product.brand.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <span className="font-semibold text-foreground">{product.brand.name}</span>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </SheetHeader>

          {/* Image Carousel */}
          <div className="relative bg-secondary">
            <div className="aspect-square flex items-center justify-center text-8xl">
              {product.images[currentImageIndex]}
            </div>
            
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? "bg-foreground w-4" 
                          : "bg-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => onToggleWishlist?.(product.id)}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  product.isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-foreground"
                }`}
              />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-4 space-y-5">
            {/* Name & Price */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">{product.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Select Variant</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => variant.available && setSelectedVariant(variant.id)}
                      disabled={!variant.available}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedVariant === variant.id
                          ? "bg-foreground text-background"
                          : variant.available
                            ? "bg-muted text-foreground hover:bg-muted/80"
                            : "bg-muted/50 text-muted-foreground line-through cursor-not-allowed"
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="sticky bottom-0 p-4 bg-background border-t border-border">
            <Button 
              onClick={handleVisitBrand}
              className="w-full h-12 rounded-xl font-semibold"
              style={{ backgroundColor: product.brand.color }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Shop on {product.brand.name}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDetailSheet;