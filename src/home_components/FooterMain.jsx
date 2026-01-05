import React from "react";
import ZaLogo from "../assets/ZaLogo.png";
import { IoMailOutline, IoLogoFacebook } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function FooterMain() {
  const navigate = useNavigate();
  
  const location = useLocation();

 const handleFooterNav = (sectionId) => {
  if (location.pathname !== "/newAbout") {
    navigate("/newAbout", { state: { scrollTo: sectionId } });
  } else {
    scrollToSection(sectionId);
  }
};


  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const headerHeight = window.innerWidth < 640 ? 50 : 60;
      const elPosition =
        el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: elPosition, behavior: "smooth" });
    }
  };

  return (
    <footer
      aria-label="Site footer"
      className="w-full bg-white border-t border-black/6"
    >
      <div className="max-w-[1300px] text-center md:text-start  mx-auto px-6 py-7">
        <div
          className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-4 gap-8 items-start"
          role="navigation"
          aria-label="Footer navigation"
        >
          {/* Brand */}
         <div className="flex md:mt-12 items-center justify-center md:justify-start cursor-pointer  gap-3"
          onClick={() => navigate('/dashboard')}
          >
            <img src={ZaLogo} alt="ZA logo" className="h-[70px] w-auto block" />
            <div className="font-['Playfair_Display'] mt-6 font-extrabold leading-[0.92]">
              <div className="text-[20px] text-[#1c0d25]">Ask</div>
              <div className="text-[32px] text-[#1c0d25]">Zyla</div>
            </div>
          </div>

          {/* Company Overview */}
          <div className="mt-2  sm:mt-6 md:mt-0">
            <div className="font-semibold mb-2 text-[#1c0d25]">
              Company Overview
            </div>
            <ul className="list-none m-0 p-0 text-[#4b4450]">
              <li className="mb-1">
                <button
                  className="hover:underline cursor-pointer text-sm sm:text-base"
                  onClick={() => {
                    handleFooterNav('storyy')
                  }}
                >
                  My Story
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="hover:underline cursor-pointer text-sm sm:text-base"
                  onClick={() => {
                    handleFooterNav('features-title')
                  }}
                >
                  What Zyla Does?
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="hover:underline cursor-pointer text-sm sm:text-base"
                  onClick={() => {
                    // scrollToSection("features-title");
                    handleFooterNav("faq")
                  }}
                >
                  FAQ
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="hover:underline cursor-pointer text-sm sm:text-base"
                  onClick={() => {
                    // scrollToSection("feedback");
                    handleFooterNav("feedback")
                  }}
                >
                  Customer Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="mt-2 sm:mt-6 md:mt-0">
            <div className="font-semibold mb-2 text-[#1c0d25]">Quick Links</div>
            <ul className="list-none m-0 p-0 text-[#4b4450]">
              <li className="mb-1">
                <button
                  className="hover:underline cursor-pointer text-sm sm:text-base"
                  onClick={() => {
                    navigate("/loading", {
                      state: { nextPage: "/settings", footRoute: "support" },
                    });
                  }}
                >
                  Support
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="hover:underline cursor-pointer text-sm sm:text-base"
                  onClick={() => {
                    navigate("/privacy-policy");
                  }}
                >
                  Privacy Policy
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="hover:underline cursor-pointer text-sm sm:text-base"
                  onClick={() => {
                    navigate("/cookie-policy");
                  }}
                >
                  Cookie Policy
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="hover:underline cursor-pointer text-sm sm:text-base"
                  onClick={() => {
                    navigate("/loading", {
                      state: { nextPage: "/settings", footRoute: "feedback" },
                    });
                  }}
                >
                  Feedback
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="hover:underline cursor-pointer text-sm sm:text-base"
                  onClick={() => {
                    navigate("/loading", {
                      state: { nextPage: "/settings", footRoute: "rating" },
                    });
                  }}
                >
                  Rating
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="mt-2 sm:mt-6 md:mt-0">
            <div className="font-semibold mb-2 text-[#1c0d25]">Contact Us</div>

            <div className="mb-2 text-[#374151] text-sm sm:text-base">
              Need help? Fill out our{" "}
              <a
                className="hover:underline text-[#252c36]"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                form
              </a>{" "}
              or email{" "}
              <a
                className="hover:underline cursor-pointer font-semibold text-[#374151]"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=askzyla.zeaisoft@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                askzyla.zeaisoft@gmail.com
              </a>
            </div>

            <p className="text-[#374151] text-sm sm:text-base">
              Stay connected for more skin care love!
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-[#6b6b6b]">
              <a
                className="hover:text-[#1c0d25] cursor-pointer"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=askzyla.zeaisoft@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email Ask Zyla"
              >
                <IoMailOutline className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

              <a
                className="hover:text-[#1c0d25] cursor-pointer"
                href="https://www.facebook.com/profile.php?id=61584828928342"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <IoLogoFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

              <a
                className="hover:text-[#1c0d25] cursor-pointer"
                href="https://www.instagram.com/askzyla?igsh=dDA1M2o0ODE2aXRr&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

             
            </div>
          </div>
        </div>
      </div>

      {/* Copyright row */}
      <div className="h-12 sm:h-14 flex items-center justify-center bg-white border-t border-black/6 text-sm">
        <span>copyright © 2025 Ask Zyla</span>
      </div>
    </footer>
  );
}