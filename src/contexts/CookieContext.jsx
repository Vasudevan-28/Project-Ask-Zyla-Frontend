import { createContext, useEffect, useState } from "react";
import { getConsent, hasAnalyticsConsent } from "../utils/cookies";
import { loadAnalytics } from "../utils/analytics";

export const CookieContext = createContext(null);

export function CookieProvider({ children }) {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const c = getConsent();
    setConsent(c || null);
    if (c && hasAnalyticsConsent()) loadAnalytics();
  }, []);

  return (
    <CookieContext.Provider value={{ consent, setConsent }}>
      {children}
    </CookieContext.Provider>
  );
}
