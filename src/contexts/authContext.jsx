import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { apiClient } from "../services/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setAuthUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        setAuthUser(user);

        const res = await apiClient.get("/auth/me");

        setProfile(res.data); 
        setLoading(false);
      } catch (err) {
        console.error("AuthContext error:", err);

        setAuthUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const refreshProfile = async () => {
    if (!auth.currentUser) return;
    const res = await apiClient.get("/auth/me");
    setProfile(res.data);
  };

  return (
    <AuthContext.Provider value={{ authUser, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
