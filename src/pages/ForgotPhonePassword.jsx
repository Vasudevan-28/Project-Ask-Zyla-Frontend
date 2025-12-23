import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { sendEmailOtp, getEmailForPhone } from "../services/backendAPI";

import ZaLogo from "../assets/ZaLogo.png"
import ZylaForgotPhone from "../zyla_components/ZylaForgotPhone";
import HeaderAuth from "../authentication_components/HeaderAuth";
 
export default function ForgotPhonePassword() {
  const navigate = useNavigate();
 
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("")
    
 
  // Shake animation
  const shakeVariant = {
    shake: { x: [-8, 8, -8, 8, 0], transition: { duration: 0.4 } },
    none: { x: 0 },
  };
 
  // Slide-in error
  const errorSlide = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };
 
const handleSendOtp = async () => {
  setError("");
  setMessage("");

  // validate phone, not email
  if (!phone.trim()) {
    setError("Enter valid phone number");
    return;
  }

  try {
    const data = await getEmailForPhone(countryCode + phone);
    const foundEmail = data.email; // from {"email": "..."}
    
    if (!foundEmail) {
      setError("No email found for this phone number.");
      return;
    }
    console.log("ForgotPhonePassword")
    console.log(foundEmail)
    setEmail(foundEmail); // just for UI, if you need it

    const res = await sendEmailOtp(foundEmail);

    if (res.message === "OTP sent to email") {
      navigate("/verification", {
        state: { email: foundEmail, otp_expiry: res.otp_expiry },
      });
    } else {
      setError("Something went wrong.");
    }
  } catch (err) {
    if (
      err.message.includes("Too many OTP") ||
      err.message.includes("429")
    ) {
      setError("❌ Too many OTP requests. Try again after 30 minutes.");
    } else {
      setError("❌ " + (err.message || "Something went wrong."));
    }
  }
};


  return (
<div className="min-h-screen flex items-center justify-between px-10 bg-[#1A0D28] p-4">

<HeaderAuth />
 <div className="flex items-center justify-center ml-10">

  <ZylaForgotPhone />
 </div>


      <div className="w-full max-w-xl bg-white/20 backdrop-blur-xl shadow-xl rounded-3xl 
                      p-6 sm:p-8 md:p-10 border border-white/30">
 
        <h2
          className="text-center text-2xl sm:text-3xl font-semibold mb-3 text-white"
>
          Forgot Password
</h2>
 
        <p className="text-center text-xs sm:text-sm text-white/90 mb-10 px-4 sm:px-8">
          Enter your registered phone for verification. We will send a 4-digit
          code to your email.
</p>
 

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
{/* <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 outline-none placeholder-gray-400"
                /> */}

                  <input
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setPhone(value);
                    }
                  }}
                  // placeholder="enter your phone number"
                  maxLength={10}
                  // onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 outline-none placeholder-gray-400"
                />
</div>
 
              {message && <p className="text-red-300 text-sm mt-2">{message}</p>}
</div>
 
 
        {/* RESET WITH PHONE */}
<div className="text-right mt-2 mb-6">
<button
            onClick={() => navigate("/forgot-password")}
            className="text-xs sm:text-sm font-medium text-white cursor-pointer"
>
            Reset with Email?
</button>
</div>
 
        {/* CONTINUE BUTTON */}
<button
          onClick={handleSendOtp}
          className="w-full text-white py-3 rounded-lg cursor-pointer font-semibold shadow-lg transition
                     bg-[#3A2C49] hover:bg-[#281E35]"
>
          CONTINUE
</button>
 
      </div>
</div>
  );
}