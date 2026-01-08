import NormPurf from "../gifs/norm-purf.gif";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";



export default function ChatMessage({ role, text, onSpeak, canSpeak, isSpeaking, showImage }) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const isUser = role === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-center gap-2 max-w-[90%]  md:max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {!isUser && showImage && (
          <div className="hidden md:block relative w-28 h-28 shrink-[0.2]">
            <img src={NormPurf} className="absolute bottom-0 w-full h-full object-contain" alt="Assistant" />
          </div>
        )}

        <div
          className={`rounded-2xl px-3 py-2 text-[12px] md:text-sm ${isUser ? `${isLight ? "text-black bg-[#E9D9E3]" : "bg-white/10 text-white/90"}` : `${isLight ? "text-gray-700 bg-[#E9D9E3]" : "bg-white/10 text-gray-200"}`} shadow-lg ${isUser ? "rounded-br-sm" : "rounded-bl-sm"}`}
          style={{ wordBreak: "break-word" }}
        >
          {text}
        </div>

        {!isUser && canSpeak && (
          <button
            type="button"
            onClick={onSpeak}
            className="shrink-0 p-1.5 tracking-tighter rounded-full backdrop-blur-sm hover:bg-white/40 transition border border-purple-200/30 text-purple-700 text-sm cursor-pointer"
            title={isSpeaking ? "Stop speaking" : "Read this message"}
          >
            {isSpeaking ? "■" : "၊၊||၊"}
          </button>
        )}
      </div>
    </div>
  );
}