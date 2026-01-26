import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reauthAndDeleteFirebaseUser } from "../services/authservice";

const DeleteAccountModal = ({
  open,
  onClose,
  isLight
}) => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleDeleteAccount = async () => {
    if (loading) return;

    setError("");
    setSuccess("");

    if (!password) {
      setError("Please enter your password to confirm.");
      return;
    }

    setLoading(true);

    try {
      await reauthAndDeleteFirebaseUser(password);
      setSuccess("Account deleted successfully");

      localStorage.clear();
      setTimeout(() => navigate("/signup"), 1000);
    } catch (err) {
      console.error(err);
      setError("Incorrect password or deletion failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div
        className="absolute inset-0 bg-black/30"
        onClick={!loading ? onClose : undefined}
      />

      <div
        className={`relative w-full max-w-md rounded-xl p-6 shadow-xl space-y-4 backdrop-blur-md
          ${isLight ? "bg-black/50 text-slate-100" : "bg-white/50 text-slate-800"}
        `}
      >
        <h3 className="text-xl font-semibold text-center">
          Delete Account
        </h3>

        <p
          className={`text-sm text-center
            ${isLight ? "text-slate-200" : "text-slate-700"}
          `}
        >
          Enter your password to delete your account
        </p>

        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Enter your password to confirm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none disabled:opacity-60"
          />

          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.477 10.477A3 3 0 0113.5 13.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.53 6.53C4.398 8.088 2.917 10.356 2.458 12 c1.273 4.057 5.064 7 9.542 7 1.83 0 3.558-.41 5.064-1.14M17.47 17.47 C19.602 15.912 21.083 13.644 21.542 12 20.269 7.943 16.478 5 12 5 c-.96 0-1.89.14-2.771.402" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5 c4.478 0 8.269 2.943 9.542 7 -1.273 4.057 -5.064 7 -9.542 7 -4.477 0 -8.268 -2.943 -9.542 -7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </span>
        </div>

        {error && (
          <p className="text-sm text-center text-red-500">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-center text-green-600">
            {success}
          </p>
        )}

        <div className="flex justify-center gap-8 pt-2">
          
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className={`px-3 py-1 cursor-pointer rounded-lg font-medium text-white transition
              ${
                loading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }
            `}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </span>
            ) : (
              "Yes, Delete"
            )}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1 cursor-pointer rounded-lg font-medium text-white bg-green-400 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
