import { auth } from "./firebase";

export async function apiFetch(url, options = {}) {
  const headers = {
    ...(options.headers || {})
  };

  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(); 
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  return res;
}
