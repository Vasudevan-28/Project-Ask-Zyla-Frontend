import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Profile from "./profile";
import Setting from "./setting";
import Support from "./support";
import Feedback from "./feedback";
import Rating from "./rating";
import Privacy from "./privacy";
import HeaderMain from "../home_components/HeaderMain";
import { ThemeContext } from "../contexts/ThemeContext";
// import Header from "./Header";

function SettHome() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  
  const location = useLocation()
  
  const { footRoute } = location.state || {}
  
  const [activeRightPanel, setActiveRightPanel] = useState( footRoute || "settings");

  const profile = {
    name: "User",
    age: 22,
    email: "user@gmail.com",
    phone: "+91 9876543210",
    gender: "Male",
    city: "Chennai",
    state: "Tamil Nadu",
  };

  return (
    <div className={`min-h-screen flex flex-col  ${isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"}`}>
    
    <HeaderMain />
      {/* CONTENT AREA */}
      <main className="flex-1 flex justify-center p-16 ">
        {/* CENTERED CONTAINER */}
        <div className="flex w-full max-w-5xl px-8 pt-4 gap-2 pb-6 mx-auto">
          {/* LEFT: PROFILE */}
          <Profile profile={profile} />

          {/* RIGHT: DYNAMIC PANELS */}
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
      </main>

      {/* PRIVACY POPUP */}
      <Privacy isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
}

export default SettHome;
