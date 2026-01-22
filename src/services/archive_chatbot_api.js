import { apiClient } from "./apiClient";

export const ArchiveChatBotApiService = {

  async loadArchivedConversations() {
    const { data } = await apiClient.get(`/chatApp/conversations/archived`);
    return data;
  },

  async createArchNewConvo() {
    const { data } = await apiClient.post(`/chatApp/archive/conversations`, {
      title: "New chat"
    });
    return data;
  },

  async openArchConversation(id) {
    const { data } = await apiClient.get(`/chatApp/conversations/${id}/messages`);
    return data;
  },

  async sendArchMessage(currentConversationId, userText) {
    const { data } = await apiClient.post(`/chatApp/chatbot/chatgraph`, {
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

  async unArchiveConversation(id) {
    await apiClient.post(`/chatApp/conversations/${id}/unArchive`);
  }

};
