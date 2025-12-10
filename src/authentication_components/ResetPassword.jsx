import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
// import { resetEmailPassword } from "../team-pages/services/backendAPI";
import { resetEmailPassword } from "../services/backendAPI";
import ZylaNewPassword from "../zyla_components/ZylaNewPassword";
import HeaderQP from "../home_components/HeaderQP";
import HeaderNew from "../home_components/HeaderNew";
import ZaLogo from "../assets/ZaLogo.png"
// import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const locaState = useLocation()

  const { email } = locaState.state || {}
   

  // const email = localStorage.getItem("reset_email");
 
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
 
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
 
  // ---------------- PASSWORD RULES ----------------
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
 
  const allValid = Object.values(validations).every((v) => v === true);
 
  // ---------------- HANDLE RESET ----------------
  const handleReset = async () => {
    setError("");
    setSuccess("");
    console.log("Reset Page.....")
    console.log(email)
 
    // if (!email) {
    //   setError("No email found. Restart the reset flow.");
    //   return;
    // }
 
    if (!allValid) {
      setError("Please follow all password rules.");
      return;
    }
 
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await resetEmailPassword(email, password);
 
      if (response.message === "Password updated") {
        setSuccess("Password updated successfully!");
 
        // setTimeout(() => navigate("/login"), 1500);
        setTimeout(() => navigate("/success"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Something went wrong.");
    }
  };
 
  return (
<div className="min-h-screen flex flex-row items-center justify-center bg-[#1A0D28] p-4">
  {/* <HeaderQP /> */}
  {/* <HeaderNew /> */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex items-center justify-between p-4 md:p-0"
      >
        {/* <img src={videoBg} alt="GIF" className="w-[70%] sm:w-[60%] md:w-[65%] lg:w-[60%]" /> */}
        <ZylaNewPassword />
      </motion.div>

<div className="w-full max-w-xl bg-white/20 backdrop-blur-xl shadow-xl rounded-3xl p-8 sm:p-10 border border-white/30 relative">
 
   <div className="flex justify-center  mb-4" >
 
                   {/* <img src={ZaLogo} alt="ZA logo" className="h-[56px] w-auto block" /> */}
 
                    <div className="flex items-center gap-0.5">
                           <img src={ZaLogo} alt="ZA logo" className="h-[56px] w-auto block" />
                           <div className="font-['Playfair_Display'] -mb-1 font-bold leading-[0.9] mt-3 select-none">
                             <div className="text-[20px]  text-[#1c0d25] ">Ask</div>
                             <div className="text-[30px]  text-[#1c0d25]">Zyla</div>
                           </div>
                         </div>
           </div>
 
        {/* TITLE */}
<h2 className="text-center text-2xl sm:text-3xl font-semibold mt-7 mb-2 text-white">
          Set New Password
</h2>
 
        <p className="text-center text-white/90 mb-6 px-4 sm:px-8 text-sm">
          Set the new password for your account
</p>
 
        {/* PASSWORD FIELD */}
<div className="mb-4 relative">
<input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            maxLength={16}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full px-4 py-3 rounded-lg bg-white border-2 border-purple-500 shadow-md outline-none focus:ring-2 focus:ring-purple-300 pr-12"
          />
 
          {/* Eye icon */}
<span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
>
            {/* {showPassword ? "🙈" : "👁️"} */}
                {showPassword ? (
        /* Eye ON */
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
        /* Eye OFF */
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
 
          {/* PASSWORD VALIDATION POPUP */}
          {focused && (
<div className="absolute top-full left-0 mt-2 w-[70%] sm:w-[60%] bg-white/95 rounded-lg shadow-lg p-4 text-xs sm:text-sm text-gray-800 z-10">
<p className={validations.length ? "text-green-500" : ""}>Be at least 8 characters</p>
<p className={validations.uppercase ? "text-green-500" : ""}>Include at least 1 uppercase letter</p>
<p className={validations.lowercase ? "text-green-500" : ""}>Include at least 1 lowercase letter</p>
<p className={validations.number ? "text-green-500" : ""}>Include at least 1 number</p>
<p className={validations.symbol ? "text-green-500" : ""}>Include at least 1 symbol</p>
</div>
          )}
</div>
 
        {/* CONFIRM PASSWORD */}
<div className="mb-6 relative">
<input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirm}
            maxLength={16}
            onChange={(e) => setConfirm(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-white border-2 shadow-md outline-none pr-12 
              ${confirm && password !== confirm ? "border-red-500" : "border-purple-500"}`}
          />
 
          {/* Eye icon */}
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
 
        {/* ERROR MESSAGE */}
        {error && <p className="text-[#f20a0e] font-semibold text-sm mb-3">{error}</p>}
 
        {/* SUCCESS MESSAGE */}
        {success && <p className="text-green-400 font-semibold text-sm mb-3">{success}</p>}
 
        {/* RESET BUTTON */}
<button
          onClick={handleReset}
          className="w-full text-white py-3 cursor-pointer rounded-lg font-semibold shadow-lg transition text-sm sm:text-base"
          style={{ backgroundColor: "rgba(58, 44, 73, 1)" }}
>
          Reset Password
</button>
</div>
</div>
  );
}