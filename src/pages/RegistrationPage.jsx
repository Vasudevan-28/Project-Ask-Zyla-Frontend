import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  saveUserToDB,
  saveGoogleSignup,
  resetEmailPassword,
} from "../services/backendAPI.js";
import { signupUser, logout } from "../services/authservice.js";
import HeaderAuth from "../authentication_components/HeaderAuth.jsx";
import { useAuth } from "../contexts/authContext.jsx";

function RegistrationPage() {
  const locaState = useLocation();
  const navigate = useNavigate();
  let { email, isGoogle } = locaState.state || {};

  const { profile, authUser, loading } = useAuth()

  const emid = email ?? authUser?.email ?? ""

  isGoogle = authUser ? true : false

  useEffect(() => {
    if (loading) return;

    if (authUser && profile?.registered) {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (authUser && profile?.exists === true && profile?.registered === false) {
      navigate("/questionnaire", { replace: true });
      return;
    }
 }, [authUser, profile, loading]);

 

  const [showPass, setShowPass] = useState(false);
  const [showRetypePass, setShowRetypePass] = useState(false);

  const [toastMsg, setToastMsg] = useState("");

  const minDOB = "1950-01-01";
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    firstName: "",
    dob: "",
    gender: "",
    countryCode: "+1",
    phone: "",
    password: "",
    retypePassword: "",
    city: "",
    state: "",
    country: "",
    timezone: "",
  });

  const [errors, setErrors] = useState({});
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [loading2, setLoading] = useState(false);

  // Validate fields
  const validateForm = () => {
    let newErrors = {};
    const requiredFields = [
      "firstName",
      "dob",
      "gender",
      "countryCode",
      "phone",
      "password",
      "retypePassword",
      "city",
      "state",
      "country",
      "timezone",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = "Required";
    });

    if (formData.dob) {
      const dob = new Date(formData.dob);
      const now = new Date();

      now.setHours(0, 0, 0, 0);

      if (isNaN(dob.getTime())) {
        newErrors.dob = "Enter a valid date";
      } else if (dob > now) {
        newErrors.dob = "Date of birth cannot be in the future";
      } else {
        const ageDiffMs = now.getTime() - dob.getTime();
        const ageYears = ageDiffMs / (1000 * 60 * 60 * 24 * 365.25);
        if (ageYears < 5) {
          newErrors.dob = "You must be at least 5 years old";
        }
      }
    }

    // Phone digits check
    if (formData.phone && !formData.phone.match(/^[0-9]+$/)) {
      newErrors.phone = "Phone must contain only numbers";
    }
    if (formData.phone && formData.phone.length < 8) {
      newErrors.phone = "Enter valid phone";
    }

    if (formData.password !== formData.retypePassword) {
      newErrors.retypePassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const userData = {
        // firebase_uid: user?.uid,
        name: formData.firstName.trim(),
        // email,
        email: emid,
        phone: formData.countryCode + formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        timezone: formData.timezone,
        password: formData.password,
        registered: false,
        skin_profile: false,
      };

      if (isGoogle) {
        await saveGoogleSignup(userData);
        await resetEmailPassword(formData.password);
      } else {
        
        await signupUser(emid, formData.password);
      
        
        const userDataEP = {
          name: formData.firstName.trim(),
          // email,
          email: emid,
          phone: formData.countryCode + formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          timezone: formData.timezone,
          password: formData.password,
          // firebase_uid: firebaseUser.uid,
          registered: false,
          skin_profile: false,
          created_at: new Date().toISOString(),
        };

        await saveUserToDB(userDataEP);
        // await logout()
      }
      await logout()
navigate(isGoogle ? "/successGoogle" : "/successEmail", { replace : true });
console.log("navigated to success")



    } catch (err) {
      setToastMsg(err?.message || "Registration failed!");
      setTimeout(() => setToastMsg(""), 3000);
    }

    setLoading(false);
  };

  
  const locationData = {
    India: {
      states: {
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"],
        Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
        Kerala: ["Kochi", "Trivandrum", "Calicut", "Thrissur", "Alappuzha"],
        Telangana: [
          "Hyderabad",
          "Warangal",
          "Nizamabad",
          "Karimnagar",
          "Khammam",
        ],
        Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
      },
      timezones: ["IST"],
    },
    USA: {
      states: {
        California: [
          "Los Angeles",
          "San Diego",
          "San Jose",
          "SF",
          "Sacramento",
        ],
        Texas: ["Houston", "Dallas", "Austin", "San Antonio", "El Paso"],
        Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Naples"],
        NewYork: ["NYC", "Buffalo", "Albany", "Rochester", "Yonkers"],
        Illinois: ["Chicago", "Naperville", "Aurora", "Peoria", "Rockford"],
      },
      timezones: ["EST", "CST", "PST"],
    },
    UK: {
      states: {
        England: ["London", "Manchester", "Liverpool", "Leeds", "Bristol"],
        Scotland: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
        Wales: ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry"],
        NIreland: ["Belfast", "Lisburn", "Bangor", "Newry", "Armagh"],
        London: ["Westminster", "Camden", "Greenwich", "Hackney", "Croydon"],
      },
      timezones: ["GMT"],
    },
  };

  return (
    <div className="min-h-screen min-w-fit bg-[#1A0D28] text-white font-['Anek_Devanagari'] p-4  ">
      <div className="absolute top-0 left-2 md:left-0 w-fit " >
      <HeaderAuth />
      </div>
      <div className="max-w-2xl w-full mx-auto mt-20 mb-10  md:mt-6  py-6  px-4  bg-white/20 backdrop-blur-xl rounded-3xl shadow-xl  border border-white/30">
        <h2 className="text-2xl font-bold text-center text-white">Registration</h2>
        <p className="text-white/90 mt-1 mb-4 text-center">
          Hello {emid}! Please complete the registration to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username & DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-white">Username</label>
              <input
                name="firstName"
                value={formData.firstName}
                placeholder="Username"
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className={`w-full h-12 p-2 rounded-md bg-white/20 text-white focus:outline-none ${
                  errors.firstName ? "border border-red-500" : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-white">Date of Birth</label>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                max={today}
                min={minDOB}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, dob: value });

                  let err = "";
                  const dob = new Date(value);
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);

                  if (!value) {
                    err = "Required";
                  } else if (isNaN(dob.getTime())) {
                    err = "Enter a valid date";
                  } else if (dob > now) {
                    err = "Date cannot be in the future";
                  } else if (value < minDOB) {
                    err = "Date cannot be earlier than 1950";
                  } else {
                    const age = (now - dob) / (1000 * 60 * 60 * 24 * 365.25);
                    if (age < 13) err = "You must be at least 13 years old";
                  }

                  setErrors((prev) => ({ ...prev, dob: err }));
                }}
                className={`w-full p-2 rounded-md bg-white/20 text-white focus:outline-none ${
                  errors.dob ? "border border-red-500" : ""
                }`}
              />

              {errors.dob && (
                <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
              )}
            </div>
          </div>

          {/* Gender & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender */}
            <div>
              <label className="block mb-1 text-white">Gender</label>
              <div className="relative h-12">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className={`w-full h-full p-2 rounded-lg bg-[#3A2C49] text-white appearance-none pr-10 focus:outline-none ${
                    errors.gender ? "border border-red-500" : ""
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">
                  ▾
                </span>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 text-white">Phone</label>
              <div className="flex gap-2">
                <div className="relative h-12 w-28 sm:w-32">
                  <select
                    value={formData.countryCode}
                    onChange={(e) =>
                      setFormData({ ...formData, countryCode: e.target.value })
                    }
                    className="w-full h-full p-2 rounded-lg bg-[#3A2C49] text-white appearance-none pr-6 focus:outline-none"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+81">🇯🇵 +81</option>
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                    ▾
                  </span>
                </div>

                <input
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setFormData({ ...formData, phone: value });
                    }
                  }}
                  maxLength={10}
                  className={`flex-1 h-12 p-2 rounded-md bg-white/20 text-white focus:outline-none ${
                    errors.phone ? "border border-red-500" : ""
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            <div className="relative">
              <label className="block mb-1 text-white">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  maxLength={16}
                  onChange={(e) => {
                    const value = e.target.value;

                    setFormData({ ...formData, password: value });

                    setErrors((prev) => ({
                      ...prev,
                      retypePassword:
                        formData.retypePassword &&
                        formData.retypePassword !== value
                          ? "Passwords do not match"
                          : "",
                    }));
                  }}
                  placeholder="*******"
                  className={`w-full p-2 rounded-md bg-white/20 text-white focus:outline-none ${
                    errors.password ? "border border-red-500" : ""
                  }`}
                  onFocus={() => setShowPasswordRules(true)}
                  onBlur={() => setShowPasswordRules(false)}
                />

                {/* EYE ICON */}
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    /* Eye ON */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.477 10.477A3 3 0 0113.5 13.5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.53 6.53C4.398 8.088 2.917 10.356 2.458 12
               c1.273 4.057 5.064 7 9.542 7
               1.83 0 3.558-.41 5.064-1.14M17.47 17.47
               C19.602 15.912 21.083 13.644 21.542 12
               20.269 7.943 16.478 5 12 5
               c-.96 0-1.89.14-2.771.402"
                      />
                    </svg>
                  ) : (
                    /* Eye OFF */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5
               c4.478 0 8.269 2.943 9.542 7
               -1.273 4.057 -5.064 7 -9.542 7
               -4.477 0 -8.268 -2.943 -9.542 -7z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </span>
              </div>
              {showPasswordRules && (
                <div className="absolute top-full left-0 mt-2 w-full md:w-[320px] bg-[#3A2C49]/90 text-white p-3 rounded-lg shadow-lg z-10">
                  <p className="font-semibold mb-1">Password must contain:</p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    <li
                      className={`${
                        /[A-Z]/.test(formData.password) ? "text-green-500" : ""
                      }`}
                    >
                      {/[A-Z]/.test(formData.password) ? "✔" : ""} Min 1
                      uppercase letter
                    </li>
                    <li
                      className={`${
                        /[a-z]/.test(formData.password) ? "text-green-500" : ""
                      }`}
                    >
                      {/[a-z]/.test(formData.password) ? "✔" : ""} Min 1
                      lowercase letter
                    </li>
                    <li
                      className={`${
                        /\d/.test(formData.password) ? "text-green-500" : ""
                      }`}
                    >
                      {/\d/.test(formData.password) ? "✔" : ""} Min 1 number
                    </li>
                    <li
                      className={`${
                        /[!@#*$%]/.test(formData.password)
                          ? "text-green-500"
                          : ""
                      }`}
                    >
                      {/[!@#*$%]/.test(formData.password) ? "✔" : ""} Min 1
                      symbol (! @ # * $ %)
                    </li>
                    <li
                      className={`${
                        formData.password.length >= 8 ? "text-green-500" : ""
                      }`}
                    >
                      {formData.password.length >= 8 ? "✔" : ""} At least 8
                      characters
                    </li>
                  </ul>
                </div>
              )}
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
            <div className="relative">
              <label className="block mb-1 text-white">Retype Password</label>

              {/* Input + Icon wrapper (fixed height) */}
              <div className="relative h-12">
                <input
                  type={showRetypePass ? "text" : "password"}
                  name="retypePassword"
                  value={formData.retypePassword}
                  maxLength={16}
                  onChange={(e) => {
                    const value = e.target.value;

                    setFormData({ ...formData, retypePassword: value });

                    setErrors((prev) => ({
                      ...prev,
                      retypePassword:
                        value && value !== formData.password
                          ? "Passwords do not match"
                          : "",
                    }));
                  }}
                  placeholder="*******"
                  className={`w-full p-2 rounded-md bg-white/20 text-white focus:outline-none ${
                    errors.retypePassword ? "border border-red-500" : ""
                  }`}
                />

                {/* Eye Icon stays fixed */}
                <span
                  className="absolute right-3 mt-2 cursor-pointer"
                  onClick={() => setShowRetypePass(!showRetypePass)}
                >
                  {showRetypePass ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.477 10.477A3 3 0 0113.5 13.5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.53 6.53C4.398 8.088 2.917 10.356 2.458 12
                c1.273 4.057 5.064 7 9.542 7
                1.83 0 3.558-.41 5.064-1.14M17.47 17.47
                C19.602 15.912 21.083 13.644 21.542 12
                20.269 7.943 16.478 5 12 5
                c-.96 0-1.89.14-2.771.402"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5
                c4.478 0 8.269 2.943 9.542 7
                -1.273 4.057 -5.064 7 -9.542 7
                -4.477 0 -8.268 -2.943 -9.542 -7z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </span>
              </div>

              {errors.retypePassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.retypePassword}
                </p>
              )}
            </div>
          </div>

          {/* Location Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country */}
            <div>
              <label className="block mb-1 text-white">Country</label>
              <div className="relative h-12">
                <select
                  value={formData.country}
                  onChange={(e) => {
                    const country = e.target.value;
                    setFormData({
                      ...formData,
                      country,
                      state: "",
                      city: "",
                      timezone: "",
                    });
                  }}
                  className={`w-full h-full p-2 rounded-lg bg-[#3A2C49] text-white appearance-none pr-10 focus:outline-none ${
                    errors.country ? "border border-red-500" : ""
                  }`}
                >
                  <option value="">Select Country</option>
                  {Object.keys(locationData).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  ▾
                </span>
              </div>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block mb-1 text-white">State</label>
              <div className="relative h-12">
                <select
                  value={formData.state}
                  disabled={!formData.country}
                  onChange={(e) => {
                    const state = e.target.value;
                    setFormData({
                      ...formData,
                      state,
                      city: "",
                      timezone: "",
                    });
                  }}
                  className={`w-full h-full p-2 rounded-lg appearance-none pr-10 focus:outline-none ${
                    !formData.country
                      ? "bg-gray-500/30 cursor-not-allowed"
                      : "bg-[#3A2C49]"
                  } text-white`}
                >
                  <option value="">Select State</option>
                  {formData.country &&
                    Object.keys(locationData[formData.country].states).map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      )
                    )}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  ▾
                </span>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block mb-1 text-white">City</label>
              <div className="relative h-12">
                <select
                  value={formData.city}
                  disabled={!formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className={`w-full h-full p-2 rounded-lg appearance-none pr-10 focus:outline-none ${
                    !formData.state
                      ? "bg-gray-500/30 cursor-not-allowed"
                      : "bg-[#3A2C49]"
                  } text-white`}
                >
                  <option value="">Select City</option>
                  {formData.country &&
                    formData.state &&
                    locationData[formData.country].states[formData.state].map(
                      (city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      )
                    )}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  ▾
                </span>
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block mb-1 text-white">Timezone</label>
              <div className="relative h-12">
                <select
                  value={formData.timezone}
                  disabled={!formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, timezone: e.target.value })
                  }
                  className={`w-full h-full p-2 rounded-lg appearance-none pr-10 focus:outline-none ${
                    !formData.city
                      ? "bg-gray-500/30 cursor-not-allowed"
                      : "bg-[#3A2C49]"
                  } text-white`}
                >
                  <option value="">Select Timezone</option>
                  {formData.country &&
                    locationData[formData.country].timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  ▾
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading2}
            className="w-full bg-[#3A2C49] cursor-pointer py-3 rounded-md font-semibold hover:opacity-90"
          >
            {loading2 ? "Processing..." : "CONTINUE"}
          </button>
        </form>
      </div>

      {toastMsg && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 animate-slide-in">
          <div className="flex items-start max-w-sm bg-linear-to-br from-red-500 to-red-600 text-white px-4 py-3 rounded-xl shadow-2xl shadow-red-500/30 border border-red-400/30 backdrop-blur-sm">
            <div className="flex items-center justify-center shrink-0 w-5 h-5 mt-0.5 mr-3">
              <svg
                className="w-5 h-5 animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm font-mono leading-tight">Error</p>
              <p className="text-sm opacity-90 mt-1 font-mono leading-relaxed">{toastMsg}</p>
            </div>
            <button
              className="ml-4 shrink-0 text-white/80 hover:text-white transition-colors"
              onClick={() => setToastMsg(false)}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrationPage;