/**
 * Mystique - Customer Portal API
 *
 * This module exports all Mystique API services for:
 * - Shopper Profile Management
 * - Wishlist Management
 * - Brand Follow/Discovery
 * - Order Tracking
 *
 * Base URL: {{base_url}}/mystique
 *
 * Authentication: All endpoints (except public ones) require X-SHOPFLO-REQ-ID header
 * which is automatically added by the authenticatedApi client using the JWT token from cookies.
 */

// Export all API services
export { profileApi } from './profileApi';
export { wishlistApi } from './wishlistApi';
export { brandFollowApi } from './brandFollowApi';
export { ordersApi } from './ordersApi';

// Export all types
export type {
  // Common types
  ApiResponse,
  ApiError,
  PaginatedResponse,

  // Profile types
  Profile,
  CreateProfileRequest,
  UpdateProfileRequest,
  SizingPreferences,
  SkincarePreferences,
  MarketingPreferences,

  // Wishlist types
  WishlistItem,
  AddToWishlistRequest,

  // Brand Follow types
  FollowedBrand,
  FollowBrandRequest,

  // Order types
  Order,
  OrderDetails,
  OrderTracking,
  CreateOrderRequest,
  UpdateOrderRequest,
} from './types';

// Default export for convenience
import { profileApi } from './profileApi';
import { wishlistApi } from './wishlistApi';
import { brandFollowApi } from './brandFollowApi';
import { ordersApi } from './ordersApi';

export default {
  profile: profileApi,
  wishlist: wishlistApi,
  brandFollow: brandFollowApi,
  orders: ordersApi,
};
