import React, { useEffect, useState, useContext } from "react";
import { getRating, updateRating, setAuthToken, submitSettRating } from "./api/settingsAPI";
import { VscArrowCircleLeft } from "react-icons/vsc";
import { FaStar } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ThemeContext } from "../contexts/ThemeContext";
import toast from "react-hot-toast";





// const SET_URL = "http://127.0.0.1:8484/settings"

function Rating({ onBack }) {
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
      const { theme } = useContext(ThemeContext);
      const isLight = theme === "light";
  

    const [idToken, setIdToken] = useState("")
       
        const auth = getAuth();
           useEffect(() => {
             const unsub = onAuthStateChanged(auth, async (u) => {
               // setUser(u);
               // setAuthToken(await u.getIdToken(false))
               setIdToken(await u.getIdToken(false))
             });
         
             return () => unsub();
           }, [auth]);

  const handleStarClick = (value) => {
    setRating(value);
    setSuccess("");
  };

  // ---------- SAVE RATING ----------
  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // await updateRating(rating);

  //       await fetch(`${SET_URL}/rating`, {
  //       // headers: { Authorization: AUTH_TOKEN },
  //       method : 'PUT',
  //       headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
  //        body: JSON.stringify({
  //   rating: rating
  // })
  //     })

        const res = await submitSettRating(idToken, rating);

         const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.detail || "Failed to save rating");
  }

      toast.success("Ratings saved successfully!")
      // setSuccess("Rating saved successfully!");
      setSuccess("");
    } catch (err) {
      console.error("Failed to save rating:", err);
      toast.error("Failed to save your rating")
      setError("");
    } finally {
      setSaving(false);
    }
  }

  // ---------- LOADING STATE ----------
  if (loading) {
    return (
      <section className="w-[65%] flex-1 min-w-[400px] h-full px-6 pt-4 pb-6 flex items-center justify-center bg-white rounded-2xl overflow-y-auto">
        Loading rating...
      </section>
    );
  }

  return (
    <section className={`w-[65%] flex-1 min-w-[400px] h-full px-6 pt-4 pb-6 flex flex-col  ${isLight ? "bg-white text-slate-900 " : "bg-white/10 text-slate-50"} rounded-2xl overflow-y-auto`}>
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <button
          type="button"
          onClick={() => onBack && onBack()}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <VscArrowCircleLeft size={40} />
        </button>

        <h1
  className="
    m-0 
    flex-1 
    text-center 
    tracking-[3px] 
    font-bold 
    text-[28px] 
    uppercase 
  "
>
  RATE US !
</h1>
      </div>

      {/* CENTER CONTENT */}
      <div
        style={{
          textAlign: "center",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",       
          marginTop: "-40px",
        }}
      >

        {/* ERRORS / SUCCESS */}
        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
        )}
        {success && (
          <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>
        )}

        <h2
        className="text-[#ec8bcc]"
          style={{
            // color: "#7d195c",
            fontSize: "18px",
            marginBottom: "40px",
            letterSpacing: "1px",
          }}
        >
          HOW WAS YOUR OVERALL EXPERIENCE?
        </h2>

        {/* STAR RATING */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            marginBottom: "30px",
          }}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleStarClick(value)}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <FaStar
                size={42}
                style={{
                  color: rating >= value ? "#f5c518" : "#d3c6e0",
                  filter:
                    rating >= value
                      ? "drop-shadow(0 0 6px rgba(245,197,24,0.7))"
                      : "none",
                  transform: rating === value ? "scale(1.2)" : "scale(1)",
                  transition:
                    "transform 0.25s ease, color 0.25s ease, filter 0.25s ease",
                }}
              />
            </button>
          ))}
        </div>
        <button
  onClick={handleSave}
  disabled={saving}
  className={`
    mt-2.5
    text-white
    px-6 py-3
    font-medium
    rounded-xl
    text-base
    border-none
    bg-linear-to-r from-[#994A97] to-[#CA88B1]
    ${saving ? "opacity-80 cursor-default" : "cursor-pointer hover:opacity-90"}
  `}
>
  {saving ? "Saving..." : "Save Rating"}
</button>

      </div>
    </section>
  );
}

export default Rating;
