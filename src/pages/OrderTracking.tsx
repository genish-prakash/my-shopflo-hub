import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, CheckCircle, Truck, Home, MapPin, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const mockOrderDetails = {
  "1": {
    id: "1",
    brand: "Nike Store",
    brandLogo: "🏃",
    product: "Air Max 270 React",
    orderDate: "2024-01-15",
    orderTime: "10:30 AM",
    status: "In Transit",
    estimatedDelivery: "Jan 20, 2024",
    price: "₹12,999",
    trackingNumber: "SHF1234567890",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    items: [
      { name: "Air Max 270 React - Black/White", quantity: 1, price: 12999 },
      { name: "Nike Sports Socks (Pack of 3)", quantity: 1, price: 799 },
    ],
    pricing: {
      subtotal: 13798,
      discount: 1299,
      tax: 500,
      deliveryCharges: 0,
      total: 12999,
    },
    payments: [
      {
        amount: 12999,
        mode: "UPI",
        status: "Success",
        time: "Jan 15, 2024, 10:30 AM",
        transactionId: "UPI202401151030",
      },
    ],
    timeline: [
      { status: "Order Placed", date: "Jan 15, 2024, 10:30 AM", completed: true, icon: CheckCircle },
      { status: "Order Confirmed", date: "Jan 15, 2024, 11:00 AM", completed: true, icon: Package },
      { status: "Shipped", date: "Jan 16, 2024, 2:00 PM", completed: true, icon: Truck },
      { status: "Out for Delivery", date: "Expected Jan 20, 2024", completed: false, icon: Truck },
      { status: "Delivered", date: "Pending", completed: false, icon: Home },
    ],
  },
  "2": {
    id: "2",
    brand: "Apple Store",
    brandLogo: "🍎",
    product: "AirPods Pro (2nd Gen)",
    orderDate: "2024-01-10",
    orderTime: "9:00 AM",
    status: "Delivered",
    estimatedDelivery: "Jan 13, 2024",
    price: "₹24,900",
    trackingNumber: "SHF0987654321",
    address: "456 Park Street, Mumbai, Maharashtra 400001",
    items: [
      { name: "AirPods Pro (2nd Generation)", quantity: 1, price: 24900 },
    ],
    pricing: {
      subtotal: 24900,
      discount: 0,
      tax: 0,
      deliveryCharges: 0,
      total: 24900,
    },
    payments: [
      {
        amount: 24900,
        mode: "Credit Card",
        status: "Failed",
        time: "Jan 10, 2024, 8:55 AM",
        transactionId: "CC202401100855",
        failureReason: "Insufficient funds",
      },
      {
        amount: 24900,
        mode: "Debit Card",
        status: "Awaiting Confirmation",
        time: "Jan 10, 2024, 9:00 AM",
        transactionId: "DC202401100900",
        message: "Do not retry",
      },
    ],
    timeline: [
      { status: "Order Placed", date: "Jan 10, 2024, 9:00 AM", completed: true, icon: CheckCircle },
      { status: "Order Confirmed", date: "Jan 10, 2024, 9:30 AM", completed: true, icon: Package },
      { status: "Shipped", date: "Jan 11, 2024, 3:00 PM", completed: true, icon: Truck },
      { status: "Out for Delivery", date: "Jan 13, 2024, 8:00 AM", completed: true, icon: Truck },
      { status: "Delivered", date: "Jan 13, 2024, 2:30 PM", completed: true, icon: Home },
    ],
  },
  "3": {
    id: "3",
    brand: "Zara Fashion",
    brandLogo: "👔",
    product: "Premium Cotton Shirt",
    orderDate: "2024-01-18",
    orderTime: "4:00 PM",
    status: "Processing",
    estimatedDelivery: "Jan 22, 2024",
    price: "₹2,499",
    trackingNumber: "SHF5678901234",
    address: "789 Brigade Road, Bangalore, Karnataka 560025",
    items: [
      { name: "Premium Cotton Shirt - Blue", quantity: 1, price: 2499 },
      { name: "Cotton Chinos - Beige", quantity: 1, price: 1999 },
    ],
    pricing: {
      subtotal: 4498,
      discount: 2099,
      tax: 100,
      deliveryCharges: 0,
      total: 2499,
    },
    payments: [
      {
        amount: 2499,
        mode: "Cash on Delivery",
        status: "Pending",
        time: "Payment on delivery",
        transactionId: "COD202401180400",
      },
    ],
    timeline: [
      { status: "Order Placed", date: "Jan 18, 2024, 4:00 PM", completed: true, icon: CheckCircle },
      { status: "Order Confirmed", date: "Pending", completed: false, icon: Package },
      { status: "Shipped", date: "Pending", completed: false, icon: Truck },
      { status: "Out for Delivery", date: "Expected Jan 22, 2024", completed: false, icon: Truck },
      { status: "Delivered", date: "Pending", completed: false, icon: Home },
    ],
  },
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const order = mockOrderDetails[orderId as keyof typeof mockOrderDetails];

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h2>
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
        return "bg-success text-success-foreground";
      case "In Transit":
        return "bg-primary text-primary-foreground";
      case "Processing":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-4 h-16 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Order Tracking</h1>
            <p className="text-xs text-muted-foreground">#{order.trackingNumber}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Order Info Card */}
        <div className="bg-card rounded-xl shadow-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                {order.brandLogo}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{order.brand}</h3>
                <p className="text-sm text-muted-foreground">{order.product}</p>
              </div>
            </div>
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Order Placed</p>
              <p className="text-sm font-medium text-foreground">{order.orderDate}</p>
              <p className="text-xs text-muted-foreground">{order.orderTime}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Delivery Address</p>
              <div className="flex gap-1">
                <MapPin className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-foreground line-clamp-2">{order.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl shadow-card p-4">
          <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-foreground">₹{item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₹{order.pricing.subtotal.toLocaleString()}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-success">-₹{order.pricing.discount.toLocaleString()}</span>
              </div>
            )}
            {order.pricing.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">₹{order.pricing.tax.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Charges</span>
              <span className="text-success">{order.pricing.deliveryCharges === 0 ? "FREE" : `₹${order.pricing.deliveryCharges}`}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Total Amount</span>
            <span className="text-lg font-bold text-foreground">₹{order.pricing.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-card rounded-xl shadow-card p-4">
          <h3 className="font-semibold text-foreground mb-4">Payment Details</h3>
          
          <div className="space-y-4">
            {order.payments.map((payment, index) => (
              <div key={index} className={`${index > 0 ? "pt-4 border-t border-border" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    payment.status === "Success" ? "bg-success/20" :
                    payment.status === "Failed" ? "bg-destructive/20" :
                    payment.status === "Pending" ? "bg-warning/20" :
                    "bg-primary/20"
                  }`}>
                    <CreditCard className={`h-5 w-5 ${
                      payment.status === "Success" ? "text-success" :
                      payment.status === "Failed" ? "text-destructive" :
                      payment.status === "Pending" ? "text-warning" :
                      "text-primary"
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-sm font-medium text-foreground">{payment.mode}</p>
                        <p className="text-xs text-muted-foreground">{payment.time}</p>
                      </div>
                      <Badge variant={
                        payment.status === "Success" ? "default" :
                        payment.status === "Failed" ? "destructive" :
                        "secondary"
                      }>
                        {payment.status}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">Transaction ID: {payment.transactionId}</span>
                      <span className="text-sm font-semibold text-foreground">₹{payment.amount.toLocaleString()}</span>
                    </div>
                    
                    {payment.failureReason && (
                      <p className="text-xs text-destructive mt-2">Reason: {payment.failureReason}</p>
                    )}
                    
                    {payment.message && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-warning/10 border border-warning/20 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-warning shrink-0" />
                        <p className="text-xs text-warning">{payment.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-card rounded-xl shadow-card p-4">
          <h3 className="font-semibold text-foreground mb-4">Tracking Timeline</h3>
          
          <div className="space-y-6">
            {order.timeline.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === order.timeline.length - 1;
              
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-smooth ${
                        step.completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 h-12 mt-2 transition-smooth ${
                          step.completed ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-4">
                    <h4
                      className={`font-medium mb-1 ${
                        step.completed ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.status}
                    </h4>
                    <p className="text-sm text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expected Delivery */}
        {order.status !== "Delivered" && (
          <div className="bg-gradient-primary/10 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Expected Delivery</p>
                <p className="text-lg font-semibold text-primary">{order.estimatedDelivery}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
