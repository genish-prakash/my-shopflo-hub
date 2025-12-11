/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_HEIMDALL_API_BASE_URL ||
  "https://morally-closing-dragon.ngrok-free.app/heimdall/api/v1";
const MERCHANT_ID = "081418d4-1d30-4e25-bfc0-851fb6df5e13";

// Cookie keys
const ACCESS_TOKEN_KEY = "shopflo_access_token";
const REFRESH_TOKEN_KEY = "shopflo_refresh_token";

export interface SendOtpRequest {
  oid: string;
  merchant_id: string;
  skip_verification: boolean;
  linked_user_id: string | null;
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

export interface AuthIdentifier {
  oid: string;
  oid_type: "PHONE" | "EMAIL";
  verified: boolean;
}

export interface CustomerConfig {
  account_id: string;
  account_type: string;
  attributes: {
    name: string;
    addresses: {
      default_billing_address_id: string;
      default_shipping_address_id: string;
    };
    marketing_consent: boolean;
  };
  email: string;
  created_at: number;
}

export interface UserData {
  id: string;
  created_at: number;
  updated_at: number;
  auth_identifiers: AuthIdentifier[];
  token_response: any;
  account_type: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  customer_config: CustomerConfig;
  verified: any;
}

export interface UpdateProfileRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  birthday?: string;
  sizing_preferences?: {
    shoe_size?: string;
    shirt_size?: string;
    pants_size?: string;
  };
  marketing_preferences?: {
    whatsapp_enabled?: boolean;
    email_enabled?: boolean;
    push_enabled?: boolean;
    rcs_enabled?: boolean;
  };
}

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    "x-shopflo-version": "latest",
  },
});

export const shopfloAuthApi = {
  sendOtp: async (
    identifier: string,
    linkedUserId: string | null = null
  ): Promise<SendOtpResponse> => {
    // Check if identifier is email or phone number
    const isEmail = identifier.includes("@");
    const oid = isEmail ? identifier : `+91${identifier}`;

    const payload: SendOtpRequest = {
      oid: oid,
      merchant_id: MERCHANT_ID,
      skip_verification: false,
      linked_user_id: linkedUserId,
      is_force_verification: false,
      context: "NO_RECAPTCHA",
    };

    console.log("Sending OTP with payload:", payload);

    // Use production Shopflo URL specifically for /otp/send endpoint
    const response = await axios.post<SendOtpResponse>(
      "https://api.shopflo.co/heimdall/api/v1/otp/send",
      payload,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          "x-shopflo-version": "latest",
        },
      }
    );
    return response.data;
  },

  verifyOtp: async (
    contextId: string,
    otp: string
  ): Promise<VerifyOtpResponse> => {
    const payload: VerifyOtpRequest = {
      context_id: contextId,
      otp: otp,
      bureau_event_id: "",
    };

    // Use production Shopflo URL specifically for /otp/verify endpoint
    const response = await axios.post<VerifyOtpResponse>(
      "https://api.shopflo.co/heimdall/api/v1/otp/verify",
      payload,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          "x-shopflo-version": "latest",
        },
      }
    );
    return response.data;
  },

  setAuthToken: (token: string, refreshToken: string): void => {
    // Store in cookies with expiry (30 days for refresh token, 1 hour for access token)
    // Using path '/' to ensure cookies are accessible across the entire domain
    Cookies.set(ACCESS_TOKEN_KEY, token, { expires: 1 / 24, path: "/" }); // 1 hour
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 30, path: "/" }); // 30 days
    localStorage.setItem("isAuthenticated", "true");
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
    localStorage.removeItem("isAuthenticated");
  },

  getUserData: async (accessToken: string): Promise<UserData> => {
    // Use production Shopflo URL specifically for /me endpoint
    const response = await axios.get<{ success: boolean; data: UserData }>(
      "https://api.shopflo.co/heimdall/api/v1/authenticate/me",
      {
        params: {
          required_identifiers: true,
          populate_external_data: true,
          populate_account_attributes: true,
        },
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          "x-shopflo-version": "latest",
          authorization: accessToken,
        },
      }
    );
    // The API returns { success: true, data: {...} }, so we need to extract data
    return response.data.data;
  },

  updateProfile: async (
    userId: string,
    data: UpdateProfileRequest
  ): Promise<void> => {
    const accessToken = shopfloAuthApi.getAuthToken();

    if (!accessToken) {
      throw new Error("No access token found");
    }

    await axios.put(`${API_BASE_URL}/profile`, data, {
      headers: {
        "X-SHOPFLO-REQ-ID": userId,
        "Content-Type": "application/json",
        authorization: accessToken,
      },
    });
  },
};
