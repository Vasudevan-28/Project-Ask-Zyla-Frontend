
const CHAT_API_URL = "http://localhost:8484/chatApp";


function authHeaders(token, hasBody = false) {
  const headers = {};

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (hasBody) headers["Content-Type"] = "application/json";

  return headers;
}


export const ChatBotApiService = {

   async loadConversations(token) {
       const res = await fetch(`${CHAT_API_URL}/conversations`, {
        headers: authHeaders(token),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data
   }, 

   async createNewConvo(token) {
       const res = await fetch(`${CHAT_API_URL}/conversations`, {
        method: "POST",
          headers: authHeaders(token, true),
        body: JSON.stringify({ title: "New chat"}),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      return data
   },

   async openConversation(token, id) {
      const res = await fetch(`${CHAT_API_URL}/conversations/${id}/messages`, {
        
        headers: authHeaders(token)
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      
      return data
   },

   async sendMessage(token, currentConversationId, userText) {
      const res = await fetch(`${CHAT_API_URL}/chatgraph`, {
        method: "POST",
        headers: authHeaders(token, true),
        body: JSON.stringify({
          conversation_id: currentConversationId,
          message: userText,
        }),
      });

      if (!res.ok) {
        throw new Error((await res.text()) || `HTTP ${res.status}`);
      }

      const data = await res.json();

      return data
   },

   
async  renameConversation(token, id, title) {
  return fetch(`${CHAT_API_URL}/conversations/${id}/rename`, {
    method: "POST",
    // headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    headers : authHeaders(token, true),
    body: JSON.stringify({ title }),
  });
},

async  deleteConversation(token, id) {
  return fetch(`${CHAT_API_URL}/conversations/${id}`, {
    // headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    headers : authHeaders(token, true),
    method: "DELETE",
  });
},

async  archiveConversation(token, id) {
  return fetch(`${CHAT_API_URL}/conversations/${id}/archive`, {
    method: "POST",
    // headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    headers : authHeaders(token, true),
  });
}


};