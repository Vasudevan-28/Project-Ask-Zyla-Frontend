import React from "react";
import Lightbutton from "./Lightbutton";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

const AccessPathSection = () => {

  const navigate = useNavigate()

  const steps = [
    {
      num: 1,
      text: "Sign in and let me meet you. Google, Apple, email… however you want to say hello.",
      btn: "SIGN IN"
    },
    {
      num: 2,
      text: "Tell me about your skin and I’ll craft your routine instantly or we can build one together if you love being hands-on.",
      btn: "GENERATE ROUTINE"
    },
    {
      num: 3,
      text: "Save your routines, swap products, update your skin mood, and I’ll keep shaping your skincare as your needs change.",
      btn: "DASHBOARD"
    }
  ];

  const entranceVariants = [
    { hidden: { opacity: 0, y: -50, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 12, delay: 0.2 } } },
    { hidden: { opacity: 0, x: -50, scale: 0.7 }, visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 14, delay: 0.4 } } },
    { hidden: { opacity: 0, y: 50, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 140, damping: 10, delay: 0.6 } } }
  ];

  const playfulMotion = (delay = 0) => ({
    y: [0, -6, 3, 0],
    rotate: [0, -4, 4, 0],
    scale: [1, 1.04, 0.96, 1],
    transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay }
  });

  const hoverDance = [
    { rotate: [-8, 8, -4, 4, 0], scale: [1, 1.08, 0.95, 1], y: [0, -4, 2, 0], transition: { duration: 0.8 } },
    { rotate: [0, 6, -6, 3, 0], scale: [1, 1.06, 0.97, 1], y: [0, 5, -3, 0], transition: { duration: 0.8 } },
    { rotate: [4, -4, 8, -6, 0], scale: [1, 1.1, 0.93, 1], y: [0, -3, 4, 0], transition: { duration: 0.8 } }
  ];

  return (


    <section id="access-path" className="relative min-h-[600px] bg-[#423550] px-4 sm:px-6 py-20 text-center overflow-hidden">
      
      <motion.div
        className="absolute top-0 left-0 w-full h-20"
        style={{
          background: "linear-gradient(to bottom, #7D45B8 0%, transparent 100%)",
          filter: "blur(70px)"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold tracking-wide bg-white bg-clip-text text-transparent pb-10 relative z-10">
        YOUR GLOW JOURNEY - STEP BY STEP !
      </h2>
<div className="flex-col flex" >

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-26 relative z-10">
        {steps.map((step, index) => (
          <motion.div
            key={step.num}
            className="relative flex flex-col items-center w-full md:w-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={entranceVariants[index]}
          >
            {/* Number Circle */}
            <motion.div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold
                bg-linear-to-br from-[#1B0E2A] to-[#3A1C5C] border-2 border-[#3A1C5C] shadow-[0_0_12px_rgba(58,28,92,0.2)]"
              animate={playfulMotion(index * 0.2)}
              whileHover={hoverDance[index]}
            >
              {step.num}
            </motion.div>

            {/* Inner Box */}
            <motion.div
  className="mt-2 p-2 sm:p-4 rounded-xl bg-white/10 shadow-[#3A1C5C] w-full max-w-[290px] sm:max-w-[350px] md:max-w-[400px]"
  animate={playfulMotion(index * 0.1)}
  whileHover={hoverDance[index]}
>
  <div
    className="rounded-lg bg-linear-to-br from-[#1B0E2A] to-[#3A1C5C] border border-[#1B0E2A] shadow-[0_0_10px_rgba(58,28,92,0.35)]
      w-68 h-auto sm:h-[190px] flex flex-col justify-between p-3 sm:p-4"
  >
    <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed text-center pb-2">
      {step.text}
    </p>

    <Lightbutton onClick={() => navigate('/signup')} >
      {step.btn}
    </Lightbutton>
  </div>
</motion.div>
          </motion.div>
        ))}
{/* <div className="h-40 w-80 bg-black">        </div> */}


</div>
      </div>
    </section>
  );
};

export default AccessPathSection;
