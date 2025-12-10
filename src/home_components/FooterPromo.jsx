import React from "react";
import ZaLogo from "../assets/ZaLogo.png";
import { IoMailOutline, IoLogoFacebook } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { LuYoutube } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function FooterPromo() {
  const navigate = useNavigate();

  const navSupport = () => {
    navigate("/general-support");
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
      className="w-full bg-white text-[#221322] m-0 p-0 box-border"
    >
      {/* MAIN ROW */}
      <div className="py-[18px] px-6 flex justify-center items-stretch border-t border-t-[rgba(0,0,0,0.06)] box-border">
        <div
          className="w-full max-w-[1300px] grid grid-cols-[200px_1fr_1fr_1fr] gap-[30px] items-start box-border"
          role="group"
          aria-label="Footer links"
        >
          {/* BRAND */}
          <div
            className="flex items-center gap-[10px] justify-self-start self-center -translate-x-[30px] transform"
            aria-hidden="true"
          >
            <img
              src={ZaLogo}
              alt="ZA logo"
              className="h-[70px] ml-8 w-auto block mb-[25px]"
            />
            <div className="flex flex-col justify-center leading-[0.92] font-['Playfair_Display',serif] font-bold m-0 p-0">
              <span className="text-[20px] m-0 p-0 text-[#221322]">Ask</span>
              <span className="text-[32px] m-0 p-0 text-[#221322]">Zyla</span>
            </div>
          </div>

          {/* Company Overview */}
          <div>
            <div className="font-bold mb-2 text-[#221322]">
              Company Overview
            </div>
            <ul
              className="list-none m-0 p-0"
              aria-label="Company overview links"
            >
              <li className="mb-2">
                <button
                  className="text-inherit no-underline font-medium hover:underline focus:underline cursor-pointer"
                  onClick={() => scrollToSection("my-story")}
                >
                  My Story
                </button>
              </li>
              <li className="mb-2">
                <button
                  className="text-inherit no-underline font-medium hover:underline focus:underline cursor-pointer"
                  onClick={() => scrollToSection("features")}
                >
                  What Zyla Does ?
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-bold mb-2 text-[#221322]">Quick Links</div>
            <ul className="list-none m-0 p-0" aria-label="Quick links">
              <li className="mb-2">
                <button className="text-inherit no-underline font-medium hover:underline focus:underline" onClick={navSupport}>
                  Support
                </button>{" "}
              </li>
              
                 <li className="mb-1">
                <button
                  className="text-inherit no-underline font-medium hover:underline focus:underline"
                  onClick={() => {
                    navigate("/privacy-policy");
                  }}
                >
                  Privacy Policy
                </button>
              </li>
              <li className="mb-1">
                <button className="text-inherit no-underline font-medium hover:underline focus:underline" onClick={() => { navigate("/cookie-policy");}}>
                  Cookie Policy
                </button>
              </li>
           
              <li className="mb-2">
                <a
                  className="text-inherit no-underline font-medium hover:underline focus:underline"
                  href="#"
                >
                  Login
                </a>
              </li>
              <li className="mb-2">
                <a
                  className="text-inherit no-underline font-medium hover:underline focus:underline"
                  href="#"
                >
                  SignUp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <div className="font-bold mb-2 text-[#221322]">Contact Us</div>
            <div className="mb-2 text-inherit">
              Need help? Fill out our{" "}
              <a
                className="text-inherit no-underline font-medium hover:underline focus:underline"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                form
              </a>{" "}
              or email{" "}
              {/* <a
                className="text-inherit no-underline font-medium hover:underline focus:underline"
                href="mailto:askzyla.zeaisoft@gmail.com"
              >
                askzyla.zeaisoft@gmail.com
              </a> */}
              <a
                className="text-inherit no-underline font-medium hover:underline focus:underline"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=askzyla.zeaisoft@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                askzyla.zeaisoft@gmail.com
              </a>
            </div>
            <div>
              <p>Stay connected for more skin care love!</p>
            </div>
            <div
              className="flex gap-3 mt-[6px] items-center"
              aria-hidden="true"
            >
              {/* <p>Follow Us On :</p> */}
              <a
                className="text-inherit no-underline font-medium hover:underline focus:underline"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=askzyla.zeaisoft@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoMailOutline size={18} />
              </a>
              <a
                className="text-inherit no-underline font-medium hover:underline focus:underline"
                href="https://www.facebook.com/profile.php?id=61584828928342"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <IoLogoFacebook size={18} />
              </a>
              <a
                className="text-inherit no-underline font-medium hover:underline focus:underline"
                href="https://www.instagram.com/askzyla?igsh=dDA1M2o0ODE2aXRr&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                className="text-inherit no-underline font-medium hover:underline focus:underline"
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

      {/* Thin divider line (instead of theme-based border-top switching) */}
      <div className="w-full h-px bg-[#1A0D28]" />

      {/* Copyright row */}
      <div
        className="h-10 flex items-center justify-center bg-white border-t-2 border-t-[#1a0d28] text-sm m-0 px-2 text-[#221322]"
        role="contentinfo"
      >
        <span>copyright © 2025 Ask Zyla</span>
      </div>
    </footer>
  );
}
