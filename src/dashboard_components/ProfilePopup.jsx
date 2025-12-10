import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function ProfilePopup({ onSettings = () => {}, onLogout = () => {} }) {
      const { theme } = useContext(ThemeContext);
    const isLight = theme === "light";

  return (
    <div className={`bg-white/95 rounded-md shadow-xl p-2 min-w-[220px]`}>
      <button
        className="block w-full  text-left py-2 px-2 rounded-md font-semibold text-[#1d0e2d] hover:bg-purple-50 focus:outline-none"
        onClick={onSettings}
        type="button"
      >
        Account Settings
      </button>
      <button
        className="block w-full text-left py-2 px-2 rounded-md font-semibold text-red-600 hover:bg-red-50 focus:outline-none"
        onClick={onLogout}
        type="button"
      >
        Logout
      </button>
    </div>
  );
}