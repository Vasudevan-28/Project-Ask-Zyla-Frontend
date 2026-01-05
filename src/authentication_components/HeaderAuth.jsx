
import ZaLogo from "../assets/ZaLogo-white.png";
import { useNavigate } from "react-router-dom";

export default function HeaderAuth() {

  const navigate = useNavigate()
  
return (
  <>
    <div
      className={
        " top-0 left-0 right-0  z-99999 bg-[#1A0D28]"
       
      }
    />

    {/* header */}
    <header
      role="banner"
      className={
        "left-0 right-0 top-1 h-18 flex items-center px-2 md:px-6 box-border z-99998 bg-transparent"
      }
    >
      <div className="flex items-center gap-0.5 cursor-pointer" 
       onClick={() => {
          navigate("/");
      }}
      >
        <img src={ZaLogo} alt="ZA logo" className="h-13 w-auto block " />
        <div className="font-['Playfair_Display'] -mb-1 mt-1 font-bold leading-[0.9] select-none">
          <div className="text-[12px] text-white">Ask</div>
          <div className="text-[22px] text-white">Zyla</div>
        </div>
      </div>    
    </header>
  </>
);

}
