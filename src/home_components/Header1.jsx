import React from "react";
import ZaLogo from "../assets/ZaLogo.png";
import "../index.css";

export default function Header() {
  return (
    <>
      <header
        role="banner"
        className="bg-white fixed top-1 left-0 w-full z-50 shadow-md  border-[#1A0D28]"
      >
        <div
          className="max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-6"
          style={{ height: "60px" }}
        >
          
          <div className="zyla-brand flex items-center">
            <img
              src={ZaLogo}
              alt="ZA"
              className="za-logo w-4 h-2 md:w-6 md:h-6 transform scale-90 md:scale-90 block"
            />

            <div className="brand-text text-sm md:text-base text-[#1A0D28] m-0 p-0 leading-none ml-1">
              <div className="brand-ask">Ask</div>
              <div className="brand-zyla">Zyla</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
