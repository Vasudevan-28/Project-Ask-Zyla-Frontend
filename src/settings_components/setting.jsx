import React, { useState, useEffect, useContext } from "react";

import { FaRegClock } from "react-icons/fa6";
import { IoLanguage, IoLocationOutline } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { VscFeedback } from "react-icons/vsc";
import { GiSelfLove } from "react-icons/gi";
import { MdOutlinePrivacyTip, MdOutlineCached } from "react-icons/md";

import { LiaToggleOnSolid, LiaToggleOffSolid } from "react-icons/lia";

import { ThemeContext } from "../contexts/ThemeContext";

import Location from "./location";
import LocationConfirmModal from "./LocationConfirmModal";

import { useNavigate } from "react-router-dom";
import { updateCityAndState } from "./api/settingsAPI";

import { setTimeFormatCookie, getTimeFormatCookie } from "../utils/timeformatCookie";
import ClearCacheModal from "./ClearCacheModal";
import DeleteAccountModal from "./DeleteAccountModal";

const rowClasses =
  "w-full flex items-center justify-between h-[56px] px-4 border-b border-[#f1c6e0] text-[14px] text-[color:var(--text-main)]";

function ToggleRow({ icon, label, checked, onChange, helper, isLight }) {
  return (
    <div className="w-full  pt-1 pb-1">
      <div className={rowClasses}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            {typeof icon === "string" ? <img src={icon} className="w-6 h-6" alt={label} /> : icon}
          </div>
          <span className="font-semibold text-[13px] md:text-[15px]">{label}</span>
        </div>

        <div className="flex items-center gap-0">
          {helper && <span className="text-[12px]  opacity-70 min-w-[32px] text-right">{helper}</span>}

          <button
            type="button"
            onClick={onChange}
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            className="
              flex items-center justify-end w-16 h-12
              bg-transparent border-none
              focus:outline-none focus:ring-0
            "
            style={{ outline: "none", boxShadow: "none" }}
            role="switch"
            aria-checked={checked}
          >
            {checked ? (
              <LiaToggleOnSolid className={`w-8 h-10 ${isLight ? "text-[#e9d9e3]" : "text-white/90"}`} />
            ) : (
              <LiaToggleOffSolid className="w-8 h-10 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ButtonRow({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-transparent cursor-pointer border-none focus:outline-none focus:ring-0"
      style={{ outline: "none", boxShadow: "none" }}
    >
      <div className={rowClasses}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            {typeof icon === "string" ? <img src={icon} className="w-6 h-6" alt={label} /> : icon}
          </div>
          <span className="font-semibold text-[13px] md:text-[15px]">{label}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[12px] opacity-0 min-w-8 text-right">
            &nbsp;
          </span>

          <span className="text-2xl leading-none text-gray-400">›</span>
        </div>
      </div>
    </button>
  );
}

function LanguageButton({ icon, label, selectedLanguage, onLanguageChange, isLight }) {
  const LANGUAGES = ["English", "Tamil", "Korean", "Japanese", "Hindi"];

  return (
    <button
      type="button"
      className="w-full text-left bg-transparent border-none focus:outline-none focus:ring-0"
      style={{ outline: "none", boxShadow: "none" }}
      onClick={(e) => e.preventDefault()}
    >
      <div className={rowClasses}>
        {/* LEFT: icon + label */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            {typeof icon === "string" ? <img src={icon} className="w-6 h-6" alt={label} /> : icon}
          </div>
          <span className="font-semibold text-[13px] md:text-[15px]">{label}</span>
        </div>

        <div className={`flex items-center gap-3 ${isLight ? "text-slate-900" : "text-slate-100"}`}>
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="text-[14px] border border-[#f1c6e0] rounded-md px-2 py-1 bg-transparent focus:outline-none focus:ring-0"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} disabled={lang !== "English"} className={`${isLight ? "bg-white/90" : "bg-white/10 text-slate-600"}`}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>
    </button>
  );
}

function Setting({ onLocationDetected, onOpenSupport, onOpenFeedback, onOpenRating, onLocationUpdated}) {
  const [is24h, setIs24h] = useState(true);

  useEffect(() => {
    try {
      const stored = getTimeFormatCookie();
      setIs24h(stored === "true");
    } catch {
      setIs24h(true);
    }
  }, []);

  const [locationOn, setLocationOn] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const [deletePopup, setDeletePopup] = useState(false);
  const [clearCachePopup, setClearCachePopup] = useState(false);

  const [pendingLocation, setPendingLocation] = useState(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  const navigate = useNavigate();

  const handleLocationToggle = () => {
    const next = !locationOn;
    setLocationOn(next);

    if (!next) {
      setLocationStatus("");
      setPendingLocation(null);
    } else {
      setLocationStatus("Detecting location...");
      setPendingLocation(null);
    }
  };

  const handleLocationDetectedInternal = async (location) => {
    if (location?.error) {
      setLocationStatus(`Failed to get location: ${location.error}`);
      return;
    }

    const { city, state } = location || {};

    setPendingLocation(location);
    setLocationStatus(`Detected: ${city || "Unknown city"}, ${state || "Unknown state"}`);

    if (typeof onLocationDetected === "function") {
      onLocationDetected(location);
    }
  };

  async function confirmUpdateLocation() {
    if (!pendingLocation) return;
    setIsUpdatingLocation(true);
    try {
      const { city, state } = pendingLocation;
      await updateCityAndState(city, state);
      setLocationStatus(`Saved: ${city || "Unknown city"}, ${state || "Unknown state"}`);
      onLocationUpdated()
      setPendingLocation(null);
    } catch (err) {
      console.error("Failed to save location in profile:", err);
      setLocationStatus("Failed to save location");
    } finally {
      setIsUpdatingLocation(false);
    }
  }

  function cancelPendingLocation() {
    setLocationOn(false);
    setPendingLocation(null);
    setLocationStatus("");
  }

  function toggleTimeFormat() {
    setIs24h(prev => {
      const next = !prev;
      setTimeFormatCookie(next);
      return next;
    });
  }

  return (
    <section
      className={`w-full md:w-[90%] max-w-[900px]  px-4 md:px-6 pt-6 pb-8 flex flex-col ${
        isLight ? "bg-white text-slate-900" : "bg-white/10 text-slate-50"
      } rounded-2xl shadow-lg`}
    >
      <ToggleRow icon={<FaRegClock className="w-6 h-6 " />} label="Time zone (12h / 24h)" checked={is24h} onChange={toggleTimeFormat} helper={is24h ? "24h" : "12h"} isLight={isLight} />

      <ToggleRow icon={<IoLocationOutline className="w-9 h-6 " />} label="Location" checked={locationOn} onChange={handleLocationToggle} isLight={isLight} />

      {locationStatus && (
        <div className={`text-[12px] pl-10 mt-1 mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{locationStatus}</div>
      )}

      <Location enabled={locationOn} onLocationDetected={handleLocationDetectedInternal} />

      <LanguageButton icon={<IoLanguage className="w-6 h-6 " />} label="Language" isLight={isLight} />

      {/* Support */}
      <ButtonRow icon={<BiSupport className="w-6 h-6 " />} label="Support" onClick={onOpenSupport} />

      {/* App Feedback */}
      <ButtonRow icon={<VscFeedback className="w-6 h-6 " />} label="App Feedback" onClick={onOpenFeedback} />

      {/* App Rating */}
      <ButtonRow icon={<GiSelfLove className="w-6 h-6 " />} label="App Rating" onClick={onOpenRating} />

      {/* Privacy */}
      <ButtonRow icon={<MdOutlinePrivacyTip className="w-6 h-6 " />} label="Privacy" onClick={() => navigate("/privacy-policy")} />

      {/* Clear data */}
      <ButtonRow icon={<MdOutlineCached className="w-6 h-6 " />} label="Clear Data & Cache" onClick={() => setClearCachePopup(true)} />

      {/* Delete account  */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className={`py-2.5 px-6 rounded-lg border-none text-white text-md shadow-lg font-semibold focus:outline-none focus:ring-0 cursor-pointer 
            ${ isLight ? "bg-linear-to-r from-[#994A97] to-[#CA88B1] hover:brightness-110" : "bg-white/10 hover:bg-white/20"
          }`}
          style={{ outline: "none", boxShadow: "none" }}
          onClick={() => setDeletePopup(true)}
        >
          DELETE ACCOUNT
        </button>
      </div>

      {deletePopup && (
        <DeleteAccountModal
          open={deletePopup}
          onClose={() => setDeletePopup(false)}
          isLight={isLight}
        />
      )}

      {clearCachePopup && (
        <ClearCacheModal
         open={clearCachePopup}
         onClose={() => setClearCachePopup(false)}
         isLight={isLight} />
      )}

      <LocationConfirmModal
        open={!!pendingLocation && !pendingLocation.error}
        location={pendingLocation}
        onConfirm={confirmUpdateLocation}
        onCancel={cancelPendingLocation}
        isLight={isLight}
        isLoading={isUpdatingLocation}
      />
    </section>
  );
}

export default Setting;