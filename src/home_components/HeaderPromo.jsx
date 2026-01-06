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

  const HEADER_HEIGHT = 60;
  const scrollToSection = (id) => {
    const el = document.getElementById(id);

    if (el) {
      const headerHeight = HEADER_HEIGHT;
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
      setMenuOpen(false);
    } else {
      // if section not present on current page, navigate to home with hash
      navigate(`/#${id}`);
      setMenuOpen(false);
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + HEADER_HEIGHT + 80; // little tolerance
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

  // Recalculate underline position when activeSection changes or on resize
  useEffect(() => {
    const updateUnderline = () => {
      if (!activeSection || !navRef.current) {
        setUnderlineStyle({ left: 0, width: 0 });
        return;
      }

      const btn = navRef.current.querySelector(`#nav-${activeSection}`);
      if (btn) {
        // btn.offsetLeft is relative to the nav container, which is what we want
        setUnderlineStyle({
          left: btn.offsetLeft,
          width: btn.offsetWidth,
        });
      } else {
        setUnderlineStyle({ left: 0, width: 0 });
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeSection, navRef.current]);

  // If user navigates with a hash, scroll to that section
  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);

    if (!el) return;

    setTimeout(() => {
      const headerHeight = HEADER_HEIGHT;
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 100);
  }, [location]);

  return (
    <div className="w-full">
      <div
        className="fixed top-0 left-0 w-full z-50"
        style={{ height: "10px", backgroundColor: "#1A0D28" }}
        aria-hidden="true"
      />

      {/* Header */}
      <header
        className="bg-white fixed top-1 left-0 w-full z-50 shadow-md border-b border-[#1A0D28]"
        role="banner"
      >
        <div
          className="max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-6"
          style={{ height: `${HEADER_HEIGHT}px` }}
        >
          
         {/* Logo */}
          <div className="flex items-center gap-0.5"
          onClick={() => navigate('/')}
          >
            <img src={logo} alt="ZA logo" className="h-[38px]" />
            <div className="font-['Playfair_Display'] -mb-1 mt-1 font-bold leading-[0.9] select-none">
              <div className="text-[12px] text-[#1c0d25]">Ask</div>
              <div className="text-[22px] text-[#1c0d25]">Zyla</div>
            </div>
          </div>

          {/* Desktop Nav (visible md and up) */}
          <nav
            ref={navRef}
            className="relative hidden md:flex items-center gap-12"
            aria-label="Primary navigation"
          >
            {sections.map((section) => (
              <button
                key={section}
                id={`nav-${section}`}
                onClick={() => scrollToSection(section)}
                className={`text-sm font-semibold text-[#1A0D28] transition-transform hover:scale-110
                  ${activeSection === section ? "opacity-100" : "opacity-90"}`}
              >
                {section.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}

            {/* Underline — only shown on desktop when there is an active section */}
            {activeSection && (
              <motion.span
                className="absolute h-1 rounded-full shadow-md"
                style={{
                  bottom: "-6px",
                  background: "linear-gradient(90deg, #1A0D28, #3B2B5C)",
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
                aria-hidden="true"
              />
            )}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={newTab}
              className="px-3 py-1 text-sm font-semibold rounded border border-[#1A0D28] text-[#1A0D28] hover:bg-[#1A0D28] hover:text-white transition"
            >
              Login
            </button>

            <button
              onClick={newTabSignUp}
              className="hidden md:inline-flex px-3 py-1 text-sm font-semibold rounded text-white bg-linear-to-r from-[#1A0D28] to-[#3B2B5C] hover:scale-105 transition"
            >
              Register
            </button>

            <button
              className="md:hidden ml-2 text-2xl text-[#1A0D28] p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="md:hidden fixed top-[60px] left-0 w-full bg-white shadow-md border-t
                   border-[#1A0D28] flex flex-col z-40"
            role="menu"
          >
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="px-6 py-4 text-center font-semibold text-[#1A0D28] hover:bg-gray-100"
                role="menuitem"
              >
                {section.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}


            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/signup");
              }}
              className="px-6 py-4 text-center  font-semibold 
              bg-linear-to-r from-[#1A0D28] to-[#553379] text-white hover:bg-gray-100"
              role="menuitem"
            >
              Register
            </button>
          </div>
        )}
      </header>
    </div>
  );
}