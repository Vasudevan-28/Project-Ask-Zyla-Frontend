// src/components/ProfilePopup.jsx
import React from "react";

export default function ProfilePopup({ onSettings = () => {}, onLogout = () => {} }) {
  return (
    <div className="profile-popup-card" role="presentation">
      

      <button
        className="profile-popup-item"
        onClick={onSettings}
        type="button"
      >
        Account Settings
      </button>

      <button
        className="profile-popup-item logout"
        onClick={onLogout}
        type="button"
      >
        Logout
      </button>
    </div>
  );
}
