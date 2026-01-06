import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { sendEmailOtp, getEmailForPhone } from "../services/backendAPI";
import ZylaForgotPhone from "../zyla_components/ZylaForgotPhone";
import HeaderAuth from "../authentication_components/HeaderAuth";

export default function ForgotPhonePassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const expectedLengths = {
    "+91": 10, // India
    "+1": 10, 
    "+44": 10,
    "+61": 9, 
    "+971": 9, 
  };
  const expectedLength = expectedLengths[countryCode] || 10;

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

    // basic presence check
    if (!phone.trim()) {
      setError("Enter valid phone number");
      return;
    }

    // partial submission check
    if (phone.length < expectedLength) {
      setMessage(
        `Please enter complete phone number (${expectedLength} digits for ${countryCode}).`
      );
      return;
    }

    setIsLoading(true);

    try {
      const data = await getEmailForPhone(countryCode + phone);
      const foundEmail = data.email;

      if (!foundEmail) {
        setError("No email found for this phone number.");
        setIsLoading(false);
        return;
      }
      setEmail(foundEmail);

      const res = await sendEmailOtp(foundEmail);

      if (res.message === "OTP sent to email") {
        // navigate to verification with state
        navigate("/verification", {
          state: { email: foundEmail, otp_expiry: res.otp_expiry },
        });
        return; 
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      const errMsg = err?.message || String(err) || "Something went wrong.";
      if (errMsg.includes("Too many OTP") || errMsg.includes("429")) {
        setError("Too many OTP requests. Try again after 30 minutes.");
      } else {
        setError(errMsg);
      }
    } finally {
      // if not navigated away, turn loading off
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-[#1A0D28]">
      <HeaderAuth />

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center  px-4 md:px-10 gap-8 mt-8 md:mt-16">
        <div className="flex justify-start md:w-1/2">
          <div className="max-w-md w-full  scale-85 md:scale-100 p-0">
            <ZylaForgotPhone />
          </div>
        </div>

        {/* Form card */}
        <div className="w-full   md:w-1/2 max-w-xl bg-white/20 backdrop-blur-xl shadow-xl rounded-3xl p-6 md:p-10 border border-white/30">
          <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-3 text-white">
            Forgot Password
          </h2>

          <p className="text-center text-xs sm:text-sm text-white/90 mb-6 sm:mb-10 px-2 sm:px-8">
            Enter your registered phone for verification. We will send a 4-digit
            code to your email.
          </p>

          <div className="mt-4">
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

              <input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  // Respect expected length for the selected country
                  if (raw.length <= expectedLength) {
                    setPhone(raw);
                    // Clear partial message as user types to completion
                    if (raw.length >= expectedLength) setMessage("");
                  } else {
                    setPhone(raw.slice(0, expectedLength));
                  }
                }}
                maxLength={expectedLength}
                placeholder="Enter phone number"
                aria-label="Phone number"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 outline-none placeholder-gray-400"
              />
            </div>

            {message && (
              <motion.p
                initial="hidden"
                animate="visible"
                variants={errorSlide}
                className="text-yellow-200 text-sm mt-2"
              >
                {message}
              </motion.p>
            )}

            {error && (
              <motion.p
                initial="hidden"
                animate="visible"
                variants={errorSlide}
                className="text-red-300 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          <div className="text-right mt-4 mb-6">
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
            disabled={isLoading}
            aria-busy={isLoading}
            className={`w-full text-white py-3 rounded-lg cursor-pointer font-semibold shadow-lg transition
                       bg-[#3A2C49] hover:bg-[#281E35] flex items-center justify-center gap-3 ${
                         isLoading ? "opacity-80 pointer-events-none" : ""
                       }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span className="text-sm">Verifying...</span>
              </>
            ) : (
              "CONTINUE"
            )}
          </button>
        </div>
        <div className="h-20" ></div>
      </div>
    </div>
  );
}