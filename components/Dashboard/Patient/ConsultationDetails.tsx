"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, Box, CheckCircle2, Download } from "lucide-react";
import { Consultation } from "@/types/patientTypes";
import { useGetMyAssessmentByIdQuery } from "@/Redux/features/patient/assessmentSubmission/assessmentSubmissionApi";
import { useAppSelector } from "@/Redux/store/hooks";

interface ConsultationDetailsProps {
  consultation: Consultation;
  onBack: () => void;
}

export default function ConsultationDetails({
  consultation,
  onBack,
}: ConsultationDetailsProps) {
  const user = useAppSelector((state) => state.auth.user);
  
  const { data: response, isLoading, isError } = useGetMyAssessmentByIdQuery(consultation.id);
  const data = response?.data;

  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPatientInitials = () => {
    if (user?.profile?.name) {
      return user.profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return "PA";
  };

  const getPatientName = () => {
    return user?.profile?.name || user?.email?.split("@")[0] || "Patient";
  };

  // Survey checklist item styling
  const renderCheckedItem = (text: string) => (
    <div className="flex items-center gap-3 py-1">
      <div className="w-5 h-5 rounded-md bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/10">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-[14px] font-medium text-gray-700">{text}</span>
    </div>
  );

  // Survey radio item styling
  const renderRadioItem = (text: string) => (
    <div className="flex items-center gap-3 py-1">
      <div className="w-5 h-5 rounded-full border-2 border-[#2563eb] flex items-center justify-center flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></div>
      </div>
      <span className="text-[14px] font-medium text-gray-700">{text}</span>
    </div>
  );

  // Text response styling
  const renderTextItem = (text: string) => (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mt-1">
      <p className="text-[14px] text-gray-700 font-medium">{text}</p>
    </div>
  );

  // File response styling
  const renderFileItem = (file: any) => {
    if (!file) return null;
    return (
      <div className="mt-2 flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-2 w-fit pr-4">
        <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
          {file.fileType?.includes('image') ? (
            <Image src={file.fileUrl} alt={file.fileName} fill className="object-cover" unoptimized />
          ) : (
            <Download className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-gray-900 truncate max-w-[200px]">{file.fileName}</span>
          <a href={file.fileUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[#2563eb] hover:underline mt-0.5">
            View / Download
          </a>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-150">
        <p className="text-gray-500 font-medium">Failed to load consultation details.</p>
        <button onClick={onBack} className="mt-4 text-[#2563eb] hover:underline font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200 pb-12">
      {/* Path header / Back button */}
      <div className="flex items-center gap-2 text-gray-800 font-sans">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-150 rounded-lg transition-colors flex items-center justify-center"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5 text-gray-800" />
        </button>
        <span className="text-base font-semibold tracking-tight text-gray-900">
          {data.assessment?.title || consultation.title} / {data.assessment?.category || "Assessment"}
        </span>
      </div>

      {/* Main Patient Info Banner Card */}
      <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-5">
        {/* Header Block of Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#2e5e54] text-white font-bold text-lg flex items-center justify-center shadow-sm select-none border border-gray-100">
              {getPatientInitials()}
            </div>
            <div className="flex flex-col">
              <h4 className="text-base font-bold text-gray-900 leading-tight">
                Patient: {getPatientName()}
              </h4>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                Submission Code: {data.submissionCode} &nbsp;&bull;&nbsp; Submitted: {formatDate(consultation.createdAt as any)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide">
              {data.assessment?.category || "General"}
            </span>
            <span
              className={`text-[11px] font-bold text-white px-3 py-1 rounded-full uppercase tracking-wide ${
                consultation.status === "ACCEPTED"
                  ? "bg-[#10b981]"
                  : consultation.status === "PENDING"
                    ? "bg-[#f59e0b]"
                    : "bg-[#ef4444]"
              }`}
            >
              {data.status?.replace("_", " ") || "UNKNOWN"}
            </span>
          </div>
        </div>

        {/* Large Aesthetic Card Image */}
        {data.assessment?.thumbnail && (
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[20px] bg-gray-50 border border-gray-100">
            <Image
              src={data.assessment.thumbnail}
              alt={data.assessment.title || "Assessment Thumbnail"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Doctor Notes Section */}
        {data.doctorNotes && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-[14px] p-4 flex flex-col gap-1.5 mt-2">
            <span className="text-[13px] font-semibold text-blue-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Doctor Notes (by {data.reviewedBy?.name || "Doctor"})
            </span>
            <p className="text-[14px] text-gray-700 leading-relaxed font-medium">
              {data.doctorNotes}
            </p>
          </div>
        )}
      </div>

      {/* Survey Q&A Cards List */}
      <div className="flex flex-col gap-4">
        {data.questions?.map((q: any, idx: number) => {
          // If information only, render differently
          if (q.type === "INFORMATION_ONLY") {
            return (
              <div key={q.id || idx} className="bg-gray-50 rounded-[20px] border border-gray-150 p-6 flex flex-col gap-2">
                {q.heading && <h4 className="text-base font-bold text-gray-900">{q.heading}</h4>}
                {q.description && <p className="text-sm text-gray-600">{q.description}</p>}
              </div>
            );
          }

          // Regular question
          const answer = q.patientAnswer;
          const isMultiple = q.type === "MULTIPLE_CHOICE";

          return (
            <div key={q.id || idx} className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
              <h4 className="text-[15px] font-bold text-gray-900 leading-snug whitespace-pre-wrap">
                {q.questionText}
              </h4>
              {q.description && (
                <p className="text-[13px] text-gray-500 font-light mt(-2)">{q.description}</p>
              )}
              
              <div className="flex flex-col gap-3 pl-1 mt-1">
                {/* Render Selected Options */}
                {answer?.selectedOptions?.map((opt: any, optIdx: number) => (
                  <React.Fragment key={opt.id || optIdx}>
                    {isMultiple ? renderCheckedItem(opt.label) : renderRadioItem(opt.label)}
                  </React.Fragment>
                ))}

                {/* Render Text Response */}
                {answer?.textResponse && renderTextItem(answer.textResponse)}

                {/* Render File Response */}
                {answer?.file && renderFileItem(answer.file)}

                {/* If no answer provided */}
                {(!answer || (!answer.selectedOptions?.length && !answer.textResponse && !answer.file)) && (
                  <span className="text-sm text-gray-400 italic">No answer provided</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Product & Payment Summary Card */}
      {data.paymentSummary && (
        <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-6 mb-4">
          <div>
            <h4 className="text-lg font-bold text-gray-900 leading-tight">
              Product & Payment Summary
            </h4>
            <p className="text-xs text-gray-400 font-light mt-1">
              Patient selected {data.paymentSummary.products?.length || 0} product(s)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Product Items List */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {data.paymentSummary.products?.map((prod: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0 flex items-center justify-center p-1">
                    {prod.image ? (
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <Box className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[14px] font-bold text-gray-900 truncate">
                      {prod.name}
                    </h5>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      Size: {prod.size || "Standard"}
                    </p>
                  </div>
                  <span className="text-[15px] font-bold text-[#2563eb] pr-2">
                    ${prod.price?.toFixed(2)}
                  </span>
                </div>
              ))}
              
              {(!data.paymentSummary.products || data.paymentSummary.products.length === 0) && (
                <div className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-200 rounded-xl">
                  No products selected
                </div>
              )}
            </div>

            {/* Pricing Summary Columns */}
            <div className="lg:col-span-5 bg-gray-50/50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 text-[13px]">
              <div className="flex justify-between items-center text-gray-500 font-light">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">${data.paymentSummary.subtotal?.toFixed(2) || "0.00"}</span>
              </div>

              {data.paymentSummary.discount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-light">
                  <span>Discount</span>
                  <span className="font-medium">-${data.paymentSummary.discount?.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-gray-500 font-light">
                <span>Shipping Charge</span>
                <span className="font-medium text-gray-800">${data.paymentSummary.shippingCharge?.toFixed(2) || "0.00"}</span>
              </div>

              <div className="flex justify-between items-center text-gray-500 font-light pb-3 border-b border-gray-200/60">
                <span>Consultation Fees</span>
                <span className="font-medium text-emerald-600">
                  + ${data.paymentSummary.serviceFees?.toFixed(2) || "0.00"}
                </span>
              </div>

              <div className="flex justify-between items-center mt-1">
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-bold text-gray-950">
                    Total payable
                  </span>
                  <span className="text-[11px] font-bold bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full select-none w-fit">
                    Paid
                  </span>
                </div>
                <span className="text-[22px] font-black text-[#2563eb]">${data.paymentSummary.total?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
