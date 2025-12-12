import { messaging, getToken, onMessage, VAPID_KEY } from "@/lib/firebase";
import { authenticatedApi } from "@/services/authenticatedApi";

// Notification endpoints are relative to the base URL
const NOTIFICATIONS_PATH = "/notifications";

export type DeviceType = "WEB" | "ANDROID" | "IOS";

export interface DeviceToken {
  id: string;
  token: string;
  device_type: DeviceType;
  device_name: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  image_url?: string;
  click_action?: string;
  data?: Record<string, any>;
}

export interface SendNotificationResponse {
  success: boolean;
  message_id?: string;
  success_count?: number;
  failure_count?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Get browser name for device identification
 */
function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Unknown Browser";
}

/**
 * Get device name (browser + OS)
 */
function getDeviceName(): string {
  const browser = getBrowserName();
  const platform = navigator.platform || "Unknown OS";
  return `${browser} on ${platform}`;
}

/**
 * Request notification permission and get FCM token
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return null;
    }

    // Check if messaging is available
    if (!messaging) {
      console.warn("Firebase messaging not initialized");
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted");

      // Register service worker
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      console.log("Service worker registered:", registration);

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.warn("No registration token available");
        return null;
      }
    } else if (permission === "denied") {
      console.warn("Notification permission denied");
      return null;
    } else {
      console.log("Notification permission dismissed");
      return null;
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
}

/**
 * Register device token with backend
 */
export async function registerDeviceToken(
  userId: string,
  token: string,
  deviceType: DeviceType = "WEB"
): Promise<DeviceToken | null> {
  try {
    const response = await authenticatedApi.post<ApiResponse<DeviceToken>>(
      `${NOTIFICATIONS_PATH}/token`,
      {
        token,
        device_type: deviceType,
        device_name: getDeviceName(),
      },
      {
        headers: {
          "X-SHOPFLO-USER-ID": userId,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error registering device token:", error);
    return null;
  }
}

/**
 * Unregister device token (e.g., on logout)
 */
export async function unregisterDeviceToken(
  userId: string,
  token: string
): Promise<boolean> {
  try {
    const response = await authenticatedApi.delete<ApiResponse<boolean>>(
      `${NOTIFICATIONS_PATH}/token?token=${encodeURIComponent(token)}`,
      {
        headers: {
          "X-SHOPFLO-USER-ID": userId,
        },
      }
    );

    return response.data === true;
  } catch (error) {
    console.error("Error unregistering device token:", error);
    return false;
  }
}

/**
 * Get all device tokens for current user
 */
export async function getUserDeviceTokens(
  userId: string
): Promise<DeviceToken[]> {
  try {
    const response = await authenticatedApi.get<ApiResponse<DeviceToken[]>>(
      `${NOTIFICATIONS_PATH}/tokens`,
      {
        headers: {
          "X-SHOPFLO-USER-ID": userId,
        },
      }
    );

    return response.data || [];
  } catch (error) {
    console.error("Error getting device tokens:", error);
    return [];
  }
}

/**
 * Send test notification to self
 */
export async function sendTestNotification(
  userId: string,
  notification: NotificationPayload
): Promise<SendNotificationResponse | null> {
  try {
    const response = await authenticatedApi.post<
      ApiResponse<SendNotificationResponse>
    >(`${NOTIFICATIONS_PATH}/send`, notification, {
      headers: {
        "X-SHOPFLO-USER-ID": userId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error sending test notification:", error);
    return null;
  }
}

/**
 * Subscribe to a topic
 */
export async function subscribeToTopic(
  userId: string,
  topic: string
): Promise<boolean> {
  try {
    await authenticatedApi.post(
      `${NOTIFICATIONS_PATH}/topic/${topic}/subscribe`,
      {},
      {
        headers: {
          "X-SHOPFLO-USER-ID": userId,
        },
      }
    );

    return true;
  } catch (error) {
    console.error(`Error subscribing to topic ${topic}:`, error);
    return false;
  }
}

/**
 * Unsubscribe from a topic
 */
export async function unsubscribeFromTopic(
  userId: string,
  topic: string
): Promise<boolean> {
  try {
    await authenticatedApi.post(
      `${NOTIFICATIONS_PATH}/topic/${topic}/unsubscribe`,
      {},
      {
        headers: {
          "X-SHOPFLO-USER-ID": userId,
        },
      }
    );

    return true;
  } catch (error) {
    console.error(`Error unsubscribing from topic ${topic}:`, error);
    return false;
  }
}

/**
 * Setup listener for foreground notifications
 */
export function setupForegroundNotifications(
  callback: (payload: any) => void
): (() => void) | null {
  if (!messaging) {
    console.warn("Firebase messaging not initialized");
    return null;
  }

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    callback(payload);
  });

  return unsubscribe;
}

/**
 * Complete registration flow - request permission, get token, and register with backend
 */
export async function registerForNotifications(
  userId: string
): Promise<{ success: boolean; token?: string; deviceToken?: DeviceToken }> {
  try {
    // 1. Request permission and get FCM token
    const fcmToken = await requestNotificationPermission();

    if (!fcmToken) {
      return { success: false };
    }

    // 2. Register token with backend
    const deviceToken = await registerDeviceToken(userId, fcmToken);

    if (!deviceToken) {
      return { success: false, token: fcmToken };
    }

    return {
      success: true,
      token: fcmToken,
      deviceToken,
    };
  } catch (error) {
    console.error("Error in notification registration flow:", error);
    return { success: false };
  }
}

/**
 * Unregister from notifications - useful on logout
 */
export async function unregisterFromNotifications(
  userId: string,
  token?: string
): Promise<boolean> {
  try {
    // If token not provided, get all tokens and unregister them
    if (!token) {
      const tokens = await getUserDeviceTokens(userId);
      const results = await Promise.all(
        tokens.map((t) => unregisterDeviceToken(userId, t.token))
      );
      return results.every((r) => r === true);
    }

    return await unregisterDeviceToken(userId, token);
  } catch (error) {
    console.error("Error unregistering from notifications:", error);
    return false;
  }
}
