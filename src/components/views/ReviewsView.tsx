import { useState, useEffect } from "react";
import { ChevronRight, Star, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { toast } from "sonner";
import { authenticatedApi } from "@/services/authenticatedApi";

interface OrderItem {
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
  image: string;
  quantity: number;
  price: number;
  sku?: string;
}

interface ApiOrder {
  uid: string;
  merchant_id: string;
  shop_name: string;
  shop_domain: string;
  merchant_logo: string;
  status: string;
  amount: number;
  tracking_status?: string;
  tracking_url?: string;
  line_items: OrderItem[];
  created_at: number;
  order_name?: string;
}

interface DeliveredOrder {
  id: string;
  orderName: string;
  brand: string;
  brandLogo: string;
  deliveredDate: string;
  price: string;
  items: OrderItem[];
  merchant_id: string;
}

interface ProductReview {
  rating: number;
  review: string;
}

interface ApiReview {
  id: string;
  user_id: string;
  merchant_id: string;
  product_id: string;
  variant_id: string;
  order_id: string;
  rating: number;
  title: string;
  review_text: string;
  verified_purchase: boolean;
  helpful_count: number;
  images?: string[];
  created_at: string;
}

const ReviewsView = () => {
  const [deliveredOrders, setDeliveredOrders] = useState<DeliveredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DeliveredOrder | null>(
    null
  );
  const [reviewingProduct, setReviewingProduct] = useState<OrderItem | null>(
    null
  );
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [productReviews, setProductReviews] = useState<
    Record<string, ProductReview>
  >({});
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [orderReviews, setOrderReviews] = useState<ApiReview[]>([]);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await authenticatedApi.get<{
          success: boolean;
          data: { items: ApiOrder[] };
        }>("/orders?page=0&size=20");

        if (response.success && response.data.items) {
          // Transform API orders to UI format
          const transformedOrders: DeliveredOrder[] = response.data.items
            .filter(
              (order: ApiOrder) =>
                order.status === "COMPLETED" &&
                order.tracking_status === "delivered"
            )
            .map((order: ApiOrder) => ({
              id: order.uid,
              orderName: order.order_name || `#${order.uid.substring(0, 8)}`,
              brand: order.shop_name,
              brandLogo: order.merchant_logo,
              deliveredDate: new Date(order.created_at).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              ),
              price: `₹${order.amount.toLocaleString("en-IN")}`,
              items: order.line_items,
              merchant_id: order.merchant_id,
            }));

          setDeliveredOrders(transformedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fetch reviews for a specific order
  const fetchOrderReviews = async (orderId: string) => {
    try {
      setLoadingReviews(true);
      const response = await authenticatedApi.get<{
        success: boolean;
        data: ApiReview[];
      }>(`/mystique/api/v1/reviews/order/${orderId}`);

      if (response.success && response.data) {
        setOrderReviews(response.data);

        // Update productReviews state with fetched reviews
        const reviewsMap: Record<string, ProductReview> = {};
        response.data.forEach((review: ApiReview) => {
          const productKey = `${review.product_id}_${review.variant_id}`;
          reviewsMap[productKey] = {
            rating: review.rating,
            review: review.review_text,
          };
        });
        setProductReviews((prev) => ({ ...prev, ...reviewsMap }));
      }
    } catch (error) {
      console.error("Error fetching order reviews:", error);
      // Don't show error toast as it's not critical - order can still be viewed
    } finally {
      setLoadingReviews(false);
    }
  };

  const openOrderSheet = (order: DeliveredOrder) => {
    setSelectedOrder(order);
    setCurrentOrderId(order.id);
    // Fetch reviews for this order
    fetchOrderReviews(order.id);
  };

  const startReview = (product: OrderItem) => {
    const productKey = `${product.product_id}_${product.variant_id}`;
    const existingReview = productReviews[productKey];
    setReviewingProduct(product);
    setReviewRating(existingReview?.rating || 0);
    setReviewText(existingReview?.review || "");
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (reviewingProduct && selectedOrder) {
      try {
        setSubmittingReview(true);

        // Submit review to API
        const reviewData = {
          merchant_id: selectedOrder.merchant_id,
          product_id: reviewingProduct.product_id,
          variant_id: reviewingProduct.variant_id,
          order_id: currentOrderId,
          rating: reviewRating,
          title: reviewText ? reviewText.substring(0, 50) : "Good product",
          review_text: reviewText,
          images: [],
        };

        await authenticatedApi.post("/mystique/api/v1/reviews", reviewData);

        // Update local state
        const productKey = `${reviewingProduct.product_id}_${reviewingProduct.variant_id}`;
        setProductReviews((prev) => ({
          ...prev,
          [productKey]: {
            rating: reviewRating,
            review: reviewText,
          },
        }));

        toast.success("Review submitted successfully!");
        setReviewingProduct(null);
        setReviewRating(0);
        setReviewText("");
      } catch (error) {
        console.error("Error submitting review:", error);
        toast.error("Failed to submit review. Please try again.");
      } finally {
        setSubmittingReview(false);
      }
    }
  };

  const getReviewedCount = (order: DeliveredOrder) => {
    return order.items.filter((item) => {
      const productKey = `${item.product_id}_${item.variant_id}`;
      return productReviews[productKey];
    }).length;
  };

  return (
    <div
      className="pb-24 px-4 pt-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(101, 53, 255, 0.08) 0%, transparent 30%)",
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-foreground">Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Rate your delivered orders
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">
            Loading your orders...
          </p>
        </div>
      ) : deliveredOrders.length === 0 ? (
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
                <div className="space-y-3">
                  {/* Top Row - Brand Info & Order ID */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Brand Logo */}
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={order.brandLogo}
                          alt={order.brand}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground text-sm">
                          {order.brand}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Delivered on {order.deliveredDate}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {order.orderName}
                    </span>
                  </div>

                  {/* Review Status & Arrow */}
                  <div className="flex items-center justify-end gap-2">
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Products Sheet */}
      <Sheet
        open={!!selectedOrder && !reviewingProduct}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
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
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        {selectedOrder.brand}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {selectedOrder.orderName}
                      </p>
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

                {loadingReviews ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                    <span className="text-sm text-muted-foreground">
                      Loading reviews...
                    </span>
                  </div>
                ) : (
                  <>
                    {selectedOrder.items.map((item, index) => {
                      const productKey = `${item.product_id}_${item.variant_id}`;
                      const hasReview = productReviews[productKey];

                      return (
                        <div
                          key={index}
                          className="bg-muted/30 rounded-2xl p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl">📦</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {item.product_name}
                              </p>
                              {item.variant_name &&
                                item.variant_name !== "Default Title" && (
                                  <p className="text-xs text-muted-foreground">
                                    {item.variant_name}
                                  </p>
                                )}
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                              <p className="text-sm font-semibold text-foreground mt-1">
                                ₹{item.price.toLocaleString()}
                              </p>
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
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Review Input Sheet */}
      <Sheet
        open={!!reviewingProduct}
        onOpenChange={(open) => !open && setReviewingProduct(null)}
      >
        <SheetContent
          side="bottom"
          className="h-auto max-h-[85vh] rounded-t-3xl p-0 overflow-hidden"
        >
          {reviewingProduct && (
            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Rate & Review
                </h2>
                <button
                  onClick={() => setReviewingProduct(null)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-2xl">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center overflow-hidden">
                  {reviewingProduct.image ? (
                    <img
                      src={reviewingProduct.image}
                      alt={reviewingProduct.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm text-foreground">
                    {reviewingProduct.product_name}
                  </p>
                  {reviewingProduct.variant_name &&
                    reviewingProduct.variant_name !== "Default Title" && (
                      <p className="text-xs text-muted-foreground">
                        {reviewingProduct.variant_name}
                      </p>
                    )}
                  <p className="text-xs text-muted-foreground mt-1">
                    ₹{reviewingProduct.price.toLocaleString()}
                  </p>
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
                disabled={submittingReview}
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold disabled:opacity-50"
              >
                {submittingReview ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ReviewsView;
