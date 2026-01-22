import React, { useState, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function FeedbackModal({ onClose, onSubmit }) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  const [selectedEmotion, setSelectedEmotion] = useState(3);

  const emotions = [
    { value: 1, label: "Very Sad", emoji: "😢" },
    { value: 2, label: "Sad", emoji: "😞" },
    { value: 3, label: "Neutral", emoji: "😐" },
    { value: 4, label: "Happy", emoji: "😊" },
    { value: 5, label: "Very Happy", emoji: "😄" },
  ];

  const handleSubmit = () => {
    onSubmit({
      emotion: selectedEmotion,
      emotionLabel: emotions.find(e => e.value === selectedEmotion)?.label,
    });
  };

  const darkModeStyles = !isLight ? {
    background: "rgba(255, 255, 255, 0.95)",
    border: "1px solid rgba(29, 14, 45, 0.15)",
    color: "var(--dark-purple)"
  } : {};

  const buttonStyles = !isLight ? {
    background: "rgba(255, 255, 255, 0.9)",
    color: "var(--dark-purple)",
    border: "1px solid rgba(29, 14, 45, 0.2)"
  } : {};

  return (
    <div className="modal-backdrop" style={{ zIndex: 250002 }}>
      <div 
        className="glass p-6 rounded-lg w-96 max-w-[90vw]"
        style={darkModeStyles}
      >
        <div className="font-semibold mb-4 text-lg" style={darkModeStyles}>
          How was your experience?
        </div>

        {/* Emotion Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            {emotions.map((emotion) => (
              <button
                key={emotion.value}
                onClick={() => setSelectedEmotion(emotion.value)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  selectedEmotion === emotion.value
                    ? isLight
                      ? "bg-purple-100 scale-110"
                      : "bg-purple-500/30 scale-110"
                    : "hover:opacity-70"
                }`}
                type="button"
                style={{
                  background: selectedEmotion === emotion.value
                    ? isLight
                      ? "rgba(186, 136, 224, 0.2)"
                      : "rgba(139, 92, 246, 0.3)"
                    : "transparent",
                }}
              >
                <span style={{ fontSize: "24px" }}>{emotion.emoji}</span>
                <span 
                  className="text-xs font-semibold"
                  style={{ 
                    color: selectedEmotion === emotion.value 
                      ? "var(--dark-purple)" 
                      : (isLight ? "rgba(28,13,37,0.6)" : "rgba(28,13,37,0.6)")
                  }}
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
              className="feedback-slider w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: (() => {
                  const percentage = ((selectedEmotion - 1) / 4) * 100;
                  const purple = isLight ? "#c792ff" : "#8b5cf6";
                  const gray = isLight ? "#e0e0e0" : "#4a4a4a";
                  return `linear-gradient(to right, ${purple} 0%, ${purple} ${percentage}%, ${gray} ${percentage}%, ${gray} 100%)`;
                })(),
                outline: "none",
              }}
            />
            <style>{`
              .feedback-slider::-webkit-slider-thumb {
                appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: ${isLight ? "#8b5cf6" : "#8b5cf6"};
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(139, 92, 246, 0.4);
                border: 2px solid white;
              }
              .feedback-slider::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: ${isLight ? "#8b5cf6" : "#8b5cf6"};
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(139, 92, 246, 0.4);
              }
            `}</style>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded font-semibold transition-all hover:opacity-80"
            style={buttonStyles}
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded font-semibold transition-all hover:opacity-90"
            style={{
              ...buttonStyles,
              background: isLight 
                ? "linear-gradient(135deg, #8f3ffb, #6f27d6)"
                : "linear-gradient(135deg, #8f3ffb, #6f27d6)",
              color: "#ffffff",
              border: "none",
            }}
            type="button"
          >
            Submit & Logout
          </button>
        </div>
      </div>
    </div>
  );
}

