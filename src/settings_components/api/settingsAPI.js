import { apiClient, publicClient } from "../../services/apiClient";

// const SETT_URL = import.meta.env.VITE_API_URL;

export async function sendGenSupport(name, email, combined) {
  const { data } = await publicClient.put(`/settings/general-support`, {
    name: name.trim(),
    email: email.trim(),
    message: combined,
  });
  return data;
}

export async function getUserProfile() {
  const { data } = await apiClient.get(`/settings/profile`);
  return data;
}

export async function submitLogOutFeedback(feedbackData) {
  const { data } = await apiClient.post(`/settings/feedback-submit`, feedbackData);
  return data;
}

export async function submitSettFeedback(feedbackData) {
  const { data } = await apiClient.put(`/settings/feedback`, feedbackData);
  return data;
}

export async function updateCityAndState(city, state) {
  const { data } = await apiClient.put(`/settings/profile`, {
    city: city || undefined,
    state: state || undefined,
  });

  return data;
}

export async function submitSupportRequest(message) {
  const { data } = await apiClient.put(`/settings/support`, {
    message,
  });

  return data;
}

export async function updateSettProfile(payload) {
  const { data } = await apiClient.put(`/settings/profile`, payload);
  return data;
}

export async function submitSettRating(rating) {
  const { data } = await apiClient.put(`/settings/rating`, {
    rating,
  });

  return data;
}
