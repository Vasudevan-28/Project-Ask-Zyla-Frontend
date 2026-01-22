import { apiClient } from "./apiClient";

const SKIN_API_URL = import.meta.env.VITE_API_URL;

export const SkinProfileApiService = {
  
  async loadSkinProfile(userId) {
    try {
      const res = await apiClient.get(`/skinprofile/skin-profile/${userId}`);
      
      // const profile = res.data.skinProfileData || res.data;
      const data = res.data;

      // return profile;
      return data;

    } catch (err) {
      console.error("Load Skin Profile Error:", err.response?.data || err.message);
      throw err;
    }
  },

  async updateSkinProfile(userId, profileData) {
    try {
      const res = await apiClient.put(
        `/skinprofile/skin-profile/${userId}`,
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
      const res = await apiClient.put(
        `/skinprofile/skin-profile/${userId}`, 
        { skinProfileData: tempData }
      );

      const updatedProfile = res.data.skinProfileData || res.data;
      return updatedProfile;

    } catch (err) {
      console.error("Save Skin Profile Error :", err.response?.data || err.message);
      throw err;
    }
  },

  async saveSkinAnswers(userId, payload) {
    const res = await apiClient.put(
      `/skinprofile/skin-answers-add/${userId}`,
      payload
    );
    return res.data;
  }

};
