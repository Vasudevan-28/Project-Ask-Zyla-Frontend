import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Zylaimg from "./Zyla.png";
// import PersonalRoutine from "./personalroutine.png";
import DailyPlanner from "./daily_planner.png";
import Analyzer from "./ai_skin_analyzer.png";
import VoiceText from "./voice_text.png";
import TextVoice from "./text_voice.png";
import CustomBuilder from "./custom_builder.png";
import PersonalizedRoutine from "./personalizedroutine.png";
import HeaderMain from "../../home_components/HeaderMain";
import FooterMain from "../../home_components/FooterMain";

const features = [
  {
    image: Analyzer,
    title: "AI SKIN ANALYZER",
    description:
      "I read your inputs whenever you share them and follow your skin’s ups and downs like your personal glow guardian.",
  },
  {
    image: PersonalizedRoutine,
    title: "PERSONALIZED ROUTINE",
    description:
      "Tell me your skin mood and I’ll craft the perfect routine. Just what your skin actually needs.",
  },
  {
    image: CustomBuilder,
    title: "CUSTOM BUILDER",
    description:
      "Want to build your own routine? I’ll guide you like that smart friend who knows ingredients… and won’t let you ruin your skin.",
  },
  {
    image: DailyPlanner,
    title: "DAILY PLANNER",
    description:
      "I plan your skincare steps for the day—what to use, when to use it and how to glow without confusion.",
  },
  {
    image: VoiceText,
    title: "VOICE TO TEXT",
    description:
      "Too lazy to type? Just talk to me. I understand you even when you whisper like you're sharing skincare tea.",
  },
  {
    image: TextVoice,
    title: "TEXT TO VOICE",
    description:
      "If you want to hear me, I’ll speak to you! Imagine your skincare friend actually talking in your ear… cute no?",
  },
];

export default function AboutUs() {
  const [activeFeature, setActiveFeature] = useState(null);

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-[#0B0014] via-[#1A0D28] to-[#0B0014] text-white overflow-x-hidden relative">
      <HeaderMain />


      {/* ⭐ Floating Stars */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse top-[10%] left-[20%]"></div>
        <div className="absolute w-0.5 h-0.5 bg-white/30 rounded-full animate-ping top-[40%] left-[80%]"></div>
        <div className="absolute w-0.5 h-0.5 bg-purple-200/40 rounded-full animate-pulse top-[70%] left-[50%]"></div>
        <div className="absolute w-0.5 h-0.5 bg-pink-300/30 rounded-full animate-ping top-[25%] left-[60%]"></div>
        <div className="absolute w-0.5 h-0.5 bg-purple-300/50 rounded-full animate-pulse top-[85%] left-[30%]"></div>
      </div>

      {/* 🌌 STORY TITLE */}
      <h2 className="text-[90px] sm:text-[120px] font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400/40 via-white/70 to-pink-500/40 tracking-tight text-center mt-10">
        MY STORY
      </h2>

      {/* STORY SECTION */}
      <section className="flex flex-col lg:flex-row items-center justify-center mt-[-60px] px-6 lg:px-20 gap-10 relative z-10">
        
        {/* GLOW BEHIND IMAGE */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>

          <div className="shrink-0 p-2 rounded-full bg-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(255,255,255,0.15)]">
            <img
              src={Zylaimg}
              alt="Zyla"
              className="w-60 h-60 sm:w-[300px] sm:h-[300px] object-cover rounded-full"
            />
          </div>
        </div>

        {/* STORY CARD */}
        <div className="max-w-3xl bg-white/5 bg-linear-to-b from-white/10 to-white/5 p-10 rounded-3xl backdrop-blur-2xl shadow-[0_0_60px_rgba(255,255,255,0.15)] border border-white/20 text-gray-200 text-[17px] leading-relaxed flex flex-col items-center text-center">
          <p>One fine day ✨, a beauty lover started facing some skin problems.</p>
          <p>Feeling worried, Jamie talked to their friends, but the only reply was, “Try this cream, it worked for my cousin!”… not helpful at all 😕.</p>
          <p>Jamie searched online and even asked other chatbots, but some gave wrong advice, some suggested risky methods, and none were dermatologist approved 😟.</p>
          <p>Feeling more confused, Jamie wished for a safe, friendly chatbot that gives clear, correct, trusted answers.</p>
          <p>And that’s how I was born—Zyla, the smart and caring skin chatbot! 🤖✨</p>
          <p>I don’t confuse, I don’t scare. I guide, explain, and care. 🌸</p>
          <p>Friendly like a real friend, smart like a skincare coach, and dermatologist trusted too!💖</p>
          <p>I’m Zyla, your trusted skin buddy ✨</p>
          <p className="mt-6 w-full text-right">— XoXo Zyla ❤️</p>
        </div>
      </section>

      {/* 🌠 FEATURES TITLE */}
<h2 className="text-[90px] sm:text-[120px] font-extrabold text-transparent bg-clip-text bg-linear-to-r
 from-purple-400/40 via-white/70 to-pink-500/40 tracking-tight text-center mt-10">
  FEATURES
</h2>

{/* ✨ SUBTLE FEATURES GRID */}
<section className="mt-[-60px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 px-6 sm:px-10 pb-16 max-w-6xl mx-auto relative z-10">

  {features.map((f, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      onClick={() => setActiveFeature(activeFeature === index ? null : index)}
      className="relative pt-18 pb-4 px-6 rounded-2xl cursor-pointer
        bg-white/4 backdrop-blur-sm
        border border-white/8
        shadow-[0_6px_24px_rgba(8,6,12,0.35)]
        hover:shadow-[0_10px_40px_rgba(8,6,12,0.45)]
        hover:scale-[1.02] transition-all duration-300
        flex flex-col items-center text-center group"
    >

      {/* Subtle Glow Behind Image */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-36 h-36 
        bg-purple-500/12 rounded-full blur-[14px] opacity-60 
        group-hover:opacity-75 transition-opacity duration-450">
      </div>

      {/* Floating Image Box - calmer */}
      <motion.div
        className="absolute -top-14 left-1/2 -translate-x-1/2 
          w-40 h-40 flex items-center justify-center 
          "
        whileHover={{ y: -8, scale: 1.06 }}
        transition={{ duration: 0.35 }}
      >
        <img
          src={f.image}
          alt={f.title}
          className="w-40 h-40 object-contain"
        />
      </motion.div>

      {/* Title */}
      <h3 className="mt-16 text-lg font-semibold tracking-wide text-white">
        {f.title}
      </h3>

      {/* teaser text */}
      <p className="text-gray-300 text-sm mt-2 opacity-85">
        Tap to read more
      </p>
    </motion.div>
  ))}

</section>


      {/* MODAL */}
      <AnimatePresence>
        {activeFeature !== null && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#15001F]/60 backdrop-blur-xl flex items-center justify-center p-6 z-50"
            onClick={() => setActiveFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-linear-to-br from-[#3b0f55]/30 to-[#160624]/50 p-10 rounded-3xl max-w-xl border border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.25)] backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl font-bold text-white mb-4">
                {features[activeFeature].title}
              </h3>
              <p className="text-gray-300 text-lg">
                {features[activeFeature].description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        <FooterMain />

    </div>
  );
}
