import React, { useState, useContext } from "react";
// import { ThemeContext } from "../team-pages/contexts/ThemeContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

import { sendGenSupport } from "../settings_components/api/settingsAPI";
import HeaderQP from "../home_components/HeaderQP";
import FooterMain from "../home_components/FooterMain";
import FooterPromo from "../home_components/FooterPromo";




function SuccessPopup({ message, onClose }) {
     const navigate = useNavigate()
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Popup box */}
      <div
        className="
          relative bg-white rounded-2xl px-8 py-6 max-w-[300px] w-full 
          shadow-lg text-center animate-fadeIn
        "
      >
        <h2 className="text-xl font-bold text-green-600 mb-2">Success</h2>
        <p className="text-slate-700 mb-5 text-sm">{message}</p>

        <button
          onClick={() => navigate('/')}
          className="
            px-6 py-2 rounded-md text-sm font-semibold text-white 
            bg-linear-to-r from-[#994A97] to-[#CA88B1] 
            shadow-[0_4px_10px_rgba(125,25,92,0.4)]
            hover:opacity-90 transition
          "
        >
          OK
        </button>
      </div>
    </div>
  );
}





function GenSupport() {
  const [issue, setIssue] = useState("");
  const [help, setHelp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !issue.trim() || !help.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const combined = `${issue.trim()}\n\n${help.trim()}`;

    try {
      setSaving(true);
      await sendGenSupport(name, email, combined)

setSuccess("Support request submitted successfully");
setShowSuccess(true);

    } catch (err) {
      console.error("Failed:", err);
      setError("Failed to submit support request");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`
        min-h-screen flex flex-col 
       bg-[#1A0D28] text-slate-50
      `}
    >
   <HeaderQP />
      {/* Centered Form Card */}
      <main className="flex-1 flex mt-18 items-center justify-center px-6 py-6">
        <section
          className={`
            w-full max-w-[600px] px-10 py-7 rounded-2xl
          bg-white/10 backdrop-blur-2xl
          `}
        >
          <h1 className="text-center text-[24px] font-bold tracking-[2px] uppercase mb-6">
            Contact Support
          </h1>

          {error && (
            <p className="mb-3 text-sm font-medium text-red-500 text-center">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-3 text-sm font-medium text-green-500 text-center">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="w-full">

            {/* NAME + EMAIL ROW */}
            <div className="flex flex-col sm:flex-row gap-8 mb-6">
              {/* Name */}
              <div className="flex-1">
                <label className="block mb-1.5 text-sm">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSuccess("");
                  }}
                  placeholder="Enter your name"
                  className={`
                    w-full rounded-lg px-3 py-2 text-sm  bg-white/10 text-slate-50 ring-0 focus:ring-0 focus:outline-none placeholder-slate-50/50
                    shadow-[0_2px_6px_rgba(125,25,92,0.08)]
                   
                  `}
                />
              </div>

              {/* Email */}
              <div className="flex-1">
                <label className="block mb-1.5 text-sm">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSuccess("");
                  }}
                  placeholder="Enter your email"
                  className={`
                    w-full rounded-lg px-3 py-2 text-sm  
                    shadow-[0_2px_6px_rgba(125,25,92,0.08)]
                     bg-white/10 text-slate-50 ring-0 focus:ring-0 focus:outline-none placeholder-slate-50/50
                  `}
                />
              </div>
            </div>

            {/* Issue */}
            <div className="mb-5">
              <label className="block mb-1.5 text-sm">
                What is your issue? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={issue}
                onChange={(e) => {
                  setIssue(e.target.value);
                  setSuccess("");
                }}
                placeholder="Describe your issue..."
                className={`
                  w-full rounded-lg px-3 py-2 min-h-[90px] text-sm  
                  shadow-[0_2px_6px_rgba(125,25,92,0.08)] resize-y
                  bg-white/10 text-slate-50 ring-0 focus:ring-0 focus:outline-none placeholder-slate-50/50
                `}
              ></textarea>
            </div>

            {/* Help */}
            <div className="mb-6">
              <label className="block mb-1.5 text-sm">
                How can we help? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={help}
                onChange={(e) => {
                  setHelp(e.target.value);
                  setSuccess("");
                }}
                placeholder="What do you need help with?"
                className={`
                  w-full rounded-lg px-3 py-2 min-h-[90px] text-sm  
                  shadow-[0_2px_6px_rgba(125,25,92,0.08)] resize-y
                  bg-white/10 text-slate-50 ring-0 focus:ring-0 focus:outline-none placeholder-slate-50/50
                `}
              ></textarea>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={saving}
                className={`
                  px-10 py-2.5 rounded-md text-sm font-semibold uppercase
                  text-white bg-white/20
                  transition-opacity
                  ${
                    saving
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:opacity-90"
                  }
                `}
              >
                {saving ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </section>

                  {showSuccess && (
  <SuccessPopup
    message={success}
    onClose={() => setShowSuccess(false)}
  />
)}


      </main>

<FooterPromo />
    </div>
  );
}

export default GenSupport;
