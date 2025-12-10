import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from 'axios'
import {signOut} from 'firebase/auth'
import {auth} from '../firebase'
import { useAuth } from "../AuthContext";

// const API_BASE = "http://localhost:7878";
// const API_BASE = "http://localhost:7675";
const API_BASE = "http://localhost:7478";
// const AUTH_TOKEN = "Bearer C3OogO3lp-xRo11HKefSrCPck4TCyQ-I";

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
              ? "bg-purple-500 text-white backdrop-blur-sm rounded-br-sm"
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


function ProductCard({ item, idToken }) {
  const [liked, setLiked] = useState(false);
  const md = item?.metadata || {};

  const handleFavs = async (e) =>{
    e.preventDefault()
    const headers = {
      'Content-Type' :'application/json',
      // 'Authorization' : 'Bearer mM1ylkWwosv5ir9h5j9o1ZLjxzgMQMWT'
      // 'Authorization' : 'Bearer C3OogO3lp-xRo11HKefSrCPck4TCyQ-I'
      'Authorization' : `Bearer ${idToken}`
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
          {String(md.clean_ingreds).slice(0, 100)}
          {String(md.clean_ingreds).length > 100 ? "…" : ""}
        </div>
      )}

      <div className="text-xs mt-2 text-blue-600">Open link ↗</div>
    </a>
  );
}


export default function ZylaNew() {
  const {user} = useAuth()
  // console.log(user.uid)
  const navigate = useNavigate();
  const scrollerRef = useRef(null);

  const [idToken, setIdToken] = useState("")

  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
//   const [currentConversationTitle, setCurrentConversationTitle] = useState("");


const [messages, setMessages] = useState([
  {
    role: "assistant",
    text: "Hi! I'm Zyla 💜. Ask me anything—routines, ingredients, or product help.",
  },
]);

const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [loadingConversations, setLoadingConversations] = useState(false);

const [isListening, setIsListening] = useState(false);
const [speechSupported, setSpeechSupported] = useState(true);
const [ttsSupported, setTtsSupported] = useState(true);
const [speakingId, setSpeakingId] = useState(null);

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

    // useEffect(() => {
    //   setIdToken(user.uid)
    // }, [user])
    
    // replace any commented-out setIdToken(user.uid) logic
useEffect(() => {
  let mounted = true;

  async function fetchToken() {
    if (!user) return;
    try {
      // forceRefresh = false most of the time; pass true if you want fresh token
      const token = await user.getIdToken(/* forceRefresh= */ false);
      if (mounted) {
        setIdToken(token);
      }
    } catch (err) {
      console.error("Failed to get ID token:", err);
      // optionally show user a message or prompt re-login
    }
  }

  fetchToken();

  // optionally refresh token when it changes every ~50 minutes:
  // you could set an interval that refreshes token via user.getIdToken(true)
  return () => { mounted = false; };
}, [user]);

    
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

  // useEffect(() => {
  //   // load conversation list on mount
  //   loadConversations();
  // }, []);

  // REMOVE the previous `useEffect(() => { loadConversations(); }, []);` that fires on mount
// Instead:
useEffect(() => {
  if (!idToken) return;
  loadConversations();
}, [idToken]);


  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  async function loadConversations() {
    setLoadingConversations(true);
    try {
      const res = await fetch(`${API_BASE}/conversations`, {
        // headers: { Authorization: AUTH_TOKEN },
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setConversations(data || []);

      // if there's at least one conversation and none selected, open the first one
      if ((data || []).length > 0 && !currentConversationId) {
        openConversation(data[0].id, data[0].title);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  }

  async function createNewConversation() {
    try {
      const res = await fetch(`${API_BASE}/conversations`, {
        method: "POST",
        // headers: { "Content-Type": "application/json", Authorization: AUTH_TOKEN },
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ title: "New chat" }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const newId = data.id;

      // refresh list and open new conversation
      await loadConversations();
      openConversation(newId, "New chat");
    } catch (err) {
      console.error("Failed to create conversation:", err);
      alert("Could not create a new chat. Check console for details.");
    }
  }

  async function openConversation(id) {
    setCurrentConversationId(id);
    // setCurrentConversationTitle(title || "");

    // fetch messages for this conversation
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/conversations/${id}/messages`, {
        // headers: { Authorization: AUTH_TOKEN },
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // data is expected to be an array of {role, content}
      const mapped = (data || []).map((m) => ({ role: m.role, text: m.content, hits:m.hits }));

      // if server returns empty, keep a welcome assistant message
      if (mapped.length === 0) {
        setMessages([
          { role: "assistant", text: "This conversation is empty. Say hi to start." },
        ]);
      } else {
        setMessages(mapped);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      alert("Could not load messages for this conversation.");
      setMessages([
        { role: "assistant", text: "Sorry, I couldn't load this conversation's messages." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const chatGraphEndpoint = `${API_BASE}/chatgraph`;

  const handleSpeak = (text, id) => {
    if (!ttsSupported || !window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const cuteVoice =
    voices.find((v) => v.name.includes("Female")) ||
      voices.find((v) => v.lang === "en-US") ||
      voices[0];

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = cuteVoice || null;
    // utterance.rate = 1;
    // utterance.pitch = 1.2;
    utterance.lang = "en-US";

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = (err) => {
      console.error("TTS error:", err);
      setSpeakingId(null);
    };

    setSpeakingId(id);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  async function sendMessage(textArg) {
    const userText = (textArg?.trim() ?? input.trim());
    if (!userText) return;

    // Must have a conversation id selected
    if (!currentConversationId) {
      alert("Select or create a conversation before sending messages.");
      return;
    }

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    
    try {
      const res = await fetch(chatGraphEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: AUTH_TOKEN,
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ conversation_id: currentConversationId, message: userText }),
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

      // After sending a message successfully, update conversation list order
      await loadConversations();
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't reach the server. Check your backend URL in settings.",
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
  // if (!user) return <Navigate to="/" replace />;

   if (!user) {
    return <div>Loading...</div>; 
  }

  const handleLogout = async () => {
      // setError("");
      try {
        await signOut(auth);
        navigate("/")
      } catch (err) {
        console.log(err)
        // setError(err.message || "Failed to sign out.");
      }
    };


  // return (
  //   <div className="min-h-screen w-full overflow-auto bg-[rgba(233,217,227,1)] text-white flex">
  //     <div className="w-64 bg-[rgba(185,163,199,0.95)] border-r border-[rgba(255,255,255,0.1)] p-4">
  //       <div className="flex items-center justify-between mb-4">
  //         <div className="text-lg font-semibold text-gray-200 tracking-wide">Chats</div>
  //         <button onClick={createNewConversation} className="text-xl cursor-pointer p-2 font-semibold py-1 rounded-lg bg-pink-400">+</button>
  //       </div>

  //       <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
  //         {loadingConversations && <div className="text-sm text-gray-200">Loading...</div>}
  //         {conversations.map((c) => (
  //           <div
  //             key={c.id}
  //             onClick={() => openConversation(c.id, c.title)}
  //             className={`p-3 rounded-lg mb-2 cursor-pointer ${c.id === currentConversationId ? 'bg-purple-500 text-white' : 'bg-[rgba(255,255,255,0.03)] text-gray-200'}`}
  //           >
  //             <div className="font-medium text-sm">{c.title || 'Untitled'}</div>
  //             {/* <div className="text-xs text-gray-300">{new Date((c.updated_at || 0) * 1000).toLocaleString()}</div> */}
  //             <div className="text-xs text-gray-300">{(c.updated_at.split(" ")[1].split(".")[0])}</div>
  //           </div>
  //         ))}

  //         {conversations.length === 0 && !loadingConversations && (
  //           <div className="text-sm text-gray-200">No conversations yet — create one.</div>
  //         )}
  //       </div>
  //     </div>

  //     <div className="flex-1 flex flex-col ">
  //       <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-6 min-h-0">
  //         <div className="flex items-center justify-between mb-4">
  //            <div className="flex items-center justify-between w-full">
  //           <div className="flex items-center gap-2">
  //             <img
  //               src="src/bomma/Zyla-DP.png"  
  //               alt="Zyla Avatar"
  //               className="w-14 h-14 rounded-full border-3 border-purple-500 object-cover"  
  //             />
  //             <h1 className="text-2xl font-bold tracking-tight 
  //              bg-linear-to-r from-purple-400 via-purple-500 to-purple-700 
  //              bg-clip-text text-transparent">Ask Zyla </h1>
  //           </div>
  //          <div className="justify-end">
  //            <button className="p-2 text-gray-500 font-semibold bg-gray-300 hover:bg-gray-500 hover:text-gray-200 rounded-xl" 
  //             // onClick={()=>{alert("Logged out")}}
  //             onClick={handleLogout}
  //           >
  //             Logout
  //             </button>
  //          </div>
  //         </div>

           
  //         </div>

  //         <div className="flex-1 flex flex-col rounded-2xl border border-white/20 bg-[rgba(185,163,199,1)] overflow-hidden">
  //           <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0" style={{ maxHeight: "calc(100vh - 200px)" }}>
  //             {messages.map((m, idx) => (
  //               <div key={idx} className="flex flex-col gap-2">
  //                 <ChatMessage role={m.role} hits={m.hits} text={m.text} canSpeak={ttsSupported} isSpeaking={speakingId === idx} onSpeak={() => handleSpeak(m.text, idx)} />
               
  //                   {m.role === "assistant" && m.hits && m.hits.length > 0 && (
  //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 pr-6">
  //                     {m.hits.map((h, i) => (
  //                       <ProductCard key={`${idx}-${i}`} item={h} idToken={idToken} />
  //                     ))}
  //                   </div>
  //                 )}
  //               </div>
  //             ))}

  //             {loading && <div className="flex items-center gap-2 text-sm text-gray-300"><span className="animate-pulse">Thinking…</span></div>}
  //           </div>

  //           <div className="p-4 border-t border-white/20 bg-[rgba(185,163,199,1)]">
  //             <form onSubmit={handleSubmit} className="flex gap-2">
  //               <div className="flex-1 relative">
  //                 <input
  //                   className="w-full border text-lg placeholder-gray-500 border-white/20 rounded-2xl px-4 py-3 bg-[rgba(233,217,227,0.95)] text-purple-500  pr-12"
  //                   placeholder="Ask me anything about skincare…"
  //                   value={input}
  //                   onChange={(e) => setInput(e.target.value)}
  //                   disabled={loading}
  //                 />
  //                 {speechSupported && (
  //                   <button
  //                     type="button"
  //                     onClick={toggleListening}
  //                     disabled={loading}
  //                     className={`absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition ${
  //                       isListening
  //                         ? "bg-red-500 text-white animate-pulse"
  //                         : "bg-purple-500 text-white hover:bg-purple-600"
  //                     }`}
  //                     title={isListening ? "Stop listening" : "Start voice input"}
  //                   >
  //                     {isListening ? (
  //                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
  //                         <rect x="6" y="6" width="12" height="12" rx="1" />
  //                       </svg>
  //                     ) : (
  //                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
  //                         <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
  //                         <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
  //                       </svg>
  //                     )}
  //                   </button>
  //                 )}
  //               </div>
  //               <button type="submit" disabled={loading || !input.trim()} className="px-5 py-3 rounded-2xl bg-purple-600 text-white">Send</button>
  //             </form>
  //             {isListening && <div className="text-center mt-2 text-sm text-purple-200 animate-pulse">Listening... Speak now</div>}
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="w-64 bg-[rgba(185,163,199,0.95)] border-l border-[rgba(255,255,255,0.1)] p-6">
  //       <div className="mb-8">
  //         <div className="space-y-1">
  //           <button className="text-lg font-semibold mb-4 bg-[rgba(255,255,255,0.1)] cursor-pointer rounded-lg p-2 pl-10 pr-10" onClick={() => navigate('/favorites', {state : {uid: idToken}})}>Favorites 💜</button>
  //         </div>

  //         <div className="space-y-3">
  //           <div className="text-sm p-3 rounded-lg bg-[rgba(255,255,255,0.1)]">
  //             <div className="font-medium">Vitamin C Serum</div>
  //             <div className="text-xs text-gray-300 mt-1">Brightening & Anti-aging</div>
  //           </div>
  //           <div className="text-sm p-3 rounded-lg bg-[rgba(255,255,255,0.1)]">
  //             <div className="font-medium">Hyaluronic Acid</div>
  //             <div className="text-xs text-gray-300 mt-1">Hydration Boost</div>
  //           </div>
  //           <div className="text-sm p-3 rounded-lg bg-[rgba(255,255,255,0.1)]">
  //             <div className="font-medium">SPF 50 Sunscreen</div>
  //             <div className="text-xs text-gray-300 mt-1">UV Protection</div>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="mt-8">
  //         <h3 className="text-lg font-semibold mb-4">Skincare Routine</h3>
  //         <div className="space-y-3 text-sm text-gray-100">
  //           <div className="p-2 border-l-2 border-blue-400 pl-3">Cleanse your face gently, morning and night</div>
  //           <div className="p-2 border-l-2 border-green-400 pl-3">Apply toner to balance your skin's pH</div>
  //           <div className="p-2 border-l-2 border-yellow-400 pl-3">Moisturize to keep your skin hydrated and soft</div>
  //           <div className="p-2 border-l-2 border-red-400 pl-3">Use sunscreen daily to protect against UV damage</div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

//   return (
//     <div className="min-h-screen w-full overflow-auto bg-linear-to-br from-purple-50 to-pink-100 text-gray-800 flex">
//       {/* Left Sidebar - Glass Panel */}
//       <div className="w-64 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl m-4 p-6 shadow-xl">
//         <div className="flex items-center justify-between mb-6">
//           <div className="text-lg font-semibold text-purple-800 tracking-wide">Chats</div>
//           <button 
//             onClick={createNewConversation} 
//             className="text-xl cursor-pointer p-2 font-semibold rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 shadow-lg hover:bg-white/40 transition-all duration-300"
//           >
//             +
//           </button>
//         </div>

//         <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
//           {loadingConversations && (
//             <div className="flex items-center justify-center py-4">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
//             </div>
//           )}
//           {conversations.map((c) => (
//             <div
//               key={c.id}
//               onClick={() => openConversation(c.id, c.title)}
//               className={`p-4 rounded-xl mb-3 cursor-pointer transition-all duration-300 ${
//                 c.id === currentConversationId 
//                   ? 'bg-white/40 backdrop-blur-sm border border-white/50 shadow-lg' 
//                   : 'bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30'
//               }`}
//             >
//               <div className="font-medium text-sm text-purple-900">{c.title || 'Untitled'}</div>
//               <div className="text-xs text-purple-600 mt-1">
//                 {c.updated_at.split(" ")[1].split(".")[0]}
//               </div>
//             </div>
//           ))}

//           {conversations.length === 0 && !loadingConversations && (
//             <div className="text-sm text-purple-700 text-center py-4 bg-white/20 rounded-xl">
//               No conversations yet — create one.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col p-4">
//         <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">
//           {/* Header */}
//           <div className="bg-white/30 backdrop-blur-lg rounded-2xl border border-white/40 p-6 mb-6 shadow-xl">
//             <div className="flex items-center justify-between w-full">
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <img
//                     src="src/bomma/Zyla-DP.png"  
//                     alt="Zyla Avatar"
//                     className="w-16 h-16 rounded-full border-4 border-white/60 shadow-lg object-cover"  
//                   />
//                   <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                     Ask Zyla
//                   </h1>
//                   <p className="text-sm text-purple-700">Your AI Skincare Assistant</p>
//                 </div>
//               </div>
//               <button 
//                 className="px-6 py-3 text-purple-800 font-semibold bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-white/60 transition-all duration-300 shadow-lg"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Chat Container */}
//           <div className="flex-1 flex flex-col rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl overflow-hidden">
//             {/* Messages Area */}
//             <div 
//               ref={scrollerRef} 
//               className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 min-h-0" 
//               style={{ maxHeight: "calc(100vh - 280px)" }}
//             >
//               {messages.map((m, idx) => (
//                 <div key={idx} className="flex flex-col gap-3">
//                   <div className={`p-4 rounded-2xl backdrop-blur-sm border ${
//                     m.role === "user" 
//                       ? "bg-blue-500/20 border-blue-400/30 ml-12" 
//                       : "bg-white/30 border-white/40 mr-12"
//                   }`}>
//                     <ChatMessage 
//                       role={m.role} 
//                       hits={m.hits} 
//                       text={m.text} 
//                       canSpeak={ttsSupported} 
//                       isSpeaking={speakingId === idx} 
//                       onSpeak={() => handleSpeak(m.text, idx)} 
//                     />
//                   </div>
                  
//                   {m.role === "assistant" && m.hits && m.hits.length > 0 && (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-12">
//                       {m.hits.map((h, i) => (
//                         <div key={`${idx}-${i}`} className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 p-4 shadow-lg">
//                           <ProductCard item={h} idToken={idToken} />
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {loading && (
//                 <div className="flex items-center gap-3 text-purple-700">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
//                   <span className="animate-pulse">Thinking…</span>
//                 </div>
//               )}
//             </div>

//             {/* Input Area */}
//             <div className="p-6 border-t border-white/30 bg-white/10 backdrop-blur-lg">
//               <form onSubmit={handleSubmit} className="flex gap-3">
//                 <div className="flex-1 relative">
//                   <input
//                     className="w-full border text-lg placeholder-purple-400 border-white/40 rounded-2xl px-6 py-4 bg-white/30 backdrop-blur-sm text-purple-900 pr-16 shadow-inner"
//                     placeholder="Ask me anything about skincare…"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     disabled={loading}
//                   />
//                   {speechSupported && (
//                     <button
//                       type="button"
//                       onClick={toggleListening}
//                       disabled={loading}
//                       className={`absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-xl transition-all duration-300 ${
//                         isListening
//                           ? "bg-red-500/80 text-white animate-pulse shadow-lg"
//                           : "bg-white/50 text-purple-700 hover:bg-white/70 border border-white/60 shadow-lg"
//                       }`}
//                       title={isListening ? "Stop listening" : "Start voice input"}
//                     >
//                       {isListening ? (
//                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                           <rect x="6" y="6" width="12" height="12" rx="1" />
//                         </svg>
//                       ) : (
//                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
//                           <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
//                         </svg>
//                       )}
//                     </button>
//                   )}
//                 </div>
//                 <button 
//                   type="submit" 
//                   disabled={loading || !input.trim()} 
//                   className="px-8 py-4 rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Send
//                 </button>
//               </form>
//               {isListening && (
//                 <div className="text-center mt-3 text-sm text-purple-600 animate-pulse">
//                   🎤 Listening... Speak now
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right Sidebar - Glass Panel */}
//       <div className="w-64 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl m-4 p-6 shadow-xl">
//         <div className="mb-8">
//           <button 
//             className="w-full text-lg font-semibold mb-6 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4 hover:bg-white/40 transition-all duration-300 shadow-lg text-purple-800"
//             onClick={() => navigate('/favorites', {state: {uid: idToken}})}
//           >
//             Favorites 💜
//           </button>

//           <div className="space-y-4">
//             <div className="p-4 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 shadow-lg">
//               <div className="font-medium text-purple-900">Vitamin C Serum</div>
//               <div className="text-xs text-purple-600 mt-1">Brightening & Anti-aging</div>
//             </div>
//             <div className="p-4 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 shadow-lg">
//               <div className="font-medium text-purple-900">Hyaluronic Acid</div>
//               <div className="text-xs text-purple-600 mt-1">Hydration Boost</div>
//             </div>
//             <div className="p-4 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 shadow-lg">
//               <div className="font-medium text-purple-900">SPF 50 Sunscreen</div>
//               <div className="text-xs text-purple-600 mt-1">UV Protection</div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8">
//           <h3 className="text-lg font-semibold mb-4 text-purple-800">Skincare Routine</h3>
//           <div className="space-y-3 text-sm">
//             <div className="p-3 rounded-xl bg-white/30 backdrop-blur-sm border-l-4 border-blue-400/80 border ">
//               Cleanse your face gently, morning and night
//             </div>
//             <div className="p-3 rounded-xl bg-white/30 backdrop-blur-sm border-l-4 border-green-400/80 border ">
//               Apply toner to balance your skin's pH
//             </div>
//             <div className="p-3 rounded-xl bg-white/30 backdrop-blur-sm border-l-4 border-yellow-400/80 border ">
//               Moisturize to keep your skin hydrated and soft
//             </div>
//             <div className="p-3 rounded-xl bg-white/30 backdrop-blur-sm border-l-4 border-red-400/80 border ">
//               Use sunscreen daily to protect against UV damage
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
// );

return (
    <div className="min-h-screen w-full overflow-auto bg-linear-to-br from-purple-400 via-pink-400 to-blue-400 text-white flex p-4">
      {/* Left Sidebar - Frosted Glass */}
      <div className="w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl m-2 p-6 shadow-2xl relative overflow-hidden">
        {/* Glass reflection effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/30"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="text-lg font-semibold text-white/90 tracking-wide drop-shadow-sm">Chats</div>
          <button 
            onClick={createNewConversation} 
            className="text-xl cursor-pointer w-10 h-10 font-semibold rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 shadow-lg hover:bg-white/25 transition-all duration-300 hover:scale-110 hover:shadow-2xl flex items-center justify-center"
          >
            +
          </button>
        </div>

        <div className="overflow-y-auto relative z-10" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {loadingConversations && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-6 border-b-2 border-white/60"></div>
            </div>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => openConversation(c.id, c.title)}
              className={`p-3 rounded-2xl mb-3 cursor-pointer transition-all duration-300 backdrop-blur-sm border ${
                c.id === currentConversationId 
                  ? 'bg-white/25 border-white/30 shadow-inner' 
                  : 'bg-white/10 border-white/15 hover:bg-white/20 hover:border-white/25'
              }  hover:shadow-lg`}
            >
              <div className="font-medium text-sm text-white/90 drop-shadow-sm">{c.title || 'Untitled'}</div>
              <div className="text-xs text-white/70 mt-1 drop-shadow-sm">
                {c.updated_at.split(" ")[1].split(".")[0]}
              </div>
            </div>
          ))}

          {conversations.length === 0 && !loadingConversations && (
            <div className="text-sm text-white/70 text-center py-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15">
              No conversations yet — create one.
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col p-2">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">
          {/* Header */}
          <div className="bg-white/15 backdrop-blur-md rounded-3xl border border-white/25 p-6 mb-4 shadow-2xl relative overflow-hidden">
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"></div>
            
            <div className="flex items-center justify-between w-full relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
                  <img
                    src="src/bomma/Zyla-DP.png"  
                    alt="Zyla Avatar"
                    className="w-16 h-16 rounded-full border-2 border-white/40 shadow-2xl object-cover relative z-10"  
                  />
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-lg z-20"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                    Ask Zyla
                  </h1>
                  <p className="text-sm text-white/80 drop-shadow-sm">Your AI Skincare Assistant</p>
                </div>
              </div>
              <button 
                className="px-6 py-3 text-white font-semibold bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl hover:bg-white/25 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 flex flex-col rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden relative">
            {/* Background glow effects */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl"></div>
            
            {/* Messages Area */}
            <div 
              ref={scrollerRef} 
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 min-h-0 relative z-10" 
              style={{ maxHeight: "calc(100vh - 280px)" }}
            >
              {messages.map((m, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <div 
                  // className={`p-5 rounded-3xl backdrop-blur-sm border ${
                  //   m.role === "user" 
                  //     ? "bg-blue-500/25 border-blue-400/30 ml-16 shadow-lg" 
                  //     : "bg-white/15 border-white/25 mr-16 shadow-lg"
                  // }`}
                  >
                    <ChatMessage 
                      role={m.role} 
                      hits={m.hits} 
                      text={m.text} 
                      canSpeak={ttsSupported} 
                      isSpeaking={speakingId === idx} 
                      onSpeak={() => handleSpeak(m.text, idx)} 
                    />
                  </div>
                  
                  {m.role === "assistant" && m.hits && m.hits.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-16">
                      {m.hits.map((h, i) => (
                        <div key={`${idx}-${i}`} className="bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                          <ProductCard item={h} idToken={idToken} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-white/90 drop-shadow-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60"></div>
                  <span className="animate-pulse">Thinking…</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/20 bg-white/10 backdrop-blur-md relative z-10">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl blur-sm"></div>
                  <input
                    className="w-full border text-lg placeholder-white/60 border-white/25 rounded-2xl px-6 py-4 bg-white/15 backdrop-blur-sm text-white pr-16 shadow-inner relative z-10"
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
                      className={`absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-xl transition-all duration-300 z-20 ${
                        isListening
                          ? "bg-red-500/60 text-white animate-pulse shadow-lg border border-red-400/30"
                          : "bg-white/20 text-white hover:bg-white/30 border border-white/30 shadow-lg hover:shadow-xl"
                      } hover:scale-110`}
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
                  className="px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:bg-white/25 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-purple-500/30 to-pink-500/30 rounded-2xl"></div>
                  <span className="relative z-10">Send</span>
                </button>
              </form>
              {isListening && (
                <div className="text-center mt-3 text-sm text-white/80 animate-pulse drop-shadow-sm">
                  🎤 Listening... Speak now
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Frosted Glass */}
      <div className="w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl m-2 p-6 shadow-2xl relative overflow-hidden">
        {/* Glass reflection effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/30"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="mb-8 relative z-10">
          <button 
            className="w-full text-lg font-semibold mb-6 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-4 hover:bg-white/25 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 text-white"
            onClick={() => navigate('/favorites', {state: {uid: idToken}})}
          >
            Favorites 💜
          </button>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="font-medium text-white/90">Vitamin C Serum</div>
              <div className="text-xs text-white/70 mt-1">Brightening & Anti-aging</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="font-medium text-white/90">Hyaluronic Acid</div>
              <div className="text-xs text-white/70 mt-1">Hydration Boost</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="font-medium text-white/90">SPF 50 Sunscreen</div>
              <div className="text-xs text-white/70 mt-1">UV Protection</div>
            </div>
          </div>
        </div>

        <div className="mt-8 relative z-10">
          <h3 className="text-lg font-semibold mb-4 text-white/90 drop-shadow-sm">Skincare Routine</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border-l-4 border-blue-400/60 border border-white/20 shadow-lg">
              Cleanse your face gently, morning and night
            </div>
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border-l-4 border-green-400/60 border border-white/20 shadow-lg">
              Apply toner to balance your skin's pH
            </div>
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border-l-4 border-yellow-400/60 border border-white/20 shadow-lg">
              Moisturize to keep your skin hydrated and soft
            </div>
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border-l-4 border-red-400/60 border border-white/20 shadow-lg">
              Use sunscreen daily to protect against UV damage
            </div>
          </div>
        </div>
      </div>
    </div>
);
}
