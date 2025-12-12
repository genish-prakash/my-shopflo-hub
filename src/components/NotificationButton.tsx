import { useNotifications } from "@/hooks/useNotifications";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NotificationButtonProps {
  userId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

/**
 * Simple notification toggle button component
 * Drop this anywhere in your app for quick notification enable/disable
 *
 * @example
 * ```tsx
 * // In your header/navbar
 * <NotificationButton userId={userId} variant="ghost" size="icon" />
 *
 * // In settings with text
 * <NotificationButton userId={userId} showText />
 * ```
 */
export function NotificationButton({
  userId,
  variant = "default",
  size = "default",
  className = "",
  showText = false,
}: NotificationButtonProps) {
  const { toast } = useToast();

  const {
    isSupported,
    isRegistered,
    isLoading,
    requestPermission,
    unregister,
  } = useNotifications({
    userId,
    onForegroundMessage: (payload) => {
      toast({
        title: payload.notification?.title || "New Notification",
        description: payload.notification?.body || "",
      });
    },
  });

  if (!isSupported) {
    return null; // Don't show if browser doesn't support notifications
  }

  const handleClick = async () => {
    if (isRegistered) {
      const success = await unregister();
      if (success) {
        toast({
          title: "Notifications Disabled",
          description: "You won't receive push notifications anymore.",
        });
      }
    } else {
      const success = await requestPermission();
      if (success) {
        toast({
          title: "Notifications Enabled! 🎉",
          description: "You'll now receive important updates.",
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        });
      }
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {showText && <span className="ml-2">Loading...</span>}
        </>
      );
    }

    if (isRegistered) {
      return (
        <>
          <Bell className="w-4 h-4 fill-current" />
          {showText && <span className="ml-2">Notifications On</span>}
        </>
      );
    }

    return (
      <>
        <BellOff className="w-4 h-4" />
        {showText && <span className="ml-2">Enable Notifications</span>}
      </>
    );
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
      title={
        isRegistered ? "Disable notifications" : "Enable push notifications"
      }
    >
      {getButtonContent()}
    </Button>
  );
}
