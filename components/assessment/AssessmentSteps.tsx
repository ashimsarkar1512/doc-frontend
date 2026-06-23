"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/Redux/store/hooks";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { setOtpPending, setCredentials } from "@/Redux/features/auth/authSlice";
import {
  useRegisterMutation,
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useUpdateProfileMutation,
  useUploadAttachmentMutation,
} from "@/Redux/api/authApi";
import {
  useGetAssessmentByIdQuery,
  useSubmitAssessmentMutation,
  type AssessmentDetail,
  type Question,
  type QuestionOption as Option,
} from "@/Redux/features/patient/assesmentcategory";

// ─── Helpers ──────────────────────────────────────────────────────────────────


function getMediaUrl(media: string | null | undefined): string | null {
  if (!media || !media.trim()) return null;
  if (media.startsWith("http")) return media;
  return `https://pre-storage.weightlossmdcherrycreek.com/testing/${media}`;
}

function getQuestionTitle(question: Question) {
  return question.questionText?.trim() || question.heading?.trim() || "";
}

function getQuestionOptions(question: Question): Option[] {
  return Array.isArray(question.options) ? question.options : [];
}

function getOptionSubQuestions(option: Option): Question[] {
  return Array.isArray(option.subQuestions) ? option.subQuestions : [];
}

function sortQuestionsByCreationOrder(questions: Question[]) {
  return [...questions].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aTime - bTime;
  });
}

/** Normalise the inputType field — backend sometimes sends "file upload" with a space */
function isFileInputType(inputType: string | null | undefined): boolean {
  if (!inputType) return false;
  return inputType.toLowerCase().replace(/\s+/g, "") === "fileupload" || inputType.toLowerCase() === "file";
}

// ─── File helpers ─────────────────────────────────────────────────────────────

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf")
    return { bg: "bg-red-50", text: "text-red-600", label: "PDF" };
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? ""))
    return { bg: "bg-blue-50", text: "text-blue-600", label: "IMG" };
  if (["doc", "docx"].includes(ext ?? ""))
    return { bg: "bg-indigo-50", text: "text-indigo-600", label: "DOC" };
  return {
    bg: "bg-gray-100",
    text: "text-gray-600",
    label: (ext ?? "FILE").toUpperCase().slice(0, 4),
  };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ─── Flat answer stores (works at any nesting depth) ─────────────────────────
// Keys are questionId or optionId strings.
// textAnswers  : questionId/optionId → string value
// fileAnswers  : questionId/optionId → File[]
// singleChoice : questionId → selected optionId
// multiChoice  : questionId → string[] of selected optionIds

interface AnswerStore {
  text: Record<string, string>;
  files: Record<string, File[]>;
  single: Record<string, string>;
  multi: Record<string, string[]>;
}

// ─── FileUploadField ──────────────────────────────────────────────────────────

function FileUploadField({
  label,
  description,
  files,
  onFileChange,
}: {
  label?: string;
  description?: string;
  files: File[];
  onFileChange: (files: File[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (incoming: File[]) => onFileChange([...files, ...incoming]);

  return (
    <div className="mt-2">
      {label && (
        <p className="text-gray-800 text-[15px] font-semibold mb-1">{label}</p>
      )}
      {description && (
        <p className="text-gray-500 text-[13px] mb-3">{description}</p>
      )}
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(Array.from(e.dataTransfer.files));
        }}
        className={`flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed py-8 px-4 cursor-pointer transition-all duration-150 ${isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/40"
          }`}
      >
        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center mb-1">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4" />
          </svg>
        </div>
        <p className="text-gray-700 text-[14px] font-medium">
          <span className="text-blue-600 font-semibold">Click to upload</span> or drag &amp; drop
        </p>
        <p className="text-gray-400 text-[12px]">PDF, JPG, PNG, DOC up to 10MB each</p>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </label>

      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file, idx) => {
            const icon = getFileIcon(file.name);
            return (
              <li key={idx} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${icon.bg} flex items-center justify-center`}>
                  <span className={`text-[10px] font-bold ${icon.text}`}>{icon.label}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-[13px] font-medium truncate">{file.name}</p>
                  <p className="text-gray-400 text-[11px]">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onFileChange(files.filter((_, i) => i !== idx))}
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                  aria-label="Remove"
                >
                  <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Recursive Option renderer ────────────────────────────────────────────────
// Renders one option button, and if selected renders its subQuestions recursively.

function RenderOption({
  option,
  isSelected,
  isCheckbox,
  onToggle,
  answers,
  setAnswers,
  depth,
}: {
  option: Option;
  isSelected: boolean;
  isCheckbox: boolean;
  onToggle: () => void;
  answers: AnswerStore;
  setAnswers: React.Dispatch<React.SetStateAction<AnswerStore>>;
  depth: number;
}) {
  const subQuestions = getOptionSubQuestions(option);

  return (
    <div className="flex flex-col">
      {/* Option button */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${isSelected
            ? "bg-white border-blue-500 shadow-sm"
            : "bg-white border-transparent hover:border-gray-300"
          }`}
      >
        <span
          className={`flex-shrink-0 w-7 h-7 ${isCheckbox ? "rounded-md" : "rounded-full"} border-2 flex items-center justify-center transition-colors duration-150 ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-400 bg-gray-300"
            }`}
        >
          {isSelected && (
            isCheckbox ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
            )
          )}
        </span>
        <span className="text-gray-800 text-[15px] font-medium">{option.label}</span>
      </button>

      {/* SubQuestions — recursive, shown only when selected */}
      {isSelected && subQuestions.length > 0 && (
        <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-300 flex flex-col gap-3">
          {subQuestions.map((sub) => (
            <RenderQuestion
              key={sub.id}
              question={sub}
              answers={answers}
              setAnswers={setAnswers}
              depth={depth + 1}
              isNested
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Recursive Question renderer ──────────────────────────────────────────────

function RenderQuestion({
  question,
  answers,
  setAnswers,
  depth = 0,
  isNested = false,
}: {
  question: Question;
  answers: AnswerStore;
  setAnswers: React.Dispatch<React.SetStateAction<AnswerStore>>;
  depth?: number;
  isNested?: boolean;
}) {
  const options = getQuestionOptions(question);
  const title = getQuestionTitle(question);
  const mediaUrl = getMediaUrl(question.media ?? null);
  const alignClass =
    question.contentAlignment === "CENTER"
      ? "text-center"
      : question.contentAlignment === "RIGHT"
        ? "text-right"
        : "text-left";

  // ── INFORMATION_ONLY (only at top level, nested ones are unusual but handled) ──
  if (question.type === "INFORMATION_ONLY") {
    const wrapperClass = isNested
      ? "rounded-xl p-4 mb-3 bg-gray-100"
      : "rounded-2xl p-5 mb-7";
    return (
      <div className={wrapperClass} style={isNested ? {} : { backgroundColor: "#EFEFEF" }}>
        {mediaUrl && (
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4">
            <Image src={mediaUrl} alt={title || "Info"} fill unoptimized className="object-cover" />
          </div>
        )}
        <div className={`px-1 pb-1 ${alignClass}`}>
          {question.heading?.trim() && (
            <h2 className="text-gray-900 text-[18px] font-bold mb-2 leading-snug">{question.heading}</h2>
          )}
          {question.description?.trim() && (
            <p className="text-gray-700 text-[15px] leading-relaxed">{question.description}</p>
          )}
        </div>
      </div>
    );
  }

  // ── SINGLE_CHOICE ──
  if (question.type === "SINGLE_CHOICE") {
    const selectedId = answers.single[question.id] ?? "";
    const wrapperClass = isNested
      ? "rounded-xl p-4 bg-gray-100"
      : "rounded-2xl p-6 mb-7";

    return (
      <div className={wrapperClass} style={isNested ? {} : { backgroundColor: "#EFEFEF" }}>
        {!isNested && mediaUrl && (
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-5">
            <Image src={mediaUrl} alt={title || "Question"} fill unoptimized className="object-cover" />
          </div>
        )}
        {!isNested && question.heading?.trim() && (
          <h2 className="text-gray-900 text-[18px] font-bold mb-2">{question.heading}</h2>
        )}
        {title && (
          <p className="text-gray-900 text-[17px] font-semibold mb-1 leading-snug">
            {title}
            {question.isRequired && <span className="text-red-500 ml-1">*</span>}
          </p>
        )}
        {question.description?.trim() && (
          <p className="text-gray-500 text-[14px] mb-5">{question.description}</p>
        )}
        <div className={title || question.description ? "mt-4" : ""}>
          {options.length === 0 ? (
            <p className="text-gray-400 text-[14px] italic">No options available.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {options.map((option) => (
                <RenderOption
                  key={option.id}
                  option={option}
                  isSelected={selectedId === option.id}
                  isCheckbox={false}
                  onToggle={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      single: { ...prev.single, [question.id]: option.id },
                    }))
                  }
                  answers={answers}
                  setAnswers={setAnswers}
                  depth={depth}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MULTIPLE_CHOICE ──
  if (question.type === "MULTIPLE_CHOICE") {
    const selectedIds = answers.multi[question.id] ?? [];
    const wrapperClass = isNested
      ? "rounded-xl p-4 bg-gray-100"
      : "rounded-2xl p-6 mb-7";

    return (
      <div className={wrapperClass} style={isNested ? {} : { backgroundColor: "#EFEFEF" }}>
        {!isNested && mediaUrl && (
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-5">
            <Image src={mediaUrl} alt={title || "Question"} fill unoptimized className="object-cover" />
          </div>
        )}
        {!isNested && question.heading?.trim() && (
          <h2 className="text-gray-900 text-[18px] font-bold mb-2">{question.heading}</h2>
        )}
        {title && (
          <p className="text-gray-900 text-[17px] font-semibold mb-1 leading-snug">
            {title}
            {question.isRequired && <span className="text-red-500 ml-1">*</span>}
          </p>
        )}
        {question.description?.trim() && (
          <p className="text-gray-500 text-[14px] mb-5">{question.description}</p>
        )}
        <div className={title || question.description ? "mt-4" : ""}>
          {options.length === 0 ? (
            <p className="text-gray-400 text-[14px] italic">No options available.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {options.map((option) => (
                <RenderOption
                  key={option.id}
                  option={option}
                  isSelected={selectedIds.includes(option.id)}
                  isCheckbox
                  onToggle={() =>
                    setAnswers((prev) => {
                      const current = prev.multi[question.id] ?? [];
                      return {
                        ...prev,
                        multi: {
                          ...prev.multi,
                          [question.id]: current.includes(option.id)
                            ? current.filter((id) => id !== option.id)
                            : [...current, option.id],
                        },
                      };
                    })
                  }
                  answers={answers}
                  setAnswers={setAnswers}
                  depth={depth}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── INPUT ──
  if (question.type === "INPUT") {
    const wrapperClass = isNested
      ? "rounded-xl p-4 bg-gray-100"
      : "rounded-2xl p-6 mb-7";

    return (
      <div className={wrapperClass} style={isNested ? {} : { backgroundColor: "#EFEFEF" }}>
        {!isNested && mediaUrl && (
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-5">
            <Image src={mediaUrl} alt={title || "Question"} fill unoptimized className="object-cover" />
          </div>
        )}
        {title && (
          <p className="text-gray-900 text-[17px] font-semibold mb-1 leading-snug">
            {title}
            {question.isRequired && <span className="text-red-500 ml-1">*</span>}
          </p>
        )}
        {question.description?.trim() && (
          <p className="text-gray-500 text-[14px] mb-4">{question.description}</p>
        )}

        {options.length === 0 ? (
          // No options defined: render a plain text input keyed by questionId
          <div className={title || question.description ? "mt-3" : ""}>
            <input
              type="text"
              placeholder="Write here..."
              value={answers.text[question.id] ?? ""}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  text: { ...prev.text, [question.id]: e.target.value },
                }))
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-[15px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
            />
          </div>
        ) : (
          <div className={`flex flex-col gap-4 ${title || question.description ? "mt-3" : ""}`}>
            {options.map((option) => {
              if (isFileInputType(option.inputType)) {
                return (
                  <FileUploadField
                    key={option.id}
                    label={option.label ?? undefined}
                    files={answers.files[option.id] ?? []}
                    onFileChange={(files) =>
                      setAnswers((prev) => ({
                        ...prev,
                        files: { ...prev.files, [option.id]: files },
                      }))
                    }
                  />
                );
              }

              const isNumber = option.inputType === "number";
              return (
                <div key={option.id}>
                  {option.label?.trim() && (
                    <label className="block text-gray-800 text-[15px] font-medium mb-2">
                      {option.label}
                    </label>
                  )}
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      {isNumber ? (
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      )}
                    </div>
                    <input
                      type={isNumber ? "number" : "text"}
                      placeholder={
                        option.placeholder?.trim() ||
                        (isNumber ? "Enter a number..." : "Write here...")
                      }
                      value={answers.text[option.id] ?? ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          text: { ...prev.text, [option.id]: e.target.value },
                        }))
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-[15px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ─── Validation helper (recursive) ───────────────────────────────────────────
// Returns true if required fields in this question (and any visible subquestions) are missing.

function isMissingRequired(question: Question, answers: AnswerStore): boolean {
  if (!question.isRequired) return false;
  if (question.type === "INFORMATION_ONLY") return false;

  const options = getQuestionOptions(question);

  if (question.type === "SINGLE_CHOICE") {
    if (options.length === 0) return false;
    const selectedId = answers.single[question.id];
    if (!selectedId) return true;
    // Check subquestions of selected option
    const selectedOpt = options.find((o) => o.id === selectedId);
    if (selectedOpt) {
      for (const sub of getOptionSubQuestions(selectedOpt)) {
        if (isMissingRequired(sub, answers)) return true;
      }
    }
    return false;
  }

  if (question.type === "MULTIPLE_CHOICE") {
    if (options.length === 0) return false;
    const selected = answers.multi[question.id] ?? [];
    if (selected.length === 0) return true;
    // Check subquestions of all selected options
    for (const optId of selected) {
      const opt = options.find((o) => o.id === optId);
      if (opt) {
        for (const sub of getOptionSubQuestions(opt)) {
          if (isMissingRequired(sub, answers)) return true;
        }
      }
    }
    return false;
  }

  if (question.type === "INPUT") {
    if (options.length === 0) {
      // Plain input keyed by questionId
      return !(answers.text[question.id] ?? "").trim();
    }
    for (const option of options) {
      if (isFileInputType(option.inputType)) {
        if (!(answers.files[option.id]?.length)) return true;
      } else {
        if (!(answers.text[option.id] ?? "").trim()) return true;
      }
    }
    return false;
  }

  return false;
}


// ─── Main Component ───────────────────────────────────────────────────────────

export default function AssessmentSteps() {
  const params = useParams();
  const assessmentId = params?.id as string | undefined;
  const { data: assessmentData, isLoading } = useGetAssessmentByIdQuery(
    assessmentId!,
    { skip: !assessmentId }
  );
  const assessment: AssessmentDetail | undefined = assessmentData;

  // Only top-level questions become steps
  const topLevelQuestions: Question[] = sortQuestionsByCreationOrder(
    (assessment?.questions ?? []).filter((q) => !q.parentOptionId)
  );

  // ── Step layout ──────────────────────────────────────────────────────────
  const DYNAMIC_START = 1;
  const AUTH_STEP = DYNAMIC_START + topLevelQuestions.length;
  const COMPLETION_STEP = AUTH_STEP + 1;
  const TOTAL_STEPS = COMPLETION_STEP;

  const [currentStep, setCurrentStep] = useState(1);

  // ── Flat answer store ─────────────────────────────────────────────────────
  const [answers, setAnswers] = useState<AnswerStore>({
    text: {},
    files: {},
    single: {},
    multi: {},
  });

  // ── Auth state ────────────────────────────────────────────────────────────
  const [authChoice, setAuthChoice] = useState<string>("");
  const [loginMode, setLoginMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [shippingMode, setShippingMode] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [otpMode, setOtpMode] = useState(false);
  const [otpVerifyMode, setOtpVerifyMode] = useState(false);
  const [otpChannel, setOtpChannel] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const otpPending = useAppSelector((state) => state.auth.otpPending);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [updateProfile, { isLoading: isSavingAddress }] = useUpdateProfileMutation();
  const [submitAssessment, { isLoading: isSubmitting }] = useSubmitAssessmentMutation();
  const [uploadAttachment] = useUploadAttachmentMutation();

  const progress = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  const currentDynQuestion: Question | undefined =
    currentStep >= DYNAMIC_START && currentStep < AUTH_STEP
      ? topLevelQuestions[currentStep - DYNAMIC_START]
      : undefined;

  // ── Auth helpers ──────────────────────────────────────────────────────────
  const activeEmail = registerMode ? registerEmail : loginEmail;
  const maskedEmail = activeEmail
    ? activeEmail.replace(
      /^(.{2})(.+?)(@.+)$/,
      (_: string, a: string, b: string, c: string) =>
        a + "*".repeat(Math.min(b.length, 6)) + c
    )
    : "ex******@email.com";

  // mask phone: show first 3 and last 2 digits, rest as *
  const maskedPhone = registerPhone
    ? registerPhone.replace(/(\+?\d{1,4}[\s-]?\d{1,3})(\d+)(\d{2})$/, (_, start, mid, end) =>
      start + "*".repeat(mid.length) + end
    )
    : "+***********";

  // ── Auth API handlers ─────────────────────────────────────────────────────
  const handleLoginSubmit = async () => {
    try {
      const res = await login({ email: loginEmail, password: loginPassword }).unwrap();
      dispatch(
        setOtpPending({
          userId: res.data.userId,
          challengeId: null,
          method: "EMAIL",
          purpose: "LOGIN",
        } as any)
      );
      toast.success(res.message);
      setLoginMode(false);
      setOtpMode(true);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ?? "Login failed."
      );
    }
  };

  const handleRegisterSubmit = async () => {
    if (registerPassword !== registerConfirm) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const res = await register({
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword,
        confirmPassword: registerConfirm,
      }).unwrap();
      dispatch(
        setOtpPending({
          userId: res.data.userId,
          challengeId: null,
          method: "EMAIL",
          purpose: "REGISTER",
        } as any)
      );
      toast.success(res.message);
      setRegisterMode(false);
      setOtpMode(true);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ?? "Registration failed."
      );
    }
  };

  const handleSendOtp = async () => {
    if (!otpPending?.userId) return;
    try {
      const res = await sendOtp({
        userId: otpPending.userId,
        purpose: otpPending.purpose,
        method: otpChannel as "EMAIL" | "PHONE",
      }).unwrap();
      dispatch(
        setOtpPending({
          userId: otpPending.userId,
          challengeId: res.data.challengeId,
          method: otpChannel as "EMAIL" | "PHONE",
          purpose: otpPending.purpose,
        } as any)
      );
      toast.success(res.message);
      setOtpMode(false);
      setOtpVerifyMode(true);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ?? "Failed to send OTP."
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpPending?.challengeId) return;
    try {
      const res = await verifyOtp({
        challengeId: otpPending.challengeId,
        otp: otpDigits.join(""),
      }).unwrap();
      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
      toast.success(res.message);
      setOtpVerifyMode(false);
      if (otpPending?.purpose === "REGISTER") {
        setShippingMode(true);
      } else {
        await submitAssessmentAnswers();
        setCurrentStep(COMPLETION_STEP);
      }
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ?? "Invalid OTP."
      );
    }
  };

  const handleResendOtp = async () => {
    if (!otpPending?.userId) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    try {
      // If challengeId is available, use resend-otp endpoint
      if (otpPending.challengeId) {
        const res = await resendOtp({
          challengeId: otpPending.challengeId,
          userId: otpPending.userId,
          purpose: otpPending.purpose,
        }).unwrap();
        toast.success(res.message);
      } else {
        // Fallback: send a fresh OTP using the stored channel
        const res = await sendOtp({
          userId: otpPending.userId,
          purpose: otpPending.purpose,
          method: (otpPending.method || otpChannel || "EMAIL") as "EMAIL" | "PHONE",
        }).unwrap();
        dispatch(
          setOtpPending({
            userId: otpPending.userId,
            challengeId: res.data.challengeId,
            method: (otpPending.method || otpChannel || "EMAIL") as "EMAIL" | "PHONE",
            purpose: otpPending.purpose,
          } as any)
        );
        toast.success(res.message);
      }
      setOtpDigits(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ?? "Failed to resend OTP."
      );
    }
  };

  const submitAssessmentAnswers = async () => {
    if (!assessmentId) return;

    try {
      const finalAnswers: any[] = [];

      const collectAnswers = async (questions: Question[]) => {
        for (const q of questions) {
          if (q.type === "INFORMATION_ONLY") continue;

          const qAns: any = { questionId: q.id };

          if (q.type === "SINGLE_CHOICE") {
            const selectedId = answers.single[q.id];
            if (selectedId) {
              qAns.selectedOptionIds = [selectedId];
              finalAnswers.push(qAns);
              const opt = q.options?.find((o) => o.id === selectedId);
              if (opt?.subQuestions?.length) await collectAnswers(opt.subQuestions);
            }
          } else if (q.type === "MULTIPLE_CHOICE") {
            const selectedIds = answers.multi[q.id] || [];
            if (selectedIds.length > 0) {
              qAns.selectedOptionIds = selectedIds;
              finalAnswers.push(qAns);
              for (const optId of selectedIds) {
                const opt = q.options?.find((o) => o.id === optId);
                if (opt?.subQuestions?.length) await collectAnswers(opt.subQuestions);
              }
            }
          } else if (q.type === "INPUT") {
            if (!q.options || q.options.length === 0) {
              const val = answers.text[q.id];
              if (val) {
                qAns.textResponse = val;
                finalAnswers.push(qAns);
              }
            } else {
              let textParts: string[] = [];
              for (const opt of q.options) {
                if (isFileInputType(opt.inputType)) {
                  const files = answers.files[opt.id] || [];
                  for (const file of files) {
                    const formData = new FormData();
                    formData.append("files", file);
                    formData.append("context", "ASSESSMENT_FILE");
                    try {
                      const res = await uploadAttachment(formData).unwrap();
                      const fileId = res.data?.id || res.data?.fileUrl || res.data?.url;
                      if (fileId) textParts.push(fileId);
                      else {
                        console.error("Upload succeeded but no file ID returned", res);
                        toast.error("File uploaded but could not get file ID. Please try again.");
                        throw new Error("No file ID returned from upload");
                      }
                    } catch (e: unknown) {
                      const errMsg = (e as { data?: { message?: string } })?.data?.message ?? "File upload failed";
                      console.error("File upload failed", e);
                      toast.error(errMsg);
                      throw e;
                    }
                  }
                } else {
                  const val = answers.text[opt.id];
                  if (val) textParts.push(val);
                }
              }
              if (textParts.length > 0) {
                qAns.textResponse = textParts.join(", ");
                finalAnswers.push(qAns);
              }
            }
          }
        }
      };

      await collectAnswers(topLevelQuestions);

      const res = await submitAssessment({
        assessmentId,
        answers: finalAnswers,
      }).unwrap();

      const submissionId = res?.data?.id || res?.data?.submissionId || (typeof res?.data === "string" ? res?.data : null);
      if (submissionId) {
        localStorage.setItem("submissionId", submissionId);
      }

      toast.success(res?.message || "Assessment submitted successfully!");

    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ?? "Assessment submission failed."
      );
      throw err;
    }
  };

  // ── OTP handlers ──────────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
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

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    else router.back();
  };

  const isNextDisabled = (): boolean => {
    if (!currentDynQuestion) return false;
    return isMissingRequired(currentDynQuestion, answers);
  };

  // ── Page title ────────────────────────────────────────────────────────────
  const pageTitle = assessment?.title ?? "Weight Loss Assessment";

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 text-[15px] font-medium">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white flex items-start justify-center px-4 pt-10">
      <div className="w-full max-w-[700px]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">{pageTitle}</h1>
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

        {/* ── DYNAMIC QUESTIONS ── */}
        {currentDynQuestion && (
          <RenderQuestion
            question={currentDynQuestion}
            answers={answers}
            setAnswers={setAnswers}
            depth={0}
            isNested={false}
          />
        )}

        {/* ── AUTH STEP ── */}
        {currentStep === AUTH_STEP && (
          <>
            {/* Selection */}
            {!loginMode && !registerMode && !otpMode && !otpVerifyMode && !shippingMode && (
              <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
                <p className="text-gray-900 text-[17px] font-semibold mb-1 leading-snug">
                  Almost there! Do you have any account?
                </p>
                <p className="text-gray-500 text-[14px] mb-5">
                  Login or create an account to submit the assessment for approval
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "Yes, I already have an account",
                    "No, I don't have an account. Create one.",
                  ].map((option) => {
                    const isSelected = authChoice === option;
                    return (
                      <button
                        key={option}
                        onClick={() => setAuthChoice(option)}
                        className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${isSelected
                            ? "bg-white border-blue-500 shadow-sm"
                            : "bg-white border-transparent hover:border-gray-300"
                          }`}
                      >
                        <span
                          className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-150 ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-400 bg-gray-300"
                            }`}
                        >
                          {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </span>
                        <span className="text-gray-800 text-[15px] font-medium">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Login Form */}
            {loginMode && !otpMode && !otpVerifyMode && (
              <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
                <h2 className="text-gray-900 text-[20px] font-bold mb-6 leading-snug">Login account</h2>
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
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-3.5 pr-12 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((p) => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Register Form */}
            {registerMode && !otpMode && !otpVerifyMode && !shippingMode && (
              <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
                <h2 className="text-gray-900 text-[20px] font-bold mb-6 leading-snug">Register a new account</h2>
                <div className="flex flex-col gap-5">

                  {/* Email */}
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

                  {/* Phone number with country code */}
                  <div>
                    <label className="block text-gray-800 text-[15px] font-medium mb-2">Phone number:</label>
                    <PhoneInput
                      defaultCountry="us"
                      value={registerPhone}
                      onChange={(phone) => setRegisterPhone(phone)}
                      style={{ width: "100%" }}
                      inputStyle={{
                        width: "100%",
                        height: "52px",
                        fontSize: "15px",
                        backgroundColor: "#e5e7eb",
                        border: "1px solid transparent",
                        borderRadius: "0.75rem",
                        color: "#1f2937",
                        paddingLeft: "8px",
                      }}
                      countrySelectorStyleProps={{
                        buttonStyle: {
                          height: "52px",
                          backgroundColor: "#e5e7eb",
                          border: "1px solid transparent",
                          borderRadius: "0.75rem 0 0 0.75rem",
                          paddingLeft: "10px",
                          paddingRight: "8px",
                        },
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-800 text-[15px] font-medium mb-2">Password:</label>
                    <div className="relative">
                      <input
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="••••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="w-full px-4 py-3.5 pr-12 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword((p) => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                        tabIndex={-1}
                      >
                        {showRegisterPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-gray-800 text-[15px] font-medium mb-2">Confirm Password:</label>
                    <div className="relative">
                      <input
                        type={showRegisterConfirm ? "text" : "password"}
                        placeholder="••••••••••"
                        value={registerConfirm}
                        onChange={(e) => setRegisterConfirm(e.target.value)}
                        className="w-full px-4 py-3.5 pr-12 rounded-xl border border-transparent bg-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterConfirm((p) => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                        tabIndex={-1}
                      >
                        {showRegisterConfirm ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* OTP Channel Picker */}
            {otpMode && !otpVerifyMode && (
              <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
                <h2 className="text-gray-900 text-[20px] font-bold mb-2 leading-snug">Receive OTP Code</h2>
                <p className="text-gray-500 text-[14px] mb-5">Choose the option to receive the code</p>
                <div className="flex flex-col gap-3">
                  {[
                    { key: "EMAIL", label: "Email: " + maskedEmail },
                    { key: "PHONE", label: "Phone: " + maskedPhone },
                  ].map(({ key, label }) => {
                    const isSelected = otpChannel === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setOtpChannel(key)}
                        className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${isSelected
                            ? "bg-white border-blue-500 shadow-sm"
                            : "bg-white border-transparent hover:border-gray-300"
                          }`}
                      >
                        <span
                          className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-150 ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-400 bg-gray-300"
                            }`}
                        >
                          {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </span>
                        <span className="text-gray-800 text-[15px] font-medium">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* OTP Verify */}
            {otpVerifyMode && !shippingMode && (
              <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
                <h2 className="text-gray-900 text-[20px] font-bold mb-3 leading-snug">Verify Authentication</h2>
                <p className="text-gray-700 text-[15px] leading-relaxed mb-6">
                  Enter the 6 digit authentication code we&apos;ve sent to{" "}
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
                      className="w-full h-12 rounded-xl bg-gray-300 border-2 border-transparent text-center text-[18px] font-semibold text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-150 caret-blue-600"
                      placeholder="–"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-[14px]">
                  Didn&apos;t receive the code?{" "}
                  <button
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-gray-800 font-semibold underline underline-offset-2 hover:text-blue-600 transition-colors duration-150"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}

            {/* Shipping Address */}
            {shippingMode && (
              <div className="rounded-2xl p-6 mb-7" style={{ backgroundColor: "#EFEFEF" }}>
                <h2 className="text-gray-900 text-[20px] font-bold mb-2 leading-snug">
                  Almost there! Just a few more details.
                </h2>
                <p className="text-gray-600 text-[15px] mb-5">
                  Your account has been created and you are logged in.
                </p>
                <div className="rounded-xl bg-white p-4 flex flex-col gap-4">
                  <p className="text-gray-800 text-[15px] font-semibold">Shipping address</p>
                  <div>
                    <label className="block text-gray-700 text-[14px] mb-1">Address line 1</label>
                    <input
                      type="text"
                      placeholder="4140 Parker Rd. Allentown"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress((p) => ({ ...p, address: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[15px]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "City:", placeholder: "Allentown", key: "city" as const },
                      { label: "State:", placeholder: "NM", key: "state" as const },
                      { label: "Zip:", placeholder: "31134", key: "zip" as const },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-gray-700 text-[14px] mb-1">{field.label}</label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={shippingAddress[field.key]}
                          onChange={(e) =>
                            setShippingAddress((p) => ({ ...p, [field.key]: e.target.value }))
                          }
                          className="w-full px-3 py-3 rounded-lg bg-gray-200 border border-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 text-[14px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── COMPLETION STEP ── */}
        {currentStep === COMPLETION_STEP && (
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
              <h2 className="text-gray-900 text-[20px] font-bold mb-3">You are all set!</h2>
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

          {/* ── COMPLETION STEP buttons ── */}
          {currentStep === COMPLETION_STEP && (
            <>
              <button
                onClick={() => {
                  setCurrentStep(AUTH_STEP);
                  if (authChoice === "No, I don't have an account. Create one.") {
                    setShippingMode(true);
                  } else {
                    setOtpVerifyMode(true);
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-[#EFEFEF] hover:bg-gray-300 text-gray-800 text-sm font-semibold tracking-wide transition-all duration-200"
              >
                Previous
              </button>
              <button
                onClick={() => router.push(`/products${assessment?.category?.id ? `?categoryId=${assessment.category.id}` : ""}`)}
                className="px-7 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm"
              >
                Browse products
              </button>
            </>
          )}

          {/* ── AUTH STEP buttons ── */}
          {currentStep === AUTH_STEP && (
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
                    setOtpMode(false);
                    setOtpChannel("");
                    // Restore the form they came from
                    if (authChoice === "Yes, I already have an account") {
                      setLoginMode(true);
                    } else {
                      setRegisterMode(true);
                    }
                  } else if (loginMode) {
                    setLoginMode(false);
                    setAuthChoice("");
                  } else if (registerMode) {
                    setRegisterMode(false);
                    setAuthChoice("");
                  } else {
                    handlePrevious();
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-[#EFEFEF] hover:bg-gray-300 text-gray-800 text-sm font-semibold tracking-wide transition-all duration-200"
              >
                Previous
              </button>

              {shippingMode && (
                <button
                  onClick={async () => {
                    try {
                      // Build payload with only non-empty fields (all optional)
                      const payload: Record<string, string> = {};
                      if (shippingAddress.address.trim()) payload.address = shippingAddress.address.trim();
                      if (shippingAddress.city.trim()) payload.city = shippingAddress.city.trim();
                      if (shippingAddress.state.trim()) payload.state = shippingAddress.state.trim();
                      if (shippingAddress.zip.trim()) payload.zipCode = shippingAddress.zip.trim();

                      if (Object.keys(payload).length > 0) {
                        await updateProfile(payload).unwrap();
                        toast.success("Address saved successfully.");
                      }

                      await submitAssessmentAnswers();
                      setShippingMode(false);
                      setCurrentStep(COMPLETION_STEP);
                    } catch (err: unknown) {
                      toast.error(
                        (err as { data?: { message?: string } })?.data?.message ??
                        "Failed to save address or submit assessment."
                      );
                    }
                  }}
                  disabled={isSavingAddress || isSubmitting}
                  className={`px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm ${isSavingAddress || isSubmitting
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {isSavingAddress || isSubmitting ? "Saving…" : "Save & Continue"}
                </button>
              )}

              {otpVerifyMode && !shippingMode && (
                <button
                  onClick={handleVerifyOtp}
                  disabled={otpDigits.some((d) => d === "") || isVerifyingOtp || isSubmitting}
                  className={`px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm ${otpDigits.some((d) => d === "") || isVerifyingOtp || isSubmitting
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {isVerifyingOtp || isSubmitting ? "Verifying…" : "Verify Authentication"}
                </button>
              )}

              {otpMode && !otpVerifyMode && (
                <button
                  onClick={handleSendOtp}
                  disabled={!otpChannel || isSendingOtp}
                  className={`px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm ${!otpChannel || isSendingOtp
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {isSendingOtp ? "Sending…" : "Send code"}
                </button>
              )}

              {loginMode && !otpMode && !otpVerifyMode && (
                <button
                  onClick={handleLoginSubmit}
                  disabled={!loginEmail.trim() || !loginPassword.trim() || isLoginLoading}
                  className={`px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm ${!loginEmail.trim() || !loginPassword.trim() || isLoginLoading
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {isLoginLoading ? "Signing in…" : "Login account"}
                </button>
              )}

              {registerMode && !otpMode && !otpVerifyMode && !shippingMode && (
                <button
                  onClick={handleRegisterSubmit}
                  disabled={
                    !registerEmail.trim() ||
                    !registerPhone.trim() ||
                    !registerPassword.trim() ||
                    !registerConfirm.trim() ||
                    isRegisterLoading
                  }
                  className={`px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm ${!registerEmail.trim() || !registerPhone.trim() ||
                      !registerPassword.trim() || !registerConfirm.trim() || isRegisterLoading
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {isRegisterLoading ? "Creating account…" : "Create account"}
                </button>
              )}

              {!loginMode && !registerMode && !otpMode && !otpVerifyMode && !shippingMode && (
                <>
                  {authChoice === "Yes, I already have an account" && (
                    <button
                      onClick={() => setLoginMode(true)}
                      className="px-7 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm"
                    >
                      Login account
                    </button>
                  )}
                  {authChoice === "No, I don't have an account. Create one." && (
                    <button
                      onClick={() => setRegisterMode(true)}
                      className="px-7 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm"
                    >
                      Create account
                    </button>
                  )}
                  {!authChoice && (
                    <button
                      disabled
                      className="px-7 py-2.5 rounded-full bg-blue-300 text-white text-sm font-semibold tracking-wide cursor-not-allowed"
                    >
                      Next
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {/* ── DYNAMIC QUESTION STEP buttons ── */}
          {currentStep !== AUTH_STEP && currentStep !== COMPLETION_STEP && (
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
                className={`px-8 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm ${isNextDisabled()
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
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