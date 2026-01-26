import { apiClient } from "./apiClient";

const SKIN_API_URL = import.meta.env.VITE_API_URL;

export const SkinProfileApiService = {
  
  async loadSkinProfile() {
    try {
      const res = await apiClient.get(`/skinprofile/skin-profile`);
      
      const data = res.data;
return data;

    } catch (err) {
      console.error("Load Skin Profile Error:", err.response?.data || err.message);
      throw err;
    }
  },

  async updateSkinProfile(profileData) {
    try {
      const res = await apiClient.put(
        `/skinprofile/skin-profile`,
        { skinProfileData: profileData }
      );

      const updatedProfile = res.data.skinProfileData || res.data;
      return updatedProfile;

    } catch (err) {
      console.error("Update Skin Profile Error:", err.response?.data || err.message);
      throw err;
    }
  },

  async saveSkinProfile(tempData) {
    try {
      const res = await apiClient.put(
        `/skinprofile/skin-profile`, 
        { skinProfileData: tempData }
      );

      const updatedProfile = res.data.skinProfileData || res.data;
      return updatedProfile;

    } catch (err) {
      console.error("Save Skin Profile Error :", err.response?.data || err.message);
      throw err;
    }
  },

  async saveSkinAnswers(payload) {
    const res = await apiClient.put(
      `/skinprofile/skin-answers-add`,
      payload
    );
    return res.data;
  }

};
