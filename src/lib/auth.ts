import Cookies from "js-cookie";

export const logout = () => {
  Cookies.remove("shopper_flo_auth_token");
  Cookies.remove("shopper_flo_refresh_token");
  localStorage.removeItem("isAuthenticated");
  window.location.href = "/";
};
