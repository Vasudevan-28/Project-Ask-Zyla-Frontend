import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { resetEmailPassword } from "../services/backendAPI";
import ZylaNewPassword from "../zyla_components/ZylaNewPassword";
import HeaderAuth from "./HeaderAuth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const locaState = useLocation();

  const { email } = locaState.state || {};

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setSuccess(false);

    if (!allValid) {
      setError("Please follow all password rules.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetEmailPassword(email, password);

      if (response.message === "Password updated") {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => navigate("/success"), 1500);
      } else {
        // in case API returns something unexpected
        setLoading(false);
        setError(response.message || "Unexpected response from server.");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err.response?.data?.detail || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col relative bg-[#1d0e2d]">
      <div className=" md:fixed  z-999">
        <HeaderAuth />
      </div>

      <div className="min-h-screen p-4 justify-center items-center flex flex-col md:flex-row bg-[#1d0e2d] relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2  p-2 md:p-0"
        >
          <div
            className="items-center md:mt-30 justify-center flex  
                            origin-center scale-85 md:scale-100
                            "
          >
            <ZylaNewPassword />
          </div>
        </motion.div>

        {/* Form container */}
        <div className="w-full h-fit max-w-xl bg-white/20 backdrop-blur-xl shadow-xl rounded-3xl p-6 sm:p-8 md:p-10 border border-white/30 relative">
          {/* TITLE */}
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold mt-3 mb-2 text-white">
            Set New Password
          </h2>

          <p className="text-center text-white/90 mb-6 px-2 sm:px-8 text-xs sm:text-sm">
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
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white border-2 border-purple-500 shadow-md outline-none focus:ring-2 focus:ring-purple-300 pr-12 text-sm sm:text-base"
              aria-label="New password"
            />

            {/* Eye icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.477 10.477A3 3 0 0113.5 13.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.53 6.53C4.398 8.088 2.917 10.356 2.458 12
                       c1.273 4.057 5.064 7 9.542 7
                       1.83 0 3.558-.41 5.064-1.14M17.47 17.47
                       C19.602 15.912 21.083 13.644 21.542 12
                       20.269 7.943 16.478 5 12 5
                       c-.96 0-1.89.14-2.771.402"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5
                       c4.478 0 8.269 2.943 9.542 7
                       -1.273 4.057 -5.064 7 -9.542 7
                       -4.477 0 -8.268 -2.943 -9.542 -7z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>

            {/* PASSWORD VALIDATION POPUP */}
            {focused && (
              <div className="absolute top-full left-0 mt-2 w-full sm:w-[70%] bg-white/95 rounded-lg shadow-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-800 z-10">
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
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white border-2 shadow-md outline-none pr-12 text-sm sm:text-base
                ${confirm && password !== confirm ? "border-red-500" : "border-purple-500"}`}
              aria-label="Confirm password"
            />

            {/* Eye icon */}
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.477 10.477A3 3 0 0113.5 13.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.53 6.53C4.398 8.088 2.917 10.356 2.458 12
                       c1.273 4.057 5.064 7 9.542 7
                       1.83 0 3.558-.41 5.064-1.14M17.47 17.47
                       C19.602 15.912 21.083 13.644 21.542 12
                       20.269 7.943 16.478 5 12 5
                       c-.96 0-1.89.14-2.771.402"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5
                       c4.478 0 8.269 2.943 9.542 7
                       -1.273 4.057 -5.064 7 -9.542 7
                       -4.477 0 -8.268 -2.943 -9.542 -7z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p role="alert" className="text-[#f20a0e] font-semibold text-sm mb-3">
              {error}
            </p>
          )}

          {/* RESET BUTTON */}
          <button
            onClick={handleReset}
            disabled={loading || success}
            aria-busy={loading}
            className={`w-full text-white py-2.5 sm:py-3 cursor-pointer rounded-lg font-semibold shadow-lg transition text-sm sm:text-base flex items-center justify-center gap-2
              ${loading || success ? "opacity-80 pointer-events-none" : ""}`}
            style={{ backgroundColor: "rgba(58, 44, 73, 1)" }}
          >
            {loading ? (
              <>
                {/* spinner */}
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Resetting...</span>
              </>
            ) : success ? (
              <>
                {/* check icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Success</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </div>
      </div>
      <div className="md:hidden h-40" />
    </div>
  );
}