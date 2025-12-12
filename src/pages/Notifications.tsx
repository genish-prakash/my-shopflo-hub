import {
  ArrowLeft,
  Bell,
  BellRing,
  Settings2,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationButton } from "@/components/NotificationButton";
import { NotificationDemo } from "@/components/NotificationDemo";
import { RichNotificationCard } from "@/components/RichNotificationCard";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import {
  getNotifications,
  groupNotificationsByDate,
  markAsRead,
  deleteNotification,
  clearAllNotifications,
  formatNotificationTime,
  type StoredNotification,
} from "@/services/notificationStorage";

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showFullSettings, setShowFullSettings] = useState(false);
  const [storedNotifications, setStoredNotifications] = useState<
    StoredNotification[]
  >([]);

  // Get authenticated user from context
  const { user } = useUser();

  const { isSupported, isRegistered } = useNotifications({
    userId: user?.id || "",
    onForegroundMessage: (payload) => {
      toast({
        title: payload.notification?.title || "New Notification",
        description: payload.notification?.body || "",
      });
      // Reload notifications when new one arrives
      loadNotifications();
    },
  });

  // Load notifications from localStorage
  const loadNotifications = () => {
    const notifications = getNotifications();
    setStoredNotifications(notifications);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Group notifications by date
  const groupedNotifications = groupNotificationsByDate(storedNotifications);
  const hasNotifications = storedNotifications.length > 0;
  const unreadCount = storedNotifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: StoredNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
      loadNotifications();
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
    loadNotifications();
    toast({
      title: "Notification deleted",
      description: "The notification has been removed",
    });
  };

  const handleClearAll = () => {
    clearAllNotifications();
    loadNotifications();
    toast({
      title: "All cleared!",
      description: "All notifications have been removed",
    });
  };

  const renderNotificationGroup = (
    title: string,
    notifications: StoredNotification[]
  ) => {
    if (notifications.length === 0) return null;

    return (
      <div key={title} className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
          {title}
        </h3>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`relative ${
              !notification.isRead ? "ring-2 ring-primary/20" : ""
            }`}
          >
            {!notification.isRead && (
              <div className="absolute -top-1 -right-1 z-10">
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              </div>
            )}

            <RichNotificationCard
              notification={notification}
              onDismiss={() => handleDeleteNotification(notification.id)}
              onAction={(action, type) => {
                console.log("Notification action:", action, type);
                // Mark as read when action is taken
                if (!notification.isRead) {
                  markAsRead(notification.id);
                  loadNotifications();
                }
              }}
            />

            {/* Timestamp */}
            <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground bg-muted/30">
              <span>{formatNotificationTime(notification.timestamp)}</span>
              {!notification.isRead && (
                <span className="text-primary font-medium">New</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between gap-3 px-4 h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          {hasNotifications && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-xs"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Push Notification Settings - Only show if user is logged in */}
        {isSupported && user && (
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BellRing className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    Push Notifications
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isRegistered
                      ? "You'll receive updates about sales, orders, and offers"
                      : "Get real-time updates on your phone"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      Status:
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        isRegistered ? "text-green-600" : "text-orange-600"
                      }`}
                    >
                      {isRegistered ? "✓ Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
              <NotificationButton
                userId={user?.id || ""}
                variant={isRegistered ? "outline" : "default"}
                size="sm"
                showText={false}
              />
            </div>

            {/* Expandable Settings */}
            <button
              onClick={() => setShowFullSettings(!showFullSettings)}
              className="w-full flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border/50 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <Settings2 className="h-3 w-3" />
              {showFullSettings ? "Hide Settings" : "Show More Settings"}
              {showFullSettings ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>

            {showFullSettings && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <NotificationDemo userId={user?.id || ""} />
              </div>
            )}
          </Card>
        )}

        {/* Notifications List */}
        {hasNotifications ? (
          <div className="space-y-6">
            {renderNotificationGroup("Today", groupedNotifications.today)}
            {renderNotificationGroup(
              "Yesterday",
              groupedNotifications.yesterday
            )}
            {renderNotificationGroup(
              "This Week",
              groupedNotifications.thisWeek
            )}
            {renderNotificationGroup("Older", groupedNotifications.older)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">
              No notifications yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isRegistered
                ? "You'll see notifications here when you receive them"
                : "Enable push notifications to get updates"}
            </p>
            {!isRegistered && user && (
              <NotificationButton userId={user.id} showText variant="default" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
