import { useState, useEffect } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { wishlistApi } from "@/services/mystique";
import type { WishlistItem } from "@/services/mystique/types";

const WishlistView = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const items = await wishlistApi.getAllWishlist();
        setWishlistItems(items);
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (
    e: React.MouseEvent,
    item: WishlistItem
  ) => {
    e.stopPropagation();
    try {
      await wishlistApi.removeFromWishlist(item.merchant_id, item.variant_id);
      setWishlistItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-foreground">
            Your wishlist is empty
          </h3>
          <p className="text-sm text-muted-foreground">
            Save items you love to buy them later
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {wishlistItems.map((item) => (
        <div
          key={item.id}
          className="group relative bg-white rounded-2xl p-2 aspect-[3/4] flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent hover:border-black/5"
          onClick={() => {
            console.log("Open wishlist item", item);
          }}
        >
          {/* Image Container */}
          <div className="relative flex-1 w-full rounded-xl overflow-hidden bg-gray-50/50 p-2">
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-inner">
              {item.product_image_url ? (
                <img
                  src={item.product_image_url}
                  alt={item.product_title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-4xl text-muted-foreground/20">
                  <ShoppingBag className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Price Badge - Top Left */}
            <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-baseline gap-1 border border-black/5 z-10">
              <span className="text-xs font-bold text-foreground">
                ₹{item.price.toLocaleString()}
              </span>
              {item.compare_at_price && (
                <span className="text-[10px] text-muted-foreground line-through">
                  ₹{item.compare_at_price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Remove Button - Top Right */}
            <button
              onClick={(e) => removeFromWishlist(e, item)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-sm transition-transform active:scale-90 border border-black/5 hover:bg-red-50 z-10 group/btn"
            >
              <Heart className="w-4 h-4 fill-red-500 text-red-500 transition-transform group-hover/btn:scale-110" />
            </button>
          </div>

          {/* Product Title */}
          <div className="px-1 pt-3 pb-1">
            <h3 className="text-sm font-medium text-foreground truncate leading-tight">
              {item.product_title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {item.variant_title !== "Default"
                ? item.variant_title
                : "Standard"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishlistView;
