import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/ZaLogo.png";

export default function HeaderPromo() {
  const sections = ["my-story", "features", "access-path", "faq", "feedback"];

  const [activeSection, setActiveSection] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  const navigate = useNavigate();
  const location = useLocation();

  const newTab = () => window.open("/login", "_blank");
  const newTabSignUp = () => window.open("/signup", "_blank");

  const scrollToSection = (id) => {
    const el = document.getElementById(id);

    if (el) {
      const headerHeight = 60;
      const y =
        el.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
      setMenuOpen(false);
    } else {
      navigate(`/#${id}`);
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 70;
      let current = null;
      let foundAny = false;

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        foundAny = true;
        if (section.offsetTop <= scrollPos) {
          current = id;
        }
      });

      if (!foundAny) {
        setActiveSection(null);
      } else {
        setActiveSection(current);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    if (!activeSection || !navRef.current) return;

    const btn = navRef.current.querySelector(
      `#nav-${activeSection}`
    );

    if (btn) {
      setUnderlineStyle({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);

    if (!el) return;

    setTimeout(() => {
      const headerHeight = 60;
      const y =
        el.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
    }, 100);
  }, [location]);

  return (
    <div className="w-full">
      {/* Top strip */}
      <div
        className="fixed top-0 left-0 w-full z-50"
        style={{ height: "10px", backgroundColor: "#1A0D28" }}
      />

      {/* Header */}
      <header className="bg-white fixed top-1 left-0 w-full z-50 shadow-md border-b border-[#1A0D28]">
        <div
          className="max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-6"
          style={{ height: "60px" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-0.5">
            <img src={logo} alt="ZA logo" className="h-[38px]" />
            <div className="font-['Playfair_Display'] -mb-1 mt-1 font-bold leading-[0.9] select-none">
              <div className="text-[12px] text-[#1c0d25]">Ask</div>
              <div className="text-[22px] text-[#1c0d25]">Zyla</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav
            ref={navRef}
            className="relative hidden md:flex items-center gap-12"
          >
            {sections.map((section) => (
              <button
                key={section}
                id={`nav-${section}`}
                onClick={() => scrollToSection(section)}
                className="text-sm font-semibold text-[#1A0D28] transition-transform hover:scale-110"
              >
                {section
                  .replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}

            {/* Underline ONLY if activeSection exists */}
            {activeSection && (
              <motion.span
                className="absolute h-1 rounded-full shadow-md"
                style={{
                  bottom: "-6px",
                  background:
                    "linear-gradient(90deg, #1A0D28, #3B2B5C)",
                }}
                animate={{
                  left: underlineStyle.left,
                  width: underlineStyle.width,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                  mass: 0.5,
                }}
              />
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={newTab}
              className="px-3 py-1 text-sm font-semibold rounded border border-[#1A0D28] text-[#1A0D28] hover:bg-[#1A0D28] hover:text-white transition"
            >
              Login
            </button>

            <button
              onClick={newTabSignUp}
              className="px-3 py-1 text-sm font-semibold rounded text-white bg-linear-to-r from-[#1A0D28] to-[#3B2B5C] hover:scale-105 transition"
            >
              Register
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden ml-2 text-2xl text-[#1A0D28]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden fixed top-[60px] left-0 w-full bg-white shadow-md border-t border-[#1A0D28] flex flex-col z-40">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="px-6 py-4 text-left font-semibold text-[#1A0D28] hover:bg-gray-100"
              >
                {section
                  .replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-4 text-left font-semibold text-[#1A0D28] hover:bg-gray-100"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-4 text-left font-semibold text-[#1A0D28] hover:bg-gray-100"
            >
              Register
            </button>
          </div>
        )}
      </header>
    </div>
  );
}
