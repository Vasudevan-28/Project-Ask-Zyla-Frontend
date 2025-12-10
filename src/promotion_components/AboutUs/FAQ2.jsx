import React, { useState } from "react";
import { faqData } from "../../data/faq";
import { motion } from "framer-motion";

export default function FAQSectionSoft() {
  const [open, setOpen] = useState(null);

  const toggleFAQ = (id) => {
    setOpen(open === id ? null : id);
  };

  return (
    <section className="relative w-full ">

      {/* Large faded title */}
      <h2 className="text-[60px] sm:text-[120px] font-extrabold text-transparent bg-clip-text 
      bg-linear-to-r from-purple-400/40 via-white/70 to-pink-500/40 tracking-tight 
      text-center ">
        QUICK ANSWERS
      </h2>

      <div className="mt-[-60px] max-w-7xl mx-auto px-6 space-y-4 relative z-10">

        {faqData.map((item) => (
          <motion.div
            key={item.id}
            onClick={() => toggleFAQ(item.id)}   
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl bg-white/5 backdrop-blur-xl 
              border border-white/10 p-5 sm:p-6 cursor-pointer
              transition-all duration-300 hover:border-purple-300/30"
          >
            {/* Row: Question + Arrow */}
            <div className="flex justify-between items-center">
              <span className="text-lg sm:text-xl font-semibold text-white">
                {item.question}
              </span>

              <motion.span
                animate={{ rotate: open === item.id ? 180 : 0 }}
                className="text-white text-2xl font-light"
              >
                ⌄
              </motion.span>
            </div>

            {/* Answer */}
            {open === item.id && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-3"
              >
                <p className="text-gray-300 text-base leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}

      </div>
    </section>
  );
}
