import { apiClient } from "./apiClient";

export const ChatBotApiService = {

  async loadConversations() {
    const { data } = await apiClient.get("/chatApp/conversations");
    return data;
  },

  async createNewConvo() {
    const { data } = await apiClient.post("/chatApp/conversations", {
      title: "New chat"
    });
    return data;
  },

  async openConversation(id) {
    const { data } = await apiClient.get(`/chatApp/conversations/${id}/messages`);
    return data;
  },

  async sendMessage(currentConversationId, userText) {
    const { data } = await apiClient.post("/chatApp/chatbot/chatgraph", {
      conversation_id: currentConversationId,
      message: userText,
    });
    return data;
  },

  async renameConversation(id, title) {
    const { data } = await apiClient.post(`/chatApp/conversations/${id}/rename`, {
      title
    });
    return data;
  },

  async deleteConversation(id) {
    await apiClient.delete(`/chatApp/conversations/${id}`);
  },

  async archiveConversation(id) {
    await apiClient.post(`/chatApp/conversations/${id}/archive`);
  }

};
