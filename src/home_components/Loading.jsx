import React, { useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import ZylaImg from "../assets/Zyla.png";
import { ThemeContext } from "../contexts/ThemeContext";

export default function Loading() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract everything passed through state
  const nextPage = location.state?.nextPage || "/";
  const extraState = location.state || {};

  const progressBarRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const progress = useMotionValue(0);

  // Zyla movement
  const zylaX = useTransform(progress, (p) => {
    const width = progressBarRef.current?.offsetWidth || 300;
    return p * width - 35;
  });

  const zylaRotate = useTransform(progress, [0, 1], [-20, 20]);

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: 1,
      ease: "easeInOut",
      onComplete: () => {
        // Forward state to next page
        navigate(nextPage, { state: extraState });
      },
    });

    return () => controls.stop();
  }, [navigate, nextPage, progress]);

  return (
    <div
      className={`h-screen w-screen flex flex-col items-center justify-center overflow-hidden perspective-1000
        ${isLight ? "bg-[#e9d9e3]" : "bg-linear-to-b from-[#0B0014] via-[#1A0D28] to-[#0B0014]"}
      `}
    >
      <div
        ref={progressBarRef}
        className="relative w-[300px] h-3 border-2 border-white rounded-full mb-6"
        style={{ perspective: "800px" }}
      >
        <motion.div
          className={`h-full origin-left rounded-full shadow-xl ${
            isLight ? "bg-[#1d0e2d]" : "bg-white"
          }`}
          style={{ scaleX: progress }}
        />

        <motion.img
          src={ZylaImg}
          alt="zyla-loading"
          className="absolute -top-8 w-[70px] drop-shadow-2xl"
          style={{ x: zylaX, rotateY: zylaRotate }}
        />
      </div>

      <motion.div
        className={`text-lg font-semibold ${
          isLight ? "text-[#1d0e2d]" : "text-white"
        }`}
        animate={{ rotateX: [0, 15, -15, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Loading...
      </motion.div>
    </div>
  );
}
