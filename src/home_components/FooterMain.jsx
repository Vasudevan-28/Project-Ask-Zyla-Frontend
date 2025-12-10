import React from "react";
import ZaLogo from "../assets/ZaLogo.png";
import { IoMailOutline, IoLogoFacebook } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { LuYoutube } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function FooterMain() {
  const navigate = useNavigate();

  return (
    <footer
      aria-label="Site footer"
      className="w-full bg-white border-t border-black/6"
    >
      <div className="max-w-[1300px] mx-auto px-6 py-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-start">
          {/* Brand */}
          <div className="flex items-center mt-16 cursor-pointer  gap-3"
          onClick={() => navigate('/dashboard')}
          >
            <img src={ZaLogo} alt="ZA logo" className="h-[70px] w-auto block" />
            <div className="font-['Playfair_Display'] mt-6 font-extrabold leading-[0.92]">
              <div className="text-[20px] text-[#1c0d25]">Ask</div>
              <div className="text-[32px] text-[#1c0d25]">Zyla</div>
            </div>
          </div>

          {/* Company Overview */}
          <div>
            <div className="font-semibold mb-2 text-[#1c0d25]">
              Company Overview
            </div>
            <ul className="list-none m-0 p-0 text-[#4b4450]">
              <li className="mb-1">
                <button
                  className="hover:underline"
                  onClick={() => {
                    navigate("/aboutUs");
                  }}
                >
                  My Story
                </button>
              </li>
              <li>
                <a className="hover:underline" href="#">
                  What Zyla Does ?
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-semibold mb-2 text-[#1c0d25]">Quick Links</div>
            <ul className="list-none m-0 p-0 text-[#4b4450]">
              <li className="mb-1">
                <button
                  className="hover:underline"
                  onClick={() => {
                    // navigate("/settings", { state: { footRoute: "support" } });
                    navigate("/loading", { state: { nextPage: "/settings", footRoute: "support" } });
                  }}
                >
                  Support
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="hover:underline"
                  onClick={() => {
                    // navigate("/privacy-policy");
                     navigate("/loading", { state: { nextPage: "/privacy-policy" } })
                  }}
                >
                  Privacy Policy
                </button>
              </li>
              <li className="mb-1">
                <button className="hover:underline" onClick={() => { 
                  // navigate("/cookie-policy");
                   navigate("/loading", { state: { nextPage: "/cookie-policy" } })
                  }}>
                  Cookie Policy
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="hover:underline"
                  onClick={() => {
                    // navigate("/settings", { state: { footRoute: "feedback" } });
                    navigate("/loading", { state: { nextPage: "/settings", footRoute: "feedback" } });

                  }}
                >
                  Feedback
                </button>
              </li>
              <li className="mb-1">
                <button
                  className="hover:underline"
                  onClick={() => {
                    // navigate("/settings", { state: { footRoute: "rating" } });
                    navigate("/loading", { state: { nextPage: "/settings", footRoute: "rating" } });

                  }}
                >
                  Rating
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <div className="font-semibold mb-2 text-[#1c0d25]">Contact Us</div>

            <div className="mb-2 text-[#374151]">
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
                className="hover:underline font-semibold text-[#374151]"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=askzyla.zeaisoft@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                askzyla.zeaisoft@gmail.com
              </a>
            </div>

              <p className="text-[#374151]">Stay connected for more skin care love!</p>
            <div className="flex items-center gap-3 mt-2 text-[#6b6b6b]">
              <a
                className="hover:text-[#1c0d25]"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=askzyla.zeaisoft@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email Ask Zyla"
              >
                <IoMailOutline size={18} />
              </a>

              <a
                className="hover:text-[#1c0d25]"
                href="https://www.facebook.com/profile.php?id=61584828928342"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <IoLogoFacebook size={18} />
              </a>

              <a
                className="hover:text-[#1c0d25]"
                href="https://www.instagram.com/askzyla?igsh=dDA1M2o0ODE2aXRr&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>

              <a
                className="hover:text-[#1c0d25]"
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <LuYoutube size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright row */}
      <div className="h-14 flex items-center justify-center bg-white border-t border-black/6 text-sm">
        <span>copyright © 2025 Ask Zyla</span>
      </div>
    </footer>
  );
}
