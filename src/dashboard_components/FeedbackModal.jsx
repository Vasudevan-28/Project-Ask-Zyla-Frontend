

import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

import { getAuth, onIdTokenChanged } from "firebase/auth";

export default function FeedbackModal({ onClose, onSubmit }) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  const [selectedEmotion, setSelectedEmotion] = useState(3);

  
  
   const [idToken, setIdToken] = useState("")
       
        const auth = getAuth();
           useEffect(() => {
             const unsub = onIdTokenChanged(auth, async (u) => {
             
               setIdToken(await u.getIdToken(false))
             });
         
             return () => unsub();
           }, [auth]);

  const emotions = [
    { value: 1, label: "Very Sad", emoji: "😢" },
    { value: 2, label: "Sad", emoji: "😞" },
    { value: 3, label: "Neutral", emoji: "😐" },
    { value: 4, label: "Happy", emoji: "😊" },
    { value: 5, label: "Very Happy", emoji: "😄" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    onSubmit({
      emotion: selectedEmotion,
      emotionLabel: emotions.find((e) => e.value === selectedEmotion)?.label,
    });
  };

  return (
    <div className="fixed inset-0 z-250002 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-white/90 dark:text-purple-900 rounded-lg w-96 max-w-[90vw] p-6 shadow-xl">
        <div className="font-semibold mb-4 text-lg">How was your experience?</div>
        {/* Emotion buttons */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            {emotions.map((emotion) => (
              <button
                key={emotion.value}
                onClick={() => setSelectedEmotion(emotion.value)}
                type="button"
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  selectedEmotion === emotion.value
                    ? "bg-purple-200 scale-110 border border-purple-500"
                    : "hover:opacity-70"
                }`}
              >
                <span className="text-2xl">{emotion.emoji}</span>
                <span
                  className={`text-xs font-semibold ${
                    selectedEmotion === emotion.value
                      ? "text-purple-900"
                      : "text-gray-400"
                  }`}
                >
                  {emotion.label}
                </span>
              </button>
            ))}
          </div>
          {/* Slider */}
          <div className="relative mt-4">
            <input
              type="range"
              min="1"
              max="5"
              value={selectedEmotion}
              onChange={(e) => setSelectedEmotion(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-purple-200"
              style={{
                background: (() => {
                  const percentage = ((selectedEmotion - 1) / 4) * 100;
                  return `linear-gradient(to right, #a78bfa 0%, #a78bfa ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
                })(),
              }}
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded font-semibold bg-linear-to-r from-purple-500 to-purple-700 text-white hover:opacity-90 transition-all"
            type="button"
          >
            Submit & Logout
          </button>
        </div>
      </div>
    </div>
  );
}