import { useState, useMemo } from "react";
import { Gift, Clock, Tag, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SearchSortFilter from "@/components/SearchSortFilter";

const mockOffers = [
  {
    id: "1",
    brand: "Nike Store",
    logo: "🏃",
    title: "Extra 20% Off on Sports Shoes",
    description: "Valid on orders above ₹5,999",
    code: "NIKE20",
    validTill: "Jan 31, 2024",
    discount: "20% OFF",
    type: "Exclusive",
    category: "Fashion",
  },
  {
    id: "2",
    brand: "Apple Store",
    logo: "🍎",
    title: "₹2,000 Instant Discount",
    description: "On AirPods and Apple Watch",
    code: "APPLE2K",
    validTill: "Feb 15, 2024",
    discount: "₹2,000",
    type: "Limited",
    category: "Electronics",
  },
  {
    id: "3",
    brand: "Zara Fashion",
    logo: "👔",
    title: "Buy 2 Get 1 Free",
    description: "On all casual wear",
    code: "ZARA3FOR2",
    validTill: "Jan 25, 2024",
    discount: "BOGO",
    type: "Hot Deal",
    category: "Fashion",
  },
  {
    id: "4",
    brand: "Sony Electronics",
    logo: "🎧",
    title: "Flat 15% Cashback",
    description: "Maximum cashback ₹1,500",
    code: "SONY15",
    validTill: "Feb 28, 2024",
    discount: "15% CB",
    type: "Cashback",
    category: "Electronics",
  },
];

const OffersView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("validity-asc");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const sortOptions = [
    { label: "Expiring Soon", value: "validity-asc" },
    { label: "Latest First", value: "validity-desc" },
    { label: "Brand: A-Z", value: "brand-asc" },
    { label: "Brand: Z-A", value: "brand-desc" },
  ];

  const filterOptions = [
    { label: "Exclusive", value: "Exclusive", count: 1 },
    { label: "Limited", value: "Limited", count: 1 },
    { label: "Hot Deal", value: "Hot Deal", count: 1 },
    { label: "Cashback", value: "Cashback", count: 1 },
    { label: "Fashion", value: "Fashion", count: 2 },
    { label: "Electronics", value: "Electronics", count: 2 },
  ];

  const filteredAndSortedOffers = useMemo(() => {
    // Search
    let filtered = mockOffers.filter((offer) => {
      const matchesSearch =
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilters.length === 0 ||
        activeFilters.some(
          (filter) => offer.type === filter || offer.category === filter
        );

      return matchesSearch && matchesFilter;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.validTill).getTime();
      const dateB = new Date(b.validTill).getTime();

      switch (sortBy) {
        case "validity-asc":
          return dateA - dateB;
        case "validity-desc":
          return dateB - dateA;
        case "brand-asc":
          return a.brand.localeCompare(b.brand);
        case "brand-desc":
          return b.brand.localeCompare(a.brand);
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, sortBy, activeFilters]);

  const getOfferTypeColor = (type: string) => {
    switch (type) {
      case "Exclusive":
        return "bg-primary text-primary-foreground";
      case "Limited":
        return "bg-destructive text-destructive-foreground";
      case "Hot Deal":
        return "bg-warning text-warning-foreground";
      case "Cashback":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Offers</h1>
        <p className="text-sm text-muted-foreground">Personalized deals across all brands</p>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-accent rounded-xl p-6 mb-6 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-accent-foreground" />
            <span className="font-semibold text-accent-foreground">Special Offer</span>
          </div>
          <Badge className="bg-accent-foreground text-accent">New</Badge>
        </div>
        <h3 className="text-xl font-bold text-accent-foreground mb-2">
          Get 500 Points on Profile Completion
        </h3>
        <p className="text-sm text-accent-foreground opacity-90 mb-4">
          Complete your profile to unlock bonus points and exclusive rewards
        </p>
        <Button variant="secondary" size="sm">
          Complete Now
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <SearchSortFilter
        searchPlaceholder="Search offers..."
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
        onFilterChange={setActiveFilters}
        activeFilters={activeFilters}
      />

      {/* Offers List */}
      {filteredAndSortedOffers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No offers found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth overflow-hidden"
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                      {offer.logo}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {offer.brand}
                      </p>
                      <Badge className={getOfferTypeColor(offer.type)}>
                        {offer.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {offer.discount}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-foreground mb-2">{offer.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {offer.description}
                </p>

                {/* Code and Validity */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <code className="px-2 py-1 bg-secondary rounded text-sm font-mono font-bold text-foreground">
                      {offer.code}
                    </code>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{offer.validTill}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full mt-3 bg-gradient-primary hover:opacity-90"
                  size="sm"
                >
                  Apply Offer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersView;
