import React, { useEffect } from "react";
import Zylal from "../gifs/norm-purf.gif";
import { MdCancel } from "react-icons/md";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-16 md:bottom-6 right-2 md:right-6 z-50 w-80 max-w-sm animate-fade-in-up">
      <div
        className="
          relative
          bg-[#2a2230]/95 backdrop-blur-xl
          text-white p-4 pr-5 rounded-2xl shadow-xl 
          border border-[#5a4a6a]/40
          flex gap-4
        "
      >
        <button
          onClick={onClose}
          className="
            absolute top-2 right-2
            text-gray-300 hover:text-white transition
          "
          
        >
          <MdCancel size={22} />
        </button>

   <div className="h-18  w-18 overflow-hidden rounded-lg shadow-inner">
  <img
    src={Zylal}
    className="h-full w-full object-cover "
    alt="Notification"
  />
</div>


        <div className="flex-1 pr-4">
          <p className="font-semibold text-lg text-purple-200 mb-1">Reminder</p>

          <p className="text-sm leading-relaxed text-gray-200">{message}</p>
        </div>
      </div>
    </div>
  );
}
