// Service Worker for Firebase Cloud Messaging
// This file handles background notifications when the app is not in focus

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyD6VALSjx63gFjSvVcz5PSGvoqnzmGwwnw",
    authDomain: "wander-e2541.firebaseapp.com",
    projectId: "wander-e2541",
    storageBucket: "wander-e2541.firebasestorage.app",
    messagingSenderId: "673687823780",
    appId: "1:673687823780:web:21e886c649af1a31500d31",
    measurementId: "G-0FHJSLE2FH"
});

const messaging = firebase.messaging();

// Helper function to save notification to localStorage
function saveNotificationToStorage(payload) {
    try {
        const STORAGE_KEY = 'shopflo_notifications';
        const MAX_NOTIFICATIONS = 100;

        // Get existing notifications
        const stored = localStorage.getItem(STORAGE_KEY);
        const notifications = stored ? JSON.parse(stored) : [];

        // Parse rich notification from payload
        let richNotification;

        // Check for notification_content (actual field from backend)
        if (payload.data && payload.data.notification_content) {
            richNotification = typeof payload.data.notification_content === 'string'
                ? JSON.parse(payload.data.notification_content)
                : payload.data.notification_content;

            console.log('[SW] Parsed rich notification from notification_content:', richNotification);
        }
        // Fallback: check for notification field (alternative structure)
        else if (payload.data && payload.data.notification) {
            richNotification = typeof payload.data.notification === 'string'
                ? JSON.parse(payload.data.notification)
                : payload.data.notification;

            console.log('[SW] Parsed rich notification from notification:', richNotification);
        }
        // Fallback: create a simple TEXT notification from the basic payload
        else {
            richNotification = {
                type: 'TEXT',
                title: payload.notification?.title || 'Notification',
                body: payload.notification?.body || '',
                click_action: payload.notification?.click_action || payload.fcmOptions?.link || payload.data?.click_action
            };

            console.log('[SW] Created fallback TEXT notification:', richNotification);
        }

        // Add metadata
        const storedNotification = {
            ...richNotification,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            isRead: false,
            receivedAt: new Date().toISOString()
        };

        // Add to beginning (newest first)
        notifications.unshift(storedNotification);

        // Keep only last MAX_NOTIFICATIONS
        const trimmed = notifications.slice(0, MAX_NOTIFICATIONS);

        // Save back to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

        console.log('[SW] Notification saved to localStorage:', storedNotification);

        return storedNotification;
    } catch (error) {
        console.error('[SW] Error saving notification to localStorage:', error);
        console.error('[SW] Payload was:', payload);
        return null;
    }
}

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    // Save to localStorage
    saveNotificationToStorage(payload);

    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        image: payload.notification?.image,
        data: {
            ...payload.data,
            click_action: payload.notification?.click_action || payload.data?.click_action || '/'
        },
        tag: payload.data?.notification_id || Date.now().toString(),
        requireInteraction: false,
        vibrate: [200, 100, 200]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event.notification);

    event.notification.close();

    const clickAction = event.notification.data?.click_action || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if there's already a window/tab open
            for (const client of clientList) {
                if (client.url === clickAction && 'focus' in client) {
                    return client.focus();
                }
            }

            // If no matching window, open a new one
            if (clients.openWindow) {
                return clients.openWindow(clickAction);
            }
        })
    );
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
    console.log('[firebase-messaging-sw.js] Service worker activated');
});
