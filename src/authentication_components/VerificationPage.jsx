import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  verifyEmailOtp,
  // verifyPhoneOtp,
  sendEmailOtp,
  sendOtpToPhone,
} from "../services/backendAPI";

import HeaderAuth from "./HeaderAuth";
 
export default function VerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
 
  const { email, phone } = location.state || {}; 
 
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [showSentDialog, setShowSentDialog] = useState(false);

  const dialogTimeoutRef = useRef(null);
 
  
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
 
  useEffect(() => {
    return () => {
      if (dialogTimeoutRef.current) {
        clearTimeout(dialogTimeoutRef.current);
      }
    };
  }, []);
 
  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s < 10 ? "0" + s : s}`;
  };
 
  const handleChange = (e, i) => {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return;
 
    const newCode = [...code];
    newCode[i] = val;
    setCode(newCode);
 
    if (val && i < 3) {
      const next = document.getElementById(`otp-${i + 1}`);
      if (next) next.focus();
    }
  };
 
  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      const prev = document.getElementById(`otp-${i - 1}`);
      if (prev) prev.focus();
    }
  };
 
  const handleVerify = async () => {
    const otp = code.join("");

    if (otp.length !== 4) {
      setError("Please enter the 4-digit code");
      return;
    }

    setError("");
    setVerifying(true);

    try {
      if (email) {
        await verifyEmailOtp(email, otp);
        // localStorage.setItem("reset_email", email);
        navigate("/resetPassword", { state: { email }, replace: true },);
      } 
      // else if (phone) {
      //   await verifyPhoneOtp(phone, otp);
      //   localStorage.setItem("reset_phone", phone);
      // }
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Invalid or expired OTP");
    } finally {
      setVerifying(false);
    }
  };
 
  const handleResend = async () => {
    setError("");
    setResending(true);

    try {
      if (email) await sendEmailOtp(email);
      if (phone) await sendOtpToPhone(phone);

      setCode(["", "", "", ""]);
      setTimeLeft(180);

      setShowSentDialog(true);
      if (dialogTimeoutRef.current) clearTimeout(dialogTimeoutRef.current);
      dialogTimeoutRef.current = setTimeout(() => {
        setShowSentDialog(false);
        dialogTimeoutRef.current = null;
      }, 2000);
    } catch (err) {
      setError("Unable to resend OTP");
    } finally {
      setResending(false);
    }
  };
 
  const shakeVariant = {
    shake: { x: [-8, 8, -8, 8, 0], transition: { duration: 0.4 } },
    none: { x: 0 },
  };
 
  const errorSlide = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };
 
  return (
    <div className="min-h-screen bg-[#1A0D28]">
      <HeaderAuth />
      <div className="flex items-center h-[80vh] justify-center p-4">
        <div className="w-full max-w-xl bg-white/20 backdrop-blur-xl shadow-xl rounded-3xl p-6 sm:p-8 md:p-10 border border-white/30">
          {/* Title */}
          <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-2 text-white">
            Enter Verification Code
          </h2>

          <p className="text-center text-white/90 mb-6 px-4 sm:px-8 text-xs sm:text-sm">
            Enter the 4-digit code sent to your {email ? "email" : "phone number"}.
          </p>

          {/* 4-digit Input Boxes */}
          <motion.div
            animate={error ? "shake" : "none"}
            variants={shakeVariant}
            className="flex justify-center space-x-3 sm:space-x-4 mb-2"
          >
            {code.map((v, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                value={v}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center rounded-lg bg-white border-2 border-purple-500 shadow-md focus:ring-2 focus:ring-purple-300 text-lg sm:text-xl font-semibold"
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.p
              initial="hidden"
              animate="visible"
              variants={errorSlide}
              className="text-xs sm:text-sm text-center mb-2 font-medium text-red-400"
              role="alert"
            >
              {error}
            </motion.p>
          )}

          {/* Timer */}
          <p className="text-center text-white/80 text-xs sm:text-sm mb-2">
            Time remaining: {formatTime(timeLeft)}
          </p>

          {/* Resend */}
          <div className="text-center mb-4 text-white/90 text-xs sm:text-sm">
            Didn’t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className={`inline-flex items-center gap-2 ${resending ? "opacity-60 pointer-events-none" : "text-blue-400 font-medium hover:underline"} `}
              aria-busy={resending}
            >
              {resending ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Resend"
              )}
            </button>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleVerify}
            disabled={verifying}
            aria-busy={verifying}
            className="w-full text-white py-3 cursor-pointer rounded-lg font-semibold shadow-lg transition bg-[#3A2C49] hover:bg-[#2E2439] disabled:opacity-70"
          >
            <div className="flex items-center justify-center gap-2">
              {verifying ? (
                <>
                  <svg
                    className="w-5 h-5 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </div>
          </button>
        </div>
      </div>

    {showSentDialog && (
  <div
    className="fixed left-1/2 top-24 -translate-x-1/2 z-50 pointer-events-none"
    role="status"
    aria-live="polite"
  >
    <div
      className="
        pointer-events-auto
        animate-in fade-in slide-in-from-top-3 duration-300
        bg-white/90 backdrop-blur
        text-gray-900
        rounded-xl
        shadow-[0_10px_30px_rgba(0,0,0,0.12)]
        px-5 py-4
      "
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span className="text-sm font-semibold">
          OTP sent successfully
        </span>
      </div>
    </div>
  </div>
)}

    </div>
  );
}