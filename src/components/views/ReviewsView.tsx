import { useState } from "react";
import { ChevronRight, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { toast } from "sonner";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface DeliveredOrder {
  id: string;
  brand: string;
  brandLogo: string;
  deliveredDate: string;
  price: string;
  items: OrderItem[];
}

interface ProductReview {
  rating: number;
  review: string;
}

const deliveredOrders: DeliveredOrder[] = [
  {
    id: "ORD-78235",
    brand: "Apple Store",
    brandLogo: "https://logo.clearbit.com/apple.com",
    deliveredDate: "13 Jan, 2024",
    price: "₹24,900",
    items: [
      { name: "AirPods Pro (2nd Generation)", quantity: 1, price: 24900, image: "🎧" },
    ],
  },
  {
    id: "ORD-78237",
    brand: "Samsung",
    brandLogo: "https://logo.clearbit.com/samsung.com",
    deliveredDate: "8 Jan, 2024",
    price: "₹9,999",
    items: [
      { name: "Galaxy Buds Pro - Black", quantity: 1, price: 9999, image: "🎧" },
    ],
  },
  {
    id: "ORD-78240",
    brand: "Nike Store",
    brandLogo: "https://logo.clearbit.com/nike.com",
    deliveredDate: "5 Jan, 2024",
    price: "₹18,498",
    items: [
      { name: "Air Max 270 React - Black", quantity: 1, price: 12999, image: "👟" },
      { name: "Nike Dri-FIT T-Shirt", quantity: 1, price: 2999, image: "👕" },
      { name: "Nike Sports Socks Pack", quantity: 1, price: 2500, image: "🧦" },
    ],
  },
  {
    id: "ORD-78242",
    brand: "Zara Fashion",
    brandLogo: "https://logo.clearbit.com/zara.com",
    deliveredDate: "2 Jan, 2024",
    price: "₹7,497",
    items: [
      { name: "Premium Cotton Shirt - Blue", quantity: 1, price: 2499, image: "👔" },
      { name: "Slim Fit Chinos - Beige", quantity: 1, price: 2999, image: "👖" },
      { name: "Leather Belt - Brown", quantity: 1, price: 1999, image: "🥋" },
    ],
  },
];

const ReviewsView = () => {
  const [selectedOrder, setSelectedOrder] = useState<DeliveredOrder | null>(null);
  const [reviewingProduct, setReviewingProduct] = useState<OrderItem | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [productReviews, setProductReviews] = useState<Record<string, ProductReview>>({});

  const openOrderSheet = (order: DeliveredOrder) => {
    setSelectedOrder(order);
  };

  const startReview = (product: OrderItem) => {
    const existingReview = productReviews[product.name];
    setReviewingProduct(product);
    setReviewRating(existingReview?.rating || 0);
    setReviewText(existingReview?.review || "");
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (reviewingProduct) {
      setProductReviews(prev => ({
        ...prev,
        [reviewingProduct.name]: {
          rating: reviewRating,
          review: reviewText,
        }
      }));
      
      toast.success("Review submitted successfully!");
      setReviewingProduct(null);
      setReviewRating(0);
      setReviewText("");
    }
  };

  const getReviewedCount = (order: DeliveredOrder) => {
    return order.items.filter(item => productReviews[item.name]).length;
  };

  return (
    <div className="pb-24 px-4 pt-4" style={{ background: 'linear-gradient(180deg, rgba(101, 53, 255, 0.08) 0%, transparent 30%)' }}>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-foreground">Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">Rate your delivered orders</p>
      </div>

      {/* Delivered Orders List */}
      {deliveredOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No delivered orders to review
        </div>
      ) : (
        <div className="space-y-3">
          {deliveredOrders.map((order) => {
            const reviewedCount = getReviewedCount(order);
            const allReviewed = reviewedCount === order.items.length;
            
            return (
              <div
                key={order.id}
                onClick={() => openOrderSheet(order)}
                className="bg-card rounded-2xl p-4 cursor-pointer hover:bg-muted/30 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {/* Brand Logo */}
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src={order.brandLogo} 
                      alt={order.brand}
                      className="w-7 h-7 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground text-sm">{order.brand}</span>
                      <span className="text-xs text-muted-foreground">• {order.id}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Delivered on {order.deliveredDate}</p>
                    
                    {/* Product Circles */}
                    <div className="flex items-center gap-1">
                      {order.items.slice(0, 4).map((item, index) => (
                        <div 
                          key={index}
                          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm border-2 border-card -ml-1 first:ml-0"
                        >
                          {item.image}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground border-2 border-card -ml-1">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Status & Arrow */}
                  <div className="flex items-center gap-2">
                    {allReviewed ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-medium">Done</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        {reviewedCount}/{order.items.length} Reviewed
                      </div>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Products Sheet */}
      <Sheet open={!!selectedOrder && !reviewingProduct} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent 
          side="bottom" 
          className="h-[70vh] rounded-t-3xl p-0 overflow-hidden"
        >
          {selectedOrder && (
            <div className="h-full flex flex-col overflow-y-auto">
              {/* Header */}
              <SheetHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                      <img 
                        src={selectedOrder.brandLogo} 
                        alt={selectedOrder.brand}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{selectedOrder.brand}</span>
                      <p className="text-xs text-muted-foreground">{selectedOrder.id}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </SheetHeader>

              <div className="flex-1 p-4 space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Rate the products from this order
                </p>
                
                {selectedOrder.items.map((item, index) => {
                  const hasReview = productReviews[item.name];
                  
                  return (
                    <div key={index} className="bg-muted/30 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-3xl">
                          {item.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-foreground mt-1">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {/* Review Status or CTA */}
                      <div className="mt-3">
                        {hasReview ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= hasReview.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-neutral-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <button
                              onClick={() => startReview(item)}
                              className="text-xs text-primary font-medium"
                            >
                              Edit Review
                            </button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => startReview(item)}
                            className="w-full rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Rate & Review
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Review Input Sheet */}
      <Sheet open={!!reviewingProduct} onOpenChange={(open) => !open && setReviewingProduct(null)}>
        <SheetContent 
          side="bottom" 
          className="h-auto max-h-[85vh] rounded-t-3xl p-0 overflow-hidden"
        >
          {reviewingProduct && (
            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Rate & Review</h2>
                <button 
                  onClick={() => setReviewingProduct(null)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-2xl">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center text-3xl">
                  {reviewingProduct.image}
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm text-foreground">{reviewingProduct.name}</p>
                  <p className="text-xs text-muted-foreground">₹{reviewingProduct.price.toLocaleString()}</p>
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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ReviewsView;
