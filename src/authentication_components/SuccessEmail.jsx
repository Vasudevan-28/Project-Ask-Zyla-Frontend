import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HeaderAuth from "./HeaderAuth";

export default function SuccessEmail() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#1A0D28]" >
      <HeaderAuth />
    <div className=" flex items-center justify-center h-[80vh]  p-4">
      {/* Popup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-xl border border-white/30 text-center flex flex-col items-center"
      >
        {/* Circle with Tick */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.4, 0.9, 1] }}
          transition={{
            duration: 0.8,
            type: "tween", 
            ease: "easeOut",
            delay: 0.2,
          }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: "rgba(58, 44, 73, 1)" }}
        >
          <motion.svg
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.3 }}
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 sm:h-12 sm:w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        </motion.div>

        {/* Success Message */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl sm:text-3xl font-semibold mb-2"
          style={{ color: "rgba(247, 251, 255, 1)" }}
        >
          Successfully!
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-6 text-white/90 text-xs sm:text-sm"
        >
          Your registration is done successfully.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-6 text-white/90 text-xs sm:text-sm"
        >
          Kindly check your email and click the verification link.
        </motion.p>

        {/* Back to Login Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(255,255,255,0.4)" }}
          onClick={() => navigate("/login")}
          className="w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transition text-sm sm:text-base"
          style={{ backgroundColor: "rgba(58, 44, 73, 1)" }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(40, 30, 53, 1)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(58, 44, 73, 1)")
          }
        >
          Back to Login
        </motion.button>
      </motion.div>
    </div>
    </div>
  );
}
