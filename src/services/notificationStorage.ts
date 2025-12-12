import type { RichNotification } from "@/types/notifications";

const STORAGE_KEY = "shopflo_notifications";
const MAX_NOTIFICATIONS = 100; // Keep last 100 notifications

export type StoredNotification = RichNotification & {
  id: string;
  timestamp: number;
  isRead: boolean;
  receivedAt: string;
};

/**
 * Save a notification to localStorage
 */
export function saveNotification(
  notification: RichNotification
): StoredNotification {
  const notifications = getNotifications();

  const storedNotification: StoredNotification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    isRead: false,
    receivedAt: new Date().toISOString(),
  };

  // Add to beginning of array (newest first)
  notifications.unshift(storedNotification);

  // Keep only last MAX_NOTIFICATIONS
  const trimmed = notifications.slice(0, MAX_NOTIFICATIONS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Failed to save notification:", error);
  }

  return storedNotification;
}

/**
 * Get all notifications from localStorage
 */
export function getNotifications(): StoredNotification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const notifications = JSON.parse(stored) as StoredNotification[];
    return notifications.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return [];
  }
}

/**
 * Get unread notification count
 */
export function getUnreadCount(): number {
  const notifications = getNotifications();
  return notifications.filter((n) => !n.isRead).length;
}

/**
 * Mark notification as read
 */
export function markAsRead(notificationId: string): void {
  const notifications = getNotifications();
  const updated = notifications.map((n) =>
    n.id === notificationId ? { ...n, isRead: true } : n
  );

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead(): void {
  const notifications = getNotifications();
  const updated = notifications.map((n) => ({ ...n, isRead: true }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to mark all as read:", error);
  }
}

/**
 * Delete a notification
 */
export function deleteNotification(notificationId: string): void {
  const notifications = getNotifications();
  const filtered = notifications.filter((n) => n.id !== notificationId);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete notification:", error);
  }
}

/**
 * Clear all notifications
 */
export function clearAllNotifications(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear notifications:", error);
  }
}

/**
 * Get notifications from today
 */
export function getTodayNotifications(): StoredNotification[] {
  const notifications = getNotifications();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return notifications.filter((n) => n.timestamp >= today.getTime());
}

/**
 * Get notifications from this week
 */
export function getWeekNotifications(): StoredNotification[] {
  const notifications = getNotifications();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return notifications.filter((n) => n.timestamp >= weekAgo);
}

/**
 * Group notifications by date
 */
export function groupNotificationsByDate(notifications: StoredNotification[]): {
  today: StoredNotification[];
  yesterday: StoredNotification[];
  thisWeek: StoredNotification[];
  older: StoredNotification[];
} {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const yesterday = today - 24 * 60 * 60 * 1000;
  const weekAgo = today - 7 * 24 * 60 * 60 * 1000;

  return {
    today: notifications.filter((n) => n.timestamp >= today),
    yesterday: notifications.filter(
      (n) => n.timestamp >= yesterday && n.timestamp < today
    ),
    thisWeek: notifications.filter(
      (n) => n.timestamp >= weekAgo && n.timestamp < yesterday
    ),
    older: notifications.filter((n) => n.timestamp < weekAgo),
  };
}

/**
 * Format timestamp for display
 */
export function formatNotificationTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}
