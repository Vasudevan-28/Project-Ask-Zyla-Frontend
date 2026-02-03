import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAuth from "./HeaderAuth";
 
export default function PhoneNumberReset() {
  const navigate = useNavigate();
 
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
 
  const handleContinue = () => {
    if (!phone || phone.length !== 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setError("");
    navigate("/verification"); 
  };
 
  return (
<div className="min-h-screen flex items-center justify-center bg-[#1A0D28] p-4">
  <HeaderAuth />
 
      {/* Card */}
<div className="w-full max-w-xl bg-[#3A3146]/60 backdrop-blur-xl shadow-2xl rounded-3xl p-10">
 
        {/* Title */}
<h1 className="text-3xl font-semibold text-white text-center">
          Forgot Password
</h1>
 
        <p className="text-white/70 text-center mt-3 text-sm leading-relaxed">
          Enter your phone number for the verification process, we will send a
          4-digit code to your number.
</p>
 
        {/* Input */}
<div className="mt-8">
<label className="block text-white mb-2">Phone Number</label>
 
          <div className="flex gap-3">
            {/* Country Code */}
<select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white text-[#3A2C49] font-medium outline-none"
>
<option value="+91">🇮🇳 +91</option>
<option value="+1">🇺🇸 +1</option>
<option value="+44">🇬🇧 +44</option>
<option value="+61">🇦🇺 +61</option>
<option value="+971">🇦🇪 +971</option>
</select>
 
            {/* Phone Input */}
<input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 outline-none placeholder-gray-400"
            />
</div>
 
          {error && (
<p className="text-red-300 text-sm mt-2">{error}</p>
          )}
</div>
 
<p
          onClick={() => navigate("/forgot-password")} 
          className="text-right text-white/80 text-sm mt-4 cursor-pointer hover:underline"
>
          Reset with email?
</p>
 
<button
          onClick={handleContinue}
          className="mt-8 w-full bg-[#3A3146] hover:bg-[#2e2537] text-white font-semibold py-3 rounded-xl shadow-lg active:scale-[0.98] transition"
>
          CONTINUE
</button>
 
      </div>
</div>
  );
}