import React, { useState, useEffect } from "react";
import { feedbackList } from "../../data/feedback";
import { motion } from "framer-motion";

export default function AboutFeedback() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const auto = setInterval(() => {
      setCurrent((prev) => (prev + 1) % feedbackList.length);
    }, 6000);
    return () => clearInterval(auto);
  }, []);

  return (
    <section className="relative w-full pb-14">
      {/* Large faded title */}
      <h2 className="text-[60px] sm:text-[120px] font-extrabold text-transparent bg-clip-text 
      bg-linear-to-r from-purple-400/40 via-white/60 to-pink-500/40 tracking-tight 
      text-center">
        FEEDBACK
      </h2>

      {/* Background glow shapes */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-600/10 blur-[100px] rounded-full"></div>
      <div className="absolute top-40 right-0 w-60 h-60 bg-purple-500/20 blur-[120px] rounded-full"></div>

      <div className="mt-[-60px] max-w-4xl mx-auto px-6 relative z-10 space-y-6">
        {feedbackList.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ 
              opacity: current === index ? 1 : 0, 
              scale: current === index ? 1 : 0.95, 
              y: current === index ? 0 : 20 
            }}
            transition={{ duration: 0.6 }}
            className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center
              ${current === index ? "block" : "hidden"}`}
          >
            {/* Floating Heart Icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl text-pink-300 opacity-90 drop-shadow-lg animate-bounce">
              ❤️
            </div>

            {/* Review Text */}
            <p className="text-gray-200 text-lg leading-relaxed max-w-2xl mx-auto">
              {item.text}
            </p>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 ">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl ${
                    star <= item.rating ? "text-yellow-400" : "text-yellow-400"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* User Info */}
            <div className="mt-6 flex flex-col items-center">
              <img
                src={item.img}
                className="w-16 h-16 rounded-full border border-pink-300 object-cover shadow-lg"
              />
              <h4 className="text-white font-bold mt-2">{item.name}</h4>
              <p className="text-gray-400 text-sm">{item.role}</p>
            </div>
          </motion.div>
        ))}

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-6">
          {feedbackList.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                current === i ? "bg-pink-300 scale-125" : "bg-gray-500"
              }`}
            ></button>
          ))}
        </div>

        <p className="text-gray-300 text-2xl text-center mt-2 relative z-10">
          Loved by our users 🤍 your experience matters!
        </p>
      </div>
    </section>
  );
}
