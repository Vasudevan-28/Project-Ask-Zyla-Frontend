import { publicClientWithCreds } from "./apiClient";

export const TrialChatApiService = {

  async fetchTrial() {
    const res = await publicClientWithCreds.post(`/trialUser`);
    return res.data; 
  },

  async sendTrialMessage(conversationId, userText) {
    const res = await publicClientWithCreds.post(`/`, {
      conversation_id: conversationId,
      message: userText,
    });

    return res.data; 
  },

};
