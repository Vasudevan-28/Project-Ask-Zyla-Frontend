import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Profile from "./profile";
import Setting from "./setting";
import Support from "./support";
import Feedback from "./feedback";
import Rating from "./rating";
import HeaderMain from "../home_components/HeaderMain";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";

function SettHome() {
  const auth = getAuth();
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const navigate = useNavigate();

  const location = useLocation();

  const { footRoute } = location.state || {};

  const [activeRightPanel, setActiveRightPanel] = useState(
    footRoute || "settings"
  );

   const handleLogout = async () => {
      try {
        await signOut(auth);
        localStorage.clear();
        setTimeout(() => navigate("/login", { replace: true }), 500);
      } catch (err) {
        console.error(err);
      }
    };
  

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"
      }`}
    >
      <HeaderMain />

      <main className="flex-1 flex justify-center px-4 py-16 mb-16 md:py-18 md:px-16">
        
        <div className="flex w-full max-w-5xl  gap-4 md:gap-4  flex-col md:flex-row">
          <Profile />

    
          <div className="w-full md:flex-1 ">
            {activeRightPanel === "settings" && (
              <Setting
                onOpenSupport={() => setActiveRightPanel("support")}
                onOpenFeedback={() => setActiveRightPanel("feedback")}
                onOpenRating={() => setActiveRightPanel("rating")}
                onOpenPrivacy={() => setShowPrivacy(true)}
              />
            )}

            {activeRightPanel === "support" && (
              <Support onBack={() => setActiveRightPanel("settings")} />
            )}

            {activeRightPanel === "feedback" && (
              <Feedback onBack={() => setActiveRightPanel("settings")} />
            )}

            {activeRightPanel === "rating" && (
              <Rating onBack={() => setActiveRightPanel("settings")} />
            )}
          </div>
          <div className="md:hidden mt-6 flex justify-center items-center">
            <button className="py-2 px-3 rounded-lg text-white bg-red-500/80 font-semibold" 
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}

export default SettHome;