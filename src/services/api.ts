import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { setupRefreshTokenInterceptor } from '@/lib/refreshTokenInterceptor';

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;

    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for adding auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Setup refresh token interceptor for automatic token refresh on 401/403
    setupRefreshTokenInterceptor(this.instance);

    // Additional response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private getAuthToken(): string | null {
    // Get token from cookies first, fallback to localStorage for backward compatibility
    return Cookies.get('shopflo_access_token') || localStorage.getItem('auth_token');
  }

  public setAuthToken(token: string): void {
    Cookies.set('shopflo_access_token', token, { expires: 1/24 });
    localStorage.setItem('auth_token', token);
  }

  public clearAuthToken(): void {
    Cookies.remove('shopflo_access_token');
    Cookies.remove('shopflo_refresh_token');
    localStorage.removeItem('auth_token');
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        message: 'No response received from server',
        status: 0,
      };
    } else {
      return {
        message: error.message,
      };
    }
  }

  public updateBaseURL(newBaseURL: string): void {
    this.baseURL = newBaseURL;
    this.instance.defaults.baseURL = newBaseURL;
  }

  public getBaseURL(): string {
    return this.baseURL;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-ngrok-url.ngrok.io';

export const apiClient = new ApiClient({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export default apiClient;