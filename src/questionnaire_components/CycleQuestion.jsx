import React, {useContext} from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const CycleQuestion = ({ question, selected, setSelected }) => {
      const { theme } = useContext(ThemeContext);
    const isLight = theme === "light";

  return (
    <div className="px-8 py-6 space-y-6">
      {question.options.map((subQ, index) => (
        <div key={index}>
          <h3 className={`font-bold text-lg mb-3 ${isLight ? "text-[rgba(153,74,151,1)]" : "text-slate-50" }`}>
            {subQ.subq}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {subQ.opts.map((o, i) => {
              const isMulti = index === 1; // ✅ ONLY 2nd sub-question

              // MULTI SELECT CHECK
              const isSelected = isMulti
                ? (selected[`cycle-${index}`] || []).includes(o)
                : selected[`cycle-${index}`] === o;

              return (
                <label
                  key={i}
                  onClick={() => {
                    if (isMulti) {
                      // MULTI SELECT LOGIC
                      setSelected((prev) => {
                        const arr = prev[`cycle-${index}`] || [];
                        if (arr.includes(o)) {
                          return {
                            ...prev,
                            [`cycle-${index}`]: arr.filter((x) => x !== o),
                          };
                        }
                        return {
                          ...prev,
                          [`cycle-${index}`]: [...arr, o],
                        };
                      });
                    }
                  }}
                  className={`border-2 rounded-b-2xl p-2 cursor-pointer transition-all block ${
                    // isSelected
                    //   ? "border-[rgba(233,217,227,1)] bg-[rgba(233,217,227,1)] shadow-md"
                    //   : "border-[rgba(233,217,227,0.3)] hover:bg-[rgba(233,217,227,0.3)]"
                    isSelected
                ? `border-[rgba(233,217,227,1)] ${isLight ? "bg-[rgba(233,217,227,1)]" : "bg-white/60"} shadow-md`
                : `border-[rgba(233,217,227,0.3)]    ${isLight ? "bg-transparent hover:bg-[rgba(233,217,227,0.3)]" : "bg-white/10 hover:bg-white/60"} `
                  }`}
                >
                  <div className="flex items-center gap-3 p-0.5">

                    {/* HIDE INPUT FOR MULTI SELECT */}
                    {!isMulti && (
                      <input
                        type="radio"
                        name={`cycle-${index}`}
                        checked={isSelected}
                        onChange={() =>
                          setSelected((prev) => ({
                            ...prev,
                            [`cycle-${index}`]: o,
                          }))
                        }
                        className="sr-only"
                      />
                    )}

                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all ${
                        // isSelected
                        //   ? "border-[rgba(153,74,151,1)] bg-[rgba(153,74,151,1)]"
                        //   : "border-[rgba(153,74,151,0.35)] bg-transparent"
                        isSelected
                ? `border-[rgba(233,217,227,1)] ${isLight ? "bg-[rgba(233,217,227,1)]" : "bg-white/60"} shadow-md`
                : `border-[rgba(233,217,227,0.3)]    ${isLight ? "bg-transparent hover:bg-[rgba(233,217,227,0.3)]" : "bg-white/10 hover:bg-white/60"} `
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </span>

                    <h2 className={`font-semibold  ${isLight ? "text-[rgba(153,74,151,1)]" : "text-slate-50/50" }`}>{o}</h2>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CycleQuestion;
