'use client'

import Image from "next/image";
import React from "react";
import { useHomepageContent } from "@/providers/HomepageContentProvider";

const defaultSteps = [
  {
    number: 1,
    title: "Complete Your Medical Intake",
    description: "Share your health history and goals",
  },
  {
    number: 2,
    title: "Provider Evaluation",
    description: "A licensed medical provider reviews your information",
  },
  {
    number: 3,
    title: "Personalized Treatment Plan",
    description: "Based on your individual needs and clinical assessment",
  },
  {
    number: 4,
    title: "Ongoing Support & Monitoring",
    description: "Adjustments made as appropriate over time",
  },
];

const HowItsWork: React.FC = () => {
  const { content, isLoading } = useHomepageContent();

  const title = content?.howItWorksTitle || "How It Works";
  const stepsToDisplay = content
    ? [
        {
          number: 1,
          title: content.howItWorksStep1Title || defaultSteps[0].title,
          description: content.howItWorksStep1Description || defaultSteps[0].description,
        },
        {
          number: 2,
          title: content.howItWorksStep2Title || defaultSteps[1].title,
          description: content.howItWorksStep2Description || defaultSteps[1].description,
        },
        {
          number: 3,
          title: content.howItWorksStep3Title || defaultSteps[2].title,
          description: content.howItWorksStep3Description || defaultSteps[2].description,
        },
        {
          number: 4,
          title: content.howItWorksStep4Title || defaultSteps[3].title,
          description: content.howItWorksStep4Description || defaultSteps[3].description,
        },
      ]
    : defaultSteps;


  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Split Image Banner */}
        <div className="lg:col-span-6 w-full h-full flex items-center justify-center">
          <div className="w-full relative aspect-[4/3] md:aspect-[1.22] rounded-[2rem] overflow-hidden shadow-sm">
            {/* Using an Unsplash placeholder of transformation tracking to match Figma layout */}
            <Image
              src="/howItsWork.png"
              alt="Before and after progress illustration"
              className="w-full h-full object-cover object-center"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Right Side: Content & List Steps */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          {/* Main Title Section */}
          {isLoading ? (
             <div className="h-10 w-2/3 bg-gray-200 animate-pulse rounded-xl mb-8" />
          ) : (
            <h2 className="text-3xl md:text-[40px] font-bold text-gray-900 tracking-tight mb-8 uppercase">
              {title}
            </h2>
          )}

          {/* Process Rows Stack */}
          <div className="flex flex-col gap-4 w-full">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl w-full" />
              ))
            ) : (
              stepsToDisplay.map((step) => (
                <div
                  key={step.number}
                  className="w-full bg-blue-50/50 rounded-2xl p-5 flex items-center gap-5 border border-blue-50/10 hover:bg-blue-50/80 transition-colors duration-200"
                >
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm shadow-blue-600/20">
                    {step.number}
                  </div>

                  {/* Text Block */}
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-base font-bold text-gray-950 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItsWork;
