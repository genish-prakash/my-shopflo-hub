import { useState, useMemo } from "react";
import { Heart, ShoppingBag, Eye, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TabType = "viewed" | "wishlisted" | "purchased";
type SortOption = "date-desc" | "date-asc" | "price-asc" | "price-desc";

const SORT_OPTIONS = [
  { value: "date-desc", label: "Recently Added" },
  { value: "date-asc", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low - High" },
  { value: "price-desc", label: "Price: High - Low" },
];

const mockProducts = {
  viewed: [
    { id: "9", name: "Gaming Mouse", brand: "Logitech", price: 4999, image: "🖱️", viewedDate: "2024-01-20", category: "Electronics", isWishlisted: false },
    { id: "10", name: "Yoga Mat", brand: "Decathlon", price: 1999, image: "🧘", viewedDate: "2024-01-19", category: "Sports", isWishlisted: false },
    { id: "11", name: "Bluetooth Speaker", brand: "JBL", price: 7499, image: "🔊", viewedDate: "2024-01-18", category: "Electronics", isWishlisted: true },
    { id: "12", name: "Sunglasses", brand: "Ray-Ban", price: 8999, image: "🕶️", viewedDate: "2024-01-17", category: "Fashion", isWishlisted: false },
    { id: "13", name: "Water Bottle", brand: "Milton", price: 799, image: "🥤", viewedDate: "2024-01-16", category: "Accessories", isWishlisted: false },
  ],
  wishlisted: [
    { id: "1", name: "Wireless Headphones", brand: "Sony", price: 8999, image: "🎧", addedDate: "2024-01-10", category: "Electronics" },
    { id: "2", name: "Smart Watch", brand: "Samsung", price: 15999, image: "⌚", addedDate: "2024-01-12", category: "Electronics" },
    { id: "3", name: "Running Shoes", brand: "Adidas", price: 6499, image: "👟", addedDate: "2024-01-08", category: "Fashion" },
    { id: "4", name: "Laptop Backpack", brand: "Dell", price: 2999, image: "🎒", addedDate: "2024-01-15", category: "Accessories" },
  ],
  purchased: [
    { id: "5", name: "Air Max 270 React", brand: "Nike", price: 12999, image: "👟", purchasedDate: "2024-01-05", category: "Fashion" },
    { id: "6", name: "AirPods Pro", brand: "Apple", price: 24900, image: "🎧", purchasedDate: "2023-12-20", category: "Electronics" },
    { id: "7", name: "Cotton Shirt", brand: "Zara", price: 2499, image: "👔", purchasedDate: "2024-01-18", category: "Fashion" },
    { id: "8", name: "Leather Wallet", brand: "Fossil", price: 3999, image: "👛", purchasedDate: "2024-01-10", category: "Accessories" },
  ],
};

const ProductsView = () => {
  const [activeTab, setActiveTab] = useState<TabType>("viewed");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [viewedProducts, setViewedProducts] = useState(mockProducts.viewed);
  const [wishlistedProducts, setWishlistedProducts] = useState(mockProducts.wishlisted);

  const toggleWishlistViewed = (productId: string) => {
    setViewedProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, isWishlisted: !p.isWishlisted } : p)
    );
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProducts = () => {
    switch (activeTab) {
      case "viewed":
        return viewedProducts;
      case "wishlisted":
        return wishlistedProducts;
      case "purchased":
        return mockProducts.purchased;
      default:
        return [];
    }
  };

  const sortedProducts = useMemo(() => {
    const products = [...getProducts()];
    
    return products.sort((a: any, b: any) => {
      const dateField = activeTab === "viewed" ? "viewedDate" : activeTab === "wishlisted" ? "addedDate" : "purchasedDate";
      const dateA = new Date(a[dateField]).getTime();
      const dateB = new Date(b[dateField]).getTime();

      switch (sortBy) {
        case "date-desc":
          return dateB - dateA;
        case "date-asc":
          return dateA - dateB;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [activeTab, sortBy, viewedProducts, wishlistedProducts]);

  const tabs = [
    { id: "viewed" as TabType, label: "Viewed", icon: Eye, count: viewedProducts.length },
    { id: "wishlisted" as TabType, label: "Wishlisted", icon: Heart, count: wishlistedProducts.length },
    { id: "purchased" as TabType, label: "Purchased", icon: ShoppingBag, count: mockProducts.purchased.length },
  ];

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Products</h1>
        <p className="text-sm text-muted-foreground">Your product activity</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? "bg-background/20" : "bg-foreground/10"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{sortedProducts.length} products</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full">
              {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card z-50">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className="flex items-center justify-between"
              >
                {option.label}
                {sortBy === option.value && <Check className="w-4 h-4 ml-2" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {sortedProducts.map((product: any) => (
            <div
              key={product.id}
              className="relative bg-card rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Price - Top Left */}
              <div className="absolute top-3 left-3 z-10">
                <span className="text-sm font-bold text-foreground bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>

              {/* Product Image */}
              <div className="aspect-square bg-secondary flex items-center justify-center text-6xl">
                {product.image}
              </div>

              {/* Product Info */}
              <div className="p-3 space-y-1">
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <h3 className="font-medium text-sm text-foreground truncate pr-8">
                  {product.name}
                </h3>
              </div>

              {/* Wishlist - Bottom Right */}
              {activeTab === "viewed" && (
                <button
                  onClick={() => toggleWishlistViewed(product.id)}
                  className="absolute bottom-3 right-3 p-1"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      product.isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground hover:text-red-400"
                    }`}
                  />
                </button>
              )}

              {activeTab === "wishlisted" && (
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute bottom-3 right-3 p-1"
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </button>
              )}

              {activeTab === "purchased" && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute bottom-3 right-3 h-7 text-xs rounded-full"
                >
                  Reorder
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsView;