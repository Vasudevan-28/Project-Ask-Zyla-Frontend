import React, {useContext} from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const TextAreaQuestion = ({ placeholder, value, setValue}) => {
      const { theme } = useContext(ThemeContext);
    const isLight = theme === "light";
  return (
    <textarea
      placeholder={placeholder}
      className={`m-8 w-full max-w-[900px] p-4 border rounded-md
      resize-none overflow-auto 
         whitespace-pre-wrap wrap-break-words leading-relaxed focus:outline-none 
         ${isLight ? "border-[rgba(153,74,151,1)] text-slate-900/80 focus:border-[rgba(153,74,151,1)] focus:ring-2 focus:ring-[rgba(153,74,151,0.4)]" 
             : "text-slate-200/80 bg-white/10"}`}
      rows={3}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default TextAreaQuestion;
