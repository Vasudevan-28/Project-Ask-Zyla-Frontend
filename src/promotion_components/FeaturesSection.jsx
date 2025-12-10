import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
// import InteractiveFeatures from "../team-pages/Components/InteractiveFeatures";
import InteractiveFeatures from "./InteractiveFeatures";

const FeaturesSection = () => {
  const contentRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.25 }
    );

    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      className="relative min-h-[600px]  bg-[#1A0D28] py-10 px-4 md:px-8 overflow-hidden"
    >
      {/* Left neon glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute left-0 top-0 h-full w-16 md:w-20"
        style={{
          background: "linear-gradient(to right, #7D45B8 0%, transparent 100%)",
          filter: "blur(80px)",
        }}
      />

      {/* Right neon glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute right-0 top-0 h-full w-16 md:w-20"
        style={{
          background: "linear-gradient(to left, #7D45B8 0%, transparent 100%)",
          filter: "blur(80px)",
        }}
      />

      <div
        ref={contentRef}
        className="max-w-6xl mx-auto relative z-10 w-full"
      >
        {/* Heading */}
        <div
          className={`text-center mb-8 px-2 md:px-0 transition-all duration-1000
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide bg-white bg-clip-text text-transparent">
            FEATURES
          </h2>
          <p className="mt-2 text-base md:text-xl text-gray-400 max-w-xl md:max-w-2xl mx-auto leading-relaxed px-2">
            Hey, it’s me, Zyla!🤍 I’ve been secretly watching your skin and here’s what I can do for you…
          </p>
        </div>

        {/* Interactive Features Component */}
        <InteractiveFeatures visible={visible} />

        {/* Bottom text */}
        <div
          className={`mt-8 text-center transition-all duration-1000 delay-300
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-base md:text-xl text-gray-400 px-4 leading-relaxed">
            Whatever your skin needs, I’m right here, your skincare friend forever 🤍.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
