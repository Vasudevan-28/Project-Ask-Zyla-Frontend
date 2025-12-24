import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import ZaLogo from "../assets/ZaLogo.png";
import ZylaToggleImg from "../assets/ZylaToggle.png";
import ProfilePopup from "../dashboard_components/ProfilePopup";
import FeedbackModal from "../dashboard_components/FeedbackModal";
import { getAuth, signOut,  onIdTokenChanged } from "firebase/auth";
import { useLocation } from "react-router-dom";
import { ApiService } from "../services/dashboardApi";
import {  useNavigate } from "react-router-dom";
import Toast from './Toast'
import NotificationCenter from "../dashboard_components/NotificationCenter";
import { IoNotificationsSharp, IoPerson } from "react-icons/io5";
import { submitLogOutFeedback } from "../settings_components/api/settingsAPI";


export default function HeaderMain() {
  const navigate = useNavigate();
   const auth = getAuth();
   const location = useLocation();

  //   const user = auth.currentUser;
  
    const { theme, toggleTheme } = useContext(ThemeContext); 
    const isLight = theme === "light";
    
    // const { theme } = useContext(ThemeContext);

  const [activeNav, setActiveNav] = useState("HOME");
  const [showProfile, setShowProfile] = useState(false);
  const [isSettings, setIsSettings] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false);

    const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const lastNotifIdRef = useRef(null);
  const isFirstLoadRef = useRef(true);


  const popupRef = useRef(null);
  const profileBtnRef = useRef(null);

  const notificationCenterRef = useRef(null);
const notificationBtnRef = useRef(null);

    const [user, setUser] = useState(null);
    const [userToken, setUserToken] = useState("")
  
    useEffect(() =>  {
      const unsub = onIdTokenChanged(auth, async (u) => {
        setUser(u);
        // setUserToken(u.getIdToken(false))

        if (u){
          const tok = await u.getIdToken(false)
          setUserToken(tok)
        } else {
          setUserToken("")
        }
      });
  
      return () => unsub();
    }, [auth]);
  
    
  useEffect(() => {
    if (!userToken) return;

    const fetchNotifications = async () => {
      try {
        const data = await ApiService.getNotifications(userToken);
        setNotifications(data);
        
        if (data.length > 0) {
          const latest = data[0];
          
          if (isFirstLoadRef.current) {
             lastNotifIdRef.current = latest.id;
             isFirstLoadRef.current = false;
          } else {
             // If new unread notification detected
             if (latest.id !== lastNotifIdRef.current && !latest.read) {
                setToastMessage(latest.message);
                lastNotifIdRef.current = latest.id;
             }
          }
        } else {
           isFirstLoadRef.current = false;
        }
      } catch (e) {
        console.error("Failed to fetch notifications", e);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); 
    return () => clearInterval(interval);
  }, [userToken]);

  
  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

useEffect(() => {
  if (location.pathname.startsWith("/dashboard")) {
    setActiveNav("HOME");
  } else if (location.pathname.startsWith("/skinProfile")) {
    setActiveNav("SKIN PROFILE");
  } else if (location.pathname.startsWith("/chatbot") || location.pathname.startsWith("/archivedchats")) {
    setActiveNav("CHATBOT");
  }else if (location.pathname.startsWith('/settings')){
    setActiveNav("null")
    setIsSettings(true)
  }
  else{
    setActiveNav("null")
  }
}, [location.pathname]);



  useEffect(() => {
  function onDocClick(e) {
    // Profile popup close
    if (
      showProfile &&
      popupRef.current &&
      !popupRef.current.contains(e.target) &&
      profileBtnRef.current &&
      !profileBtnRef.current.contains(e.target)
    ) {
      setShowProfile(false);
    }

    // Notification center close
    if (
      showNotificationCenter &&
      notificationCenterRef.current &&
      !notificationCenterRef.current.contains(e.target) &&
      notificationBtnRef.current &&
      !notificationBtnRef.current.contains(e.target)
    ) {
      setShowNotificationCenter(false);
    }
  }

  document.addEventListener("mousedown", onDocClick);
  return () => document.removeEventListener("mousedown", onDocClick);
}, [showProfile, showNotificationCenter]);

  useEffect(() => {
  function onKey(e) {
    if (e.key === "Escape") {
      if (showProfile) setShowProfile(false);
      if (showNotificationCenter) setShowNotificationCenter(false);
    }
  }
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}, [showProfile, showNotificationCenter]);


  // focus popup on open (prevent scroll attempt)
  useEffect(() => {
    if (showProfile) {
      const t = setTimeout(() => {
        try {
          popupRef.current && popupRef.current.focus({ preventScroll: true });
        } catch {
          popupRef.current && popupRef.current.focus();
        }
      }, 0);
      return () => clearTimeout(t);
    }
  }, [showProfile]);

  const knobPositionRight = theme === "dark";

   const handleLogout = async () => {
      try {
        await signOut(auth);
        localStorage.clear();
  
        // window.location.href = "/login";
         setTimeout(() => navigate("/login", {replace : true}), 500);
      } catch (err) {
        console.error(err);

      }
    };
  

return (
  <>
    <div
      className={
        "fixed top-0 left-0 right-0 h-2 z-99999 bg-transparent"
      }
    />

    {/* header */}
    <header
      role="banner"
      className={
        "fixed left-0 right-0 border-t-4 h-14 flex items-center px-6 box-border z-99998 " +
        `backdrop-blur-sm bg-white/95 ${isLight ? "border-[#e9d9e3] " : "border-[#1d0e2d]"} `
         
      }
    >
      {/* Brand */}
      <div className="flex items-center gap-0.5 cursor-pointer"
      onClick={() => {
         setActiveNav("HOME");
                // navigate("/dashboard");
                 navigate("/loading", { state: { nextPage: "/dashboard" } })
      }}
      >
        <img src={ZaLogo} alt="ZA logo" className="h-[38px] w-auto block" />
        <div className="font-['Playfair_Display'] -mb-1 font-bold mt-1 leading-[0.9] select-none">
          <div className="text-[12px] text-[#1c0d25]">Ask</div>
          <div className="text-[22px] text-[#1c0d25]">Zyla</div>
        </div>
      </div>

      {/* center nav - absolutely centered */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <nav
          className="flex gap-2 px-2 py-1 rounded-full bg-transparent shadow-md items-center"
          role="menubar"
          aria-label="Main"
        >
          <div className="flex gap-1">
            {/* reusable base classes */}
            {/* HOME button */}
            <button
              className={
                "px-3 h-8 rounded-full text-black font-semibold text-xs tracking-wide uppercase transition " +
                (activeNav === "HOME"
                  ? `${isLight ? "bg-purple-200 text-black" : "bg-[#1d0e2dc4] text-white"}` 
                  : "bg-transparent hover:bg-white/10")
              }
              onClick={() => {
                setActiveNav("HOME");
                // navigate("/dashboard");
                 navigate("/loading", { state: { nextPage: "/dashboard" } })
              }}
              aria-current={activeNav === "HOME" ? "page" : undefined}
              type="button"
            >
              HOME
            </button>

            {/* SKIN PROFILE button */}
            <button
              className={
                "px-3 h-8 rounded-full font-semibold text-black text-xs tracking-wide uppercase transition " +
                (activeNav === "SKIN PROFILE"
                  ?  `${isLight ? "bg-purple-200 text-black" : "bg-[#1d0e2dc4] text-white"}` 
                  : "bg-transparent  hover:bg-white/10")
              }
              onClick={() => {
                setActiveNav("SKIN PROFILE");
                // navigate("/skinProfile");
                navigate("/loading", { state: { nextPage: "/skinProfile" } })
              }}
              aria-current={activeNav === "SKIN PROFILE" ? "page" : undefined}
              type="button"
            >
              SKIN PROFILE
            </button>

            {/* CHATBOT button */}
            <button
              className={
                "px-3 h-8 rounded-full font-semibold text-black text-xs tracking-wide uppercase transition " +
                (activeNav === "CHATBOT"
                  ?  `${isLight ? "bg-purple-200 text-black" : "bg-[#1d0e2dc4] text-white"}` 
                  : "bg-transparent  hover:bg-white/10")
              }
              onClick={() => {
                setActiveNav("CHATBOT");
                // navigate("/chatbot");
                 navigate("/loading", { state: { nextPage: "/chatbot" } })
              }}
              aria-current={activeNav === "CHATBOT" ? "page" : undefined}
              type="button"
            >
              CHATBOT
            </button>
          </div>
        </nav>
      </div>

      {/* right controls */}
      <div className="ml-auto flex items-center gap-3 z-10">
        {/* Theme toggle */}
        <button
          className="relative w-[70px] h-8 p-[3px] rounded-full border-2 border-purple-300/60 bg-transparent flex items-center justify-between overflow-hidden"
          aria-label="Toggle theme"
          onClick={() => toggleTheme()}
          title="Toggle theme"
          type="button"
        >
          <div
            className={
              "absolute inset-0 rounded-full transition-colors duration-200 " +
              (theme === "light" ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]")
            }
            aria-hidden
          />
          <div className="absolute inset-0 pointer-events-none" />
          {/* knob */}
          <div
            className={
              "relative z-10 w-7 h-7 rounded-full bg-transparent shadow-md flex items-center justify-center transition-transform duration-200 " +
              (knobPositionRight ? "translate-x-[30px]" : "translate-x-px")
            }
          >
            <img
              src={ZylaToggleImg}
              alt="Zyla toggle"
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
        </button>

      
          <div className="relative">
  <button
    ref={notificationBtnRef}
    className={`w-10 h-10 rounded-full  text-[#1d0e2d] flex items-center justify-center  shadow-lg hover:bg-purple-100 transition-all 
      ${showNotificationCenter ? "bg-purple-200" : "bg-white"}
      `}
    onClick={() => {
      setShowNotificationCenter(!showNotificationCenter);
    }}
    title="Notification Center"
    type="button"
  >
    <IoNotificationsSharp />
  </button>
  {notifications.some(n => !n.read) && (
    <span className="absolute top-0 right-0  h-2.5 w-2.5 bg-[#1d0e2d] rounded-full "></span>
  )}

{showNotificationCenter && (
  <div 
    ref={notificationCenterRef}
    className="absolute right-0 top-14"
  >
    <NotificationCenter 
      notifications={notifications}
      onClose={() => setShowNotificationCenter(false)}
      onMarkRead={handleMarkRead}
      onMarkAllRead={handleMarkAllRead}
      userToken={userToken}
    />
  </div>
)}


</div>

          <div>
            <button
              ref={profileBtnRef}
              className={`w-10 h-10 rounded-full  flex items-center justify-center  shadow-lg hover:bg-purple-100 transition-all
                ${isSettings ? "bg-purple-200" : `${showProfile ? "bg-purple-200" : "bg-white"}`}
                
                `}
                // ${showProfile ? "bg-purple-400 " :  "bg-white"}
              onClick={() => setShowProfile((s) => !s)}
              aria-haspopup="true"
              aria-expanded={showProfile}
              title="Profile"
              type="button"
            >
              {/* <FaRegUser size={15} className="text-[#1d0e2d]" /> */}
              <IoPerson size={16} className="text-[#1d0e2d]" />
            </button>
          </div>
        
      </div>
    </header>

    {showProfile && (
      <div
        className="fixed right-8 top-16 z-50 min-w-[220px] outline-none"
        ref={popupRef}
        role="menu"
        aria-label="Account menu"
        tabIndex={-1}
      >
        <div className=" text-[#1c0d25] rounded-lg  mt-1 font-semibold">
          <ProfilePopup
            onSettings={() => {
              setShowProfile(false);
              // window.location.href = "/profile";
              // navigate('/settings')
              navigate("/loading", { state: { nextPage: "/settings" } })
            }}
            onLogout={() => {
              setShowProfile(false);
              setShowFeedback(true);
              // handleLogout();
            }}
          />
        </div>
      </div>
    )}

    {showFeedback && (
      <FeedbackModal
        onClose={() => setShowFeedback(false)}
        onSubmit={ async (feedbackData) => {
          console.log("User feedback:", userToken);

          // try{
          //   await fetch(`http://localhost:8484/settings/feedback-submit`, 
          //     {
          //       method : "POST",
          //       headers : { Authorization : `Bearer ${userToken}`, "Content-Type" : "application/json"},
          //       body: JSON.stringify(feedbackData)
          //     }
          //   )
          // } catch(err) {
          //   console.log(err)
          // }

            try {
      await submitLogOutFeedback(userToken, feedbackData);
    } catch (err) {
      console.log(err);
    }

          setShowFeedback(false);
          handleLogout()
         
        }}
      />
    )}

     {/* Toast Notification */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
  </>
);

}
