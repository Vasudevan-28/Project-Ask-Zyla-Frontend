import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { sendEmailOtp } from "../services/backendAPI";
import HeaderMain from "../home_components/HeaderMain";
import Header from "../home_components/Header1";
import HeaderQP from "../home_components/HeaderQP";
import ZaLogo from "../assets/ZaLogo.png"
import ZylaForgotPassword from "../zyla_components/ZylaForgotPassword";
 
export default function ForgotPassword() {
  const navigate = useNavigate();
 
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
 
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError("Enter valid email ID");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }
 
    try {
      const res = await sendEmailOtp(email);
 
      if (res.message === "OTP sent to email") {
        navigate("/verification", {
          state: { email, otp_expiry: res.otp_expiry },
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
<div className="min-h-screen flex items-center justify-between  bg-[#1A0D28] p-10">
  {/* <HeaderMain /> */}
  {/* <HeaderQP /> */}
 <div className="flex items-center justify-center ml-10">

  <ZylaForgotPassword />
 </div>
      <div className="w-full max-w-xl  backdrop-blur-xl shadow-xl rounded-3xl 
                      p-6 sm:p-8 md:p-10 border border-white/30
                      bg-white/20
                      ">
 
          <div className="flex justify-center  mb-4" >
                <div className="flex items-center gap-0.5">
                  <img src={ZaLogo} alt="ZA logo" className="h-[56px] w-auto block" />
                  <div className="font-['Playfair_Display'] -mb-1 font-bold leading-[0.9] mt-3 select-none">
                    <div className="text-[20px]  text-[#1c0d25] ">Ask</div>
                    <div className="text-[30px]  text-[#1c0d25]">Zyla</div>
                  </div>
                </div>
          </div>

        <h2
          className="text-center text-2xl sm:text-3xl mt-8 font-semibold mb-3 text-white"
        >
          Forgot Password
        </h2>
 
        <p className="text-center text-xs sm:text-sm text-white/90 mb-10 px-4 sm:px-8">
          Enter your registered email for verification. We will send a 4-digit
          code to your email.
        </p>
 
        {/* EMAIL INPUT */}
        <motion.div
          animate={error ? "shake" : "none"}
          variants={shakeVariant}
          className="mb-6"
        >
          <label className="block text-white font-medium mb-1">Email</label>
 
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white shadow-md border border-gray-200 
                       outline-none focus:ring-2 focus:ring-purple-300 transition"
          />
 
          {error && (
            <motion.p
              initial="hidden"
              animate="visible"
              variants={errorSlide}
              className="text-sm font-medium mt-2 text-red-500"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
 
        {/* RESET WITH PHONE */}
        <div className="text-right mt-2 mb-6">
          <button
            onClick={() => navigate("/forgotPhonePasswordReset")}
            className="text-xs sm:text-sm font-medium text-white cursor-pointer"
          >
            Reset with phone number?
          </button>
        </div>
 
        {/* CONTINUE BUTTON */}
        <button
          onClick={handleSendOtp}
          className="w-full text-white py-3 cursor-pointer rounded-lg font-semibold shadow-lg transition
                     bg-[#3A2C49] hover:bg-[#281E35]"
        >
          CONTINUE
        </button>
 
      </div>
</div>
  );
}
