import React, { useEffect, useState, useContext } from "react";
import { submitSettRating } from "./api/settingsAPI";
import { VscArrowCircleLeft } from "react-icons/vsc";
import { FaStar } from "react-icons/fa";
import { ThemeContext } from "../contexts/ThemeContext";
import toast from "react-hot-toast";

function Rating({ onBack }) {
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";


  const handleStarClick = (value) => {
    setRating(value);
    setSuccess("");
  };

 async function handleSave() {
  try {
    setSaving(true);
    setError("");
    setSuccess("");

    await submitSettRating(rating);

    toast.success("Ratings saved successfully!");
    setSuccess("");
  } catch (err) {
    console.error("Failed to save rating:", err);

    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Failed to save your rating";

    toast.error(message);
    setError(message);
  } finally {
    setSaving(false);
  }
}


  if (loading) {
    return (
      <section className="w-full md:w-[65%] flex-1 min-w-0 h-full px-6 pt-4 pb-6 flex items-center justify-center bg-white rounded-2xl overflow-y-auto">
        Loading rating...
      </section>
    );
  }

  return (
    <section className={`w-full md:w-[90%] max-w-[900px]  flex-1 min-w-0 h-full px-4 md:px-6 pt-4 pb-6 flex flex-col ${isLight ? "bg-white text-slate-900 " : "bg-white/10 text-slate-50"} rounded-2xl overflow-y-auto`}>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
        <button type="button" onClick={() => onBack && onBack()} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
          <VscArrowCircleLeft size={40} />
        </button>

        <h1 className="m-0 flex-1 text-center tracking-[3px] font-bold text-[20px] md:text-[28px] uppercase">
          RATE US !
        </h1>
      </div>

      
      <div style={{ textAlign: "center", width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "-20px" }}>
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}

        <h2 className={`${isLight ? "text-black" : "text-white"} font-medium`} style={{ fontSize: "16px", marginBottom: "20px", letterSpacing: "1px" }}>
          HOW WAS YOUR OVERALL EXPERIENCE?
        </h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginBottom: "20px" }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} type="button" onClick={() => handleStarClick(value)} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>
              <FaStar
                size={36}
                style={{
                  color: rating >= value ? "#f5c518" : "#d3c6e0",
                  filter: rating >= value ? "drop-shadow(0 0 6px rgba(245,197,24,0.7))" : "none",
                  transform: rating === value ? "scale(1.1)" : "scale(1)",
                  transition: "transform 0.25s ease, color 0.25s ease, filter 0.25s ease",
                }}
              />
            </button>
          ))}
        </div>
        <button onClick={handleSave} disabled={saving} className={`mt-2.5 text-white px-6 py-3 font-medium rounded-xl text-base border-none cursor-pointer ${isLight ? "bg-linear-to-r from-[#994A97] to-[#CA88B1]" : "bg-white/10 hover:bg-white/20"} ${saving ? "opacity-80 cursor-default" : "cursor-pointer hover:opacity-90"}`}>
          {saving ? "Saving..." : "Save Rating"}
        </button>
      </div>
    </section>
  );
}

export default Rating;