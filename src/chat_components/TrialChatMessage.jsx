import Thinking from "../gifs/thinking-zyla.gif";
import NormPurf from "../gifs/norm-purf.gif";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function TrialChatMessage({
  role,
  text,
  onSpeak,
  canSpeak,
  isSpeaking,
  showImage,
  bgTheme,
}) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const isUser = role === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-center gap-2 max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
          {!isUser && showImage && (
                 <div className="hidden md:block relative w-28 h-28 shrink-[0.2]">
                   <img src={NormPurf} className="absolute bottom-0 w-full h-full object-contain" alt="Assistant" />
                 </div>
               )}

        <div
          className={`rounded-2xl px-4 py-2 text-sm ${
            isUser
              ? ` ${
                  bgTheme === "light"
                    ? "text-black bg-[#E9D9E3]"
                    : "bg-white/10 text-white/90"
                }  shadow-lg rounded-br-sm`
              : `${
                  bgTheme === "light"
                    ? "text-gray-700 bg-[#E9D9E3]"
                    : "bg-white/10 text-gray-200"
                } shadow-lg rounded-bl-sm`
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
