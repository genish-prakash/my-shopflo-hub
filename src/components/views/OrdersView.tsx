import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ContactDialog from "@/components/ContactDialog";
import SearchSortFilter from "@/components/SearchSortFilter";
import { toast } from "sonner";

const mockOrders = [
  {
    id: "1",
    brand: "Nike Store",
    brandLogo: "🏃",
    product: "Air Max 270 React",
    orderDate: "2024-01-15",
    status: "In Transit",
    estimatedDelivery: "Jan 20, 2024",
    trackingSteps: 3,
    totalSteps: 4,
    price: "₹12,999",
  },
  {
    id: "2",
    brand: "Apple Store",
    brandLogo: "🍎",
    product: "AirPods Pro (2nd Gen)",
    orderDate: "2024-01-10",
    status: "Delivered",
    estimatedDelivery: "Jan 13, 2024",
    trackingSteps: 4,
    totalSteps: 4,
    price: "₹24,900",
  },
  {
    id: "3",
    brand: "Zara Fashion",
    brandLogo: "👔",
    product: "Premium Cotton Shirt",
    orderDate: "2024-01-18",
    status: "Processing",
    estimatedDelivery: "Jan 22, 2024",
    trackingSteps: 1,
    totalSteps: 4,
    price: "₹2,499",
  },
];

const OrdersView = () => {
  const navigate = useNavigate();
  const [contactDialog, setContactDialog] = useState<{ open: boolean; brand: string; orderId: string }>({
    open: false,
    brand: "",
    orderId: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const sortOptions = [
    { label: "Recent Orders", value: "date-desc" },
    { label: "Oldest Orders", value: "date-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Price: Low to High", value: "price-asc" },
  ];

  const filterOptions = [
    { label: "Delivered", value: "status-delivered", count: 1 },
    { label: "In Transit", value: "status-in-transit", count: 1 },
    { label: "Processing", value: "status-processing", count: 1 },
    { label: "Nike", value: "brand-nike", count: 1 },
    { label: "Apple", value: "brand-apple", count: 1 },
    { label: "Zara", value: "brand-zara", count: 1 },
    { label: "Under ₹5,000", value: "price-0-5000", count: 1 },
    { label: "₹5,000 - ₹20,000", value: "price-5000-20000", count: 1 },
    { label: "Above ₹20,000", value: "price-20000", count: 1 },
    { label: "Credit Card", value: "payment-card", count: 2 },
    { label: "UPI", value: "payment-upi", count: 0 },
    { label: "COD", value: "payment-cod", count: 1 },
  ];

  const filteredAndSortedOrders = useMemo(() => {
    // Search
    let filtered = mockOrders.filter((order) => {
      const matchesSearch = 
        order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.includes(searchQuery);
      
      const matchesFilter =
        activeFilters.length === 0 ||
        activeFilters.some((filter) => {
          if (filter.startsWith("status-")) {
            return order.status.toLowerCase().replace(" ", "-") === filter.replace("status-", "");
          }
          if (filter.startsWith("brand-")) {
            return order.brand.toLowerCase().includes(filter.replace("brand-", ""));
          }
          if (filter.startsWith("price-")) {
            const price = parseFloat(order.price.replace(/[₹,]/g, ""));
            if (filter === "price-0-5000") return price < 5000;
            if (filter === "price-5000-20000") return price >= 5000 && price <= 20000;
            if (filter === "price-20000") return price > 20000;
          }
          if (filter.startsWith("payment-")) {
            // Mock payment method - you can extend this based on actual data
            return true;
          }
          return false;
        });
      
      return matchesSearch && matchesFilter;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
      const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();

      switch (sortBy) {
        case "date-desc":
          return dateB - dateA;
        case "date-asc":
          return dateA - dateB;
        case "price-desc":
          return priceB - priceA;
        case "price-asc":
          return priceA - priceB;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, sortBy, activeFilters]);
  
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
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Orders</h1>
        <p className="text-sm text-muted-foreground">Track and manage your orders</p>
      </div>

      <SearchSortFilter
        searchPlaceholder="Search orders..."
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
        onFilterChange={setActiveFilters}
        activeFilters={activeFilters}
      />

      {filteredAndSortedOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No orders found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Brand Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                      {order.brandLogo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{order.brand}</h3>
                      <p className="text-xs text-muted-foreground">
                        Ordered on {order.orderDate}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>

                {/* Product Info */}
                <div className="flex gap-3">
                  <div className="h-20 w-20 rounded-lg bg-secondary flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{order.product}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{order.price}</p>
                    
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Order Progress</span>
                        <span>{order.trackingSteps}/{order.totalSteps}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary transition-smooth"
                          style={{ width: `${(order.trackingSteps / order.totalSteps) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    Expected by <span className="font-medium text-foreground">{order.estimatedDelivery}</span>
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  {order.status === "Delivered" ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => toast.info("Return process coming soon!")}
                      >
                        Return
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => toast.info("Refund tracking coming soon!")}
                      >
                        Track Refund
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setContactDialog({ open: true, brand: order.brand, orderId: order.id })}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Track Order
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setContactDialog({ open: true, brand: order.brand, orderId: order.id })}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ContactDialog
        open={contactDialog.open}
        onOpenChange={(open) => setContactDialog({ ...contactDialog, open })}
        brandName={contactDialog.brand}
        orderId={contactDialog.orderId}
      />
    </div>
  );
};

export default OrdersView;
