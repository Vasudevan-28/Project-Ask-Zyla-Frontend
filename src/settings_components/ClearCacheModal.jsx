import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCacheAPI } from "../services/backendAPI";

const ClearCacheModal = ({
  open,
  onClose,
  isLight,
}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleClearAndCache = async () => {
    if (loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await clearCacheAPI();
      setSuccess("Cache cleared successfully");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Clear Cache error:", err);
      setError("Can't connect to backend");
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
          Clear Cache
        </h3>

        <p
          className={`text-sm text-center
            ${isLight ? "text-slate-200" : "text-slate-700"}
          `}
        >
          Are you sure you want to clear all the data?
        </p>

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
            onClick={handleClearAndCache}
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
                Clearing...
              </span>
            ) : (
              "Yes, Clear"
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

export default ClearCacheModal;
