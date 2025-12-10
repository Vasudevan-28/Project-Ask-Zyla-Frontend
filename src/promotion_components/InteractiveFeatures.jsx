import React, { useState } from "react";
import { features } from "../data/features";

const InteractiveFeatures = ({ visible }) => {
  const initialActiveTitle = features.find(f => f.highlight)?.title || features[0].title;
  const [activeTabTitle, setActiveTabTitle] = useState(initialActiveTitle);
  const activeFeature = features.find(f => f.title === activeTabTitle);

  return (
    <div className="flex flex-col items-center w-full">

      {/* Icon Tabs */}
      <div
        className={`flex flex-wrap justify-center gap-4 md:gap-8 mb-6 max-w-5xl w-full px-2 transition-all duration-1000 delay-200
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
      >
        {features.map((feature) => {
          const isActive = activeTabTitle === feature.title;
          return (
            <div
              key={feature.title}
              className={`group flex flex-col items-center justify-center 
              p-3 md:p-4 w-[100px] h-[95px] md:w-[130px] md:h-[110px] 
              rounded-xl cursor-pointer transition-all duration-300 border text-center
              ${isActive
                ? 'bg-linear-to-br from-[#372b44] to-[#9686ac] border-white text-white shadow-xl scale-105'
                : 'bg-linear-to-br from-white to-gray-200 border-gray-300 text-black hover:scale-105'
              }`}
              onClick={() => setActiveTabTitle(feature.title)}
            >
              <div className={`text-2xl md:text-3xl p-2 rounded-full mb-1 transition-all duration-300
              ${isActive ? 'bg-white text-[#1A0D28]' : 'bg-gray-100 text-gray-700'}`}>
                {feature.icon}
              </div>
              <p className="text-[10px] md:text-xs font-medium leading-tight">
                {feature.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Content */}
      <div
        className={`flex justify-center w-full transition-all duration-1000 delay-400
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
      >
        <div className="
          bg-linear-to-br from-[#372b44] to-[#9686ac]/80 
          rounded-xl shadow-2xl 
          w-full max-w-[820px] 
          h-auto md:h-[140px] 
          hover:scale-105 
          flex flex-col md:flex-row 
          items-start 
          p-4 md:p-8 
          transition-all duration-700
        ">
          
          {/* Icon */}
          <div className="
            text-2xl md:text-3xl 
            p-3 md:p-4 
            bg-white text-[#1A0D28] 
            rounded-xl shadow-md 
            mr-0 md:mr-4 
            mb-3 md:mb-0 
            shrink-0 self-center md:self-start
          ">
            {activeFeature.icon}
          </div>

          {/* Text */}
          <div className="overflow-hidden w-full">
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 text-center md:text-left">
              {activeFeature.title}
            </h3>
            <p className="text-white leading-tight text-sm md:text-base line-clamp-none md:line-clamp-3 text-center md:text-left">
              {activeFeature.description}
            </p>
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex mt-4 gap-2">
        {features.map((feature) => {
          const isActive = activeTabTitle === feature.title;
          return (
            <button
              key={feature.title}
              className={`w-2 h-2 rounded-full transition-all duration-300
                ${isActive ? 'bg-white scale-125' : 'bg-gray-400 hover:scale-110'}`}
              onClick={() => setActiveTabTitle(feature.title)}
            />
          );
        })}
      </div>

    </div>
  );
};

export default InteractiveFeatures;
