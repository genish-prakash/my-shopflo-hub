import { useState, useMemo, useEffect } from "react";
import {
  ChevronRight,
  X,
  MapPin,
  Package,
  Star,
  Check,
  Circle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { ordersApi } from "@/services/mystique";
import type { Order } from "@/services/mystique";

type FilterType = "placed" | "delivered";

interface TimelineStep {
  status: string;
  date: string | null;
  completed: boolean;
}

interface OrderUI {
  id: string;
  uid: string;
  brand: string;
  brandLogo: string;
  product: string;
  shopName: string;
  orderDate: string;
  status: string;
  price: string;
  productImage: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  timeline: TimelineStep[];
  rawAmount: number;
  trackingUrl: string | null;
}

// Helper function to format timestamp to readable date
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper function to get status display name
const getStatusDisplay = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "Processing",
    PROCESSING: "Processing",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    IN_TRANSIT: "In Transit",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    COMPLETED: "Delivered",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  };
  return statusMap[status] || status;
};

// Helper function to format address from destination object
const formatAddress = (destination: any): string => {
  if (!destination) return "Address not available";

  const parts = [
    destination.name,
    destination.address1,
    destination.address2,
    destination.city,
    destination.province,
    destination.zip,
    destination.country,
  ].filter((part) => part && part.trim() !== "");

  return parts.length > 0 ? parts.join(", ") : "Address not available";
};

// Helper function to generate timeline based on order status
const generateTimeline = (order: Order): TimelineStep[] => {
  const allSteps = [
    "Order Placed",
    "Confirmed",
    "Shipped",
    "In Transit",
    "Out for Delivery",
    "Delivered",
  ];

  const statusIndex: Record<string, number> = {
    PENDING: 0,
    PROCESSING: 0,
    CONFIRMED: 1,
    SHIPPED: 2,
    IN_TRANSIT: 3,
    OUT_FOR_DELIVERY: 4,
    DELIVERED: 5,
    COMPLETED: 5,
  };

  const currentIndex = statusIndex[order.status] ?? 0;
  const orderDate = formatDate(order.created_at);

  return allSteps.map((step, index) => ({
    status: step,
    date: index <= currentIndex ? (index === 0 ? orderDate : null) : null,
    completed: index <= currentIndex,
  }));
};

// Transform API order to UI order
const transformOrderToUI = (order: any): OrderUI => {
  const placeholderImage =
    "https://placehold.co/100x100/e2e8f0/64748b?text=Product";

  // Get first product image for order thumbnail, or use placeholder
  const firstItemImage = order.line_items?.[0]?.image || placeholderImage;

  // Transform line items to UI format
  const items = order.line_items?.map((item: any) => ({
    name: item.product_name || "Product",
    quantity: item.quantity || 1,
    price: item.price || 0,
    image: item.image || placeholderImage,
  })) || [
    {
      name: order.shop_name || "Order",
      quantity: 1,
      price: order.amount,
      image: placeholderImage,
    },
  ];

  // Generate product description from line items
  const productDescription =
    order.line_items?.length > 0
      ? order.line_items.length === 1
        ? order.line_items[0].product_name ||
          `Order ${order.uid.substring(0, 8)}`
        : `${order.line_items.length} items`
      : `Order ${order.uid.substring(0, 8)}`;

  return {
    id: order.uid,
    uid: order.uid,
    brand: order.shop_name || order.merchant_id,
    brandLogo:
      order.merchant_logo ||
      `https://logo.clearbit.com/${order.merchant_id}.com`,
    product: productDescription,
    shopName: order.shop_name || "Shop",
    orderDate: formatDate(order.created_at),
    status: getStatusDisplay(order.status),
    price: `₹${order.amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    productImage: firstItemImage,
    address: formatAddress(order.tracking?.metadata?.destination),
    items: items,
    timeline: generateTimeline(order),
    rawAmount: order.amount,
    trackingUrl: order.tracking_url || null,
  };
};

const OrdersView = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("placed");
  const [selectedOrder, setSelectedOrder] = useState<OrderUI | null>(null);
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch orders on component mount and when page or filter changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (page === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const response = await ordersApi.getOrders(page, 20);
        const transformedOrders = response.items.map(transformOrderToUI);

        if (page === 0) {
          setOrders(transformedOrders);
        } else {
          setOrders((prev) => [...prev, ...transformedOrders]);
        }

        // Check if there are more items to load
        setHasMore(response.items.length === 20);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
        if (page === 0) {
          setOrders([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchOrders();
  }, [page, activeFilter]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      // Check if we're near the bottom of the page
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (
        scrollTop + clientHeight >= scrollHeight - 200 &&
        !loadingMore &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, loading, hasMore]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(0);
    setHasMore(true);
  }, [activeFilter]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "delivered") {
      // Show only delivered/completed orders
      return orders.filter((order) => order.status === "Delivered");
    }
    // Show only non-delivered orders (Processing, Cancelled, Shipped, etc.)
    return orders.filter((order) => order.status !== "Delivered");
  }, [activeFilter, orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Transit":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Confirmed":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "Refunded":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filters = [
    { id: "placed" as FilterType, label: "Orders Placed" },
    { id: "delivered" as FilterType, label: "Delivered" },
  ];

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
        <h1 className="text-xl font-semibold text-foreground">Orders</h1>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 mb-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
              activeFilter === filter.id
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-xl"
          >
            Retry
          </Button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No orders found
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-card rounded-2xl p-4 cursor-pointer hover:bg-muted/30 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                {/* Brand Logo */}
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={order.brandLogo}
                    alt={order.shopName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/100x100/e2e8f0/64748b?text=Shop";
                    }}
                  />
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground text-sm">
                      Order {order.uid.substring(0, 6)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {order.shopName}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {order.price}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* No More Items */}
      {!loading && !loadingMore && !hasMore && orders.length > 0 && (
        <div className="text-center py-6 text-sm text-muted-foreground">
          No more orders to load
        </div>
      )}

      {/* Order Detail Sheet */}
      <Sheet
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <SheetContent
          side="bottom"
          className="h-[85vh] rounded-t-3xl p-0 overflow-hidden"
        >
          {selectedOrder && (
            <div className="h-full flex flex-col overflow-y-auto">
              {/* Header */}
              <SheetHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                      <img
                        src={selectedOrder.productImage}
                        alt={selectedOrder.product}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/100x100/e2e8f0/64748b?text=Order";
                        }}
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        Order {selectedOrder.uid.substring(0, 6)}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {selectedOrder.product}
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

              <div className="flex-1 p-4 space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(selectedOrder.status)}`}
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>

                {/* Delivery Timeline */}
                <div className="bg-muted/30 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">
                      Delivery Progress
                    </h3>
                    {selectedOrder.trackingUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-8 text-xs"
                        onClick={() =>
                          window.open(selectedOrder.trackingUrl!, "_blank")
                        }
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        Track
                      </Button>
                    )}
                  </div>
                  <div className="relative">
                    {selectedOrder.timeline.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 relative"
                      >
                        {/* Vertical dotted line */}
                        {index < selectedOrder.timeline.length - 1 && (
                          <div
                            className={`absolute left-[11px] top-6 w-0.5 h-[calc(100%-8px)] ${
                              step.completed &&
                              selectedOrder.timeline[index + 1]?.completed
                                ? "bg-green-500"
                                : "border-l-2 border-dashed border-muted-foreground/30"
                            }`}
                          />
                        )}

                        {/* Status circle */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                            step.completed
                              ? "bg-green-500 text-white"
                              : "bg-muted border-2 border-muted-foreground/30"
                          }`}
                        >
                          {step.completed ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Circle className="w-2 h-2 text-muted-foreground/50" />
                          )}
                        </div>

                        {/* Status text and date */}
                        <div
                          className={`flex-1 pb-6 ${
                            index === selectedOrder.timeline.length - 1
                              ? "pb-0"
                              : ""
                          }`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              step.completed
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.status}
                          </p>
                          {step.date && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {step.date}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-muted/30 rounded-2xl p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Products Purchased
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="bg-card rounded-xl p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://placehold.co/100x100/e2e8f0/64748b?text=Product";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-foreground mt-1">
                              ₹{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-muted/30 rounded-2xl p-4">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.address}
                  </p>
                </div>

                {/* Order Summary */}
                <div className="bg-muted/30 rounded-2xl p-4">
                  <h3 className="font-semibold text-foreground mb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">
                        {selectedOrder.price}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">
                          Total
                        </span>
                        <span className="font-semibold text-foreground">
                          {selectedOrder.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrdersView;
