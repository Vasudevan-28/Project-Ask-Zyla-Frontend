import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ThemeContext } from "../contexts/ThemeContext";
import { SkinProfileApiService } from "../services/skin_profile_api";

const NextButton = ({ current, setCurrent, questions, selected, setSelected, q }) => {
      const { theme } = useContext(ThemeContext);
    const isLight = theme === "light";
  const auth = getAuth()
  const navigate = useNavigate();
  const cycleSkipped = useRef(false); // Track skip state for menstrual cycle Q

   const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
      });
  
      return () => unsub();
    }, [auth]);

  const isDisabled = (() => {
    if (q.type === "cycle") {
      // Cycle: check all sub-questions are answered (unless skipped)
      if (cycleSkipped.current) return false;
      return !(
        selected["cycle-0"] &&
        Array.isArray(selected["cycle-1"]) &&
        selected["cycle-1"].length > 0 &&
        selected["cycle-2"]
      );
    } else if (Array.isArray(selected[q.id])) {
      // Multi-select normal question
      return selected[q.id].length === 0;
    } else if (q.type === "textarea" || q.type === "symptoms") {
      // TextArea or symptoms type
      return selected[q.id] === undefined;
    } else {
      // Single-select normal question
      return selected[q.id] === undefined;
    }
  })();


  const formatSelectedAnswers = () => {
    const formatted = {};

    // Q1
    if (Array.isArray(selected[1]) && selected[1].length) {
      formatted.concerns = selected[1]
        .map(id => questions[0].options.find(opt => opt.id === id)?.title)
        .filter(Boolean);
    } else {
      formatted.concerns = [];
    }

    // Q2
    if (Array.isArray(selected[2]) && selected[2].length) {
      formatted.skinType = selected[2]
        .map(id => questions[1].options.find(opt => opt.id === id)?.title)
        .filter(Boolean);
    } else {
      formatted.skinType = [];
    }

    // Q3
    if (selected[3]) {
      const opt = questions[2].options.find(opt => opt.id === selected[3]);
      formatted.skincareRoutine = opt?.title || "";
    } else {
      formatted.skincareRoutine = "";
    }

    // Q4
    if (Array.isArray(selected[4]) && selected[4].length) {
      formatted.goals = selected[4]
        .map(id => questions[3].options.find(opt => opt.id === id)?.title)
        .filter(Boolean);
    } else {
      formatted.goals = [];
    }

    // Q5 (allergies)
    if (selected[5] === 1) {
      // Yes
      formatted.allergies = {
        hasAllergies: true,
        details: selected.extraQ5 || ""
      };
    } else {
      // No or not answered
      formatted.allergies = {
        hasAllergies: false,
        details: ""
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
    reminders: null
  };
} else {
  formatted.menstrualCycle = {
    hasMenstrualCycle: true,
    nextCycle: selected["cycle-0"],
    skinBehavior: Array.isArray(selected["cycle-1"]) 
      ? selected["cycle-1"] 
      : [],                   
    reminders: selected["cycle-2"] === "Yes, send me reminders"
  };
}



    // Q7 (symptoms)
    if (selected[7] === 1) {
      formatted.otherSymptoms = {
        hasSymptoms: true,
        details: selected.extraQ7 || ""
      };
    } else {
      formatted.otherSymptoms = {
        hasSymptoms: false,
        details: ""
      };
    }

    return formatted;
  };

  const buildSkinProfilePayload = (formatted, userId) => ({
    skinProfileData: {
      userId: userId,
      ...formatted,
    },
  });

  
  const handleNext = async () => {
  if (isDisabled) return;

  if (current < questions.length - 1) {
    setCurrent(current + 1);
  } else {
    const userIdFromAuth = user?.uid;
    const formatted = formatSelectedAnswers();
    const payload = buildSkinProfilePayload(formatted, userIdFromAuth);

    try {
      const data = await SkinProfileApiService.saveSkinAnswers(userIdFromAuth, payload);
      console.log("Saved to DB:", data);
      navigate("/skinProfile");
    } catch (err) {
      console.error("Error saving skin answers:", err);
    }
  }
};


  
  // const handleNext = () => {
  //   if (isDisabled) return; 
  //   if (current < questions.length - 1) {
  //     setCurrent(current + 1);
  //   } else {
  //     // Finished all questions → Prepare payload
  //     // const userIdFromAuth = "user-leo";
  //     const userIdFromAuth = user?.uid
  //     const formatted = formatSelectedAnswers();
  //     const payload = buildSkinProfilePayload(formatted, userIdFromAuth);

  //     console.log("Final Payload to send:", payload);

  //     fetch(`http://localhost:8484/chatApp/skin-answers-add/${userIdFromAuth}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     })
  //       .then(res => res.json())
  //       .then(data => {
  //         console.log("Saved to DB:", data);
  //         navigate("/skinProfile");
  //       })
  //       .catch(err => console.error(err));

  //     // alert("Console paaru");
  //   }
  // };

  // --- SKIP for cycle question ---
  
  const handleSkip = () => {
    if (q.type === "cycle") {
      cycleSkipped.current = true;
      // Clear any cycle- keys when skipping for a truly clean submit
      setSelected(prev => {
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
    <div className="fixed bottom-5 right-5  flex gap-3 z-50">
      {/* Skip button only for cycle questions */}
      {q.type === "cycle" && (
        <button
          onClick={handleSkip}
          className={`px-8 py-1.5 rounded font-semibold text-white  transition duration-300 transform hover:scale-105
            ${isLight ? "bg-linear-to-r from-[#9c4f9a] to-[#4b1839]" : "bg-white/10"}    
            `}
        >
          SKIP
        </button>
      )}

      <button
        onClick={handleNext}
        disabled={isDisabled}
        className={`px-8 py-1.5 rounded font-semibold text-white transition duration-300 transform hover:scale-105 ${
          !isDisabled
            ? ` ${isLight ? "bg-linear-to-r from-[#9c4f9a] to-[#4b1839]" : "bg-white/10"} `
            : `${isLight ? "bg-linear-to-r from-[#9c4f9a] to-[#4b1839] cursor-not-allowed opacity-50" : "bg-white/10 cursor-not-allowed opacity-50"} `
        }`}
      >
        {current < questions.length - 1 ? "NEXT" : "FINISH"}
      </button>
    </div>
  );
};

export default NextButton;