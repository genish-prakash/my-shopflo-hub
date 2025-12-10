import { useState, useMemo } from "react";
import { Heart, Bell, BellOff, Compass, Clock, ShoppingBag, Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import SearchSortFilter from "@/components/SearchSortFilter";
import { formatDistanceToNow } from "date-fns";

const mockBrands = [
  { 
    id: "1", 
    name: "Nike Store", 
    logo: "🏃", 
    isFollowed: true, 
    notifications: true, 
    orders: 5,
    lastVisited: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    lastPurchased: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  { 
    id: "2", 
    name: "Apple Store", 
    logo: "🍎", 
    isFollowed: true, 
    notifications: true, 
    orders: 3,
    lastVisited: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    lastPurchased: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
  { 
    id: "3", 
    name: "Zara Fashion", 
    logo: "👔", 
    isFollowed: true, 
    notifications: false, 
    orders: 7,
    lastVisited: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    lastPurchased: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  { 
    id: "4", 
    name: "Sony Electronics", 
    logo: "🎧", 
    isFollowed: false, 
    notifications: false, 
    orders: 2,
    lastVisited: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    lastPurchased: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
  { 
    id: "5", 
    name: "Samsung Store", 
    logo: "📱", 
    isFollowed: true, 
    notifications: true, 
    orders: 4,
    lastVisited: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    lastPurchased: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
  },
  { 
    id: "6", 
    name: "Adidas Sports", 
    logo: "⚽", 
    isFollowed: false, 
    notifications: false, 
    orders: 1,
    lastVisited: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    lastPurchased: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
  },
];

// Mock engagement timeline data
const mockTimeline: Record<string, Array<{ type: 'visit' | 'purchase', date: Date, product?: string, price?: string }>> = {
  "1": [
    { type: 'visit', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { type: 'purchase', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), product: 'Air Max 270', price: '₹12,999' },
    { type: 'visit', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
    { type: 'visit', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { type: 'purchase', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), product: 'Running Shoes', price: '₹8,499' },
  ],
  "2": [
    { type: 'visit', date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { type: 'purchase', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), product: 'AirPods Pro', price: '₹24,900' },
    { type: 'visit', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
    { type: 'visit', date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
  ],
  "3": [
    { type: 'visit', date: new Date(Date.now() - 30 * 60 * 1000) },
    { type: 'purchase', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), product: 'Cotton Shirt', price: '₹2,499' },
    { type: 'visit', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { type: 'purchase', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), product: 'Denim Jeans', price: '₹3,999' },
    { type: 'visit', date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
  ],
};

const BrandsView = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("visited-desc");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<typeof mockBrands[0] | null>(null);

  const sortOptions = [
    { label: "Recently Visited", value: "visited-desc" },
    { label: "Oldest Visit", value: "visited-asc" },
    { label: "Recently Purchased", value: "purchased-desc" },
    { label: "Oldest Purchase", value: "purchased-asc" },
    { label: "Most Orders", value: "orders-desc" },
    { label: "Least Orders", value: "orders-asc" },
    { label: "Name: A-Z", value: "name-asc" },
    { label: "Name: Z-A", value: "name-desc" },
  ];

  const filterOptions = [
    { label: "Following", value: "following", count: 4 },
    { label: "Not Following", value: "not-following", count: 2 },
    { label: "Notifications On", value: "notifications-on", count: 3 },
  ];

  const filteredAndSortedBrands = useMemo(() => {
    // Search
    let filtered = mockBrands.filter((brand) => {
      const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (activeFilters.length > 0) {
        matchesFilter = activeFilters.every((filter) => {
          if (filter === "following") return brand.isFollowed;
          if (filter === "not-following") return !brand.isFollowed;
          if (filter === "notifications-on") return brand.notifications;
          return true;
        });
      }
      
      return matchesSearch && matchesFilter;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "visited-desc":
          return b.lastVisited.getTime() - a.lastVisited.getTime();
        case "visited-asc":
          return a.lastVisited.getTime() - b.lastVisited.getTime();
        case "purchased-desc":
          return b.lastPurchased.getTime() - a.lastPurchased.getTime();
        case "purchased-asc":
          return a.lastPurchased.getTime() - b.lastPurchased.getTime();
        case "orders-desc":
          return b.orders - a.orders;
        case "orders-asc":
          return a.orders - b.orders;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, sortBy, activeFilters]);

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Brands</h1>
        <p className="text-sm text-muted-foreground">Manage your favorite brands</p>
      </div>

      {/* Explore Brands Button */}
      <Button
        className="w-full mb-4 bg-gradient-primary text-primary-foreground hover:opacity-90 transition-smooth"
        onClick={() => navigate('/explore-brands')}
      >
        <Compass className="h-4 w-4 mr-2" />
        Explore Brands
      </Button>

      <SearchSortFilter
        searchPlaceholder="Search brands..."
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
        onFilterChange={setActiveFilters}
        activeFilters={activeFilters}
      />

      {filteredAndSortedBrands.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No brands found
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedBrands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth p-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Brand Logo */}
                <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center text-3xl flex-shrink-0">
                  {brand.logo}
                </div>

                {/* Brand Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">{brand.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Clock className="h-3 w-3" />
                    <span>Visited {formatDistanceToNow(brand.lastVisited, { addSuffix: true })}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {brand.orders} order{brand.orders !== 1 ? "s" : ""} placed
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 items-end">
                  <Button
                    variant={brand.isFollowed ? "default" : "outline"}
                    size="sm"
                    className={
                      brand.isFollowed
                        ? "bg-gradient-primary hover:opacity-90"
                        : ""
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${brand.isFollowed ? "fill-current mr-1.5" : "mr-1.5"}`}
                    />
                    Follow
                  </Button>
                </div>
              </div>

              {brand.isFollowed && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {brand.notifications ? (
                        <Bell className="h-4 w-4 text-primary" />
                      ) : (
                        <BellOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm text-foreground">
                        Notifications
                      </span>
                    </div>
                    <Switch checked={brand.notifications} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {brand.notifications
                      ? "You'll receive updates about offers and new products"
                      : "Turn on to get notified about offers and products"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Brand Detail Sheet */}
      <Sheet open={!!selectedBrand} onOpenChange={(open) => !open && setSelectedBrand(null)}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          {selectedBrand && (
            <>
              <SheetHeader className="text-left pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-secondary flex items-center justify-center text-4xl">
                      {selectedBrand.logo}
                    </div>
                    <div>
                      <SheetTitle className="text-2xl">{selectedBrand.name}</SheetTitle>
                      <SheetDescription className="text-base mt-1">
                        {selectedBrand.orders} total orders • Member since Jan 2024
                      </SheetDescription>
                    </div>
                  </div>
                  <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </div>
              </SheetHeader>

              <Separator className="my-4" />

              {/* Engagement Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Last Visit</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDistanceToNow(selectedBrand.lastVisited, { addSuffix: true })}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="h-4 w-4 text-accent" />
                    <span className="text-xs text-muted-foreground">Last Purchase</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDistanceToNow(selectedBrand.lastPurchased, { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Engagement Timeline</h3>
                
                <div className="relative space-y-6 pl-6">
                  {/* Timeline line */}
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
                  
                  {mockTimeline[selectedBrand.id]?.map((event, index) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-[26px] top-1 h-4 w-4 rounded-full border-2 border-background ${
                        event.type === 'purchase' 
                          ? 'bg-accent' 
                          : 'bg-primary'
                      }`} />
                      
                      <div className="bg-card rounded-lg p-4 shadow-card">
                        <div className="flex items-start gap-3">
                          {event.type === 'purchase' ? (
                            <ShoppingBag className="h-5 w-5 text-accent mt-0.5" />
                          ) : (
                            <Eye className="h-5 w-5 text-primary mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-foreground">
                                {event.type === 'purchase' ? 'Purchased' : 'Visited Store'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(event.date, { addSuffix: true })}
                              </span>
                            </div>
                            {event.type === 'purchase' && (
                              <div className="mt-2">
                                <p className="text-sm text-foreground font-medium">{event.product}</p>
                                <p className="text-sm text-primary font-semibold">{event.price}</p>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.date.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BrandsView;
