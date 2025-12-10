import React, { useState, useEffect } from "react";
import { feedbackList } from "../Data/feedback";

const FeedbackSection = () => {
  const [fbIndex, setFbIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setFbIndex((prev) => (prev + 1) % feedbackList.length);
        setFade(true);
      }, 1000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="feedback" className="relative min-h-[600px] py-20 bg-[#423550] overflow-hidden">

      {/* Top Neon Glow */}
      <div
        className="absolute top-0 left-0 w-full h-20"
        style={{
          background: "linear-gradient(to bottom, #7D45B8 0%, transparent 100%)",
          filter: "blur(70px)",
        }}
      />

      {/* Section Header */}
      <div className="text-center mb-12 text-white relative z-10 px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold">
          What Our Customers Say About Zyla Skincare!
        </h2>
        <p className="mt-2 text-base sm:text-lg mx-auto text-gray-400">
          Our customers love how Ask Zyla transformed their skincare journey 
        </p>
        <p className="text-base sm:text-lg mx-auto text-gray-400">
          with personalized and visible results.
        </p>
      </div>

      {/* Feedback Container */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-8 max-w-5xl mx-auto relative z-10 px-4 sm:px-0">
        {/* Left Image */}
        <div
          className={`w-48 sm:w-60 h-48 sm:h-60 rounded-xl overflow-hidden shrink-0 relative transition-all duration-1200 ease-out transform ${
            fade
              ? "opacity-100 translate-x-0 translate-y-0"
              : "opacity-0 -translate-x-12 -translate-y-12"
          }`}
          style={{
            boxShadow:
              "0 8px 20px rgba(255,255,255,0.1), 0 0 60px rgba(255,255,255,0.05)",
          }}
        >
          <img
            src={feedbackList[fbIndex].img}
            alt="Client"
            className="w-full h-full border-2 border-white object-cover rounded-xl"
          />
        </div>

        {/* Right Review Box */}
        <div
          className={`w-full bg-linear-to-br from-[#1A0D28] via-[#261338] to-[#3A1F53] p-6 sm:p-8 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.08)] flex flex-col justify-between transition-all duration-3000 ease-out transform ${
            fade
              ? "opacity-100 translate-x-0 translate-y-0"
              : "opacity-0 translate-x-12 -translate-y-6"
          }`}
          style={{ minHeight: "15rem" }}
        >
          {/* Review Text */}
          <p
            className="text-gray-100 text-sm sm:text-lg overflow-y-auto"
            style={{ maxHeight: "12rem" }}
          >
            {feedbackList[fbIndex].text}
          </p>
          
          {/* Star Rating */}
          <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4 mt-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"
                viewBox="0 0 24 24"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.856L19.335 24 12 19.771 4.665 24 6 15.279 0 9.423l8.332-1.268z" />
              </svg>
            ))}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={feedbackList[fbIndex].img}
              alt="Client"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-lg"
            />
            <div>
              <div className="font-semibold text-white text-sm sm:text-base">
                {feedbackList[fbIndex].name}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                {feedbackList[fbIndex].role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
