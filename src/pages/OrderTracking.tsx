import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, CheckCircle, Truck, Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockOrderDetails: Record<string, any> = {
  "ORD-78234": {
    id: "ORD-78234",
    brand: "Nike Store",
    brandLogo: "https://logo.clearbit.com/nike.com",
    product: "Air Max 270 React",
    orderDate: "Jan 15, 2024",
    status: "In Transit",
    price: "₹12,999",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    items: [
      { name: "Air Max 270 React - Black/White", quantity: 1, price: 12999, image: "👟" },
    ],
    timeline: [
      { status: "Order Placed", date: "Jan 15, 2024", completed: true, icon: CheckCircle },
      { status: "Order Confirmed", date: "Jan 15, 2024", completed: true, icon: Package },
      { status: "Shipped", date: "Jan 16, 2024", completed: true, icon: Truck },
      { status: "Out for Delivery", date: "Expected", completed: false, icon: Truck },
      { status: "Delivered", date: "Pending", completed: false, icon: Home },
    ],
  },
  "ORD-78235": {
    id: "ORD-78235",
    brand: "Apple Store",
    brandLogo: "https://logo.clearbit.com/apple.com",
    product: "AirPods Pro (2nd Gen)",
    orderDate: "Jan 10, 2024",
    status: "Delivered",
    price: "₹24,900",
    address: "456 Park Street, Mumbai, Maharashtra 400001",
    items: [
      { name: "AirPods Pro (2nd Generation)", quantity: 1, price: 24900, image: "🎧" },
    ],
    timeline: [
      { status: "Order Placed", date: "Jan 10, 2024", completed: true, icon: CheckCircle },
      { status: "Order Confirmed", date: "Jan 10, 2024", completed: true, icon: Package },
      { status: "Shipped", date: "Jan 11, 2024", completed: true, icon: Truck },
      { status: "Out for Delivery", date: "Jan 13, 2024", completed: true, icon: Truck },
      { status: "Delivered", date: "Jan 13, 2024", completed: true, icon: Home },
    ],
  },
  "ORD-78236": {
    id: "ORD-78236",
    brand: "Zara Fashion",
    brandLogo: "https://logo.clearbit.com/zara.com",
    product: "Premium Cotton Shirt",
    orderDate: "Jan 18, 2024",
    status: "Processing",
    price: "₹2,499",
    address: "789 Brigade Road, Bangalore, Karnataka 560025",
    items: [
      { name: "Premium Cotton Shirt - Blue", quantity: 1, price: 2499, image: "👔" },
    ],
    timeline: [
      { status: "Order Placed", date: "Jan 18, 2024", completed: true, icon: CheckCircle },
      { status: "Order Confirmed", date: "Pending", completed: false, icon: Package },
      { status: "Shipped", date: "Pending", completed: false, icon: Truck },
      { status: "Out for Delivery", date: "Expected", completed: false, icon: Truck },
      { status: "Delivered", date: "Pending", completed: false, icon: Home },
    ],
  },
  "ORD-78237": {
    id: "ORD-78237",
    brand: "Samsung",
    brandLogo: "https://logo.clearbit.com/samsung.com",
    product: "Galaxy Buds Pro",
    orderDate: "Jan 5, 2024",
    status: "Delivered",
    price: "₹9,999",
    address: "321 Cyber City, Gurgaon, Haryana 122002",
    items: [
      { name: "Galaxy Buds Pro - Black", quantity: 1, price: 9999, image: "🎧" },
    ],
    timeline: [
      { status: "Order Placed", date: "Jan 5, 2024", completed: true, icon: CheckCircle },
      { status: "Order Confirmed", date: "Jan 5, 2024", completed: true, icon: Package },
      { status: "Shipped", date: "Jan 6, 2024", completed: true, icon: Truck },
      { status: "Out for Delivery", date: "Jan 8, 2024", completed: true, icon: Truck },
      { status: "Delivered", date: "Jan 8, 2024", completed: true, icon: Home },
    ],
  },
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const order = mockOrderDetails[orderId as string];

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Order Not Found</h2>
          <Button onClick={() => navigate("/home")} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "In Transit":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="shrink-0 -ml-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground">{order.id}</h1>
          </div>
        </div>
      </div>

      {/* Order Card */}
      <div className="bg-card mx-4 mt-4 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0 flex items-center justify-center">
            <img 
              src={order.brandLogo} 
              alt={order.brand}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">{order.brand}</p>
            <p className="text-sm text-muted-foreground truncate">{order.product}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              <span className="text-sm font-semibold text-foreground">{order.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items with Images */}
      <div className="bg-card mx-4 mt-3 rounded-2xl p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Items
        </h3>
        
        <div className="space-y-3">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-3xl shrink-0">
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
      <div className="bg-card mx-4 mt-3 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Delivery Address</p>
            <p className="text-sm text-muted-foreground">{order.address}</p>
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-card mx-4 mt-3 rounded-2xl p-4">
        <h3 className="font-semibold text-foreground mb-4">Tracking</h3>
        
        <div className="space-y-0">
          {order.timeline.map((step: any, index: number) => {
            const Icon = step.icon;
            const isLast = index === order.timeline.length - 1;
            
            return (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 h-10 ${
                        step.completed ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
                
                <div className="pb-3">
                  <p
                    className={`text-sm font-medium ${
                      step.completed ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.status}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;