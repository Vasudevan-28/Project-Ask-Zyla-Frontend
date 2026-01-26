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
    <div className="fixed bottom-4 left-4 max-w-md bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Cookie Preferences</h3>
          <button
            onClick={acceptEssential}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            X
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-5">
          We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
          By continuing to use our site, you consent to our use of cookies.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={acceptEssential}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Essential Only
          </button>
          <button
            onClick={acceptAnalytics}
            className="px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Accept All
          </button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          Learn more in our{" "}
          <a href="/privacy-policy" className="text-gray-700 hover:text-gray-900 underline transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}