import React, { useContext} from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import ZaLogo from "../assets/ZaLogo.png";
import ZylaToggleImg from "../assets/ZylaToggle.png";

export default function HeaderTrial() {
  //   const user = auth.currentUser;
  
  const { theme, toggleTheme } = useContext(ThemeContext); 

  const knobPositionRight = theme === "dark";

  
return (
  <>
    <div
      className={
        "fixed top-0 left-0 right-0 h-2 z-99999 bg-transparent"
        // (theme === "light"
        //   ? "bg-gray-100 shadow-sm"
        //   : "bg-[#1a0e28] shadow-sm")
      }
    />

    {/* header */}
    <header
      role="banner"
      className={
        "fixed left-0 right-0 top-2 h-14 flex items-center px-6 box-border z-[99998] " +
        "backdrop-blur-sm bg-white/95"
      }
    >
      {/* Brand */}
      <div className="flex items-center gap-0.5">
        <img src={ZaLogo} alt="ZA logo" className="h-[38px] w-auto block" />
        <div className="font-['Playfair_Display'] -mb-1 font-bold leading-[0.9] select-none">
          <div className="text-[14px] text-[#1c0d25]">Ask</div>
          <div className="text-[24px] text-[#1c0d25]">Zyla</div>
        </div>
      </div>
{/* text-[#1c0d25] */}
    
    

      {/* right controls */}
      <div className="ml-auto flex items-center gap-3 z-10">
        {/* Theme toggle */}
        <button
          className="relative w-[70px] h-8 p-[3px] rounded-full border-2 border-purple-300/60 bg-transparent flex items-center justify-between overflow-hidden"
          aria-label="Toggle theme"
          onClick={() => toggleTheme()}
          title="Toggle theme"
          type="button"
        >
          <div
            className={
              "absolute inset-0 rounded-full transition-colors duration-200 " +
              (theme === "light" ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]")
            }
            aria-hidden
          />
          <div className="absolute inset-0 pointer-events-none" />
          {/* knob */}
          <div
            className={
              "relative z-10 w-7 h-7 rounded-full bg-transparent shadow-md flex items-center justify-center transition-transform duration-200 " +
              (knobPositionRight ? "translate-x-[30px]" : "translate-x-px")
            }
          >
            <img
              src={ZylaToggleImg}
              alt="Zyla toggle"
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
        </button>

      </div>
    </header>
  </>
);

}
