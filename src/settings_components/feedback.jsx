import React, { useEffect, useState, useContext } from "react";
import { submitSettFeedback } from "./api/settingsAPI";
import { VscArrowCircleLeft } from "react-icons/vsc";
import { ThemeContext } from "../contexts/ThemeContext";

import toast from "react-hot-toast";

function Feedback({ onBack }) {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
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

    if (!feedback.trim()) {
      setError("Please enter your feedback");
      return;
    }

    try {
      setSaving(true);
      const feedbackData = {
        feedback: feedback.trim(),
        name: name,
      };

      // const res = await submitSettFeedback(idToken, feedbackData);
      const res = await submitSettFeedback(feedbackData);

      if (!res.ok) {
        throw new Error("Server returned an error");
      }

      toast.success("Feedback submitted. Thank you!");
      setSuccess("");
      setFeedback("");
      setName("");
    } catch (err) {
      console.error("Failed to save feedback:", err);
      toast.error("Failed to submit feedback");
      setError("");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full md:w-[65%] flex-1 min-w-0 h-full px-6 pt-4 pb-6 flex items-center justify-center bg-white rounded-2xl overflow-y-auto">
        Loading feedback...
      </section>
    );
  }

  return (
    <section className={`w-full md:w-[90%] max-w-[900px]  flex-1 min-w-0 h-full px-4 md:px-6 pt-4 pb-6 flex flex-col rounded-2xl overflow-y-auto ${isLight ? "bg-white text-slate-900 " : "bg-white/10 text-slate-50"}`}>
      {/* Top row: back + title */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
        <button type="button" onClick={() => onBack && onBack()}>
          <VscArrowCircleLeft size={40} />
        </button>

        <h1 className="m-0 flex-1 text-center tracking-[3px] font-bold text-[20px] md:text-[28px] uppercase">FEEDBACK</h1>
      </div>

      {/* Error / Success messages */}
      {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginBottom: "12px" }}>{success}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-[520px]">
        {/* Name field (UI only for now) */}
        <div className="mb-6">
          <label className="block mb-2 text-base">Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your sweet name....."
            className={`w-full h-11 rounded-[12px] border px-4 text-sm outline-none shadow-sm ${!isLight ? "placeholder-slate-50/30" : "placeholder-slate-900/30"}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ borderColor: "#e0c4ea", boxShadow: "0 4px 8px rgba(125,25,92,0.08)" }}
          />
        </div>

        {/* Feedback textarea */}
        <div className="mb-6">
          <label className="block mb-2 text-base">What could have made it perfect?</label>
          <textarea
            name="feedback"
            placeholder="Loved most of it! one small thing....."
            className={`w-full min-h-[120px] rounded-[12px] border px-4 py-3 text-sm resize-vertical outline-none shadow-sm ${!isLight ? "placeholder-slate-50/30" : "placeholder-slate-900/30"}`}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{ borderColor: "#e0c4ea", boxShadow: "0 4px 8px rgba(125,25,92,0.08)" }}
          />
        </div>

        {/* Bottom button */}
        <div className="flex justify-between items-center">
          <button type="submit" disabled={saving} className={`px-6 py-2.5 rounded-md text-sm font-semibold tracking-wider uppercase text-white ${isLight ? "bg-linear-to-r from-[#994A97] to-[#CA88B1]" : "bg-white/10 hover:bg-white/20"} ${saving ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}>
            {saving ? "SAVING..." : "SUBMIT FEEDBACK"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Feedback;