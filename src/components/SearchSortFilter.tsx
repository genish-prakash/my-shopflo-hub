import { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface SearchSortFilterProps {
  searchPlaceholder?: string;
  sortOptions: Array<{ label: string; value: string }>;
  filterOptions?: Array<{ label: string; value: string; count?: number }>;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onFilterChange?: (values: string[]) => void;
  activeFilters?: string[];
}

const SearchSortFilter = ({
  searchPlaceholder = "Search...",
  sortOptions,
  filterOptions,
  onSearchChange,
  onSortChange,
  onFilterChange,
  activeFilters = [],
}: SearchSortFilterProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(sortOptions[0]?.value || "");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    onSortChange(value);
  };

  const handleFilterToggle = (value: string) => {
    if (!onFilterChange) return;
    
    const newFilters = activeFilters.includes(value)
      ? activeFilters.filter((f) => f !== value)
      : [...activeFilters, value];
    
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    if (onFilterChange) {
      onFilterChange([]);
    }
  };

  const activeSort = sortOptions.find((opt) => opt.value === sortValue);

  return (
    <div className="space-y-3 mb-4">
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">{activeSort?.label || "Sort"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={sortValue === option.value ? "bg-accent" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter */}
        {filterOptions && filterOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 relative">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                {activeFilters.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Filter By</span>
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleFilterToggle(option.value)}
                  className="flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  <div className="flex items-center gap-2">
                    {option.count !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {option.count}
                      </span>
                    )}
                    {activeFilters.includes(option.value) && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => {
            const option = filterOptions?.find((opt) => opt.value === filter);
            return (
              <Badge
                key={filter}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleFilterToggle(filter)}
              >
                {option?.label}
                <span className="text-xs">×</span>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchSortFilter;
