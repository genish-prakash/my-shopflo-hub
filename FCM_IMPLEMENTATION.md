# Firebase Cloud Messaging (FCM) Push Notifications - Frontend Implementation

## 📋 Overview

This implementation provides a complete push notification system using Firebase Cloud Messaging (FCM) for your React/TypeScript PWA application.

## 🚀 Quick Start

### 1. Basic Usage with React Hook

```tsx
import { useNotifications } from "@/hooks/useNotifications";

function MyComponent() {
  const { requestPermission, isRegistered, permission, isLoading } =
    useNotifications({
      userId: "user_123",
      onForegroundMessage: (payload) => {
        console.log("Got notification:", payload);
        // Show toast or in-app notification
      },
    });

  return (
    <button onClick={requestPermission} disabled={isLoading}>
      {isRegistered ? "✓ Notifications Enabled" : "Enable Notifications"}
    </button>
  );
}
```

### 2. Using the Demo Component

```tsx
import { NotificationDemo } from "@/components/NotificationDemo";

function SettingsPage() {
  const userId = "user_123"; // Get from your auth system

  return (
    <div className="p-6">
      <h1>Notification Settings</h1>
      <NotificationDemo userId={userId} />
    </div>
  );
}
```

### 3. Manual Service Usage

```tsx
import {
  registerForNotifications,
  setupForegroundNotifications,
} from "@/services/notificationService";

// On login or app initialization
async function enableNotifications(userId: string) {
  const result = await registerForNotifications(userId);

  if (result.success) {
    console.log("FCM Token:", result.token);
    console.log("Device registered:", result.deviceToken);
  }
}

// Listen for foreground messages
setupForegroundNotifications((payload) => {
  console.log("Notification received:", payload);
  // Show in-app notification
});
```

## 📁 File Structure

```
src/
├── lib/
│   └── firebase.ts                 # Firebase initialization & config
├── services/
│   └── notificationService.ts     # Core notification service
├── hooks/
│   └── useNotifications.ts        # React hook for notifications
└── components/
    └── NotificationDemo.tsx       # Demo component with UI

public/
└── firebase-messaging-sw.js       # Service worker for background notifications
```

## 🔧 Core Functions

### notificationService.ts

| Function                                      | Description                                                  |
| --------------------------------------------- | ------------------------------------------------------------ |
| `registerForNotifications(userId)`            | Complete registration flow - permission + token registration |
| `unregisterFromNotifications(userId, token?)` | Unregister device (e.g., on logout)                          |
| `subscribeToTopic(userId, topic)`             | Subscribe to a notification topic                            |
| `unsubscribeFromTopic(userId, topic)`         | Unsubscribe from a topic                                     |
| `sendTestNotification(userId, payload)`       | Send test notification to self                               |
| `setupForegroundNotifications(callback)`      | Listen for foreground messages                               |

## 🎯 Common Use Cases

### 1. Enable Notifications on Login

```tsx
import { registerForNotifications } from "@/services/notificationService";

async function handleLogin(userId: string) {
  // ... your login logic ...

  // Ask user to enable notifications
  const result = await registerForNotifications(userId);

  if (result.success) {
    console.log("Notifications enabled!");
  }
}
```

### 2. Disable Notifications on Logout

```tsx
import { unregisterFromNotifications } from "@/services/notificationService";

async function handleLogout(userId: string) {
  // Unregister notifications
  await unregisterFromNotifications(userId);

  // ... your logout logic ...
}
```

### 3. Subscribe to Product Category

```tsx
import { subscribeToTopic } from "@/services/notificationService";

async function followCategory(userId: string, category: string) {
  const success = await subscribeToTopic(userId, `category-${category}`);

  if (success) {
    console.log(`Subscribed to ${category} notifications`);
  }
}
```

### 4. Show Foreground Notifications

```tsx
import { setupForegroundNotifications } from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";

function App() {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = setupForegroundNotifications((payload) => {
      // Show toast when app is in foreground
      toast({
        title: payload.notification?.title,
        description: payload.notification?.body,
      });
    });

    return () => unsubscribe?.();
  }, []);

  return <YourApp />;
}
```

## 🔔 Notification Payload Structure

### Backend to Frontend

When sending notifications from backend, use this structure:

```json
{
  "title": "Order Shipped! 📦",
  "body": "Your order #12345 has been shipped and is on its way!",
  "image_url": "https://cdn.shopflo.com/products/image.jpg",
  "click_action": "https://yourstore.com/orders/12345",
  "data": {
    "order_id": "12345",
    "type": "ORDER_SHIPPED",
    "custom_field": "value"
  }
}
```

### Received Payload (Frontend)

```typescript
{
  notification: {
    title: "Order Shipped! 📦",
    body: "Your order #12345 has been shipped...",
    image: "https://cdn.shopflo.com/products/image.jpg",
    click_action: "https://yourstore.com/orders/12345"
  },
  data: {
    order_id: "12345",
    type: "ORDER_SHIPPED",
    custom_field: "value"
  }
}
```

## 🛠 Advanced Usage

### Custom Hook Implementation

```tsx
import { useNotifications } from "@/hooks/useNotifications";

function NotificationSettings() {
  const {
    isSupported, // Browser support check
    permission, // 'default' | 'granted' | 'denied'
    isRegistered, // Is user registered for notifications?
    isLoading, // Is an operation in progress?
    error, // Error message if any
    fcmToken, // FCM token (null if not registered)
    requestPermission,
    unregister,
    subscribeTopic,
    unsubscribeTopic,
    sendTest,
  } = useNotifications({
    userId: "user_123",
    autoRegister: false, // Auto-request on mount (default: false)
    onForegroundMessage: (payload) => {
      // Handle incoming notification while app is open
      console.log("Notification received:", payload);
    },
  });

  // Your UI here...
}
```

### Topic-Based Notifications

```tsx
// Subscribe to multiple topics
const topics = ["flash-sales", "new-products", "price-drops"];

for (const topic of topics) {
  await subscribeToTopic(userId, topic);
}

// Unsubscribe from all topics
for (const topic of topics) {
  await unsubscribeFromTopic(userId, topic);
}
```

## 📱 Testing Notifications

### 1. Using the Demo Component

Import and render `<NotificationDemo userId="your_user_id" />` to get a full testing UI.

### 2. Using Browser DevTools

1. Open DevTools → Application → Service Workers
2. Check if `firebase-messaging-sw.js` is registered
3. Go to Application → Storage → IndexedDB → Check Firebase tokens

### 3. Using cURL

```bash
# Send test notification via backend
curl -X POST 'https://api.shopflo.com/mystique/api/v1/notifications/send' \
  -H 'Content-Type: application/json' \
  -H 'X-SHOPFLO-USER-ID: user_123' \
  -d '{
    "title": "Test Notification! 🔔",
    "body": "This is a test from cURL",
    "click_action": "https://yourstore.com",
    "data": { "type": "TEST" }
  }'
```

## 🔐 Permission States

| State     | Description                 | Action                                          |
| --------- | --------------------------- | ----------------------------------------------- |
| `default` | User hasn't been asked yet  | Show permission request UI                      |
| `granted` | User has granted permission | Can send notifications ✅                       |
| `denied`  | User has denied permission  | Show instructions to enable in browser settings |

## 🐛 Troubleshooting

### Service Worker Not Registering

1. Make sure `firebase-messaging-sw.js` is in the `/public` folder
2. Check browser console for errors
3. Verify service workers are enabled in DevTools

### Notifications Not Appearing

1. Check notification permission: `Notification.permission`
2. Verify FCM token is registered with backend
3. Check browser notification settings (OS level)
4. Test in incognito mode to rule out extension conflicts

### Background Notifications Not Working

1. Service worker must be registered and active
2. Check DevTools → Application → Service Workers
3. Verify `firebase-messaging-sw.js` has correct Firebase config

## 📊 Backend API Endpoints

| Endpoint                                                   | Method | Description              |
| ---------------------------------------------------------- | ------ | ------------------------ |
| `/mystique/api/v1/notifications/token`                     | POST   | Register device token    |
| `/mystique/api/v1/notifications/token`                     | DELETE | Unregister device token  |
| `/mystique/api/v1/notifications/tokens`                    | GET    | Get user's device tokens |
| `/mystique/api/v1/notifications/send`                      | POST   | Send test notification   |
| `/mystique/api/v1/notifications/topic/{topic}/subscribe`   | POST   | Subscribe to topic       |
| `/mystique/api/v1/notifications/topic/{topic}/unsubscribe` | POST   | Unsubscribe from topic   |

All endpoints require header: `X-SHOPFLO-USER-ID: <user_id>`

## 🎨 UI Integration Examples

### Simple Button

```tsx
function EnableNotificationsButton() {
  const { requestPermission, isRegistered, isLoading } = useNotifications({
    userId: "user_123",
  });

  if (isRegistered) return null; // Hide if already enabled

  return (
    <button onClick={requestPermission} disabled={isLoading}>
      {isLoading ? "Enabling..." : "🔔 Enable Notifications"}
    </button>
  );
}
```

### Settings Toggle

```tsx
function NotificationToggle() {
  const { isRegistered, requestPermission, unregister } = useNotifications({
    userId: "user_123",
  });

  return (
    <Switch
      checked={isRegistered}
      onCheckedChange={(checked) => {
        if (checked) requestPermission();
        else unregister();
      }}
    />
  );
}
```

## 🔄 Migration & Deployment

### Before Deployment

1. ✅ Firebase credentials configured in `.env` (not committed)
2. ✅ Service worker file in `/public/firebase-messaging-sw.js`
3. ✅ Backend endpoints configured and working
4. ✅ Test notifications working locally

### Environment Variables (Optional)

If you want to make Firebase config environment-specific:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other config
```

Then update `src/lib/firebase.ts` to use these variables.

## 📚 Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications](https://web.dev/push-notifications-overview/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## ✅ Implementation Checklist

- [x] Install Firebase SDK
- [x] Create Firebase config file
- [x] Create service worker
- [x] Create notification service
- [x] Create React hook
- [x] Create demo component
- [ ] Integrate with your auth system
- [ ] Add notification UI to your app
- [ ] Test on multiple browsers
- [ ] Deploy and test in production

---

**🎉 You're all set!** Start by importing the `useNotifications` hook or `NotificationDemo` component into your app.
