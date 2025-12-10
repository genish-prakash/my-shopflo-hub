import { useState } from "react";
import { Heart, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { mockBrands, Brand, Product } from "@/data/brands";

type FilterType = "all" | "following" | "wishlisted";

const BrandsView = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const toggleFollow = (e: React.MouseEvent, brandId: string) => {
    e.stopPropagation();
    setBrands(brands.map(brand => 
      brand.id === brandId ? { ...brand, isFollowed: !brand.isFollowed } : brand
    ));
  };

  const toggleWishlist = (e: React.MouseEvent, brandId: string, productId: string) => {
    e.stopPropagation();
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

  const getFilteredContent = () => {
    if (activeFilter === "following") {
      return brands.filter(brand => brand.isFollowed);
    }
    if (activeFilter === "wishlisted") {
      const wishlistedProducts: { brand: Brand; product: Product }[] = [];
      brands.forEach(brand => {
        brand.products.forEach(product => {
          if (product.isWishlisted) {
            wishlistedProducts.push({ brand, product });
          }
        });
      });
      return wishlistedProducts;
    }
    return brands;
  };

  const filteredContent = getFilteredContent();

  const navigateToBrand = (brandId: string) => {
    navigate(`/brand/${brandId}`);
  };

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Discover Brands</h1>
        <p className="text-sm text-muted-foreground">Your favourite Indian D2C brands</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "All" },
          { key: "following", label: "Following" },
          { key: "wishlisted", label: "Wishlisted" },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key as FilterType)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === filter.key
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Wishlisted Products View */}
      {activeFilter === "wishlisted" && (
        <div className="space-y-4">
          {(filteredContent as { brand: Brand; product: Product }[]).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No wishlisted products yet
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {(filteredContent as { brand: Brand; product: Product }[]).map(({ brand, product }) => (
                <div
                  key={product.id}
                  className="relative bg-card rounded-2xl p-3 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${brand.color}10 0%, ${brand.color}05 100%)`,
                  }}
                >
                  <span className="text-xs font-semibold text-foreground">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <div className="flex items-center justify-center text-4xl py-6">
                    {product.image}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{product.name}</p>
                  <p className="text-[10px] text-muted-foreground/70">{brand.name}</p>
                  <button
                    onClick={(e) => toggleWishlist(e, brand.id, product.id)}
                    className="absolute bottom-3 right-3 p-1"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brands View */}
      {activeFilter !== "wishlisted" && (
        <div className="space-y-6">
          {(filteredContent as Brand[]).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No followed brands yet
            </div>
          ) : (
            (filteredContent as Brand[]).map((brand) => (
              <div
                key={brand.id}
                className="rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-[1.01]"
                style={{
                  background: `linear-gradient(135deg, ${brand.color}12 0%, ${brand.color}06 100%)`,
                }}
                onClick={() => navigateToBrand(brand.id)}
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
                      onClick={(e) => toggleFollow(e, brand.id)}
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
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        className="w-7 h-7 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Products Grid - 2x2 */}
                <div className="px-4 pb-2">
                  <div className="grid grid-cols-2 gap-3">
                    {brand.products.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        className="relative bg-white/90 backdrop-blur-sm rounded-xl p-3 aspect-square flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Price - Top Left */}
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-foreground">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Product Icon */}
                        <div className="flex-1 flex items-center justify-center text-4xl">
                          {product.image}
                        </div>

                        {/* Product Name */}
                        <p className="text-xs text-muted-foreground truncate">{product.name}</p>

                        {/* Wishlist - Bottom Right */}
                        <button
                          onClick={(e) => toggleWishlist(e, brand.id, product.id)}
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
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shop All CTA - Blurred */}
                <div className="p-4 pt-2">
                  <Button
                    className="w-full rounded-full h-10 font-medium text-sm backdrop-blur-md border border-white/30"
                    style={{
                      backgroundColor: `${brand.color}90`,
                      color: 'white',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToBrand(brand.id);
                    }}
                  >
                    Shop All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BrandsView;
