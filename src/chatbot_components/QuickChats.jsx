import { useEffect } from "react";

const QUICK_QUESTIONS = [
  "How does niacinamide improve my skin?",
  "What’s the best routine for oily skin?",
  "Can I use retinol and vitamin C together?",
  "How do I reduce acne scars effectively?",
  "Which sunscreen is best for daily use?",
  "How can I fix an uneven skin tone?",
  "What ingredients should I avoid for sensitive skin?",
  "How do I build a beginner skincare routine?",
  "Is exfoliating daily bad for my skin?",
  "How do I know my skin type?",
];

export default function QuickChats({ setInput, bgTheme }) {
  const [randomQs] = useEffect(() => {
    const shuffled = [...QUICK_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, []);

  return (
    <div className="sm:hidden lg:block w-60 rounded-2xl m-1 p-4 relative overflow-hidden">
      <div className="mb-6 mt-20 relative z-10">
        <h2
          className={`text-base mb-4 tracking-wide font-semibold ${
            bgTheme === "light" ? "text-black" : "text-white"
          }`}
        >
          Quick Chats
        </h2>

        {randomQs.map((q, index) => (
          <button
            key={index}
            className="w-full text-left p-3 mb-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 
                       hover:bg-white/20 hover:border-white/30 transition-all duration-300 
                       shadow-sm hover:shadow-md text-sm text-white font-medium cursor-pointer"
            onClick={() => setInput(q)}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
