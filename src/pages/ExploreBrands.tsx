import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  Grid3x3,
  List,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchSortFilter from "@/components/SearchSortFilter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { discoverApi } from "@/services/mystique";
import type { DiscoverBrand } from "@/services/mystique/types";

const ExploreBrands = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [brands, setBrands] = useState<DiscoverBrand[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastBrandElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await discoverApi.getDiscoverBrands(page, 10);
      setBrands((prev) => {
        // Filter out duplicates based on ID
        const newBrands = response.brands.filter(
          (newBrand) =>
            !prev.some((existingBrand) => existingBrand.id === newBrand.id)
        );
        return [...prev, ...newBrands];
      });
      setHasMore(response.has_more);
    } catch (error) {
      console.error("Failed to fetch brands", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [page]);

  const sortOptions = [
    { label: "Name: A-Z", value: "name-asc" },
    { label: "Name: Z-A", value: "name-desc" },
  ];

  const filterOptions = [
    { label: "Fashion", value: "Fashion", count: 0 },
    { label: "Electronics", value: "Electronics", count: 0 },
    { label: "Marketplace", value: "Marketplace", count: 0 },
    { label: "Following", value: "following", count: 0 },
  ];

  const filteredAndSortedBrands = brands
    .filter((brand) => {
      const matchesSearch = brand.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      let matchesFilter = true;
      if (activeFilters.length > 0) {
        matchesFilter = activeFilters.some((filter) => {
          if (filter === "following") return brand.is_followed;
          return brand.category === filter;
        });
      }

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-16">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Explore Brands
            </h1>
            <p className="text-xs text-muted-foreground">
              {filteredAndSortedBrands.length} brands
            </p>
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
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "grid" | "list")}
          >
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
        {brands.length === 0 && !loading ? (
          <div className="text-center py-12 text-muted-foreground">
            No brands found
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-3"
            }
          >
            {filteredAndSortedBrands.map((brand, index) => {
              const isLastElement =
                index === filteredAndSortedBrands.length - 1;
              return (
                <div
                  key={brand.id}
                  ref={isLastElement ? lastBrandElementRef : null}
                  className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth p-4 flex flex-col"
                >
                  <div
                    className={`flex ${
                      viewMode === "grid"
                        ? "flex-col items-center text-center space-y-3"
                        : "items-center gap-4"
                    }`}
                  >
                    <div
                      className={`${
                        viewMode === "grid" ? "h-20 w-20" : "h-14 w-14"
                      } rounded-2xl bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0`}
                    >
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{brand.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">
                        {brand.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {brand.category}
                      </Badge>
                      {brand.tagline && viewMode === "list" && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {brand.tagline}
                        </p>
                      )}
                    </div>
                    <div
                      className={`flex gap-2 ${
                        viewMode === "grid" ? "w-full" : ""
                      }`}
                    >
                      <Button
                        variant={brand.is_followed ? "default" : "outline"}
                        size="sm"
                        className={`flex-1 ${
                          brand.is_followed ? "bg-gradient-primary" : ""
                        }`}
                      >
                        <Heart
                          className={`h-3 w-3 mr-1 ${
                            brand.is_followed ? "fill-current" : ""
                          }`}
                        />
                        {brand.is_followed ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </div>

                  {/* Products Preview */}
                  {brand.products && brand.products.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Popular Products
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {brand.products.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex-shrink-0 w-20">
                            <div className="h-20 w-20 rounded-lg bg-secondary mb-1 overflow-hidden">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <p className="text-[10px] font-medium truncate">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              ₹{product.price}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreBrands;
