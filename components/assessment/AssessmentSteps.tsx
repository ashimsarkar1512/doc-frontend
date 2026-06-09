"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TOTAL_STEPS = 17;

// Step 1 — intro with image
const INTRO = {
  title: "Weight Loss Assessment",
  image: "/assessments/assessment1.png",
  description:
    "Weight loss is about more than diet and exercise alone. Weight Loss MD provides medical support to help you overcome these challenges.",
};

// Steps 2+ — question/answer format
const QUESTIONS = [
  {
    step: 2,
    title: "Weight Loss / GLP-1 Assessment",
    question: "How much weight are you looking to lose?",
    options: ["< 20 lbs", "21-50 lbs", "51+ lbs", "Not sure yet"],
  },
  {
    step: 3,
    title: "Weight Loss / GLP-1 Assessment",
    question: "How long have you been struggling with your weight?",
    options: ["Less than 1 year", "1-3 years", "3-5 years", "More than 5 years"],
  },
  {
    step: 4,
    title: "Weight Loss / GLP-1 Assessment",
    question: "Have you tried weight loss programs before?",
    options: ["Yes, multiple times", "Yes, once or twice", "No, this is my first time", "Currently on one"],
  },
];

export default function AssessmentSteps() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const router = useRouter();

  const progress = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  const currentQuestion = QUESTIONS.find((q) => q.step === currentStep);
  const selectedAnswer = answers[currentStep] ?? "";

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: option }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleCancel = () => router.back();

  // Determine current title
  const pageTitle =
    currentStep === 1 ? INTRO.title : currentQuestion?.title ?? "Weight Loss / GLP-1 Assessment";

  return (
    <div className="min-h-screen bg-white flex items-start justify-center px-4 pt-10 sm:pt-16">
      <div className="w-full max-w-[700px]">

        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
            {pageTitle}
          </h1>
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>

        {/* Progress bar */}
       <div className="relative w-full h-3 rounded-full mb-6" style={{ backgroundColor: "#EBEBEB" }}>
          {/* Active Progress */}
          <div
            className="absolute left-0 top-0 h-full bg-blue-600 rounded-l-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
         
          
          <div 
            className="absolute top-0 bottom-0 w-3.5 bg-black rounded-full transition-all duration-500 ease-out"
            style={{ left: `calc(${progress}% - 7px)` }}
          />
        </div>

        {/* ── STEP 1: Intro card ── */}
        {currentStep === 1 && (
          <div
            className="rounded-2xl p-5 mb-7"
            style={{ backgroundColor: "#EFEFEF" }}
          >
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-6">
              <Image
                src={INTRO.image}
                alt="Weight Loss Visual"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="px-1 pb-1">
              <p className="text-gray-800 text-[17px] font-normal leading-relaxed tracking-wide">
                {INTRO.description}
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 2+: Question card ── */}
        {currentStep > 1 && currentQuestion && (
          <div
            className="rounded-2xl p-6 mb-7"
            style={{ backgroundColor: "#EFEFEF" }}
          >
            <p className="text-gray-900 text-[17px] font-semibold mb-5 leading-snug">
              {currentQuestion.question}
            </p>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`
                      flex items-center gap-4 w-full sm:w-[55%] px-4 py-3.5
                      rounded-xl border text-left
                      transition-all duration-150
                      ${isSelected
                        ? "bg-white border-blue-500 shadow-sm"
                        : "bg-white border-transparent hover:border-gray-300"
                      }
                    `}
                  >
                    {/* Radio dot */}
                    <span
                      className={`
                        flex-shrink-0 w-7 h-7 rounded-full border-2
                        flex items-center justify-center
                        transition-colors duration-150
                        ${isSelected
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-400 bg-gray-300"
                        }
                      `}
                    >
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="text-gray-800 text-[15px] font-medium">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex items-center justify-between px-1">
          {/* Step 1: Cancel | Start Assessment */}
          {currentStep === 1 ? (
            <>
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-full bg-[#EFEFEF] hover:bg-gray-300 text-gray-800 text-sm font-semibold tracking-wide transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                className="px-7 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm"
              >
                Start Assessment
              </button>
            </>
          ) : (
            /* Step 2+: Previous | Next */
            <>
              <button
                onClick={handlePrevious}
                className="px-6 py-2.5 rounded-full bg-[#EFEFEF] hover:bg-gray-300 text-gray-800 text-sm font-semibold tracking-wide transition-all duration-200"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className={`
                  px-8 py-2.5 rounded-full text-sm font-semibold tracking-wide
                  transition-all duration-200 shadow-sm
                  ${selectedAnswer
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-300 text-white cursor-not-allowed"
                  }
                `}
              >
                Next
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
