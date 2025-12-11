/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticatedApi } from "../authenticatedApi";
import type {
  ApiResponse,
  PaginatedResponse,
  Order,
  OrderDetails,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "./types";

const BASE_PATH = "/orders";

/**
 * Orders API Service
 * All endpoints require X-SHOPFLO-REQ-ID header (user_id) which is automatically added by authenticatedApi
 */
export const ordersApi = {
  /**
   * Get paginated list of user's orders
   * GET /mystique/api/v1/orders
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @param merchantId - Optional: Filter by merchant
   */
  getOrders: async (
    page: number = 0,
    size: number = 20,
    merchantId?: string
  ): Promise<PaginatedResponse<Order>> => {
    const params: any = { page, size };
    if (merchantId) params.merchantId = merchantId;

    const response = await authenticatedApi.get<
      ApiResponse<PaginatedResponse<Order>>
    >(BASE_PATH, { params });
    return response.data;
  },

  /**
   * Get all orders without pagination
   * GET /mystique/api/v1/orders/all
   * @param merchantId - Optional: Filter by merchant
   */
  getAllOrders: async (merchantId?: string): Promise<Order[]> => {
    const params: any = {};
    if (merchantId) params.merchantId = merchantId;

    const response = await authenticatedApi.get<ApiResponse<Order[]>>(
      `${BASE_PATH}/all`,
      { params }
    );
    return response.data;
  },

  /**
   * Get order details by UID
   * GET /mystique/api/v1/orders/:uid
   */
  getOrderByUid: async (uid: string): Promise<OrderDetails> => {
    const response = await authenticatedApi.get<ApiResponse<OrderDetails>>(
      `${BASE_PATH}/${uid}`
    );
    return response.data;
  },

  /**
   * Create a new order
   * POST /mystique/api/v1/orders
   */
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await authenticatedApi.post<ApiResponse<Order>>(
      BASE_PATH,
      data
    );
    return response.data;
  },

  /**
   * Update an existing order
   * PUT /mystique/api/v1/orders/:uid
   */
  updateOrder: async (
    uid: string,
    data: UpdateOrderRequest
  ): Promise<Order> => {
    const response = await authenticatedApi.put<ApiResponse<Order>>(
      `${BASE_PATH}/${uid}`,
      data
    );
    return response.data;
  },

  /**
   * Delete an order (soft delete)
   * DELETE /mystique/api/v1/orders/:uid
   */
  deleteOrder: async (uid: string): Promise<boolean> => {
    const response = await authenticatedApi.delete<ApiResponse<boolean>>(
      `${BASE_PATH}/${uid}`
    );
    return response.data;
  },

  /**
   * Get orders count
   * GET /mystique/api/v1/orders/count
   * @param merchantId - Optional: Count for specific merchant
   */
  getOrdersCount: async (merchantId?: string): Promise<number> => {
    const params: any = {};
    if (merchantId) params.merchantId = merchantId;

    const response = await authenticatedApi.get<ApiResponse<number>>(
      `${BASE_PATH}/count`,
      { params }
    );
    return response.data;
  },

  /**
   * Search orders by query
   * GET /mystique/api/v1/orders/search
   * @param query - Search query
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   */
  searchOrders: async (
    query: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<Order>> => {
    const response = await authenticatedApi.get<
      ApiResponse<PaginatedResponse<Order>>
    >(`${BASE_PATH}/search`, { params: { query, page, size } });
    return response.data;
  },

  /**
   * Get orders by status
   * GET /mystique/api/v1/orders/status/:status
   * @param status - Order status
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   */
  getOrdersByStatus: async (
    status: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<Order>> => {
    const response = await authenticatedApi.get<
      ApiResponse<PaginatedResponse<Order>>
    >(`${BASE_PATH}/status/${status}`, { params: { page, size } });
    return response.data;
  },
};

export default ordersApi;
