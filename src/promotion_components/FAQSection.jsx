import React, { useState } from "react";
import { faqData } from "../Data/faq";
import { motion } from "framer-motion";

const FAQSection = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <section className="relative min-h-[600px] py-20 bg-[#1A0D28] overflow-hidden" id="faq">
      {/* Left neon glow */}
      <motion.div
        className="absolute left-0 top-0 h-full w-16 sm:w-20"
        style={{
          background: "linear-gradient(to right, #7D45B8 0%, transparent 100%)",
          filter: "blur(90px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* Right neon glow */}
      <motion.div
        className="absolute right-0 top-0 h-full w-16 sm:w-20"
        style={{
          background: "linear-gradient(to left, #7D45B8 0%, transparent 100%)",
          filter: "blur(90px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      <div className="mx-auto p-6 sm:p-12 relative z-10">
        <h2 className="text-white text-2xl sm:text-3xl font-bold mb-6 uppercase text-center">
          SKIN ASSISTANT FAQ
        </h2>

        <div className="space-y-2">
          {faqData.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl shadow-lg transition-all duration-300 bg-white/10 border
                ${openQuestion === item.id ? 'border-[#C9BAD9]' : 'border-[#1A0D28]'}`}
            >
              {/* Question Header */}
              <button
                className="w-full text-left p-3 sm:p-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleQuestion(item.id)}
              >
                <span className={`text-base sm:text-lg font-semibold transition-colors duration-300 ${openQuestion === item.id ? 'text-white' : 'text-[#E8E0F0]'}`}>
                  {item.question}
                </span>
                <span className="text-white text-xl sm:text-2xl font-bold transition-transform duration-300">
                  {openQuestion === item.id ? '−' : '+'}
                </span>
              </button>

              {/* Answer Content */}
              {openQuestion === item.id && (
                <div className="overflow-hidden px-3 sm:px-6 pb-3 sm:pb-6 transition-all duration-500">
                  <p className="text-[#C9BAD9] text-sm sm:text-base leading-relaxed border-t border-[#5C3A8D] pt-3 sm:pt-4 mt-2">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
