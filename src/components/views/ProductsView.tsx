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
    { id: "9", name: "Gaming Mouse", brand: "Logitech", price: 4999, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop", viewedDate: "2024-01-20", isWishlisted: false },
    { id: "10", name: "Yoga Mat", brand: "Decathlon", price: 1999, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop", viewedDate: "2024-01-19", isWishlisted: false },
    { id: "11", name: "Bluetooth Speaker", brand: "JBL", price: 7499, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop", viewedDate: "2024-01-18", isWishlisted: true },
    { id: "12", name: "Sunglasses", brand: "Ray-Ban", price: 8999, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop", viewedDate: "2024-01-17", isWishlisted: false },
  ],
  wishlisted: [
    { id: "1", name: "Wireless Headphones", brand: "Sony", price: 8999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", addedDate: "2024-01-10" },
    { id: "2", name: "Smart Watch", brand: "Samsung", price: 15999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop", addedDate: "2024-01-12" },
    { id: "3", name: "Running Shoes", brand: "Adidas", price: 6499, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop", addedDate: "2024-01-08" },
    { id: "4", name: "Laptop Backpack", brand: "Dell", price: 2999, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop", addedDate: "2024-01-15" },
  ],
  purchased: [
    { id: "5", name: "Air Max 270 React", brand: "Nike", price: 12999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop", purchasedDate: "2024-01-05" },
    { id: "6", name: "AirPods Pro", brand: "Apple", price: 24900, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop", purchasedDate: "2023-12-20" },
    { id: "7", name: "Cotton Shirt", brand: "Zara", price: 2499, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop", purchasedDate: "2024-01-18" },
    { id: "8", name: "Leather Wallet", brand: "Fossil", price: 3999, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop", purchasedDate: "2024-01-10" },
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
    <div className="pb-24">
      {/* Header */}
      <div className="bg-card px-4 py-4 mb-2">
        <h1 className="text-xl font-bold text-foreground">Products</h1>
      </div>

      {/* Tabs */}
      <div className="bg-card px-4 py-3 mb-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
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
      </div>

      {/* Sort */}
      <div className="bg-card px-4 py-3 mb-2 flex items-center justify-between">
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
      <div className="bg-card">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {sortedProducts.map((product: any, index) => (
              <div
                key={product.id}
                className={`relative ${
                  index % 2 === 0 ? "border-r border-border" : ""
                } ${index < sortedProducts.length - 2 ? "border-b border-border" : ""}`}
              >
                {/* Product Image */}
                <div className="aspect-square bg-secondary">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                  <h3 className="font-medium text-sm text-foreground truncate mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-foreground">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>

                {/* Action Buttons */}
                {activeTab === "viewed" && (
                  <button
                    onClick={() => toggleWishlistViewed(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Heart
                      className={`w-4 h-4 transition-all ${
                        product.isWishlisted
                          ? "fill-red-500 text-red-500"
                          : "text-foreground"
                      }`}
                    />
                  </button>
                )}

                {activeTab === "wishlisted" && (
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                )}

                {activeTab === "purchased" && (
                  <Button 
                    size="sm" 
                    className="absolute top-3 right-3 h-7 text-xs rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background"
                  >
                    Reorder
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsView;