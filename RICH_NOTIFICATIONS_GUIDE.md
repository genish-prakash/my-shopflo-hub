# 🎨 Rich Notifications - Implementation Guide

## Overview

Your app now supports **7 types of rich notifications** with interactive content beyond simple text. Each type is optimized for different use cases.

---

## 📋 Notification Types

### 1. **TEXT** 📝 (Simple Text)

Basic text notification with optional click action.

**Use Cases:**

- Order updates
- Simple alerts
- Reminders

**Payload:**

```json
{
  "type": "TEXT",
  "title": "Order Shipped! 📦",
  "body": "Your order #12345 has been shipped",
  "click_action": "https://yourapp.com/orders/12345"
}
```

---

### 2. **MEDIA** 🖼️ (Image/Video/GIF)

Rich media notification with image, video, or GIF.

**Use Cases:**

- New product launches
- Visual announcements
- Content shares

**Payload:**

```json
{
  "type": "MEDIA",
  "title": "New Collection Arrived!",
  "body": "Check out our summer collection",
  "media_url": "https://cdn.example.com/summer.jpg",
  "media_type": "IMAGE",
  "caption": "Summer vibes only ☀️",
  "click_action": "https://yourapp.com/collections/summer"
}
```

**Media Types:** `IMAGE` | `VIDEO` | `GIF`

---

### 3. **CAROUSEL** 🎠 (Multiple Items)

Swipeable carousel of products/items.

**Use Cases:**

- Product recommendations
- Multiple offers
- Image galleries

**Payload:**

```json
{
  "type": "CAROUSEL",
  "title": "Recommended For You",
  "body": "Based on your shopping history",
  "items": [
    {
      "title": "Nike Air Max",
      "subtitle": "₹12,999",
      "image_url": "https://cdn.example.com/nike.jpg",
      "buttons": [
        {
          "text": "Buy Now",
          "action": "https://yourapp.com/products/nike",
          "button_type": "LINK"
        }
      ]
    }
  ]
}
```

**Features:**

- Swipe left/right to navigate
- Multiple action buttons per item
- Auto-dots indicator

---

### 4. **LIST** 📋 (List of Items)

Vertical list of items with optional images.

**Use Cases:**

- Order history
- Wishlist updates
- Activity logs

**Payload:**

```json
{
  "type": "LIST",
  "title": "Your Recent Orders",
  "items": [
    {
      "title": "Order #12345",
      "subtitle": "Delivered",
      "image_url": "https://cdn.example.com/thumb.jpg",
      "metadata": "₹2,499"
    }
  ],
  "footer_button": {
    "text": "View All",
    "action": "https://yourapp.com/orders",
    "button_type": "LINK"
  }
}
```

---

### 5. **POLL** 📊 (Interactive Poll)

Collect user feedback with interactive polls.

**Use Cases:**

- User surveys
- Product preferences
- Feedback collection

**Payload:**

```json
{
  "type": "POLL",
  "question": "What products do you want to see?",
  "poll_id": "poll_001",
  "allow_multiple_selection": false,
  "options": [
    {
      "id": "opt_1",
      "text": "Electronics"
    },
    {
      "id": "opt_2",
      "text": "Fashion"
    }
  ]
}
```

**Features:**

- Single or multiple selection
- Visual feedback on selection
- Submit button
- Results tracking

---

### 6. **CARD** 🃏 (Rich Card)

Flexible card with image, text, and multiple buttons.

**Use Cases:**

- Cart reminders
- Feature announcements
- Complex CTAs

**Payload:**

```json
{
  "type": "CARD",
  "title": "Your Cart is Waiting!",
  "subtitle": "3 items • ₹4,999",
  "body": "Complete your order for free shipping",
  "image_url": "https://cdn.example.com/cart.jpg",
  "style": "HERO",
  "buttons": [
    {
      "text": "Checkout",
      "action": "https://yourapp.com/checkout",
      "button_type": "LINK"
    },
    {
      "text": "Dismiss",
      "action": "dismiss",
      "button_type": "DISMISS"
    }
  ]
}
```

**Styles:** `STANDARD` | `COMPACT` | `HERO` | `HORIZONTAL`

---

### 7. **PROMOTIONAL** 🎁 (Sale/Coupon)

Special promotional notification with coupon codes.

**Use Cases:**

- Flash sales
- Discount codes
- Limited offers

**Payload:**

```json
{
  "type": "PROMOTIONAL",
  "title": "Flash Sale! 🔥",
  "body": "Up to 70% OFF on everything",
  "coupon_code": "FLASH70",
  "discount_text": "FLAT 70% OFF",
  "discount_value": 70,
  "discount_type": "PERCENTAGE",
  "minimum_order_value": 999,
  "valid_until": "2025-12-31T23:59:59Z",
  "buttons": [
    {
      "text": "Shop Now",
      "action": "https://yourapp.com/sale",
      "button_type": "LINK"
    },
    {
      "text": "Copy Code",
      "action": "copy:FLASH70",
      "button_type": "ACTION"
    }
  ]
}
```

**Discount Types:** `PERCENTAGE` | `FLAT` | `BOGO` | `FREE_SHIPPING`

---

## 🎯 Button Types

All buttons support these types:

| Type       | Description         | Example Action           |
| ---------- | ------------------- | ------------------------ |
| `LINK`     | Opens URL           | `https://yourapp.com`    |
| `DEEPLINK` | Opens app deep link | `yourapp://products/123` |
| `ACTION`   | Custom actions      | `copy:CODE123`           |
| `DISMISS`  | Closes notification | `dismiss`                |

### Special Actions

- **Copy to clipboard:** `copy:TEXT_TO_COPY`
- **Dismiss:** `dismiss`
- **Custom:** Any string your app can handle

---

## 💻 Usage in Your App

### 1. **Import Components**

```tsx
import { RichNotificationCard } from "@/components/RichNotificationCard";
import type { RichNotification } from "@/types/notifications";
```

### 2. **Render Notification**

```tsx
function NotificationContainer({
  notification,
}: {
  notification: RichNotification;
}) {
  return (
    <RichNotificationCard
      notification={notification}
      onDismiss={() => console.log("Dismissed")}
      onAction={(action, type) => {
        console.log("Action:", action, type);
        // Handle custom actions
      }}
    />
  );
}
```

### 3. **Handle FCM Payload**

```tsx
import { setupForegroundNotifications } from "@/services/notificationService";

setupForegroundNotifications((payload) => {
  // payload.data contains your rich notification
  const richNotification: RichNotification = JSON.parse(
    payload.data.notification
  );

  // Show in your UI
  showRichNotification(richNotification);
});
```

---

## 📱 Backend Integration

### Sending from Backend

```typescript
// Example: Send promotional notification
const notification = {
  type: "PROMOTIONAL",
  title: "Flash Sale! 🔥",
  body: "70% OFF everything",
  coupon_code: "FLASH70",
  discount_value: 70,
  discount_type: "PERCENTAGE",
  buttons: [
    {
      text: "Shop Now",
      action: "https://yourapp.com/sale",
      button_type: "LINK",
    },
  ],
};

// Send via FCM
await fcm.send({
  token: userDeviceToken,
  notification: {
    title: notification.title,
    body: notification.body,
  },
  data: {
    notification: JSON.stringify(notification),
  },
});
```

---

## 🧪 Testing

### 1. **Demo Page**

Visit `/rich-notifications-demo` to test all notification types interactively.

```tsx
// Add to your routes
import RichNotificationsDemo from "@/pages/RichNotificationsDemo";

{
  path: "/rich-notifications-demo",
  element: <RichNotificationsDemo />
}
```

### 2. **Test Individual Types**

```tsx
import { RichNotificationCard } from "@/components/RichNotificationCard";

const testNotification = {
  type: "TEXT",
  title: "Test",
  body: "This is a test",
};

<RichNotificationCard notification={testNotification} />;
```

---

## 🎨 Customization

### Styling

All components use your existing design system:

- `Card` component
- `Button` component
- Tailwind classes
- Theme colors

### Custom Actions

Handle custom button actions:

```tsx
<RichNotificationCard
  notification={notification}
  onAction={(action, type) => {
    if (action.startsWith("custom:")) {
      // Handle your custom action
      const customData = action.replace("custom:", "");
      handleCustomAction(customData);
    }
  }}
/>
```

---

## 📊 Analytics

Track notification interactions:

```tsx
<RichNotificationCard
  notification={notification}
  onAction={(action, type) => {
    // Track with your analytics
    analytics.track("notification_action", {
      notification_type: notification.type,
      action_type: type,
      action_url: action,
    });
  }}
  onDismiss={() => {
    analytics.track("notification_dismissed", {
      notification_type: notification.type,
    });
  }}
/>
```

---

## 🔗 Files Created

- `src/types/notifications.ts` - TypeScript types
- `src/components/RichNotificationCard.tsx` - React components
- `src/pages/RichNotificationsDemo.tsx` - Interactive demo

---

## ✨ Best Practices

### 1. **Choose the Right Type**

- **Simple updates?** → TEXT
- **New products?** → MEDIA or CAROUSEL
- **Orders/Lists?** → LIST
- **Discounts?** → PROMOTIONAL
- **Need feedback?** → POLL
- **Complex CTA?** → CARD

### 2. **Keep It Concise**

- Titles: 40 characters max
- Body: 100 characters max for mobile
- Use emojis sparingly

### 3. **Optimize Images**

- Use CDN for images
- Compress images (WebP format)
- Provide thumbnails for large media
- Max size: 1MB

### 4. **Test on Mobile**

- Test all notification types on actual devices
- Check image loading
- Verify button actions
- Test carousel swipe gestures

---

## 🎉 You're All Set!

Your app now supports rich, interactive notifications that go way beyond simple text. Users will love the engaging experience! 🚀

**Try the demo:** Navigate to `/rich-notifications-demo` to see all types in action.
