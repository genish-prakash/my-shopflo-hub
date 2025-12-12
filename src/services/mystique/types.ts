/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================
// Common Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  total_items: number;
  total_pages: number;
  has_more?: boolean;
}

// ============================================
// Profile Types
// ============================================

export interface SizingPreferences {
  shoe_size?: string;
  shirt_size?: string;
  pants_size?: string;
}

export interface SkincarePreferences {
  skin_type?: "OILY" | "DRY" | "COMBINATION" | "NORMAL" | "SENSITIVE";
  skin_undertone?: "WARM" | "COOL" | "NEUTRAL";
  skin_tone?: "FAIR" | "LIGHT" | "MEDIUM" | "OLIVE" | "BROWN" | "DARK";
}

export interface MarketingPreferences {
  whatsapp_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  rcs_enabled: boolean;
}

export interface ShippingPreferences {
  default_address_type?: "HOME" | "OFFICE";
  preferred_delivery_time?: "MORNING" | "AFTERNOON" | "EVENING";
}

export interface HairPreferences {
  hair_type?: "STRAIGHT" | "WAVY" | "CURLY" | "COILY";
  scalp_type?: "OILY" | "DRY" | "NORMAL" | "SENSITIVE";
  hair_texture?: "FINE" | "MEDIUM" | "THICK";
}

export interface Profile {
  id: string;
  user_id: string;
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  birthday?: string;
  profile_image_url?: string;
  sizing_preferences?: SizingPreferences;
  skincare_preferences?: SkincarePreferences;
  hair_preferences?: HairPreferences;
  shipping_preferences?: ShippingPreferences;
  marketing_preferences?: MarketingPreferences;
  is_active?: boolean;
  created_at: number;
  modified_at: number;
}

export interface CreateProfileRequest {
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  birthday?: string;
  profile_image_url?: string;
  sizing_preferences?: SizingPreferences;
  skincare_preferences?: SkincarePreferences;
  hair_preferences?: HairPreferences;
  shipping_preferences?: ShippingPreferences;
  marketing_preferences?: MarketingPreferences;
}

export interface UpdateProfileRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  birthday?: string;
  profile_image_url?: string;
  sizing_preferences?: SizingPreferences;
  skincare_preferences?: SkincarePreferences;
  hair_preferences?: HairPreferences;
  shipping_preferences?: ShippingPreferences;
  marketing_preferences?: MarketingPreferences;
}

// ============================================
// Wishlist Types
// ============================================

export interface WishlistItem {
  id: string;
  user_id: string;
  merchant_id: string;
  product_id: string;
  variant_id: string;
  product_title: string;
  variant_title: string;
  product_image_url: string;
  price: number;
  compare_at_price?: number;
  currency: string;
  is_active?: boolean;
  created_at: number;
}

export interface AddToWishlistRequest {
  merchant_id: string;
  product_id: string;
  variant_id: string;
  product_title: string;
  variant_title: string;
  product_image_url: string;
  price: number;
  compare_at_price?: number;
  currency: string;
}

// ============================================
// Brand Follow Types
// ============================================

export interface FollowedBrand {
  id: string;
  user_id: string;
  merchant_id: string;
  brand_name: string;
  brand_logo_url?: string;
  followed_at: number;
  is_active?: boolean;
}

export interface FollowBrandRequest {
  merchant_id: string;
  brand_name: string;
  brand_logo_url?: string;
}

// ============================================
// Order Types
// ============================================

export interface OrderTracking {
  status: string;
  shipment_status?: string;
  tracking_company?: string;
  tracking_url?: string;
  tracking_number?: string;
  estimated_delivery?: number;
  delivered_at?: number;
}

export interface Order {
  id: string;
  uid: string;
  merchant_id: string;
  status: string;
  amount: number;
  platform: string;
  checkout_id?: string;
  order_type?: string;
  is_draft_order?: boolean;
  created_at: number;
  tracking?: OrderTracking;
  has_more?: boolean;
}

export interface OrderDetails extends Order {
  line_items?: any[];
  shipping_address?: any;
  billing_address?: any;
  customer?: any;
  payment_details?: any;
}

export interface CreateOrderRequest {
  uid: string;
  merchant_id: string;
  status: string;
  amount: number;
  platform: string;
  checkout_id?: string;
  order_type?: string;
  is_draft_order?: boolean;
}

export interface UpdateOrderRequest {
  status?: string;
  amount?: number;
  tracking?: OrderTracking;
}

// ============================================
// Discover Types
// ============================================

export interface DiscoverProduct {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image: string;
  in_stock: boolean;
  is_on_sale: boolean;
  created_at?: number;
  sales_count?: number | null;
}

export interface DiscoverBrand {
  id: string;
  merchant_id: string;
  name: string;
  logo: string;
  color: string;
  tagline: string;
  category: string;
  is_followed: boolean;
  is_sponsored: boolean;
  follower_count: number;
  products: DiscoverProduct[];
  website?: string;
  shop_domain?: string;
  shopData?: {
    domain?: string;
  };
  is_wishlisted: boolean;
}

export interface DiscoverResponse {
  brands: DiscoverBrand[];
  categories: string[];
  total_brands: number;
  current_page: number;
  total_pages: number;
  has_more: boolean;
}
export interface Coupon {
  coupon_id: string;
  merchant_id: string;
  code: string;
  description: string;
  long_description: string[];
  header: string;
  title: string;
  start_date: number;
  end_date: number;
  concession_amount: number;
  maximum_concession_amount: number;
  coupon_type: string;
  amount_type: string;
  prerequisite_subtotal_range?: {
    greater_than_or_equal_to: number;
  };
  tags: string[];
  weight: number;
  created_at: number;
  is_active: boolean;
  is_auto_applicable: boolean;
}

export interface DiscoverCouponsResponse {
  success: boolean;
  data: Coupon[];
  current_page: number;
  page_size: number;
  max_pages: number;
  total_count: number;
}
