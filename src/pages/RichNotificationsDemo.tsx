import { useState } from "react";
import { RichNotificationCard } from "@/components/RichNotificationCard";
import {
  RichNotification,
  TextNotification,
  MediaNotification,
  CarouselNotification,
  ListNotification,
  PollNotification,
  CardNotification,
  PromotionalNotification,
} from "@/types/notifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RichNotificationsDemo() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Sample notifications
  const notifications: Record<string, RichNotification> = {
    text: {
      type: "TEXT",
      title: "Order Shipped! 📦",
      body: "Your order #12345 has been shipped and will arrive by tomorrow.",
      click_action: "https://example.com/orders/12345",
    } as TextNotification,

    media: {
      type: "MEDIA",
      title: "New Collection Arrived!",
      body: "Check out our summer collection",
      media_url:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
      media_type: "IMAGE",
      caption: "Summer vibes only ☀️",
      click_action: "https://example.com/collections/summer",
    } as MediaNotification,

    carousel: {
      type: "CAROUSEL",
      title: "Recommended For You",
      body: "Based on your recent browsing",
      items: [
        {
          title: "Nike Air Max 90",
          subtitle: "₹12,999",
          image_url:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
          click_action: "https://example.com/products/nike-airmax-90",
          buttons: [
            {
              text: "Buy Now",
              action: "https://example.com/cart/add/nike-airmax-90",
              button_type: "LINK",
            },
          ],
        },
        {
          title: "Adidas Ultraboost",
          subtitle: "₹15,499",
          image_url:
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400",
          click_action: "https://example.com/products/adidas-ultraboost",
          buttons: [
            {
              text: "Buy Now",
              action: "https://example.com/cart/add/adidas-ultraboost",
              button_type: "LINK",
            },
          ],
        },
        {
          title: "Puma RS-X",
          subtitle: "₹9,999",
          image_url:
            "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400",
          click_action: "https://example.com/products/puma-rsx",
          buttons: [
            {
              text: "Buy Now",
              action: "https://example.com/cart/add/puma-rsx",
              button_type: "LINK",
            },
          ],
        },
      ],
    } as CarouselNotification,

    list: {
      type: "LIST",
      title: "Your Recent Orders",
      body: "Track your orders",
      items: [
        {
          title: "Order #ORD-78901",
          subtitle: "Delivered on Dec 10, 2025",
          image_url:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
          click_action: "https://example.com/orders/78901",
          metadata: "₹2,499",
        },
        {
          title: "Order #ORD-78845",
          subtitle: "Out for delivery",
          image_url:
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100",
          click_action: "https://example.com/orders/78845",
          metadata: "₹1,299",
        },
        {
          title: "Order #ORD-78790",
          subtitle: "Processing",
          image_url:
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100",
          click_action: "https://example.com/orders/78790",
          metadata: "₹3,999",
        },
      ],
      footer_button: {
        text: "View All Orders",
        action: "https://example.com/orders",
        button_type: "LINK",
      },
    } as ListNotification,

    poll: {
      type: "POLL",
      question: "What type of products would you like to see more of?",
      body: "Help us improve your shopping experience",
      poll_id: "poll_dec_2025_001",
      allow_multiple_selection: false,
      options: [
        {
          id: "opt_1",
          text: "Electronics & Gadgets",
        },
        {
          id: "opt_2",
          text: "Fashion & Apparel",
        },
        {
          id: "opt_3",
          text: "Home & Kitchen",
        },
        {
          id: "opt_4",
          text: "Beauty & Personal Care",
        },
      ],
    } as PollNotification,

    card: {
      type: "CARD",
      title: "Your Cart is Waiting!",
      subtitle: "Complete your purchase",
      body: "You have 3 items worth ₹4,999 in your cart. Complete your order now and get free shipping!",
      image_url:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400",
      style: "HERO",
      buttons: [
        {
          text: "Checkout Now",
          action: "https://example.com/checkout",
          button_type: "LINK",
        },
        {
          text: "View Cart",
          action: "https://example.com/cart",
          button_type: "LINK",
        },
        {
          text: "Remind Later",
          action: "dismiss",
          button_type: "DISMISS",
        },
      ],
    } as CardNotification,

    promotional: {
      type: "PROMOTIONAL",
      title: "Flash Sale! 🔥",
      body: "Biggest sale of the year - Up to 70% OFF on everything!",
      banner_url:
        "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800",
      coupon_code: "FLASH70",
      discount_text: "FLAT 70% OFF",
      discount_value: 70,
      discount_type: "PERCENTAGE",
      minimum_order_value: 999,
      valid_until: "2025-12-25T23:59:59Z",
      terms_and_conditions:
        "Valid on orders above ₹999. Max discount ₹2000. Not applicable on certain brands.",
      buttons: [
        {
          text: "Shop Now",
          action: "https://example.com/sale/flash",
          button_type: "LINK",
        },
        {
          text: "Copy Code",
          action: "copy:FLASH70",
          button_type: "ACTION",
        },
      ],
    } as PromotionalNotification,
  };

  const notificationTypes = [
    { key: "text", label: "Text", emoji: "📝" },
    { key: "media", label: "Media", emoji: "🖼️" },
    { key: "carousel", label: "Carousel", emoji: "🎠" },
    { key: "list", label: "List", emoji: "📋" },
    { key: "poll", label: "Poll", emoji: "📊" },
    { key: "card", label: "Card", emoji: "🃏" },
    { key: "promotional", label: "Promotional", emoji: "🎁" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-4 flex items-center gap-4 bg-background/80 backdrop-blur-md border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">
          Rich Notifications Demo
        </h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Type Selector */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Select Notification Type</h2>
          <div className="grid grid-cols-2 gap-2">
            {notificationTypes.map(({ key, label, emoji }) => (
              <Button
                key={key}
                variant={selectedType === key ? "default" : "outline"}
                onClick={() => setSelectedType(key)}
                className="justify-start"
              >
                <span className="mr-2">{emoji}</span>
                {label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Preview */}
        {selectedType && (
          <div>
            <h2 className="font-semibold mb-2">Preview</h2>
            <RichNotificationCard
              notification={notifications[selectedType]}
              onDismiss={() => console.log("Dismissed")}
              onAction={(action, type) => console.log("Action:", action, type)}
            />
          </div>
        )}

        {/* Instructions */}
        <Card className="p-4 bg-muted/50">
          <h3 className="font-semibold mb-2">How to Use</h3>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Select a notification type above to see the preview</li>
            <li>Each type has different interactive elements</li>
            <li>
              Try clicking buttons, navigating carousels, and submitting polls
            </li>
            <li>
              These notifications will be shown when FCM pushes are received
            </li>
          </ol>
        </Card>

        {/* Code Example */}
        {selectedType && (
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Payload Example</h3>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
              <code>
                {JSON.stringify(notifications[selectedType], null, 2)}
              </code>
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}
