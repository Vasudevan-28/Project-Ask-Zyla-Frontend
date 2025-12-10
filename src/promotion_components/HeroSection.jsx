import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lightbutton from "./Lightbutton";
import { quotes } from "../data/quotes";

import ZylaPromotion from "../zyla_components/ZylaPromotion"

const HeroSection = () => {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 600);
    }, 60000);

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 600);
    }, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const lineVariant = {
    hidden: { opacity: 0, y: 30, rotate: -2 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { delay: i * 0.2, type: "spring", stiffness: 120 },
    }),
  };

  const hoverWiggle = {
    scale: 1.05,
    rotate: [0, 2, -2, 2, -2, 0],
    transition: { duration: 0.4 },
  };

  return (
    <section
  id="main"
  className="
    relative overflow-hidden 
    min-h-[600px] 
    bg-[#1A0D28] 
    pb-16 
    px-4 sm:px-6
    pt-[70px] md:pt-[110px] lg:pt-[60px]   
  "
>
      {/* Left neon glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute left-0 top-0 h-full w-12 sm:w-20"
        style={{
          background: "linear-gradient(to right, #7D45B8 0%, transparent 100%)",
          filter: "blur(90px)",
        }}
      />

      {/* Right neon glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute right-0 top-0 h-full w-12 sm:w-20"
        style={{
          background: "linear-gradient(to left, #7D45B8 0%, transparent 100%)",
          filter: "blur(90px)",
        }}
      />

      {/* Quotes full width */}
      <motion.div
        animate={{ opacity: fade ? 1 : 0 }}
        transition={{ duration: 0.7 }}
        className="
          absolute left-0 right-0 
          w-screen 
          py-1 sm:py-3 
          text-center 
          px-2
          bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.15)_25%,rgba(26,13,40,1)_80%,rgba(26,13,40,1)_100%)]
        "
      >
        <h3 className="text-white text-lg sm:text-2xl md:text-3xl font-semibold italic">
          {quotes[quoteIndex]}
        </h3>
      </motion.div>

      {/* Headline */}
      <div className="flex relative">

      
      <motion.div
        initial="hidden"
        animate="visible"
        className="
          space-y-1.5 
          pl-3 sm:pl-10 
          pt-32 sm:pt-24 
          pb-2
        "
      >
        {["Dry Today?", "Oily Tomorrow?", "Stress Breakout next week?"].map(
          (text, i) => (
            <motion.p
              key={i}
              custom={i}
              variants={lineVariant}
              whileHover={hoverWiggle}
              className="
                text-3xl sm:text-4xl md:text-5xl 
                text-white font-bold leading-tight
              "
            >
              {text.split(" ")[0] && (
                <span className="bg-linear-to-r from-[#C9BAD9] to-[#5E4D71] bg-clip-text text-transparent font-bold">
                  {text.split(" ")[0]}
                </span>
              )}
              <span className="text-white">
                {" " + text.split(" ").slice(1).join(" ")}
              </span>
            </motion.p>
          )
        )}
      </motion.div>
<div className="absolute top-18 right-10">

      <ZylaPromotion />
</div>
</div>
      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="
          text-xs sm:text-sm md:text-base 
          text-white 
          pl-3 sm:pl-10 
          pt-1 pb-3 
          leading-relaxed
        "
      >
        Zyla learns your skin’s unique rhythm.
        <br />
        Zyla isn’t just an app — it’s your
        <br />
        intelligent skincare companion that grows with you every day.
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.07 }}
        className="pl-3 sm:pl-9 pt-2"
      >
        <Lightbutton onClick={() => navigate("/TrialChat")}>
          TRY ZYLA'S MAGIC 🤍
        </Lightbutton>
      </motion.div>
    </section>
  );
};

export default HeroSection;
