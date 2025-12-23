import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  verifyEmailOtp,
  verifyPhoneOtp,
  sendEmailOtp,
  sendOtpToPhone,
} from "../services/backendAPI";

export default function VerifyOtp6() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, phone } = location.state || {};

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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

    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`).focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`).focus();
    }
  };

  // ----------------------------
  // VERIFY 6-digit OTP
  // ----------------------------
  const handleVerify = async () => {
    const otp = code.join("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    try {
      let res;

      if (email) {
        res = await verifyEmailOtp(email, otp);
        localStorage.setItem("reset_email", email);
      } else if (phone) {
        res = await verifyPhoneOtp(phone, otp);
        localStorage.setItem("reset_phone", phone);
      }

      setError("");
      navigate("/newpassword");
    } catch (err) {
      setError("Invalid or expired OTP");
    }
  };

  // ----------------------------
  // RESEND
  // ----------------------------
  const handleResend = async () => {
    try {
      if (email) await sendEmailOtp(email);
      if (phone) await sendOtpToPhone(phone);

      setCode(["", "", "", "", "", ""]);
      setError("");
      setTimeLeft(180);
      alert("OTP resent successfully");
    } catch {
      setError("Unable to resend OTP");
    }
  };

  // Animations
  const shakeVariant = {
    shake: { x: [-8, 8, -8, 8, 0], transition: { duration: 0.4 } },
    none: { x: 0 },
  };

  const errorSlide = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A0D28] p-4">
      <div className="w-full max-w-xl bg-white/20 backdrop-blur-xl shadow-xl rounded-3xl 
                      p-6 sm:p-8 md:p-10 border border-white/30">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-2 text-white">
          Enter Verification Code
        </h2>

        <p className="text-center text-white/90 mb-6 px-4 sm:px-8 text-xs sm:text-sm">
          Enter the 6-digit code sent to your {email ? "email" : "phone number"}.
        </p>

        {/* 6 Input Boxes */}
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
              className="w-12 h-12 sm:w-14 sm:h-14 text-center rounded-lg bg-white 
                         border-2 border-purple-500 shadow-md focus:ring-2 
                         focus:ring-purple-300 text-lg sm:text-xl font-semibold"
            />
          ))}
        </motion.div>

        {error && (
          <motion.p
            initial="hidden"
            animate="visible"
            variants={errorSlide}
            className="text-xs sm:text-sm text-center mb-2 font-medium text-red-400"
          >
            {error}
          </motion.p>
        )}

        <p className="text-center text-white/80 text-xs sm:text-sm mb-2">
          Time remaining: {formatTime(timeLeft)}
        </p>

        <div className="text-center mb-4 text-white/90 text-xs sm:text-sm">
          Didn’t receive the code?{" "}
          <button
            onClick={handleResend}
            className="text-blue-400 font-medium hover:underline"
          >
            Resend
          </button>
        </div>

        <button
          onClick={handleVerify}
          className="w-full text-white py-3 rounded-lg font-semibold shadow-lg transition bg-[#3A2C49] hover:bg-[#2E2439]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
