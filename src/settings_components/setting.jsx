import React, { useState, useEffect, useContext } from "react";

import { FaRegClock } from "react-icons/fa6";
import { IoLanguage, IoLocationOutline } from "react-icons/io5";
import { MdFaceRetouchingNatural } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { VscFeedback } from "react-icons/vsc";
import { GiSelfLove } from "react-icons/gi";
import { MdOutlinePrivacyTip, MdOutlineCached } from "react-icons/md";

import { LiaToggleOnSolid, LiaToggleOffSolid } from "react-icons/lia";

import { ThemeContext } from "../contexts/ThemeContext";

import { clearCacheAPI, deleteAccountAPI } from "../services/backendAPI";


import Location from "./location";
// import { updateProfile, setAuthToken } from "./api/settingsAPI";

import { getAuth, onAuthStateChanged, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { updateCityAndState } from "./api/settingsAPI";

// Common row style (inner row)
const rowClasses =
  "w-full flex items-center justify-between h-[56px] px-4 border-b border-[#f1c6e0] text-[14px] text-[color:var(--text-main)]";

// Toggle row using react-icons toggle in dark pink
function ToggleRow({ icon, label, checked, onChange, helper, isLight }) {

  return (
    // Outer wrapper so structure matches ButtonRow (for consistent width)
    <div className="w-138  pt-1 pb-1">
      <div className={rowClasses}>
        {/* LEFT: icon + label */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            {typeof icon === "string" ? (
              <img src={icon} className="w-6 h-6" alt={label} />
            ) : (
              icon
            )}
          </div>
          <span className="font-semibold text-[15px]">{label}</span>
        </div>

        {/* RIGHT: helper + toggle icon */}
        <div className="flex items-center gap-3">
          {helper && (
            <span className="text-[12px] opacity-70 min-w-[32px] text-right">
              {helper}
            </span>
          )}

          {/* Icon toggle – dark pink when ON, no focus ring / border */}
          <button
            type="button"
            onClick={onChange}
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            className="
              flex items-center justify-center w-16 h-12
              bg-transparent border-none
              focus:outline-none focus:ring-0
            "
            style={{ outline: "none", boxShadow: "none" }}
            role="switch"
            aria-checked={checked}
          >
            {checked ? (
              <LiaToggleOnSolid className={`w-8 h-10 ${isLight ? "text-[#e9d9e3]" : "text-white/90"}`}  />
            ) : (
              <LiaToggleOffSolid className="w-8 h-10 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


// Row with arrow icon on right – border is on inner div
function ButtonRow({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-transparent border-none focus:outline-none focus:ring-0"
      style={{ outline: "none", boxShadow: "none" }}
    >
      <div className={rowClasses}>
        {/* LEFT: icon + label */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            {typeof icon === "string" ? (
              <img src={icon} className="w-6 h-6" alt={label} />
            ) : (
              icon
            )}
          </div>
          <span className="font-semibold text-[15px]">{label}</span>
        </div>

        {/* RIGHT: same structure as toggle row */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] opacity-0 min-w-[32px] text-right">
            &nbsp;
          </span>

          {/* Arrow */}
          <span className="text-2xl leading-none text-gray-400">›</span>
        </div>
      </div>
    </button>
  );
}

// function LanguageButton({ icon, label}) {
//   return (
//     <button
//       type="button"
//       className="w-full text-left bg-transparent border-none focus:outline-none focus:ring-0"
//       style={{ outline: "none", boxShadow: "none" }}
//     >
//       <div className={rowClasses}>
//         {/* LEFT: icon + label */}
//         <div className="flex items-center gap-3">
//           <div className="w-6 h-6 flex items-center justify-center">
//             {typeof icon === "string" ? (
//               <img src={icon} className="w-6 h-6" alt={label} />
//             ) : (
//               icon
//             )}
//           </div>
//           <span className="font-semibold text-[15px]">{label}</span>
//         </div>

//         {/* RIGHT: same structure as toggle row */}
//         <div className="flex items-center gap-3">
//           <span className="text-[12px] opacity-0 min-w-[32px] text-right">
//             &nbsp;
//           </span>

//           {/* Arrow */}
//           <span className="text-2xl leading-none text-gray-400">›</span>
//         </div>
//       </div>
//     </button>
//   );
// }


// SINGLE Setting component

function LanguageButton({ icon, label, selectedLanguage, onLanguageChange, isLight }) {
  const LANGUAGES = ["English", "Tamil", "Korean", "Japanese", "Hindi"];

  return (
    <button
      type="button"
      className="w-full text-left bg-transparent border-none focus:outline-none focus:ring-0"
      style={{ outline: "none", boxShadow: "none" }}
      // prevent button from submitting forms etc.
      onClick={(e) => e.preventDefault()}
    >
      <div className={rowClasses}>
        {/* LEFT: icon + label */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center">
            {typeof icon === "string" ? (
              <img src={icon} className="w-6 h-6" alt={label} />
            ) : (
              icon
            )}
          </div>
          <span className="font-semibold text-[15px]">{label}</span>
        </div>

        {/* RIGHT: dropdown instead of arrow */}
        <div className={`flex items-center  gap-3 
          ${isLight ? "text-slate-900" : "text-slate-100"}
          `}>
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="
              text-[14px] 
              border border-[#f1c6e0] 
              rounded-md 
              px-2 py-1 
              bg-transparent 
              focus:outline-none focus:ring-0
            "
          >
            {LANGUAGES.map((lang) => (
              <option  key={lang} value={lang}
              disabled={lang !== "English"}
              className={`
                ${isLight ? "bg-white/90" : "bg-white/10 text-slate-600"}
                border-none
                `}
              >
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>
    </button>
  );
}


function Setting({
  onLocationDetected,
  onOpenSupport,
  onOpenFeedback,
  onOpenRating,
  onOpenPrivacy,
}) {
  const [is24h, setIs24h] = useState(true);
  const [locationOn, setLocationOn] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
    const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const [deletePopup, setDeletePopup] = useState(false)
  const [clearCachePopup, setClearCachePopup] = useState(false)

  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const [showConfirm, setShowConfirm] = useState(false)
  

  //   const user = auth.currentUser;
  
//   const navSkinQuestions = () => {
//     navigate('/questionnaire')
// }

  const auth = getAuth();
  const user = auth.currentUser;
  
 
   const [idToken, setIdToken] = useState("")

   const [error, setError] = useState("")
   const [success, setSuccess] = useState("")
 
     useEffect(() => {
       const unsub = onAuthStateChanged(auth, async (u) => {
         // setUser(u);
         // setAuthToken(await u.getIdToken(false))
         setIdToken(await u.getIdToken(false))
       });
   
       return () => unsub();
     }, [auth]);

  const handleTimeToggle = () => {
    setIs24h((prev) => !prev);
  };

  const handleLocationToggle = () => {
    const next = !locationOn;
    setLocationOn(next);

    if (!next) {
      setLocationStatus("Location disabled");
    } else {
      setLocationStatus("Detecting location...");
    }
  };

  // Called by <Location /> when it gets city/state
  const handleLocationDetectedInternal = async (location) => {
    if (location?.error) {
      setLocationStatus(`Failed to get location: ${location.error}`);
      return;
    }

    const { city, state } = location || {};

    setLocationStatus(
      `Detected: ${city || "Unknown city"}, ${state || "Unknown state"}`
    );

     if (!idToken) {
    return;
  }

    try {
      // await updateProfile({
      //   city: city || undefined,
      //   state: state || undefined,
      // });
  //       await fetch(`http://127.0.0.1:8484/settings/profile`, {
  //       // headers: { Authorization: AUTH_TOKEN },
  //       method : 'PUT',
  //       headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
  //        body: JSON.stringify({
  //   city: city || undefined,
  //   state: state || undefined
  // })
  //     })

      await updateCityAndState(idToken, city, state)

      // if (!res.ok) throw new Error(await res.text());
      // const data1 = await res.json();

      setLocationStatus(
        `Saved: ${city || "Unknown city"}, ${state || "Unknown state"}`
      );
    } catch (err) {
      console.error("Failed to save location in profile:", err);
      setLocationStatus("Failed to save location");
    }

    if (typeof onLocationDetected === "function") {
      onLocationDetected(location);
    }
  };


   const handleDeleteAccount = async () => {
    setError("");
    setSuccess("");

    if (!password) {
      setError("Please enter your password to confirm.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);

      // Step 1: Re-authenticate
      await reauthenticateWithCredential(user, credential);

      // Step 2: Delete Firebase Auth user
      await deleteUser(user);

      // Step 3: Delete from MongoDB
      await deleteAccountAPI(user.email);

      // Step 4: Redirect
      localStorage.clear();
      navigate('/signup')
    } catch (err) {
      console.error("Delete error:", err);
      setError("Incorrect Password.");
    }
  };

  const handleClearAndCache = async () => {
    setError("")
    setSuccess("")

    try {
      await clearCacheAPI(idToken)
    }
    catch (err) {
      console.error("Clear Cache error : ", err)
      setError("Can't connect to backend")
    }
    setTimeout(() => navigate('/dashboard'), 1000)
  }

  return (
    <section className={`w-[65%] max-w-[600px] mx-auto px-6 pt-6 pb-8 flex flex-col ${isLight ? "bg-white text-slate-900" : "bg-white/10 text-slate-50"}  rounded-lg shadow-lg`}>
      {/* Time zone toggle */}
      <ToggleRow
        icon={<FaRegClock className="w-6 h-6 " />}
        label="Time zone (12h / 24h)"
        checked={is24h}
        onChange={handleTimeToggle}
        helper={is24h ? "24h" : "12h"}
        isLight={isLight}
      />

      {/* Location toggle */}
      <ToggleRow
        icon={<IoLocationOutline className="w-9 h-6 " />}
        label="Location"
        checked={locationOn}
        onChange={handleLocationToggle}
        isLight={isLight}
      />

      {/* Location status text + extra divider under it */}
      {locationStatus && (
        <>
          <div className={`text-[12px] pl-10 mt-1 mb-3
            ${isLight ? "text-slate-800" : "text-slate-100"}
            `}>
            {locationStatus}
          </div>
          <div className="w-full border-b border-[#f1c6e0]" />
        </>
      )}

      {/* Geolocation logic */}
      <Location
        enabled={locationOn}
        onLocationDetected={handleLocationDetectedInternal}
      />

      {/* Skin Type Questions */}
      {/* <ButtonRow
        icon={<MdFaceRetouchingNatural className="w-6 h-6 " />}
        label="Skin Type Questions"
        onClick={navSkinQuestions}
      /> */}

      <LanguageButton
        icon={<IoLanguage className="w-6 h-6 " />}
        label="Language"
        isLight={isLight}
      />

      

      {/* Support */}
      <ButtonRow
        icon={<BiSupport className="w-6 h-6 " />}
        label="Support"
        onClick={onOpenSupport}
      />

      {/* App Feedback */}
      <ButtonRow
        icon={<VscFeedback className="w-6 h-6 " />}
        label="App Feedback"
        onClick={onOpenFeedback}
      />

      {/* App Rating */}
      <ButtonRow
        icon={<GiSelfLove className="w-6 h-6 " />}
        label="App Rating"
        onClick={onOpenRating}
      />

      {/* Privacy */}
      <ButtonRow
        icon={<MdOutlinePrivacyTip className="w-6 h-6 " />}
        label="Privacy"
        onClick={onOpenPrivacy}
      />

      {/* Clear data */}
      <ButtonRow
        icon={<MdOutlineCached className="w-6 h-6 " />}
        label="Clear Data & Cache"
        // onClick={() => {console.log("clear and cache clicked")}}
        onClick={() => setClearCachePopup(true)}
      />

      {/* Delete account – directly under list */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className={`
            py-2.5 px-10 rounded-lg border-none  
            text-white text-md  shadow-lg font-semibold
            focus:outline-none focus:ring-0 cursor-pointer
            ${isLight ? "bg-linear-to-r from-[#994A97] to-[#CA88B1] hover:brightness-110" : "bg-white/10 hover:bg-white/20"}
          `}
          style={{ outline: "none", boxShadow: "none" }}
          onClick={() => setDeletePopup(true)}
        >
          DELETE ACCOUNT
        </button>
      </div>

   {deletePopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className={`w-full max-w-md backdrop-blur-md rounded-xl p-6 shadow-xl space-y-4
             ${isLight ? "bg-black/50 text-slate-100" : "bg-white/50 text-slate-800"} 

      `}>

      <h3 className="text-xl font-semibold text-center">
        Delete Account
      </h3>

      <p className={`text-sm text-center
         ${isLight ? "text-slate-200" : "text-slate-700"} 
        `}>
        Enter your password to delete your account
      </p>
<div className="relative" >

      <input
       type={showConfirm ? "text" : "password"}
        placeholder="Enter your password to confirm"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
        />
        
<span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)}
>
            {/* {showConfirm ? "🙈" : "👁️"} */}
                {showConfirm ? (
        
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M10.477 10.477A3 3 0 0113.5 13.5" />
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M6.53 6.53C4.398 8.088 2.917 10.356 2.458 12
               c1.273 4.057 5.064 7 9.542 7
               1.83 0 3.558-.41 5.064-1.14M17.47 17.47
               C19.602 15.912 21.083 13.644 21.542 12
               20.269 7.943 16.478 5 12 5
               c-.96 0-1.89.14-2.771.402" />
        </svg>
      ) : (
        
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5
               c4.478 0 8.269 2.943 9.542 7
               -1.273 4.057 -5.064 7 -9.542 7
               -4.477 0 -8.268 -2.943 -9.542 -7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        
      )}
</span>
        </div>

      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div className="flex justify-center gap-8 pt-2">
        <button
          className="px-3 py-1 cursor-pointer font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          onClick={handleDeleteAccount}
        >
          Yes, Delete
        </button>

        <button
          className="px-3 py-1 cursor-pointer font-medium bg-green-400 hover:bg-green-500 text-white rounded-lg transition"
          onClick={() => setDeletePopup(false)}
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

 {clearCachePopup && (
  <div className="fixed inset-0 flex items-center justify-center  z-50">
    <div className={`w-full max-w-md backdrop-blur-md rounded-xl p-6 shadow-xl space-y-4
       ${isLight ? "bg-black/50 text-slate-100" : "bg-white/50 text-slate-800"} 
      `}>

      <h3 className="text-xl font-semibold  text-center">
        Clear Cache
      </h3>

      <p className={`text-sm text-gray-400 text-center
        ${isLight ? "text-slate-200" : "text-slate-700"} 
        `}>
        Are you sure to clear all the data ?
      </p>

      

      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div className="flex justify-center gap-8 pt-2">
        <button
          className="px-3 py-1 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
          onClick={handleClearAndCache}
        >
          Yes, Clear
        </button>

        <button
          className="px-3 py-1 cursor-pointer bg-green-400 hover:bg-green-500 text-white font-medium rounded-lg transition"
          onClick={() => setClearCachePopup(false)}
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}


    </section>
  );
}

export default Setting;
