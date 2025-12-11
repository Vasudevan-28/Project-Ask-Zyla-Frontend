// const API_URL = "http://localhost:8000";

const API_URL = import.meta.env.VITE_API_URL

export const AuthService = {
  /**
   * Get the stored auth token from localStorage
   */
  getToken() {
    return localStorage.getItem("askzyla_token");
  },

  /**
   * Get the stored user UID from localStorage
   */
  getUid() {
    return localStorage.getItem("askzyla_uid");
  },

  /**
   * Store auth credentials
   */
  setAuth(token, uid) {
    localStorage.setItem("askzyla_token", token);
    localStorage.setItem("askzyla_uid", uid);
  },

  /**
   * Clear auth credentials
   */
  clearAuth() {
    localStorage.removeItem("askzyla_token");
    localStorage.removeItem("askzyla_uid");
  },

  /**
   * Register a new user (generates a new UID)
   */
  async register() {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to register");
    const data = await res.json();
    this.setAuth(data.access_token, data.uid);
    return data;
  },

  /**
   * Login with an existing UID
   */
  async login(uid) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });
    if (!res.ok) throw new Error("Failed to login");
    const data = await res.json();
    this.setAuth(data.access_token, data.uid);
    return data;
  },

  /**
   * Initialize auth - register if no UID exists, otherwise login
   */
  async initialize() {
    const existingUid = this.getUid();
    const existingToken = this.getToken();

    // If we have both, assume we're authenticated
    if (existingUid && existingToken) {
      return { uid: existingUid, token: existingToken };
    }

    // If we have a UID but no token, try to login
    if (existingUid) {
      try {
        return await this.login(existingUid);
      } catch (e) {
        console.error("Failed to login with existing UID, registering new user", e);
      }
    }

    // Otherwise, register a new user
    return await this.register();
  },
};
