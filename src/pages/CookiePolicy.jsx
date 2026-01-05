import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
export default function CookiePolicy() {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full pb-16 min-h-screen bg-linear-to-b from-[#0B0014] via-[#1A0D28] to-[#0B0014] text-white relative overflow-x-hidden">

        {/* ⭐ Floating Stars */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse top-[10%] left-[20%]"></div>
          <div className="absolute w-0.5 h-0.5 bg-white/30 rounded-full animate-ping top-[40%] left-[80%]"></div>
          <div className="absolute w-0.5 h-0.5 bg-purple-200/40 rounded-full animate-pulse top-[70%] left-[50%]"></div>
        </div>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition z-50"
        >
          <ArrowLeft size={28} />
        </button>

        {/* HEADER */}
        <section className="flex flex-col items-center mt-20 z-4 relative text-center">
          <h1 className=" text-8xl md:text-[115px] font-extrabold tracking-wide text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-white to-purple-400 drop-shadow-[0_0_40px_rgba(255,255,255,0.25)]">
            COOKIE POLICY
          </h1>
          <p className="text-gray-400 text-lg font-medium">Last Updated: [December 09, 2025]</p>
        </section>

        {/* MAIN CONTENT CARD */}
        <section className="max-w-6xl mx-auto mt-4 p-10 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.15)] flex flex-col md:flex-row gap-12 relative z-10 text-center">

          {/* LEFT CONTENT */}
          <div className="flex-1 space-y-6 text-gray-200 text-lg leading-relaxed text-center">

            {/* What Are Cookies */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-4xl font-bold text-purple-300 mb-2">What Are Cookies?</h2>
              <p>
                Cookies are small files stored on your device that help us improve your experience, remember preferences, and analyze app performance.
              </p>
            </motion.div>

            {/* Separator */}
            <div className="w-full h-px bg-white/10 my-6"></div>

            {/* Types of Cookies */}
<motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.5, delay: 0.1 }}
  className="text-center"
>
  <h2 className="text-4xl font-bold text-purple-300 mb-8">
    Types of Cookies We Use
  </h2>

  {/* 2×2 GRID with FIXED & TOP-ALIGNED BOXES */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">

  {/* BOX TEMPLATE */}
  <div className="bg-white/2 p-6 rounded-2xl border border-white/10 
                  w-full max-w-md h-[260px]
                  flex flex-col items-center justify-start text-center">
    <h3 className="text-2xl font-semibold text-white mb-2">Essential Cookies</h3>
    <p className="text-gray-300 mb-2">Required for:</p>
    <ul className="list-disc text-gray-300 text-left">
      <li>Login</li>
      <li>Security</li>
      <li>Core app navigation</li>
    </ul>
    <p className="text-gray-500 mt-2">These cannot be disabled.</p>
  </div>

  <div className="bg-white/2 p-6 rounded-2xl border border-white/10 
                  w-full max-w-md h-[260px]
                  flex flex-col items-center justify-start text-center">
    <h3 className="text-2xl font-semibold text-white mb-2">Performance & Analytics Cookies</h3>
    <p className="text-gray-300 mb-2">Used to:</p>
    <ul className="list-disc text-gray-300 text-left">
      <li>Understand user interactions</li>
      <li>Improve speed & navigation</li>
      <li>Detect bugs or crashes</li>
    </ul>
  </div>

  <div className="bg-white/2 p-6 rounded-2xl border border-white/10 
                  w-full max-w-md h-[260px]
                  flex flex-col items-center justify-start text-center">
    <h3 className="text-2xl font-semibold text-white mb-2">Functionality Cookies</h3>
    <p className="text-gray-300 mb-2">Remember:</p>
    <ul className="list-disc text-gray-300 text-left">
      <li>Your skin quiz answers</li>
      <li>Preferences like language or filters</li>
    </ul>
  </div>

  <div className="bg-white/2 p-6 rounded-2xl border border-white/10 
                  w-full max-w-md h-[260px]
                  flex flex-col items-center justify-start text-center">
    <h3 className="text-2xl font-semibold text-white mb-2">Advertising / Marketing Cookies</h3>
    <p className="text-gray-300 mb-2">Used to:</p>
    <ul className="list-disc text-gray-300 text-left">
      <li>Personalize promotional content</li>
      <li>Show product recommendations</li>
      <li>Track campaign performance</li>
    </ul>
    <p className="text-gray-500 mt-2">You may opt out anytime.</p>
  </div>

</div>

</motion.div>


            {/* Separator */}
            <div className="w-full h-px bg-white/10 my-6"></div>

            {/* Third-Party Cookies */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h2 className="text-4xl font-bold text-purple-300 mb-2">Third-Party Cookies</h2>
              <p className="text-gray-300">We may use trusted third-party services, such as:</p>
              <ul className="list-disc ml-6 text-gray-300 inline-block text-left">
                <li>Analytics (Google Analytics, Mixpanel)</li>
                <li>Marketing platforms</li>
                <li>Cloud hosting providers</li>
              </ul>
              <p className="text-gray-300">These third parties may place cookies to support their services.</p>
            </motion.div>

            {/* Separator */}
            <div className="w-full h-px bg-white/10 my-6"></div>

            {/* Updates */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h2 className="text-4xl font-bold text-purple-300 mb-2">Updates to This Cookie Policy</h2>
              <p className="text-gray-300">
                We may update this policy as needed based on new features or legal requirements.
              </p>
            </motion.div>

            {/* Separator */}
            <div className="w-full h-px bg-white/10 my-6"></div>

            {/* Contact */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <h2 className="text-4xl font-bold text-purple-300 mb-2">Contact Us</h2>
              <p className="text-blue-400 text-lg">📩 
                <a   
                href="https://mail.google.com/mail/?view=cm&fs=1&to=askzyla.zeaisoft@gmail.com"
                target="_blank"
                rel="noopener noreferrer"> askzyla.zeaisoft@gmail.com</a>
              </p>
            </motion.div>

          </div>
        </section>
      </div>

      {/* <Footer /> */}
      
    </>
  );
}
