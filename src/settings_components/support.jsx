import React, { useEffect, useState, useContext } from "react";
import { getSupport, updateSupport, setAuthToken, submitSupportRequest } from "./api/settingsAPI";
import { VscArrowCircleLeft } from "react-icons/vsc";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ThemeContext } from "../contexts/ThemeContext";

import toast from "react-hot-toast"

const SET_URL = "http://127.0.0.1:8484/settings"

function Support({ onBack }) {
  const [issue, setIssue] = useState("");
  const [help, setHelp] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!issue.trim() || !help.trim()) {
      setError("Please fill in both fields");
      return;
    }

    const combined = `${issue.trim()}\n\n${help.trim()}`;

    if(!idToken) return

    try {
      setSaving(true);
      // await updateSupport(combined); // PUT /support { message }
      
  //      await fetch(`${SET_URL}/support`, {
  //       // headers: { Authorization: AUTH_TOKEN },
  //       method : 'PUT',
  //       headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
  //        body: JSON.stringify({
  //   message: combined
  // })
      // })

const res = await submitSupportRequest(idToken, combined);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.detail || "Failed to submit support request");
  }

      toast.success("Support request submitted")
      setIssue("")
      setHelp("")
      setSuccess("");
    } catch (err) {
      console.error("Failed to save support request:", err);
      toast.error("Failed to submit support request")
      setError("");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="w-[65%] flex-1 min-w-[400px] h-full px-6 pt-4 pb-6 flex items-center justify-center bg-white rounded-2xl overflow-y-auto">
        Loading support...
      </section>
    );
  }

  return (
    <section className={`w-[65%] flex-1 min-w-[400px] h-full px-6 pt-4 pb-6 flex flex-col rounded-2xl overflow-y-auto  ${isLight ? "bg-white text-slate-900 " : "bg-white/10 text-slate-50"} `}>
      {/* Top row: back + title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        {/* Back button */}
        <button
          type="button"
          onClick={() => onBack && onBack()}
         
          
        >
         <VscArrowCircleLeft size={40} />
        </button>

        {/* Title */}
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
  CONTACT SUPPORT
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
        {/* Issue field */}
        <div style={{ marginBottom: "28px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
            }}
          >
            What is your issue?<span style={{ color: "red" }}> *</span>
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
              className={` ${!isLight ? "placeholder-slate-50/30" : "placeholder-slate-900/30" }`}
            style={{
              width: "100%",
              minHeight: "120px",
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

        {/* Help field */}
        <div style={{ marginBottom: "32px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
            }}
          >
            How can we help?<span style={{ color: "red" }}> *</span>
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
            className={` ${!isLight ? "placeholder-slate-50/30" : "placeholder-slate-900/30" }`}
            style={{
              width: "100%",
              minHeight: "120px",
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

        {/* Submit button */}
      


        <div className="mt-2.5">
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
    {saving ? "SUBMITTING..." : "SUBMIT"}
  </button>
</div>

      </form>
    </section>
  );
}

export default Support;
