import { useContext } from "react";
// import ProductCard from "./ProductCard";
import ChatMessage from "./ChatMessage";

import ZylaChatPic from "../assets/Zyla-no-bg.png";

import Thinking from "../gifs/thinking-zyla.gif";

import { ThemeContext } from "../contexts/ThemeContext";

import { TbMenu3 } from "react-icons/tb";

export default function Chatbot({
  scrollerRef,
  messages,
  loading,
  ttsSupported,
  speakingId,
  handleSpeak,
  input,
  setInput,
  handleSubmit,
  speechSupported,
  isListening,
  toggleListening,
  idToken,
  onOpenConversations = () => {},
}) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  return (
    <div className="flex-1 flex flex-col p-1 custom-scrollbar max-h-[480px]  md:min-h-[600px]">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">
        <div
          className={`flex-1 flex flex-col justify-between rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden relative
                ${isLight ? " bg-[#B9A3C7]" : "bg-white/5"}
              `}
        >
          <div
            className={`w-full flex items-center h-16  rounded-b-lg z-10
                ${isLight ? " bg-white" : "bg-white/10"}
                `}
          >
            {/* Mobile menu button */}
            <button
              onClick={onOpenConversations}
              className="md:hidden ml-3 p-2 rounded-full  text-slate-800 bg-white/10 hover:bg-white/20"
              aria-label="Open conversations"
              type="button"
              title="Open conversations"
            >
              <TbMenu3 />
            </button>

            <img src={ZylaChatPic} className="ml-2 md:ml-4 mr-1 w-12 h-12 rounded-md  border-white/30 object-cover" alt="Zyla" />
            <h1
              className={`text-2xl font-bold drop-shadow-lg bg-clip-text text-transparent
                            ${isLight ? " bg-[#1d0e2d]" : "bg-white/90"}`}
            >
              Zyla
            </h1>
          </div>
          <div
            ref={scrollerRef}
            className="flex-1 overflow-y-auto max-h-[calc(100vh-210px)] p-4  flex flex-col gap-4 min-h-0 relative z-10 scrollbar-hide"
            // style={{ maxHeight: "calc(100vh - 210px)" }}
          >
            {messages.map((m, idx) => {
              const lastAssistantMessage = [...messages].reverse().find((msg) => msg.role === "assistant");

              const isLastAssistant = m === lastAssistantMessage;

              return (
                <div key={idx} className="flex flex-col gap-2">
                  <ChatMessage
                    role={m.role}
                    text={m.text}
                    canSpeak={ttsSupported}
                    isSpeaking={speakingId === idx}
                    onSpeak={() => handleSpeak(m.text, idx)}
                    showImage={isLastAssistant}
                  />
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-white/90 drop-shadow-sm">
                <img src={`${Thinking}`} className="w-26 h-26" alt="Assistant" />
                <span className="animate-pulse text-lg font-semibold tracking-wider">Thinking…</span>
              </div>
            )}
          </div>

          <div className="p-2  bg-transparent  relative z-10">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 flex justify-end relative">
                <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm"></div>
                <input
                  className={`w-full border text-sm focus:outline-none focus:ring-0 border-white/25 rounded-xl px-4 py-3 pr-14 relative z-10
                        ${isLight ? "bg-[#E9D9E3] placeholder-gray-600 text-slate-900 " : "bg-white/10 placeholder-gray-400 text-slate-50"}`}
                  placeholder="Ask me anything about skincare…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={loading}
                    className={`absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-300 z-20 ${
                      isListening
                        ? "bg-red-500/60 text-white  animate-pulse shadow-lg border border-red-400/30"
                        : `${isLight ? "bg-[#B9A3C7] text-white hover:bg-white/30 hover:text-[#B9A3C7]" : "bg-white/10 text-slate-100 hover:bg-slate-100 hover:text-slate-700"} border-white/30 shadow-lg hover:shadow-xl`
                    } hover:scale-110`}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" rx="1" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 hover:scale-105 hover:bg-white/25 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-[#ab4da8] to-[#CA88B1] rounded-xl" />
                <span className="relative z-10 text-sm">Send</span>
              </button>
            </form>
            {isListening && (
              <div className="text-center mt-2 text-xs text-white/80 animate-pulse drop-shadow-sm">
                🎤 Listening... Speak now
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}