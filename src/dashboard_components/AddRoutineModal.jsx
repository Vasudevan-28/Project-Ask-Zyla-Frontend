import React, { useState } from "react";
import SuccessModal from "./SuccessModal";

export default function AddRoutineModal({ onClose, onAdd }){
  const [period, setPeriod] = useState("morning");
  const [showSuccess, setShowSuccess] = useState(false);

  function handleAdd(){
    onAdd(period);
    setShowSuccess(true);
    setTimeout(()=> {
      setShowSuccess(false);
      onClose();
    }, 900);
  }

  return (
    <>
      <div className="modal-backdrop">
        <div className="glass p-4 rounded w-80">
          <div className="font-semibold mb-2">Add Routine</div>
          <div className="space-y-2">
            <label className="block text-sm">When</label>
            <select value={period} onChange={(e)=>setPeriod(e.target.value)} className="w-full p-2 rounded border">
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-2 rounded">Cancel</button>
            <button onClick={handleAdd} className="px-3 py-2 glass rounded">Add</button>
          </div>
        </div>
      </div>

      {showSuccess && <SuccessModal message="Successfully added routine!" buttonText="Back to Home" onClose={()=>{}} />}
    </>
  );
}
