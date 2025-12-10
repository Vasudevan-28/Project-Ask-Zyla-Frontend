import React from "react";
import { motion } from "framer-motion";

const StorySection = () => {
  return (
    <section
      id="my-story"
      className="
        relative min-h-[600px] bg-[#423550] backdrop-blur-sm 
        p-4 sm:p-6 
        flex items-center justify-center overflow-hidden
      "
    >
      {/* Top Neon Glow */}
      <div
        className="absolute top-0 left-0 w-full h-14 sm:h-20"
        style={{
          background: "linear-gradient(to bottom, #7D45B8 0%, transparent 100%)",
          filter: "blur(70px)",
        }}
      />

      {/* Breathing background aura */}
      <motion.div
        animate={{
          opacity: [0.35, 0.55, 0.35],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  
          w-[260px] h-[260px] 
          sm:w-[430px] sm:h-[430px] 
          rounded-full
        "
        style={{ background: "#7D45B8", filter: "blur(200px)" }}
      ></motion.div>

      <motion.div
        className="
          max-w-2xl text-center space-y-1 relative z-10 
          px-2 sm:px-0
        "
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.94,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ once: true, amount: 0.35 }}
      >
        {/* Heading shimmer */}
        <motion.h2
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="
            text-2xl sm:text-3xl 
            font-bold tracking-wide pb-4 
            bg-clip-text text-transparent
          "
          style={{
            backgroundImage:
              "linear-gradient(90deg, #ffffff, #E2C8FF, #ffffff)",
            backgroundSize: "200% 100%",
          }}
        >
          MY STORY
        </motion.h2>

        {/* Text section */}
        {/* <div className="space-y-3 text-sm sm:text-base leading-relaxed px-1 sm:px-0">
          <p className="font-medium text-[#E8E0F0]">
            Hi love! I’m{" "}
            <span className="font-semibold text-white">Zyla 🤍</span> — your skincare
            bestie who actually gets you.
          </p>

          <p className="font-medium text-[#E8E0F0]">
            I’m handcrafted with one simple goal:
            <span className="block font-medium text-white mt-1">
              to give you the right routine without letting you experiment on your
              precious skin.
            </span>
          </p>

          <p className="font-medium text-[#E8E0F0]">
            Dry today, oily tomorrow, stress breakout next week?
            <span className="block font-medium text-white mt-1">
              I evolve with you… no drama, no confusion.
            </span>
          </p>

          <p className="font-medium text-[#E8E0F0]">
            I hype you, guide you, and glow you up — because good skin isn’t magic…
            <span className="block font-medium text-white mt-1">it’s me + you.</span>
          </p>

          <p className="font-medium text-[#E8E0F0]">
            Think of me as your personal skincare problem solver. All your skincare
            problems… one smart solution —
            <span className="font-semibold text-white"> Zyla 🤍</span>
          </p>

          <p className="text-right text-white font-medium mt-4 text-sm sm:text-base">
            – XoXo Zyla 🤍
          </p>
        </div> */}



          <div className="space-y-3 text-sm sm:text-base leading-relaxed px-1 sm:px-0">
  <p className="font-medium text-[#E8E0F0]">
    One fine day ✨, a beauty lover started facing some skin problems. Feeling worried, 
    Jamie talked to their friends ✦ but the only reply was, 
    “Try this cream, it worked for my cousin!”… not helpful at all 😕.
  </p>

  <p className="font-medium text-[#E8E0F0]">
    Jamie searched online and even asked other chatbots ✦ but some gave wrong advice, 
    some suggested risky methods, and none were dermatologist-approved 😟.
  </p>

  <p className="font-medium text-[#E8E0F0]">
    Feeling more confused, Jamie thought, 
    <span className="block font-medium text-white mt-1">
      “I wish there was a safe, friendly chatbot that gives clear, correct, and skin-trusted answers.”
    </span>
  </p>

  <p className="font-medium text-[#E8E0F0]">
    And that’s how I was born ✦ Zyla, the smart and caring skin chatbot! 🤖✨
  </p>

  <p className="font-medium text-[#E8E0F0]">
    I don’t confuse, I don’t scare ✦ I simply guide, explain, and care 🌸. 
    <span className="block font-medium text-white mt-1">
      Friendly like a real friend ✦ smart like a skincare coach ✦ and yes, dermatologist-trusted too! 💖
    </span>
  </p>

  <p className="font-medium text-[#E8E0F0]">
    I’m Zyla ✦ your trusted skin buddy ✨
  </p>

  <p className="text-right text-white font-medium mt-4 text-sm sm:text-base">
    - XoXo Zyla 🤍
  </p>
</div>




      </motion.div>
    </section>
  );
};

export default StorySection;
