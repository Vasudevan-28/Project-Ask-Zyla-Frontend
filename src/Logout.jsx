import React, { useState, useEffect } from "react";
import { getAuth, signOut, EmailAuthProvider, reauthenticateWithCredential, deleteUser, onAuthStateChanged } from "firebase/auth";
import { deleteAccountAPI, resetEmailPassword } from "./services/backendAPI"; 
import Toast from "./home_components/Toast";

// import "../styles/Auth.css";

const LogOut = () => {
  const auth = getAuth();
//   const user = auth.currentUser;

  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, [auth]);


  // -----------------------------
  // LOGOUT FUNCTION
  // -----------------------------
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();

      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setError("Logout failed");
    }
  };

  const handleReset = async () => {
            await resetEmailPassword("teslastark03@gmail.com", "ChangingSleep_02");
  }

  // -----------------------------
  // DELETE ACCOUNT
  // -----------------------------
  const handleDeleteAccount = async () => {
    setError("");
    setSuccess("");

    if (!password) {
      setError("Please enter your password to confirm.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);

      // Step 1: Re-authenticate
      await reauthenticateWithCredential(user, credential);

      // Step 2: Delete Firebase Auth user
      await deleteUser(user);

      // Step 3: Delete from MongoDB
      await deleteAccountAPI(user.email);

      // Step 4: Redirect
      localStorage.clear();
      window.location.href = "/signup";
    } catch (err) {
      console.error("Delete error:", err);
      setError("Incorrect Password or Authentication Failed.");
    }
  };

  return (
    <div className="items-center flex flex-col justify-center p-10">
      <h2>Dashboard</h2>
      <p>Welcome! Choose an option below:</p>
      <h2 className="bg-black text-white p-4 font-medium rounded-lg mt-4" >{user?.email}</h2>
      <button className="rounded-lg mt-4 bg-blue-400 p-3" onClick={handleLogout}>
        Logout
      </button>

      <button className="rounded-lg mt-4 bg-red-400 p-3" onClick={() => setShowDeleteBox(true)}>
        Delete Account
      </button>
       <button className="rounded-lg mt-4 bg-green-400 p-3" onClick={handleReset}>
                Reset Password
              </button>

          <Toast 
            message={"Sleeeeeep"} 
          onClose={() => {}} 
          />

      {/* Delete Popup */}
      {showDeleteBox && (
        <div className="delete-popup">
          <div className="popup-content">
            <h3>Delete Account</h3>
            <p>This action cannot be undone!</p>

            <input
              type="password"
              placeholder="Enter your password to confirm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <div className="popup-buttons">
              <button className="btn-confirm-delete" onClick={handleDeleteAccount}>
                Yes, Delete
              </button>

              <button className="btn-cancel" onClick={() => setShowDeleteBox(false)}>
                Cancel
              </button>
             
            </div>
          </div>
        
        </div>
      )}
    </div>
  );
};

export default LogOut;
