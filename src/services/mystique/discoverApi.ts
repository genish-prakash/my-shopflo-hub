/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticatedApi } from "../authenticatedApi";
import type { ApiResponse, DiscoverResponse, DiscoverBrand } from "./types";

const BASE_PATH = "/mystique/api/v1/discover";

/**
 * Discover API Service
 * Endpoints require X-SHOPFLO-REQ-ID header which is automatically added by authenticatedApi
 */
export const discoverApi = {
  /**
   * Discover brands with pagination
   * GET /mystique/api/v1/discover
   * @param page - Page number (1-indexed)
   * @param pageSize - Number of items per page
   */
  getDiscoverBrands: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<DiscoverResponse> => {
    const response = await authenticatedApi.get<ApiResponse<DiscoverResponse>>(
      BASE_PATH,
      { params: { page, pageSize } }
    );
    return response.data;
  },

  /**
   * Get specific brand details
   * GET /mystique/api/v1/discover/:merchantId
   * @param merchantId - The merchant ID of the brand
   */
  getBrandDetails: async (merchantId: string): Promise<DiscoverBrand> => {
    const response = await authenticatedApi.get<ApiResponse<DiscoverBrand>>(
      `${BASE_PATH}/${merchantId}`
    );
    return response.data;
  },
};

export default discoverApi;
