import React, { useContext} from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import ZaLogo from "../assets/ZaLogo.png";
import ZylaToggleImg from "../assets/ZylaToggle.png";

export default function HeaderNew() {
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
        "backdrop-blur-2xl    border-0.5 backdrop-2xl bg-linear-to-r from-white  to-[#1c0d25] "
      }
    >
      {/* Brand */}
      <div className="flex items-center gap-2">
        <img src={ZaLogo} alt="ZA logo" className="h-[38px]  w-auto block" />
        <div className="font-['Playfair_Display'] -mb-1 font-bold leading-[0.9] select-none">
          <div className="text-[14px]  text-[#1c0d25]">Ask</div>
          <div className="text-[24px] text-[#1c0d25] ">Zyla</div>
        </div>
      </div>
{/* text-[#1c0d25] */}
    
    

    </header>
  </>
);

}
