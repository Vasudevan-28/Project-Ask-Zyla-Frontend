import React, { useEffect, useState, useContext } from "react";
import { submitSupportRequest } from "./api/settingsAPI";
import { VscArrowCircleLeft } from "react-icons/vsc";
import { ThemeContext } from "../contexts/ThemeContext";

import toast from "react-hot-toast";

function Support({ onBack }) {
  const [issue, setIssue] = useState("");
  const [help, setHelp] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!issue.trim() || !help.trim()) {
    setError("Please fill in both fields");
    return;
  }

  const combined = `${issue.trim()}\n\n${help.trim()}`;


  try {
    setSaving(true);

    await submitSupportRequest(combined);

    toast.success("Support request submitted");
    setIssue("");
    setHelp("");
    setSuccess("");
  } catch (err) {
    console.error("Failed to submit support request:", err);

    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Failed to submit support request";

    toast.error(message);
    setError(message);
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <section className="w-full md:w-[65%] flex-1 min-w-0 h-full px-6 pt-4 pb-6 flex items-center justify-center bg-white rounded-2xl overflow-y-auto">
        Loading support...
      </section>
    );
  }

  return (
    <section className={`w-full md:w-[90%] max-w-[900px] flex-1 min-w-0 h-full px-4 md:px-6 pt-4 pb-6 flex flex-col rounded-2xl overflow-y-auto ${isLight ? "bg-white text-slate-900 " : "bg-white/10 text-slate-50"}`}>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
        <button type="button" className="cursor-pointer"  onClick={() => onBack && onBack()}>
          <VscArrowCircleLeft size={40} />
        </button>

        <h1 className="m-0 flex-1 text-center tracking-[3px] font-bold text-[20px] md:text-[28px] uppercase">CONTACT SUPPORT</h1>
      </div>


      {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginBottom: "12px" }}>{success}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-[520px]">
       
        <div className="mb-6">
          <label className="block mb-2 text-base">
            What is your issue?<span className="text-red-600"> *</span>
          </label>
          <textarea
            name="issue"
            required
            placeholder="Enter what issue you are facing..."
            value={issue}
            onChange={(e) => {
              setIssue(e.target.value);
              setSuccess("");
            }}
            className={`w-full min-h-[120px] rounded-xl border px-4 py-3 text-sm resize-vertical outline-none shadow-sm ${!isLight ? "placeholder-slate-50/30" : "placeholder-slate-900/30"}`}
            style={{
              borderColor: "#e0c4ea",
              boxShadow: "0 4px 8px rgba(125,25,92,0.08)",
            }}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-base">
            How can we help?<span className="text-red-600"> *</span>
          </label>
          <textarea
            name="help"
            required
            placeholder="Enter your queries..."
            value={help}
            onChange={(e) => {
              setHelp(e.target.value);
              setSuccess("");
            }}
            className={`w-full min-h-[120px] rounded-xl border px-4 py-3 text-sm resize-vertical outline-none shadow-sm ${!isLight ? "placeholder-slate-50/30" : "placeholder-slate-900/30"}`}
            style={{
              borderColor: "#e0c4ea",
              boxShadow: "0 4px 8px rgba(125,25,92,0.08)",
            }}
          />
        </div>

        <div className="mt-2.5">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2.5  rounded-md text-sm font-semibold tracking-wider uppercase text-white cursor-pointer ${isLight ? "bg-linear-to-r from-[#994A97] to-[#CA88B1]" : "bg-white/10 hover:bg-white/20"} ${saving ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
          >
            {saving ? "SUBMITTING..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Support;