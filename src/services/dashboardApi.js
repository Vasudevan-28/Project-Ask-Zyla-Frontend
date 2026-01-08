// const API_URL = "http://localhost:8484";
// const API_URL = "https://project-ask-zyla-devteam.onrender.com"
const API_URL = import.meta.env.VITE_API_URL
const TODO_API = `${API_URL}/todoCall`
const PRO_API = `${API_URL}/prods`

function authHeaders(token) {
  return token
    ? { "Authorization": `Bearer ${token}` }
    : {};
}

export const ApiService = {
  async getProducts(token) {
    const res = await fetch(`${PRO_API}/products`, {
      headers: { ...authHeaders(token) },
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const products = await res.json();
    
    const routines = { morning: [], afternoon: [], evening: [] };
    products.forEach(p => {
      if (routines[p.routine]) {
        routines[p.routine].push({ ...p, id: p._id });
      }
    });
    Object.keys(routines).forEach(k => {
      routines[k].sort((a, b) => a.slot - b.slot);
    });
    return routines;
  },

  async addProduct(product, token) {
    const res = await fetch(`${PRO_API}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token)
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to add product");
    const p = await res.json();
    return { ...p, id: p._id };
  },

  async deleteProduct(id, token) {
    const res = await fetch(`${PRO_API}/products/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders(token) }
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return true;
  },

  async getTodos(date, token) {
    const res = await fetch(`${TODO_API}/todos?date=${date}`, {
      headers: { ...authHeaders(token) }
    });
    if (!res.ok) throw new Error("Failed to fetch todos");
    const todos = await res.json();
    return todos.map(t => ({ ...t, id: t._id }));
  },

  async addTodo(todo, token) {
    const res = await fetch(`${TODO_API}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token)
      },
      body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error("Failed to add todo");
    const t = await res.json();
    return { ...t, id: t._id };
  },

  async updateTodo(id, checked, token) {
    const res = await fetch(`${TODO_API}/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token)
      },
      body: JSON.stringify({ checked }),
    });
    if (!res.ok) throw new Error("Failed to update todo");
    const t = await res.json();
    return { ...t, id: t._id };
  },

  async deleteTodo(id, token) {
    const res = await fetch(`${TODO_API}/todos/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders(token) }
    });
    if (!res.ok) throw new Error("Failed to delete todo");
    return true;
  },

  async getStreak(token) {
    const res = await fetch(`${TODO_API}/streak`, {
      headers: { ...authHeaders(token) }
    });
    if (!res.ok) throw new Error("Failed to fetch streak");
    const data = await res.json();
    return data.streak;
  },

   async getCompletedDates(token) {
    const res = await fetch(`${TODO_API}/completed-dates`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch completed dates");
    return await res.json();
  },

  
  // Notifications
  async getNotifications(token) {
    const res = await fetch(`${API_URL}/notifications/getAll`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return await res.json();
  },

  async markNotificationRead(id, token) {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to mark notification read");
    return await res.json();
  },

  async markAllNotificationsRead(token) {
    const res = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to mark all notifications read");
    return await res.json();
  }

};