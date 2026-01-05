import { useContext } from "react";
import { CookieContext } from "../contexts/CookieContext";
import { setConsent as persistConsent } from "../utils/cookies";
import { loadAnalytics } from "../utils/analytics";

export default function CookieBanner() {
  const { consent, setConsent } = useContext(CookieContext);

  if (consent) return null;

  const acceptEssential = () => {
    persistConsent("essential");
    setConsent("essential");
  };

  const acceptAnalytics = () => {
    persistConsent("analytics");
    setConsent("analytics");
    loadAnalytics();
  };

  return (
    <div className="fixed bottom-0 w-full bg-gray-900 text-white p-4 flex justify-between z-50">
      <span>This site uses cookies for analytics and preferences.</span>
      <div className="space-x-2">
        <button onClick={acceptEssential} className="bg-gray-600 px-3 py-1 rounded">
          Essential only
        </button>
        <button onClick={acceptAnalytics} className="bg-green-600 px-3 py-1 rounded">
          Accept all
        </button>
      </div>
    </div>
  );
}
