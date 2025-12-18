
// const TRIAL_CHAT_ENDPOINT = "http://localhost:8484/chatApp/trial/chat";

const TRIAL_CHAT_ENDPOINT = import.meta.env.VITE_API_URL_TRIAL


function authHeaders(token, hasBody = false) {
  const headers = {};

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (hasBody) headers["Content-Type"] = "application/json";

  return headers;
}


export const TrialChatApiService = {
    async fetchTrial() {
         const res = await fetch(`${TRIAL_CHAT_ENDPOINT}/trialUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      return res
    },

    async sendTrialMessage(conversationId, userText) {
             const res = await fetch(TRIAL_CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          conversation_id: conversationId, 
          message: userText,
        }),
      });
      
      return res
    },


};