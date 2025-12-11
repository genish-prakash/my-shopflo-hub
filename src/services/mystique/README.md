# Mystique API - Customer Portal Service

Complete TypeScript API wrappers for ShopFlo's Mystique (Customer Portal) service.

## 📁 File Structure

```
mystique/
├── index.ts              # Main export file
├── types.ts              # All TypeScript interfaces
├── profileApi.ts         # Profile management APIs
├── wishlistApi.ts        # Wishlist management APIs
├── brandFollowApi.ts     # Brand follow/discovery APIs
├── ordersApi.ts          # Order tracking APIs
├── USAGE_EXAMPLES.ts     # Code examples
└── README.md             # This file
```

## 🚀 Quick Start

### Import APIs

```typescript
// Import all at once
import mystiqueApi from '@/services/mystique';

// Or import individually
import { profileApi, wishlistApi, brandFollowApi, ordersApi } from '@/services/mystique';

// Import types
import type { Profile, WishlistItem, Order } from '@/services/mystique';
```

### Basic Usage

```typescript
// Get user profile
const profile = await profileApi.getProfile();

// Add to wishlist
await wishlistApi.addToWishlist({
  merchant_id: 'merchant_123',
  product_id: 'prod_001',
  variant_id: 'var_001',
  product_title: 'T-Shirt',
  variant_title: 'Blue / L',
  product_image_url: 'https://...',
  price: 999,
  currency: 'INR',
});

// Follow a brand
await brandFollowApi.followBrand({
  merchant_id: 'merchant_123',
  brand_name: 'Nike',
});

// Get orders
const orders = await ordersApi.getOrders(0, 20);
```

## 📚 API Services

### 1. Profile API

```typescript
// Get profile
const profile = await profileApi.getProfile();

// Create profile
await profileApi.createProfile({
  phone: '+919876543210',
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  gender: 'MALE',
  // ... more fields
});

// Update profile
await profileApi.updateProfile({
  first_name: 'Jane',
  sizing_preferences: {
    shoe_size: 'UK 9',
  },
});

// Delete profile
await profileApi.deleteProfile();

// Check if exists
const exists = await profileApi.checkProfileExists();
```

### 2. Wishlist API

```typescript
// Get wishlist (paginated)
const wishlist = await wishlistApi.getWishlist(0, 20, 'merchant_123');

// Get all wishlist items
const allItems = await wishlistApi.getAllWishlist();

// Add to wishlist
await wishlistApi.addToWishlist({
  merchant_id: 'merchant_123',
  product_id: 'prod_001',
  variant_id: 'var_001',
  product_title: 'Product Name',
  variant_title: 'Size / Color',
  product_image_url: 'https://...',
  price: 999,
  currency: 'INR',
});

// Remove from wishlist
await wishlistApi.removeFromWishlist('merchant_123', 'var_001');

// Check if in wishlist
const isInWishlist = await wishlistApi.checkInWishlist('merchant_123', 'var_001');

// Get count
const count = await wishlistApi.getWishlistCount();

// Clear wishlist
await wishlistApi.clearWishlist();
```

### 3. Brand Follow API

```typescript
// Get followed brands (paginated)
const brands = await brandFollowApi.getFollowedBrands(0, 20);

// Get all followed brands
const allBrands = await brandFollowApi.getAllFollowedBrands();

// Follow brand
await brandFollowApi.followBrand({
  merchant_id: 'merchant_123',
  brand_name: 'Nike',
  brand_logo_url: 'https://...',
});

// Unfollow brand
await brandFollowApi.unfollowBrand('merchant_123');

// Check if following
const isFollowing = await brandFollowApi.checkIsFollowing('merchant_123');

// Get following count
const count = await brandFollowApi.getFollowingCount();

// Get brand followers (PUBLIC - no auth required)
const followers = await brandFollowApi.getBrandFollowersCount('merchant_123');

// Unfollow all
await brandFollowApi.unfollowAllBrands();
```

### 4. Orders API

```typescript
// Get orders (paginated)
const orders = await ordersApi.getOrders(0, 20, 'merchant_123');

// Get all orders
const allOrders = await ordersApi.getAllOrders();

// Get order by UID
const order = await ordersApi.getOrderByUid('SFO-12345');

// Create order
await ordersApi.createOrder({
  uid: 'SFO-12345',
  merchant_id: 'merchant_123',
  status: 'PROCESSING',
  amount: 2499,
  platform: 'SHOPIFY',
});

// Update order
await ordersApi.updateOrder('SFO-12345', {
  status: 'SHIPPED',
});

// Delete order
await ordersApi.deleteOrder('SFO-12345');

// Get count
const count = await ordersApi.getOrdersCount();

// Search orders
const results = await ordersApi.searchOrders('Nike', 0, 20);

// Get by status
const completed = await ordersApi.getOrdersByStatus('COMPLETED', 0, 20);
```

## 🔐 Authentication

All APIs automatically include:
- **Authorization:** `Bearer {jwt_token}` (from cookies)
- **X-SHOPFLO-REQ-ID:** `{user_id}` (extracted from JWT)

These headers are added automatically by `authenticatedApi` client.

## 🎯 React Component Examples

### With useState

```typescript
import { useState, useEffect } from 'react';
import { wishlistApi } from '@/services/mystique';

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await wishlistApi.getAllWishlist();
        setWishlist(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Wishlist ({wishlist.length})</h1>
      {wishlist.map((item) => (
        <div key={item.id}>{item.product_title}</div>
      ))}
    </div>
  );
}
```

### With React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandFollowApi } from '@/services/mystique';

function BrandsPage() {
  const queryClient = useQueryClient();

  // Fetch followed brands
  const { data: brands, isLoading } = useQuery({
    queryKey: ['followedBrands'],
    queryFn: () => brandFollowApi.getAllFollowedBrands(),
  });

  // Follow brand mutation
  const followBrand = useMutation({
    mutationFn: brandFollowApi.followBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followedBrands'] });
    },
  });

  // Unfollow brand mutation
  const unfollowBrand = useMutation({
    mutationFn: (merchantId: string) => brandFollowApi.unfollowBrand(merchantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followedBrands'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Followed Brands</h1>
      {brands?.map((brand) => (
        <div key={brand.id}>
          <span>{brand.brand_name}</span>
          <button onClick={() => unfollowBrand.mutate(brand.merchant_id)}>
            Unfollow
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Error Handling

All APIs return Promises. Handle errors with try/catch:

```typescript
try {
  const profile = await profileApi.getProfile();
  console.log('Success:', profile);
} catch (error) {
  console.error('Error:', error);
  // Handle error (show toast, etc.)
}
```

The `authenticatedApi` client automatically:
- Redirects to login on 401 (unauthorized)
- Clears auth cookies on token expiry

## 📝 TypeScript Types

All request/response types are exported:

```typescript
import type {
  Profile,
  CreateProfileRequest,
  UpdateProfileRequest,
  WishlistItem,
  AddToWishlistRequest,
  FollowedBrand,
  FollowBrandRequest,
  Order,
  OrderDetails,
  OrderTracking,
  PaginatedResponse,
  ApiResponse,
} from '@/services/mystique';
```

## 🌐 Base URL

Set your API base URL in `.env`:

```env
VITE_API_BASE_URL=https://your-ngrok-url.ngrok.io/api/v1
```

## 📖 Full Examples

See [USAGE_EXAMPLES.ts](./USAGE_EXAMPLES.ts) for comprehensive examples of all API methods.

---

**Generated from Postman Collection:** Mystique - Customer Portal API
