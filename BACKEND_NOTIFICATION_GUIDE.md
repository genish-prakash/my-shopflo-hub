# 📬 Backend Integration Guide - Rich Notifications

## FCM Payload Structure

Your backend should send notifications with this structure:

```json
{
  "token": "user_device_fcm_token",
  "notification": {
    "title": "New Collection Arrived!",
    "body": "Check out our summer collection",
    "image": "https://cdn.example.com/images/summer-collection.jpg"
  },
  "data": {
    "notification_content": "{...rich notification JSON string...}",
    "notification_type": "MEDIA",
    "custom_key": "custom_value"
  },
  "fcmOptions": {
    "link": "https://example.com/collections/summer"
  }
}
```

**Key Points:**

- ✅ `notification` - FCM standard notification (what shows in notification tray)
- ✅ `data.notification_content` - JSON string of your rich notification object
- ✅ `data.notification_type` - Type identifier (TEXT, MEDIA, CAROUSEL, etc.)
- ✅ `fcmOptions.link` - Fallback click action URL

---

## 📝 Notification Type Examples

### 1. TEXT Notification

```json
{
  "token": "user_token",
  "notification": {
    "title": "Order Shipped! 📦",
    "body": "Your order #12345 has been shipped"
  },
  "data": {
    "notification_content": "{\"type\":\"TEXT\",\"title\":\"Order Shipped! 📦\",\"body\":\"Your order #12345 has been shipped and will arrive by tomorrow.\",\"click_action\":\"https://example.com/orders/12345\"}",
    "notification_type": "TEXT"
  }
}
```

---

### 2. MEDIA Notification (Image/Video/GIF)

```json
{
  "token": "user_token",
  "notification": {
    "title": "New Collection Arrived!",
    "body": "Check out our summer collection",
    "image": "https://cdn.example.com/images/summer-collection.jpg"
  },
  "data": {
    "notification_content": "{\"type\":\"MEDIA\",\"title\":\"New Collection Arrived!\",\"body\":\"Check out our summer collection\",\"media_url\":\"https://cdn.example.com/images/summer-collection.jpg\",\"media_type\":\"IMAGE\",\"thumbnail_url\":\"https://cdn.example.com/images/summer-collection-thumb.jpg\",\"caption\":\"Summer vibes only ☀️\",\"click_action\":\"https://example.com/collections/summer\"}",
    "notification_type": "MEDIA"
  },
  "fcmOptions": {
    "link": "https://example.com/collections/summer"
  }
}
```

**Media Types:** `IMAGE`, `VIDEO`, `GIF`

---

### 3. CAROUSEL Notification (Swipeable Items)

```json
{
  "token": "user_token",
  "notification": {
    "title": "Recommended For You",
    "body": "Based on your recent browsing"
  },
  "data": {
    "notification_content": "{\"type\":\"CAROUSEL\",\"title\":\"Recommended For You\",\"body\":\"Based on your recent browsing\",\"items\":[{\"title\":\"Nike Air Max 90\",\"subtitle\":\"₹12,999\",\"image_url\":\"https://cdn.example.com/products/nike-airmax.jpg\",\"click_action\":\"https://example.com/products/nike-airmax-90\",\"buttons\":[{\"text\":\"Buy Now\",\"action\":\"https://example.com/cart/add/nike-airmax-90\",\"button_type\":\"LINK\"}]},{\"title\":\"Adidas Ultraboost\",\"subtitle\":\"₹15,499\",\"image_url\":\"https://cdn.example.com/products/adidas-ultraboost.jpg\",\"click_action\":\"https://example.com/products/adidas-ultraboost\",\"buttons\":[{\"text\":\"Buy Now\",\"action\":\"https://example.com/cart/add/adidas-ultraboost\",\"button_type\":\"LINK\"}]}]}",
    "notification_type": "CAROUSEL"
  }
}
```

---

### 4. LIST Notification (Vertical List)

```json
{
  "token": "user_token",
  "notification": {
    "title": "Your Recent Orders",
    "body": "Track your orders"
  },
  "data": {
    "notification_content": "{\"type\":\"LIST\",\"title\":\"Your Recent Orders\",\"body\":\"Track your orders\",\"header_image_url\":\"https://cdn.example.com/banners/orders-header.jpg\",\"items\":[{\"title\":\"Order #ORD-78901\",\"subtitle\":\"Delivered on Dec 10, 2025\",\"image_url\":\"https://cdn.example.com/products/item1-thumb.jpg\",\"click_action\":\"https://example.com/orders/78901\",\"metadata\":\"₹2,499\"},{\"title\":\"Order #ORD-78845\",\"subtitle\":\"Out for delivery\",\"image_url\":\"https://cdn.example.com/products/item2-thumb.jpg\",\"click_action\":\"https://example.com/orders/78845\",\"metadata\":\"₹1,299\"}],\"footer_button\":{\"text\":\"View All Orders\",\"action\":\"https://example.com/orders\",\"button_type\":\"LINK\"}}",
    "notification_type": "LIST"
  }
}
```

---

### 5. POLL Notification (Interactive Survey)

```json
{
  "token": "user_token",
  "notification": {
    "title": "Quick Poll",
    "body": "Help us improve your shopping experience"
  },
  "data": {
    "notification_content": "{\"type\":\"POLL\",\"question\":\"What type of products would you like to see more of?\",\"body\":\"Help us improve your shopping experience\",\"poll_id\":\"poll_dec_2025_001\",\"image_url\":\"https://cdn.example.com/banners/feedback-banner.jpg\",\"allow_multiple_selection\":false,\"expires_at\":\"2025-12-20T23:59:59Z\",\"options\":[{\"id\":\"opt_1\",\"text\":\"Electronics & Gadgets\",\"image_url\":\"https://cdn.example.com/icons/electronics.png\"},{\"id\":\"opt_2\",\"text\":\"Fashion & Apparel\",\"image_url\":\"https://cdn.example.com/icons/fashion.png\"},{\"id\":\"opt_3\",\"text\":\"Home & Kitchen\",\"image_url\":\"https://cdn.example.com/icons/home.png\"}]}",
    "notification_type": "POLL"
  }
}
```

---

### 6. CARD Notification (Rich Card)

```json
{
  "token": "user_token",
  "notification": {
    "title": "Your Cart is Waiting!",
    "body": "3 items • ₹4,999"
  },
  "data": {
    "notification_content": "{\"type\":\"CARD\",\"title\":\"Your Cart is Waiting!\",\"subtitle\":\"Complete your purchase\",\"body\":\"You have 3 items worth ₹4,999 in your cart. Complete your order now and get free shipping!\",\"image_url\":\"https://cdn.example.com/carts/user123-preview.jpg\",\"header_image_url\":\"https://cdn.example.com/banners/cart-reminder.jpg\",\"click_action\":\"https://example.com/cart\",\"style\":\"HERO\",\"buttons\":[{\"text\":\"Checkout Now\",\"action\":\"https://example.com/checkout\",\"button_type\":\"LINK\",\"icon_url\":\"https://cdn.example.com/icons/cart.png\"},{\"text\":\"View Cart\",\"action\":\"https://example.com/cart\",\"button_type\":\"LINK\"}]}",
    "notification_type": "CARD"
  }
}
```

**Card Styles:** `STANDARD`, `COMPACT`, `HERO`, `HORIZONTAL`

---

### 7. PROMOTIONAL Notification (Sales/Coupons)

```json
{
  "token": "user_token",
  "notification": {
    "title": "Flash Sale! 🔥",
    "body": "Up to 70% OFF on everything!"
  },
  "data": {
    "notification_content": "{\"type\":\"PROMOTIONAL\",\"title\":\"Flash Sale! 🔥\",\"body\":\"Biggest sale of the year - Up to 70% OFF on everything!\",\"image_url\":\"https://cdn.example.com/promos/flash-sale-square.jpg\",\"banner_url\":\"https://cdn.example.com/promos/flash-sale-banner.jpg\",\"coupon_code\":\"FLASH70\",\"discount_text\":\"FLAT 70% OFF\",\"discount_value\":70,\"discount_type\":\"PERCENTAGE\",\"minimum_order_value\":999,\"valid_from\":\"2025-12-12T00:00:00Z\",\"valid_until\":\"2025-12-12T23:59:59Z\",\"terms_and_conditions\":\"Valid on orders above ₹999. Max discount ₹2000. Not applicable on certain brands.\",\"click_action\":\"https://example.com/sale/flash\",\"buttons\":[{\"text\":\"Shop Now\",\"action\":\"https://example.com/sale/flash\",\"button_type\":\"LINK\"},{\"text\":\"Copy Code\",\"action\":\"copy:FLASH70\",\"button_type\":\"ACTION\"}]}",
    "notification_type": "PROMOTIONAL"
  }
}
```

**Discount Types:** `PERCENTAGE`, `FLAT`, `BOGO`, `FREE_SHIPPING`

---

## 🔧 Backend Implementation (Node.js Example)

```javascript
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Helper function to send rich notification
async function sendRichNotification(userToken, richNotificationData) {
  const message = {
    token: userToken,
    notification: {
      title: richNotificationData.title,
      body: richNotificationData.body,
      image: richNotificationData.image_url || richNotificationData.banner_url,
    },
    data: {
      notification_content: JSON.stringify(richNotificationData),
      notification_type: richNotificationData.type,
    },
    fcmOptions: {
      link: richNotificationData.click_action || "/",
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent notification:", response);
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

// Example: Send PROMOTIONAL notification
const promotionalNotification = {
  type: "PROMOTIONAL",
  title: "Flash Sale! 🔥",
  body: "Biggest sale of the year - Up to 70% OFF on everything!",
  banner_url: "https://cdn.example.com/promos/flash-sale.jpg",
  coupon_code: "FLASH70",
  discount_text: "FLAT 70% OFF",
  discount_value: 70,
  discount_type: "PERCENTAGE",
  minimum_order_value: 999,
  valid_until: "2025-12-31T23:59:59Z",
  click_action: "https://example.com/sale",
  buttons: [
    {
      text: "Shop Now",
      action: "https://example.com/sale",
      button_type: "LINK",
    },
    {
      text: "Copy Code",
      action: "copy:FLASH70",
      button_type: "ACTION",
    },
  ],
};

await sendRichNotification(userDeviceToken, promotionalNotification);
```

---

## ✅ Button Types

All notification types support action buttons:

| Type       | Description                      | Example Action                     |
| ---------- | -------------------------------- | ---------------------------------- |
| `LINK`     | Opens URL in browser             | `https://yourapp.com/products/123` |
| `DEEPLINK` | Opens app at specific screen     | `yourapp://products/123`           |
| `ACTION`   | Custom actions (e.g., copy code) | `copy:COUPONCODE`                  |
| `DISMISS`  | Closes notification              | `dismiss`                          |

---

## 🎯 Best Practices

### 1. Optimize Images

- Use CDN for all images
- Compress images (WebP format recommended)
- Max size: 1MB for notification images
- Provide thumbnails for large media

### 2. Keep Content Concise

- Titles: 40 characters max
- Body: 100 characters max for mobile
- Use emojis sparingly for visual appeal

### 3. Deep Linking

- Always provide `click_action` URLs
- Use app deep links when possible
- Test all URLs before sending

### 4. Timing

- Respect user time zones
- Avoid sending at night (10pm - 8am)
- Space out promotional notifications

### 5. Personalization

- Use user data to customize content
- Send relevant product recommendations
- Segment users for targeted campaigns

---

## 📊 Notification Priority

Set priority based on notification type:

```javascript
{
  android: {
    priority: 'high', // For time-sensitive (orders, OTP)
    // or
    priority: 'normal' // For marketing (sales, recommendations)
  },
  apns: {
    headers: {
      'apns-priority': '10' // High priority (iOS)
      // or
      'apns-priority': '5' // Normal priority (iOS)
    }
  }
}
```

---

## 🧪 Testing

### Test Payload (Minimal)

```json
{
  "token": "your_test_token",
  "notification": {
    "title": "Test",
    "body": "This is a test"
  },
  "data": {
    "notification_content": "{\"type\":\"TEXT\",\"title\":\"Test\",\"body\":\"This is a test\"}",
    "notification_type": "TEXT"
  }
}
```

### Using Firebase Console

1. Go to Firebase Console → Cloud Messaging
2. Click "Send your first message"
3. Add title and text
4. Under "Additional options" → "Custom data"
5. Add key: `notification_content`, value: `{...json...}`

---

## 🔍 Debugging

Check browser console for:

```
[SW] Notification saved to localStorage: {...}
Foreground notification received: {...}
Parsed rich notification from notification_content: {...}
```

If not working:

1. Verify `notification_content` is a valid JSON string
2. Check all required fields for notification type
3. Ensure images are accessible (no CORS issues)
4. Test with simple TEXT notification first

---

Your rich notifications are now ready to use! 🎉
