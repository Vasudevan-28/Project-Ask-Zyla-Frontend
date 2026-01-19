import React, { useEffect, useState, useContext } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import {
  getUserProfile,
  updateSettProfile,
} from "./api/settingsAPI";
import { getAuth, onIdTokenChanged } from "firebase/auth";

function Profile() {
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    state: "",
  });

  const [initialForm, setInitialForm] = useState(null);

  const [idToken, setIdToken] = useState("");

  const auth = getAuth();
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (u) => {
      if (u) {
        const tok = await u.getIdToken(false);
        setIdToken(tok);
      } else {
        setIdToken("");
      }
    });

    return () => unsub();
  }, [auth]);

  // Helper to map backend profile -> form state
  function mapProfileToForm(data) {
    return {
      name: data?.name || "",
      dob: data?.dob != null ? String(data.dob) : "",
      email: data?.email || "",
      phone: data?.phone || "",
      gender: data?.gender || "",
      city: data?.city || "",
      state: data?.state || "",
    };
  }

  async function fetchProfile(currentToken) {
    if (!currentToken) return;
    try {
      setLoading(true);
      setLoadError("");

      const res = await getUserProfile(currentToken);
      if (!res.ok) {
        // try to get text body for better error message
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Failed to fetch profile (status ${res.status})`);
      }
      const data = await res.json().catch(() => ({}));
      const next = mapProfileToForm(data);

      setForm(next);
      setInitialForm(next);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setLoadError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  // LOAD PROFILE when idToken becomes available
  useEffect(() => {
    if (!idToken) return;
    fetchProfile(idToken);
  }, [idToken]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaveError("");
    setSuccess("");
  }

  // SAVE PROFILE
  async function handleSave() {
    if (!idToken) return;

    setSaving(true);
    setSaveError("");
    setSuccess("");

    try {
      const payload = {
        ...(form.name ? { name: String(form.name) } : {}),
        ...(form.dob ? { dob: String(form.dob) } : {}),
        ...(form.city ? { city: String(form.city) } : {}),
        ...(form.state ? { state: String(form.state) } : {}),
        ...(form.gender ? { gender: String(form.gender) } : {}),
      };

      console.debug("Profile update payload:", payload);

      const res = await updateSettProfile(idToken, payload);

      let data = {};
      try {
        data = await res.json();
      } catch (err) {
        console.debug("Update response body not JSON or empty:", err);
      }

      console.debug("Update response status:", res.status, "body:", data);

      if (!res.ok) {
        // prefer structured data.detail/message if present
        const errMsg =
          (data && (data.detail || data.message)) ||
          `Update failed with status ${res.status}`;
        throw new Error(errMsg);
      }

      // If server returns the updated profile, use it. Otherwise, re-fetch profile to ensure UI matches DB.
      if (data && data.profile) {
        const next = mapProfileToForm(data.profile);
        setForm(next);
        setInitialForm(next);
      } else {
        // re-fetch authoritative profile from backend
        await fetchProfile(idToken);
      }

      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);

      let errorMessage = "Failed to update profile";

      if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please check your connection.";
      } else if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
        errorMessage =
          "Network error. Please ensure the backend server is running at http://127.0.0.1:8000";
      } else if (err.response?.status === 503) {
        errorMessage = "Database unavailable. Please check backend connection.";
      } else if (err.response?.status === 422) {
        errorMessage = "Invalid data. Please check your input.";
      } else if (err.response?.status === 404) {
        errorMessage = "Profile endpoint not found. Please check backend routes.";
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setSaveError(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (initialForm) {
      setForm(initialForm);
    }
    setSaveError("");
    setSuccess("");
    setIsEditing(false);
  }

  const panelClass =
    "w-full md:w-[35%] " +
    `px-4 pt-4 pb-6 flex flex-col ${isLight ? "bg-white" : "bg-white/10"} rounded-2xl`;

  const formatToDDMMYYYY = (dateString) => {
    if (!dateString) return;
    const [y, m, d] = dateString.split("-");
    return `${d}-${m}-${y}`;
  };

  if (loading) {
    return (
      <section className={panelClass}>
        <div className="flex items-center justify-center h-full">
          <div
            className={`w-8 h-8 border-3 border-t-transparent rounded-full animate-spin ${
              isLight ? "border-slate-800" : "border-white"
            }`}
          />
        </div>
      </section>
    );
  }

  if (loadError && !initialForm) {
    const isDatabaseError = String(loadError).includes("Database unavailable");

    return (
      <section className={panelClass}>
        <div className="flex flex-col items-center mt-3 px-4">
          <p className="text-[13px] text-red-600 font-semibold mb-2 text-center">
            {loadError}
          </p>
          {isDatabaseError ? (
            <div className="text-[11px] text-gray-600 text-center space-y-1">
              <p>• Check backend terminal for MongoDB connection errors</p>
              <p>• Verify MongoDB Atlas connection string is correct</p>
              <p>• Ensure MongoDB cluster is accessible</p>
              <p>• Check internet connection for MongoDB Atlas</p>
            </div>
          ) : (
            <p className="text-[11px] text-gray-500 text-center">
              Make sure the backend server is running
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 text-xs text-white rounded-md hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  const getInitial = () => {
    if (!form.name) return "";
    return form.name.trim().split(" ")[0][0].toUpperCase();
  };

  // shared input class for consistent sizing
  const inputClass =
    "border rounded-md px-2 py-1 text-[13px] w-full max-w-[220px] text-right focus:outline-none focus:ring-1 focus:ring-indigo-500";

  const labelClass = "opacity-75 min-w-[90px]";

  return (
    <section className={panelClass}>
      <div className="flex flex-col items-center mt-3">
        <div className="flex justify-center mt-4 mb-2">
          <div
            className={`w-30 h-30  rounded-full flex items-center justify-center shadow ${
              isLight ? "bg-[#e9d9e3] text-slate-700" : "bg-[#1d0e2d] text-slate-200"
            }`}
          >
            <span className="text-7xl font-semibold">{getInitial()}</span>
          </div>
        </div>

        {/* Card */}
        <div
          className={
            "mt-4 px-4 md:px-6 py-4 w-full md:min-w-[280px] md:max-w-[360px] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] " +
            `${isLight ? "bg-white border text-slate-900" : "bg-white/10 text-slate-50"}`
          }
        >
          {/* Messages */}
          {saveError && <p className="text-xs text-red-600 mb-1">{saveError}</p>}
          {success && <p className="text-xs text-green-600 mb-1">{success}</p>}

          {/* Info rows */}
          <div className="w-full space-y-1">
            {/* Name */}
            <div className="flex items-center justify-between py-1 text-[13px]">
              <span className={labelClass}>Username</span>
              <div className="flex-1 text-right">
                {isEditing ? (
                  <input
                    name="name"
                    type="text"
                    className={inputClass}
                    value={form.name}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="font-semibold">{form.name || "-"}</span>
                )}
              </div>
            </div>

            {/* DOB */}
            <div className="flex items-center justify-between py-1 text-[13px]">
              <span className={labelClass}>DOB</span>
              <div className="flex-1 text-right">
                {isEditing ? (
                  // date picker
                  <input
                    name="dob"
                    type="date"
                    className={inputClass}
                    value={form.dob}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="font-semibold">{formatToDDMMYYYY(form.dob) || "-"}</span>
                )}
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="flex items-center justify-between py-1 text-[13px]">
              <span className={labelClass}>Email</span>
              <div className="flex-1 text-right">
                <span className="font-semibold break-all">{form.email || "-"}</span>
              </div>
            </div>

            {/* Phone (read-only) */}
            <div className="flex items-center justify-between py-1 text-[13px]">
              <span className={labelClass}>Phone</span>
              <div className="flex-1 text-right">
                <span className="font-semibold">{form.phone || "-"}</span>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center justify-between py-1 text-[13px]">
              <span className={labelClass}>Gender</span>
              <div className="flex-1 text-right">
                {isEditing ? (
                  <select
                    name="gender"
                    className={`${inputClass} bg-purple-100 text-gray-800  rounded-md focus:outline-none`}
        value={form.gender || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <span className="font-semibold">{form.gender || "-"}</span>
                )}
              </div>
            </div>

            {/* City */}
            <div className="flex items-center justify-between py-1 text-[13px]">
              <span className={labelClass}>City</span>
              <div className="flex-1 text-right">
                {isEditing ? (
                  <input
                    name="city"
                    type="text"
                    className={inputClass}
                    value={form.city}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="font-semibold">{form.city || "-"}</span>
                )}
              </div>
            </div>

            {/* State */}
            <div className="flex items-center justify-between py-1 text-[13px]">
              <span className={labelClass}>State</span>
              <div className="flex-1 text-right">
                {isEditing ? (
                  <input
                    name="state"
                    type="text"
                    className={inputClass}
                    value={form.state}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="font-semibold">{form.state || "-"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            {!isEditing && (
              <button
                type="button"
                className={`px-4 py-1.5 text-sm text-slate-50 cursor-pointer font-semibold rounded-full ${
                  isLight
                    ? "bg-linear-to-r from-[#994A97] to-[#CA88B1]"
                    : "bg-white/10 hover:text-gray-700"
                } hover:bg-indigo-50 transition`}
                onClick={() => {
                  setSaveError("");
                  setSuccess("");
                  setIsEditing(true);
                }}
              >
                Edit Profile
              </button>
            )}

            {isEditing && (
              <>
                <button
                  type="button"
                  className={`px-4 py-1.5 text-sm rounded-full font-medium border border-gray-300 hover:bg-gray-50 disabled:opacity-60 ${
                    isLight ? "text-gray-700" : "text-gray-100 hover:text-gray-700"
                  }`}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`px-4 py-1.5 text-sm rounded-full disabled:opacity-60 text-white font-medium
                     ${ isLight ? "bg-linear-to-r from-[#994A97] to-[#CA88B1] hover:brightness-110" : "bg-white/10 hover:bg-white/20"
          }`}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mt-[18px] mb-3" />

      {/* Password row */}
      <div
        className={`flex items-center  py-1 rounded-xl px-1 text-[13px] ${
          isLight ? "text-slate-900 bg-[#e2d2dc]" : "text-slate-50 bg-white/10"
        }`}
      >
        <div className="flex cursor-pointer  p-2 items-center gap-2 flex-1">
          <FaLock />
          <button
            
            onClick={() => navigate("/newPassword")}
          >
            Password Reset
          </button>
        </div>
        <span className="text-[18px] mr-4">›</span>
      </div>
    </section>
  );
}

export default Profile;