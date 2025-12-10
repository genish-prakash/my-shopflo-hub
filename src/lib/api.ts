const BASE_URL = "https://api.shopflo.co/heimdall/api/v1";
const MERCHANT_ID = "081418d4-1d30-4e25-bfc0-851fb6df5e13";
const SESSION_ID = "UQBLwYDr3C8d1KKsBUhLc"; // Hardcoded for now as per curl

export interface SendOtpResponse {
  success: boolean;
  data: {
    context_id: string;
    otp_required: boolean;
    is_new_customer: boolean;
    existing_customer: boolean;
  };
}

export const sendOtp = async (
  phoneNumber: string
): Promise<SendOtpResponse> => {
  const response = await fetch(`${BASE_URL}/otp/send`, {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json",
      "x-shopflo-session": SESSION_ID,
      "x-shopflo-version": "latest",
    },
    body: JSON.stringify({
      oid: `+91${phoneNumber}`,
      merchant_id: MERCHANT_ID,
      skip_verification: false,
      linked_user_id: null,
      is_force_verification: false,
      captcha_token: "no_recaptcha", // As requested
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send OTP");
  }

  return response.json();
};

export interface VerifyOtpResponse {
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
}

export const verifyOtp = async (
  contextId: string,
  otp: string
): Promise<VerifyOtpResponse> => {
  const response = await fetch(`${BASE_URL}/otp/verify`, {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json",
      "x-shopflo-session": SESSION_ID,
      "x-shopflo-version": "latest",
    },
    body: JSON.stringify({
      context_id: contextId,
      otp: otp,
      bureau_event_id: "",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to verify OTP");
  }

  return response.json();
};
