/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { shopfloAuthApi } from '@/services/authApi';

interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}

const ACCESS_TOKEN_KEY = 'shopflo_access_token';
const REFRESH_TOKEN_KEY = 'shopflo_refresh_token';

let isRefreshing = false;
let failedQueue: QueueItem[] = [];
let retryCount = 0;
const MAX_RETRIES = 3;

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const redirectToLogin = () => {
  shopfloAuthApi.clearAuth();
  window.location.href = '/';
};

/**
 * Refresh the access token using the refresh token
 * @returns Promise<string | null> - New access token or null if refresh failed
 */
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    console.error('No refresh token available');
    return null;
  }

  try {
    // Call the refresh token endpoint
    const response = await shopfloAuthApi.refreshToken(refreshToken);

    if (response.success && response.data.access_token) {
      // Store new tokens
      shopfloAuthApi.setAuthToken(
        response.data.access_token,
        response.data.refresh_token || refreshToken
      );

      return response.data.access_token;
    }

    return null;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    return null;
  }
};

/**
 * Setup axios interceptor for automatic token refresh on 401/403 errors
 * @param axiosInstance - The axios instance to attach interceptor to
 */
export const setupRefreshTokenInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
        _isPublic?: boolean;
      };

      // Skip refresh for public endpoints
      if (originalRequest._isPublic) {
        return Promise.reject(error);
      }

      // Check if error is 401 or 403 and we haven't exceeded max retries
      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        !originalRequest._retry &&
        retryCount < MAX_RETRIES
      ) {
        retryCount++;

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();

          if (newToken) {
            // Update the failed request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            // Process all queued requests with new token
            processQueue(null, newToken);

            // Retry the original request
            return axiosInstance(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          redirectToLogin();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Reset retry count for other errors
      retryCount = 0;
      return Promise.reject(error);
    }
  );
};

/**
 * Mark a request as public (skip token refresh)
 * @param config - Axios request config
 */
export const markAsPublicRequest = (config: InternalAxiosRequestConfig) => {
  (config as any)._isPublic = true;
  return config;
};
