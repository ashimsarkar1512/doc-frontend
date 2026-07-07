"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { Check, ShieldCheck, Save, X, Loader2, FileText, ShoppingCart, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/Redux/store/hooks";
import {
  useGetMyAssessmentSubmissionByIdQuery,
  useEditAssessmentSubmissionMutation,
  useGetMyCartQuery,
  useGetCartSummaryQuery,
  useCheckoutMutation,
} from "@/Redux/features/patient/assesmentcategory";
import { useUploadAttachmentMutation } from "@/Redux/api/authApi";
import FadeIn from "@/components/shared/animations/FadeIn";

const isFileInput = (inputType: string | null | undefined) => {
  if (!inputType) return false;
  const normalized = inputType.toLowerCase().replace(/\s+/g, "");
  return normalized === "fileupload" || normalized === "file";
};

export default function PreviewDetailsPage() {
  const router = useRouter();
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [checkoutPayload, setCheckoutPayload] = useState<any>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const id = localStorage.getItem("submissionId");
    if (id) setSubmissionId(id);
    else {
      toast.error("No assessment submission found.");
      router.push("/patient");
    }

    const payloadStr = localStorage.getItem("checkoutPayload");
    let hasDiscountInPayload = false;

    if (payloadStr) {
      try {
        const payload = JSON.parse(payloadStr);
        setCheckoutPayload(payload);
        if (payload.discountCode) {
          setDiscountCode(payload.discountCode);
          hasDiscountInPayload = true;
        }
      } catch (e) {
        console.error("Failed to parse checkout payload", e);
      }
    }

    if (!hasDiscountInPayload) {
      const savedCoupon = localStorage.getItem("appliedCoupon");
      if (savedCoupon) {
        setDiscountCode(savedCoupon);
      }
    }
  }, [router]);

  const { data, isLoading, refetch } = useGetMyAssessmentSubmissionByIdQuery(submissionId!, {
    skip: !submissionId,
  });

  const { data: cartData, isLoading: cartLoading } = useGetMyCartQuery();

  const queryParams: any = {};
  if (submissionId) queryParams.submissionId = submissionId;
  if (discountCode) queryParams.discountCode = discountCode;
  const hasParams = Object.keys(queryParams).length > 0;

  const { data: summaryData } = useGetCartSummaryQuery(
    hasParams ? queryParams : undefined,
    { skip: !submissionId }
  );

  const [editAssessmentSubmission, { isLoading: isSaving }] = useEditAssessmentSubmissionMutation();
  const [uploadAttachment] = useUploadAttachmentMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const cartItems = cartData?.data?.items ?? [];
  const itemCount = cartData?.data?.totalItem ?? 0;
  const summary = summaryData?.data;

  const formatServiceDuration = (sd?: string) => {
    if (!sd) return "—";
    return sd
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const submissionData = data?.data;

  // --- Edit Mode State ---
  const [isEditing, setIsEditing] = useState(false);
  const [draftAnswers, setDraftAnswers] = useState<Record<string, any>>({});
  const [draftFiles, setDraftFiles] = useState<Record<string, File | null>>({});
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // helper function to extract all nested questions for initial state
  const getAllQuestions = (questionsArray: any[]) => {
    let all: any[] = [];
    questionsArray.forEach((q) => {
      all.push(q);
      q.options?.forEach((opt: any) => {
        if (opt.subQuestions && opt.subQuestions.length > 0) {
          all = all.concat(getAllQuestions(opt.subQuestions));
        }
      });
    });
    return all;
  };

  useEffect(() => {
    if (isEditing && submissionData?.questions) {
      const initialDrafts: Record<string, any> = {};
      const allQ = getAllQuestions(submissionData.questions);
      allQ.forEach((q: any) => {
        if (q.type === "SINGLE_CHOICE") {
          initialDrafts[q.id] = q.patientAnswer?.selectedOptions?.[0]?.id || "";
        } else if (q.type === "MULTIPLE_CHOICE") {
          initialDrafts[q.id] = q.patientAnswer?.selectedOptions?.map((o: any) => o.id) || [];
        } else if (q.type === "INPUT") {
          initialDrafts[q.id] = q.patientAnswer?.textResponse || "";
        }
      });
      setDraftAnswers(initialDrafts);
      setDraftFiles({});
    }
  }, [isEditing, submissionData]);

  const handleSaveEdits = async () => {
    if (!submissionId || !submissionData?.questions) return;
    setUploadingFiles(true);

    try {
      const answersToSubmit: any[] = [];

      const collectAnswers = async (questionsArray: any[]) => {
        for (const q of questionsArray) {
          if (q.type === "INFORMATION_ONLY") continue;

          const answerPayload: any = { questionId: q.id };
          let selectedOptIds: string[] = [];

          if (q.type === "SINGLE_CHOICE") {
            if (draftAnswers[q.id]) {
              answerPayload.selectedOptionIds = [draftAnswers[q.id]];
              answersToSubmit.push(answerPayload);
              selectedOptIds = [draftAnswers[q.id]];
            }
          } else if (q.type === "MULTIPLE_CHOICE") {
            if (draftAnswers[q.id] && draftAnswers[q.id].length > 0) {
              answerPayload.selectedOptionIds = draftAnswers[q.id];
              answersToSubmit.push(answerPayload);
              selectedOptIds = draftAnswers[q.id];
            }
          } else if (q.type === "INPUT") {
            let textResponse = draftAnswers[q.id] || "";

            const fileOpt = q.options?.find((o: any) => isFileInput(o.inputType));
            if (fileOpt && draftFiles[q.id]) {
              const formData = new FormData();
              formData.append("files", draftFiles[q.id]!);
              formData.append("context", "ASSESSMENT_FILE");
              const res = await uploadAttachment(formData).unwrap();
              if (res.data?.id) {
                textResponse = res.data.id;
              }
            } else if (fileOpt && !draftFiles[q.id] && q.patientAnswer?.file?.id) {
              textResponse = q.patientAnswer.file.id;
            }

            if (textResponse) {
              answerPayload.textResponse = textResponse;
              answersToSubmit.push(answerPayload);
            }
          }

          // recurse only into selected options
          for (const opt of q.options || []) {
            if (selectedOptIds.includes(opt.id) && opt.subQuestions && opt.subQuestions.length > 0) {
              await collectAnswers(opt.subQuestions);
            }
          }
        }
      };

      await collectAnswers(submissionData.questions);

      await editAssessmentSubmission({ id: submissionId, answers: answersToSubmit }).unwrap();
      toast.success("Assessment updated successfully!");
      setIsEditing(false);
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to update assessment.");
      console.error(e);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleConfirmAndPay = async () => {
    try {
      if (!submissionId) {
        toast.error("Submission ID not found.");
        return;
      }

      if (!checkoutPayload) {
        toast.error("Payment information not found. Please complete the checkout steps.");
        router.push("/checkout");
        return;
      }

      // Merge the latest submissionId and discountCode into the checkout payload
      const finalPayload = {
        ...checkoutPayload,
        submissionId: submissionId,
        discountCode: discountCode || checkoutPayload.discountCode || undefined,
      };

      const res = await checkout(finalPayload).unwrap();

      if (res.success) {
        toast.success("Payment successful! Assessment submitted for review.");
        localStorage.removeItem("submissionId");
        localStorage.removeItem("checkoutPayload");
        localStorage.removeItem("appliedCoupon");
        router.push("/patient");
      }
    } catch (e: any) {
      toast.error(e?.data?.message || "Payment failed. Please try again.");
      console.error("Checkout error:", e);
    }
  };

  if (isLoading || !submissionData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-20 pt-32">
        <Navbar variant="dark" />
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  const { assessment, questions, complianceConfirmation, paymentSummary } = submissionData;

  // Reusable components matching exactly the original design
  const Card = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
    <FadeIn delay={delay}>
      <div className="border border-gray-200 rounded-xl p-5 mb-4 bg-white">
        {children}
      </div>
    </FadeIn>
  );

  const Question = ({ text }: { text: string }) => (
    <h3 className="text-[#2B2922] font-[Quicksand] text-[24px] font-bold leading-[1.5] mb-3">{text}</h3>
  );

  const CheckboxRow = ({ text }: { text: string }) => (
    <div className="flex items-start gap-3 mb-2 last:mb-0">
      <div className="w-5 h-5 rounded bg-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </div>
      <span className="text-[14px] text-gray-700 leading-relaxed font-medium pt-0.5">{text}</span>
    </div>
  );

  const RadioRow = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3 mb-2 last:mb-0">
      <div className="w-5 h-5 rounded-full border-[5px] border-[#2563EB] shrink-0 shadow-sm" />
      <span className="text-[14px] text-gray-700 leading-relaxed font-medium">{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-10">
      <Navbar variant="dark" />
      <div className="pt-32 max-w-[1520px] mx-auto px-4 sm:px-6">

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (window.history.length > 2) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="relative z-50 flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors text-[14px] font-medium mb-6 group w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[18px] font-bold text-gray-900">Preview details</h1>
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 text-[13px] font-medium"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSaveEdits}
                disabled={uploadingFiles || isSaving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium disabled:opacity-70"
              >
                {(uploadingFiles || isSaving) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col">

          {/* Card 1: Patient info & image */}
          <Card>
            <div className="flex items-center gap-4 w-full">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                {user?.profile?.avatar ? (
                  <Image src={user.profile.avatar} alt="Patient" fill sizes="48px" className="object-cover" />
                ) : (
                  <User className="w-6 h-6 text-blue-500" />
                )}
              </div>
              <div>
                <p className="text-[15px] font-bold text-gray-900 leading-tight">
                  Patient: {paymentSummary?.shippingInfo?.fullName || user?.profile?.name || user?.email?.split('@')[0] || 'Unknown Patient'}
                </p>
                <p className="text-[13px] text-gray-500 mt-0.5">Consultation id: <span className="font-medium text-gray-700">{submissionData.submissionCode}</span></p>
              </div>
            </div>

            {assessment.thumbnail && (
              <div className="relative w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 flex-1">
                <img
                  src={assessment.thumbnail}
                  alt={assessment.title || "Assessment Thumbnail"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}

            {assessment.description && (
              <p className="text-[13.5px] text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 w-full">
                {assessment.description}
              </p>
            )}
          </Card>

          {/* Dynamic Questions */}
          {questions.map((q: any) => {
            if (q.type === "INFORMATION_ONLY") return null;

            const renderQ = (question: any, depth = 0) => {
              if (question.type === "INFORMATION_ONLY") return null;
              const isIndented = depth > 0;
              const marginLeft = isIndented ? `${depth * 1.5}rem` : '0';

              return (
                <div key={question.id} style={{ marginLeft }} className={isIndented ? "mt-5 pl-5 border-l-2 border-blue-100" : ""}>
                  <Question text={question.questionText || question.heading || ""} />

                  {/* Read Mode */}
                  {!isEditing && (
                    <div className="mt-2">
                      {question.type === "SINGLE_CHOICE" ? (
                        question.options?.filter((opt: any) => question.patientAnswer?.selectedOptions?.some((so: any) => so.id === opt.id)).map((opt: any) => (
                          <div key={opt.id}>
                            <RadioRow text={opt.label || opt.optionLabel} />
                            {opt.subQuestions && opt.subQuestions.length > 0 && (
                              <div className="mt-3">
                                {opt.subQuestions.map((subQ: any) => renderQ(subQ, depth + 1))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : question.type === "MULTIPLE_CHOICE" ? (
                        question.options?.filter((opt: any) => question.patientAnswer?.selectedOptions?.some((so: any) => so.id === opt.id)).map((opt: any) => (
                          <div key={opt.id}>
                            <CheckboxRow text={opt.label || opt.optionLabel} />
                            {opt.subQuestions && opt.subQuestions.length > 0 && (
                              <div className="mt-3">
                                {opt.subQuestions.map((subQ: any) => renderQ(subQ, depth + 1))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : question.type === "INPUT" ? (
                        <div className="mb-2">
                          {question.patientAnswer?.file ? (
                            question.patientAnswer.file.fileType?.startsWith('image/') ? (
                              <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden border border-gray-200 mt-2 shadow-sm">
                                <Image src={question.patientAnswer.file.fileUrl} alt="Uploaded file" fill className="object-cover" unoptimized />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 w-fit">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <a href={question.patientAnswer.file.fileUrl} target="_blank" rel="noreferrer" className="text-[13px] text-[#2563EB] hover:underline font-medium">
                                  {question.patientAnswer.file.fileName}
                                </a>
                              </div>
                            )
                          ) : question.options && question.options.length > 0 ? (
                            <div className="w-full">
                              {(() => {
                                const textResp = question.patientAnswer?.textResponse || "";
                                const parts = textResp.split(", ");
                                let weightLbs = 0;
                                let heightFeet = 0;

                                const renderedOptions = question.options.map((opt: any, idx: number) => {
                                  if (isFileInput(opt.inputType)) return null;
                                  const val = parts[idx] || "—";
                                  const labelLower = (opt.label || "").toLowerCase();

                                  let suffix = "";
                                  if (labelLower.includes("age")) suffix = "years";
                                  else if (labelLower.includes("height")) {
                                    suffix = "feet";
                                    heightFeet = parseFloat(val) || 0;
                                  }
                                  else if (labelLower.includes("weight")) {
                                    suffix = "lbs";
                                    weightLbs = parseFloat(val) || 0;
                                  }

                                  return (
                                    <div key={opt.id} className="flex items-center mb-3 last:mb-0 ml-4">
                                      <span className="text-[#6B7280] text-[15px] font-[Quicksand] w-[80px] font-medium">{opt.label}:</span>
                                      <span className="text-[#2B2922] text-[15px] font-[Quicksand] font-medium">{val} {suffix}</span>
                                    </div>
                                  );
                                });

                                let bmiDisplay = null;
                                if (weightLbs > 0 && heightFeet > 0) {
                                  const heightInches = heightFeet * 12;
                                  const bmi = (703 * weightLbs) / (heightInches * heightInches);
                                  let bmiCategory = "";
                                  if (bmi < 18.5) bmiCategory = "Underweight";
                                  else if (bmi < 25) bmiCategory = "Normal weight";
                                  else if (bmi < 30) bmiCategory = "Overweight";
                                  else bmiCategory = "Obese";

                                  bmiDisplay = (
                                    <div className="mt-4 bg-[#EBE0D8] rounded-xl px-5 py-4 w-full">
                                      <p className="text-[#2B2922] font-[Quicksand] font-bold text-[15px] mb-1">Health Snapshot:</p>
                                      <p className="text-[#F43F5E] font-[Quicksand] font-medium text-[15px]">BMI: {bmi.toFixed(1)} ({bmiCategory})</p>
                                    </div>
                                  );
                                }

                                return (
                                  <>
                                    <div className="flex flex-col mt-4">
                                      {renderedOptions}
                                    </div>
                                    {bmiDisplay}
                                  </>
                                );
                              })()}
                            </div>
                          ) : (
                            (() => {
                              const textResp = question.patientAnswer?.textResponse || "";
                              const qText = (question.questionText || question.heading || "").toLowerCase();
                              if (qText.includes("age") && qText.includes("weight") && qText.includes("height") && textResp.includes(",")) {
                                const parts = textResp.split(", ");
                                const age = parts[0] || "—";
                                const heightStr = parts[1] || "—";
                                const weightStr = parts[2] || "—";

                                const heightFeet = parseFloat(heightStr) || 0;
                                const weightLbs = parseFloat(weightStr) || 0;

                                let bmiDisplay = null;
                                if (weightLbs > 0 && heightFeet > 0) {
                                  const heightInches = heightFeet * 12;
                                  const bmi = (703 * weightLbs) / (heightInches * heightInches);
                                  let bmiCategory = "";
                                  if (bmi < 18.5) bmiCategory = "Underweight";
                                  else if (bmi < 25) bmiCategory = "Normal weight";
                                  else if (bmi < 30) bmiCategory = "Overweight";
                                  else bmiCategory = "Obese";

                                  bmiDisplay = (
                                    <div className="mt-4 bg-[#EBE0D8] rounded-xl px-5 py-4 w-full">
                                      <p className="text-[#2B2922] font-[Quicksand] font-bold text-[15px] mb-1">Health Snapshot:</p>
                                      <p className="text-[#F43F5E] font-[Quicksand] font-medium text-[15px]">BMI: {bmi.toFixed(1)} ({bmiCategory})</p>
                                    </div>
                                  );
                                }

                                return (
                                  <div className="w-full">
                                    <div className="flex flex-col mt-4">
                                      <div className="flex items-center mb-3 ml-4">
                                        <span className="text-[#6B7280] text-[15px] font-[Quicksand] w-[80px] font-medium">Age:</span>
                                        <span className="text-[#2B2922] text-[15px] font-[Quicksand] font-medium">{age} years</span>
                                      </div>
                                      <div className="flex items-center mb-3 ml-4">
                                        <span className="text-[#6B7280] text-[15px] font-[Quicksand] w-[80px] font-medium">Height:</span>
                                        <span className="text-[#2B2922] text-[15px] font-[Quicksand] font-medium">{heightStr} feet</span>
                                      </div>
                                      <div className="flex items-center mb-3 ml-4">
                                        <span className="text-[#6B7280] text-[15px] font-[Quicksand] w-[80px] font-medium">Weight:</span>
                                        <span className="text-[#2B2922] text-[15px] font-[Quicksand] font-medium">{weightStr} lbs</span>
                                      </div>
                                    </div>
                                    {bmiDisplay}
                                  </div>
                                );
                              }

                              return (
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 w-full max-w-[500px]">
                                  <p className="text-[14px] text-gray-700 whitespace-pre-wrap">{textResp || "No response provided"}</p>
                                </div>
                              );
                            })()
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Edit Mode */}
                  {isEditing && (
                    <div className="mt-3">
                      {question.type === "SINGLE_CHOICE" && (
                        <div className="flex flex-col gap-3">
                          {question.options?.map((opt: any) => {
                            const isSelected = draftAnswers[question.id] === opt.id;
                            return (
                              <div key={opt.id} className="flex flex-col">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                  <input
                                    type="radio"
                                    name={`q-${question.id}`}
                                    checked={isSelected}
                                    onChange={() => setDraftAnswers({ ...draftAnswers, [question.id]: opt.id })}
                                    className="w-5 h-5 text-[#2563EB] focus:ring-[#2563EB] border-gray-300"
                                  />
                                  <span className="text-[14px] text-gray-700 group-hover:text-gray-900">{opt.label}</span>
                                </label>
                                {isSelected && opt.subQuestions && opt.subQuestions.length > 0 && (
                                  <div className="mt-3 mb-1">
                                    {opt.subQuestions.map((subQ: any) => renderQ(subQ, depth + 1))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {question.type === "MULTIPLE_CHOICE" && (
                        <div className="flex flex-col gap-3">
                          {question.options?.map((opt: any) => {
                            const isChecked = draftAnswers[question.id]?.includes(opt.id);
                            return (
                              <div key={opt.id} className="flex flex-col">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const current = draftAnswers[question.id] || [];
                                      setDraftAnswers({
                                        ...draftAnswers,
                                        [question.id]: e.target.checked ? [...current, opt.id] : current.filter((id: string) => id !== opt.id)
                                      });
                                    }}
                                    className="w-5 h-5 rounded text-[#2563EB] focus:ring-[#2563EB] border-gray-300"
                                  />
                                  <span className="text-[14px] text-gray-700 group-hover:text-gray-900">{opt.label}</span>
                                </label>
                                {isChecked && opt.subQuestions && opt.subQuestions.length > 0 && (
                                  <div className="mt-3 mb-1">
                                    {opt.subQuestions.map((subQ: any) => renderQ(subQ, depth + 1))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {question.type === "INPUT" && (
                        <div>
                          {question.options?.some((o: any) => isFileInput(o.inputType)) ? (
                            <div className="flex flex-col gap-3 mt-1">
                              {(draftFiles[question.id] || (question.patientAnswer?.file && question.patientAnswer.file.fileType?.startsWith('image/'))) && (
                                <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                  <Image
                                    src={draftFiles[question.id] ? URL.createObjectURL(draftFiles[question.id]!) : question.patientAnswer.file.fileUrl}
                                    alt="Uploaded preview"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              )}
                              {question.patientAnswer?.file && !draftFiles[question.id] && !question.patientAnswer.file.fileType?.startsWith('image/') && (
                                <p className="text-[12px] text-gray-500 bg-gray-50 p-2 rounded w-fit border border-gray-100">Current file: <span className="font-medium text-gray-700">{question.patientAnswer.file.fileName}</span></p>
                              )}
                              <div className="flex items-center gap-3">
                                <label className="cursor-pointer group">
                                  <div className="flex items-center gap-2 bg-blue-50 text-[#2563EB] hover:bg-blue-100 transition-colors px-4 py-2 rounded-lg border border-blue-100">
                                    <FileText className="w-4 h-4" />
                                    <span className="text-[13px] font-semibold">{draftFiles[question.id] ? 'Change File' : 'Upload File'}</span>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*,.pdf,.doc,.docx"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        setDraftFiles({ ...draftFiles, [question.id]: e.target.files[0] });
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                                {draftFiles[question.id] && (
                                  <button
                                    onClick={() => {
                                      const newDrafts = { ...draftFiles };
                                      delete newDrafts[question.id];
                                      setDraftFiles(newDrafts);
                                    }}
                                    className="text-[13px] text-red-500 hover:text-red-700 font-semibold px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : question.options && question.options.length > 0 ? (
                            <div className="flex flex-col gap-4 mt-2">
                              {question.options.map((opt: any, idx: number) => {
                                const currentAnswers = (draftAnswers[question.id] || "").split(", ");
                                return (
                                  <div key={opt.id} className="flex flex-col">
                                    {opt.label?.trim() && (
                                      <label className="text-[#2B2922] font-[Quicksand] text-[20px] font-medium leading-[110%] mb-2">
                                        {opt.label}
                                      </label>
                                    )}
                                    <input
                                      type={opt.inputType === "NUMBER" ? "number" : "text"}
                                      value={currentAnswers[idx] || ""}
                                      onChange={(e) => {
                                        const newAnswers = [...currentAnswers];
                                        while (newAnswers.length < question.options.length) newAnswers.push("");
                                        newAnswers[idx] = e.target.value;
                                        setDraftAnswers({ ...draftAnswers, [question.id]: newAnswers.join(", ") });
                                      }}
                                      placeholder={opt.placeholder || (opt.inputType === "NUMBER" ? "Enter a number..." : "Write here...")}
                                      className="w-full px-4 py-3.5 rounded-xl border-none bg-[#E5E7EB] text-gray-800 placeholder-gray-400 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            (() => {
                              const qText = (question.questionText || question.heading || "").toLowerCase();
                              if (qText.includes("age") && qText.includes("weight") && qText.includes("height")) {
                                const currentAnswers = (draftAnswers[question.id] || "").split(", ");
                                const labels = ["Age", "Height", "Weight"];
                                const placeholders = ["Age (years)", "Height (feet)", "Weight (lbs)"];
                                return (
                                  <div className="flex flex-col gap-4 mt-2">
                                    {labels.map((label, idx) => (
                                      <div key={idx} className="flex flex-col">
                                        <label className="text-[#2B2922] font-[Quicksand] text-[20px] font-medium leading-[110%] mb-2">
                                          {label}
                                        </label>
                                        <input
                                          type={label === "Height" ? "text" : "number"}
                                          value={currentAnswers[idx] || ""}
                                          onChange={(e) => {
                                            const newAnswers = [...currentAnswers];
                                            while (newAnswers.length < 3) newAnswers.push("");
                                            newAnswers[idx] = e.target.value;
                                            setDraftAnswers({ ...draftAnswers, [question.id]: newAnswers.join(", ") });
                                          }}
                                          placeholder={placeholders[idx]}
                                          className="w-full px-4 py-3.5 rounded-xl border-none bg-[#E5E7EB] text-gray-800 placeholder-gray-400 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                );
                              }
                              return (
                                <textarea
                                  value={draftAnswers[question.id] || ""}
                                  onChange={(e) => setDraftAnswers({ ...draftAnswers, [question.id]: e.target.value })}
                                  placeholder="Type your response here..."
                                  className="w-full rounded-xl p-3.5 text-[15px] text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-[#E5E7EB] border-none mt-2"
                                  rows={3}
                                />
                              );
                            })()
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            };

            return (
              <Card key={q.id} delay={0.1}>
                {renderQ(q)}
              </Card>
            );
          })}

          {/* Compliance Confirmation - Exact copy from checkout page */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-[28px] h-[28px] text-blue-600" />
              <h2 className="text-[#2B2922] font-[Quicksand] text-[24px] font-bold leading-none">Compliance Confirmation:</h2>
            </div>
            <p className="text-[#3B3B3B] font-[Quicksand] text-[16px] font-normal leading-[1.5] mb-6 max-w-[95%]">
              Before completing your submission, please confirm you understand the following important information about our telemedicine service:
            </p>

            <div className="flex flex-col gap-[12px] mb-4">
              {[
                { text: "I have reviewed and agree to the <span class=\"font-bold underline\">Terms of Service and Privacy Policy.</span>" },
                { text: "I certify that all information provided is accurate and complete." },
                { text: "I understand that providing false or misleading information may result in denial of treatment." },
                { text: "I understand that treatment recommendations are based on the information I have provided." },
                { text: "I understand that additional information may be requested before treatment is approved." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-[12px] border border-[#D1D5DC] rounded-[12px] p-4 transition-colors">
                  <div className="w-5 h-5 mt-0.5 shrink-0 bg-[#2563EB] rounded flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />
                  </div>
                  <span className="text-[#3B3B3B] font-[Quicksand] text-[16px] font-normal leading-tight" dangerouslySetInnerHTML={{ __html: item.text }} />
                </div>
              ))}
            </div>

            <div className="bg-[#EBF1FB] text-[#3B82F6] text-[14px] rounded-lg p-4 font-medium">
              All checkboxes are required. This disclosure is maintained for HIPAA and telemedicine compliance purposes.
            </div>
          </Card>

          {/* Payment Summary - matches reference design */}
          <FadeIn delay={0.2}>
          <div className="border border-gray-200 rounded-xl bg-white shadow-sm w-full flex flex-col" style={{ padding: '30px' }}>
            {/* Title */}
            <h3 className="text-[#191B1C] font-[Quicksand] text-[26px] font-bold leading-[1.2] m-0" style={{ marginBottom: '17px' }}>Payment Summary</h3>
            {/* Subtitle */}
            <p className="text-[14px] text-gray-500 m-0" style={{ marginBottom: '17px' }}>
              Patient selected {cartItems.length} product{cartItems.length !== 1 ? 's' : ''}:
            </p>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-10 w-full">
              {/* LEFT: Products */}
              <div className="flex flex-col gap-4 w-full lg:max-w-[450px]">
                {cartItems.map((item: any) => {
                  const img = item.product?.images?.[0]?.fileUrl ?? "";
                  const desc = item.product?.description;
                  const name = item.product?.name || "Unknown Product";
                  const showDesc = desc && desc !== name;
                  return (
                    <div key={item.id} className="flex gap-4">
                      {/* Thumbnail — checkout: w-[70px] h-[70px] rounded-2xl bg-[#292C2D] */}
                      <div
                        className="relative w-[70px] h-[70px] flex-shrink-0 rounded-2xl overflow-hidden shadow-sm"
                        style={{ backgroundColor: "#292C2D" }}
                      >
                        {img && (
                          <Image
                            src={img}
                            alt={name}
                            fill
                            unoptimized
                            className="object-contain p-1.5"
                            sizes="70px"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        {/* Name left, Price right — checkout styles */}
                        <div className="flex justify-between items-start">
                          <div>
                            {/* checkout: text-gray-900 text-[14px] font-bold leading-snug */}
                            <p className="text-gray-900 text-[14px] font-bold leading-snug">{name}</p>
                            {/* Description — checkout: Quicksand 16px normal, only if different from name */}
                            {showDesc && (
                              <p className="text-[#272628] font-[Quicksand] text-[14px] font-normal leading-snug mt-0.5 line-clamp-1 max-w-[200px]">
                                {desc.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().substring(0, 35)}...
                              </p>
                            )}
                          </div>
                          {/* Price — checkout: text-[#2563EB] text-[14px] font-bold */}
                          <p className="text-[#2563EB] text-[14px] font-bold flex-shrink-0 ml-3">${parseFloat(item.itemTotal).toFixed(2)}</p>
                        </div>

                        {/* Size badge — checkout: text-[12px] text-gray-600 + bg-[#DEE7FB] */}
                        {item.size && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[12px] text-gray-600 font-medium">Size:</span>
                            <span className="bg-[#DEE7FB] text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{item.size}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RIGHT: Totals — checkout: Quicksand 20px normal/bold */}
              <div className="w-full lg:w-[320px] shrink-0">
                <div className="flex flex-col gap-3">
                  {[
                    {
                      label: "Subtotal",
                      value: summary?.subtotal ? `$${parseFloat(summary.subtotal).toFixed(2)}` : "—",
                    },
                    {
                      label: "Service Duration",
                      value: formatServiceDuration(summary?.serviceDuration),
                    },
                    {
                      label: "Service Fees",
                      value: summary?.serviceFees ? `$${parseFloat(summary.serviceFees).toFixed(2)}` : "—",
                    },
                    {
                      label: "Shipping Charge",
                      value: summary?.shippingCharge ? `$${parseFloat(summary.shippingCharge).toFixed(2)}` : "—",
                    },
                    {
                      label: "Discount",
                      value: summary?.discount && parseFloat(summary.discount) > 0
                        ? `- $${parseFloat(summary.discount).toFixed(2)}`
                        : "$0.00",
                      accent: true,
                    },
                  ].map(({ label, value, accent }) => (
                    <div key={label} className="flex justify-between">
                      {/* checkout: text-[#272628] font-[Quicksand] text-[20px] font-normal */}
                      <span className="text-[#272628] font-[Quicksand] text-[20px] font-normal leading-none">{label}</span>
                      <span className={`font-[Quicksand] text-[20px] font-normal leading-none ${accent ? "text-red-500" : "text-[#272628]"}`}>{value}</span>
                    </div>
                  ))}

                  {/* Divider + Total — checkout: Quicksand 20px bold */}
                  <div className="flex justify-between items-center pt-3 border-t border-[#1D4ED8] mt-1">
                    <span className="text-[#272628] font-[Quicksand] text-[20px] font-bold leading-none">Total</span>
                    <span className="text-[#1D4ED8] font-[Quicksand] text-[20px] font-bold leading-none">
                      {summary?.total ? `$${parseFloat(summary.total).toFixed(2)}` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </FadeIn>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            {submissionData.status === 'DRAFT' && (
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={handleConfirmAndPay}
                  disabled={isCheckingOut || isSaving}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-70 text-white font-[Quicksand] text-[16px] font-semibold h-[40px] min-w-[231px] rounded-lg transition-colors"
                >
                  {(isCheckingOut || isSaving) ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Submit for medical review
                </button>
                <Link href="/checkout" className="flex-1 sm:flex-none flex items-center justify-center text-[#E55B46] border border-[#E55B46] hover:bg-red-50 font-[Quicksand] text-[16px] font-semibold h-[40px] px-8 rounded-lg transition-colors">
                  Cancel
                </Link>
              </div>
            )}

            {(submissionData.status === 'DRAFT' || submissionData.status === 'REFIL_REQUESTED' || submissionData.status === 'REFIL_REQUEST') && !isEditing && (
              <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto flex items-center justify-center text-[#3B3B3B] border border-[#6B7280] hover:bg-gray-50 font-[Quicksand] text-[14px] font-medium h-[40px] px-6 rounded-lg transition-colors">
                {submissionData.status === 'DRAFT' ? 'Edit before submitting' : 'Update Assessment'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
