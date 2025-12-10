import axios from "axios";
import Cookies from "js-cookie";

// STUBBED IMPORTS - Replace with actual imports when available
// import { CheckoutErrorType } from "lib/types/error";
// import { getAccessToken, refreshExpiredIdToken } from "lib/utils/auth";
// import { constants } from "lib/utils/constants";
// import { isBraveBrowser } from "lib/utils/helpers";
// import CustomError from "./customError";
// import { logError, logInfo } from "./logUtils";
// import { API_PATHS_TO_ELIMINATE_OPTIONS_CALL_FROM } from "../../../functions/constants";

// DUMMY DEFINITIONS TO MAKE IT COMPILE
type CheckoutErrorType = any;
const getAccessToken = () => Cookies.get("shopper_flo_auth_token");
const refreshExpiredIdToken = async (arg?: any, force?: boolean) => ({
  isLoggedIn: true,
});
const constants = {
  AUTH_COOKIE_CLIENT: "shopper_flo_auth_token",
  TWO_STEP_AUTH_COOKIE_CLIENT: "shopper_flo_two_step_token",
  FLO_SESSION_ID_COOKIE: "flo_session_id",
  FLO_SESSION_ID_XHR_HEADER: "x-shopflo-session",
};
const isBraveBrowser = async () => false;
class CustomError<T> extends Error {
  constructor(message: string, public data: any) {
    super(message);
  }
}
const logError = (msg: string, data?: any) => console.error(msg, data);
const logInfo = (msg: string, data?: any) => console.log(msg, data);
const API_PATHS_TO_ELIMINATE_OPTIONS_CALL_FROM: string[] = [];

/**
 * Axios wrapper with conditional timeout logic
 * Applies timeout only when URL ends with /checkout or /user
 */
export const axiosWithTimeout = async (config: any) => {
  const { url, timeout = 10000 } = config;

  // Check if URL ends with /checkout or /user
  const shouldApplyTimeout = /\/(checkout|user)$/.test(url);

  if (!shouldApplyTimeout) {
    // If URL doesn't match, use regular axios without timeout
    return axios(config);
  }

  // Apply timeout logic for matching URLs
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return axios({
    ...config,
    signal: controller.signal,
  })
    .finally(() => clearTimeout(timeoutId))
    .catch((error) => {
      throw error;
    });
};

// const API_PATHS_TO_ELIMINATE_OPTIONS_CALL_FROM = ["/flo-checkout/api/attributes/v1/account-attributes"];

const baseURL = import.meta.env.VITE_API_URI;
const publicBaseURL = import.meta.env.VITE_API_PUBLIC_URI;
const analyticsURL = import.meta.env.VITE_ANALYTICS_API_URI;
const authBaseURL = import.meta.env.VITE_API_AUTH_URI;
const kratosPublicBaseURL = import.meta.env.VITE_KRATOS_API_PUBLIC_URI;
const kratosPrivateBaseURL = import.meta.env.VITE_KRATOS_API_PRIVATE_URI;
const ceApiUri = import.meta.env.VITE_CE_API_URI;
const ceApiPublicUri = import.meta.env.VITE_CE_API_PUBLIC_URI;
const segmentsBaseURL = import.meta.env.VITE_SEGMENTS_API_URI;
const checkoutHost = import.meta.env.VITE_CHECKOUT_HOST;

const shouldEliminateOptionsCall =
  import.meta.env.VITE_SHOULD_ELIMINATE_OPTIONS_CALL === "true";

const version =
  window.location.hostname === "localhost"
    ? "latest"
    : window.location.pathname.split("/")[1];

/**
 * Axios Response Interceptor to retry on response error/failures.
 *
 * @param  {number} retryCount      The number of retries
 *
 */
const axiosRetryInterceptor = (retryCount: number) => {
  let counter = 0;
  axios.interceptors.response.use(undefined, (error) => {
    const config = error.config;
    if (counter < retryCount) {
      counter++;
      return new Promise((resolve) => {
        resolve(axios(config));
      });
    }
    return Promise.reject(error);
  });
};

const axiosRefreshTokenInterceptor = () => {
  let isRefreshing = false;
  let failedQueue: any[] = [];
  let retryCount = 0;
  const MAX_RETRIES = 3;

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        Boolean(
          error.response?.status === 401 || error.response?.status === 403
        ) &&
        originalRequest.url?.includes("/user-token/refresh")
      ) {
        // Dispatch logout event when refresh token fails
        window.dispatchEvent(new CustomEvent("auth:token-refresh-failed"));
        return Promise.reject(error);
      }
      if (
        Boolean(
          error.response?.status === 401 || error.response?.status === 403
        ) &&
        !originalRequest._retry &&
        retryCount < MAX_RETRIES
      ) {
        retryCount++;
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = token;
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { isLoggedIn } = await refreshExpiredIdToken(undefined, true);
          if (isLoggedIn) {
            const newToken = Cookies.get(constants.AUTH_COOKIE_CLIENT);
            axios.defaults.headers.common["Authorization"] = newToken;
            originalRequest.headers["Authorization"] = newToken;
            processQueue(null, newToken);
            return axios(originalRequest);
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      retryCount = 0;
      return Promise.reject(error);
    }
  );
};

axiosRefreshTokenInterceptor();

/**
 * Requests a URL, returning a data/error using SWR library. Use this for GET calls
 *
 * @param  {string} url       The URL we want to request
 *
 * @return {object}           The response data
 */
export const fetcher = async (url: string) => {
  await refreshExpiredIdToken();
  const sessionId = Cookies.get(constants.FLO_SESSION_ID_COOKIE);
  const config = {
    headers: {
      Authorization: Boolean(Cookies.get(constants.AUTH_COOKIE_CLIENT))
        ? Cookies.get(constants.AUTH_COOKIE_CLIENT) ?? ""
        : Boolean(Cookies.get(constants.TWO_STEP_AUTH_COOKIE_CLIENT))
        ? Cookies.get(constants.TWO_STEP_AUTH_COOKIE_CLIENT) ?? ""
        : "",
      ...(sessionId && { "x-shopflo-session": sessionId }),
      ...(version && { "X-SHOPFLO-VERSION": version }),
    },
  };
  return axios
    .get(`${baseURL}${url}`, config)
    .then((res) => {
      const data = res?.data?.response;
      logInfo(`Fetcher: ${url}`, {
        base: baseURL,
        config,
        data,
        responseHeaders: res.headers,
      });
      return data;
    })
    .catch((err) => {
      apiErrorLogger(err, { url, base: baseURL });
      throw err;
    });
};

/**
 * Requests a URL, returning a data/error using SWR library. Use this for GET calls
 * use this to access public endpoints
 *
 * @param  {string} url       The URL we want to request
 *
 * @return {object}           The response data
 */
export const publicFetcher = (url: string, basePath: BaseApi = "CHECKOUT") => {
  const sessionId = Cookies.get(constants.FLO_SESSION_ID_COOKIE);
  const baseUrl = basePath === "CHECKOUT" ? publicBaseURL : kratosPublicBaseURL;
  const config = {
    headers: {
      ...(sessionId && { "x-shopflo-session": sessionId }),
      ...(version && { "X-SHOPFLO-VERSION": version }),
    },
  };
  return axios
    .get(`${baseUrl}${url}`, config)
    .then((res) => {
      const data = res?.data?.response;
      logInfo(`Public Fetcher: ${url}`, {
        base: publicBaseURL,
        config,
        data,
        responseHeaders: res.headers,
      });
      return data;
    })
    .catch((err) => {
      apiErrorLogger(err, { url, base: publicBaseURL });
      throw err;
    });
};

export const kratosPublicFetcher = (url: string) => {
  const sessionId = Cookies.get(constants.FLO_SESSION_ID_COOKIE);
  const config = {
    headers: {
      ...(sessionId && { "x-shopflo-session": sessionId }),
      ...(version && { "X-SHOPFLO-VERSION": version }),
    },
  };
  return axios
    .get(`${kratosPublicBaseURL}${url}`, config)
    .then((res) => {
      const data = res?.data?.data;
      logInfo(`Kratos Public Fetcher: ${url}`, {
        base: kratosPublicBaseURL,
        config,
        data,
        responseHeaders: res.headers,
      });
      return data;
    })
    .catch((err) => {
      apiErrorLogger(err, { url, base: kratosPublicBaseURL });
      throw err;
    });
};

export const staticOptions = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
  errorRetryInterval: 5000,
  errorRetryCount: 1,
};

export type BaseApi =
  | "CHECKOUT"
  | "CHECKOUT_PUBLIC"
  | "AUTH"
  | "ANALYTICS"
  | "AUTH_PRIVATE"
  | "KRATOS_PRIVATE"
  | "CE"
  | "CE_PUBLIC"
  | "SEGMENTS"
  | "KRATOS_PUBLIC"
  | "CHECKOUT_HOST";

const getRequestParams = (baseApi: BaseApi = "CHECKOUT") => {
  let headers: Record<string, string> = {
    [constants.FLO_SESSION_ID_XHR_HEADER]:
      Cookies.get(constants.FLO_SESSION_ID_COOKIE) ?? "NA",
    "X-SHOPFLO-VERSION": version,
  };
  let base: string = "";
  let token = getAccessToken();

  switch (baseApi) {
    case "CHECKOUT_HOST": {
      base = checkoutHost ? `https://${checkoutHost}` : "";
      break;
    }
    case "CHECKOUT": {
      headers = {
        ...headers,
        Authorization: token ?? "",
      };
      base = baseURL ?? "";
      break;
    }
    case "CHECKOUT_PUBLIC": {
      base = publicBaseURL ?? "";
      break;
    }
    case "AUTH": {
      base = authBaseURL ?? "";
      break;
    }
    case "AUTH_PRIVATE": {
      headers = {
        ...headers,
        Authorization: token ?? "",
      };
      base = authBaseURL ?? "";
      break;
    }
    case "KRATOS_PUBLIC": {
      base = kratosPublicBaseURL ?? "";
      headers = {
        ...headers,
        Authorization: token ?? "",
      };
      break;
    }
    case "KRATOS_PRIVATE": {
      headers = {
        ...headers,
        Authorization: token ?? "",
      };
      base = kratosPrivateBaseURL ?? "";
      break;
    }
    case "CE": {
      headers = {
        ...headers,
        Authorization: token ?? "",
      };
      base = ceApiUri ?? "";
      break;
    }
    case "CE_PUBLIC": {
      headers = {
        ...headers,
        Authorization: token ?? "",
      };
      base = ceApiPublicUri ?? "";
      break;
    }
    case "SEGMENTS": {
      base = segmentsBaseURL ?? "";
      headers = {
        ...headers,
        Authorization: token ?? "",
      };
      break;
    }
  }
  return { headers, base };
};

const getResponseParams = (baseApi: BaseApi = "CHECKOUT", response: any) => {
  let data = {};
  switch (baseApi) {
    case "CHECKOUT": {
      data = response?.data?.response;
      break;
    }
    case "CHECKOUT_PUBLIC": {
      data = response?.data?.response;
      break;
    }
    case "AUTH": {
      data = response?.data?.data;
      break;
    }
    case "AUTH_PRIVATE": {
      data = response?.data?.data;
      break;
    }
    case "KRATOS_PUBLIC": {
      data = response?.data?.data;
      break;
    }
    case "KRATOS_PRIVATE": {
      data = response?.data?.data;
      break;
    }
    case "CE": {
      data = response?.data?.data;
      break;
    }
    case "CE_PUBLIC": {
      data = response?.data?.data;
      break;
    }
    case "SEGMENTS": {
      data = response?.data?.data;
      break;
    }
    // case "PAYU_TEST": {
    //   data = response?.data?.response;
    //   break;
    // }
  }
  return data;
};

export const postRequest = async (
  url: string,
  payload: any,
  baseApi: BaseApi = "CHECKOUT",
  customHeaders?: Record<string, string>
) => {
  Boolean(baseApi === "CHECKOUT") && (await refreshExpiredIdToken());
  const { headers, base } = getRequestParamWrapper(baseApi, url);
  try {
    const response = await axiosWithTimeout({
      method: "post",
      url: `${base}${url}`,
      data: payload,
      headers: Boolean(customHeaders)
        ? { ...headers, ...customHeaders }
        : headers,
    });

    const data: any = getResponseParams(baseApi, response);
    logInfo(`POST: ${url}`, {
      base,
      payload,
      data,
      responseHeaders: response.headers,
    });
    return data;
  } catch (err: any) {
    apiErrorLogger(err, { url, payload });
    // Specific error handling for checkout API
    // Regex checks all API's ending with /checkout
    if (/\/(checkout|cart)$/.test(url)) {
      const customError = new CustomError<CheckoutErrorType>(
        "Checkout API Error",
        { err, url, payload }
      );
      throw customError;
    }
    throw err;
  }
};

export const putRequest = async (
  url: string,
  payload: any,
  baseApi: BaseApi = "CHECKOUT",
  retryCount: number = 0,
  returnRaw: boolean = false
) => {
  Boolean(baseApi === "CHECKOUT") && (await refreshExpiredIdToken());
  Boolean(retryCount) ?? axiosRetryInterceptor(retryCount);

  const { headers, base } = getRequestParamWrapper(baseApi, url);
  try {
    const response = await axiosWithTimeout({
      method: "put",
      url: `${base}${url}`,
      data: payload,
      headers: headers,
    });
    logInfo(`PUT: ${url}`, {
      base,
      payload,
      data: response?.data,
      responseHeaders: response.headers,
    });

    if (returnRaw) return response;
    return getResponseParams(baseApi, response);
  } catch (err) {
    apiErrorLogger(err, { url, base, headers, payload });
    // Specific error handling for checkout API
    // Regex checks all API's ending with /checkout
    if (/\/checkout$/.test(url)) {
      const customError = new CustomError<CheckoutErrorType>(
        "Checkout API Error",
        { err, url, payload }
      );
      throw customError;
    }
    throw err;
  }
};

export const getRequest = async (
  url: string,
  baseApi: BaseApi = "CHECKOUT",
  customHeaders: Record<string, any> = {}
) => {
  Boolean(baseApi === "CHECKOUT") && (await refreshExpiredIdToken());
  const { headers, base } = getRequestParamWrapper(baseApi, url);
  try {
    const response = await axios.get(`${base}${url}`, {
      headers: {
        ...headers,
        ...customHeaders,
      },
    });
    const data: any = getResponseParams(baseApi, response);
    logInfo(`GET: ${url}`, {
      base,
      data,
      responseHeaders: response.headers,
    });
    return data;
  } catch (err) {
    apiErrorLogger(err, { url, base, headers });
    throw err;
  }
};

export const deleteRequest = async (
  url: string,
  payload?: any,
  baseApi: BaseApi = "CHECKOUT"
) => {
  Boolean(baseApi === "CHECKOUT") && (await refreshExpiredIdToken());
  const { headers, base } = getRequestParamWrapper(baseApi, url);
  try {
    const response = await axios.delete(`${base}${url}`, {
      data: payload,
      headers: headers,
    });
    const data: any = getResponseParams(baseApi, response);
    logInfo(`DELETE: ${url}`, {
      base,
      payload,
      data,
      responseHeaders: response.headers,
    });
    return data;
  } catch (err) {
    apiErrorLogger(err, { url, base, headers, payload });
    throw err;
  }
};

/** Posts analytics data to be process via shopflo's query engine */
export const postAnalytics = async (payload?: any): Promise<boolean> => {
  try {
    const isBrave = await isBraveBrowser();
    if ((navigator as any)?.sendBeacon && Blob && !isBrave) {
      const blob = new Blob([JSON.stringify(payload)]);
      navigator.sendBeacon(`${analyticsURL}`, blob);
      return true;
    } else {
      await axios.post(`${analyticsURL}`, payload);
      return true;
    }
  } catch (error) {
    throw error;
  }
};

/** Post survey data to be process via shopflo's query engine */
export const postSurvey = async (payload?: any, checkoutId?: string) => {
  const url = `/checkout/v1/checkout/${checkoutId}/survey`;
  try {
    await postRequest(url, payload);
  } catch (error) {
    throw error;
  }
};

function baseCheck(url: string) {
  const urlObj = new URL(window.location.href);
  const hostname = urlObj.hostname;
  const shouldProxy = API_PATHS_TO_ELIMINATE_OPTIONS_CALL_FROM.some((path) => {
    if (path instanceof RegExp) {
      return path.test(url);
    }
    return url.includes(path);
  });
  return shouldProxy && hostname !== "localhost" && shouldEliminateOptionsCall;
}

function getRequestParamWrapper(baseApi: BaseApi = "CHECKOUT", url: string) {
  const { headers, base } = getRequestParams(baseApi);
  const requestURL = `${base}${url}`;

  const shouldOverrideBase = baseCheck(requestURL);
  let newBase = base;
  if (shouldOverrideBase) {
    const newURL = new URL(base);
    newURL.host = checkoutHost;
    newBase = newURL.toString();
  }

  return {
    headers,
    base: newBase,
  };
}

function apiErrorLogger(error: any, payload: Record<string, unknown> = {}) {
  if (error instanceof axios.AxiosError) {
    logError(`ERROR:${JSON.stringify(error.response?.data)}`, {
      ...payload,
      responseHeaders: error.response?.headers,
      statusCode: error.response?.status,
    });
  } else if (error instanceof axios.AxiosError) {
    logError(`ERROR:${error.message}`, payload);
  } else if (typeof error === "string") {
    logError(`ERROR:${error}`, payload);
  }
}
