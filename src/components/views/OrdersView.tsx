import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type FilterType = "placed" | "delivered";

const mockOrders = [
  {
    id: "ORD-78234",
    brand: "Nike Store",
    brandLogo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
    product: "Air Max 270 React",
    orderDate: "2024-01-15",
    status: "In Transit",
    price: "₹12,999",
  },
  {
    id: "ORD-78235",
    brand: "Apple Store",
    brandLogo: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=100&h=100&fit=crop",
    product: "AirPods Pro (2nd Gen)",
    orderDate: "2024-01-10",
    status: "Delivered",
    price: "₹24,900",
  },
  {
    id: "ORD-78236",
    brand: "Zara Fashion",
    brandLogo: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=100&h=100&fit=crop",
    product: "Premium Cotton Shirt",
    orderDate: "2024-01-18",
    status: "Processing",
    price: "₹2,499",
  },
  {
    id: "ORD-78237",
    brand: "Samsung",
    brandLogo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop",
    product: "Galaxy Buds Pro",
    orderDate: "2024-01-05",
    status: "Delivered",
    price: "₹9,999",
  },
];

const OrdersView = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>("placed");

  const filteredOrders = useMemo(() => {
    if (activeFilter === "delivered") {
      return mockOrders.filter((order) => order.status === "Delivered");
    }
    return mockOrders.filter((order) => order.status !== "Delivered");
  }, [activeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-success/10 text-success border-success/20";
      case "In Transit":
        return "bg-primary/10 text-primary border-primary/20";
      case "Processing":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return "✓";
      case "In Transit":
        return "🚚";
      case "Processing":
        return "⏳";
      default:
        return "📦";
    }
  };

  const filters = [
    { id: "placed" as FilterType, label: "Orders Placed" },
    { id: "delivered" as FilterType, label: "Delivered" },
  ];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-card px-4 py-4 mb-2">
        <h1 className="text-xl font-bold text-foreground">Orders</h1>
      </div>

      {/* Quick Filters */}
      <div className="bg-card px-4 py-3 mb-2">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-card">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No orders found
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <div
              key={order.id}
              onClick={() => navigate(`/order/${order.id}`)}
              className={`flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                index !== filteredOrders.length - 1 ? "border-b border-border" : ""
              }`}
            >
              {/* Brand Logo */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary flex items-center justify-center shrink-0">
                {order.brandLogo ? (
                  <img 
                    src={order.brandLogo} 
                    alt={order.brand}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl">${getStatusIcon(order.status)}</span>`;
                    }}
                  />
                ) : (
                  <Package className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground text-sm">{order.id}</span>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{order.brand}</p>
                <p className="text-sm text-foreground font-medium">{order.price}</p>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersView;