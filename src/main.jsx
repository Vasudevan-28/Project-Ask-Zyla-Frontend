import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
// import Favourites from './components/Favourites.jsx'
// import { AuthProvider } from './AuthContext.jsx'
// import Auth from './Auth.jsx'
// import AshLogin from './components/AshLogin.jsx'
// import ArchivedChatPage from './proto-pages/ArchivedChatPage.jsx'
// import SkinProfilePage from './proto-pages/SkinProfilePage.jsx'


// import PromotionPage from "./team-pages/PromotionPage";
import PromotionPage from "./pages/PromotionPage.jsx"
// import RegistrationPage from "./team-pages/RegistrationPage";
import RegistrationPage from "./pages/RegistrationPage.jsx"
// import Login from "./team-pages/Login";
import Login from "./pages/Login.jsx"
// import Signup from "./team-pages/Signup"
import Signup from "./pages/Signup.jsx"
// import Questionnaire from "./team-pages/Questionnaire";
import Questionnaire from './pages/Questionnaire.jsx'
// import ForgotPassword from "./team-pages/ForgotPassword";
import ForgotPassword from "./pages/ForgotPassword.jsx"
// import PhoneNumberReset from "./team-pages/PhoneNumberReset";
import PhoneNumberReset from "./authentication_components/PhoneNumberReset.jsx"
// import VerificationPage from "./team-pages/VerificationPage";
import VerificationPage from "./authentication_components/VerificationPage.jsx"
// import NewPassword from "./team-pages/NewPassword";
import NewPassword from "./authentication_components/NewPassword.jsx"
// import ResetSuccess from "./team-pages/ResetSuccess";
import ResetSuccess from "./authentication_components/ResetSuccess.jsx"
// import TrialChat from "./pages/TrialChat.jsx"
import TrialChat from "./pages/TrialChat.jsx"
import LogOut from './Logout.jsx'
// import SkinProfilePage from '../src/proto-pages/SkinProfilePage.jsx'
import SkinProfilePage from "./pages/SkinProfilePage.jsx"
// import TrainGif from './proto-pages/TrainGif.jsx'
// import ChatBot from "../src/proto-pages/ChatPage.jsx"
// import ChatBot from "./pages/ChatPage.jsx"
// import ForgotPasswordPhone from './team-pages/ForgotPasswordPhone.jsx'
import ForgotPasswordPhone from "./authentication_components/ForgotPasswordPhone.jsx"
// import GifCompo from './proto-pages/GifCompo.jsx'
// import Dashboard from "./team-pages/DashboardPage.jsx"
// import Home from './team-pages/Home.jsx'
// import Home from "./pages/Home.jsx"
// import SettHome from './settings_components/SettHome.jsx'
import SettHome from "./settings_components/SettHome.jsx"
// import SuccessGoogle from './team-pages/SuccessGoogle.jsx'
import SuccessGoogle from './authentication_components/SuccessGoogle.jsx'
// import SuccessEmail from './team-pages/SuccessEmail.jsx'
import SuccessEmail from './authentication_components/SuccessEmail.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
// import ResetPassword from './team-pages/ResetPassword.jsx'
import ResetPassword from "./authentication_components/ResetPassword.jsx"
import ScrollToTop from './ScrollToTop.jsx'
// import ForgotPhonePassword from './team-pages/ForgotPhonePassword.jsx'
import ForgotPhonePassword from "./pages/ForgotPhonePassword.jsx"
// import GenSupport from './team-pages/GenSupport.jsx'
import GenSupport from "./pages/GenSupport.jsx"
// import GifCompo from './zyla_components/ZylaLogin.jsx'
import ArchivedChatPage from './pages/ArchivedChatPage.jsx'

// import ZylaCompo from "./zyla_components/ZylaCompo.jsx"
import AboutUs from './promotion_components/AboutUs/Aboutus.jsx'

// import TrainGif from './team-pages/proto-pages/TrainGif'
import { Toaster } from "react-hot-toast";
import CookiePolicy from './pages/CookiePolicy.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import DashLayout from './layout/DashLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import Loading from './home_components/Loading.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
 <Toaster
        position="top-right"
        containerClassName="toast-top-right-custom"
      />
      <BrowserRouter>
      <ScrollToTop />
    <Routes>
      
      <Route element={<DashLayout />}>

      <Route path='/dashboard' element={<DashboardPage />} />
      <Route path='/chatbot' element={<ChatPage />} />
      <Route path="/skinProfile" element={<SkinProfilePage />} />



      </Route>
              <Route path='/cookie-policy' element={<CookiePolicy />} />

        <Route path='/privacy-policy' element={<PrivacyPolicy />} />

      <Route path="/" element={<PromotionPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/phoneReset" element={<PhoneNumberReset />} />
      <Route path="/forgotPhonePassword" element={<ForgotPasswordPhone />} />
      <Route path="/verification" element={<VerificationPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path='/logout' element={<LogOut />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<RegistrationPage />}/>
      <Route path="/newPassword" element={<NewPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/success" element={<ResetSuccess />}/>
      <Route path="/successGoogle" element={<SuccessGoogle />}/>
      <Route path="/successEmail" element={<SuccessEmail />}/>
      <Route path="/TrialChat" element={<TrialChat/>}/>
      {/* <Route path="/trainGif" element={<TrainGif />} /> */}
      {/* <Route path="/chatbot" element={<ChatBot />} /> */}
      {/* <Route path="/gifcompo" element={<GifCompo />} /> */}
      {/* <Route path='/dashboard' element={<Dashboard />} /> */}
      {/* <Route path='/dashboard' element={<Home />} /> */}
      <Route path='/settings' element={<SettHome />} />

      <Route path='/forgotPhonePasswordReset' element={<ForgotPhonePassword />}  />

      <Route path='/general-support' element={<GenSupport />} />

      <Route path='/archivedChats' element={<ArchivedChatPage />} /> 

      {/* <Route path='/gifcompo' element={<GifCompo />} />
      
        <Route path='/ZylaCompo' element={<ZylaCompo />} /> */}

        <Route path='/aboutUs' element={<AboutUs />}  />

        <Route path='/loading' element={<Loading />}  />



    </Routes>
    {/* <App /> */}
    </BrowserRouter>
         
    </ThemeProvider>
  </StrictMode>
)
