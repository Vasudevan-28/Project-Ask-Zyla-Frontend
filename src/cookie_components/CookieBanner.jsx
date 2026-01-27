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
    <div className="fixed bottom-3 left-3 max-w-sm bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-fade-in">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-semibold text-gray-900">
            Cookie Preferences
          </h3>
          <button
            onClick={acceptEssential}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors text-sm"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-xs mb-4 leading-relaxed">
          We use cookies to enhance your browsing experience, analyze site
          traffic, and personalize content.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={acceptEssential}
            className="px-3 py-2 text-xs cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500"
          >
            Essential Only
          </button>
          <button
            onClick={acceptAnalytics}
            className="px-3 py-2 cursor-pointer text-xs font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-900"
          >
            Accept All
          </button>
        </div>

        <div className="mt-3 text-[11px] text-gray-500">
          Learn more in our{" "}
          <a
            href="/privacy-policy"
            className="text-gray-700 hover:text-gray-900 underline transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
