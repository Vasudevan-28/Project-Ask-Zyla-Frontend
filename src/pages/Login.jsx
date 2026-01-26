import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../services/authservice";
import { loginWithBackend } from "../services/backendAPI";
import ZylaLogin from "../zyla_components/ZylaLogin";
import HeaderAuth from "../authentication_components/HeaderAuth";

const MAX_ATTEMPTS = 3;              
const LOCK_DURATION_MS = 1.5 * 60 * 1000;  
const LOCK_STORAGE_KEY = "loginLockout";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailPhoneError, setEmailPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\+?[0-9]{10,15}$/.test(phone);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCK_STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      if (data.lockoutUntil && data.lockoutUntil > Date.now()) {
        setLockoutUntil(data.lockoutUntil);
      } else {
        localStorage.removeItem(LOCK_STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(LOCK_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!lockoutUntil) {
      setRemainingSeconds(0);
      return;
    }

    const update = () => {
      const diff = lockoutUntil - Date.now();
      if (diff <= 0) {
        setLockoutUntil(null);
        setRemainingSeconds(0);
        localStorage.removeItem(LOCK_STORAGE_KEY);
      } else {
        setRemainingSeconds(Math.ceil(diff / 1000));
      }
    };

    update(); 
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLocked = lockoutUntil && lockoutUntil > Date.now();

  const registerFailedAttempt = () => {
    try {
      const raw = localStorage.getItem(LOCK_STORAGE_KEY);
      let attempts = 0;
      let existingLock = null;

      if (raw) {
        const data = JSON.parse(raw);
        attempts = data.attempts || 0;
        existingLock = data.lockoutUntil || null;
      }

      if (existingLock && existingLock > Date.now()) {
        setLockoutUntil(existingLock);
        return;
      }

      attempts += 1;

      if (attempts >= MAX_ATTEMPTS) {
        const newLockoutUntil = Date.now() + LOCK_DURATION_MS;
        localStorage.setItem(
          LOCK_STORAGE_KEY,
          JSON.stringify({ attempts: 0, lockoutUntil: newLockoutUntil })
        );
        setLockoutUntil(newLockoutUntil);
        setPasswordError("Too many failed attempts. Please try again in 1.5 minute.");
      } else {
        localStorage.setItem(
          LOCK_STORAGE_KEY,
          JSON.stringify({ attempts, lockoutUntil: null })
        );
        setPasswordError(
          `Incorrect password. ${
            MAX_ATTEMPTS - attempts
          } attempt(s) remaining before lockout.`
        );
      }
    } catch {
      setPasswordError("Incorrect password.");
    }
  };


const handleLogin = async (e) => {
  e.preventDefault();

  if (loading) return;

  if (isLocked) {
    setPasswordError(
      `Too many failed attempts. Try again in ${remainingSeconds} second${
        remainingSeconds === 1 ? "" : "s"
      }.`
    );
    return;
  }

  setEmailPhoneError("");
  setPasswordError("");

  const id = identifier.trim();
  const looksLikeEmail = id.includes("@");

  if (!id) {
    setEmailPhoneError("Please enter Email or Phone");
    return;
  }

  if (looksLikeEmail && !isValidEmail(id)) {
    setEmailPhoneError("Please enter a valid Email ID");
    return;
  }

  if (!looksLikeEmail && !isValidPhone(id)) {
    setEmailPhoneError("Please enter a valid phone number");
    return;
  }

  if (!password) {
    setPasswordError("Please enter your password");
    return;
  }

  try {
    setLoading(true);

    await loginWithBackend(id, password);

    if (looksLikeEmail) {
      const firebaseUser = await loginUser(id, password);

      if (!firebaseUser.user.emailVerified) {
        setEmailPhoneError("Please verify your email before logging in.");
        return;
      }
    }

    localStorage.removeItem(LOCK_STORAGE_KEY);
    setLockoutUntil(null);
    setRemainingSeconds(0);

  } catch (error) {

    console.error("Login error:", error);

    const status = error?.response?.status

if (status === 404) {
  setPasswordError("User Not Found")
}
else if (status === 401) {
  registerFailedAttempt();
  setPasswordError("Invalid password");
}
else if (status === 403) {
  setEmailPhoneError("Please verify your email before logging in.");
}
else {
  setPasswordError("Login failed. Please try again.");
}
  } finally {
    setLoading(false);
  }
};


  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setEmailPhoneError(`Google login failed : ${err}`);
    }
  };

  const shakeVariant = {
    shake: { x: [-8, 8, -8, 8, 0], transition: { duration: 0.4 } },
    none: { x: 0 },
  };

  return (
    <div className="flex flex-col relative bg-[#1d0e2d]" >

    <div className=" md:fixed  z-999" > 

        <HeaderAuth />
    </div>
  
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1d0e2d] relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2  p-2 md:p-0"
      >
        <div className="items-center md:mt-30 justify-center flex  
                        origin-center scale-85 md:scale-100
                        " >
        <ZylaLogin />
        </div>
      </motion.div>

      <div className="w-full md:w-1/2 flex justify-center  items-center p-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          whileHover={{ scale: 1.01 }}
          className="w-full max-w-md bg-white/20 backdrop-blur-xl shadow-xl rounded-2xl p-6  border border-white/30"
        >
          <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-6 text-white">
            Sign in to your beauty sanctuary!
          </h2>

          {isLocked && (
            <p className="text-center text-sm text-slate-200 mb-3">
              Too many failed attempts. Please wait{" "}
              <span className="font-semibold">
                {remainingSeconds} second{remainingSeconds === 1 ? "" : "s"}
              </span>{" "}
              before trying again.
            </p>
          )}

          <div className="flex flex-col gap-4">
            <motion.div animate={emailPhoneError ? "shake" : "none"} variants={shakeVariant}>
              <label className="block text-white font-medium mb-1">Email or Phone</label>

              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="example@gmail.com or +xxxxxxxxxxx"
                className="w-full px-4 py-2.5 rounded-lg bg-white shadow-md border border-gray-200"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLocked}
              />

              {emailPhoneError && (
                <motion.p className="text-sm mt-1 text-red-500">
                  {emailPhoneError}
                </motion.p>
              )}
            </motion.div>

            <motion.div animate={passwordError ? "shake" : "none"} variants={shakeVariant}>
              <label className="block text-white font-medium mb-1">Password</label>

              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 rounded-lg bg-white shadow-md border border-gray-200"
                  value={password}
                  minLength={8}
                  maxLength={16}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-20 cursor-pointer text-gray-600"
                  disabled={isLocked}
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.477 10.477A3 3 0 0113.5 13.5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.53 6.53C4.398 8.088 2.917 10.356 2.458 12c1.273 4.057 5.064 7 9.542 7 1.83 0 3.558-.41 5.064-1.14M17.47 17.47C19.602 15.912 21.083 13.644 21.542 12 20.269 7.943 16.478 5 12 5c-.96 0-1.89.14-2.771.402"
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
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {passwordError && (
                <motion.p className="text-sm mt-1 text-red-500">{passwordError}</motion.p>
              )}

              <div className="text-right mt-1">
                <button
                  className="text-sm text-white disabled:opacity-50 cursor-pointer"
                  onClick={() => navigate("/forgot-password")}
                  disabled={isLocked}
                >
                  Forgot Password?
                </button>
              </div>
            </motion.div>


            <motion.button
  whileHover={{ scale: loading || isLocked ? 1 : 1.05 }}
  disabled={loading || isLocked}
  onClick={handleLogin}
  className={`w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-lg font-semibold shadow-lg transition
    ${loading || isLocked ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
  style={{ backgroundColor: "rgba(58, 44, 73, 1)" }}
>
  {loading ? (
    <>
      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Signing in...
    </>
  ) : (
    "SIGN IN"
  )}
</motion.button>


            {/* OR Divider */}
            <div className="flex items-center my-2">
              <div className="grow h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 font-medium text-sm">OR</span>
              <div className="grow h-px bg-gray-300"></div>
            </div>

            <motion.div
              whileHover={{ scale: isLocked ? 1 : 1.04 }}
              onClick={isLocked ? undefined : handleGoogleLogin}
              className={`flex justify-center items-center gap-3 mt-2 cursor-pointer rounded-xl py-2 px-3 
              backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg hover:bg-white/30 ${
                isLocked ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.8-2.2 3.9l3.4 2.6C20.1 18.2 21 15.7 21 12c0-.8-.1-1.6-.2-2.4H12z"
                />
                <path
                  fill="#34A853"
                  d="M12 21c2.7 0 5-1 6.7-2.7l-3.4-2.6c-.9.6-2.1 1-3.3 1-2.6 0-4.9-1.8-5.7-4.3l-3.5 2.7C4.8 18.8 8.1 21 12 21z"
                />
                <path
                  fill="#4285F4"
                  d="M6.3 12c0-.7.1-1.4.3-2l-3.5-2.7C1.9 8.7 1.5 10.3 1.5 12c0 1.7.4 3.3 1.6 4.7l3.5-2.7c-.2-.6-.3-1.3-.3-2z"
                />
                <path
                  fill="#FBBC05"
                  d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.8 14.6 2 12 2 8.1 2 4.8 4.2 3.1 7.3l3.5 2.7c.8-2.5 3.1-3.9 5.4-3.9z"
                />
              </svg>
              <span className="font-semibold text-white">Sign in with Google</span>
            </motion.div>

            <div className="text-center text-white mt-2">
              Don’t have an account?{" "}
              <span
                className="font-semibold text-slate-100 hover:underline cursor-pointer"
                style={{ color: "rgba(26, 13, 40, 1)" }}
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    <div className="block md:hidden h-20" />
      </div>
  );
}
