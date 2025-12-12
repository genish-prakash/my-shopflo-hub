import { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { discoverApi } from "@/services/mystique/discoverApi";

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
    merchantId?: string;
    variantId?: string;
    shopifyData?: any;
  } | null;
  brand: any;
  onToggleWishlist?: (product: any) => void;
}

const ProductDetailSheet = ({
  isOpen,
  onClose,
  product,
  onToggleWishlist,
  brand,
}: ProductDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [shopifyProduct, setShopifyProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log(shopifyProduct);

  useEffect(() => {
    if (isOpen && product) {
      fetchShopifyData();
    } else {
      setShopifyProduct(null);
    }
  }, [isOpen, product, brand]);

  const fetchShopifyData = async () => {
    // Prefer brand.merchant_id if available, otherwise fallback to product.merchantId
    const merchantId = brand?.merchant_id || product?.merchantId;

    if (!merchantId) return;

    setIsLoading(true);
    try {
      // 1. Get Brand Details to find the domain
      // If the passed 'brand' prop has website/shopData, use it. Otherwise fetch.
      let currentBrand: any = brand;

      // If brand prop is missing or doesn't have website info, fetch it
      if (!currentBrand || (!currentBrand.website && !currentBrand.shopData)) {
        currentBrand = await discoverApi.getBrandDetails(merchantId);
      }

      // Support both 'website' (from our type) and 'shopData.domain' (from user's snippet structure)
      const website =
        currentBrand?.shop_domain || currentBrand.shopData?.domain;

      if (website) {
        let domain = website;
        try {
          const url = new URL(
            website.startsWith("http") ? website : `https://${website}`
          );
          domain = url.hostname;
        } catch (e) {
          console.error("Invalid website URL", website);
        }

        // 2. Derive handle from product name
        // We use the name to generate the handle as description is used for other things in our app
        const handle = product!.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        const path = `https://${domain}/products/${handle}.js`;
        console.log("Fetching Shopify data from:", path);

        // 3. Fetch from Shopify using axios
        const response = await axios.get(path);
        if (response.status === 200) {
          const data = response.data;
          setShopifyProduct(data);

          // Set initial variant if available
          if (data.variants && data.variants.length > 0) {
            // Try to match by ID if we have variantId, otherwise first one
            const matchedVariant = product!.variantId
              ? data.variants.find(
                  (v: any) => v.id.toString() === product!.variantId
                )
              : data.variants[0];

            if (matchedVariant) {
              setSelectedVariant(matchedVariant.id.toString());
            }
          }
        } else {
          console.error("Failed to fetch from Shopify:", response.status);
        }
      }
    } catch (error) {
      console.error("Failed to fetch Shopify product data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  // Use Shopify data if available, otherwise fallback to passed product data
  const displayProduct = shopifyProduct
    ? {
        name: shopifyProduct.title,
        price: shopifyProduct.price / 100, // Shopify returns cents
        originalPrice: shopifyProduct.compare_at_price
          ? shopifyProduct.compare_at_price / 100
          : undefined,
        images: shopifyProduct.images || [shopifyProduct.featured_image],
        description:
          shopifyProduct.description?.replace(/<[^>]*>?/gm, "") || "", // Strip HTML
        variants: shopifyProduct.variants.map((v: any) => ({
          id: v.id.toString(),
          name: v.title,
          available: v.available,
        })),
      }
    : product;

  // Ensure images is an array of strings and prepend shopDomain if needed
  const getDomain = () => {
    const d = brand?.shop_domain || brand?.shopData?.domain || brand?.website;
    if (!d) return "";
    try {
      return new URL(d.startsWith("http") ? d : `https://${d}`).hostname;
    } catch {
      return d;
    }
  };
  const shopDomain = getDomain();

  const images = Array.isArray(displayProduct.images)
    ? displayProduct.images.map((img: string) => {
        if (img.startsWith("http")) return img;
        if (img.startsWith("//")) return `https:${img}`;
        return `https://${shopDomain}${img}`;
      })
    : [displayProduct.images].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleVisitBrand = () => {
    if (brand.shop_domain) {

      const handle = product!.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      window.open(`https://${brand.shop_domain}/products/${handle}`, "_blank");
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
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <span className="font-semibold text-foreground">
                  {product.brand.name}
                </span>
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
            <div className="aspect-square flex items-center justify-center text-8xl overflow-hidden">
              {isLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading image...
                </div>
              ) : images[currentImageIndex]?.startsWith("http") ? (
                <img
                  src={images[currentImageIndex]}
                  alt={displayProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                images[currentImageIndex] || "📦"
              )}
            </div>

            {images.length > 1 && (
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
                  {images.map((_: any, index: number) => (
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
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleWishlist) {
                  const productToToggle = {
                    ...product,
                    name: displayProduct.name,
                    price: displayProduct.price,
                    image: images[0],
                    merchantId: product.merchantId,
                    variantId: selectedVariant || product.variantId,
                    product_title: displayProduct.name,
                    variant_title:
                      displayProduct.variants?.find(
                        (v: any) => v.id === selectedVariant
                      )?.name || "Default Title",
                    product_image_url: images[0],
                    currency: "INR",
                  };
                  onToggleWishlist(productToToggle);
                }
              }}
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
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
                <div className="h-24 bg-muted rounded w-full animate-pulse" />
              </div>
            ) : (
              <>
                {/* Name & Price */}
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {displayProduct.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      ₹{displayProduct.price.toLocaleString()}
                    </span>
                    {displayProduct.originalPrice && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{displayProduct.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                          {Math.round(
                            (1 -
                              displayProduct.price /
                                displayProduct.originalPrice) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Variants */}
                {displayProduct.variants &&
                  displayProduct.variants.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">
                        Select Variant
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {displayProduct.variants.map((variant: any) => (
                          <button
                            key={variant.id}
                            onClick={() =>
                              variant.available &&
                              setSelectedVariant(variant.id)
                            }
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
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {displayProduct.description}
                  </p>
                </div>
              </>
            )}
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
