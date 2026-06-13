"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TOTAL_STEPS = 16;

const INTRO = {
  title: "Weight Loss Assessment",
  image: "/assessments/assessment1.png",
  description:
    "Weight loss is about more than diet and exercise alone. Weight Loss MD provides medical support to help you overcome these challenges.",
};

const PROFILE_INTRO = {
  step: 3,
  title: "Weight Loss / GLP-1 Assessment",
  image: "/step-4.png",
  imageAlt: "Licensed medical provider completing a health profile",
  heading: "Your goal is within reach.",
  body: "To determine whether treatment is appropriate for you, our licensed medical providers require completion of a brief Weight Loss Profile. This information helps guide a personalized care plan based on your individual health needs.",
  prompt: "Are you ready to get started?",
};

const PROFILE_INPUTS = {
  step: 4,
  title: "Weight Loss / GLP-1 Assessment",
  question: "What is your age, current weight & height?",
  fields: [
    { name: "age",    label: "Age (Years)",   placeholder: "26",  type: "number" },
    { name: "height", label: "Height (Feet)", placeholder: "5",   type: "number" },
    { name: "weight", label: "Weight (lbs)",  placeholder: "220", type: "number" },
  ],
};

const QUESTIONS: {
  step: number;
  title: string;
  question: string;
  subtitle?: string;
  options: string[];
  multi?: false;
}[] = [
  {
    step: 2,
    title: "Weight Loss / GLP-1 Assessment",
    question: "How much weight are you looking to lose?",
    options: ["< 20 lbs", "21-50 lbs", "51+ lbs", "Not sure yet"],
  },
  {
    step: 10,
    title: "Weight Loss / GLP-1 Assessment",
    question: "Do you have an ALLERGY to GLP-1 agonist medications?",
    subtitle: "Examples include tirzepatide, Semaglutide",
    options: [
      "No, I do not have an allergy to GLP-1 medication",
      "Unfortunately, I am allergic to GLP-1 medication",
    ],
  },
  {
    step: 15,
    title: "Weight Loss / GLP-1 Assessment",
    question: "Almost there! Do you have any account?",
    subtitle: "Login or create a account to submit the assessment for approval",
    options: [
      "Yes, I already have an account",
      "No, I don't have an account. Create one.",
    ],
  },
  {
    step: 14,
    title: "Weight Loss / GLP-1 Assessment",
    question: "Is there anything else you want your healthcare provider to know about your health?",
    subtitle: "Include any additional details about the conditions you've already reported.",
    options: ["Yes", "No"],
  },
  {
    step: 13,
    title: "Weight Loss / GLP-1 Assessment",
    question: "Do you take any medications?",
    options: [
      "List the medications you are taking.",
      "I don't take any medications",
    ],
  },
  {
    step: 11,
    title: "Weight Loss / GLP-1 Assessment",
    question: "Are you currently taking a GLP-1 medication in the past 30 days?",
    options: [
      "No, I am not currently taking a GLP-1 medication in the past 30 days.",
      "Yes, I am currently taking a GLP-1 medication in the past 30 days.",
    ],
  },
];

const MULTI_QUESTIONS: {
  step: number;
  title: string;
  question: string;
  subtitle?: string;
  options: string[];
  noneOption?: string;
  multi: true;
}[] = [
  {
    step: 5,
    title: "Weight Loss / GLP-1 Assessment",
    question:
      "What do you want to accomplish with the Weight Loss MD Body Program? I want to…",
    options: [
      "Lose weight",
      "Improve my general physical health",
      "Improve another health condition",
      "Increase confidence about my appearance",
      "Increase energy for activities I enjoy",
      "I have another goal not listed above",
    ],
    multi: true,
  },
  {
    step: 6,
    title: "Weight Loss / GLP-1 Assessment",
    question:
      "Do you currently have, or have you ever been diagnosed with, any of the following heart or heart-related conditions?",
    subtitle: "Select all that apply.",
    options: [
      "Atrial fibrillation or flutter",
      "Tachycardia (episodes of rapid heart rate)",
      "Heart failure",
      "Heart disease, stroke, or peripheral vascular disease",
      "Prolonged QT interval",
      "Other heart rhythm issues or ECG abnormalities",
      "Hypertension (high blood pressure)",
      "Hyperlipidemia (high cholesterol)",
      "Hypertriglyceridemia (high triglycerides)",
      "No, I have not been diagnosed with any of these heart conditions",
    ],
    noneOption: "No, I have not been diagnosed with any of these heart conditions",
    multi: true,
  },
  {
    step: 7,
    title: "Weight Loss / GLP-1 Assessment",
    question:
      "Do you currently have, or have you ever been diagnosed with, any of these hormone, kidney, or liver conditions?",
    subtitle: "Select all that apply.",
    options: [
      "Multiple Endocrine Neoplasia syndrome type 2 (MEN2)",
      "Personal history of thyroid cancer",
      "Family history of thyroid cancer",
      "Chronic kidney disease",
      "Diabetes requiring insulin",
      "Type 2 Diabetes",
      "Prediabetes and Insulin Resistance",
      "Fatty liver disease (NAFLD or NASH)",
      "Kidney stones",
      "Liver cirrhosis or end stage liver disease",
      "Hypothyroidism (low functioning thyroid)",
      "Hyperthyroidism (high functioning thyroid)",
      "Graves disease",
      "Other thyroid issues",
      "Syndrome of Inappropriate Antidiuretic Hormone (SIADH)",
      "No, I have not been diagnosed with any of these conditions",
    ],
    noneOption: "No, I have not been diagnosed with any of these conditions",
    multi: true,
  },
  {
    step: 8,
    title: "Weight Loss / GLP-1 Assessment",
    question:
      "Do you currently have, or have history of, any of these gastrointestinal conditions or procedures?",
    subtitle: "Select all that apply.",
    options: [
      "Bariatric surgery",
      "Pancreatitis",
      "History of delayed gastric emptying or gastroparesis",
      "Gallstones or other gallbladder issues",
      "GERD / Acid Reflux requiring insulin",
      "No, I have not been diagnosed with any of these conditions or procedures",
    ],
    noneOption: "No, I have not been diagnosed with any of these conditions or procedures",
    multi: true,
  },
  {
    step: 12,
    title: "Weight Loss / GLP-1 Assessment",
    question: "Do you currently take any of the following medications?",
    subtitle: "Select all that apply.",
    options: [
      "Sulfonylureas such as (but not limited to) glipizide (Glucotrol), glimepiride (Amaryl)",
      "Insulin",
      "Warfarin (also called Jantoven or Coumadin) - a blood thinner that usually requires regular lab testing",
      "Meglitinides such as repaglinide or nateglinide",
      "Diuertics such as (but not limited to) furosemide (Lasix), bumetanide (Bumex) Hydrochlorothiazide/HCTZ",
      "Selective Seroonin Reuptake Inhibitors (SSRIs) such as (but not limited to) citalopram (Celexa), fluoxetine (Prozac), escitalopram (Lexapro)",
      "Monoamine Oxidase Inhibitors (MAOIs) such as (but not limited to) phenelzine (Nardil), selegiline (Emsam)",
      "None of the above",
    ],
    noneOption: "None of the above",
    multi: true,
  },
  {
    step: 9,
    title: "Weight Loss / GLP-1 Assessment",
    question:
      "Do you currently have, or have you ever been diagnosed with, any of these additional following conditions?",
    subtitle: "Select all that apply.",
    options: [
      "Chronic candidiasis (fungal infection)",
      "Eating disorder",
      "Gout",
      "Lymphedema or chronic lower extremity swelling where other causes have been ruled out",
      "Metabolic syndrome",
      "Obstructive sleep apnea",
      "Osteoarthritis",
      "Tinea infections (skin folds)",
      "No, I have not been diagnosed with any of these conditions or procedures",
    ],
    noneOption: "No, I have not been diagnosed with any of these conditions or procedures",
    multi: true,
  },
];

export default function AssessmentSteps() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers]         = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<number, string[]>>({});
  const [glp1Dosage, setGlp1Dosage]     = useState("");
  const [glp1Files, setGlp1Files]       = useState<File[]>([]);
  const [loginMode, setLoginMode]       = useState(false);
  const [loginEmail, setLoginEmail]     = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [registerEmail, setRegisterEmail]       = useState("");
  const [registerPhone, setRegisterPhone]       = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm]   = useState("");
  const [shippingMode, setShippingMode] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({ line1: "", city: "", state: "", zip: "" });
  const [completedMode, setCompletedMode] = useState(false);
  const [otpMode, setOtpMode]           = useState(false);
  const [otpVerifyMode, setOtpVerifyMode] = useState(false);
  const [otpChannel, setOtpChannel]     = useState("");
  const [otpDigits, setOtpDigits]       = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const progress = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  const currentQuestion      = QUESTIONS.find((q) => q.step === currentStep);
  const currentMultiQuestion = MULTI_QUESTIONS.find((q) => q.step === currentStep);

  const selectedAnswer       = answers[String(currentStep)] ?? "";
  const selectedMultiAnswers = multiAnswers[currentStep] ?? [];

  const profileInputValues = {
    age:    answers[`${currentStep}_age`]    ?? "",
    height: answers[`${currentStep}_height`] ?? "",
    weight: answers[`${currentStep}_weight`] ?? "",
  };

  // ── BMI helpers ──────────────────────────────────────────────────────────

  const calculateBMI = (weight: string, height: string) => {
    if (!weight || !height) return null;
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h) || h <= 0 || w <= 0) return null;
    const heightInches = h * 12;
    return (w * 703) / (heightInches * heightInches);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight",   color: "text-blue-600"   };
    if (bmi < 25)   return { category: "Normal weight", color: "text-green-600"  };
    if (bmi < 30)   return { category: "Overweight",    color: "text-orange-600" };
    return               { category: "Obese",           color: "text-red-600"    };
  };

  const calculateHealthyWeightRange = (height: string) => {
    if (!height) return null;
    const h = parseFloat(height);
    if (isNaN(h) || h <= 0) return null;
    const heightInches = h * 12;
    const minWeight = Math.round((18.5 * heightInches * heightInches) / 703);
    const maxWeight = Math.round((24.9 * heightInches * heightInches) / 703);
    return { min: minWeight, max: maxWeight };
  };

  const bmi          = calculateBMI(profileInputValues.weight, profileInputValues.height);
  const healthyRange = calculateHealthyWeightRange(profileInputValues.height);

  // ── OTP handlers ─────────────────────────────────────────────────────────

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => { newDigits[i] = char; });
    setOtpDigits(newDigits);
    const nextEmpty = newDigits.findIndex((d) => d === "");
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  // ── General handlers ─────────────────────────────────────────────────────

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [String(currentStep)]: option }));
  };

  const handleMultiToggle = (option: string) => {
    const noneOption = currentMultiQuestion?.noneOption;
    setMultiAnswers((prev) => {
      const current = prev[currentStep] ?? [];
      const exists  = current.includes(option);
      if (exists) {
        return { ...prev, [currentStep]: current.filter((o) => o !== option) };
      }
      if (noneOption && option === noneOption) {
        return { ...prev, [currentStep]: [noneOption] };
      }
      const withoutNone = noneOption
        ? current.filter((o) => o !== noneOption)
        : current;
      return { ...prev, [currentStep]: [...withoutNone, option] };
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [`${currentStep}_${field}`]: value }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleCancel = () => router.back();

  // ── Next-button disabled logic ────────────────────────────────────────────

  const isNextDisabled = () => {
    if (currentStep === PROFILE_INPUTS.step) {
      return !profileInputValues.age || !profileInputValues.height || !profileInputValues.weight;
    }
    if (currentStep === 11) {
      if (!selectedAnswer) return true;
      if (selectedAnswer.startsWith("Yes") && !glp1Dosage.trim()) return true;
      return false;
    }
    if (currentMultiQuestion) return selectedMultiAnswers.length === 0;
    if (currentQuestion)      return !selectedAnswer;
    return false;
  };

  // ── Masked email ─────────────────────────────────────────────────────────

  const activeEmail = registerMode ? registerEmail : loginEmail;

  const maskedEmail = activeEmail
    ? activeEmail.replace(
        /^(.{2})(.+?)(@.+)$/,
        (_: string, a: string, b: string, c: string) =>
          a + "*".repeat(Math.min(b.length, 6)) + c
      )
    : "ex******@email.com";

  // ── Page title ────────────────────────────────────────────────────────────

  const pageTitle =
    currentStep === 1
      ? INTRO.title
      : currentStep === PROFILE_INTRO.step
        ? PROFILE_INTRO.title
        : currentStep === PROFILE_INPUTS.step
          ? PROFILE_INPUTS.title
          : currentMultiQuestion?.title ??
            currentQuestion?.title ??
            "Weight Loss / GLP-1 Assessment";

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white flex items-start justify-center px-4 pt-10 ">
      <div className="w-full max-w-[700px]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
            {pageTitle}
          </h1>
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>

        {/* ── Progress bar ── */}
        <div
          className="relative w-full h-3 rounded-full mb-6"
          style={{ backgroundColor: "#EBEBEB" }}
        >
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
          <div className="rounded-2xl p-5 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
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

        {/* ── STEP 3: Profile intro card ── */}
        {currentStep === PROFILE_INTRO.step && (
          <div className="rounded-xl p-4 sm:p-4 mb-3" style={{ backgroundColor: "#EFEFEF" }}>
            <div className="relative w-full aspect-[1.94/1] rounded-lg overflow-hidden mb-5">
              <Image
                src={PROFILE_INTRO.image}
                alt={PROFILE_INTRO.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 668px, calc(100vw - 72px)"
              />
            </div>
            <div className="pb-1">
              <h2 className="text-[#202020] text-xl font-bold leading-snug mb-5">
                {PROFILE_INTRO.heading}
              </h2>
              <p className="text-[#2E2E2E] text-lg leading-[1.46] tracking-[0.01em] mb-5">
                {PROFILE_INTRO.body}
              </p>
              <p className="text-[#2E2E2E] text-lg leading-snug tracking-[0.01em]">
                {PROFILE_INTRO.prompt}
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 4: Profile inputs + health snapshot ── */}
        {currentStep === PROFILE_INPUTS.step && (
          <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
            <p className="text-gray-900 text-[17px] font-semibold mb-6 leading-snug">
              {PROFILE_INPUTS.question}
            </p>
            <div className="flex flex-col gap-4 mb-6">
              {PROFILE_INPUTS.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-gray-800 text-[15px] font-medium mb-2">
                    {field.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={profileInputValues[field.name as keyof typeof profileInputValues]}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                  />
                </div>
              ))}
            </div>
            {bmi && healthyRange && (
              <div className="rounded-xl p-4 mt-4" style={{ backgroundColor: "#E8DDD5" }}>
                <h3 className="text-gray-800 text-[16px] font-semibold mb-2">
                  Your Health Snapshot:
                </h3>
                <p className={`text-[15px] font-semibold mb-3 ${getBMICategory(bmi).color}`}>
                  BMI: {bmi.toFixed(1)} ({getBMICategory(bmi).category})
                </p>
                <p className="text-gray-700 text-[14px] leading-relaxed mb-2">
                  <span className="font-medium">Suggestion:</span>{" "}
                  {getBMICategory(bmi).category === "Overweight"
                    ? `You are in the overweight category. Aim to lose ${(
                        parseFloat(profileInputValues.weight) - healthyRange.max
                      ).toFixed(1)} lbs to reach a BMI of 24.9.`
                    : `You are in the ${getBMICategory(bmi).category.toLowerCase()} category.`}
                </p>
                <p className="text-gray-700 text-[14px] leading-relaxed">
                  Healthy range for your height: {healthyRange.min} lbs – {healthyRange.max} lbs
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Multi-select question card ── */}
        {currentMultiQuestion && (
          <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
            <p className="text-gray-900 text-[17px] font-semibold mb-1 leading-snug">
              {currentMultiQuestion.question}
            </p>
            {currentMultiQuestion.subtitle && (
              <p className="text-gray-500 text-[14px] mb-5">
                {currentMultiQuestion.subtitle}
              </p>
            )}
            {!currentMultiQuestion.subtitle && <div className="mb-5" />}
            <div className="flex flex-col gap-3">
              {currentMultiQuestion.options.map((option) => {
                const isChecked = selectedMultiAnswers.includes(option);
                const isNoneOpt = option === currentMultiQuestion.noneOption;
                return (
                  <button
                    key={option}
                    onClick={() => handleMultiToggle(option)}
                    className={`
                      flex items-center gap-4 w-full px-4 py-3.5
                      rounded-xl border text-left transition-all duration-150
                      ${isChecked ? "bg-white border-blue-500 shadow-sm" : "bg-white border-transparent hover:border-gray-300"}
                      ${isNoneOpt ? "mt-1" : ""}
                    `}
                  >
                    <span
                      className={`
                        flex-shrink-0 w-7 h-7 rounded-md border-2
                        flex items-center justify-center transition-colors duration-150
                        ${isChecked ? "border-blue-600 bg-blue-600" : "border-gray-400 bg-gray-300"}
                      `}
                    >
                      {isChecked && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-[15px] font-medium ${isNoneOpt ? "text-gray-600 italic" : "text-gray-800"}`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Single-select question card ── */}
        {currentQuestion && !(currentStep === 15 && (loginMode || registerMode || otpMode || otpVerifyMode)) && (
          <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
            <p className="text-gray-900 text-[17px] font-semibold mb-1 leading-snug">
              {currentQuestion.question}
            </p>
            {currentQuestion.subtitle && (
              <p className="text-gray-500 text-[14px] mb-5">
                {currentQuestion.subtitle}
              </p>
            )}
            {!currentQuestion.subtitle && <div className="mb-5" />}
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected  = selectedAnswer === option;
                const isYesOption = currentStep === 11 && option.startsWith("Yes");
                return (
                  <div key={option} className="flex flex-col">
                    <button
                      onClick={() => handleSelect(option)}
                      className={`
                        flex items-center gap-4 w-full px-4 py-3.5
                        rounded-xl border text-left transition-all duration-150
                        ${isSelected ? "bg-white border-blue-500 shadow-sm" : "bg-white border-transparent hover:border-gray-300"}
                      `}
                    >
                      <span
                        className={`
                          flex-shrink-0 w-7 h-7 rounded-full border-2
                          flex items-center justify-center transition-colors duration-150
                          ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-400 bg-gray-300"}
                        `}
                      >
                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </span>
                      <span className="text-gray-800 text-[15px] font-medium">{option}</span>
                    </button>

                    {isYesOption && isSelected && (
                      <div className="mt-3 flex flex-col gap-4 px-1">
                        <div>
                          <label className="block text-gray-700 text-[14px] font-medium mb-2">
                            Which medication dosage are you currently taking:
                          </label>
                          <input
                            type="text"
                            placeholder="Write here..."
                            value={glp1Dosage}
                            onChange={(e) => setGlp1Dosage(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                          />
                        </div>
                        <div>
                          <p className="text-gray-700 text-[14px] font-medium mb-2">
                            Upload Documentation: (If available)
                          </p>
                          <label className="inline-flex items-center gap-2 cursor-pointer px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold transition-all duration-150 shadow-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4" />
                            </svg>
                            Upload
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              className="hidden"
                              onChange={(e) => {
                                const files = Array.from(e.target.files ?? []);
                                setGlp1Files((prev) => [...prev, ...files]);
                                e.target.value = "";
                              }}
                            />
                          </label>
                          {glp1Files.length > 0 && (
                            <ul className="mt-3 flex flex-col gap-2">
                              {glp1Files.map((file, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-[13px] text-blue-700">
                                  <svg className="w-4 h-4 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v13a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="truncate max-w-[260px]">{file.name}</span>
                                  <button
                                    onClick={() => setGlp1Files((prev) => prev.filter((_, i) => i !== idx))}
                                    className="ml-1 text-red-500 hover:text-red-700 transition-colors"
                                    aria-label="Remove file"
                                  >
                                    ✕
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 15: Login form ── */}
        {currentStep === 15 && loginMode && !otpMode && !otpVerifyMode && (
          <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
            <h2 className="text-gray-900 text-[20px] font-bold mb-6 leading-snug">
              Login account
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-gray-800 text-[15px] font-medium mb-2">Email:</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
                />
              </div>
              <div>
                <label className="block text-gray-800 text-[15px] font-medium mb-2">Password:</label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 15: Register form ── */}
        {currentStep === 15 && registerMode && !otpMode && !otpVerifyMode && !shippingMode && (
          <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
            <h2 className="text-gray-900 text-[20px] font-bold mb-6 leading-snug">
              Register a new account
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-gray-800 text-[15px] font-medium mb-2">Email:</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
                />
              </div>
              <div>
                <label className="block text-gray-800 text-[15px] font-medium mb-2">Phone number:</label>
                <input
                  type="tel"
                  placeholder="+012 3456789"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
                />
              </div>
              <div>
                <label className="block text-gray-800 text-[15px] font-medium mb-2">Password:</label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
                />
              </div>
              <div>
                <label className="block text-gray-800 text-[15px] font-medium mb-2">Confirm Password:</label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={registerConfirm}
                  onChange={(e) => setRegisterConfirm(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
                />
              </div>
            </div>
          </div>
        )}


        {currentStep === 15 && otpMode && !otpVerifyMode && (
          <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
            <h2 className="text-gray-900 text-[20px] font-bold mb-2 leading-snug">
              Receive OTP Code
            </h2>
            <p className="text-gray-500 text-[14px] mb-5">
              Choose the option to receive the code
            </p>
            <div className="flex flex-col gap-3">
              {[
                { key: "email", label: "Email: " + maskedEmail },
                { key: "phone", label: "Phone: +123********90" },
              ].map(({ key, label }) => {
                const isSelected = otpChannel === key;
                return (
                  <button
                    key={key}
                    onClick={() => setOtpChannel(key)}
                    className={[
                      "flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150",
                      isSelected ? "bg-white border-blue-500 shadow-sm" : "bg-white border-transparent hover:border-gray-300",
                    ].join(" ")}
                  >
                    <span className={[
                      "flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-150",
                      isSelected ? "border-blue-600 bg-blue-600" : "border-gray-400 bg-gray-300",
                    ].join(" ")}>
                      {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </span>
                    <span className="text-gray-800 text-[15px] font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 15: Verify Authentication (OTP input) ── */}
        {currentStep === 15 && otpVerifyMode && !shippingMode && (
          <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
            <h2 className="text-gray-900 text-[20px] font-bold mb-3 leading-snug">
              Verify Authentication
            </h2>
            <p className="text-gray-700 text-[15px] leading-relaxed mb-6">
              Enter the 6 digit authentication code we&apos;ve sent you at your email{" "}
              <span className="font-medium">{maskedEmail}</span>
            </p>
            <div className="grid grid-cols-6 gap-2 mb-6">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="
                    w-full h-12 rounded-xl bg-gray-300 border-2 border-transparent
                    text-center text-[18px] font-semibold text-gray-800
                    focus:outline-none focus:border-blue-500 focus:bg-white
                    transition-all duration-150 caret-blue-600
                  "
                  placeholder="–"
                />
              ))}
            </div>
            <p className="text-gray-600 text-[14px]">
              Didn&apos;t receive the code?{" "}
              <button
                onClick={() => {
                  setOtpDigits(["", "", "", "", "", ""]);
                  otpRefs.current[0]?.focus();
                }}
                className="text-gray-800 font-semibold underline underline-offset-2 hover:text-blue-600 transition-colors duration-150"
              >
                Resend
              </button>
            </p>
          </div>
        )}

        {/* ── Step 15: Shipping Address (after register + OTP verify) ── */}
        {currentStep === 15 && shippingMode && (
          <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
            <h2 className="text-gray-900 text-[20px] font-bold mb-2 leading-snug">
              Almost there! Just a few more informations.
            </h2>
            <p className="text-gray-600 text-[15px] mb-5">
              Your account has been created and you are login in.
            </p>
            <div className="rounded-xl bg-white p-4 flex flex-col gap-4">
              <p className="text-gray-800 text-[15px] font-semibold">Shipping address</p>
              <div>
                <label className="block text-gray-700 text-[14px] mb-1">Address line 1</label>
                <input
                  type="text"
                  placeholder="4140 Parker Rd. Allentown"
                  value={shippingAddress.line1}
                  onChange={(e) => setShippingAddress((p) => ({ ...p, line1: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 text-[14px] mb-1">City:</label>
                  <input
                    type="text"
                    placeholder="Allentown"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress((p) => ({ ...p, city: e.target.value }))}
                    className="w-full px-3 py-3 rounded-lg bg-gray-200 border border-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-[14px] mb-1">State:</label>
                  <input
                    type="text"
                    placeholder="NM"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress((p) => ({ ...p, state: e.target.value }))}
                    className="w-full px-3 py-3 rounded-lg bg-gray-200 border border-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-[14px] mb-1">Zip:</label>
                  <input
                    type="text"
                    placeholder="31134"
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress((p) => ({ ...p, zip: e.target.value }))}
                    className="w-full px-3 py-3 rounded-lg bg-gray-200 border border-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[14px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 16: You are all set! ── */}
        {currentStep === 16 && (
          <div className="rounded-2xl p-5 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
            <div className="relative w-full rounded-xl overflow-hidden mb-6">
              <Image
                src="/last-step-16.png"
                alt="You are all set"
                width={700}
                height={450}
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
            <div className="px-1 pb-2 text-center">
              <h2 className="text-gray-900 text-[20px] font-bold mb-3">
                You are all set!
              </h2>
              <p className="text-gray-700 text-[16px] leading-relaxed">
                Your assessment is done and ready to submit for review.
                <br />
                Choose the products and add to cart before submission.
              </p>
            </div>
          </div>
        )}

        {/* ── Footer buttons ── */}
        <div className="flex items-center justify-between px-1 pb-10">

          {/* ── STEP 16 ── */}
          {currentStep === 16 && (
            <>
              <button
                onClick={() => {
                  if (registerMode) {
                    // came from shipping → go back to shipping
                    setShippingMode(true);
                    setCurrentStep(15);
                  } else {
                    // came from login OTP verify → go back to OTP verify
                    setOtpVerifyMode(true);
                    setCurrentStep(15);
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-[#EFEFEF] hover:bg-gray-300 text-gray-800 text-sm font-semibold tracking-wide transition-all duration-200"
              >
                Previous
              </button>
              <button
                onClick={() => router.push("/products")}
                className="px-7 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm"
              >
                Browser products
              </button>
            </>
          )}

          {/* ── STEP 1 ── */}
          {currentStep === 1 && (
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
          )}

          {/* ── STEP 15 ── */}
          {currentStep === 15 && (
            <>
              <button
                onClick={() => {
                  if (otpVerifyMode) {
                    setOtpVerifyMode(false);
                    setOtpMode(true);
                    setOtpChannel("");
                    setOtpDigits(["", "", "", "", "", ""]);
                  } else if (shippingMode) {
                    setShippingMode(false);
                    setOtpVerifyMode(true);
                    setOtpDigits(["", "", "", "", "", ""]);
                  } else if (otpMode) {
                    // go back to whichever form triggered OTP
                    setOtpMode(false);
                    if (registerMode) {
                      // stay in registerMode — form reappears
                    } else {
                      // stay in loginMode — form reappears
                    }
                  } else if (loginMode) {
                    setLoginMode(false);
                  } else if (registerMode) {
                    setRegisterMode(false);
                  } else {
                    handlePrevious();
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-[#EFEFEF] hover:bg-gray-300 text-gray-800 text-sm font-semibold tracking-wide transition-all duration-200"
              >
                Previous
              </button>

              {/* Shipping mode: Save & Continue */}
              {shippingMode && (
                <button
                  onClick={() => {
                    setShippingMode(false);
                    setCurrentStep(16);
                  }}
                  disabled={
                    !shippingAddress.line1.trim() ||
                    !shippingAddress.city.trim() ||
                    !shippingAddress.state.trim() ||
                    !shippingAddress.zip.trim()
                  }
                  className={`px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm ${
                    !shippingAddress.line1.trim() ||
                    !shippingAddress.city.trim() ||
                    !shippingAddress.state.trim() ||
                    !shippingAddress.zip.trim()
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Save &amp; Continue
                </button>
              )}

              {/* OTP verify mode: Verify Authentication button */}
              {otpVerifyMode && !shippingMode && (
                <button
                  onClick={() => {
                    if (registerMode) {
                      setOtpVerifyMode(false);
                      setShippingMode(true);
                    } else {
                      setOtpVerifyMode(false);
                      setCurrentStep(16);
                    }
                  }}
                  disabled={otpDigits.some((d) => d === "")}
                  className={`px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm ${
                    otpDigits.some((d) => d === "")
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Verify Authentication
                </button>
              )}

              {/* OTP channel picker: Send code */}
              {otpMode && !otpVerifyMode && (
                <button
                  onClick={() => {
                    if (otpChannel) {
                      setOtpMode(false);
                      setOtpVerifyMode(true);
                    }
                  }}
                  disabled={!otpChannel}
                  className={`px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm ${
                    !otpChannel
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Send code
                </button>
              )}

              {/* Login form: Login account */}
              {loginMode && !otpMode && !otpVerifyMode && (
                <button
                  onClick={() => {
                    if (loginEmail.trim() && loginPassword.trim()) setOtpMode(true);
                  }}
                  disabled={!loginEmail.trim() || !loginPassword.trim()}
                  className={`px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm ${
                    !loginEmail.trim() || !loginPassword.trim()
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Login account
                </button>
              )}

              {/* Register form: Register button */}
              {registerMode && !otpMode && !otpVerifyMode && !shippingMode && (
                <button
                  onClick={() => setOtpMode(true)}
                  disabled={
                    !registerEmail.trim() ||
                    !registerPhone.trim() ||
                    !registerPassword.trim() ||
                    !registerConfirm.trim()
                  }
                  className={`px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm ${
                    !registerEmail.trim() ||
                    !registerPhone.trim() ||
                    !registerPassword.trim() ||
                    !registerConfirm.trim()
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  Register
                </button>
              )}

              {/* Selection mode */}
              {!loginMode && !registerMode && !otpMode && !otpVerifyMode && selectedAnswer === "Yes, I already have an account" && (
                <button
                  onClick={() => setLoginMode(true)}
                  className="px-7 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm"
                >
                  Login account
                </button>
              )}
              {!loginMode && !registerMode && !otpMode && !otpVerifyMode && selectedAnswer === "No, I don't have an account. Create one." && (
                <button
                  onClick={() => setRegisterMode(true)}
                  className="px-7 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm"
                >
                  Create account
                </button>
              )}
              {!loginMode && !registerMode && !otpMode && !otpVerifyMode && !selectedAnswer && (
                <button
                  disabled
                  className="px-7 py-2.5 rounded-full bg-blue-300 text-white text-sm font-semibold tracking-wide cursor-not-allowed"
                >
                  Login account
                </button>
              )}
            </>
          )}

          {/* ── ALL OTHER STEPS ── */}
          {currentStep !== 1 && currentStep !== 15 && currentStep !== 16 && (
            <>
              <button
                onClick={handlePrevious}
                className="px-6 py-2.5 rounded-full bg-[#EFEFEF] hover:bg-gray-300 text-gray-800 text-sm font-semibold tracking-wide transition-all duration-200"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={`
                  px-8 py-2.5 rounded-full text-sm font-semibold tracking-wide
                  transition-all duration-200 shadow-sm
                  ${isNextDisabled()
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
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