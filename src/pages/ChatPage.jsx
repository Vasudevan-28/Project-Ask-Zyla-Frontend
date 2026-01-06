import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Conversations from "../chatbot_components/Conversations";
import Chatbot from "../chatbot_components/Chatbotx";
import { onIdTokenChanged, getAuth } from "firebase/auth";
// import HeaderMain from "../home_components/HeaderMain";
// import FooterMain from "../home_components/FooterMain";
import { ThemeContext } from "../contexts/ThemeContext";
import { ChatBotApiService } from "../services/chatbot_api";


const QUICK_QUESTIONS = [
  "How does niacinamide improve my skin?",
  "What’s the best routine for oily skin?",
  "Can I use retinol and vitamin C together?",
  "How do I reduce acne scars effectively?",
  "Which sunscreen is best for daily use?",
  "How can I fix an uneven skin tone?",
  "What ingredients should I avoid for sensitive skin?",
  "How do I build a beginner skincare routine?",
  "Is exfoliating daily bad for my skin?",
  "How do I know my skin type?",
];

export default function ChatPage() {
  const  auth  = getAuth()

    const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  

  // console.log(user.uid)
  const navigate = useNavigate();
  const scrollerRef = useRef(null);

  const [idToken, setIdToken] = useState("");

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
  const voiceRef = useRef(null)
  

const [randomQs, setRandomQs] = useState([]);

  const [isConversationsOpen, setIsConversationsOpen] = useState(false);


  const [user, setUser] = useState(null);

  useEffect(() => {
  const unsub = onIdTokenChanged(auth, async (u) => {
    setUser(u);

    if (!u) {
      setIdToken(null);
      return;
    }

    try {
      const token = await u.getIdToken();
      setIdToken(token);
    } catch (err) {
      console.error("Failed to get ID token:", err);
    }
  });

  return () => unsub();
}, []);

useEffect(() => {
  const shuffled = [...QUICK_QUESTIONS].sort(() => 0.5 - Math.random());
  setRandomQs(shuffled.slice(0, 5));
}, []);



  useEffect(() => {
    if (
      typeof window === "undefined" ||
      (!("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window))
    ) {
      setSpeechSupported(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setInput(finalTranscript);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTtsSupported(false);
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      voiceRef.current =
        voices.find(
          (v) =>
            v.lang === "en-US" &&
            v.name.toLowerCase().includes("female")
        ) ||
        voices.find((v) => v.lang === "en-US") ||
        voices[0];
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);


  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    try {
      isListening
        ? recognitionRef.current.stop()
        : recognitionRef.current.start();
    } catch (e) {
      console.log(e)
    }
  };


  const utteranceRef = useRef(null)

const handleSpeak = (text, id) => {
  if (!ttsSupported || !voiceRef.current) return;

  const synth = window.speechSynthesis;

  if (speakingId === id) {
    synth.cancel();
    utteranceRef.current = null;
    setSpeakingId(null);
    return;
  }

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voiceRef.current;
  utterance.lang = "en-US";

  utteranceRef.current = utterance;

  utterance.onend = () => {
    if (utteranceRef.current !== utterance) return;
    utteranceRef.current = null;
    setSpeakingId(null);
  };

  utterance.onerror = () => {
    if (utteranceRef.current !== utterance) return;
    utteranceRef.current = null;
    setSpeakingId(null);
  };

  setSpeakingId(id);

  setTimeout(() => {
    synth.speak(utterance);
  }, 0);
};

const [pageLoading, setPageLoading] = useState(true);
  
  useEffect(() => {
    if (!idToken) return;
    setPageLoading(false);
    loadConversations();
  }, [idToken]);

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


  async function loadConversations() {
  setLoadingConversations(true);
  try {
   const data = await ChatBotApiService.loadConversations(idToken)

    if (!data || data.length === 0) {
      await createNewConversation({ autoOpen: true, fromLoad: true });
      return; 
    }

    setConversations(data || []);

    if ((data || []).length > 0 && !currentConversationId) {
      openConversation(data[0].id); 
    }
  } catch (err) {
    console.error("Failed to load conversations:", err);
  } finally {
    setLoadingConversations(false);
  }
}


  async function createNewConversation({ autoOpen = true } = {}) {
  try {
    const data = await ChatBotApiService.createNewConvo(idToken)

    const newConversation = {
      id: data.id,
      title: data.title || "New chat",
    };

    setConversations((prev) => [newConversation, ...prev]);

 
    if (autoOpen) {
      await openConversation(newConversation.id);
    }
  } catch (err) {
    console.error("Failed to create conversation:", err);
    alert("Could not create a new chat. Check console for details.");
  }
}


  async function openConversation(id) {
    setCurrentConversationId(id);
    // setCurrentConversationTitle(title || "");

    try {
      setLoading(true);
     const data = await ChatBotApiService.openConversation(idToken, id)

      const mapped = (data || []).map((m) => ({
        role: m.role,
        text: m.content,
        // hits: m.hits,
      }));

      if (mapped.length === 0) {
        setMessages([
          {
            role: "assistant",
            text: "Hi! I'm Zyla 💜. Your friendly skincare assistant",
          },
        ]);
      } else {
        setMessages(mapped);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      alert("Could not load messages for this conversation.");
      setMessages([
        {
          role: "assistant",
          text: "Sorry, I couldn't load this conversation's messages.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }



  async function sendMessage(textArg) {
    const userText = textArg?.trim() ?? input.trim();
    if (!userText) return;

    if (!currentConversationId) {
      alert("Select or create a conversation before sending messages.");
      return;
    }

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    try {
      
      const data = await ChatBotApiService.sendMessage(idToken, currentConversationId, userText)

      // const { reply, hits, intent_recommend } = data || {};
      const { reply } = data || {};

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply || "",
          // hits: intent_recommend ? hits : [],
        },
      ]);
      setLoading(false);
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
  // if (!user) {
  //   return <div>Loading...</div>;
  // }

  if (!user){
    return(
      <div className={`min-h-screen min-w-screen flex justify-center items-center
       ${isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"}
      `}>
        <div  className={`animate-spin h-8 w-8 rounded-full border-3  border-t-transparent
          ${!isLight ? "border-[#e9d9e3]" : "border-[#1d0e2d]"}
          `} ></div>
      </div>
    )
  }
  if (pageLoading){
    return(
      <div className={`min-h-screen min-w-screen flex justify-center items-center
       ${isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"}
      `}>
        <div  className={`animate-spin h-8 w-8 rounded-full border-3  border-t-transparent
          ${!isLight ? "border-[#e9d9e3]" : "border-[#1d0e2d]"}
          `} ></div>
      </div>
    )
  }
  if (!user){
    return(
      <div className={`min-h-screen min-w-screen flex justify-center items-center
       ${isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"}
      `}>
        <div  className={`animate-spin h-8 w-8 rounded-full border-3  border-t-transparent
          ${!isLight ? "border-[#e9d9e3]" : "border-[#1d0e2d]"}
          `} ></div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen w-full overflow-auto text-white flex flex-col 
        ${isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"}`}
    >

      <div className="flex-1 flex p-3 mt-15">
        <Conversations
          conversations={conversations}
          createNewConversation={createNewConversation}
          currentConversationId={currentConversationId}
          loadingConversations={loadingConversations}
          openConversation={(id, title) => {
            openConversation(id, title);
            setIsConversationsOpen(false);
          }}
          refreshConversations={loadConversations}
          idToken={idToken}
          isArchived={false}
          isMobileOpen={isConversationsOpen}
          onClose={() => setIsConversationsOpen(false)}
        />

        {/* Chat area */}
        <Chatbot
          scrollerRef={scrollerRef}
          messages={messages}
          loading={loading}
          ttsSupported={ttsSupported}
          speakingId={speakingId}
          handleSpeak={handleSpeak}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          speechSupported={speechSupported}
          isListening={isListening}
          toggleListening={toggleListening}
          idToken={idToken}
          onOpenConversations={() => setIsConversationsOpen(true)}
        />

        <div className="hidden md:flex w-50 flex-col justify-center rounded-2xl m-1 p-4 relative overflow-hidden">
          <div className="mb-6 mt-20 relative z-10">
            <h2
              className={`text-base mb-4 tracking-wide font-semibold ${
                isLight ? "text-black" : "text-white"
              }`}
            >
              Quick Chats
            </h2>

            {randomQs.map((q, index) => (
              <button
                key={index}
                className={`w-full text-left p-2 mb-3  border-white/30 shadow-inner backdrop-blur-md rounded-xl border  
                       hover:bg-white/20 hover:border-white/30 transition-all duration-200 
                        hover:shadow-md text-sm text-white hover:text-black/80 font-medium cursor-pointer
                        ${isLight ? "bg-[#B9A3C7]" : "bg-white/10"}
                        `}
                onClick={() => setInput(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={() =>
                navigate("/loading", { state: { nextPage: "/archivedchats" } })
              }
              className={`py-1 px-3 text-sm rounded-md text-white font-semibold ${
                isLight
                  ? "bg-linear-to-r from-[#4f4d4f]  to-[#bdbcbd]"
                  : "bg-white/10"
              }`}
            >
              Archived Chats
            </button>
          </div>
        </div>
      </div>

      <div className="h-4 md:h-0" />
    </div>
  );
}
