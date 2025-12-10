import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function SuccessModal({
  message = "Success!",
  buttonText = "Close",
  onClose = () => {},
}) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  return (
    <div className="fixed inset-0 z-250001 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-white/90 dark:text-purple-900 rounded-lg w-80 text-center shadow-lg p-6">
        <div className="text-4xl mb-3 text-green-700">✓</div>
        <div className="font-semibold mb-4 text-lg text-purple-900">
          {message}
        </div>
        <div className="mt-4">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-lg font-semibold bg-purple-700 text-white hover:bg-purple-600 transition-all"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}