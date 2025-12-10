import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type FilterType = "placed" | "delivered";

const mockOrders = [
  {
    id: "ORD-78234",
    brand: "Nike Store",
    brandLogo: "https://logo.clearbit.com/nike.com",
    product: "Air Max 270 React",
    orderDate: "2024-01-15",
    status: "In Transit",
    price: "₹12,999",
    productImage: "👟",
  },
  {
    id: "ORD-78235",
    brand: "Apple Store",
    brandLogo: "https://logo.clearbit.com/apple.com",
    product: "AirPods Pro (2nd Gen)",
    orderDate: "2024-01-10",
    status: "Delivered",
    price: "₹24,900",
    productImage: "🎧",
  },
  {
    id: "ORD-78236",
    brand: "Zara Fashion",
    brandLogo: "https://logo.clearbit.com/zara.com",
    product: "Premium Cotton Shirt",
    orderDate: "2024-01-18",
    status: "Processing",
    price: "₹2,499",
    productImage: "👔",
  },
  {
    id: "ORD-78237",
    brand: "Samsung",
    brandLogo: "https://logo.clearbit.com/samsung.com",
    product: "Galaxy Buds Pro",
    orderDate: "2024-01-05",
    status: "Delivered",
    price: "₹9,999",
    productImage: "🎧",
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
        return "bg-green-100 text-green-700 border-green-200";
      case "In Transit":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filters = [
    { id: "placed" as FilterType, label: "Orders Placed" },
    { id: "delivered" as FilterType, label: "Delivered" },
  ];

  return (
    <div className="pb-24 px-4 pt-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
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
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No orders found
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/order/${order.id}`)}
              className="bg-card rounded-2xl p-4 cursor-pointer hover:bg-muted/30 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-3xl shrink-0">
                  {order.productImage}
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground text-sm">{order.id}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-1">{order.brand}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{order.price}</p>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(order.status)}`}>
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
    </div>
  );
};

export default OrdersView;