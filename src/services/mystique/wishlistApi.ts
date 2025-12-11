/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticatedApi } from '../authenticatedApi';
import type {
  ApiResponse,
  PaginatedResponse,
  WishlistItem,
  AddToWishlistRequest,
} from './types';

const BASE_PATH = '/mystique/api/v1/wishlist';

/**
 * Wishlist API Service
 * All endpoints require X-SHOPFLO-REQ-ID header (user_id) which is automatically added by authenticatedApi
 */
export const wishlistApi = {
  /**
   * Get paginated list of wishlisted items
   * GET /mystique/api/v1/wishlist
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @param merchantId - Optional: Filter by merchant
   */
  getWishlist: async (
    page: number = 0,
    size: number = 20,
    merchantId?: string
  ): Promise<PaginatedResponse<WishlistItem>> => {
    const params: any = { page, size };
    if (merchantId) params.merchantId = merchantId;

    const response = await authenticatedApi.get<ApiResponse<PaginatedResponse<WishlistItem>>>(
      BASE_PATH,
      { params }
    );
    return response.data;
  },

  /**
   * Get all wishlisted items without pagination
   * GET /mystique/api/v1/wishlist/all
   * @param merchantId - Optional: Filter by merchant
   */
  getAllWishlist: async (merchantId?: string): Promise<WishlistItem[]> => {
    const params: any = {};
    if (merchantId) params.merchantId = merchantId;

    const response = await authenticatedApi.get<ApiResponse<WishlistItem[]>>(
      `${BASE_PATH}/all`,
      { params }
    );
    return response.data;
  },

  /**
   * Add a product variant to the wishlist
   * POST /mystique/api/v1/wishlist
   */
  addToWishlist: async (data: AddToWishlistRequest): Promise<WishlistItem> => {
    const response = await authenticatedApi.post<ApiResponse<WishlistItem>>(BASE_PATH, data);
    return response.data;
  },

  /**
   * Remove a product variant from the wishlist
   * DELETE /mystique/api/v1/wishlist/:merchantId/:variantId
   */
  removeFromWishlist: async (merchantId: string, variantId: string): Promise<boolean> => {
    const response = await authenticatedApi.delete<ApiResponse<boolean>>(
      `${BASE_PATH}/${merchantId}/${variantId}`
    );
    return response.data;
  },

  /**
   * Check if a product variant is in the wishlist
   * GET /mystique/api/v1/wishlist/check/:merchantId/:variantId
   */
  checkInWishlist: async (merchantId: string, variantId: string): Promise<boolean> => {
    const response = await authenticatedApi.get<ApiResponse<boolean>>(
      `${BASE_PATH}/check/${merchantId}/${variantId}`
    );
    return response.data;
  },

  /**
   * Get wishlist item count
   * GET /mystique/api/v1/wishlist/count
   * @param merchantId - Optional: Count for specific merchant
   */
  getWishlistCount: async (merchantId?: string): Promise<number> => {
    const params: any = {};
    if (merchantId) params.merchantId = merchantId;

    const response = await authenticatedApi.get<ApiResponse<number>>(
      `${BASE_PATH}/count`,
      { params }
    );
    return response.data;
  },

  /**
   * Clear all items from wishlist
   * DELETE /mystique/api/v1/wishlist/clear
   * @param merchantId - Optional: Clear only for specific merchant
   */
  clearWishlist: async (merchantId?: string): Promise<boolean> => {
    const params: any = {};
    if (merchantId) params.merchantId = merchantId;

    const response = await authenticatedApi.delete<ApiResponse<boolean>>(
      `${BASE_PATH}/clear`,
      { params }
    );
    return response.data;
  },
};

export default wishlistApi;
