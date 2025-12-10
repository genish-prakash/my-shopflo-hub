import { useState, useMemo } from "react";
import { Heart, ShoppingBag, X, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import SearchSortFilter from "@/components/SearchSortFilter";

const mockProducts = {
  viewed: [
    { id: "9", name: "Gaming Mouse", brand: "Logitech", price: "₹4,999", image: "🖱️", viewedDate: "2024-01-20", category: "Electronics" },
    { id: "10", name: "Yoga Mat", brand: "Decathlon", price: "₹1,999", image: "🧘", viewedDate: "2024-01-19", category: "Sports" },
    { id: "11", name: "Bluetooth Speaker", brand: "JBL", price: "₹7,499", image: "🔊", viewedDate: "2024-01-18", category: "Electronics" },
    { id: "12", name: "Sunglasses", brand: "Ray-Ban", price: "₹8,999", image: "🕶️", viewedDate: "2024-01-17", category: "Fashion" },
    { id: "13", name: "Water Bottle", brand: "Milton", price: "₹799", image: "🥤", viewedDate: "2024-01-16", category: "Accessories" },
  ],
  wishlisted: [
    { id: "1", name: "Wireless Headphones", brand: "Sony", price: "₹8,999", image: "🎧", addedDate: "2024-01-10", category: "Electronics" },
    { id: "2", name: "Smart Watch", brand: "Samsung", price: "₹15,999", image: "⌚", addedDate: "2024-01-12", category: "Electronics" },
    { id: "3", name: "Running Shoes", brand: "Adidas", price: "₹6,499", image: "👟", addedDate: "2024-01-08", category: "Fashion" },
    { id: "4", name: "Laptop Backpack", brand: "Dell", price: "₹2,999", image: "🎒", addedDate: "2024-01-15", category: "Accessories" },
  ],
  purchased: [
    { id: "5", name: "Air Max 270 React", brand: "Nike", price: "₹12,999", image: "👟", purchasedDate: "2024-01-05", category: "Fashion" },
    { id: "6", name: "AirPods Pro", brand: "Apple", price: "₹24,900", image: "🎧", purchasedDate: "2023-12-20", category: "Electronics" },
    { id: "7", name: "Cotton Shirt", brand: "Zara", price: "₹2,499", image: "👔", purchasedDate: "2024-01-18", category: "Fashion" },
    { id: "8", name: "Leather Wallet", brand: "Fossil", price: "₹3,999", image: "👛", purchasedDate: "2024-01-10", category: "Accessories" },
  ],
};

const ProductsView = () => {
  const [activeTab, setActiveTab] = useState("viewed");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const sortOptions = [
    { label: "Recently Added", value: "date-desc" },
    { label: "Oldest First", value: "date-asc" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Name: A-Z", value: "name-asc" },
    { label: "Name: Z-A", value: "name-desc" },
  ];

  const filterOptions = [
    { label: "Electronics", value: "Electronics", count: activeTab === "viewed" ? 2 : activeTab === "wishlisted" ? 2 : 1 },
    { label: "Fashion", value: "Fashion", count: activeTab === "viewed" ? 1 : activeTab === "wishlisted" ? 1 : 2 },
    { label: "Accessories", value: "Accessories", count: activeTab === "viewed" ? 1 : activeTab === "wishlisted" ? 1 : 1 },
    { label: "Sports", value: "Sports", count: activeTab === "viewed" ? 1 : 0 },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    const products = activeTab === "viewed" ? mockProducts.viewed : activeTab === "wishlisted" ? mockProducts.wishlisted : mockProducts.purchased;
    
    // Search
    let filtered = products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilters.length === 0 || activeFilters.includes(product.category);
      
      return matchesSearch && matchesFilter;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
      const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
      
      const aProduct = a as any;
      const bProduct = b as any;
      const dateA = new Date(activeTab === "viewed" ? aProduct.viewedDate : activeTab === "wishlisted" ? aProduct.addedDate : aProduct.purchasedDate).getTime();
      const dateB = new Date(activeTab === "viewed" ? bProduct.viewedDate : activeTab === "wishlisted" ? bProduct.addedDate : bProduct.purchasedDate).getTime();

      switch (sortBy) {
        case "date-desc":
          return dateB - dateA;
        case "date-asc":
          return dateA - dateB;
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [activeTab, searchQuery, sortBy, activeFilters]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Products</h1>
        <p className="text-sm text-muted-foreground">Browse products you've viewed</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="viewed" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
            <Eye className="h-4 w-4 mr-2" />
            Viewed
          </TabsTrigger>
          <TabsTrigger value="wishlisted" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
            <Heart className="h-4 w-4 mr-2" />
            Wishlisted
          </TabsTrigger>
          <TabsTrigger value="purchased" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Purchased
          </TabsTrigger>
        </TabsList>

        <SearchSortFilter
          searchPlaceholder="Search products..."
          sortOptions={sortOptions}
          filterOptions={filterOptions}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onFilterChange={setActiveFilters}
          activeFilters={activeFilters}
        />

        <TabsContent value="viewed" className="mt-0">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredAndSortedProducts.map((product) => {
                const viewedProduct = product as any;
                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth overflow-hidden cursor-pointer"
                  >
                    <div className="aspect-square bg-secondary flex items-center justify-center text-6xl">
                      {product.image}
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm font-bold text-primary">{product.price}</p>
                      <p className="text-xs text-[hsl(25,95%,53%)]">
                        Viewed on {formatDate(viewedProduct.viewedDate)}
                      </p>
                      <button className="w-full mt-2 h-8 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition-smooth">
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wishlisted" className="mt-0">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredAndSortedProducts.map((product) => {
                const wishlistedProduct = product as any;
                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth overflow-hidden cursor-pointer"
                  >
                    <div className="aspect-square bg-secondary flex items-center justify-center text-6xl">
                      {product.image}
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm font-bold text-primary">{product.price}</p>
                      <p className="text-xs text-[hsl(25,95%,53%)]">
                        Added on {formatDate(wishlistedProduct.addedDate)}
                      </p>
                      <button className="w-full mt-2 h-8 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchased" className="mt-0">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredAndSortedProducts.map((product) => {
                const purchasedProduct = product as any;
                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-smooth overflow-hidden cursor-pointer"
                  >
                    <div className="aspect-square bg-secondary flex items-center justify-center text-6xl">
                      {product.image}
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm font-bold text-primary">{product.price}</p>
                      <p className="text-xs text-[hsl(25,95%,53%)]">
                        Purchased on {formatDate(purchasedProduct.purchasedDate)}
                      </p>
                      <button className="w-full mt-2 h-8 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-smooth">
                        Reorder
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Product Details Drawer */}
      <Drawer open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DrawerContent className="max-h-[90vh]">
          {selectedProduct && (
            <>
              <DrawerHeader className="text-left">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DrawerTitle className="text-2xl">{selectedProduct.name}</DrawerTitle>
                    <DrawerDescription className="text-base mt-1">
                      {selectedProduct.brand}
                    </DrawerDescription>
                  </div>
                  <DrawerClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </DrawerClose>
                </div>
              </DrawerHeader>
              
              <div className="px-4 overflow-y-auto">
                {/* Large Product Image */}
                <div className="aspect-square rounded-xl bg-secondary mb-6 overflow-hidden flex items-center justify-center text-9xl">
                  {selectedProduct.image}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-3xl font-bold text-foreground">{selectedProduct.price}</p>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    Premium quality product from {selectedProduct.brand}. Perfect for everyday use with exceptional durability and style.
                  </p>
                </div>

                {/* Variants */}
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground mb-3">Size</h3>
                  <div className="flex gap-2 flex-wrap">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <Button key={size} variant="outline" size="sm" className="min-w-[50px]">
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Color</h3>
                  <div className="flex gap-3">
                    {["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#00FF00"].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-smooth"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <DrawerFooter className="pt-4">
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  View Product
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ProductsView;
