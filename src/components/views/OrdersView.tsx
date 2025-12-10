import { useState, useMemo } from "react";
import { ChevronRight, X, MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";

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
    address: "123 MG Road, Bangalore, Karnataka 560001",
    items: [
      { name: "Air Max 270 React - Black/White", quantity: 1, price: 12999, image: "👟" },
    ],
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
    address: "456 Park Street, Mumbai, Maharashtra 400001",
    items: [
      { name: "AirPods Pro (2nd Generation)", quantity: 1, price: 24900, image: "🎧" },
    ],
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
    address: "789 Brigade Road, Bangalore, Karnataka 560025",
    items: [
      { name: "Premium Cotton Shirt - Blue", quantity: 1, price: 2499, image: "👔" },
    ],
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
    address: "321 Cyber City, Gurgaon, Haryana 122002",
    items: [
      { name: "Galaxy Buds Pro - Black", quantity: 1, price: 9999, image: "🎧" },
    ],
  },
];

const OrdersView = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("placed");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

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
    <div className="pb-24 px-4 pt-4" style={{ background: 'linear-gradient(180deg, rgba(101, 53, 255, 0.08) 0%, transparent 30%)' }}>
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
      {filteredOrders.length === 0 ? (
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
                    alt={order.brand}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl">${order.productImage}</span>`;
                    }}
                  />
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

      {/* Order Detail Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
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
                        src={selectedOrder.brandLogo} 
                        alt={selectedOrder.brand}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{selectedOrder.id}</span>
                      <p className="text-xs text-muted-foreground">{selectedOrder.brand}</p>
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
                  <Badge variant="outline" className={`${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </Badge>
                </div>

                {/* Order Items */}
                <div className="bg-muted/30 rounded-2xl p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-card rounded-xl p-3">
                        <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-3xl">
                          {item.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">₹{item.price.toLocaleString()}</p>
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
                  <p className="text-sm text-muted-foreground">{selectedOrder.address}</p>
                </div>

                {/* Order Summary */}
                <div className="bg-muted/30 rounded-2xl p-4">
                  <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">{selectedOrder.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-semibold text-foreground">{selectedOrder.price}</span>
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