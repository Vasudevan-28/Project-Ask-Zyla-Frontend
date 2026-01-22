import React, { useState, useEffect, useContext } from 'react';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';
// import axios from 'axios';
import AIDescription from '../skin_profile_components/AIDescription';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import HeaderMain from '../team-pages/HeaderMain';
import HeaderMain from '../home_components/HeaderMain';
// import Header from '../team-pages/dash_components/Header';
import { ThemeContext } from "../contexts/ThemeContext";
// import FooterMain from '../team-pages/FooterMain';
import FooterMain from '../home_components/FooterMain';

import { SkinProfileApiService } from '../services/skin_profile_api';
import { useNavigate } from 'react-router-dom';



const SkinProfilePage = () => {
  const auth = getAuth()

  const navigate = useNavigate()
  
    const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  
  const [profileCleared, setProfileCleared] = useState(false)

  const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
      });
  
      return () => unsub();
    }, [auth]);

  const [isEditing, setIsEditing] = useState(false);
  const [skinData, setSkinData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zylaSummary, setZylaSummary] = useState("")
   

const concernOptions = [
  "Acne / Pimples",
  "Dryness",
  "Oily Skin",
  "Dark Spots / Pigmentation",
  "Aging / Fine Lines",
  "Dullness / Uneven Tone",
];

const skinTypeOptions = [
  "Oily",
  "Dry",
  "Combination",
  "Sensitive",
  "Normal",
  "Not sure",
];

const routineOptions = [
  "Every day",
  "Rarely",
  "Sometimes",
  "Never",
];

const goalOptions = [
  "Clearer Skin",
  "Smoother Texture",
  "Brighter Glow",
  "Anti-Aging Benefits",
  "Fewer Pimples",
];

const skinBehaviorOptions = [
  "Becomes more sensitive",
  "Gets oily",
  "Slight acne",
  "No major change",
  "Not sure",
];

const cycleOptions = [
  "In the next few days",
  "Next week",
  "2+ Weeks Later",
  "Not regular",
  "Not sure"
];

const buttonStyle = `
${isLight ? "bg-[#B9A3C7]" : "bg-white/30"}
`

useEffect(() => {
  if (!user) return;

  const triggerSummaryGeneration = async (USER_ID, profile) => {
    try {
      const updatedProfile = await SkinProfileApiService.updateSkinProfile(USER_ID, profile);

      if (updatedProfile.zyla_summary) {
        setZylaSummary(updatedProfile.zyla_summary);
      }
    } catch (err) {
      console.error("Summary generation error:", err);
    }
  };7

  const fetchSkinProfile = async () => {
    try {
      const USER_ID = user.uid;
      setLoading(true);

      const res = await SkinProfileApiService.loadSkinProfile(USER_ID);

      if (res.cleared) {
        setLoading(false)
        setProfileCleared(true)
        // navigate('/settings');
        return;
      }

      const profile = res.skinProfileData;

      if (profile.menstrualCycle) {
  const sb = profile.menstrualCycle.skinBehavior;
  if (!Array.isArray(sb)) {
    profile.menstrualCycle.skinBehavior = sb ? [sb] : [];
  }
}

      setSkinData(profile);
      setZylaSummary(profile.zyla_summary || "");
      setTempData(JSON.parse(JSON.stringify(profile)));

      if (!profile.zyla_summary) {
        triggerSummaryGeneration(USER_ID, profile);
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError(err.message || "Failed to load skin profile");
    } finally {
      setLoading(false);
    }
  };

  fetchSkinProfile();
}, [user]);


  const handleEdit = () => {
    if (!skinData) return;
    setTempData(JSON.parse(JSON.stringify(skinData)));
    setIsEditing(true);
  };

  const handleSave = async () => {
  try {
    setError(null);
    const USER_ID = user?.uid

    const updatedProfile = await SkinProfileApiService.saveSkinProfile(USER_ID, tempData)
    setSkinData(updatedProfile)
    setZylaSummary(updatedProfile.zyla_summary)

    setIsEditing(false);

  } catch (err) {
    console.error("Save error:", err);
    setError("Failed to save skin profile");
  }
};


  const handleCancel = () => {
    if (!skinData) return;
    setTempData(JSON.parse(JSON.stringify(skinData)));
    setIsEditing(false);
  };

  const handleMultiSelect = (field, value) => {
    setTempData((prev) => {
      const currentArray = prev[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const handleSingleSelect = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedSelect = (parent, field, value) => {
    setTempData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleNestedMultiSelect = (parentField, childField, option) => {
  setTempData((prev) => {
    const parent = prev[parentField] || {};
    const current = Array.isArray(parent[childField]) ? parent[childField] : [];
    const exists = current.includes(option);

    return {
      ...prev,
      [parentField]: {
        ...parent,
        [childField]: exists
          ? current.filter((v) => v !== option) 
          : [...current, option],              
      },
    };
  });
};


  const handleAllergiesChange = (hasAllergies) => {
    setTempData((prev) => ({
      ...prev,
      allergies: {
        hasAllergies,
        details: hasAllergies ? prev.allergies.details : '',
      },
    }));
  };

  const handleSymptomsChange = (hasSymptoms) => {
    setTempData((prev) => ({
      ...prev,
      otherSymptoms: {
        hasSymptoms,
        details: hasSymptoms ? prev.otherSymptoms.details : '',
      },
    }));
  };

  const renderMultiSelect = (label, field, options, currentValues = [], question) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold " title={question}>
        { isEditing ? question : label}
      </label>
      {isEditing ? (
        <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              // className="flex items-center space-x-2 p-1 hover:bg-purple-50 rounded"
               className={`flex items-center space-x-2 p-2 rounded-lg  transition-all cursor-pointer ${
                currentValues.includes(option)
                  ? ` text-white/90  ${buttonStyle} ` 
                  // : 'bg-gray-50 border-gray-200 text-black/90 hover:bg-purple-50 hover:border-[#994A97]'
                  : `${isLight ? "bg-white text-slate-900 border border-slate-300 " : "bg-white/10 text-slate-50"}`
              }`}
            >
            
              <input
                type="checkbox"
                checked={currentValues.includes(option)}
                onChange={() => handleMultiSelect(field, option)}
                // className="w-3 h-3 text-[#994A97] border-gray-300 rounded focus:ring-[#994A97]"
                className='hidden'
              />
              <span className="text-xs font-medium">{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          {currentValues.length > 0 ? (
            currentValues.map((value) => (
              <span
                key={value}
                className={`inline-block ${buttonStyle} text-white mb-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm`}
              >
                {value}
              </span>
            ))
          ) : (
            <span className="text-gray-500 italic text-xs">Not specified</span>
          )}
        </div>
      )}
    </div>
  );

  const renderSingleSelect = (label, field, options, currentValue, question) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold " title={question}>
        { isEditing ? question : label}
      </label>
      {isEditing ? (
        <div className="space-y-1">
          {options.map((option) => (
            <label
              key={option}
              // className="flex items-center space-x-2 p-1 hover:bg-purple-50 rounded"
              className={`flex items-center space-x-2 p-2 rounded-xl  transition-all cursor-pointer ${
                currentValue === option
                  // ? 'bg-[#B9A3C7] text-white border-[#994A97]'
                  // ? 'bg-gray-50 border-gray-200 hover:bg-purple-50 text-black/90  hover:border-[#994A97]'
                   ? ` text-white/90  ${buttonStyle} `
                  // : 'bg-gray-50 border-gray-200 text-black/90 hover:bg-purple-50 hover:border-[#994A97]'
                  : `${isLight ? "bg-white text-slate-900 border border-slate-300 " : "bg-white/10 text-slate-50"}`

              }`}
            >
            
              <input
                type="radio"
                checked={currentValue === option}
                onChange={() => handleSingleSelect(field, option)}
                // className="w-3 h-3 text-[#994A97] border-gray-300 focus:ring-[#994A97]"
                className='hidden'
              />
              <span className="text-xs font-medium">{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <span className={`inline-block   ${isLight ? "bg-[#B9A3C7]" : "bg-white/10"} text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm`}>
          {currentValue}
        </span>
      )}
    </div>
  );

  const handleMenstrualChange = (hasMenstrualCycle) => {
    setTempData((prev) => ({
      ...prev, 
      menstrualCycle: { ...prev.menstrualCycle, hasMenstrualCycle}
    }))
  }

  const renderMenstrual = (label, field, hasValue, onChange, question) => (
  <div className={`${isLight ? "bg-white/60 text-slate-900 " : "bg-white/10 text-slate-50"} backdrop-blur-2xl rounded-xl shadow-sm p-4 border-l-4 border-[#994A97]`}>
    <div className="flex items-center gap-4">
      <label className="block text-base font-semibold ">
        { isEditing ? question : label}
      </label>

      {isEditing ? (
        <div className="flex gap-3">
         <label  className={`flex items-center space-x-1 px-3 py-1 rounded-full shadow-sm
                ${hasValue ? `  border-[#994A97] text-white ${isLight ? "bg-[#B9A3C7]" : "bg-white/30"} `
                  : `  
                  ${isLight ? "bg-white text-black border border-gray-400" : "bg-white/10"} 
                  `}
              `}>
            <input
              type="radio"
              checked={hasValue}
              onChange={() => onChange(true)}
              className='hidden'
            />
            <span className="text-sm font-medium">Yes</span>
          </label>
           <label  className={`flex items-center space-x-1 cursor-pointer px-3 py-1.5 rounded-full shadow-sm
              ${hasValue ? `  hover:bg-gray-400   ${isLight ? "bg-white text-black border border-gray-400" : "bg-white/10"}  `
               : `  border-[#994A97]
               ${isLight ? "bg-[#B9A3C7] text-white" : "bg-white/30"}
                
               `}

              `}>
            <input
              type="radio"
              checked={!hasValue}
              onChange={() => onChange(false)}
              className='hidden'
            />
            <span className="text-sm font-medium">No</span>
          </label>
        </div>
      ) : (
        <span
          className={`inline-block px-3 py-1.5 rounded-full text-xs shadow-sm font-medium 
             ${hasValue ? 
              `  border-[#994A97] ${isLight ? "bg-[#B9A3C7] text-white" : "bg-white/30"}`
              :
              ` hover:bg-gray-400   ${isLight ? "bg-white text-black border border-gray-400" : "bg-white/10"}  `
              }
            `}
        >
          {hasValue ? 'Yes' : 'No'}
        </span>
      )}
    </div>

    {hasValue && (
      <div className="grid grid-cols-1 mt-6 md:grid-cols-2 gap-4">

        <div className="space-y-2">
          <label className="block text-sm font-semibold ">
            { isEditing ? "When does your next menstrual cycle usually starts?" : "Usually Next Cycle Starts At"}
          </label>
          {isEditing ? (
            <div className="space-y-1 ">
              {cycleOptions.map((option) => (
                <label
                  key={option}
                 className={`flex items-center space-x-2 mb-2  p-2 rounded-xl  transition-all cursor-pointer ${
                tempData.menstrualCycle?.nextCycle === option
                  // ? ' bg-[#B9A3C7] text-white border-[#994A97]'
                  // : 'bg-gray-50 border-gray-200 hover:bg-purple-50 text-black/90  hover:border-[#994A97]'
                   ? 'bg-[#B9A3C7] text-white/90  '
                  // : 'bg-gray-50 border-gray-200 text-black/90 hover:bg-purple-50 hover:border-[#994A97]'
                  : `${isLight ? "bg-white text-slate-900 border border-slate-300 " : "bg-white/10 text-slate-50"}`

              }`}
                >
                  <input
                    type="radio"
                    checked={tempData.menstrualCycle?.nextCycle === option}
                    onChange={() =>
                      handleNestedSelect('menstrualCycle', 'nextCycle', option)
                    }
                    className='hidden'
                  />
                  <span className="text-xs font-medium ">{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <span className="inline-block bg-[#B9A3C7] text-white px-3 py-1.5 rounded-full text-xs shadow-lg font-medium">
              {tempData.menstrualCycle?.nextCycle || '-'}
            </span>
          )}
        </div>

     

<div className="space-y-2 md:ml-6">
  <label className="block text-sm font-semibold ">
    { isEditing ? "During your periods, how does your skin usually behave?" :  "Skin Behavior During Periods"}
  </label>

  {isEditing ? (
    <div className="space-y-1 md:max-h-32">
      {skinBehaviorOptions.map((option) => {
        const currentValues = Array.isArray(tempData.menstrualCycle?.skinBehavior)
          ? tempData.menstrualCycle.skinBehavior
          : [];

        const isSelected = currentValues.includes(option);

        return (
          <label
            key={option}
            className={`flex items-center space-x-2 mb-2 p-2 rounded-xl transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#B9A3C7] text-white/90'
                : `${isLight ? "bg-white text-slate-900 border border-slate-300 " : "bg-white/10 text-slate-50"}`
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() =>
                handleNestedMultiSelect('menstrualCycle', 'skinBehavior', option)
              }
              className="hidden"
            />
            <span className="text-xs font-medium">{option}</span>
          </label>
        );
      })}
    </div>
  ) : (
    <div className="flex flex-wrap gap-1">
      {Array.isArray(tempData.menstrualCycle?.skinBehavior) &&
      tempData.menstrualCycle.skinBehavior.length > 0 ? (
        tempData.menstrualCycle.skinBehavior.map((value) => (
          <span
            key={value}
            className="inline-block bg-[#B9A3C7] text-white px-3 py-1.5 rounded-full text-xs shadow-lg font-medium"
          >
            {value}
          </span>
        ))
      ) : (
        <span className="text-gray-500 italic text-xs">Not specified</span>
      )}
    </div>
  )}
</div>



        <div className="space-y-2 md:col-span-2  md:w-80 ">
          <label className="block text-sm font-semibold ">
            { isEditing ? "Would you like special skincare reminders during your cycle?" : "Special Skincare Reminders during Periods"}
          </label>
          {isEditing ? (
            <div className="flex gap-3">
               <label className={`flex items-center space-x-1 px-3 py-1 rounded-full shadow-sm
                ${tempData.menstrualCycle?.reminders ? `  border-[#994A97] text-white ${isLight ? "bg-[#B9A3C7]" : "bg-white/30"} `
                  : `  
                  ${isLight ? "bg-white text-black border border-gray-400" : "bg-white/10"} 
                  `}
              `}>
                <input
                  type="radio"
                  checked={!!tempData.menstrualCycle?.reminders}
                  onChange={() =>
                    handleNestedSelect('menstrualCycle', 'reminders', true)
                  }
                className='hidden'
                />
                <span className="text-xs font-medium">Yes</span>
              </label>
              <label className={`flex items-center space-x-1 cursor-pointer px-3 py-1.5 rounded-full shadow-sm
              ${tempData.menstrualCycle?.reminders ? `  hover:bg-gray-400   ${isLight ? "bg-white text-black border border-gray-400" : "bg-white/10"}  `
               : `  border-[#994A97]
               ${isLight ? "bg-[#B9A3C7] text-white" : "bg-white/30"}
                
               `}

              `}>
                <input
                  type="radio"
                  checked={!tempData.menstrualCycle?.reminders}
                  onChange={() =>
                    handleNestedSelect('menstrualCycle', 'reminders', false)
                  }
                className='hidden'
                />
                <span className="text-xs font-medium">No</span>
              </label>
            </div>
          ) : (
            <span
              className={`inline-block px-3 py-1.5 rounded-full text-xs shadow-lg font-medium ${tempData.menstrualCycle?.reminders ? `  hover:bg-gray-400   ${isLight ? "bg-white text-black border border-gray-400" : "bg-white/10"}  `
               : `  border-[#994A97]
               ${isLight ? "bg-[#B9A3C7] text-white" : "bg-white/30"}
                
               `} `}
            >
              {tempData.menstrualCycle?.reminders ? 'Yes' : 'No'}
            </span>
          )}
        </div>
      </div>
    )}
  </div>
);

  

  const renderYesNoSection = (label, field, hasValue, details, onChange, question) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold " title={question}>
        { isEditing ? question : label}
      </label>
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex gap-3">
            <label className={`flex items-center space-x-1 px-3 py-1 rounded-full shadow-sm
                ${hasValue ? `  border-[#994A97] text-white ${isLight ? "bg-[#B9A3C7]" : "bg-white/30"} `
                  : `  
                  ${isLight ? "bg-white text-black border border-gray-400" : "bg-white/10"} 
                  `}
              `}>
              <input
                type="radio"
                checked={hasValue}
                onChange={() => onChange(true)}
                // className="bg-red-500 border-gray-300 focus:ring-[#994A97]"
                className='hidden'
              />
              <span className="text-xs font-medium">Yes</span>
            </label>
            <label className={`flex items-center space-x-1 cursor-pointer px-3 py-1.5 rounded-full shadow-sm
              ${hasValue ? `  hover:bg-gray-400   ${isLight ? "bg-white text-black border border-gray-400" : "bg-white/10"}  `
               : `  border-[#994A97]
               ${isLight ? "bg-[#B9A3C7] text-white" : "bg-white/30"}
                
               `}

              `}>
              <input
                type="radio"
                checked={!hasValue}
                onChange={() => onChange(false)}
                // className="w-3 h-3 text-[#994A97] border-gray-300 focus:ring-[#994A97]"
                className='hidden'
              />
              <span className="text-xs font-medium">No</span>
            </label>
          </div>
          {hasValue && (
            <textarea
              value={details}
              onChange={(e) =>
                setTempData((prev) => ({
                  ...prev,
                  [field]: {
                    ...prev[field],
                    details: e.target.value,
                  },
                }))
              }
              rows="2"
              className={`w-full px-2 py-1  ${isLight ? "bg-white text-slate-700 placeholder-slate-400 border border-slate-700/60" : "bg-white/30 text-slate-50"}   text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c94bc4]`}
              placeholder={`Specify ${label.toLowerCase()}...`}
            />
          )}
        </div>
      ) : (
        <div className='flex gap-2' >
          {hasValue ? (
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs shadow-sm font-medium   ${isLight ? "bg-[#B9A3C7] text-white" : "bg-white/10"}`}>
              Yes
            </span>
          ) : (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium   ${isLight ? "bg-[#B9A3C7] text-white " : "bg-white/10"}`}>
              No
            </span>
          )}
          {hasValue && details && (
            <p className={`text-sm text-gray-700  ${isLight ? "bg-white text-slate-700 border border-slate-700/60" : "bg-white/30 text-slate-50"} w-full px-2 py-1 rounded-md`}>
              {details}
            </p>
          )}
        </div>
      )}
    </div>
  );

if (loading) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"
      }`}
    >
      <div
        className={`w-12 h-12 border-4 border-t-4 border-t-transparent rounded-full animate-spin ${
          isLight ? "border-gray-700" : "border-white"
        }`}
      ></div>
    </div>
  );
}


  if (!profileCleared && !tempData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"}`}>
        <div className={` font-semibold  ${isLight ? "text-slate-900" : "text-slate-100"} `}>Loading skin profile...</div>
      </div>
    );
  }


if (profileCleared) {
  return (
    <div className={`min-h-screen flex flex-col ${isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"}`}>
      
      <HeaderMain />

      {/* MAIN CONTENT (takes available space so footer goes to bottom) */}
      <div className="flex-1 min-h-screen relative justify-center items-center flex">
        
        {/* POPUP OVERLAY */}
        <div className="flex items-center justify-center z-50">
          <div className={`w-full max-w-md  rounded-xl p-6 shadow-xl space-y-4
            ${isLight ? "bg-white/90 text-slate-700 " : "bg-white/10 text-slate-100"}
            `}>
            <h3 className="text-xl font-semibold text-center">
              You haven't complete the skin questions !
            </h3>

            <div className="flex justify-center pt-2">
              <button
                className={`px-4 py-2 font-medium  cursor-pointer text-white rounded-lg transition
                  ${isLight ? "bg-[#B9A3C7]" : "bg-white/20"}
                  `}                
                  onClick={() => navigate('/questionnaire')}
              >
                Skin Questions
              </button>
            </div>
          </div>
        </div>

      </div>

      <FooterMain /> 

    </div>
  );
}



  return (
    <div>
    <div className={`min-h-screen pb-16 relative ${isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"} `}>
        <HeaderMain />
      <div className="max-w-7xl mx-auto p-4 md:p-0 ">
        <div className=" flex justify-end pt-16  items-center mb-4">
         

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2  bg-[#B9A3C7] text-white px-3 py-1.5 rounded-lg hover:bg-[#883885] transition-colors text-sm"
            >
              <FiEdit className="w-3 h-3" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <FiX className="w-3 h-3" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#B9A3C7] text-white px-3 py-1.5 rounded-lg hover:bg-[#BA78A1] transition-colors text-sm"
              >
                <FiSave className="w-3 h-3" />
                Save
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 ">
        
          <div className="lg:col-span-6 space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className={`${isLight ? "bg-white/60 text-slate-900 " : "bg-white/10 text-slate-50"} backdrop-blur-2xl rounded-xl shadow-lg p-4 border-l-4 border-[#994A97]`}>
                {renderMultiSelect('Concerns', 'concerns', concernOptions, tempData.concerns, "Choose your most important concerns?")}
              </div>

              <div className={`${isLight ? "bg-white/60 text-slate-900 " : "bg-white/10 text-slate-50"} rounded-xl shadow-sm p-4 border-l-4 border-[#994A97]`}>
                {renderMultiSelect('Skin Type', 'skinType', skinTypeOptions, tempData.skinType, "What is your Skin Type?")}
              </div>

              <div className={`${isLight ? "bg-white/60 text-slate-900 " : "bg-white/10 text-slate-50"} backdrop-blur-2xl rounded-xl shadow-sm p-4 border-l-4 border-[#994A97]`}>
                {renderMultiSelect('Goals', 'goals', goalOptions, tempData.goals, "What result do you want to Achieve with Skincare?")}
              </div>

              <div className={`${isLight ? "bg-white/60 text-slate-900 " : "bg-white/10 text-slate-50"} backdrop-blur-2xl rounded-xl shadow-sm p-4 border-l-4 border-[#994A97]`}>
                {renderSingleSelect(
                  'Skincare Routine Follow-Up',
                  'skincareRoutine',
                  routineOptions,
                  tempData.skincareRoutine,
                  "How often do you follow a skincare routine?"
                )}
              </div>

              <div className={`${isLight ? "bg-white/60 text-slate-900 " : "bg-white/10 text-slate-50"} backdrop-blur-2xl rounded-xl shadow-sm p-4 border-l-4 border-[#994A97]`}>
                {renderYesNoSection(
                  'Allergies or Sensitivities',
                  'allergies',
                  tempData.allergies?.hasAllergies,
                  tempData.allergies?.details,
                  handleAllergiesChange,
              "Do you have any allergies or sensitivites?"
                )}
              </div>

              <div className={`${isLight ? "bg-white/60 text-slate-900 " : "bg-white/10 text-slate-50"} backdrop-blur-2xl rounded-xl shadow-lg p-4 border-l-4 border-[#994A97]`}>
                {renderYesNoSection(
                  'Other Symptoms',
                  'otherSymptoms',
                  tempData.otherSymptoms?.hasSymptoms,
                  tempData.otherSymptoms?.details,
                  handleSymptomsChange,
                  "Please share any other symptoms or details we might have missed!"
                )}
              </div>
            </div>

            <div className='h-auto'>
              {renderMenstrual("Menstrual Cycle", 'menstrualCycle', tempData.menstrualCycle?.hasMenstrualCycle, handleMenstrualChange, "Would you like us to personalize your skincare based on your menstrual cycle?")}
            </div>

            
          </div>

          <AIDescription zylaSum = {zylaSummary} />
        </div>
      </div>
      </div>

    
   
      {/* <FooterMain /> */}
    </div>
  );
};

export default SkinProfilePage;


