import ChatMessage from "./TrialChatMessage";

// import Thinking from "../../gifs/thinking-zyla.gif";
import Thinking from "../gifs/thinking-zyla.gif";

export default function TrialChatbot({scrollerRef, messages, loading, ttsSupported, speakingId, handleSpeak, input, setInput, handleSubmit, speechSupported, isListening, toggleListening, idToken, bgTheme}) {
    return (
         <div className="flex-1 flex flex-col p-1 custom-scrollbar min-h-[580px] ">
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0   ">
            <div className={`flex-1 flex flex-col  justify-between rounded-2xl  backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden relative
               ${ bgTheme == "light" ? " bg-[#B9A3C7]" : "bg-white/5"}
              `}>
              <div className={`w-full flex items-center h-16 gap-2 rounded-b-lg  z-10
                  ${ bgTheme == "light" ? " bg-white" : "bg-white/10"}
                `}>
                <img
                  src="src/assets/Zyla-no-bg.png"
                  className="ml-4 w-12 h-12 rounded-full  border-white/30 object-cover  "
                  alt=""
                />
                <h1
                  className="text-2xl font-bold drop-shadow-lg
                              bg-linear-to-tl from-purple-400 via-purple-700 to-pink-500
                              bg-clip-text text-transparent"
                >
                  Zyla
                </h1>
              </div>
              <div
                ref={scrollerRef}
                className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0 relative z-10 scrollbar-hide "
                style={{ maxHeight: "calc(100vh - 210px)" }}
              >
             
                {messages.map((m, idx) => {
                  const lastAssistantMessage = [...messages]
                    .reverse()
                    .find((msg) => msg.role === "assistant");

                  const isLastAssistant = m === lastAssistantMessage;

                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <ChatMessage
                        role={m.role}
                        text={m.text}
                        hits={m.hits}
                        canSpeak={ttsSupported}
                        isSpeaking={speakingId === idx}
                        onSpeak={() => handleSpeak(m.text, idx)}
                        showImage={isLastAssistant}
                        bgTheme = {bgTheme}
                        
                      />

                      {m.role === "assistant" && m.hits?.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-12">
                          {m.hits.map((h, i) => (
                            <div
                              key={`${idx}-${i}`}
                              className="bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 p-3 shadow-lg hover:shadow-xl transition-all duration-300"
                            >

                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-center gap-2 text-white/90 drop-shadow-sm">
                    {/* <div className="rounded-full h-6 w-6 border-b-2 border-white/60"></div> */}
                    {/* <ZylaGif /> */}
                    <img
                      // src="src/assets/Zyla-no-bg.png"
                      src={`${Thinking}`}
                      className="w-26 h-26"
                      alt="Assistant"
                    />
                    <span className="animate-pulse text-lg font-semibold tracking-wider">
                      Thinking…
                    </span>
                  </div>
                )}
              </div>

              <div className="p-2  bg-transparent  relative z-10">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="flex-1 flex justify-end relative">
                    <div className="absolute  inset-0 bg-white/10 rounded-xl blur-sm"></div>
                  
                      <input
                      className={`w-full border  text-sm focus:outline-none focus:ring-0   rounded-xl px-4 py-3   pr-14 relative z-10
                         ${ bgTheme == "light" ? "bg-[#E9D9E3] placeholder-gray-600 text-slate-900 border-purple-700/40 " : "bg-white/10 placeholder-gray-400 text-slate-50"}
                        `}
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
                            : "bg-[#B9A3C7] text-white hover:bg-white/30 hover:text-[#B9A3C7] border-white/30 shadow-lg hover:shadow-xl"
                        } hover:scale-110`}
                        title={
                          isListening ? "Stop listening" : "Start voice input"
                        }
                      >
                        {isListening ? (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <rect x="6" y="6" width="12" height="12" rx="1" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                    className="px-6 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white 
                  font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 hover:scale-105 hover:bg-white/25 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-purple-700 rounded-xl"></div>
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
    )
}