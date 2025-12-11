/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticatedApi } from "../authenticatedApi";
import type {
  ApiResponse,
  Profile,
  CreateProfileRequest,
  UpdateProfileRequest,
} from "./types";

const BASE_PATH = "/profile";

/**
 * Profile API Service
 * All endpoints require X-SHOPFLO-REQ-ID header (user_id) which is automatically added by authenticatedApi
 */
export const profileApi = {
  /**
   * Get the shopper's profile information
   * GET /mystique/api/v1/profile
   */
  getProfile: async (): Promise<Profile> => {
    const response = await authenticatedApi.get<ApiResponse<Profile>>(
      BASE_PATH
    );
    return response.data;
  },

  /**
   * Create a new shopper profile
   * POST /mystique/api/v1/profile
   */
  createProfile: async (data: CreateProfileRequest): Promise<Profile> => {
    const response = await authenticatedApi.post<ApiResponse<Profile>>(
      BASE_PATH,
      data
    );
    return response.data;
  },

  /**
   * Update existing shopper profile
   * PUT /mystique/api/v1/profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    const response = await authenticatedApi.put<ApiResponse<Profile>>(
      BASE_PATH,
      data
    );
    return response.data;
  },

  /**
   * Soft delete the shopper's profile
   * DELETE /mystique/api/v1/profile
   */
  deleteProfile: async (): Promise<boolean> => {
    const response = await authenticatedApi.delete<ApiResponse<boolean>>(
      BASE_PATH
    );
    return response.data;
  },

  /**
   * Check if a profile exists for the authenticated user
   * GET /mystique/api/v1/profile/exists
   */
  checkProfileExists: async (): Promise<boolean> => {
    const response = await authenticatedApi.get<ApiResponse<boolean>>(
      `${BASE_PATH}/exists`
    );
    return response.data;
  },
};

export default profileApi;
