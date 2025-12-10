import { useState } from "react";
import { ArrowLeft, ExternalLink, Heart, Grid3x3, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchSortFilter from "@/components/SearchSortFilter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const allBrands = [
  { id: "1", name: "Nike Store", logo: "🏃", category: "Fashion", isFollowing: true, website: "https://nike.com" },
  { id: "2", name: "Apple Store", logo: "🍎", category: "Electronics", isFollowing: true, website: "https://apple.com" },
  { id: "3", name: "Zara Fashion", logo: "👔", category: "Fashion", isFollowing: true, website: "https://zara.com" },
  { id: "4", name: "Sony Electronics", logo: "🎧", category: "Electronics", isFollowing: false, website: "https://sony.com" },
  { id: "5", name: "Samsung Store", logo: "📱", category: "Electronics", isFollowing: true, website: "https://samsung.com" },
  { id: "6", name: "Adidas Sports", logo: "⚽", category: "Fashion", isFollowing: false, website: "https://adidas.com" },
  { id: "7", name: "Amazon", logo: "📦", category: "Marketplace", isFollowing: false, website: "https://amazon.com" },
  { id: "8", name: "H&M", logo: "👗", category: "Fashion", isFollowing: false, website: "https://hm.com" },
  { id: "9", name: "Dell", logo: "💻", category: "Electronics", isFollowing: false, website: "https://dell.com" },
  { id: "10", name: "Puma", logo: "🐆", category: "Fashion", isFollowing: false, website: "https://puma.com" },
  { id: "11", name: "HP", logo: "🖨️", category: "Electronics", isFollowing: false, website: "https://hp.com" },
  { id: "12", name: "Uniqlo", logo: "🧥", category: "Fashion", isFollowing: false, website: "https://uniqlo.com" },
];

const ExploreBrands = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sortOptions = [
    { label: "Name: A-Z", value: "name-asc" },
    { label: "Name: Z-A", value: "name-desc" },
  ];

  const filterOptions = [
    { label: "Fashion", value: "Fashion", count: 5 },
    { label: "Electronics", value: "Electronics", count: 5 },
    { label: "Marketplace", value: "Marketplace", count: 1 },
    { label: "Following", value: "following", count: 4 },
  ];

  const filteredAndSortedBrands = allBrands.filter((brand) => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilters.length > 0) {
      matchesFilter = activeFilters.some((filter) => {
        if (filter === "following") return brand.isFollowing;
        return brand.category === filter;
      });
    }
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-16">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Explore Brands</h1>
            <p className="text-xs text-muted-foreground">{filteredAndSortedBrands.length} brands</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <SearchSortFilter
            searchPlaceholder="Search brands..."
            sortOptions={sortOptions}
            filterOptions={filterOptions}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
            onFilterChange={setActiveFilters}
            activeFilters={activeFilters}
          />
        </div>

        {/* View Toggle */}
        <div className="mb-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
            <TabsList className="grid w-32 grid-cols-2">
              <TabsTrigger value="grid">
                <Grid3x3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Brands Display */}
        {filteredAndSortedBrands.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No brands found
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredAndSortedBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth p-4"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center text-5xl">
                    {brand.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{brand.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {brand.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(brand.website, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit
                    </Button>
                    <Button
                      variant={brand.isFollowing ? "default" : "outline"}
                      size="sm"
                      className={`flex-1 ${brand.isFollowing ? "bg-gradient-primary" : ""}`}
                    >
                      <Heart className={`h-3 w-3 mr-1 ${brand.isFollowing ? "fill-current" : ""}`} />
                      {brand.isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center text-3xl flex-shrink-0">
                    {brand.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">{brand.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {brand.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(brand.website, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit
                    </Button>
                    <Button
                      variant={brand.isFollowing ? "default" : "outline"}
                      size="sm"
                      className={brand.isFollowing ? "bg-gradient-primary" : ""}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${brand.isFollowing ? "fill-current" : ""}`} />
                      {brand.isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreBrands;
