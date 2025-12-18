import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { setupRecaptcha, sendOTP, verifyOTP } from "../team-pages/services/authservice";
import { setupRecaptcha, sendOTP, verifyOTP } from "../services/authservice";
// import { phoneOtpAttempt } from "../team-pages/services/backendAPI";
import { phoneOtpAttempt } from "../services/backendAPI";
import HeaderAuth from "./HeaderAuth";
 
export default function ForgotPasswordPhone() {
  const navigate = useNavigate();
 
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(null);
 
  // -------------------------
  // SEND OTP
  // -------------------------
  const handleSendOTP = async () => {
    setMessage("");
 
    if (phone.length !== 10) {
      setMessage("❌ Enter a valid 10-digit phone number");
      return;
    }
 
    try {
      await phoneOtpAttempt(countryCode + phone);
 
      setupRecaptcha();
      await sendOTP(countryCode + phone);
 
      setMessage("OTP sent successfully 📩");
      setStep(2);
 
      const expiry = Date.now() + 3 * 60 * 1000;
      setSecondsLeft(Math.floor((expiry - Date.now()) / 1000));
 
      const timer = setInterval(() => {
        const left = Math.floor((expiry - Date.now()) / 1000);
        setSecondsLeft(left > 0 ? left : 0);
        if (left <= 0) clearInterval(timer);
      }, 1000);
    } catch (err) {
      setMessage("❌ " + (err.message || "Something went wrong"));
    }
  };
 
  // -------------------------
  // VERIFY OTP
  // -------------------------
  const handleVerifyOTP = async () => {
    if (secondsLeft <= 0) {
      setMessage("❌ OTP expired. Request a new one.");
      return;
    }
 
    try {
      await verifyOTP(otp);
 
      localStorage.setItem("resetPhone", countryCode + phone);
 
      setMessage("✅ Phone verified! Redirecting...");
      setTimeout(() => navigate("/r"), 1200);
    } catch (err) {
      setMessage("❌ Invalid OTP. Try again.");
    }
  };
 
  return (
<div className="min-h-screen flex items-center justify-center bg-[#1A0D28] p-4">
  <HeaderAuth />
<div className="w-full max-w-xl bg-[#3A3146]/60 backdrop-blur-xl shadow-2xl rounded-3xl p-10">
 
        {/* Title */}
<h1 className="text-3xl font-semibold text-white text-center">
          Reset with Phone Number
</h1>
 
        <p className="text-white/70 text-center mt-3 text-sm">
          Enter your phone number to receive a 4-digit OTP.
</p>
 
        {/* STEP 1 — ENTER PHONE */}
        {step === 1 && (
<>
<div className="mt-8">
<label className="block text-white mb-2">Phone Number</label>
 
              <div className="flex gap-3">
                {/* COUNTRY CODE DROPDOWN */}
<select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-white text-[#3A2C49] font-medium outline-none"
>
<option value="+91">🇮🇳 +91</option>
<option value="+1">🇺🇸 +1</option>
<option value="+44">🇬🇧 +44</option>
<option value="+61">🇦🇺 +61</option>
<option value="+971">🇦🇪 +971</option>
</select>
 
                {/* PHONE INPUT */}
<input
 type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                  value={phone}
              onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
     setPhone(value);
    }}}
                // placeholder="enter your phone number"
                maxLength={10}

                  // onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 outline-none placeholder-gray-400"
                />
</div>
 
              {message && <p className="text-red-300 text-sm mt-2">{message}</p>}
</div>
 
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-right text-white/80 text-sm mt-4 cursor-pointer hover:underline"
>
              Reset with email?
</p>
 
            <button
              onClick={handleSendOTP}
              className="mt-8 w-full bg-[#3A3146] hover:bg-[#2e2537] text-white font-semibold py-3 rounded-xl shadow-lg active:scale-[0.98] transition"
>
              CONTINUE
</button>
</>
        )}
 
        {/* STEP 2 — VERIFY OTP */}
        {step === 2 && (
<>
<div className="mt-8">
<label className="block text-white mb-2">Enter OTP</label>
 
              <input
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="4-digit OTP"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 outline-none placeholder-gray-400"
              />
 
              {secondsLeft > 0 && (
<p className="text-white/70 text-sm mt-2">
                  Time left: <strong>{Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, "0")}</strong>
</p>
              )}
</div>
 
            <button
              onClick={handleVerifyOTP}
              className="mt-8 w-full bg-[#3A3146] hover:bg-[#2e2537] text-white font-semibold py-3 rounded-xl shadow-lg active:scale-[0.98] transition"
>
              VERIFY OTP
</button>
</>
        )}
 
        {message && <p className="text-white text-sm mt-4">{message}</p>}
 
        <div id="recaptcha-container"></div>
</div>
</div>
  );
}