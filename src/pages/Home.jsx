import React, {useContext} from "react";
import { ThemeProvider, ThemeContext } from "../contexts/ThemeContext";

import DashboardPage from "./DashboardPage";
// import HeaderMain from "../team-pages/HeaderMain";
import HeaderMain from "../home_components/HeaderMain";
// import FooterMain from "../team-pages/FooterMain";
import FooterMain from "../home_components/FooterMain";

export default function Home() {
 const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";



  return (
      <div className={`min-h-screen relative
                             text-gray-50  ${isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"} `}>
        <HeaderMain />
        <div className="pt-10">
          <div className="flex justify-center w-full">
            <DashboardPage />
          </div>
          <FooterMain />
        </div>
      </div>
  );
}
