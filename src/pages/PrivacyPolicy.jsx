import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "How We Use Your Information",
      content: [
        "Provide personalized skin-care recommendations",
        "Improve the accuracy of AI skin analysis",
        "Deliver customer support",
        "Enhance app functionality and performance",
        "Send updates and notifications",
        "Monitor usage patterns and prevent misuse",
      ],
    },
    {
      title: "How We Share Your Information",
      content: [
        "We do not sell your personal information. We may share your data only with:",
        "Service Providers: AI model processing services, Cloud storage providers",
        "Legal Requirements: Required by law, Necessary to protect user safety, Needed to prevent fraud or security threats",
      ],
    },
    {
      title: "Data Protection & Security",
      content: [
        "Data encryption (in transit & at rest)",
        "Secure cloud storage",
        "Strict access control",
        "Continuous monitoring",
        "However, no digital platform is 100% secure. Users should also protect their login credentials.",
      ],
    },
    {
      title: "Your Rights",
      content: [
        "Access your personal data",
        "Correct or update your information",
        "Request deletion of your data",
        "Opt-out of marketing communications",
        "Withdraw consent for data usage",
        "Request a copy of your stored information",
      ],
    },
    {
      title: "Data Retention",
      content: [
        "As long as your account is active",
        "As necessary to provide services",
        "As required for legal and security purposes",
        "You may request account deletion at any time",
      ],
    },
    {
      title: "Children’s Privacy",
      content: [
        "Ask Zyla does not knowingly collect data from individuals under age 13.",
        "Parents can enter their details and explore the website for their children.",
      ],
    },
    {
      title: "Changes to This Policy",
      content: [
        "We may update this Privacy Policy periodically.",
        'Changes will be posted in the app with the “Last Updated” date.',
      ],
    },
  
  ];

  return (
    <>
      <div className="w-full min-h-screen bg-[#1A0D28] text-white flex flex-col items-center px-4 py-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-4 cursor-pointer left-4 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition z-50"
        >
          <ArrowLeft size={32} />
        </button>

        {/* HEADER */}
        <div className="flex flex-col items-center gap-2 mt-6 text-center max-w-3xl">
          <h1 className="text-6xl md:text-7xl font-extrabold">
            <span className="text-white">PRIVACY </span>
            <span className="text-red-500">POLICY</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Last Updated: December 09, 2025
          </p>
        </div>

        {/* RED BANNER */}
        <div className="bg-red-600 text-white text-md py-3.5 px-4 rounded-md text-center w-full max-w-7xl my-6">
          This Privacy Policy will help you better understand how we collect, use, and share your personal information.
        </div>

        {/* GLASSY CONTAINER */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-10 shadow-xl space-y-12">
          {/* INTRO */}
          <section>
            <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-red-500 text-center">
              Privacy Policy
            </h2>
            <p className="text-lg md:text-xl text-gray-200 text-justify">
              Ask Zyla (“we”, “our”, “us”) is committed to protecting your personal information and ensuring transparency in how we collect, use, and safeguard your data. This Privacy Policy explains how the Ask Zyla Skin Care Application (“App”) manages user information.
            </p>
            <hr className="border-t border-gray-400 my-3" />
          </section>

          {/* INFORMATION WE COLLECT */}
          <section className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-red-500 text-center">
              Information We Collect
            </h2>

            <div>
              <h3 className="text-2xl font-semibold text-white">Personal Information</h3>
              <ul className="list-disc list-inside text-lg md:text-xl text-gray-200 text-left">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Age & gender (optional)</li>
                <li>Location (city, state)</li>
                <li>Login information (username/password)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white">Skin & Health Information</h3>
              <ul className="list-disc list-inside text-lg md:text-xl text-gray-200 text-left">
                <li>Skin type (dry, oily, combination, etc.)</li>
                <li>Skin concerns (acne, pigmentation, aging, sensitivity)</li>
                <li>Responses to Q&A after registration or AI recommendations</li>
                <li>Current product usage</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white">Technical Information</h3>
              <ul className="list-disc list-inside text-lg md:text-xl text-gray-200 text-left">
                <li>Device type (mobile/desktop)</li>
                <li>OS and browser type</li>
                <li>IP address</li>
                <li>App usage analytics</li>
                <li>Session logs and crash reports</li>
              </ul>
            </div>
          </section>

          <hr className="border-t border-gray-400 my-3" />

          {/* OTHER SECTIONS */}
          {sections.map((section, idx) => (
            <section className="my-6"  key={idx}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-red-500 text-center">
                {section.title}
              </h2>
              <ul className="list-disc list-inside text-lg md:text-xl text-gray-200 text-left space-y-1">
                {section.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <hr className="border-t border-gray-400 my-3" />

             

            </section>
          ))}
             <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-red-500 text-center">
                
          Contact Us
              </h2>
              <ul className="list-disc list-inside text-lg md:text-xl text-gray-200 text-left space-y-1">
                
                  <li>
                    <a 
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=askzyla.zeaisoft@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                    >
                      📧 : <span 
                className="text-blue-300 underline">
                         askzyla.zeaisoft@gmail.com
                        </span>
                    </a>
                  </li>
              
              </ul>
              <hr className="border-t border-gray-400 my-6" />

        </div>
      </div>

    </>
  );
}
