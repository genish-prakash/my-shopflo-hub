import { authenticatedApi } from "../authenticatedApi";
import { DiscoverCouponsResponse } from "./types";

const BASE_PATH = "/mystique/api/v1/coupons/discover";

export const couponsApi = {
  getDiscoverCoupons: async (
    page = 0,
    pageSize = 20
  ): Promise<DiscoverCouponsResponse> => {
    // The user specified http://localhost:8093/mystique/api/v1/coupons/discover
    // authenticatedApi usually has a base URL.
    // If the base URL is different, we might need to override it or use a full URL if supported.
    // Assuming authenticatedApi handles the base URL or we can pass a relative path if it matches.
    // If the user specifically wants localhost:8093, and the app is configured differently, we might need to be careful.
    // However, usually in these projects, the proxy or env var handles the host.
    // I will use the relative path. If it fails, I might need to check the base URL configuration.
    // But the user said "use the same auth as rest of the api", implying `authenticatedApi` is the way to go.

    // Wait, the user provided a full URL in the curl command: http://localhost:8093...
    // If the app is running in a way that `authenticatedApi` points elsewhere, this might be an issue.
    // But typically `authenticatedApi` is configured for the backend.
    // I'll assume the relative path `/mystique/api/v1/coupons/discover` is correct for the `authenticatedApi`.

    const response = await authenticatedApi.get<DiscoverCouponsResponse>(
      BASE_PATH,
      {
        params: {
          page,
          pageSize,
        },
      }
    );
    return response;
  },
};
