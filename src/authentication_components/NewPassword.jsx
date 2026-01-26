import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNewPassword } from "../services/backendAPI";
import HeaderAuth from "./HeaderAuth";

export default function NewPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const allValid = Object.values(validations).every((v) => v === true);

  const handleReset = async () => {
    setError("");
    setSuccess("");

    if (!allValid) {
      setError("Please follow all password rules.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await setNewPassword(password);

      if (response.message === "Password updated") {
        setSuccess("Password updated successfully!");
        setTimeout(() => navigate("/success", { replace: true }), 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0D28]">
      <HeaderAuth />
      <div className="flex items-center min-h-[80vh] justify-center p-4">
        <div className="w-full max-w-xl bg-white/20 backdrop-blur-xl shadow-xl rounded-3xl py-8 px-6  border border-white/30 relative">
          
          <h2 className="text-center text-2xl sm:text-3xl font-semibold  mb-2 text-white">
            Set New Password
          </h2>

          <p className="text-center text-white/90 mb-6 px-4  text-sm">
            Set the new password for your account so you can log in and access
            all features.
          </p>

          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              maxLength={16}
              className="w-full px-4 py-2 rounded-lg bg-white border-2 border-purple-500 shadow-md outline-none focus:ring-2 focus:ring-purple-300 pr-12"
            />

            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.477 10.477A3 3 0 0113.5 13.5"
                  />
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
                  className="w-6 h-6"
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
            </span>

            {/* PASSWORD VALIDATION POPUP */}
            {focused && (
              <div className="absolute top-full left-0 mt-2 w-[70%] sm:w-[60%] bg-white/95 rounded-lg shadow-lg p-4 text-xs sm:text-sm text-gray-800 z-10">
                <p className={validations.length ? "text-green-500" : ""}>
                  Be at least 8 characters
                </p>
                <p className={validations.uppercase ? "text-green-500" : ""}>
                  Include at least 1 uppercase letter
                </p>
                <p className={validations.lowercase ? "text-green-500" : ""}>
                  Include at least 1 lowercase letter
                </p>
                <p className={validations.number ? "text-green-500" : ""}>
                  Include at least 1 number
                </p>
                <p className={validations.symbol ? "text-green-500" : ""}>
                  Include at least 1 symbol
                </p>
              </div>
            )}
          </div>

          <div className="mb-6 relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              maxLength={16}
              className={`w-full px-4 py-2 rounded-lg bg-white border-2 shadow-md outline-none pr-12 
              ${confirm && password !== confirm ? "border-red-500" : "border-purple-500"}`}
            />

            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.477 10.477A3 3 0 0113.5 13.5"
                  />
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
                  className="w-6 h-6"
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
            </span>
          </div>

          {error && <p className="text-[#f20a0e] text-sm mb-3">{error}</p>}

          {success && <p className="text-green-400 text-sm mb-3">{success}</p>}

          <button
            onClick={handleReset}
            disabled={loading}
            aria-busy={loading}
            aria-disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-semibold shadow-lg transition text-sm sm:text-base flex items-center justify-center
              ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
            style={{ backgroundColor: "rgba(58, 44, 73, 1)" }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
                <span>Resetting...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}