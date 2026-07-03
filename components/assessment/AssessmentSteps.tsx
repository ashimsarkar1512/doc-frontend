"use client";

import { useState, useRef } from "react";
import { AuthChoiceForm, LoginForm, RegisterForm, OtpChannelPicker, OtpVerifyForm, ShippingAddressForm } from "./AssessmentAuthForms";
import { CompletionStep } from "./AssessmentCompletion";
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

import { AnswerStore } from "./types";
import { sortQuestionsByCreationOrder, isMissingRequired, isFileInputType } from "./helpers";
import { RenderQuestion } from "./QuestionRenderer";


// ─── Main Component ───────────────────────────────────────────────────────────

export default function AssessmentSteps() {
  const params = useParams();
  const assessmentId = params?.id as string | undefined;
  const { data: assessmentData, isLoading } = useGetAssessmentByIdQuery(
    assessmentId!,
    { skip: !assessmentId },
  );
  const assessment: AssessmentDetail | undefined = assessmentData;

  // Only top-level questions become steps
  const topLevelQuestions: Question[] = sortQuestionsByCreationOrder(
    (assessment?.questions ?? []).filter((q) => !q.parentOptionId),
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
  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const otpPending = useAppSelector((state) => state.auth.otpPending);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [updateProfile, { isLoading: isSavingAddress }] =
    useUpdateProfileMutation();
  const [submitAssessment, { isLoading: isSubmitting }] =
    useSubmitAssessmentMutation();
  const [uploadAttachment] = useUploadAttachmentMutation();

  const progress = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  const currentDynQuestion: Question | undefined =
    currentStep >= DYNAMIC_START && currentStep < AUTH_STEP
      ? topLevelQuestions[currentStep - DYNAMIC_START]
      : undefined;

  // ── Auth helpers ──────────────────────────────────────────────────────────
  const activeEmail =
    otpPending?.email || (registerMode ? registerEmail : loginEmail);
  const maskedEmail = activeEmail
    ? activeEmail.replace(
        /^(.{2})(.+?)(@.+)$/,
        (_: string, a: string, b: string, c: string) =>
          a + "*".repeat(Math.min(b.length, 6)) + c,
      )
    : "ex******@email.com";

  // mask phone: show first 3 and last 2 digits, rest as *
  const activePhone = otpPending?.phone || registerPhone;
  const maskedPhone = activePhone
    ? activePhone.replace(
        /(\+?\d{1,4}[\s-]?\d{1,3})(\d+)(\d{2})$/,
        (_, start, mid, end) => start + "*".repeat(mid.length) + end,
      )
    : "+***********";

  // ── Auth API handlers ─────────────────────────────────────────────────────
  const handleLoginSubmit = async () => {
    try {
      const res = await login({
        email: loginEmail,
        password: loginPassword,
      }).unwrap();

      if (res.data?.status === "OTP_REQUIRED") {
        dispatch(
          setOtpPending({
            userId: res.data.userId,
            challengeId: null,
            method: "EMAIL",
            purpose: "LOGIN",
            email: res.data.email || loginEmail,
            phone: res.data.phone || "",
          } as any),
        );
        toast.success(res.message);
        setLoginMode(false);
        setOtpMode(true);
      } else if (res.data?.accessToken && res.data?.user) {
        // Direct Login without OTP
        dispatch(
          setCredentials({
            user: res.data.user,
            accessToken: res.data.accessToken,
          }),
        );
        toast.success("Login successful");
        setLoginMode(false);
        setShippingMode(true);
      }
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Login failed.",
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
          email: registerEmail,
          phone: registerPhone,
        } as any),
      );
      toast.success(res.message);
      setRegisterMode(false);
      setOtpMode(true);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Registration failed.",
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
        } as any),
      );
      toast.success(res.message);
      setOtpMode(false);
      setOtpVerifyMode(true);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to send OTP.",
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
      dispatch(
        setCredentials({
          user: res.data.user,
          accessToken: res.data.accessToken,
        }),
      );
      toast.success(res.message);
      if (otpPending?.purpose === "REGISTER") {
        setShippingMode(true);
        setOtpVerifyMode(false);
      } else {
        await submitAssessmentAnswers();
        setCurrentStep(COMPLETION_STEP);
        setOtpVerifyMode(false);
      }
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Invalid OTP.",
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
          method: (otpPending.method || otpChannel || "EMAIL") as
            | "EMAIL"
            | "PHONE",
        }).unwrap();
        dispatch(
          setOtpPending({
            userId: otpPending.userId,
            challengeId: res.data.challengeId,
            method: (otpPending.method || otpChannel || "EMAIL") as
              | "EMAIL"
              | "PHONE",
            purpose: otpPending.purpose,
          } as any),
        );
        toast.success(res.message);
      }
      setOtpDigits(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to resend OTP.",
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
              if (opt?.subQuestions?.length)
                await collectAnswers(opt.subQuestions);
            }
          } else if (q.type === "MULTIPLE_CHOICE") {
            const selectedIds = answers.multi[q.id] || [];
            if (selectedIds.length > 0) {
              qAns.selectedOptionIds = selectedIds;
              finalAnswers.push(qAns);
              for (const optId of selectedIds) {
                const opt = q.options?.find((o) => o.id === optId);
                if (opt?.subQuestions?.length)
                  await collectAnswers(opt.subQuestions);
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
                      const fileId = res.data?.id || res.data?.fileUrl;
                      if (fileId) textParts.push(fileId);
                      else {
                        console.error(
                          "Upload succeeded but no file ID returned",
                          res,
                        );
                        toast.error(
                          "File uploaded but could not get file ID. Please try again.",
                        );
                        throw new Error("No file ID returned from upload");
                      }
                    } catch (e: unknown) {
                      const errMsg =
                        (e as { data?: { message?: string } })?.data?.message ??
                        "File upload failed";
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

      const submissionId =
        res?.data?.id ||
        res?.data?.submissionId ||
        (typeof res?.data === "string" ? res?.data : null);
      if (submissionId) {
        localStorage.setItem("submissionId", submissionId);
      }
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Assessment submission failed.",
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

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newDigits = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => {
      newDigits[i] = char;
    });
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
          <p className="text-gray-600 text-[15px] font-medium">
            Loading assessment...
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white flex items-start justify-center">
      <div className="flex flex-col p-[24px] w-[900px] max-w-full">
        {/* ── Header ── */}
        <div className="flex items-center justify-between w-full px-1 mb-[12px]">
          <h1 style={{
            color: "#191B1C",
            fontFamily: "Quicksand, sans-serif",
            fontSize: "26px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "120%",
          }}>
            {pageTitle}
          </h1>
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>

        {/* ── Progress bar ── */}
        <div
          className="relative w-full h-3 rounded-full mb-[24px]"
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
            {!loginMode &&
              !registerMode &&
              !otpMode &&
              !otpVerifyMode &&
              !shippingMode && (
                <AuthChoiceForm authChoice={authChoice} setAuthChoice={setAuthChoice} />
            )}
            
            {loginMode && !otpMode && !otpVerifyMode && (
              <LoginForm 
                loginEmail={loginEmail} setLoginEmail={setLoginEmail} 
                loginPassword={loginPassword} setLoginPassword={setLoginPassword} 
                showLoginPassword={showLoginPassword} setShowLoginPassword={setShowLoginPassword} 
              />
            )}

            {registerMode && !otpMode && !otpVerifyMode && !shippingMode && (
              <RegisterForm 
                registerEmail={registerEmail} setRegisterEmail={setRegisterEmail} 
                registerPhone={registerPhone} setRegisterPhone={setRegisterPhone} 
                registerPassword={registerPassword} setRegisterPassword={setRegisterPassword} 
                registerConfirm={registerConfirm} setRegisterConfirm={setRegisterConfirm} 
                showRegisterPassword={showRegisterPassword} setShowRegisterPassword={setShowRegisterPassword} 
                showRegisterConfirm={showRegisterConfirm} setShowRegisterConfirm={setShowRegisterConfirm} 
              />
            )}

            {otpMode && !otpVerifyMode && (
              <OtpChannelPicker 
                otpChannel={otpChannel} setOtpChannel={setOtpChannel} 
                maskedEmail={maskedEmail} maskedPhone={maskedPhone} activePhone={activePhone} 
              />
            )}

            {otpVerifyMode && !shippingMode && (
              <OtpVerifyForm 
                otpDigits={otpDigits} handleOtpChange={handleOtpChange} 
                handleOtpKeyDown={handleOtpKeyDown} handleOtpPaste={handleOtpPaste} 
                maskedEmail={maskedEmail} handleResendOtp={handleResendOtp} 
                isResending={isResending} otpRefs={otpRefs} 
              />
            )}

            {shippingMode && (
              <ShippingAddressForm shippingAddress={shippingAddress} setShippingAddress={setShippingAddress} />
            )}
          </>
        )}

        {/* ── COMPLETION STEP ── */}
        {currentStep === COMPLETION_STEP && (
          <CompletionStep />
        )}
        {/* ── Footer buttons ── */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 w-full px-1 mt-[41px]">
          {/* ── COMPLETION STEP buttons ── */}
          {currentStep === COMPLETION_STEP && (
            <>
              <button
                onClick={() => {
                  setCurrentStep(AUTH_STEP);
                  if (
                    authChoice === "No, I don't have an account. Create one."
                  ) {
                    setShippingMode(true);
                  } else {
                    setOtpVerifyMode(true);
                  }
                }}
                className="flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] bg-[#EFEFEF] hover:bg-gray-300 text-[#2B2922] text-[20px] font-semibold leading-[150%] transition-all duration-200"
                style={{ fontFamily: "Quicksand, sans-serif" }}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  router.push(
                    `/products${assessment?.category?.id ? `?categoryId=${assessment.category.id}` : ""}`,
                  )
                }
                className="flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] bg-[#1D4ED8] hover:bg-blue-700 text-white text-[20px] font-semibold leading-[150%] transition-all duration-200 shadow-sm"
                        style={{ fontFamily: "Quicksand, sans-serif" }}
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
                className="flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] bg-[#EFEFEF] hover:bg-gray-300 text-[#2B2922] text-[20px] font-semibold leading-[150%] transition-all duration-200"
                style={{ fontFamily: "Quicksand, sans-serif" }}
              >
                Previous
              </button>

              {shippingMode && (
                <button
                  onClick={async () => {
                    try {
                      // Build payload with only non-empty fields (all optional)
                      const payload: Record<string, string> = {};
                      if (shippingAddress.address.trim())
                        payload.address = shippingAddress.address.trim();
                      if (shippingAddress.city.trim())
                        payload.city = shippingAddress.city.trim();
                      if (shippingAddress.state.trim())
                        payload.state = shippingAddress.state.trim();
                      if (shippingAddress.zip.trim())
                        payload.zipCode = shippingAddress.zip.trim();

                      if (Object.keys(payload).length > 0) {
                        await updateProfile(payload).unwrap();
                        toast.success("Address saved successfully.");
                      }

                      await submitAssessmentAnswers();
                      setCurrentStep(COMPLETION_STEP);
                      setShippingMode(false);
                    } catch (err: unknown) {
                      toast.error(
                        (err as { data?: { message?: string } })?.data
                          ?.message ??
                          "Failed to save address or submit assessment.",
                      );
                    }
                  }}
                  disabled={isSavingAddress || isSubmitting}
                  className={`flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] text-[20px] font-semibold leading-[150%] transition-all duration-200 shadow-sm ${
                    isSavingAddress || isSubmitting
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-[#1D4ED8] hover:bg-blue-700 text-white"
                  }`}
                  style={{ fontFamily: "Quicksand, sans-serif" }}
                >
                  {isSavingAddress || isSubmitting
                    ? "Saving…"
                    : "Save & Continue"}
                </button>
              )}

              {otpVerifyMode && !shippingMode && (
                <button
                  onClick={handleVerifyOtp}
                  disabled={
                    otpDigits.some((d) => d === "") ||
                    isVerifyingOtp ||
                    isSubmitting
                  }
                  className={`flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] text-[20px] font-semibold leading-[150%] transition-all duration-200 shadow-sm ${
                    otpDigits.some((d) => d === "") ||
                    isVerifyingOtp ||
                    isSubmitting
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-[#1D4ED8] hover:bg-blue-700 text-white"
                  }`}
                  style={{ fontFamily: "Quicksand, sans-serif" }}
                >
                  {isVerifyingOtp || isSubmitting
                    ? "Verifying…"
                    : "Verify Authentication"}
                </button>
              )}

              {otpMode && !otpVerifyMode && (
                <button
                  onClick={handleSendOtp}
                  disabled={!otpChannel || isSendingOtp}
                  className={`flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] text-[20px] font-semibold leading-[150%] transition-all duration-200 shadow-sm ${
                    !otpChannel || isSendingOtp
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-[#1D4ED8] hover:bg-blue-700 text-white"
                  }`}
                  style={{ fontFamily: "Quicksand, sans-serif" }}
                >
                  {isSendingOtp ? "Sending…" : "Send code"}
                </button>
              )}

              {loginMode && !otpMode && !otpVerifyMode && (
                <button
                  onClick={handleLoginSubmit}
                  disabled={
                    !loginEmail.trim() ||
                    !loginPassword.trim() ||
                    isLoginLoading
                  }
                  className={`flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] text-[20px] font-semibold leading-[150%] transition-all duration-200 shadow-sm ${
                    !loginEmail.trim() ||
                    !loginPassword.trim() ||
                    isLoginLoading
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-[#1D4ED8] hover:bg-blue-700 text-white"
                  }`}
                  style={{ fontFamily: "Quicksand, sans-serif" }}
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
                    registerPassword !== registerConfirm ||
                    registerPassword.length < 8 ||
                    !/[A-Z]/.test(registerPassword) ||
                    !/[a-z]/.test(registerPassword) ||
                    !/[\W_]/.test(registerPassword) ||
                    isRegisterLoading
                  }
                  className={`flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] text-[20px] font-semibold leading-[150%] transition-all duration-200 shadow-sm ${
                    !registerEmail.trim() ||
                    !registerPhone.trim() ||
                    !registerPassword.trim() ||
                    !registerConfirm.trim() ||
                    registerPassword !== registerConfirm ||
                    registerPassword.length < 8 ||
                    !/[A-Z]/.test(registerPassword) ||
                    !/[a-z]/.test(registerPassword) ||
                    !/[\W_]/.test(registerPassword) ||
                    isRegisterLoading
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-[#1D4ED8] hover:bg-blue-700 text-white"
                  }`}
                  style={{ fontFamily: "Quicksand, sans-serif" }}
                >
                  {isRegisterLoading ? "Creating account…" : "Create account"}
                </button>
              )}

              {!loginMode &&
                !registerMode &&
                !otpMode &&
                !otpVerifyMode &&
                !shippingMode && (
                  <>
                    {authChoice === "Yes, I already have an account" && (
                      <button
                        onClick={() => setLoginMode(true)}
                        className="flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] bg-[#1D4ED8] hover:bg-blue-700 text-white text-[20px] font-semibold leading-[150%] transition-all duration-200 shadow-sm"
                        style={{ fontFamily: "Quicksand, sans-serif" }}
                      >
                        Login account
                      </button>
                    )}
                    {authChoice ===
                      "No, I don't have an account. Create one." && (
                      <button
                        onClick={() => setRegisterMode(true)}
                        className="flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] bg-[#1D4ED8] hover:bg-blue-700 text-white text-[20px] font-semibold leading-[150%] transition-all duration-200 shadow-sm"
                        style={{ fontFamily: "Quicksand, sans-serif" }}
                      >
                        Create account
                      </button>
                    )}
                    {!authChoice && (
                      <button
                        disabled
                        className="flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] bg-blue-300 text-white text-[20px] font-semibold leading-[150%] cursor-not-allowed"
                        style={{ fontFamily: "Quicksand, sans-serif" }}
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
                className="flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] bg-[#EFEFEF] hover:bg-gray-300 text-[#2B2922] text-[20px] font-semibold leading-[150%] transition-all duration-200"
                style={{ fontFamily: "Quicksand, sans-serif" }}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={`flex items-center justify-center gap-[15px] px-[32px] py-[9px] rounded-[46px] text-[20px] font-semibold leading-[150%] transition-all duration-200 shadow-sm ${
                  isNextDisabled()
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-[#1D4ED8] hover:bg-blue-700 text-white"
                }`}
                  style={{ fontFamily: "Quicksand, sans-serif" }}
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






