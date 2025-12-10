import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  isWishlisted: boolean;
}

interface Brand {
  id: string;
  name: string;
  logo: string;
  color: string;
  isFollowed: boolean;
  products: Product[];
}

const mockBrands: Brand[] = [
  {
    id: "1",
    name: "Blissclub",
    logo: "https://logo.clearbit.com/blissclub.com",
    color: "#7C3AED",
    isFollowed: false,
    products: [
      { id: "1a", name: "Move All Day Pants", price: 2799, image: "👖", isWishlisted: false },
      { id: "1b", name: "Cloud Soft Bra", price: 1999, image: "👙", isWishlisted: true },
      { id: "1c", name: "Groove-In Shorts", price: 1499, image: "🩳", isWishlisted: false },
      { id: "1d", name: "Ultimate Tank", price: 1299, image: "👕", isWishlisted: false },
    ],
  },
  {
    id: "2",
    name: "Nestasia",
    logo: "https://logo.clearbit.com/nestasia.in",
    color: "#D97706",
    isFollowed: true,
    products: [
      { id: "2a", name: "Ceramic Vase", price: 1899, image: "🏺", isWishlisted: true },
      { id: "2b", name: "Cushion Cover", price: 799, image: "🛋️", isWishlisted: false },
      { id: "2c", name: "Table Runner", price: 1299, image: "🎀", isWishlisted: false },
      { id: "2d", name: "Wall Art", price: 2499, image: "🖼️", isWishlisted: false },
    ],
  },
  {
    id: "3",
    name: "Dot & Key",
    logo: "https://logo.clearbit.com/dotandkey.com",
    color: "#EC4899",
    isFollowed: false,
    products: [
      { id: "3a", name: "Vitamin C Serum", price: 695, image: "💧", isWishlisted: false },
      { id: "3b", name: "Lip Balm Set", price: 445, image: "💋", isWishlisted: true },
      { id: "3c", name: "Sunscreen SPF 50", price: 545, image: "☀️", isWishlisted: false },
      { id: "3d", name: "Night Cream", price: 795, image: "🌙", isWishlisted: false },
    ],
  },
  {
    id: "4",
    name: "Two Brothers",
    logo: "https://logo.clearbit.com/twobrothersindiashop.com",
    color: "#16A34A",
    isFollowed: true,
    products: [
      { id: "4a", name: "A2 Cow Ghee", price: 1299, image: "🥛", isWishlisted: false },
      { id: "4b", name: "Wild Forest Honey", price: 599, image: "🍯", isWishlisted: true },
      { id: "4c", name: "Cold Pressed Oil", price: 449, image: "🫒", isWishlisted: false },
      { id: "4d", name: "Organic Jaggery", price: 349, image: "🧈", isWishlisted: false },
    ],
  },
];

const BrandsView = () => {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);

  const toggleFollow = (brandId: string) => {
    setBrands(brands.map(brand => 
      brand.id === brandId ? { ...brand, isFollowed: !brand.isFollowed } : brand
    ));
  };

  const toggleWishlist = (brandId: string, productId: string) => {
    setBrands(brands.map(brand => 
      brand.id === brandId 
        ? {
            ...brand,
            products: brand.products.map(product =>
              product.id === productId 
                ? { ...product, isWishlisted: !product.isWishlisted }
                : product
            )
          }
        : brand
    ));
  };

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Discover Brands</h1>
        <p className="text-sm text-muted-foreground">Your favourite Indian D2C brands</p>
      </div>

      <div className="space-y-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="rounded-2xl overflow-hidden shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${brand.color}15 0%, ${brand.color}08 100%)`,
            }}
          >
            {/* Header with Logo and Follow */}
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-bold text-foreground">{brand.name}</h2>
              <div className="flex items-center gap-3">
                <Button
                  variant={brand.isFollowed ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full px-4 h-8 text-xs font-medium ${
                    brand.isFollowed
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "border-foreground/30 hover:bg-foreground/10"
                  }`}
                  onClick={() => toggleFollow(brand.id)}
                >
                  {brand.isFollowed ? (
                    <>Following</>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
                <div 
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden"
                >
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = brand.name.charAt(0);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="px-4 pb-2">
              <div className="grid grid-cols-4 gap-2">
                {brand.products.map((product) => (
                  <div
                    key={product.id}
                    className="relative bg-white/80 backdrop-blur-sm rounded-xl p-2 aspect-square flex flex-col"
                  >
                    {/* Price - Top Left */}
                    <span className="text-[10px] font-semibold text-foreground">
                      ₹{product.price.toLocaleString()}
                    </span>

                    {/* Product Icon */}
                    <div className="flex-1 flex items-center justify-center text-2xl">
                      {product.image}
                    </div>

                    {/* Wishlist - Bottom Right */}
                    <button
                      onClick={() => toggleWishlist(brand.id, product.id)}
                      className="absolute bottom-2 right-2 p-1"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all ${
                          product.isWishlisted
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground hover:text-red-400"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Shop All CTA */}
            <div className="p-4 pt-2">
              <Button
                className="w-full rounded-full h-10 font-medium text-sm"
                style={{
                  backgroundColor: brand.color,
                  color: 'white',
                }}
              >
                Shop All
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsView;
