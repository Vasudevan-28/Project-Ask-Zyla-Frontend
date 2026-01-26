import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { questions } from "../data/questions";

import NormalQuestion from "../questionnaire_components/NormalQuestion";
import TextAreaQuestion from "../questionnaire_components/TextAreaQuestion";
import CycleQuestion from "../questionnaire_components/CycleQuestion";
import NextButton from "../questionnaire_components/NavigationButtons";
import HeaderQP from "../home_components/HeaderQP";

import { ThemeContext } from "../contexts/ThemeContext";

function Questionnaire() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});

  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const q = questions[current];

  const handleOptionSelect = (questionId, optionId) => {
    const multiSelectPages = [1, 2, 4];
    if (multiSelectPages.includes(questionId)) {
      setSelected((prev) => {
        const existing = prev[questionId] || [];
        return {
          ...prev,
          [questionId]: existing.includes(optionId)
            ? existing.filter((id) => id !== optionId)
            : [...existing, optionId],
        };
      });
    } else {
      setSelected((prev) => ({ ...prev, [questionId]: optionId }));
    }
  };

  return (
    <>
      <HeaderQP />
      <div
        className={`min-h-screen ${
          isLight ? "bg-white text-[rgba(153,74,151,1)] " : "bg-[#1d0e2d] text-slate-50 "
        }`}
      >
        <div
          className={`relative flex flex-col md:flex-row items-center md:justify-between pt-30 pb-10 md:pb-2 md:pt-8 px-4 md:px-20 ${
            isLight ? "bg-[#e9d9e3]" : "bg-white/10"
          }`}
        >
          {/* Back Button */}
          <button
            onClick={() =>
              current === 0 ? navigate(-1) : setCurrent(current - 1)
            }
            className={`absolute md:top-18  top-18 left-4 flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full ${
              isLight
                ? "bg-[rgba(233,217,227,1)] text-white border border-white/90"
                : "bg-white/10 text-slate-50"
            } text-xl shadow-sm hover:bg-[rgba(153,74,151,0.3)] transition-all`}
            aria-label="Back"
          >
            <FaArrowLeft />
          </button>

          {/* Question Title */}
          <div className="pt-2 md:pt-0 text-center md:text-left w-full md:max-w-[900px]">
            <h2 className="text-2xl md:text-4xl font-bold leading-tight px-2 md:px-0">
              {q.question}
            </h2>
          </div>

          {/* Question Image - hidden on small screens to save space */}
          {q.image && (
            <div className="hidden md:block ml-4">
              <img src={q.image} alt="illustration" className="w-40 md:w-50 shrink-0" />
            </div>
          )}
        </div>

        <div className="pb-24 md:pb-12">
          {/* Render NormalQuestion for normal type OR Q7 */}
          {(q.type === "normal" || q.id === 7) && (
            <NormalQuestion
              question={q}
              selected={selected}
              handleOptionSelect={handleOptionSelect}
              isLight={isLight}
            />
          )}

          {/* Render TextAreaQuestion */}
          {q.type === "textarea" && (
            <TextAreaQuestion
              placeholder={q.placeholder}
              value={selected[q.id] || ""}
              setValue={(val) => setSelected((prev) => ({ ...prev, [q.id]: val }))}
            />
          )}

          {/* Render CycleQuestion */}
          {q.type === "cycle" && (
            <CycleQuestion question={q} selected={selected} setSelected={setSelected} />
          )}

          {/* Question 5 textarea if YES */}
          {q.id === 5 && selected[5] === 1 && (
            <TextAreaQuestion
              placeholder="Please describe your concern..."
              value={selected.extraQ5 || ""}
              setValue={(val) => setSelected((prev) => ({ ...prev, extraQ5: val }))}
            />
          )}

          {/* Question 7 textarea if YES */}
          {q.id === 7 && selected[7] === 1 && (
            <TextAreaQuestion
              placeholder="Please describe additional symptoms..."
              value={selected.extraQ7 || ""}
              setValue={(val) => setSelected((prev) => ({ ...prev, extraQ7: val }))}
            />
          )}

          {/* NEXT / SKIP Buttons */}
          <NextButton
            current={current}
            setCurrent={setCurrent}
            questions={questions}
            selected={selected}
            setSelected={setSelected}
            q={q}
          />
        </div>
      </div>
    </>
  );
}

export default Questionnaire;