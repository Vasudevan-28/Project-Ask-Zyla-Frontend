import { apiClient } from "./apiClient";

const TODO_API = `/todoCall`;
const PRO_API = `/prods`;

export const ApiService = {

  async getProducts() {
    const { data: products } = await apiClient.get(`${PRO_API}/products`);

    const routines = { morning: [], afternoon: [], evening: [] };
    products.forEach((p) => {
      if (routines[p.routine]) {
        routines[p.routine].push({ ...p, id: p._id });
      }
    });
    Object.keys(routines).forEach((k) => {
      routines[k].sort((a, b) => a.slot - b.slot);
    });
    return routines;
  },

  async addProduct(product) {
    const { data: p } = await apiClient.post(`${PRO_API}/products`, product);
    return { ...p, id: p._id };
  },

  async deleteProduct(id) {
    await apiClient.delete(`${PRO_API}/products/${id}`);
    return true;
  },

  async getTodos(date) {
    const { data: todos } = await apiClient.get(`${TODO_API}/todos`, {
      params: { date },
    });
    return todos.map((t) => ({ ...t, id: t._id }));
  },

  async addTodo(todo) {
    const { data: t } = await apiClient.post(`${TODO_API}/todos`, todo);
    return { ...t, id: t._id };
  },

  async updateTodo(id, checked) {
    const { data: t } = await apiClient.patch(`${TODO_API}/todos/${id}`, {
      checked,
    });
    return { ...t, id: t._id };
  },

  async deleteTodo(id) {
    await apiClient.delete(`${TODO_API}/todos/${id}`);
    return true;
  },

  async getStreak() {
    const { data } = await apiClient.get(`${TODO_API}/streak`);
    return data.streak;
  },

  async getCompletedDates() {
    const { data } = await apiClient.get(`${TODO_API}/completed-dates`);
    return data;
  },

  // Notifications
  async getNotifications() {
    const { data } = await apiClient.get(`/notifications/getAll`);
    return data;
  },

  async markNotificationRead(id) {
    const { data } = await apiClient.patch(`/notifications/${id}/read`);
    return data;
  },

  async markAllNotificationsRead() {
    const { data } = await apiClient.patch(`/notifications/read-all`);
    return data;
  },
};
