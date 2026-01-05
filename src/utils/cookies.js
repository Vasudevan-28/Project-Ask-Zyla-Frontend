import Cookies from "js-cookie";

export const getConsent = () => Cookies.get("cookie_consent");
export const setConsent = (value) =>
  Cookies.set("cookie_consent", value, { expires: 365, sameSite: "Lax" });

export const hasAnalyticsConsent = () => getConsent() === "analytics";
