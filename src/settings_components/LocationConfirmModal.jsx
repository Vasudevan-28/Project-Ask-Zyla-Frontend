import React from "react";

const LocationConfirmModal = ({
  open,
  location,
  onConfirm,
  onCancel,
  isLight,
  isLoading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={!isLoading ? onCancel : undefined}
      />

      <div
        className={`relative w-full max-w-md rounded-xl p-6 shadow-xl space-y-4 backdrop-blur-md
          ${isLight ? "bg-black/50 text-slate-100" : "bg-white/50 text-slate-800"}
        `}
        role="dialog"
        aria-labelledby="loc-confirm-title"
      >
        <h3
          id="loc-confirm-title"
          className="text-xl font-semibold text-center"
        >
          Confirm Location
        </h3>

        <div
          className={`text-sm text-center space-y-1
            ${isLight ? "text-slate-200" : "text-slate-700"}
          `}
        >
          <div>
            <strong>City:</strong> {location?.city || "N/A"}
          </div>
          <div>
            <strong>State:</strong> {location?.state || "N/A"}
          </div>
        </div>

        <div className="flex justify-center gap-8 pt-2">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-3 py-1 cursor-pointer rounded-lg font-medium text-white transition
              ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </span>
            ) : (
              "Update"
            )}
          </button>

          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-3 py-1 rounded-lg cursor-pointer font-medium text-white bg-green-400 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationConfirmModal;
