import { useState, useMemo } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import ProductDetailSheet from "@/components/ProductDetailSheet";

type TabType = "wishlisted" | "purchased";

const mockProducts = {
  wishlisted: [
    { id: "1", name: "Wireless Headphones", brand: "Sony", brandLogo: "https://logo.clearbit.com/sony.com", brandColor: "#000000", price: 8999, image: "🎧", addedDate: "2024-01-10", description: "Premium wireless headphones with noise cancellation and 30-hour battery life." },
    { id: "2", name: "Smart Watch", brand: "Samsung", brandLogo: "https://logo.clearbit.com/samsung.com", brandColor: "#1428A0", price: 15999, image: "⌚", addedDate: "2024-01-12", description: "Advanced smartwatch with health monitoring and GPS tracking." },
    { id: "3", name: "Running Shoes", brand: "Adidas", brandLogo: "https://logo.clearbit.com/adidas.com", brandColor: "#000000", price: 6499, image: "👟", addedDate: "2024-01-08", description: "Lightweight running shoes with responsive cushioning for maximum comfort." },
    { id: "4", name: "Laptop Backpack", brand: "Dell", brandLogo: "https://logo.clearbit.com/dell.com", brandColor: "#007DB8", price: 2999, image: "🎒", addedDate: "2024-01-15", description: "Durable laptop backpack with multiple compartments and water-resistant material." },
  ],
  purchased: [
    { id: "5", name: "Air Max 270 React", brand: "Nike", brandLogo: "https://logo.clearbit.com/nike.com", brandColor: "#000000", price: 12999, image: "👟", purchasedDate: "2024-01-05", description: "Iconic sneakers combining comfort and style with React foam technology." },
    { id: "6", name: "AirPods Pro", brand: "Apple", brandLogo: "https://logo.clearbit.com/apple.com", brandColor: "#000000", price: 24900, image: "🎧", purchasedDate: "2023-12-20", description: "True wireless earbuds with active noise cancellation and spatial audio." },
    { id: "7", name: "Cotton Shirt", brand: "Zara", brandLogo: "https://logo.clearbit.com/zara.com", brandColor: "#000000", price: 2499, image: "👔", purchasedDate: "2024-01-18", description: "Classic cotton shirt perfect for both casual and formal occasions." },
    { id: "8", name: "Leather Wallet", brand: "Fossil", brandLogo: "https://logo.clearbit.com/fossil.com", brandColor: "#8B4513", price: 3999, image: "👛", purchasedDate: "2024-01-10", description: "Premium leather wallet with RFID protection and multiple card slots." },
  ],
};

const ProductsView = () => {
  const [activeTab, setActiveTab] = useState<TabType>("wishlisted");
  const [wishlistedProducts, setWishlistedProducts] = useState(mockProducts.wishlisted);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const removeFromWishlist = (productId: string) => {
    setWishlistedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProducts = () => {
    switch (activeTab) {
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
    const dateField = activeTab === "wishlisted" ? "addedDate" : "purchasedDate";
    return products.sort((a: any, b: any) => {
      const dateA = new Date(a[dateField]).getTime();
      const dateB = new Date(b[dateField]).getTime();
      return dateB - dateA;
    });
  }, [activeTab, wishlistedProducts]);

  const tabs = [
    { id: "wishlisted" as TabType, label: "Wishlisted", icon: Heart, count: wishlistedProducts.length },
    { id: "purchased" as TabType, label: "Purchased", icon: ShoppingBag, count: mockProducts.purchased.length },
  ];

  const openProductDetail = (product: any) => {
    setSelectedProduct({
      ...product,
      images: [product.image, product.image, product.image],
      brand: {
        name: product.brand,
        logo: product.brandLogo,
        color: product.brandColor,
        website: `https://${product.brand.toLowerCase().replace(/\s+/g, '')}.com`,
      },
      variants: [
        { id: "s", name: "S", available: true },
        { id: "m", name: "M", available: true },
        { id: "l", name: "L", available: false },
        { id: "xl", name: "XL", available: true },
      ],
      isWishlisted: activeTab === "wishlisted",
    });
  };

  return (
    <div className="pb-24 px-4 pt-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === tab.id && tab.id === "wishlisted" ? "fill-current" : ""}`} />
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
              onClick={() => openProductDetail(product)}
              className="relative bg-card rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Product Image */}
              <div className="aspect-square bg-secondary flex items-center justify-center text-5xl">
                {product.image}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
                <h3 className="font-medium text-sm text-foreground truncate mb-1">
                  {product.name}
                </h3>
                <p className="text-sm font-bold text-foreground">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>

              {/* Wishlist Button */}
              {activeTab === "wishlisted" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onToggleWishlist={(id) => {
          if (activeTab === "wishlisted") {
            removeFromWishlist(id);
          }
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default ProductsView;