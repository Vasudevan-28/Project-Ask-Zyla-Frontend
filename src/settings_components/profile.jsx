import React, { useEffect, useState, useContext } from "react";
import { FaRegUser, FaLock } from "react-icons/fa";
import { VscArrowCircleLeft } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";

import LockIcon from "./assets/Privacy.png";
import { getProfile, updateProfile, setAuthToken, getUserProfile, updateSettProfile } from "./api/settingsAPI";
import { getAuth, onAuthStateChanged, onIdTokenChanged } from "firebase/auth";

function Profile({ onBack }) {
  const navigate = useNavigate()

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

  const [idToken, setIdToken] = useState("")

 const auth = getAuth();
    useEffect(() => {
      const unsub = onIdTokenChanged(auth, async (u) => {
        // setUser(u);
        // setAuthToken(await u.getIdToken(false))
        if(u){
          const tok = await u.getIdToken(false)
          setIdToken(tok)
        }else{
          setIdToken("")
        }
      });
  
      return () => unsub();
    }, [auth]);
  //Helper to map backend profile -> form state
  function mapProfileToForm(data) {
    // const addr = data?.address || {};
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

  //LOAD PROFILE
  useEffect(() => {

    if(!idToken) return

    async function fetchData() {
      try {
        setLoading(true);
        setLoadError("");

        // const data = await getProfile();

         
      // const res = await fetch(`http://127.0.0.1:8484/settings/profile`, {
      //   // headers: { Authorization: AUTH_TOKEN },
      //   headers: { Authorization: `Bearer ${idToken}` },
      // })

      const res = await getUserProfile(idToken)

      if (!res.ok) throw new Error(await res.text());
      const data1 = await res.json();
        const next = mapProfileToForm(data1);

        setForm(next);
        setInitialForm(next);
      } catch (err) {
        console.error("Failed to load profile:", err);

        // let errorMessage = "Failed to load profile from server";
        // if (err.code === "ECONNABORTED") {
        //   errorMessage = "Request timeout. Please check your connection.";
        // } else if (err.code === "ERR_NETWORK" || err.message?.includes("Network")) {
        //   errorMessage =
        //     "Network error. Please ensure the backend server is running at http://127.0.0.1:8000";
        // } else if (err.response?.status === 503) {
        //   const backendMessage =
        //     err.response?.data?.detail || "Database unavailable";
        //   errorMessage = `${backendMessage}. The backend server is running but cannot connect to MongoDB. Please check the backend terminal logs.`;
        // } else if (err.response?.status === 404) {
        //   errorMessage = "Profile endpoint not found. Please check backend routes.";
        // } else if (err.response?.data?.detail) {
        //   errorMessage = err.response.data.detail;
        // } else if (err.message) {
        //   errorMessage = err.message;
        // }

        setLoadError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

  //SAVE PROFILE
  async function handleSave() {

    if(!idToken) return

    setSaving(true);
    setSaveError("");
    setSuccess("");

    try {
      const payload = {
        name: form.name || undefined,
        dob: form.dob ? String(form.dob) : undefined,
        city: form.city || undefined,
        state: form.state || undefined,
      };

      // const res = await updateProfile(payload);
      //   const res = await fetch(`http://127.0.0.1:8484/settings/profile`, {
      //   // headers: { Authorization: AUTH_TOKEN },
      //   method : "PUT",
      //   headers: { Authorization: `Bearer ${idToken}`,  "Content-Type": "application/json", },
      //    body: JSON.stringify(payload)
      // })

      const res = await updateSettProfile(idToken, payload);


        const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(await res.text());

      if (data.detail === "Nothing to update") {
        setSuccess("No changes to save");

        if (data.profile) {
          const next = mapProfileToForm(res.profile);
          setForm(next);
          setInitialForm(next);
        }
      } else {
        setSuccess("Profile updated successfully");

        if (res?.profile) {
          const next = mapProfileToForm(res.profile);
          setForm(next);
          setInitialForm(next);
        } else {
          setInitialForm(form);
        }
      }

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

  //Same layout as .profile-panel
  const panelClass =
    "w-[35%]  " +
    `px-4 pt-4 pb-6 flex flex-col ${isLight ? "bg-white" : "bg-white/10" } rounded-2xl`;

  const formatToDDMMYYYY = (dateString) => {
    if (!dateString) return;
  const [y, m, d] = dateString.split("-");
  return `${d}-${m}-${y}`;
};

  if (loading) {
    return (
      <section className={panelClass}>
        <div className="flex flex-col items-center mt-3 text-[13px] text-red-500">
          Loading...
        </div>
      </section>
    );
  }

  if (loadError && !initialForm) {
    const isDatabaseError = loadError.includes("Database unavailable");

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
              Make sure the backend server is running at http://127.0.0.1:8000
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 text-xs  text-white rounded-md hover:opacity-90"
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


  return (
    <section className={panelClass}>
      {/*Back arrow - Updated to be invisible */}
      <button
        type="button"
        onClick={() => onBack && onBack()}
        className="invisible w-0 h-0 overflow-hidden"
        aria-label="Back"
      >
        <VscArrowCircleLeft size={40} />
      </button>

      <div className="flex flex-col items-center mt-3">
        <div className="flex justify-center mt-4 mb-2">
          <div className={`w-[120px] h-[120px] rounded-full flex items-center justify-center shadow
  ${isLight ? "bg-[#e9d9e3] text-slate-700" : "bg-[#1d0e2d] text-slate-200"}`}>
  <span className="text-7xl font-semibold">
    {getInitial()}
  </span>
</div>

        </div>

        {/* Card */}
        <div className={"mt-4 px-6 py-4 min-w-[280px] max-w-[360px] rounded-2xl  shadow-[0_4px_12px_rgba(0,0,0,0.04)] " +  `${isLight ? "bg-white border text-slate-900" : "bg-white/10 text-slate-50"}`}>
          {/* Messages */}
          {saveError && (
            <p className="text-xs text-red-600 mb-1">{saveError}</p>
          )}
          {success && (
            <p className="text-xs text-green-600 mb-1">{success}</p>
          )}

          {/* Info rows */}
          <div className="w-full">
            {/* Name */}
            <div className="flex justify-between py-1.5 text-[13px] ">
              <span className="opacity-75">Username</span>
              {isEditing ? (
                <input
                  name="name"
                  type="text"
                  className="border border-[var(--border-soft)] rounded-md px-2 py-1 text-[13px] text-right w-[55%] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={form.name}
                  onChange={handleChange}
                />
              ) : (
                <span className="font-semibold text-right">
                  {form.name || "-"}
                </span>
              )}
            </div>

            {/* Age */}
            <div className="flex justify-between py-1.5 text-[13px] ">
              <span className="opacity-75">DOB</span>
              {isEditing ? (
                <input
                  name="dob"
                  type="text"
                  className="border border-[var(--border-soft)] rounded-md px-2 py-1 text-[13px] text-right w-[55%] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={form.dob}
                  onChange={handleChange}
                />
              ) : (
                <span className="font-semibold text-right">
                  {/* {form.dob || "-"} */}
                  {formatToDDMMYYYY(form.dob) || "-"}
                </span>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="flex justify-between py-1.5 text-[13px] ">
              <span className="opacity-75">Email</span>
              <span className="font-semibold text-right break-all">
                {form.email || "-"}
              </span>
            </div>

            {/* Phone (read-only) */}
            <div className="flex justify-between py-1.5 text-[13px] ">
              <span className="opacity-75">Phone</span>
              <span className="font-semibold text-right">
                {form.phone || "-"}
              </span>
            </div>

            {/* Gender (read-only) */}
            <div className="flex justify-between py-1.5 text-[13px] ">
              <span className="opacity-75">Gender</span>
              <span className="font-semibold text-right">
                {form.gender || "-"}
              </span>
            </div>

            {/* City */}
            <div className="flex justify-between py-1.5 text-[13px] ">
              <span className="opacity-75">City</span>
              {isEditing ? (
                <input
                  name="city"
                  type="text"
                  className="border border-[var(--border-soft)] rounded-md px-2 py-1 text-[13px] text-right w-[55%] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={form.city}
                  onChange={handleChange}
                />
              ) : (
                <span className="font-semibold text-right">
                  {form.city || "-"}
                </span>
              )}
            </div>

            {/* State */}
            <div className="flex justify-between py-1.5 text-[13px] text-[color:var(--text-main)]">
              <span className="opacity-75">State</span>
              {isEditing ? (
                <input
                  name="state"
                  type="text"
                  className="border border-[var(--border-soft)] rounded-md px-2 py-1 text-[13px] text-right w-[55%] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={form.state}
                  onChange={handleChange}
                />
              ) : (
                <span className="font-semibold text-right">
                  {form.state || "-"}
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            {!isEditing && (
              <button
                type="button"
                className={`px-4 py-1.5 text-sm text-slate-50 cursor-pointer font-semibold rounded-full ${isLight ? "bg-linear-to-r from-[#994A97] to-[#CA88B1]" : "bg-white/10 hover:text-gray-700"}  hover:bg-indigo-50 transition`}
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
                  className={`px-4 py-1.5 text-sm rounded-full border border-gray-300  hover:bg-gray-50 disabled:opacity-60
                    ${isLight ? "text-gray-700" : "text-gray-100 hover:text-gray-700"}
                    `}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`px-4 py-1.5 text-sm rounded-full  disabled:opacity-60 
                     bg-linear-to-r from-[#994A97] to-[#CA88B1]
                    text-gray-100
                    `}
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
      <div className="h-px bg-[var(--border-soft)] mt-[18px] mb-3" />

      {/* Password row */}
      <div className={`flex items-center py-2 px-0.5 text-[13px] ${isLight ? "text-slate-900" : "text-slate-50"} `}>
        <div className="flex items-center gap-2 flex-1">
          <FaLock />
          <button className="cursor-pointer" onClick={() => navigate("/newPassword") } >Password Reset</button>
        </div>
        <span className="text-[18px]">›</span>
      </div>
    </section>
  );
}

export default Profile;