import React from "react";

const NormalQuestion = ({ question, selected, handleOptionSelect, isLight }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-8 pt-5">
      {question.options.map((opt) => {
        const isSelected = Array.isArray(selected[question.id])
          ? selected[question.id].includes(opt.id)
          : selected[question.id] === opt.id;
        return (
          <label
            key={opt.id}
            className={`border-2 rounded-b-2xl p-3 cursor-pointer transition-all block ${
              isSelected
                ? `border-[rgba(233,217,227,1)] ${isLight ? "bg-[rgba(233,217,227,1)]" : "bg-white/60"} shadow-md`
                : `border-[rgba(233,217,227,0.9)] ${isLight ? "bg-transparent hover:bg-[rgba(233,217,227,1)]" : "bg-white/10 hover:bg-white/60"}`
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleOptionSelect(question.id, opt.id)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 mt-1 rounded-full flex items-center justify-center border-2 transition-all ${
                  isSelected ? "border-[rgba(153,74,151,1)] bg-[rgba(153,74,151,1)]" : "border-[rgba(153,74,151,0.35)] bg-transparent"
                }`}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
              <div className="flex-1">
                <h2 className="font-bold text-base md:text-lg">{opt.title}</h2>
                {opt.text && (
                  <p className={`text-sm mt-1 ${isLight ? "text-[rgba(153,74,151,1)]" : "text-slate-200/80"} `}>
                    {opt.text}
                  </p>
                )}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default NormalQuestion;