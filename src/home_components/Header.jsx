
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ZaLogo.png";

export default function Header() {
  const sections = ["my-story", "features", "access-path", "faq", "feedback"];
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const navigate = useNavigate();

  const newTab = () => {
    window.open('/login', '_blank')
  }
  const newTabSignUp = () => {
    window.open('/signup', '_blank')
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const headerHeight = 60;
      const elPosition = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: elPosition, behavior: "smooth" });
      setActiveSection(id);
      setMenuOpen(false); // close mobile menu after click
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 70;
      let current = sections[0];
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= scrollPos) {
          current = id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update underline position
  useEffect(() => {
    if (navRef.current) {
      const btn = navRef.current.querySelector(`#nav-${activeSection}`);
      if (btn) {
        setUnderlineStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
      }
    }
  }, [activeSection]);

  return (
    <div className="w-full">
      {/* Top strip */}
      <div
        className="fixed top-0 left-0 w-full z-50 overflow-hidden"
        style={{ height: "10px", backgroundColor: "#1A0D28" }}
      />

      {/* Header */}
      <header className="bg-white fixed top-1 left-0 w-full z-50 shadow-md border-b border-[#1A0D28]">
        <div
          className="max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-6 overflow-hidden"
          style={{ height: "60px" }}
        >
          {/* LEFT SIDE */}
          {/* <div className="zyla-brand flex items-center">
  <img
    src={logo}
    alt="ZA Logo"
    className="za-logo w-4 h-2 md:w-6 md:h-6 transform scale-90 md:scale-90 block"
  />
  <div className="brand-text text-sm md:text-base m-0 p-0">
    <div className="brand-ask leading-none">Ask</div>
    <div className="brand-zyla leading-none">Zyla</div>
  </div>
</div> */}

 <div className="flex items-center gap-0.5">
        <img src={logo} alt="ZA logo" className="h-[38px] w-auto block" />
        <div className="font-['Playfair_Display'] -mb-1 mt-1 font-bold leading-[0.9] select-none">
          <div className="text-[12px] text-[#1c0d25]">Ask</div>
          <div className="text-[22px] text-[#1c0d25]">Zyla</div>
        </div>
      </div>


          {/* CENTER NAV - DESKTOP */}
          <nav className="relative hidden md:flex items-center gap-12" ref={navRef}>
            {sections.map((section, idx) => (
              <button
                key={idx}
                id={`nav-${section}`}
                onClick={() => scrollToSection(section)}
                className="relative text-sm font-semibold text-[#1A0D28] transition-transform duration-300 hover:scale-110"
              >
                {section.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}

            {/* Active underline */}
            <motion.span
              className="absolute h-1 rounded-full shadow-md"
              style={{
                bottom: "-6px",
                background: "linear-gradient(90deg, #1A0D28, #3B2B5C)",
                zIndex: 10,
              }}
              animate={{ left: underlineStyle.left, width: underlineStyle.width }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 0.5,
              }}
            />
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              className="px-3 py-1 text-sm font-semibold rounded border border-[#1A0D28] text-[#1A0D28] hover:bg-[#1A0D28] hover:text-white transition"
              onClick={newTab}
            >
              Login
            </button>
            <button
              className="px-3 py-1 text-sm font-semibold rounded text-white bg-linear-to-r from-[#1A0D28] to-[#3B2B5C] hover:scale-105 transition-transform duration-300"
              onClick={newTabSignUp}
            >
              Register
            </button>

            {/* HAMBURGER MENU - MOBILE */}
            <button
              className="md:hidden ml-2 text-2xl text-[#1A0D28]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden fixed top-[60px] left-0 w-full bg-white shadow-md z-40 border-t border-[#1A0D28] flex flex-col">
            {sections.map((section, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSection(section)}
                className="block w-full text-left px-6 py-4 text-[#1A0D28] font-semibold hover:bg-gray-100 transition"
              >
                {section.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}

            {/* Mobile Login/Register */}
            <button
              className="block w-full text-left px-6 py-4 text-[#1A0D28] font-semibold hover:bg-gray-100 transition"
              onClick={() => {
                setMenuOpen(false);
                navigate("/login");
              }}
            >
              Login
            </button>
            <button
              className="block w-full text-left px-6 py-4 text-[#1A0D28] font-semibold hover:bg-gray-100 transition"
              onClick={() => {
                setMenuOpen(false);
                navigate("/signup");
              }}
            >
              Register
            </button>
          </div>
        )}
      </header>
    </div>
  );
}
