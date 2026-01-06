// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { sendEmailOtp } from "../services/backendAPI";
// import ZylaForgotPassword from "../zyla_components/ZylaForgotPassword";
// import HeaderAuth from "../authentication_components/HeaderAuth";
 
// export default function ForgotPassword() {
//   const navigate = useNavigate();
 
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");

//   const [loading, setLoading] = useState(false);

 
//   // Shake animation
//   const shakeVariant = {
//     shake: { x: [-8, 8, -8, 8, 0], transition: { duration: 0.4 } },
//     none: { x: 0 },
//   };
 
//   // Slide-in error
//   const errorSlide = {
//     hidden: { opacity: 0, x: -20 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
//   };
 

//   const handleSendOtp = async () => {
//   if (loading) return; 

//   setError("");

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (!email.trim()) {
//     setError("Enter valid email ID");
//     return;
//   }

//   if (!emailRegex.test(email.trim())) {
//     setError("Enter a valid email address");
//     return;
//   }

//   try {
//     setLoading(true);

//     const res = await sendEmailOtp(email);

//     if (res.message === "OTP sent to email") {
//       navigate("/verification", {
//         state: { email, otp_expiry: res.otp_expiry },
//       });
//     } else {
//       setError("Something went wrong.");
//     }
//   } catch (err) {
//     if (
//       err.message?.includes("Too many OTP") ||
//       err.message?.includes("429")
//     ) {
//       setError("❌ Too many OTP requests. Try again after 30 minutes.");
//     } else {
//       setError("❌ " + (err.message || "Something went wrong."));
//     }
//   } finally {
//     setLoading(false);
//   }
// };

 
//   return (
//     <div className="min-h-screen   bg-[#1A0D28] " >
//   <HeaderAuth />
// <div className="flex  items-center justify-between p-10 mt-10">
//   {/* <HeaderMain /> */}
//   {/* <HeaderQP /> */}
//  <div className="flex items-center justify-center ml-10">

//   <ZylaForgotPassword />
//  </div>
//       <div className="w-full max-w-xl  backdrop-blur-xl shadow-xl rounded-3xl 
//                       p-6 sm:p-8 md:p-10 border border-white/30
//                       bg-white/20
//                       ">
//         <h2
//           className="text-center text-2xl sm:text-3xl  font-semibold mb-3 text-white"
//         >
//           Forgot Password
//         </h2>
 
//         <p className="text-center text-xs sm:text-sm text-white/90 mb-10 px-4 sm:px-8">
//           Enter your registered email for verification. We will send a 4-digit
//           code to your email.
//         </p>
 
//         {/* EMAIL INPUT */}
//         <motion.div
//           animate={error ? "shake" : "none"}
//           variants={shakeVariant}
//           className="mb-6"
//         >
//           <label className="block text-white font-medium mb-1">Email</label>
 
//           <input
//             type="email"
//             placeholder="you@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-3 rounded-lg bg-white shadow-md border border-gray-200 
//                        outline-none focus:ring-2 focus:ring-purple-300 transition"
//           />
 
//           {error && (
//             <motion.p
//               initial="hidden"
//               animate="visible"
//               variants={errorSlide}
//               className="text-sm font-medium mt-2 text-red-500"
//             >
//               {error}
//             </motion.p>
//           )}
//         </motion.div>
 
//         {/* RESET WITH PHONE */}
//         <div className="text-right mt-2 mb-6">
//           <button
//             onClick={() => navigate("/forgotPhonePasswordReset")}
//             className="text-xs sm:text-sm font-medium text-white cursor-pointer"
//           >
//             Reset with phone number?
//           </button> 
//         </div>
 
//         {/* CONTINUE BUTTON */}
//         {/* <button
//           onClick={handleSendOtp}
//           className="w-full text-white py-3 cursor-pointer rounded-lg font-semibold shadow-lg transition
//                      bg-[#3A2C49] hover:bg-[#281E35]"
//         >
//           CONTINUE
//         </button> */}
 
//           <button
//   onClick={handleSendOtp}
//   disabled={loading}
//   className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg font-semibold shadow-lg transition
//     ${loading ? "bg-[#281E35] cursor-not-allowed" : "bg-[#3A2C49] hover:bg-[#281E35]"}`}
// >
//   {loading ? (
//     <>
//       <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//       Sending OTP...
//     </>
//   ) : (
//     "CONTINUE"
//   )}
// </button>

// </div>
//       </div>
// </div>
//   );
// }








import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { sendEmailOtp } from "../services/backendAPI";
import ZylaForgotPassword from "../zyla_components/ZylaForgotPassword";
import HeaderAuth from "../authentication_components/HeaderAuth";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (loading) return;

    setError("");

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
      setLoading(true);

      const res = await sendEmailOtp(email);

      if (res.message === "OTP sent to email") {
        navigate("/verification", {
          state: { email, otp_expiry: res.otp_expiry },
        });
        return; // avoid resetting loading after navigation
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      const msg = err?.message || String(err) || "Something went wrong.";
      if (msg.includes("Too many OTP") || msg.includes("429")) {
        setError("❌ Too many OTP requests. Try again after 30 minutes.");
      } else {
        setError("❌ " + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#1A0D28]">
      <HeaderAuth />

      {/* Main container: stacked on small screens, side-by-side on md+ */}
      <div className="flex flex-col md:flex-row items-start justify-center px-4 md:px-10 gap-8 mt-8 md:mt-16">
        {/* Left visual: centered on small screens, left-aligned on desktop */}
        <div className="w-1/2 flex justify-start scale-85 md:scale-100">
          <div className="max-w-md w-full p-0">
            <ZylaForgotPassword />
          </div>
        </div>

        {/* Form card */}
        <div className="w-full md:w-1/2 max-w-xl bg-white/20 backdrop-blur-xl shadow-xl rounded-3xl p-6 sm:p-8 md:p-10 border border-white/30">
          <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-3 text-white">
            Forgot Password
          </h2>

          <p className="text-center text-xs sm:text-sm text-white/90 mb-6 sm:mb-10 px-2 sm:px-8">
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
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white shadow-md border border-gray-200 
                         outline-none focus:ring-2 focus:ring-purple-300 transition"
              aria-label="Email address"
            />

            {error && (
              <motion.p
                initial="hidden"
                animate="visible"
                variants={errorSlide}
                className="text-sm font-medium mt-2 text-red-500"
                role="alert"
                aria-live="assertive"
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
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg font-semibold shadow-lg transition
              ${loading ? "bg-[#281E35] cursor-not-allowed opacity-90" : "bg-[#3A2C49] hover:bg-[#281E35]"}`}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span className="text-sm">Sending OTP...</span>
              </>
            ) : (
              "CONTINUE"
            )}
          </button>
        </div>
        <div className="h-20" />
      </div>
    </div>
  );
}