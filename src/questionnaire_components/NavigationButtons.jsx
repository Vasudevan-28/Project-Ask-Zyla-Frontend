import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import { SkinProfileApiService } from "../services/skin_profile_api";

import { useAuth } from "../contexts/authContext";

const NextButton = ({ current, setCurrent, questions, selected, setSelected, q }) => {

  const { refreshProfile } = useAuth()

  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  const navigate = useNavigate();
  const cycleSkipped = useRef(false);


  const hasText = (val) => {
    return typeof val === "string" && val.trim().length > 0;
  };

  const isDisabled = (() => {
    
    if (q.type === "cycle") {
      if (cycleSkipped.current) return false;
      return !(
        selected["cycle-0"] &&
        Array.isArray(selected["cycle-1"]) &&
        selected["cycle-1"].length > 0 &&
        selected["cycle-2"]
      );
    }

    if (q.id === 5) {
      if (selected[5] === 1) {
        return !hasText(selected.extraQ5);
      }
      return selected[5] === undefined;
    }

    if (q.id === 7) {
      if (selected[7] === 1) {
        return !hasText(selected.extraQ7);
      }
      return selected[7] === undefined;
    }

    if (q.type === "textarea" || q.type === "symptoms") {
      return !hasText(selected[q.id]);
    }

    // Multi-select normal question
    if (Array.isArray(selected[q.id])) {
      return selected[q.id].length === 0;
    }

    // Single-select normal question
    return selected[q.id] === undefined;
  })();

  const formatSelectedAnswers = () => {
    const formatted = {};

    // Q1
    if (Array.isArray(selected[1]) && selected[1].length) {
      formatted.concerns = selected[1]
        .map((id) => questions[0].options.find((opt) => opt.id === id)?.title)
        .filter(Boolean);
    } else {
      formatted.concerns = [];
    }

    // Q2
    if (Array.isArray(selected[2]) && selected[2].length) {
      formatted.skinType = selected[2]
        .map((id) => questions[1].options.find((opt) => opt.id === id)?.title)
        .filter(Boolean);
    } else {
      formatted.skinType = [];
    }

    // Q3
    if (selected[3]) {
      const opt = questions[2].options.find((opt) => opt.id === selected[3]);
      formatted.skincareRoutine = opt?.title || "";
    } else {
      formatted.skincareRoutine = "";
    }

    // Q4
    if (Array.isArray(selected[4]) && selected[4].length) {
      formatted.goals = selected[4]
        .map((id) => questions[3].options.find((opt) => opt.id === id)?.title)
        .filter(Boolean);
    } else {
      formatted.goals = [];
    }

    // Q5 (allergies)
    if (selected[5] === 1) {
      // Yes
      formatted.allergies = {
        hasAllergies: true,
        details: selected.extraQ5 || "",
      };
    } else {
      formatted.allergies = {
        hasAllergies: false,
        details: "",
      };
    }

    const hasAllCycles =
      selected["cycle-0"] &&
      Array.isArray(selected["cycle-1"]) &&
      selected["cycle-1"].length > 0 &&
      selected["cycle-2"];

    if (cycleSkipped.current || !hasAllCycles) {
      formatted.menstrualCycle = {
        hasMenstrualCycle: false,
        nextCycle: null,
        skinBehavior: [],
        reminders: null,
      };
    } else {
      formatted.menstrualCycle = {
        hasMenstrualCycle: true,
        nextCycle: selected["cycle-0"],
        skinBehavior: Array.isArray(selected["cycle-1"]) ? selected["cycle-1"] : [],
        reminders: selected["cycle-2"] === "Yes, send me reminders",
      };
    }

    // Q7 (symptoms)
    if (selected[7] === 1) {
      formatted.otherSymptoms = {
        hasSymptoms: true,
        details: selected.extraQ7 || "",
      };
    } else {
      formatted.otherSymptoms = {
        hasSymptoms: false,
        details: "",
      };
    }

    return formatted;
  };

  const buildSkinProfilePayload = (formatted) => ({
    skinProfileData: {
      // userId: userId,
      ...formatted,
    },
  });

  const handleNext = async () => {
    if (isDisabled) return;

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // const userIdFromAuth = user?.uid;
      const formatted = formatSelectedAnswers();
      const payload = buildSkinProfilePayload(formatted);

      try {
        // const data = await SkinProfileApiService.saveSkinAnswers(userIdFromAuth, payload);
        const data = await SkinProfileApiService.saveSkinAnswers(payload);
        await refreshProfile()
        // localStorage.setItem("skin_profile", "true");
        console.log("Saved to DB:", data);
        navigate("/skinProfile", { replace: true });
      } catch (err) {
        console.error("Error saving skin answers:", err);
      }
    }
  };

  const handleSkip = () => {
    if (q.type === "cycle") {
      cycleSkipped.current = true;
      setSelected((prev) => {
        const clean = { ...prev };
        delete clean["cycle-0"];
        delete clean["cycle-1"];
        delete clean["cycle-2"];
        return clean;
      });
    }
    // Move to next
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="fixed z-50 flex gap-3 md:bottom-5 md:right-5 md:left-auto bottom-4 left-0 right-0 justify-center md:justify-end px-4"
      role="toolbar"
      aria-label="Question navigation"
    >
    
      {q.type === "cycle" && (
        <button
          onClick={handleSkip}
          className={`px-6 md:px-8 py-2 rounded font-semibold text-white transition duration-300 transform hover:scale-105 ${
            isLight ? "bg-linear-to-r from-[#9c4f9a] to-[#4b1839]" : "bg-white/10"
          }`}
        >
          SKIP
        </button>
      )}

      <button
        onClick={handleNext}
        disabled={isDisabled}
        className={`px-6 md:px-8 py-2 rounded font-semibold cursor-pointer text-white transition duration-300 transform hover:scale-105 ${
          !isDisabled
            ? isLight
              ? "bg-linear-to-r from-[#9c4f9a] to-[#4b1839]"
              : "bg-white/10"
            : isLight
            ? "bg-linear-to-r from-[#9c4f9a] to-[#4b1839] cursor-not-allowed opacity-50"
            : "bg-white/10 cursor-not-allowed opacity-50"
        }`}
        aria-disabled={isDisabled}
      >
        {current < questions.length - 1 ? "NEXT" : "FINISH"}
      </button>
    </div>
  );
};

export default NextButton;