/**
 * Mystique API Usage Examples
 *
 * This file demonstrates how to use the Mystique API wrappers in your components.
 * Copy these examples and adapt them to your needs.
 */

import { profileApi, wishlistApi, brandFollowApi, ordersApi } from './index';
import type {
  CreateProfileRequest,
  UpdateProfileRequest,
  AddToWishlistRequest,
  FollowBrandRequest,
} from './index';

// ============================================
// PROFILE API EXAMPLES
// ============================================

/**
 * Example: Get user profile
 */
export const getProfileExample = async () => {
  try {
    const profile = await profileApi.getProfile();
    console.log('Profile:', profile);
    return profile;
  } catch (error) {
    console.error('Failed to get profile:', error);
    throw error;
  }
};

/**
 * Example: Create new profile
 */
export const createProfileExample = async () => {
  const profileData: CreateProfileRequest = {
    phone: '+919876543210',
    email: 'john.doe@example.com',
    first_name: 'John',
    last_name: 'Doe',
    gender: 'MALE',
    birthday: '1990-05-15',
    sizing_preferences: {
      shoe_size: 'UK 9',
      shirt_size: 'L',
      pants_size: '32',
    },
    skincare_preferences: {
      skin_type: 'OILY',
      skin_undertone: 'WARM',
      skin_tone: 'MEDIUM',
    },
    marketing_preferences: {
      whatsapp_enabled: true,
      email_enabled: true,
      push_enabled: false,
      rcs_enabled: false,
    },
  };

  try {
    const profile = await profileApi.createProfile(profileData);
    console.log('Profile created:', profile);
    return profile;
  } catch (error) {
    console.error('Failed to create profile:', error);
    throw error;
  }
};

/**
 * Example: Update profile
 */
export const updateProfileExample = async () => {
  const updates: UpdateProfileRequest = {
    first_name: 'John',
    last_name: 'Smith',
    sizing_preferences: {
      shoe_size: 'UK 10',
      shirt_size: 'XL',
    },
  };

  try {
    const profile = await profileApi.updateProfile(updates);
    console.log('Profile updated:', profile);
    return profile;
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};

/**
 * Example: Check if profile exists
 */
export const checkProfileExample = async () => {
  try {
    const exists = await profileApi.checkProfileExists();
    console.log('Profile exists:', exists);
    return exists;
  } catch (error) {
    console.error('Failed to check profile:', error);
    throw error;
  }
};

// ============================================
// WISHLIST API EXAMPLES
// ============================================

/**
 * Example: Get wishlist with pagination
 */
export const getWishlistExample = async () => {
  try {
    const wishlist = await wishlistApi.getWishlist(0, 20);
    console.log('Wishlist:', wishlist);
    console.log('Total items:', wishlist.total_items);
    return wishlist;
  } catch (error) {
    console.error('Failed to get wishlist:', error);
    throw error;
  }
};

/**
 * Example: Add to wishlist
 */
export const addToWishlistExample = async () => {
  const item: AddToWishlistRequest = {
    merchant_id: 'merchant_abc123',
    product_id: 'prod_001',
    variant_id: 'var_001',
    product_title: 'Premium Cotton T-Shirt',
    variant_title: 'Blue / Large',
    product_image_url: 'https://cdn.example.com/products/tshirt-blue.jpg',
    price: 999.0,
    compare_at_price: 1499.0,
    currency: 'INR',
  };

  try {
    const wishlistItem = await wishlistApi.addToWishlist(item);
    console.log('Added to wishlist:', wishlistItem);
    return wishlistItem;
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    throw error;
  }
};

/**
 * Example: Remove from wishlist
 */
export const removeFromWishlistExample = async () => {
  const merchantId = 'merchant_abc123';
  const variantId = 'var_001';

  try {
    const success = await wishlistApi.removeFromWishlist(merchantId, variantId);
    console.log('Removed from wishlist:', success);
    return success;
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    throw error;
  }
};

/**
 * Example: Check if item in wishlist
 */
export const checkWishlistExample = async () => {
  const merchantId = 'merchant_abc123';
  const variantId = 'var_001';

  try {
    const isInWishlist = await wishlistApi.checkInWishlist(merchantId, variantId);
    console.log('Is in wishlist:', isInWishlist);
    return isInWishlist;
  } catch (error) {
    console.error('Failed to check wishlist:', error);
    throw error;
  }
};

/**
 * Example: Get wishlist count
 */
export const getWishlistCountExample = async () => {
  try {
    const count = await wishlistApi.getWishlistCount();
    console.log('Wishlist count:', count);
    return count;
  } catch (error) {
    console.error('Failed to get wishlist count:', error);
    throw error;
  }
};

// ============================================
// BRAND FOLLOW API EXAMPLES
// ============================================

/**
 * Example: Get followed brands
 */
export const getFollowedBrandsExample = async () => {
  try {
    const brands = await brandFollowApi.getFollowedBrands(0, 20);
    console.log('Followed brands:', brands);
    return brands;
  } catch (error) {
    console.error('Failed to get followed brands:', error);
    throw error;
  }
};

/**
 * Example: Follow a brand
 */
export const followBrandExample = async () => {
  const brandData: FollowBrandRequest = {
    merchant_id: 'merchant_abc123',
    brand_name: 'Nike',
    brand_logo_url: 'https://cdn.example.com/brands/nike-logo.png',
  };

  try {
    const followedBrand = await brandFollowApi.followBrand(brandData);
    console.log('Followed brand:', followedBrand);
    return followedBrand;
  } catch (error) {
    console.error('Failed to follow brand:', error);
    throw error;
  }
};

/**
 * Example: Unfollow a brand
 */
export const unfollowBrandExample = async () => {
  const merchantId = 'merchant_abc123';

  try {
    const success = await brandFollowApi.unfollowBrand(merchantId);
    console.log('Unfollowed brand:', success);
    return success;
  } catch (error) {
    console.error('Failed to unfollow brand:', error);
    throw error;
  }
};

/**
 * Example: Check if following a brand
 */
export const checkFollowingExample = async () => {
  const merchantId = 'merchant_abc123';

  try {
    const isFollowing = await brandFollowApi.checkIsFollowing(merchantId);
    console.log('Is following:', isFollowing);
    return isFollowing;
  } catch (error) {
    console.error('Failed to check following status:', error);
    throw error;
  }
};

/**
 * Example: Get brand followers count (PUBLIC)
 */
export const getBrandFollowersExample = async () => {
  const merchantId = 'merchant_abc123';

  try {
    const count = await brandFollowApi.getBrandFollowersCount(merchantId);
    console.log('Brand followers:', count);
    return count;
  } catch (error) {
    console.error('Failed to get brand followers:', error);
    throw error;
  }
};

// ============================================
// ORDERS API EXAMPLES
// ============================================

/**
 * Example: Get orders with pagination
 */
export const getOrdersExample = async () => {
  try {
    const orders = await ordersApi.getOrders(0, 20);
    console.log('Orders:', orders);
    console.log('Total orders:', orders.total_items);
    return orders;
  } catch (error) {
    console.error('Failed to get orders:', error);
    throw error;
  }
};

/**
 * Example: Get order details by UID
 */
export const getOrderDetailsExample = async () => {
  const orderUid = 'SFO-12345';

  try {
    const orderDetails = await ordersApi.getOrderByUid(orderUid);
    console.log('Order details:', orderDetails);
    return orderDetails;
  } catch (error) {
    console.error('Failed to get order details:', error);
    throw error;
  }
};

/**
 * Example: Get orders by status
 */
export const getOrdersByStatusExample = async () => {
  const status = 'COMPLETED';

  try {
    const orders = await ordersApi.getOrdersByStatus(status, 0, 20);
    console.log('Orders with status:', status, orders);
    return orders;
  } catch (error) {
    console.error('Failed to get orders by status:', error);
    throw error;
  }
};

/**
 * Example: Search orders
 */
export const searchOrdersExample = async () => {
  const query = 'Nike';

  try {
    const orders = await ordersApi.searchOrders(query, 0, 20);
    console.log('Search results:', orders);
    return orders;
  } catch (error) {
    console.error('Failed to search orders:', error);
    throw error;
  }
};

// ============================================
// REACT COMPONENT USAGE EXAMPLES
// ============================================

/**
 * Example: Using in a React component with useState
 */
/*
import { useState, useEffect } from 'react';
import { profileApi } from '@/services/mystique';

function ProfileComponent() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileApi.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return <div>Hello, {profile.first_name}!</div>;
}
*/

/**
 * Example: Using with React Query
 */
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/services/mystique';

function WishlistComponent() {
  const queryClient = useQueryClient();

  // Fetch wishlist
  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistApi.getAllWishlist(),
  });

  // Add to wishlist mutation
  const addToWishlist = useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlist = useMutation({
    mutationFn: ({ merchantId, variantId }) =>
      wishlistApi.removeFromWishlist(merchantId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Wishlist ({wishlist?.length})</h2>
      {wishlist?.map((item) => (
        <div key={item.id}>
          <h3>{item.product_title}</h3>
          <button
            onClick={() =>
              removeFromWishlist.mutate({
                merchantId: item.merchant_id,
                variantId: item.variant_id,
              })
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
*/
