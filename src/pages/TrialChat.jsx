import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ZaLogo from "../assets/ZaLogo.png";
import TrialChatbot from "../chat_components/TrialChatBotx";
import KnobImg from "../assets/ZylaToggle.png";

import { TrialChatApiService } from "../services/trial_chat_api";
import Footer from "../home_components/FooterPromo";

export default function TrialChatPage() {
  const navigate = useNavigate();
  const scrollerRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm Zyla 💜. You have a few free messages to try me out. Ask anything!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [conversationId, setConversationId] = useState(null);

  const [trialRemaining, setTrialRemaining] = useState(null);
  const [trialOver, setTrialOver] = useState(false);

  const [bgTheme, setBgTheme] = useState("light");

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [ttsSupported, setTtsSupported] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);
const recognitionRef = useRef(null);
  const voiceRef = useRef(null)

  useEffect(() => {
    if (trialOver) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [trialOver]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await TrialChatApiService.fetchTrial();

        if (!res.ok) {
          const text = await res.text();
          try {
            const data = JSON.parse(text);

            if (data.detail?.code === "TRIAL_EXHAUSTED") {
              setTrialOver(true);
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  text:
                    data.detail.message ||
                    "Your free trial is over. Please sign up to continue chatting.",
                },
              ]);
              return;
            }
          } catch {
            console.log("something fishy...");
          }
          throw new Error(text || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const { remaining_trials, trials_exhausted } = data || {};

        if (typeof remaining_trials === "number") {
          setTrialRemaining(remaining_trials);
        }

        if (trials_exhausted) {
          setTrialOver(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

 

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);


  
  
    
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
  

  async function sendMessage(textArg) {
    const userText = textArg?.trim() ?? input.trim();
    if (!userText || trialOver) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    try {
      const res = await TrialChatApiService.sendTrialMessage(
        conversationId,
        userText
      );

      if (!res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (data.detail?.code === "TRIAL_EXHAUSTED") {
            setTrialOver(true);
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                text:
                  data.detail.message ||
                  "Your free trial is over. Please sign up to continue chatting.",
              },
            ]);
            return;
          }
        } catch {
          console.log("something fishy...");
        }
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const { reply, remaining_trials, trials_exhausted } = data || {};

      if (!conversationId && data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      if (typeof remaining_trials === "number") {
        setTrialRemaining(remaining_trials);
      }

      if (trials_exhausted) {
        setTrialOver(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply || "",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't reach the server right now. Please try again later.",
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

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <div
      className={`min-h-screen w-full overflow-auto text-white flex flex-col  
        ${bgTheme == "light" ? "bg-[#E9D9E3]" : "bg-[#1D0E2D]"}`}
    >
      <header
        role="banner"
        className={`bg-white fixed top-0  left-0 w-full z-50 shadow-md  border-[#1A0D28]
          border-t-4 ${
            bgTheme == "light" ? "border-[#e9d9e3] " : "border-[#1d0e2d]"
          } 
          `}
      >
        <div
          className="max-w-screen mx-auto flex items-center justify-between px-4 md:px-6"
          style={{ height: "60px" }}
        >
          <div className="flex items-center gap-0.5">
            <img src={ZaLogo} alt="ZA logo" className="h-[38px] w-auto block" />
            <div className="font-['Playfair_Display'] -mb-1 font-bold leading-[0.9] select-none">
              <div className="text-[14px] text-[#1c0d25]">Ask</div>
              <div className="text-[24px] text-[#1c0d25]">Zyla</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* {trialRemaining !== null && !trialOver && (
              <span className="text-sm text-black font-medium">
                Free chats left:{" "}
                <span className="font-bold">{trialRemaining}</span>
              </span>
            )}

            {trialOver && (
              <span className="text-sm font-medium text-red-500">
                Trial over – please sign up
              </span>
            )} */}

            <button
              onClick={() => setBgTheme(bgTheme === "light" ? "dark" : "light")}
              className={`relative w-14 h-7 flex items-center rounded-full transition-all duration-300 ${
                bgTheme === "light" ? "bg-[#E9D9E3]" : "bg-[#1D0E2D]"
              }`}
            >
              <div
                className={`w-7 h-7 mt-0.5 rounded-full  transform transition-all duration-300 overflow-hidden
      ${bgTheme === "light" ? "translate-x-1" : "translate-x-7"} 
      hover:scale-115 hover:brightness-125`}
              >
                <img
                  src={KnobImg}
                  alt="icon"
                  className="w-5 h-5 mt-1 object-cover transition-all duration-300 brightness-110"
                />
              </div>
            </button>

            <button
              className="px-3 font-semibold text-sm py-1 rounded-sm bg-linear-to-r from-[#1A0D28] to-[#553379] text-white 
             backdrop-blur-sm border border-white/25 transition-all duration-300 
             hover:scale-105 hover:brightness-110"
              onClick={handleSignupClick}
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex p-3 mt-14">
        <div className="flex-1 flex flex-col">
          <TrialChatbot
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
            bgTheme={bgTheme}
            trialRemaining={trialRemaining}
            trialOver={trialOver}
          />

          {trialOver && (
            <div className="fixed inset-0 overflow-hidden  bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white text-black w-[90%] max-w-md p-6 rounded-2xl shadow-xl text-center ">
                <h2 className="text-xl font-bold mb-3">Your Trial Has Ended</h2>

                <p className="text-sm mb-6">
                  You’ve used all your free trial messages. Create an account to
                  keep chatting with Zyla and unlock full features.
                </p>

                <button
                  onClick={handleSignupClick}
                  className="px-6 py-3 w-full rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all"
                >
                  Sign up / Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
