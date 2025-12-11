import React, { useState, useContext } from "react";
import ConflictModal from "./ConflictModal";
import SuccessModal from "./SuccessModal";
import { ThemeContext } from "../contexts/ThemeContext";

export default function AddProductModal({ onClose, onAdd, routines = {} }) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const [routine, setRoutine] = useState("morning");
  const [slot, setSlot] = useState(1);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  const [conflict, setConflict] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!name.trim()) {
      setError("Enter product name");
      return;
    }
    const routineProducts = routines[routine] || [];
    const slotNum = Number(slot);
    const existing = routineProducts.find((p) => p.slot === slotNum);
    if (existing) {
      setConflict({ existing, proposed: { routine, slot: slotNum, name, type, desc, reminder_time: reminderTime } });
      return;
    }
    if (routineProducts.length > 0) {
      const maxSlot = Math.max(...routineProducts.map((p) => Number(p.slot)));
      const expectedNextSlot = maxSlot + 1;
      if (slotNum !== expectedNextSlot) {
        setError(`Please set order number correctly. Next available order number is ${expectedNextSlot}.`);
        return;
      }
    } else {
      if (slotNum !== 1) {
        setError("Please set order number correctly. First product must have order number 1.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onAdd({ routine, slot: slotNum, name, type, desc, reminder_time: reminderTime });
      setShowSuccess(true);
    } catch (e) {
      setError("Failed to add routine. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleShiftConfirm() {
    setConflict(null);
    setIsSubmitting(true);
    try {
      await onAdd({ routine, slot: Number(slot), name, type, desc, reminder_time: reminderTime });
      setShowSuccess(true);
    } catch (e) {
      setError("Failed to add routine.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSuccessClose() {
    setShowSuccess(false);
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 z-250000 flex items-center justify-center bg-black/40">
        <div className="bg-white  rounded-lg p-6 w-96 max-w-lg shadow-xl flex flex-col gap-3">
          <div className="font-semibold text-xl mb-1">Add Routine</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">Routine</label>
              <select
                value={routine}
                onChange={(e) => {
                  setRoutine(e.target.value);
                  setError("");
                }}
                className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Order #</label>
              <input
                type="number"
                min="1"
                value={slot}
                onChange={(e) => {
                  setSlot(e.target.value);
                  setError("");
                }}
                className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Type</label>
              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900"
                placeholder="e.g., Moisturizer"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900"
                placeholder="Product name"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={desc}
                onChange={(e) => {
                  const val = e.target.value;
                  const words = val.trim().split(/\s+/).filter(w => w.length > 0);
                  if (words.length <= 50 || val.length < desc.length) {
                     setDesc(val);
                  }
                }}
                className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900"
                rows="2"
              />
              <div className="text-xs text-gray-500 text-right">
                {desc.trim() ? desc.trim().split(/\s+/).filter(w => w.length > 0).length : 0}/50 words
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Reminder Time (Optional)</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900"
              />
            </div>
          </div>
          {error && (
            <div className="mt-2 text-sm rounded p-2 bg-red-100 text-red-700 border border-red-200">
              {error}
            </div>
          )}
          <div className="mt-3 flex justify-end gap-2">
            <button
              className="px-3 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-3 py-2 rounded bg-[#1d0e2d] text-white font-semibold hover:bg-[#1d0e2daf]"
              onClick={handleSubmit}
              type="button"
              disabled={isSubmitting}
            >
              Add Routine
            </button>
          </div>
        </div>
      </div>
      {conflict && <ConflictModal existing={conflict.existing} onCancel={() => setConflict(null)} onShift={handleShiftConfirm} />}
      {showSuccess && <SuccessModal message="Successfully added product!" buttonText="Back to Home" onClose={handleSuccessClose} />}
    </>
  );
}