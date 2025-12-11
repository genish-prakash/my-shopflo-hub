import { useState, useMemo } from "react";
import { Heart, ShoppingBag, Star, X } from "lucide-react";
import ProductDetailSheet from "@/components/ProductDetailSheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type TabType = "wishlisted" | "purchased";

interface ProductReview {
  rating: number;
  review: string;
}

const mockProducts = {
  wishlisted: [
    { id: "1", name: "Wireless Headphones", brand: "Sony", brandLogo: "https://logo.clearbit.com/sony.com", brandColor: "#000000", price: 8999, image: "🎧", addedDate: "2024-01-10", description: "Premium wireless headphones with noise cancellation and 30-hour battery life." },
    { id: "2", name: "Smart Watch", brand: "Samsung", brandLogo: "https://logo.clearbit.com/samsung.com", brandColor: "#1428A0", price: 15999, image: "⌚", addedDate: "2024-01-12", description: "Advanced smartwatch with health monitoring and GPS tracking." },
    { id: "3", name: "Running Shoes", brand: "Adidas", brandLogo: "https://logo.clearbit.com/adidas.com", brandColor: "#000000", price: 6499, image: "👟", addedDate: "2024-01-08", description: "Lightweight running shoes with responsive cushioning for maximum comfort." },
    { id: "4", name: "Laptop Backpack", brand: "Dell", brandLogo: "https://logo.clearbit.com/dell.com", brandColor: "#007DB8", price: 2999, image: "🎒", addedDate: "2024-01-15", description: "Durable laptop backpack with multiple compartments and water-resistant material." },
  ],
  purchased: [
    { id: "5", name: "Air Max 270 React", brand: "Nike", brandLogo: "https://logo.clearbit.com/nike.com", brandColor: "#000000", price: 12999, image: "👟", purchasedDate: "2024-01-05", description: "Iconic sneakers combining comfort and style with React foam technology." },
    { id: "6", name: "AirPods Pro", brand: "Apple", brandLogo: "https://logo.clearbit.com/apple.com", brandColor: "#000000", price: 24900, image: "🎧", purchasedDate: "2023-12-20", description: "True wireless earbuds with active noise cancellation and spatial audio." },
    { id: "7", name: "Cotton Shirt", brand: "Zara", brandLogo: "https://logo.clearbit.com/zara.com", brandColor: "#000000", price: 2499, image: "👔", purchasedDate: "2024-01-18", description: "Classic cotton shirt perfect for both casual and formal occasions." },
    { id: "8", name: "Leather Wallet", brand: "Fossil", brandLogo: "https://logo.clearbit.com/fossil.com", brandColor: "#8B4513", price: 3999, image: "👛", purchasedDate: "2024-01-10", description: "Premium leather wallet with RFID protection and multiple card slots." },
  ],
};

const ProductsView = () => {
  const [activeTab, setActiveTab] = useState<TabType>("wishlisted");
  const [wishlistedProducts, setWishlistedProducts] = useState(mockProducts.wishlisted);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [productToReview, setProductToReview] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [productReviews, setProductReviews] = useState<Record<string, ProductReview>>({});

  const removeFromWishlist = (productId: string) => {
    setWishlistedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProducts = () => {
    switch (activeTab) {
      case "wishlisted":
        return wishlistedProducts;
      case "purchased":
        return mockProducts.purchased;
      default:
        return [];
    }
  };

  const sortedProducts = useMemo(() => {
    const products = [...getProducts()];
    const dateField = activeTab === "wishlisted" ? "addedDate" : "purchasedDate";
    return products.sort((a: any, b: any) => {
      const dateA = new Date(a[dateField]).getTime();
      const dateB = new Date(b[dateField]).getTime();
      return dateB - dateA;
    });
  }, [activeTab, wishlistedProducts]);

  const tabs = [
    { id: "wishlisted" as TabType, label: "Wishlisted", icon: Heart, count: wishlistedProducts.length },
    { id: "purchased" as TabType, label: "Purchased", icon: ShoppingBag, count: mockProducts.purchased.length },
  ];

  const openProductDetail = (product: any) => {
    setSelectedProduct({
      ...product,
      images: [product.image, product.image, product.image],
      brand: {
        name: product.brand,
        logo: product.brandLogo,
        color: product.brandColor,
        website: `https://${product.brand.toLowerCase().replace(/\s+/g, '')}.com`,
      },
      variants: [
        { id: "s", name: "S", available: true },
        { id: "m", name: "M", available: true },
        { id: "l", name: "L", available: false },
        { id: "xl", name: "XL", available: true },
      ],
      isWishlisted: activeTab === "wishlisted",
    });
  };

  const openReviewDialog = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToReview(product);
    setReviewRating(productReviews[product.id]?.rating || 0);
    setReviewText(productReviews[product.id]?.review || "");
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    setProductReviews(prev => ({
      ...prev,
      [productToReview.id]: {
        rating: reviewRating,
        review: reviewText,
      }
    }));
    
    toast.success("Review submitted successfully!");
    setReviewDialogOpen(false);
    setProductToReview(null);
    setReviewRating(0);
    setReviewText("");
  };

  return (
    <div className="pb-24 px-4 pt-4" style={{ background: 'linear-gradient(180deg, rgba(101, 53, 255, 0.08) 0%, transparent 30%)' }}>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-foreground">Products</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === tab.id && tab.id === "wishlisted" ? "fill-current" : ""}`} />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? "bg-background/20" : "bg-foreground/10"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {sortedProducts.map((product: any) => (
            <div
              key={product.id}
              onClick={() => openProductDetail(product)}
              className="relative bg-card rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Product Image */}
              <div className="aspect-square bg-secondary flex items-center justify-center text-5xl">
                {product.image}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
                <h3 className="font-medium text-sm text-foreground truncate mb-1">
                  {product.name}
                </h3>
                <p className="text-sm font-bold text-foreground">
                  ₹{product.price.toLocaleString()}
                </p>
                
                {/* Review CTA for purchased products */}
                {activeTab === "purchased" && (
                  <div className="mt-2">
                    {productReviews[product.id] ? (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= productReviews[product.id].rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-neutral-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">Reviewed</span>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => openReviewDialog(product, e)}
                        className="text-xs font-medium text-neutral-600 hover:text-foreground underline underline-offset-2"
                      >
                        Rate & Review
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              {activeTab === "wishlisted" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onToggleWishlist={(id) => {
          if (activeTab === "wishlisted") {
            removeFromWishlist(id);
          }
          setSelectedProduct(null);
        }}
      />

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm mx-auto rounded-3xl p-0 border-0 shadow-xl bg-card">
          <div className="p-6">
            <DialogHeader className="text-center mb-4">
              <DialogTitle className="text-xl font-semibold text-foreground">Rate & Review</DialogTitle>
            </DialogHeader>
            
            {productToReview && (
              <div className="space-y-5">
                {/* Product Info */}
                <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-2xl">
                  <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center text-3xl">
                    {productToReview.image}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">{productToReview.name}</p>
                    <p className="text-xs text-muted-foreground">{productToReview.brand}</p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="text-center">
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Your Rating
                  </label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-9 h-9 ${
                            star <= reviewRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-neutral-300 hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block text-center">
                    Your Review (Optional)
                  </label>
                  <Textarea
                    placeholder="Share your experience with this product..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="min-h-[100px] resize-none rounded-2xl border-muted"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitReview}
                  className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold"
                >
                  Submit Review
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsView;
