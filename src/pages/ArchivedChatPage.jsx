import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// import Conversations from "../chatbot_components/Conversations";

import ArchiveConversations from "../chatbot_components/ArchiveConversations";

import Chatbot from "../chatbot_components/Chatbotx";


import { onAuthStateChanged, getAuth } from "firebase/auth";
// import HeaderMain from "../home_components/HeaderMain";
import { ThemeContext } from "../contexts/ThemeContext";

import { ArchiveChatBotApiService } from "../services/archive_chatbot_api"


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

export default function ArchivedChatPage() {
  
  const  auth  = getAuth()
  // console.log(user.uid)
  const navigate = useNavigate();
  const scrollerRef = useRef(null);

    const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  


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
  
  const [randomQs, setRandomQs] = useState([]);

  
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        console.log(u)
      });
         return () => unsub();
    }, [auth]);
  

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setSpeechSupported(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
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
        alert("Speech recognition service is not reachable.");
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
    let mounted = true;

    async function fetchToken() {
      if (!user) return;
      try {
        const token = await user.getIdToken(false);
        if (mounted) {
          setIdToken(token);
        }
      } catch (err) {
        console.error("Failed to get ID token:", err);
      }
    }

    fetchToken();

    return () => {
      mounted = false;
    };
  }, [user]);

  
  
  useEffect(() => {
    const shuffled = [...QUICK_QUESTIONS].sort(() => 0.5 - Math.random());
    setRandomQs(shuffled.slice(0, 5));
  }, []);
    

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
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

 

  useEffect(() => {
    if (!idToken) return;
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
      const data = await ArchiveChatBotApiService.loadArchivedConversations(idToken)
   
      setConversations(data || []);

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
      const data = await ArchiveChatBotApiService.createArchNewConvo(idToken);
      const newId = data.id;

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

    try {
      setLoading(true);
    const data = await ArchiveChatBotApiService.openArchConversation(idToken, id)

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
    
      const data = await ArchiveChatBotApiService.sendArchMessage(idToken, currentConversationId, userText)
      // const { reply, hits, intent_recommend } = data || {};
      const { reply} = data || {};

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply || "",
          // hits: intent_recommend ? hits : [],
        },
      ]);

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

  

  return (
     <div className={`min-h-screen w-full overflow-auto  text-white flex flex-col ${isLight ? "bg-[#E9D9E3]": "bg-[#1D0E2D]"}`}>
     
   {/* <HeaderMain /> */}


      <div className="flex-1 flex p-3 mt-15">
        

        <ArchiveConversations conversations={conversations} createNewConversation={createNewConversation} 
                  currentConversationId={currentConversationId} loadingConversations={loadingConversations}
                  openConversation={openConversation} refreshConversations={loadConversations} idToken={idToken}
                     isArchived = {true}

                  />

        {/* Center  */}
          <Chatbot scrollerRef={scrollerRef} messages={messages} loading={loading} ttsSupported={ttsSupported} speakingId={speakingId} handleSpeak={handleSpeak}
                        input={input} setInput={setInput} handleSubmit={handleSubmit} speechSupported={speechSupported}
                        isListening={isListening} toggleListening={toggleListening} idToken={idToken}
               />


       <div className="sm:hidden lg:block w-50 flex flex-col justify-center rounded-2xl m-1 p-4 relative overflow-hidden">
      <div className="mb-6 mt-20 relative z-10">
        <h2
          className={`text-base mb-4 tracking-wide font-semibold 
            ${ isLight ? "text-black" : "text-white"
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
      <div className="flex justify-center" >
        <button 
        onClick={() => 
          // navigate('/chatbot')
          navigate("/loading", { state: { nextPage: "/chatbot" } })
        }
         className={`  py-1 px-3 text-sm rounded-md text-white font-semibold
        ${isLight ? "bg-linear-to-r from-[#4f4d4f]  to-[#bdbcbd]" : "bg-white/10"}
        `} >Recent Chats</button>
      </div>
    </div>

      </div>

    </div>
  );
}
