import axios from "axios";

// Backend base URL
const BASE_URL = "http://127.0.0.1:8484/settings";

// Hold the current auth token ("Bearer <token>")
let authToken = null;



export function setAuthToken(token) {
  authToken = typeof token === "string" && token ? `Bearer ${token}` : null;
}


// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Inject Authorization header
function withAuth(config = {}) {
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(authToken ? { Authorization: authToken } : {}),
    },
  };
}

/* ===========================
   PROFILE
   GET /profile
   PUT /profile
   =========================== */

export async function getProfile() {
  const config = withAuth();
  const res = await apiClient.get("/profile", config);
  return res.data;
}

export async function updateProfile(payload) {
  const config = withAuth();
  const res = await apiClient.put("/profile", payload, config);
  return res.data;
}

/* ===========================
   RATING
   GET /rating
   PUT /rating
   =========================== */

export async function getRating() {
  const config = withAuth();
  const res = await apiClient.get("/rating", config);
  return res.data;
}

export async function updateRating(value) {
  const config = withAuth();
  const res = await apiClient.put("/rating", { rating: value }, config);
  return res.data;
}

/* ===========================
   FEEDBACK
   GET /feedback
   PUT /feedback
   =========================== */

export async function getFeedback() {
  const config = withAuth();
  const res = await apiClient.get("/feedback", config);
  return res.data;
}

export async function updateFeedback(feedback) {
  const config = withAuth();
  const res = await apiClient.put("/feedback", { feedback }, config);
  return res.data;
}

/* ===========================
   SUPPORT
   GET /support
   PUT /support
   =========================== */

export async function getSupport() {
  const config = withAuth();
  const res = await apiClient.get("/support", config);
  return res.data;
}

export async function updateSupport(message) {
  const config = withAuth();
  const res = await apiClient.put("/support", { message }, config);
  return res.data;
}

export async function sendGenSupport(name, email, combined){
    const data =   await fetch(`${BASE_URL}/general-support`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: combined,
        }),
      });

      return data
}

export async function getUserProfile(token) {
     
      const res = await fetch(`${BASE_URL}/profile`, {
        // headers: { Authorization: AUTH_TOKEN },
        headers: { Authorization: `Bearer ${token}` },
      })

      return res
}


export async function submitLogOutFeedback(token, feedbackData) {
  const res = await fetch(`${BASE_URL}/feedback-submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedbackData),
  });

  return res;
}



export async function updateUserLocation(token, profileData) {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update profile");
  }

  const data = await res.json();
  return data;
}