import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
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
      <div className="text-center py-12 text-muted-foreground">
        No wishlisted products yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {wishlistItems.map((item) => (
        <div
          key={item.id}
          className="relative bg-card rounded-2xl p-3 shadow-sm cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => {
            console.log("Open wishlist item", item);
          }}
        >
          <span className="text-xs font-semibold text-foreground">
            ₹{item.price.toLocaleString()}
          </span>
          <div className="flex items-center justify-center text-4xl py-6 overflow-hidden">
            {item.product_image_url ? (
              <img
                src={item.product_image_url}
                alt={item.product_title}
                className="h-20 w-full object-contain"
              />
            ) : (
              <span>🛍️</span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground/70 truncate">
            {item.product_title}
          </p>
          <button
            onClick={(e) => removeFromWishlist(e, item)}
            className="absolute bottom-3 right-3 p-1"
          >
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default WishlistView;
