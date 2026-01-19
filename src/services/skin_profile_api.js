
// const SKIN_API_URL = "http://localhost:8484/chatApp";

const SKIN_API_URL = import.meta.env.VITE_API_URL_SKIN_PROFILE


function authHeaders(token, hasBody = false) {
  const headers = {};

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (hasBody) headers["Content-Type"] = "application/json";

  return headers;
}
import axios from "axios";

export const SkinProfileApiService = {
  
  async loadSkinProfile(userId) {
    try {
      const res = await axios.get(`${SKIN_API_URL}/skin-profile/${userId}`);
      
      // const profile = res.data.skinProfileData || res.data;
      const data = res.data

      // return profile;
      return data

    } catch (err) {
      console.error("Load Skin Profile Error:", err.response?.data || err.message);
      throw err;
    }
  },

  async updateSkinProfile(userId, profileData) {
    try {
      const res = await axios.put(
        `${SKIN_API_URL}/skin-profile/${userId}`,
        { skinProfileData: profileData }
      );

      const updatedProfile = res.data.skinProfileData || res.data;
      return updatedProfile;

    } catch (err) {
      console.error("Update Skin Profile Error:", err.response?.data || err.message);
      throw err;
    }
  },

  async saveSkinProfile(userId, tempData) {
    try {
      const res = await axios.put(`${SKIN_API_URL}/skin-profile/${userId}`, 
        { skinProfileData : tempData}
      )

      const updatedProfile = res.data.skinProfileData || res.data

      return updatedProfile

    } catch (err) {
      console.error("Save Skin Profile Error :", err.response?.data || err.message)
    }
  },

  async  saveSkinAnswers(userId, payload) {
  const res = await fetch(
    `${SKIN_API_URL}/skin-answers-add/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return res.json();
}


};
