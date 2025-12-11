/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-ngrok-url.ngrok.io/api/v1';

// Create authenticated API client
const authenticatedApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token from cookies
authenticatedApiClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('shopflo_access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
authenticatedApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      Cookies.remove('shopflo_access_token');
      Cookies.remove('shopflo_refresh_token');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Example API methods using authenticated client
export const authenticatedApi = {
  // Example: Get user profile
  getUserProfile: async (): Promise<any> => {
    const response = await authenticatedApiClient.get('/user/profile');
    return response.data;
  },

  // Example: Update user profile
  updateUserProfile: async (data: any): Promise<any> => {
    const response = await authenticatedApiClient.put('/user/profile', data);
    return response.data;
  },

  // Example: Get orders
  getOrders: async (): Promise<any> => {
    const response = await authenticatedApiClient.get('/orders');
    return response.data;
  },

  // Example: Get order by ID
  getOrderById: async (orderId: string): Promise<any> => {
    const response = await authenticatedApiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Generic methods for flexibility
  get: async <T = any>(url: string, config?: any): Promise<T> => {
    const response = await authenticatedApiClient.get<T>(url, config);
    return response.data;
  },

  post: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await authenticatedApiClient.post<T>(url, data, config);
    return response.data;
  },

  put: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await authenticatedApiClient.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await authenticatedApiClient.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T = any>(url: string, config?: any): Promise<T> => {
    const response = await authenticatedApiClient.delete<T>(url, config);
    return response.data;
  },
};

export default authenticatedApiClient;
