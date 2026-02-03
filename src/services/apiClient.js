import axios from "axios";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});

export const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});

export const publicClientWithCreds = axios.create({
  baseURL: import.meta.env.VITE_API_URL_TRIAL,
  withCredentials: true, 
  timeout: 30000,
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// apiClient.interceptors.response.use(
//   (r) => r,
//   async (error) => {
//     if (error.response?.status === 401) {
//       await signOut(auth);
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );
