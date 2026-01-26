import React from "react";
import HeroSection from "../promotion_components/HeroSection";
import StorySection from "../promotion_components/StorySection";
// import FeaturesSection from "../team-pages/Components/FeaturesSection";
import FeaturesSection from "../promotion_components/FeaturesSection";
import AccessPathSection from "../promotion_components/AccessPathSection";
import FAQSection from "../promotion_components/FAQSection";
import FeedbackSection from "../promotion_components/FeedbackSection";
// import Footer from "../team-pages/Footer";
import FooterPromo from "../home_components/FooterPromo";
import HeaderPromo from "../home_components/HeaderPromo";

import CookieBanner from "../cookie_components/CookieBanner";


export default function PromotionPage() {
  return (
    <>
     <CookieBanner />
      <HeaderPromo />
      <HeroSection />
      <div className="w-full h-px bg-[#FFD700]"></div>
      <StorySection />
      <div className="w-full h-px bg-[#FFD700]"></div>
      <FeaturesSection />
      <div className="w-full h-px bg-[#FFD700]"></div>
      <AccessPathSection />
      <div className="w-full h-px bg-[#FFD700]"></div>
      <FAQSection />
      <div className="w-full h-px bg-[#FFD700]"></div>
      <FeedbackSection />
      <FooterPromo />
    </>
  );
}
