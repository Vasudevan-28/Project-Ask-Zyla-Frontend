import React, { useEffect, useState, useContext } from "react";
import { getFeedback, updateFeedback, setAuthToken } from "./api/settingsAPI";
import { VscArrowCircleLeft } from "react-icons/vsc";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ThemeContext } from "../contexts/ThemeContext";

import toast from "react-hot-toast";

const SET_URL = "http://127.0.0.1:8484/settings"

function Feedback({ onBack }) {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
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
  

  const handleBackOrSkip = () => {
    if (onBack) onBack();
  };
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
      // await updateFeedback(feedback.trim());

      await fetch(`${SET_URL}/feedback`, {
        // headers: { Authorization: AUTH_TOKEN },
        method : 'PUT',
        headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
         body: JSON.stringify({
    feedback: feedback.trim(),
    name: name,
  })
      })
      toast.success("Feedback submitted. Thank you!")
      setSuccess("");
      setFeedback("")
      setName("")
    } catch (err) {
      console.error("Failed to save feedback:", err);
      toast.error("Failed to submit feedback")
      setError("");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="w-[65%] flex-1 min-w-[400px] h-full px-6 pt-4 pb-6 flex items-center justify-center bg-white rounded-2xl overflow-y-auto">
        Loading feedback...
      </section>
    );
  }

  return (
    <section className={`w-[65%] flex-1 min-w-[400px] h-full px-6 pt-4 pb-6 flex flex-col  rounded-2xl overflow-y-auto  ${isLight ? "bg-white text-slate-900 " : "bg-white/10 text-slate-50"} `}>
      {/* Top row: back + title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <button
          type="button"
          onClick={() => onBack && onBack()}
         
          
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
  FEEDBACK
</h1>

      </div>

      {/* Error / Success messages */}
      {error && (
        <p style={{ color: "red", marginBottom: "12px" }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ color: "green", marginBottom: "12px" }}>
          {success}
        </p>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "520px",
        }}
      >
        {/* Name field (UI only for now) */}
        <div style={{ marginBottom: "28px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
            }}
          >
            Your Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your sweet name....."
                        className={` ${!isLight ? "placeholder-slate-50/30" : "placeholder-slate-900/30" }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "12px",
              border: "1px solid #e0c4ea",
              padding: "0 16px",
              fontSize: "14px",
              outline: "none",
              boxShadow: "0 4px 8px rgba(125,25,92,0.08)",
            }}
          />
        </div>

        {/* Feedback textarea */}
        <div style={{ marginBottom: "40px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
            }}
          >
            What could have made it perfect?
          </label>
          <textarea
            name="feedback"
            placeholder="Loved most of it! one small thing....."
                        className={` ${!isLight ? "placeholder-slate-50/30" : "placeholder-slate-900/30" }`}

            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{
              width: "100%",
              minHeight: "140px",
              borderRadius: "12px",
              border: "1px solid #e0c4ea",
              padding: "14px 16px",
              fontSize: "14px",
              resize: "vertical",
              outline: "none",
              boxShadow: "0 4px 8px rgba(125,25,92,0.08)",
            }}
          />
        </div>

        {/* Bottom buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <button
  type="submit"
  disabled={saving}
  className={`
    px-10 py-2.5
    rounded-md 
    text-sm font-semibold tracking-wider uppercase
    text-white 
    shadow-[0_4px_10px_rgba(125,25,92,0.4)]
      bg-linear-to-r from-[#994A97] to-[#CA88B1]
    ${saving ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
  `}
>
  {saving ? "SAVING..." : "SUBMIT FEEDBACK"}
</button>

        </div>
      </form>
    </section>
  );
}

export default Feedback;
