/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft, PaintBucket, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import RequestRefillModal from "./RequestRefillModal";
import AssessmentDeclineModal from "./AssessmentDeclineModal";
import { useSearchParams } from "next/navigation";
import { useGetConsultationByIdQuery } from "@/Redux/features/doctorDashboard/doctorDashboardApi";
import ApproveConsultationModal from "./ApproveConsultationModal";
import { BeatLoader } from "react-spinners";

// ====================================================================
// Question Renderer Components
// These are PURELY for display. They don't have their own state.
// They show what the patient answered, not for interaction.
// ====================================================================

function QuestionCheckbox({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 text-sm transition-colors rounded-lg p-2 -ml-2 ${checked ? "bg-blue-50 text-gray-900" : "opacity-60 text-gray-700"}`}
    >
      <span
        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border ${
          checked ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
        }`}
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={3}
            className="w-3 h-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
      <span className={checked ? "text-gray-900 font-medium" : "text-gray-400"}>
        {label}
      </span>
    </div>
  );
}

function QuestionRadio({
  label,
  checked,
}: {
  label: string;
  name?: string;
  checked: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 text-sm transition-colors rounded-lg p-2 -ml-2 ${checked ? "bg-blue-50 text-gray-900" : "opacity-60 text-gray-700"}`}
    >
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border bg-white ${
          checked ? "border-blue-600" : "border-gray-300"
        }`}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-blue-600" />}
      </span>
      <span className={checked ? "text-gray-900 font-medium" : "text-gray-400"}>
        {label}
      </span>
    </div>
  );
}

/**
 * A recursive component to render a question and its answer.
 * It handles different question types and nested sub-questions.
 */
function QuestionRenderer({ question }: { question: any }) {
  const { type, heading, questionText, description, options, patientAnswer } =
    question;

  const renderAnswer = () => {
    // Show "No answer" only if it's not an info-only block and has no answer
    if (!patientAnswer && type !== "INFORMATION_ONLY") {
      return (
        <p className="text-sm text-gray-500 italic">No answer provided.</p>
      );
    }

    switch (type) {
      case "INFORMATION_ONLY":
        return (
          <div
            className="text-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        );

      case "SINGLE_CHOICE":
        const selectedOptionId = patientAnswer?.selectedOptions?.[0]?.id;
        return (
          <div className="space-y-3">
            {options.map((option: any) => (
              <div key={option.id}>
                <QuestionRadio
                  label={option.label}
                  name={question.id}
                  checked={option.id === selectedOptionId}
                />
                {/* If this option was selected and it has sub-questions, render them recursively */}
                {option.id === selectedOptionId &&
                  option.subQuestions?.length > 0 && (
                    <div className="mt-4 pl-8 space-y-4 border-l border-gray-200">
                      {option.subQuestions.map((subQuestion: any) => (
                        <QuestionRenderer
                          key={subQuestion.id}
                          question={subQuestion}
                        />
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        );

      case "MULTIPLE_CHOICE":
        const selectedOptionIds =
          patientAnswer?.selectedOptions?.map((o: any) => o.id) || [];
        return (
          <div className="space-y-3">
            {options.map((option: any) => (
              <div key={option.id}>
                <QuestionCheckbox
                  label={option.label}
                  checked={selectedOptionIds.includes(option.id)}
                />
                {/* If this option was selected and it has sub-questions, render them recursively */}
                {selectedOptionIds.includes(option.id) &&
                  option.subQuestions?.length > 0 && (
                    <div className="mt-4 pl-8 space-y-4 border-l border-gray-200">
                      {option.subQuestions.map((subQuestion: any) => (
                        <QuestionRenderer
                          key={subQuestion.id}
                          question={subQuestion}
                        />
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        );

      case "INPUT":
        const inputOption = options?.[0];
        if (inputOption?.inputType === "file upload") {
          if (patientAnswer?.file) {
            return (
              <div>
                <Link
                  href={patientAnswer.file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  {patientAnswer.file.fileName}
                </Link>
                {/* If the file is an image, show a preview */}
                {patientAnswer.file.fileType.startsWith("image/") && (
                  <Image
                    src={patientAnswer.file.fileUrl}
                    alt={patientAnswer.file.fileName}
                    width={200}
                    height={200}
                    className="mt-2 rounded-md border border-gray-200"
                  />
                )}
              </div>
            );
          } else {
            return (
              <p className="text-sm text-gray-500 italic">No file uploaded.</p>
            );
          }
        }
        // For other input types like 'text', 'number', etc.
        return (
          <p className="text-sm text-gray-900 font-medium">
            {patientAnswer?.textResponse || "—"}
          </p>
        );

      default:
        return (
          <p className="text-sm text-red-500">
            Error: Unknown question type `{type}`.
          </p>
        );
    }
  };

  return (
    <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors bg-white">
      {heading && (
        <h3 className="text-base font-bold text-gray-900 mb-2">{heading}</h3>
      )}
      {questionText && (
        <h4 className="font-semibold text-gray-800 text-sm mb-3">
          {questionText}
        </h4>
      )}
      {description && type !== "INFORMATION_ONLY" && (
        <p className="text-xs text-gray-500 mb-4">{description}</p>
      )}
      {renderAnswer()}
    </div>
  );
}

import { toast } from "sonner";
import { useCreateConversationMutation } from "@/Redux/api/messageApi";
import { useAppSelector } from "@/Redux/store/hooks";
import notFoundImag from "@/public/Image-not-found-m.png"
import { useRouter } from "next/navigation";

// for the bottom part  complinceConfiramation
function ComplianceCheckItem({
  label,
  checked,
}: {
  label: React.ReactNode;
  checked: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-sm border border-gray-200 rounded-full px-4 py-3 bg-white">
      <span
        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
          checked ? "bg-gray-200 border-gray-300" : "bg-white border-gray-300"
        }`}
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth={3}
            className="w-3 h-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
      <span className="text-gray-700">{label}</span>
    </div>
  );
}

function ComplianceConfirmationSection({
  complianceConfirmation,
}: {
  complianceConfirmation: any;
}) {
  if (!complianceConfirmation) return null;

  const items = [
    {
      key: "agreedToTermsAndPrivacy",
      label: (
        <>
          I have reviewed and agree to the{" "}
          <Link href="/privicyPage" className="font-semibold underline">
            Terms of Service and Privacy Policy.
          </Link>
        </>
      ),
    },
    {
      key: "certifiedInfoAccurate",
      label:
        "I certify that all information provided is accurate and complete.",
    },
    {
      key: "understoodFalseInfoConsequences",
      label:
        "I understand that providing false or misleading information may result in denial of treatment.",
    },
    {
      key: "understoodRecommendationsBasis",
      label:
        "I understand that treatment recommendations are based on the information I have provided.",
    },
    {
      key: "understoodAdditionalInfoMayBeRequested",
      label:
        "I understand that additional information may be requested before treatment is approved.",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 mb-8">
      <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-4">
        <ShieldCheck className="w-5 h-5 text-blue-600" />
        Compliance Confirmation:
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <ComplianceCheckItem
            key={item.key}
            label={item.label}
            checked={Boolean(complianceConfirmation[item.key])}
          />
        ))}
      </div>
    </div>
  );
}

// ====================================================================
// Main Consultation Details Component
// ====================================================================

export default function ConsultationDetails() {
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);


  const searchParams = useSearchParams();
  const id = searchParams.get("consultationId");

  const { data, isLoading, isError } = useGetConsultationByIdQuery(id);
  const detailesData = data?.data;
  console.log(detailesData);
  const user = useAppSelector((state) => state.auth.user);
  console.log(user);
  if (isLoading) return <p>Loading...</p>;
  if (isError || !detailesData)
    return (
      <div className="p-8 text-center text-gray-500">
        Consultation details not found.
      </div>
    );

  // Pull out the pieces we render below. Optional chaining so nothing crashes
  // if a field is missing while the API/shape is still settling.
  const assessment = detailesData?.assessment; // { id, title, thumbnail, category, ... }
  const questions = detailesData?.questions || []; // dynamic length, can be 1 question or 50
  const paymentSummary = detailesData?.paymentSummary; // { products, subtotal, ... }
  const complianceConfirmation = detailesData?.complianceConfirmation;

  // Backend doesn't send a dedicated `patientName` field yet.
  // We fall back to whichever question's text contains "name" (matches your
  // "Your name?" question) and use its typed answer as the patient's name.
  const nameQuestion = questions.find((q: any) =>
    q.questionText?.toLowerCase().includes("name"),
  );
  const patientName = nameQuestion?.patientAnswer?.textResponse || "Patient";
  const patientImage =detailesData?.patientImage
  console.log(patientImage)

  return (
    <div className="mb-12">
      {/* Back Link — text now comes from assessment.title instead of being hardcoded */}
      <Link
        href="/doctor"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 mb-6 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {assessment?.title || "Back to Dashboard"}
      </Link>

      {/* Header Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100">
              {/* Using a placeholder as patient image is not in the data */}
              <Image
                src={patientImage ||notFoundImag}
                alt="Patient"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Patient: {patientName}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-0.5">
                <span>
                  Consultation ID: #{detailesData?.submissionCode || "N/A"}
                </span>
                {/* Add submitted date if available in API */}
              </div>
            </div>
          </div>
          {assessment?.category && (
            <div className="bg-[#eff6ff] text-[#2563eb] text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
              {assessment.category}
            </div>
          )}
        </div>

        {assessment?.thumbnail && (
          <div className="relative w-full h-[240px] md:h-[320px] rounded-xl overflow-hidden mb-5">
            <Image
              src={assessment.thumbnail}
              alt={assessment.title || "Assessment"}
              fill
              className="object-cover"
            />
          </div>
        )}

        {assessment?.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {assessment.description}
          </p>
        )}
      </div>

      {/* Questions Section */}
      <div className="space-y-4 mb-10">
        {(questions || []).map((question: any) => (
          <QuestionRenderer key={question.id} question={question} />
        ))}
      </div>

      {/* here is the complaine conframation start */}
      <ComplianceConfirmationSection
        complianceConfirmation={complianceConfirmation}
      />
      {/* here is the complaine confram */}

      {/* Summary Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Product & Payment Summary
        </h3>
        {paymentSummary?.products?.length > 0 && (
          <p className="text-sm text-gray-500 mb-6">
            Patient selected {paymentSummary.products.length} product(s):
          </p>
        )}

        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1 flex flex-col gap-4">
            {paymentSummary?.products?.map((product: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100"
              >
                <div className="w-12 h-12 bg-[#1e293b] rounded-lg relative overflow-hidden flex-shrink-0">
                  {product?.image && (
                    <Image
                      src={product.image || notFoundImag}
                        // src={product.image || notFoundImag.src}
                      alt={product.name}
                      fill
                      className="object-cover opacity-70"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-semibold text-sm text-gray-900">
                      {product.name}
                    </h4>
                    <span className="font-semibold text-sm text-blue-600">
                      ${product.price?.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {product.size || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {paymentSummary && (
            <div className="w-full md:w-64 space-y-2.5 text-sm pt-2 md:pt-0">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>${paymentSummary.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Service Duration</span>
                <span>{paymentSummary.serviceDuration || "N/A"}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Service Fees</span>
                <span>${paymentSummary.serviceFees?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping charge</span>
                <span>${paymentSummary.shippingCharge?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Discount</span>
                <span className="text-green-600">
                  -${paymentSummary.discount?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-200 mt-3">
                <span>Total</span>
                <span className="text-blue-600">
                  ${paymentSummary.total?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 font-medium">
                  Payment Status:
                </span>
                <span className="bg-[#eff6ff] text-[#2563eb] text-xs font-semibold px-2.5 py-1 rounded-md">
                  Paid
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons — direct status checks */}
      {(detailesData?.status === "PENDING" ||
        detailesData?.status === "REVIEWED" ||
        detailesData?.status === "ACCEPTED" ||
        detailesData?.status === "REFIL_REQUESTED" ||
        detailesData?.status === "REJECTED") && (
        <div className="flex flex-wrap gap-4 mt-8">
          {detailesData?.status !== "REFIL_REQUESTED" &&
            detailesData?.status !== "REJECTED" && (
              <button
                disabled={detailesData?.status === "ACCEPTED"}
                onClick={() => setIsApproveModalOpen(true)}
                className={`bg-[#2563eb] hover:bg-blue-700 transition-colors text-white text-sm font-semibold py-2.5 px-6 rounded-full shadow-sm ${
                  detailesData?.status === "ACCEPTED"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Approve & Provide Consultation
              </button>
            )}

          {detailesData?.status !== "ACCEPTED" &&
            detailesData?.status !== "REJECTED" && (
              <button
                disabled={detailesData?.status === "REFIL_REQUESTED"}
                onClick={() => setIsRefillModalOpen(true)}
                className={`bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm font-semibold py-2.5 px-6 rounded-full shadow-sm ${
                  detailesData?.status === "REFIL_REQUESTED"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Request Refill Information
              </button>
            )}

          {detailesData?.status !== "ACCEPTED" &&
            detailesData?.status !== "REFIL_REQUESTED" && (
              <button
                disabled={detailesData?.status === "REJECTED"}
                onClick={() => setIsDeclineModalOpen(true)}
                className={`bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors text-sm font-semibold py-2.5 px-8 rounded-full shadow-sm ${
                  detailesData?.status === "REJECTED"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Decline
              </button>
            )}
        </div>
      )}

      {/* Modals */}
      <ApproveConsultationModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        patientName={patientName}
        consultationId={id ?? ""}
        submittedDate={detailesData?.submittedAt}
      />
      <RequestRefillModal
        isOpen={isRefillModalOpen}
        onClose={() => setIsRefillModalOpen(false)}
        patientName={patientName}
        consultationId={id ?? ""}
        submittedDate={detailesData?.submittedAt}
      />
      <AssessmentDeclineModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        patientName={patientName}
        consultationId={id ?? ""}
        submittedDate={detailesData?.submittedAt}
      />
    </div>
  );
}
