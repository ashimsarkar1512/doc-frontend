"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type OptionStep = {
  type: "options";
  question: string;
  options: string[];
};

type MultiStep = {
  type: "multi";
  question: string;
  options: string[];
  hint?: string;
};

type InputStep = {
  type: "input";
  question: string;
  placeholder: string;
  inputType?: string;
};

type InfoStep = {
  type: "info";
  title: string;
  body: string;
  image?: string;
};

type Step = OptionStep | MultiStep | InputStep | InfoStep;

// ─── Assessment definitions per card title ───────────────────────────────────

const ASSESSMENT_STEPS: Record<string, { title: string; image: string; steps: Step[] }> = {
  default: {
    title: "Weight Loss / GLP-1 Assessment",
    image: "/assessments/assessment1.png",
    steps: [
      {
        type: "info",
        title: "Weight Loss / GLP-1 Assessment",
        body: "Weight loss is about more than diet and exercise alone. Weight Loss MD provides medical support to help you overcome these challenges.",
        image: "/assessments/assessment1.png",
      },
      {
        type: "options",
        question: "What is your biological sex?",
        options: ["Male", "Female", "Prefer not to say"],
      },
      {
        type: "input",
        question: "What is your date of birth?",
        placeholder: "MM / DD / YYYY",
        inputType: "text",
      },
      {
        type: "input",
        question: "What is your current weight?",
        placeholder: "e.g. 185 lbs",
        inputType: "text",
      },
      {
        type: "input",
        question: "What is your height?",
        placeholder: "e.g. 5 ft 8 in",
        inputType: "text",
      },
      {
        type: "options",
        question: "Have you tried to lose weight before?",
        options: ["Yes, multiple times", "Yes, once or twice", "No, this is my first time"],
      },
      {
        type: "multi",
        question: "Which weight-related conditions do you have? (Select all that apply)",
        options: [
          "Type 2 Diabetes",
          "Prediabetes",
          "Hypertension",
          "High Cholesterol",
          "Sleep Apnea",
          "None of the above",
        ],
        hint: "Select all that apply",
      },
      {
        type: "options",
        question: "Have you ever been diagnosed with any thyroid condition?",
        options: ["Yes", "No", "Not sure"],
      },
      {
        type: "options",
        question: "Do you have a personal or family history of medullary thyroid carcinoma (MTC)?",
        options: ["Yes", "No", "Not sure"],
      },
      {
        type: "options",
        question: "Are you currently pregnant, breastfeeding, or planning a pregnancy?",
        options: ["Yes", "No"],
      },
      {
        type: "options",
        question: "Have you ever had pancreatitis?",
        options: ["Yes", "No", "Not sure"],
      },
      {
        type: "multi",
        question: "Which of the following medications are you currently taking?",
        options: [
          "Insulin",
          "Blood pressure medication",
          "Cholesterol medication",
          "Other diabetes medication",
          "None of the above",
        ],
        hint: "Select all that apply",
      },
      {
        type: "options",
        question: "How would you describe your current activity level?",
        options: ["Sedentary (little or no exercise)", "Lightly active", "Moderately active", "Very active"],
      },
      {
        type: "options",
        question: "What is your primary goal?",
        options: [
          "Lose 10–20 lbs",
          "Lose 20–50 lbs",
          "Lose 50+ lbs",
          "Maintain current weight",
        ],
      },
      {
        type: "options",
        question: "How soon would you like to start treatment?",
        options: ["As soon as possible", "Within the next month", "Just exploring options"],
      },
      {
        type: "input",
        question: "What is your email address?",
        placeholder: "Enter your email",
        inputType: "email",
      },
      {
        type: "info",
        title: "You're all set!",
        body: "Thank you for completing the assessment. A licensed provider will review your responses and reach out within 1–2 business days to discuss your personalized treatment plan.",
        image: "/assessments/assessment1.png",
      },
    ],
  },
};

function getAssessmentConfig(title: string) {
  return ASSESSMENT_STEPS[title] ?? ASSESSMENT_STEPS["default"];
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentTitle: string;
}

export default function AssessmentModal({ isOpen, onClose, assessmentTitle }: AssessmentModalProps) {
  const config = getAssessmentConfig(assessmentTitle);
  const steps = config.steps;
  const totalSteps = steps.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [inputValue, setInputValue] = useState("");
  const [multiSelected, setMultiSelected] = useState<string[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setAnswers({});
      setInputValue("");
      setMultiSelected([]);
    }
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  const canProceed = (): boolean => {
    if (step.type === "info") return true;
    if (step.type === "options") return !!answers[currentStep];
    if (step.type === "multi") return multiSelected.length > 0;
    if (step.type === "input") return inputValue.trim().length > 0;
    return false;
  };

  const handleOptionSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: option }));
  };

  const handleMultiToggle = (option: string) => {
    setMultiSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleNext = () => {
    if (step.type === "input") {
      setAnswers((prev) => ({ ...prev, [currentStep]: inputValue }));
      setInputValue("");
    } else if (step.type === "multi") {
      setAnswers((prev) => ({ ...prev, [currentStep]: multiSelected }));
      setMultiSelected([]);
    }
    if (!isLast) setCurrentStep((s) => s + 1);
    else onClose();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      // Restore previous input if applicable
      const prevStep = steps[currentStep - 1];
      if (prevStep.type === "input") {
        setInputValue((answers[currentStep - 1] as string) ?? "");
      } else if (prevStep.type === "multi") {
        setMultiSelected((answers[currentStep - 1] as string[]) ?? []);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[540px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">{config.title}</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-medium">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ── Step Content ── */}
        <div className="px-5 pb-5">

          {/* INFO step */}
          {step.type === "info" && (
            <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              {step.image && (
                <div className="relative w-full h-[220px]">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <div className="p-4">
                <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
              </div>
            </div>
          )}

          {/* OPTIONS step */}
          {step.type === "options" && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-3 leading-snug">{step.question}</p>
              <div className="flex flex-col gap-2">
                {step.options.map((option) => {
                  const selected = answers[currentStep] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 ${
                        selected
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MULTI-SELECT step */}
          {step.type === "multi" && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1 leading-snug">{step.question}</p>
              {step.hint && (
                <p className="text-xs text-gray-400 mb-3">{step.hint}</p>
              )}
              <div className="flex flex-col gap-2">
                {step.options.map((option) => {
                  const selected = multiSelected.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => handleMultiToggle(option)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 flex items-center gap-3 ${
                        selected
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                          selected ? "bg-white border-white" : "border-gray-300"
                        }`}
                      >
                        {selected && (
                          <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* INPUT step */}
          {step.type === "input" && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-3 leading-snug">{step.question}</p>
              <input
                type={step.inputType ?? "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={step.placeholder}
                onKeyDown={(e) => e.key === "Enter" && canProceed() && handleNext()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                autoFocus
              />
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="px-5 pb-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={isFirst ? onClose : handleBack}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            {isFirst ? "Cancel" : "Back"}
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-sm"
          >
            {isLast ? "Submit" : step.type === "info" && isFirst ? "Start Assessment" : "Continue"}
          </button>
        </div>

      </div>
    </div>
  );
}
