/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticatedApi } from "../authenticatedApi";
import axios from "axios";
import type {
  ApiResponse,
  PaginatedResponse,
  FollowedBrand,
  FollowBrandRequest,
} from "./types";

const BASE_PATH = "/brands/follow";

// For public endpoints (like brand followers count)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://your-ngrok-url.ngrok.io/api/v1";

/**
 * Brand Follow API Service
 * Most endpoints require X-SHOPFLO-REQ-ID header (user_id) which is automatically added by authenticatedApi
 * Some endpoints are public (like brand followers count)
 */
export const brandFollowApi = {
  /**
   * Get paginated list of brands the user is following
   * GET /mystique/api/v1/brands/follow
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   */
  getFollowedBrands: async (
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<FollowedBrand>> => {
    const response = await authenticatedApi.get<
      ApiResponse<PaginatedResponse<FollowedBrand>>
    >(BASE_PATH, { params: { page, size } });
    return response.data;
  },

  /**
   * Get all brands the user is following without pagination
   * GET /mystique/api/v1/brands/follow/all
   */
  getAllFollowedBrands: async (): Promise<FollowedBrand[]> => {
    const response = await authenticatedApi.get<ApiResponse<FollowedBrand[]>>(
      `${BASE_PATH}/all`
    );
    return response.data;
  },

  /**
   * Follow a brand
   * POST /mystique/api/v1/brands/follow
   */
  followBrand: async (data: FollowBrandRequest): Promise<FollowedBrand> => {
    const response = await authenticatedApi.post<ApiResponse<FollowedBrand>>(
      BASE_PATH,
      data
    );
    return response.data;
  },

  /**
   * Unfollow a brand
   * DELETE /mystique/api/v1/brands/follow/:merchantId
   */
  unfollowBrand: async (merchantId: string): Promise<boolean> => {
    const response = await authenticatedApi.delete<ApiResponse<boolean>>(
      `${BASE_PATH}/${merchantId}`
    );
    return response.data;
  },

  /**
   * Check if user is following a specific brand
   * GET /mystique/api/v1/brands/follow/check/:merchantId
   */
  checkIsFollowing: async (merchantId: string): Promise<boolean> => {
    const response = await authenticatedApi.get<ApiResponse<boolean>>(
      `${BASE_PATH}/check/${merchantId}`
    );
    return response.data;
  },

  /**
   * Get count of brands user is following
   * GET /mystique/api/v1/brands/follow/count
   */
  getFollowingCount: async (): Promise<number> => {
    const response = await authenticatedApi.get<ApiResponse<number>>(
      `${BASE_PATH}/count`
    );
    return response.data;
  },

  /**
   * Get the number of followers for a specific brand (PUBLIC ENDPOINT)
   * GET /mystique/api/v1/brands/follow/followers/:merchantId
   */
  getBrandFollowersCount: async (merchantId: string): Promise<number> => {
    const response = await axios.get<ApiResponse<number>>(
      `${API_BASE_URL}${BASE_PATH}/followers/${merchantId}`
    );
    return response.data.data;
  },

  /**
   * Unfollow all brands at once
   * DELETE /mystique/api/v1/brands/follow/all
   */
  unfollowAllBrands: async (): Promise<boolean> => {
    const response = await authenticatedApi.delete<ApiResponse<boolean>>(
      `${BASE_PATH}/all`
    );
    return response.data;
  },
};

export default brandFollowApi;
