/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://api.shopflo.co/heimdall/api/v1';
const MERCHANT_ID = '081418d4-1d30-4e25-bfc0-851fb6df5e13';

// Cookie keys
const ACCESS_TOKEN_KEY = 'shopflo_access_token';
const REFRESH_TOKEN_KEY = 'shopflo_refresh_token';

export interface SendOtpRequest {
  oid: string;
  merchant_id: string;
  skip_verification: boolean;
  linked_user_id: null;
  is_force_verification: boolean;
  context: string;
}

export interface SendOtpResponse {
  success: boolean;
  data: {
    context_id: string;
    otp_required: boolean;
    is_new_customer: boolean;
    existing_customer: boolean;
  };
}

export interface VerifyOtpRequest {
  context_id: string;
  otp: string;
  bureau_event_id: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    access_token_expires_at: number;
    refresh_token: string;
    refresh_token_expires_at: number;
    otp_verified: boolean;
    existing_user: any;
    redirect_user: any;
    reference_id: any;
    metadata: any;
    email: any;
    multi_pass_url: any;
    password: any;
    intercom_jwttoken: any;
  };
}

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'accept': 'application/json, text/plain, */*',
    'content-type': 'application/json',
    'x-shopflo-version': 'latest',
  },
});

export const shopfloAuthApi = {
  sendOtp: async (phoneNumber: string): Promise<SendOtpResponse> => {
    const payload: SendOtpRequest = {
      oid: `+91${phoneNumber}`,
      merchant_id: MERCHANT_ID,
      skip_verification: false,
      linked_user_id: null,
      is_force_verification: false,
      context: 'NO_RECAPTCHA',
    };

    const response = await authApiClient.post<SendOtpResponse>('/otp/send', payload);
    return response.data;
  },

  verifyOtp: async (contextId: string, otp: string): Promise<VerifyOtpResponse> => {
    const payload: VerifyOtpRequest = {
      context_id: contextId,
      otp: otp,
      bureau_event_id: '',
    };

    const response = await authApiClient.post<VerifyOtpResponse>('/otp/verify', payload);
    return response.data;
  },

  setAuthToken: (token: string, refreshToken: string): void => {
    // Store in cookies with expiry (30 days for refresh token, 1 hour for access token)
    Cookies.set(ACCESS_TOKEN_KEY, token, { expires: 1/24 }); // 1 hour
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 30 }); // 30 days
    localStorage.setItem('isAuthenticated', 'true');
  },

  getAuthToken: (): string | null => {
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
  },

  getRefreshToken: (): string | null => {
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  },

  clearAuth: (): void => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    localStorage.removeItem('isAuthenticated');
  },
};
