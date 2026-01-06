import React, { useEffect } from "react";
import ZaLogo from "../assets/ZaLogo.png";
import { IoMailOutline, IoLogoFacebook } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function FooterPromo() {
  const navigate = useNavigate();
  const location = useLocation();

  const navSupport = () => {
    navigate("/general-support");
  };

  const navPromo = () => {
    navigate("/");
  };

  const goToSection = (id) => {
    const el = document.getElementById(id);

    if (el) {
      const headerHeight = window.innerWidth < 640 ? 50 : 60;
      const y =
        el.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);

    if (!el) return;

    setTimeout(() => {
      const headerHeight = window.innerWidth < 640 ? 50 : 60;
      const y =
        el.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
    }, 100);
  }, [location]);

  return (
    <footer
      aria-label="Site footer"
      className="w-full bg-white text-[#221322] m-0 p-0 box-border"
    >
      {/* MAIN ROW */}
      <div className="py-6 px-8 flex justify-center items-stretch border-t border-t-[rgba(0,0,0,0.06)]">
        <div className="w-full max-w-[1300px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-[30px] items-start">
          {/* BRAND */}
           <div className="flex items-center justify-center md:justify-start gap-2.5 cursor-pointer self-center -translate-x-[30px]"
          onClick={navPromo}
          >
            <img
              src={ZaLogo}
              alt="ZA logo"
              className="h-[70px] ml-8 w-auto block mb-[25px]"
            />
            <div className="flex flex-col leading-[0.92] font-['Playfair_Display'] font-bold">
              <span className="text-[20px] text-[#221322]">Ask</span>
              <span className="text-[32px] text-[#221322]">Zyla</span>
            </div>
          </div>

          {/* Company Overview */}
          <div className="pt-2 text-center md:text-left">
            <div className="font-bold mb-2">Company Overview</div>
            <ul className="list-none m-0 p-0">
              <li className="mb-2">
                <button
                  className="font-medium hover:underline cursor-pointer "
                  onClick={() => goToSection("my-story")}
                >
                  My Story
                </button>
              </li>
              <li className="mb-2">
                <button
                  className="font-medium hover:underline cursor-pointer "
                  onClick={() => goToSection("features")}
                >
                  What Zyla Does?
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="pt-2 md:text-left text-center">
            <div className="font-bold mb-2 ">Quick Links</div>
            <ul className="list-none  m-0 p-0">
              <li className="mb-2">
                <button
                  className="font-medium hover:underline cursor-pointer "
                  onClick={navSupport}
                >
                  Support
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="font-medium hover:underline cursor-pointer "
                  onClick={() => navigate("/privacy-policy")}
                >
                  Privacy Policy
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="font-medium hover:underline cursor-pointer "
                  onClick={() => navigate("/cookie-policy")}
                >
                  Cookie Policy
                </button>
              </li>
              <li className="mb-2">
                <button
                  className="font-medium hover:underline cursor-pointer "
                  onClick={() => navigate("/login")}
                >
                  Log In
                </button>
              </li>
              <li className="mb-2">
                <button
                  className="font-medium hover:underline cursor-pointer "
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="pt-2 text-center md:text-left">
            <div className="font-bold mb-2">Contact Us</div>
            <p className="mb-2 text-sm">
              Need help? Fill out our{" "}
              <button
                className="font-medium hover:underline cursor-pointer"
                onClick={navSupport}
              >
                form
              </button>{" "}
              or email{" "}
              <a
                className="font-medium hover:underline"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=askzyla.zeaisoft@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                askzyla.zeaisoft@gmail.com
              </a>
            </p>

            <p className="text-sm mb-2">Stay connected for more skin care love!</p>

            <div className="flex gap-3 mt-2 justify-center md:justify-start">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=askzyla.zeaisoft@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email Ask Zyla"
                className="text-[#221322] hover:text-[#1A0D28]"
              >
                <IoMailOutline size={18} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61584828928342"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#221322] hover:text-[#1A0D28]"
              >
                <IoLogoFacebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/askzyla"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#221322] hover:text-[#1A0D28]"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#1A0D28]" />

      {/* Copyright */}
      <div className="h-10 flex items-center justify-center text-sm border-t-2 border-[#1A0D28]">
        copyright © 2025 Ask Zyla
      </div>
    </footer>
  );
}