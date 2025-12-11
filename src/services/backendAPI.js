// const API_URL = "http://127.0.0.1:8484";

const API_URL = import.meta.env.VITE_API_URL

// ---------------------- SAVE USER ----------------------
export const saveUserToDB = async (userData) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to save user in DB");
  }

  return await res.json();
};

export const saveGoogleSignup = async (userData) => {
  const response = await fetch(`${API_URL}/save-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};


// ---------------------- LOGIN ----------------------
export const loginWithBackend = async (identifier, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }

  const data = await res.json()
  console.log(data.method)
  console.log(data.message)
  return data;
};


export const getEmailForPhone = async (phone) => {
  const res = await fetch(`${API_URL}/getemailforphone`, {
    method : "POST", 
    headers : { "Content-Type" : "application/json"},
    body: JSON.stringify({phone})
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.detail || "Failed to retrieve email");
  }

  return data
}

// ---------------------- EMAIL OTP ----------------------
export const sendEmailOtp = async (email) => {
  const res = await fetch(`${API_URL}/send-email-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to send OTP");
  }

  return data;
};


// export const verifyEmailOtp = async (email, otp) => {
//   const res = await fetch(`${API_URL}/verify-email-otp`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, otp }),
//   });

//   return await res.json();
// };

export const verifyEmailOtp = async (email, otp) => {
  const res = await fetch(`${API_URL}/verify-email-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }), 
  });

  // 🚨 If backend returns 4xx/5xx, throw an error
  if (!res.ok) {
    let errorBody = {};
    try {
      errorBody = await res.json();
    } catch (e) {
      console.log(e)
    }

    const message =
      errorBody?.detail || errorBody?.message || "OTP verification failed";
    throw new Error(message);
  }

  // ✅ Only here for 2xx responses
  return await res.json();
};




// export const resetEmailPassword = async (email, new_password) => {
//   const res = await fetch(`${API_URL}/resetpassemail`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, new_password }),
//   });

//   return await res.json();
// };

import axios from "axios";

export const resetEmailPassword = async (email, new_password) => {
  try {
    const res = await axios.post(
      `${API_URL}/resetpassemail`, 
      { email, new_password }
    );
    return res.data;
  } catch (error) {
    // Optionally handle/log error
    if (error.response) {
      // Server responded with status code out of 2xx
      return error.response.data;
    } else {
      // No response received (network/server down)
      return { error: error.message };
    }
  }
};


// ---------------------- PHONE OTP ----------------------
export const sendOtpToPhone = async (phone) => {
  const res = await fetch(`${API_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to send phone OTP");
  }

  return data;
};


export const phoneOtpAttempt = async (phone) => {
  const res = await fetch(`${API_URL}/phone-otp-attempt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Too many OTP requests. Try again after 30 minutes.");
  }

  return await res.json();
};

export const verifyPhoneOtp = async (phone, otp) => {
  const res = await fetch(`${API_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp: Number(otp) }),
  });

  return await res.json();
};

export const resetPasswordPhone = async (phone, newPassword) => {
  const res = await fetch(`${API_URL}/reset-password-phone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, new_password: newPassword }),
  });

  return await res.json();
};

export const deleteAccountAPI = async (email) => {
  return await fetch(`${API_URL}/delete-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then((res) => res.json());
};

export const clearCacheAPI = async (token) => {
  return await fetch(`${API_URL}/sensitive/clear_cache`,
    {
      method : "POST",
      headers : { "Authorization" : `Bearer ${token}`, "Content-Type": "application/json"},
    }
  ).then((res) => res.json())
}

// ---------------------- CHECK IF USER EXISTS ----------------------
export const checkGoogleUser = async (email) => {
  const response = await fetch(`${API_URL}/check-google-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return await response.json();
};


// ---------------------- SAVE FCM TOKEN ----------------------
export const saveFcmToken = async (email, fcm_token) => {
  const res = await fetch(`${API_URL}/save-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, fcm_token }),
  });

  return await res.json();
};

