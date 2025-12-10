import React, { useState } from "react";
import videoBg from "../assets/zyla.gif";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../services/authservice";
import ZylaSignup from "../zyla_components/ZylaSignup";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSignup = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setError("");
    navigate("/register", { state: { email } });
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await loginWithGoogle();
      // result.firebaseUser.email will be the Google email

        if (result.status === "existing") {
        if (result.skin_profile === false) {
      navigate("/questionnaire");
      } else {
      navigate("/dashboard");
      }

     } else {
    navigate("/register", { 
     state: { 
       email: result.firebaseUser.email, 
       isGoogle: true 
     } })};


      // navigate("/register", { state: { email: result.firebaseUser.email, isGoogle: true } });
    } catch (err) {
      setError("Google sign up failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1A0D28] relative">
      {/* LEFT GIF */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-0">
        {/* <img
          src={videoBg}
          alt="GIF"
          className="w-[85%] sm:w-[70%] md:w-[70%] lg:w-[65%]"
        /> */}
<ZylaSignup />
      </div>
      {/* RIGHT */}
      <div className="w-full md:w-1/2 flex justify-center items-center px-4 py-10">
        <form
          className="w-full max-w-lg bg-white/20 backdrop-blur-xl shadow-xl rounded-3xl p-8 sm:p-10 border border-white/30"
          onSubmit={handleEmailSignup}
        >
          <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-8" style={{ color: "rgba(247, 251, 255, 1)" }}>
            Sign Up to your beauty sanctuary!
          </h2>
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-white font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 rounded-lg bg-white shadow-md border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-sm mt-1" style={{ color: "#D9161A" }}>{error}</p>}
            </div>
            <button
              className="w-full text-white py-2 rounded-lg font-semibold shadow-lg transition bg-[rgba(58,44,73,1)] hover:bg-[#2d223a]"
              type="submit"
            >
              SIGN UP
            </button>

              {/* OR Divider */}
            <div className="flex items-center my-2">
              <div className="grow h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 font-medium text-sm">OR</span>
              <div className="grow h-px bg-gray-300"></div>
            </div>
            <div
              className="flex justify-center items-center gap-3 mb-4 mt-2 cursor-pointer rounded-xl py-2 px-4 backdrop-blur-xl bg-white/20 border border-white/30 shadow-lg hover:bg-white/30 transition"
              onClick={handleGoogleSignup}
              type="button"
            >


              {/* Google SVG */}
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.8-2.2 3.9l3.4 2.6C20.1 18.2 21 15.7 21 12c0-.8-.1-1.6-.2-2.4H12z" />
                <path fill="#34A853" d="M12 21c2.7 0 5-1 6.7-2.7l-3.4-2.6c-.9.6-2.1 1-3.3 1-2.6 0-4.9-1.8-5.7-4.3l-3.5 2.7C4.8 18.8 8.1 21 12 21z" />
                <path fill="#4285F4" d="M6.3 12c0-.7.1-1.4.3-2l-3.5-2.7C1.9 8.7 1.5 10.3 1.5 12c0 1.7.4 3.3 1.6 4.7l3.5-2.7c-.2-.6-.3-1.3-.3-2z" />
                <path fill="#FBBC05" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.8 14.6 2 12 2 8.1 2 4.8 4.2 3.1 7.3l3.5 2.7c.8-2.5 3.1-3.9 5.4-3.9z" />
              </svg>
              <span className="font-semibold text-white drop-shadow-md">
                Sign Up with Google
              </span>

            </div>
                {/* Sign Up */}
            <div className="text-center text-white mt-2">
               Already have an account?{" "}
              <span
                className="font-semibold text-slate-100 cursor-pointer hover:underline"
                style={{ color: "rgba(26, 13, 40, 1)" }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}