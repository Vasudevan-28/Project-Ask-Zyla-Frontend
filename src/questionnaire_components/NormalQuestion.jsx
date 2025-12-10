import React from "react";

const NormalQuestion = ({ question, selected, handleOptionSelect, isLight }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 px-8 pt-5">
      {question.options.map((opt) => {
        const isSelected = Array.isArray(selected[question.id])
          ? selected[question.id].includes(opt.id)
          : selected[question.id] === opt.id;
        return (
          <label
            key={opt.id}
            className={`border-2 rounded-b-2xl p-2 cursor-pointer transition-all ${
              isSelected
                ? `border-[rgba(233,217,227,1)] ${isLight ? "bg-[rgba(233,217,227,1)]" : "bg-white/60"} shadow-md`
                : `border-[rgba(233,217,227,0.3)]    ${isLight ? "bg-transparent hover:bg-[rgba(233,217,227,0.3)]" : "bg-white/10 hover:bg-white/60"} `
            }`}
          >
            <div className="flex items-center  gap-3 p-0.5">
              <input
                type="checkbox"

                checked={isSelected}
                onChange={() => handleOptionSelect(question.id, opt.id)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all ${
                  isSelected
                    ? "border-[rgba(153,74,151,1)] bg-[rgba(153,74,151,1)]"
                    : `border-[rgba(153,74,151,0.35)] bg-transparent `
                }`}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
              <h2 className="font-bold text-lg">{opt.title}</h2>
            </div>
            {opt.text && <p className={`text-sm ${isLight ? "text-[rgba(153,74,151,1)]" : "text-slate-200/80"} p-1 pl-7`}>{opt.text}</p>}
          </label>
        );
      })}
    </div>
  );
};

export default NormalQuestion;
