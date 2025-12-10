import React, { useEffect, useRef, useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
// import Favourites from "./Favourites";

function ChatMessage({ role, text, onSpeak, canSpeak, isSpeaking }) {
  const isUser = role === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-center gap-2 max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-2  ${
            isUser
              ? "bg-purple-500 text-white rounded-br-sm"
              : "bg-[rgba(233,217,227,1)] text-gray-900 border border-gray-200 rounded-bl-sm"
          }`}
        >
          {text}
        </div>

        {!isUser && canSpeak && (
          <button
            type="button"
            onClick={onSpeak}
            className="shrink-0 p-1.5 tracking-tighter rounded-full bg-white/70 hover:bg-white transition border border-purple-200 text-purple-700 text-sm cursor-pointer"
            title={isSpeaking ? "Stop speaking" : "Read this message"}
          >
            {isSpeaking ? "■" : "၊၊||၊"}
          </button>
        )}
      </div>
    </div>
  );
}

const API_BASE = "http://localhost:7878"
// const AUTH_TOKEN = "Bearer C3OogO3lp-xRo11HKefSrCPck4TCyQ-I";
// const AUTH_TOKEN = "Bearer mM1ylkWwosv5ir9h5j9o1ZLjxzgMQMWT";
const AUTH_TOKEN = "Bearer C3OogO3lp-xRo11HKefSrCPck4TCyQ-I";


function ProductCard({ item }) {
  const [liked, setLiked] = useState(false);
  const md = item?.metadata || {};

  const handleFavs = async (e) =>{
    e.preventDefault()
    const headers = {
      'Content-Type' :'application/json',
      // 'Authorization' : 'Bearer mM1ylkWwosv5ir9h5j9o1ZLjxzgMQMWT'
      'Authorization' : 'Bearer C3OogO3lp-xRo11HKefSrCPck4TCyQ-I'
    }

    // const {name, price, category, url, clean_ingreds} = md

    // const data = {
    //   "product_name" : md.name,
    //   "price" : String(md.price),
    //   "category" : md.category,
    //   "url" : md.url,
    //   "clean_ingreds" : JSON.parse(md.clean_ingreds)
    // }

      let cleanIngreds = md.clean_ingreds;
  
  // If clean_ingreds is a string and looks like a list, replace single quotes with double quotes
  if (typeof cleanIngreds === 'string' && cleanIngreds.startsWith('[') && cleanIngreds.endsWith(']')) {
    cleanIngreds = cleanIngreds.replace(/'/g, '"');  // Replace single quotes with double quotes
  }

  // Now safely parse clean_ingreds as a JSON array
  const cleanIngredsArray = Array.isArray(cleanIngreds) 
    ? cleanIngreds 
    : JSON.parse(cleanIngreds);  // Parse the string into an array if needed

  const data = {
    "product_name": md.name,
    "price": String(md.price),  // Ensure price is a string
    "category": md.category,
    "url": md.url,
    "clean_ingreds": cleanIngredsArray  // Use the valid array
  };

    
    console.log(`Item : ${item}`)
    console.log(`MetaData: ${md.clean_ingreds}`)
    try{
      if (liked){
          const params = new URLSearchParams({
        product_name: md.name,  // Pass only what's needed for deletion  // Add user ID if needed
      });

      // Send DELETE request with the product info in query params
      await axios.delete(`${API_BASE}/me/favorites?${params.toString()}`, { headers });
        alert("Product Removed...")
      } else{
        await axios.post(`${API_BASE}/me/favorites`, data, {headers})
      }
      setLiked(!liked)
    }
    catch (e) {
      console.error(e)
    }
  }

  return (
    <a
      href={md.url || "#"}
      target="_blank"
      rel="noreferrer"
      className="relative block border rounded-2xl p-3 hover:shadow transition bg-[rgba(233,217,227,1)]"
    >
      <button
        // onClick={(e) => {
        //   e.preventDefault();
        //   // setLiked(!liked);
        //   handleFavs()
        // }}
        onClick = {handleFavs}
        className="absolute cursor-pointer top-2 right-2 text-xl"
      >
        {liked ? "💜" : "🤍"}
      </button>

      <div className="text-sm font-semibold text-black">{md.name || "Product"}</div>
      <div className="text-xs text-gray-600 mt-1">Type: {md.category || "-"}</div>

      {md.price !== undefined && (
        <div className="text-xs text-gray-800 mt-1">₹{String(md.price)}</div>
      )}

      {md.clean_ingreds && (
        <div className="text-xs text-gray-500 mt-2 line-clamp-3">
          {String(md.clean_ingreds).slice(0, 220)}
          {String(md.clean_ingreds).length > 220 ? "…" : ""}
        </div>
      )}

      <div className="text-xs mt-2 text-blue-600">Open link ↗</div>
    </a>
  );
}

// function goFavorites(){

// }

export default function ZylaVoice() {
  const navigate = useNavigate()

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm Zyla 💜. Ask me anything—routines, ingredients, or product help.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const [ttsSupported, setTtsSupported] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);

  const scrollerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setSpeechSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setInput(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event);
      setIsListening(false);

      if (event.error === "not-allowed") {
        alert(
          "Microphone access denied. Allow microphone permissions to use voice input."
        );
      } else if (event.error === "network") {
        alert(
          "Speech recognition service is not reachable."
        );
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTtsSupported(false);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // const chatEndpoint = "http://localhost:7076/chat";
  const chatGraphEndpoint = "http://localhost:7878/chatgraph"

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert(
        "Speech recognition is not supported in your browser."
      );
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error("Error starting/stopping recognition:", err);
    }
  };

  // TTS handler for assistant messages
  // const handleSpeak = (text, id) => {
  //   if (!ttsSupported || typeof window === "undefined" || !window.speechSynthesis) {
  //     alert("Text-to-speech is not supported in this browser.");
  //     return;
  //   }

  //   // If clicking the same message while it's speaking -> stop
  //   if (speakingId === id) {
  //     window.speechSynthesis.cancel();
  //     setSpeakingId(null);
  //     return;
  //   }

  //   // Stop any current speech
  //   window.speechSynthesis.cancel();

  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = "en-US";

  //   utterance.onend = () => {
  //     setSpeakingId((prev) => (prev === id ? null : prev));
  //   };

  //   utterance.onerror = (e) => {
  //     console.error("TTS error:", e);
  //     setSpeakingId((prev) => (prev === id ? null : prev));
  //   };

  //   setSpeakingId(id);
  //   window.speechSynthesis.speak(utterance);
  // };

  const handleSpeak = (text, id) => {
  if (!ttsSupported || !window.speechSynthesis) {
    alert("Text-to-speech is not supported in this browser.");
    return;
  }

  const voices = window.speechSynthesis.getVoices();
  const cuteVoice =
    voices.find(v => v.name.includes("Female") || v.name.includes("Heera")) ||
    voices.find(v => v.lang === "en-US") || 
    voices[0];

  if (speakingId === id) {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = cuteVoice;
  utterance.rate = 1;
  utterance.pitch = 1.4; 
  utterance.lang = "en-US";

  utterance.onend = () => setSpeakingId(null);
  utterance.onerror = err => {
    console.error("TTS error:", err);
    setSpeakingId(null);
  };

  setSpeakingId(id);
  window.speechSynthesis.cancel(); 
  window.speechSynthesis.speak(utterance);
};


  async function sendMessage(text) {
    const userText = text?.trim() ?? input.trim();
    if (!userText) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    try {
      const res = await fetch(chatGraphEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer -vwpvr-jJUjdclIAOgla2WVbTqeDJnG5",
          Authorization: "Bearer C3OogO3lp-xRo11HKefSrCPck4TCyQ-I",
        },
        body: JSON.stringify({
          // conversation_id: "6914621090c184fbfff46b14",
          conversation_id : "691c9dbd862632213d721a63",
          message: userText,
        }),
      });

      if (!res.ok) {
        throw new Error((await res.text()) || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const { reply, hits, intent_recommend } = data || {};

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply || "",
          hits: intent_recommend ? hits : [],
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Sorry, I couldn't reach the server. Check your backend URL in settings.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage();
  }

  return (
    <div className="min-h-screen w-full overflow-auto bg-[rgba(233,217,227,1)] text-white flex">
      
      <div className="w-64 bg-[rgba(185,163,199,0.95)] border-r border-[rgba(255,255,255,0.1)] p-6">
        <div className="space-y-4">
          <div className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Quick Actions
          </div>
          <button className="w-full text-left p-3 rounded-lg bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] transition">
            Skincare Routine
          </button>
          <button className="w-full text-left p-3 rounded-lg bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] transition">
            Dashboard
          </button>
          <button className="w-full text-left p-3 rounded-lg bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] transition">
            Ingredient Check
          </button>
        </div>

        <div className="mt-8">
          <div className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Recent Chats
          </div>
          <div className="space-y-2">
            <div className="text-sm p-2 rounded hover:bg-[rgba(255,255,255,0.1)] cursor-pointer">
              Dry skin routine
            </div>
            <div className="text-sm p-2 rounded hover:bg-[rgba(255,255,255,0.1)] cursor-pointer">
              Acne treatments
            </div>
            <div className="text-sm p-2 rounded hover:bg-[rgba(255,255,255,0.1)] cursor-pointer">
              Sunscreen help
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col ">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-6 min-h-0">
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <img
                src="src/bomma/Zyla-DP.png"
                alt="Zyla Avatar"
                className="w-14 h-14 rounded-full border-3 border-purple-500 object-cover"
              />
              <h1
                className="text-2xl font-bold tracking-tight 
               bg-linear-to-r from-purple-400 via-purple-500 to-purple-700 
               bg-clip-text text-transparent"
              >
                Ask Zyla{" "}
              </h1>
            </div>
          </div>

          <div className="flex-1 flex flex-col rounded-2xl border border-white/20 bg-[rgba(185,163,199,1)] overflow-hidden">

            <div
              ref={scrollerRef}
              className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              {messages.map((m, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <ChatMessage
                    role={m.role}
                    text={m.text}
                    canSpeak={ttsSupported}
                    isSpeaking={speakingId === idx}
                    onSpeak={() => handleSpeak(m.text, idx)}
                  />

                  {m.role === "assistant" && m.hits && m.hits.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 pr-6">
                      {m.hits.map((h, i) => (
                        <ProductCard key={`${idx}-${i}`} item={h} />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="animate-pulse">Thinking…</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/20 bg-[rgba(185,163,199,1)]">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    className="w-full border text-lg placeholder-fuchsia-600 border-white/20 rounded-2xl px-4 py-3 bg-[rgba(233,217,227,0.95)] text-purple-500 pr-12"
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
                      className={`absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition ${
                        isListening
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-purple-500 text-white hover:bg-purple-600"
                      }`}
                      title={isListening ? "Stop listening" : "Start voice input"}
                    >
                      {isListening ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="6" width="12" height="12" rx="1" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
                  className="px-5 py-3 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition"
                >
                  Send
                </button>
              </form>
              {isListening && (
                <div className="text-center mt-2 text-sm text-purple-200 animate-pulse">
                  Listening... Speak now
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
      <div className="w-64 bg-[rgba(185,163,199,0.95)] border-l border-[rgba(255,255,255,0.1)] p-6">
        <div className="mb-8">
          <div className="space-y-1">
          <button className="text-lg font-semibold mb-4 bg-[rgba(255,255,255,0.1)] cursor-pointer rounded-lg p-2 pl-10 pr-10" 
            // onClick= {()=> {alert("Favorites Clicked...")}}
            // onClick = {() => navigate('/chatbot-module/src/components/Favourites.jsx')}
            onClick = {() => navigate('/favorites')}
          >
            Favorites 💜</button>
          </div>
          {/* <h3 className="text-lg font-semibold mb-4">Favourites 💜</h3> */}
          <div className="space-y-3">
            <div className="text-sm p-3 rounded-lg bg-[rgba(255,255,255,0.1)]">
              <div className="font-medium">Vitamin C Serum</div>
              <div className="text-xs text-gray-300 mt-1">
                Brightening & Anti-aging
              </div>
            </div>
            <div className="text-sm p-3 rounded-lg bg-[rgba(255,255,255,0.1)]">
              <div className="font-medium">Hyaluronic Acid</div>
              <div className="text-xs text-gray-300 mt-1">Hydration Boost</div>
            </div>
            <div className="text-sm p-3 rounded-lg bg-[rgba(255,255,255,0.1)]">
              <div className="font-medium">SPF 50 Sunscreen</div>
              <div className="text-xs text-gray-300 mt-1">UV Protection</div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Skincare Routine</h3>
          <div className="space-y-3 text-sm text-gray-100">
            <div className="p-2 border-l-2 border-blue-400 pl-3">
              Cleanse your face gently, morning and night
            </div>
            <div className="p-2 border-l-2 border-green-400 pl-3">
              Apply toner to balance your skin's pH
            </div>
            <div className="p-2 border-l-2 border-yellow-400 pl-3">
              Moisturize to keep your skin hydrated and soft
            </div>
            <div className="p-2 border-l-2 border-red-400 pl-3">
              Use sunscreen daily to protect against UV damage
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
