import React from "react";

export default function ConflictModal({ existing, onCancel, onShift }) {
  return (
    <div className="fixed inset-0 z-250000 flex text-black items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-80 p-4 shadow-lg">
        <div className="font-semibold mb-2 text-lg">Slot conflict</div>
        <div className="text-sm mb-3">
          Slot {existing.slot} already has <strong>{existing.name}</strong>. Do you want to shift existing items down and add this product at slot {existing.slot}?
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold">Cancel</button>
          <button onClick={onShift} className="px-3 py-1 rounded bg-purple-700 text-white hover:bg-purple-600 font-semibold">Shift & Add</button>
        </div>
      </div>
    </div>
  );
}