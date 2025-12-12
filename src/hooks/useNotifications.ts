import { useState, useEffect, useCallback } from "react";
import {
  registerForNotifications,
  unregisterFromNotifications,
  setupForegroundNotifications,
  subscribeToTopic,
  unsubscribeFromTopic,
  sendTestNotification,
  type NotificationPayload,
} from "@/services/notificationService";
import { saveNotification } from "@/services/notificationStorage";
import type { RichNotification } from "@/types/notifications";

interface UseNotificationsOptions {
  userId?: string;
  autoRegister?: boolean;
  onForegroundMessage?: (payload: any) => void;
}

interface UseNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission | null;
  isRegistered: boolean;
  isLoading: boolean;
  error: string | null;
  fcmToken: string | null;
  requestPermission: () => Promise<boolean>;
  unregister: () => Promise<boolean>;
  subscribeTopic: (topic: string) => Promise<boolean>;
  unsubscribeTopic: (topic: string) => Promise<boolean>;
  sendTest: (notification: NotificationPayload) => Promise<boolean>;
}

/**
 * React hook for managing push notifications
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const {
 *     requestPermission,
 *     isRegistered,
 *     permission
 *   } = useNotifications({
 *     userId: 'user_123',
 *     onForegroundMessage: (payload) => {
 *       console.log('Got notification:', payload);
 *       // Show in-app notification
 *     }
 *   });
 *
 *   return (
 *     <button onClick={requestPermission}>
 *       {isRegistered ? 'Notifications Enabled' : 'Enable Notifications'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const { userId, autoRegister = false, onForegroundMessage } = options;

  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null
  );
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Check if notifications are supported
  useEffect(() => {
    const supported = "Notification" in window && "serviceWorker" in navigator;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  // Setup foreground message listener
  useEffect(() => {
    if (!onForegroundMessage) return;

    const unsubscribe = setupForegroundNotifications((payload) => {
      console.log("Foreground notification received:", payload);

      // Save notification to localStorage
      try {
        let richNotification: RichNotification;

        // Check for notification_content (actual field from backend)
        if (payload.data?.notification_content) {
          const notificationData =
            typeof payload.data.notification_content === "string"
              ? payload.data.notification_content
              : payload.data.notification_content;

          richNotification =
            typeof notificationData === "string"
              ? JSON.parse(notificationData)
              : notificationData;

          console.log(
            "Parsed rich notification from notification_content:",
            richNotification
          );
        }
        // Fallback: check for notification field (alternative structure)
        else if (payload.data?.notification) {
          const notificationData =
            typeof payload.data.notification === "string"
              ? payload.data.notification
              : payload.data.notification;

          richNotification =
            typeof notificationData === "string"
              ? JSON.parse(notificationData)
              : notificationData;

          console.log(
            "Parsed rich notification from notification:",
            richNotification
          );
        }
        // Fallback: create a simple TEXT notification
        else {
          richNotification = {
            type: "TEXT",
            title: payload.notification?.title || "Notification",
            body: payload.notification?.body || "",
            click_action:
              payload.notification?.click_action ||
              (payload as any).fcmOptions?.link ||
              payload.data?.click_action,
          };

          console.log("Created fallback TEXT notification:", richNotification);
        }

        const saved = saveNotification(richNotification);
        console.log("Notification saved to localStorage:", saved);
      } catch (error) {
        console.error("Failed to save notification:", error);
        console.error("Payload was:", payload);
      }

      onForegroundMessage(payload);

      // Optionally show browser notification if app is in focus
      if (Notification.permission === "granted" && payload.notification) {
        new Notification(payload.notification.title || "New Notification", {
          body: payload.notification.body,
          icon: payload.notification.icon || "/favicon.ico",
          image: payload.notification.image,
          data: payload.data,
        });
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onForegroundMessage]);

  // Auto-register if enabled
  useEffect(() => {
    if (autoRegister && userId && isSupported && permission === "default") {
      requestPermission();
    }
  }, [autoRegister, userId, isSupported, permission]);

  /**
   * Request notification permission and register with backend
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      setError("User ID is required");
      return false;
    }

    if (!isSupported) {
      setError("Notifications are not supported in this browser");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await registerForNotifications(userId);

      if (result.success) {
        setIsRegistered(true);
        setFcmToken(result.token || null);
        setPermission("granted");
        return true;
      } else {
        setError("Failed to register for notifications");
        return false;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, isSupported]);

  /**
   * Unregister from notifications
   */
  const unregister = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      setError("User ID is required");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await unregisterFromNotifications(
        userId,
        fcmToken || undefined
      );

      if (result) {
        setIsRegistered(false);
        setFcmToken(null);
        return true;
      } else {
        setError("Failed to unregister from notifications");
        return false;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, fcmToken]);

  /**
   * Subscribe to a notification topic
   */
  const subscribeTopic = useCallback(
    async (topic: string): Promise<boolean> => {
      if (!userId) {
        setError("User ID is required");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await subscribeToTopic(userId, topic);
        if (!result) {
          setError(`Failed to subscribe to topic: ${topic}`);
        }
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  /**
   * Unsubscribe from a notification topic
   */
  const unsubscribeTopic = useCallback(
    async (topic: string): Promise<boolean> => {
      if (!userId) {
        setError("User ID is required");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await unsubscribeFromTopic(userId, topic);
        if (!result) {
          setError(`Failed to unsubscribe from topic: ${topic}`);
        }
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  /**
   * Send a test notification
   */
  const sendTest = useCallback(
    async (notification: NotificationPayload): Promise<boolean> => {
      if (!userId) {
        setError("User ID is required");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await sendTestNotification(userId, notification);
        if (!result) {
          setError("Failed to send test notification");
        }
        return !!result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  return {
    isSupported,
    permission,
    isRegistered,
    isLoading,
    error,
    fcmToken,
    requestPermission,
    unregister,
    subscribeTopic,
    unsubscribeTopic,
    sendTest,
  };
}
