import Cookies from 'js-cookie';
import { shopfloAuthApi } from '@/services/authApi';

/**
 * Check if user is authenticated by verifying the presence of access token cookie
 */
export const isAuthenticated = (): boolean => {
  const token = Cookies.get('shopflo_access_token');
  return !!token;
};

/**
 * Get the current user's access token from cookies
 */
export const getAccessToken = (): string | null => {
  return Cookies.get('shopflo_access_token') || null;
};

/**
 * Get the current user's refresh token from cookies
 */
export const getRefreshToken = (): string | null => {
  return Cookies.get('shopflo_refresh_token') || null;
};

/**
 * Logout user by clearing all auth data and redirecting to login
 */
export const logout = (): void => {
  shopfloAuthApi.clearAuth();
  window.location.href = '/';
};

/**
 * Check if token is expired (basic check based on cookie existence)
 * For more robust check, you'd need to decode the JWT and check exp claim
 */
export const isTokenExpired = (): boolean => {
  return !isAuthenticated();
};
