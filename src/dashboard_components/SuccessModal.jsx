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
      <div className="bg-white text-[#1d0e2d] rounded-lg w-80 text-center shadow-lg p-6">
        <div className="text-4xl mb-3 text-green-700">✓</div>
        <div className="font-semibold mb-4 text-lg text-[#1d0e2d]">
          {message}
        </div>
        <div className="mt-4">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-lg font-semibold bg-[#1d0e2d] hover:bg-[#1d0e2da8] text-white  transition-all"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}