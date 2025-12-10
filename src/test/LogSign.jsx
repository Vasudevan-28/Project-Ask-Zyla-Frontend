import React, { useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

/*
  Simple demo app:
  - Sign in with Google
  - Get ID token and call backend /me/profile
  - Show profile data returned by backend
*/

export default function LogSign() {
  const [user, setUser] = useState(null);
  const [backendProfile, setBackendProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return auth.onAuthStateChanged((u) => {
      setUser(u);
      setBackendProfile(null);
      setError(null);
    });
  }, []);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError("Sign in failed: " + e.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setBackendProfile(null);
  };

  const callBackend = async () => {
    if (!user) {
      setError("Not signed in");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const idToken = await user.getIdToken(false);
      const res = await fetch("http://localhost:8088" + "/me/profile", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`${res.status} ${res.statusText} - ${txt}`);
      }
      const data = await res.json();
      setBackendProfile(data);
    } catch (e) {
      console.error(e);
      setError("Backend call failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white shadow rounded p-6">
        <h1 className="text-2xl font-semibold mb-4">Firebase Auth Demo</h1>

        {!user ? (
          <div>
            <p className="mb-4">Not signed in</p>
            <button
              onClick={handleSignIn}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2">Signed in as <strong>{user.email}</strong></p>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={callBackend}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Calling..." : "Call protected backend (/me/profile)"}
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 text-red-600">
            {error}
          </div>
        )}

        {backendProfile && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-medium mb-2">Backend profile:</h2>
            <pre className="text-sm">{JSON.stringify(backendProfile, null, 2)}</pre>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <p>Backend URL is taken from REACT_APP_BACKEND_URL environment variable.</p>
          <p>Ensure the backend is reachable and configured with Firebase service account JSON.</p>
        </div>
      </div>
    </div>
  );
}