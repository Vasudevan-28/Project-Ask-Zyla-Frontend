
import NormPurf from "../gifs/norm-purf.gif"


import { useState, useContext } from "react"
import { ThemeContext } from "../contexts/ThemeContext";


export default function ChatMessage({ role, text, onSpeak, canSpeak, isSpeaking, showImage }) {
      const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  


  const isUser = role === "user";


  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-center gap-2 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>

        {!isUser && showImage && (
  <div className="relative w-30 h-30 shrink-0">
    <div className="absolute bottom-5 left-8 w-14 h-14 bg-black"></div>
    <img
      src={NormPurf}
      className="absolute bottom-0 w-full h-full object-contain"
      alt="Assistant"
    />
  </div>
)}

        <div
          className={`rounded-2xl px-4 py-2 text-sm ${
            isUser
              ? ` ${isLight ? "text-black bg-[#E9D9E3]" : "bg-white/10 text-white/90"}  shadow-lg rounded-br-sm`
              : `${isLight ? "text-gray-700 bg-[#E9D9E3]" : "bg-white/10 text-gray-200"} shadow-lg rounded-bl-sm`
          }`}
        >
          {text}
        </div>

        {!isUser && canSpeak && (
          <button
            type="button"
            onClick={onSpeak}
            className="shrink-0 p-1.5 tracking-tighter rounded-full backdrop-blur-sm hover:bg-white/40 transition border border-purple-200 text-purple-700 text-sm cursor-pointer"
            title={isSpeaking ? "Stop speaking" : "Read this message"}
          >
            {isSpeaking ? "■" : "၊၊||၊"}
          </button>
        )}
      </div>
    </div>
  );
}
