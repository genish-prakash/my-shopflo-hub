import { ArrowLeft, Tag, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const notifications = [
  {
    id: 1,
    type: "sale",
    brand: "Dot and Key",
    brandLogo: "🍋",
    brandColor: "#FEF3C7",
    title: "Flash Sale - Up to 50% Off!",
    description: "Don't miss out on our biggest skincare sale. Get your favorites at half price!",
    time: "2 hours ago",
    isNew: true,
  },
  {
    id: 2,
    type: "sale",
    brand: "Blissclub",
    brandLogo: "🏃‍♀️",
    brandColor: "#FCE7F3",
    title: "New Collection Launch",
    description: "Our latest activewear collection is here. Check out what's new!",
    time: "5 hours ago",
    isNew: true,
  },
  {
    id: 3,
    type: "order",
    brand: "Nestasia",
    brandLogo: "🏠",
    brandColor: "#D1FAE5",
    title: "Your order has been shipped",
    description: "Your home decor order is on its way. Track your delivery now.",
    time: "1 day ago",
    isNew: false,
  },
];

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 pt-4 pb-6 space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden"
          >
            {notification.isNew && (
              <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />
            )}
            <div className="flex gap-3">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 text-xl"
                style={{ backgroundColor: notification.brandColor }}
              >
                {notification.brandLogo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-primary">{notification.brand}</span>
                  {notification.type === "sale" && (
                    <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                      <Tag className="h-3 w-3" />
                      Sale
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-foreground text-sm mb-1">{notification.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
                <span className="text-xs text-muted-foreground mt-2 block">{notification.time}</span>
              </div>
            </div>
          </Card>
        ))}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No notifications yet</h3>
            <p className="text-sm text-muted-foreground">Follow brands to get updates on sales and offers</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
