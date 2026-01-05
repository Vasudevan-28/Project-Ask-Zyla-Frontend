import React, { useState, useContext } from "react";
// import { ThemeContext } from "../team-pages/contexts/ThemeContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

import { sendGenSupport } from "../settings_components/api/settingsAPI";
import HeaderQP from "../home_components/HeaderQP";
import FooterMain from "../home_components/FooterMain";
import FooterPromo from "../home_components/FooterPromo";
import Header from "../home_components/HeaderPromo";
import HeaderMain from "../home_components/HeaderMain";

function SuccessPopup({ message, onClose }) {
  const navigate = useNavigate();
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
          relative bg-white rounded-2xl px-6 sm:px-8 py-5 sm:py-6 max-w-[360px] w-full 
          shadow-lg text-center animate-fadeIn
        "
      >
        <h2 className="text-xl font-bold text-green-600 mb-2">Success</h2>
        <p className="text-slate-700 mb-4 text-sm">{message}</p>

        <button
          onClick={() => navigate("/")}
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
  // Inputs
  const [issue, setIssue] = useState("");
  const [help, setHelp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Validation / UI
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [emailValid, setEmailValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);

  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";


  const issueCharCount = issue.length;
  const helpCharCount = help.length;

  const validateEmail = (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(value);
  };

  const handleNameChange = (e) => {
    const val = e.target.value.slice(0, 20);
    setName(val);
    setSuccess("");
    if (error) setError("");
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.slice(0, 250);
    setEmail(val);
    setSuccess("");
    if (error) setError("");
    if (val.length === 0) {
      setEmailValid(true);
    } else {
      setEmailValid(validateEmail(val));
    }
  };

  const truncateToCharLimit = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit);
  };

  const handleIssueChange = (e) => {
    const incoming = e.target.value;
    const truncated = truncateToCharLimit(incoming, 500);
    setIssue(truncated);
    setSuccess("");
    if (error) setError("");
  };

  const handleHelpChange = (e) => {
    const incoming = e.target.value;
    const truncated = truncateToCharLimit(incoming, 500);
    setHelp(truncated);
    setSuccess("");
    if (error) setError("");
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailValid(email.length === 0 ? true : validateEmail(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !issue.trim() || !help.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (issueCharCount > 500 || helpCharCount > 500) {
      setError(`Each text area is limited to 500 characters.`);
      return;
    }

    const combined = `${issue.trim()}\n\n${help.trim()}`;

    try {
      setSaving(true);
      await sendGenSupport(name.trim(), email.trim(), combined);

      setSuccess("Support request submitted successfully");
      setShowSuccess(true);
      // Clear fields after success
      setName("");
      setEmail("");
      setIssue("");
      setHelp("");
      setEmailTouched(false);
      setEmailValid(true);
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
      <Header />
      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <section
          className={`
            w-full max-w-[760px] sm:max-w-[680px] md:max-w-[700px] lg:max-w-[700px]
            md:px-8 px-8 md:py-5 mt-12 py-8 rounded-2xl
            bg-white/10 backdrop-blur-2xl
          `}
        >
          <h1 className="text-center text-[22px] sm:text-[24px] md:text-[26px] font-bold tracking-[2px] uppercase mb-4">
            Contact Support
          </h1>

          {error && (
            <p className="mb-3 text-sm font-medium text-red-500 text-center" role="alert">
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
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              {/* Name */}
              <div className="flex-1">
                <label className="block mb-1.5 text-sm">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                  maxLength={20}
                  aria-label="Name"
                  className={`
                    w-full rounded-lg px-3 py-2 text-sm bg-white/10 text-slate-50 ring-0 focus:ring-0 focus:outline-none placeholder-slate-50/50
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
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="Enter your email"
                  maxLength={250}
                  aria-label="Email"
                  className={`
                    w-full rounded-lg px-3 py-2 text-sm
                    shadow-[0_2px_6px_rgba(125,25,92,0.08)]
                    bg-white/10 text-slate-50 ring-0 focus:ring-0 focus:outline-none placeholder-slate-50/50
                    ${!emailValid && emailTouched ? "ring-2 ring-red-500 bg-white/8" : ""}
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
                onChange={handleIssueChange}
                placeholder="Describe your issue..."
                aria-label="Issue description"
                className={`
                  w-full rounded-lg px-3 py-2 min-h-[110px] text-sm  
                  shadow-[0_2px_6px_rgba(125,25,92,0.08)] resize-y
                  bg-white/10 text-slate-50 ring-0 focus:ring-0 focus:outline-none placeholder-slate-50/50
                `}
              ></textarea>
              <div className="mt-1 text-xs flex justify-end">
                <span className={`${issueCharCount > 500 ? "text-red-400" : "text-slate-300"}`}>
                  {issueCharCount}/500 chars
                </span>
              </div>
            </div>

            {/* Help */}
            <div className="mb-6">
              <label className="block mb-1.5 text-sm">
                How can we help? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={help}
                onChange={handleHelpChange}
                placeholder="What do you need help with?"
                aria-label="How can we help"
                className={`
                  w-full rounded-lg px-3 py-2 min-h-[110px] text-sm  
                  shadow-[0_2px_6px_rgba(125,25,92,0.08)] resize-y
                  bg-white/10 text-slate-50 ring-0 focus:ring-0 focus:outline-none placeholder-slate-50/50
                `}
              ></textarea>
              <div className="mt-1 text-xs flex justify-end">
                <span className={`${helpCharCount > 500 ? "text-red-400" : "text-slate-300"}`}>
                  {helpCharCount}/500 chars
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={saving}
                className={`
                  px-8 sm:px-10 py-2.5 rounded-md text-sm sm:text-base font-semibold uppercase
                  text-white bg-white/20
                  transition-opacity
                  ${saving ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}
                `}
              >
                {saving ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </section>

        {showSuccess && (
          <SuccessPopup message={success} onClose={() => setShowSuccess(false)} />
        )}
      </main>

      <FooterPromo />
    </div>
  );
}

export default GenSupport;