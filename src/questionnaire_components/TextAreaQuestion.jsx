import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const TextAreaQuestion = ({ placeholder, value, setValue }) => {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  return (
    <textarea
      placeholder={placeholder}
      className={`mx-4 mt-6 md:mx-8 w-[90%] max-w-full md:max-w-[900px] p-3 md:p-4 border rounded-md  overflow-auto whitespace-pre-wrap leading-relaxed focus:outline-none ${
        isLight
          ? "border-[rgba(233,217,227,1)] placeholder-slate-500 text-slate-900/90 focus:border-[rgba(153,74,151,1)] focus:ring-2 focus:ring-[rgba(153,74,151,0.4)]"
          : "text-slate-200/80 bg-white/10"
      }`}
      rows={4}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default TextAreaQuestion;