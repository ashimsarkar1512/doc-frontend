"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Consultation } from "@/types/patientTypes";

interface ConsultationDetailsProps {
  consultation: Consultation;
  onBack: () => void;
}

export default function ConsultationDetails({
  consultation,
  onBack,
}: ConsultationDetailsProps) {
  // Survey checklist item styling
  const renderCheckedItem = (text: string) => (
    <div className="flex items-center gap-3 py-1">
      <div className="w-5 h-5 rounded-md bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/10">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
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

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Path header / Back button */}
      <div className="flex items-center gap-2 text-gray-800 font-sans">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-150 rounded-lg transition-colors flex items-center justify-center"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5 text-gray-855" />
        </button>
        <span className="text-base font-semibold tracking-tight text-gray-900">
          {consultation.title} / GLP-1 Assessment
        </span>
      </div>

      {/* Main Patient Info Banner Card */}
      <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-5">
        {/* Header Block of Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#2e5e54] text-white font-bold text-lg flex items-center justify-center shadow-sm select-none border border-gray-100">
              AC
            </div>
            <div className="flex flex-col">
              <h4 className="text-base font-bold text-gray-900 leading-tight">
                Patient: Alan Cattoch
              </h4>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                Consultation id: {consultation.id} &nbsp;&bull;&nbsp; Submitted:
                18 May, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide">
              {consultation.title}
            </span>
            <span
              className={`text-[11px] font-bold text-white px-3 py-1 rounded-full uppercase tracking-wide ${
                consultation.status === "Approved"
                  ? "bg-[#10b981]"
                  : consultation.status === "Pending"
                    ? "bg-[#f59e0b]"
                    : "bg-[#ef4444]"
              }`}
            >
              {consultation.status}
            </span>
          </div>
        </div>

        {/* Large Aesthetic Card Image */}
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[20px] bg-gray-50">
          <Image
            src={consultation.image}
            alt={consultation.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Brand/Program description below image */}
        <p className="text-[14px] text-gray-600 leading-relaxed font-light">
          Weight loss is about more than diet and exercise alone. Weight Loss MD
          provides medical support to help you overcome these challenges.
        </p>
      </div>

      {/* Survey Q&A Cards List */}
      <div className="flex flex-col gap-4">
        {/* Q1 */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            How much weight are you looking to lose?
          </h4>
          {renderRadioItem("< 20 lbs")}
        </div>

        {/* Q2: Age, weight, height & Health Snapshot Box */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-5">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            What is your age, current weight & height?
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8 text-[14px] text-gray-600 font-light pl-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">Age:</span>
              <span>26 years</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">Height:</span>
              <span>6 feet</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">Weight:</span>
              <span>220 lbs</span>
            </div>
          </div>

          {/* Health Snapshot Box */}
          <div className="bg-[#fdf2f2] border border-[#fde2e2] rounded-[14px] p-4 flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-gray-800">
              Health Snapshot:
            </span>
            <span className="text-[14px] font-bold text-rose-600">
              BMI: 29.8 (Overweight)
            </span>
          </div>
        </div>

        {/* Q3 */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            What do you want to accomplish with the Weight Loss MD Body Program
            I want to...
          </h4>
          <div className="flex flex-col gap-3 pl-1">
            {renderCheckedItem("Lose weight")}
            {renderCheckedItem("Improve my general physical health")}
            {renderCheckedItem("Increase confidence about my appearance")}
          </div>
        </div>

        {/* Q4 */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            Do you currently have, or have you ever been diagnosed with, any of
            the following heart or heart-related conditions?
          </h4>
          <div className="flex flex-col gap-3 pl-1">
            {renderCheckedItem("Atrial fibrillation or flutter")}
            {renderCheckedItem("Heart failure")}
            {renderCheckedItem(
              "Heart disease, stroke, or peripheral vascular disease",
            )}
            {renderCheckedItem("Hypertension (high blood pressure)")}
          </div>
        </div>

        {/* Q5 */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            Do you currently have, or have you ever been diagnosed with, any of
            these hormone, kidney, or liver conditions?
          </h4>
          <div className="flex flex-col gap-3 pl-1">
            {renderCheckedItem(
              "Multiple Endocrine Neoplasia syndrome type 2 (MEN2)",
            )}
            {renderCheckedItem("Family history of thyroid cancer")}
            {renderCheckedItem("Type 2 Diabetes")}
          </div>
        </div>

        {/* Q6 */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            Do you currently have, or have history of, any of these
            gastrointestinal conditions or procedures?
          </h4>
          <div className="flex flex-col gap-3 pl-1">
            {renderCheckedItem("Pancreatitis")}
            {renderCheckedItem("GERD / Acid Reflux requiring insulin")}
          </div>
        </div>

        {/* Q7 */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            Do you currently have, or have you ever been diagnosed with, any of
            these additional following conditions?
          </h4>
          <div className="flex flex-col gap-3 pl-1">
            {renderCheckedItem("Chronic candidiasis (fungal infection)")}
            {renderCheckedItem("Eating disorder")}
            {renderCheckedItem("Metabolic syndrome")}
          </div>
        </div>

        {/* Q8 */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            Do you have an ALLERGY to GLP-1 agonist medications?
          </h4>
          {renderRadioItem("No, I do not have an allergy to GLP-1 medication")}
        </div>

        {/* Q9 */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            Are you currently taking a GLP-1 medication in the past 30 days?
          </h4>
          {renderRadioItem(
            "No, I am not currently taking a GLP-1 medication in the past 30 days",
          )}
        </div>

        {/* Q10 */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            Do you currently take any of the following medications?
          </h4>
          <div className="flex flex-col gap-3 pl-1">
            {renderCheckedItem("Insulin")}
            {renderCheckedItem(
              "Diuretics such as (but not limited to) furosemide (Lasix), bumetanide (Bumex), Hydrochlorothiazide/HCTZ",
            )}
          </div>
        </div>

        {/* Q11 */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            Do you take any medications?
          </h4>
          {renderRadioItem("I don't take any medications")}
        </div>

        {/* Q12 */}
        <div className="bg-white rounded-[20px] border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <h4 className="text-base font-bold text-gray-900 leading-snug">
            Is there anything else you want your healthcare provider to know
            about your health?
          </h4>
          {renderRadioItem("No")}
        </div>
      </div>

      {/* Product & Payment Summary Card */}
      <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-6 mb-12">
        <div>
          <h4 className="text-lg font-bold text-gray-900 leading-tight">
            Product & Payment Summary
          </h4>
          <p className="text-xs text-gray-400 font-light mt-1">
            Patient selected two products:
          </p>
        </div>

        {/* Grid separating Products list and Pricing breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Product Items List */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Product Item 1 */}
            <div className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0 flex items-center justify-center p-1">
                {/* Visual Unsplash fallback bottle representation */}
                <Image
                  src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=150&auto=format&fit=crop"
                  alt="Phentermine"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-[15px] font-bold text-gray-900 truncate">
                  Phentermine
                </h5>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  Medium Rare, Bone Marrow Butter
                </p>
              </div>
              <span className="text-[15px] font-bold text-blue-600 pr-2">
                $48
              </span>
            </div>

            {/* Product Item 2 */}
            <div className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0 flex items-center justify-center p-1">
                <Image
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop"
                  alt="Vitamin C"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-[15px] font-bold text-gray-900 truncate">
                  Vitamin C Ascorbic Acid
                </h5>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  Medium Rare, Bone Marrow Butter
                </p>
              </div>
              <span className="text-[15px] font-bold text-blue-600 pr-2">
                $48
              </span>
            </div>
          </div>

          {/* Pricing Summary Columns */}
          <div className="lg:col-span-5 bg-gray-50/50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 text-sm">
            <div className="flex justify-between items-center text-gray-500 font-light">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">$96.00</span>
            </div>

            <div className="flex justify-between items-center text-gray-500 font-light">
              <span>Incl. VAT</span>
              <span className="font-semibold text-gray-800">$2.00</span>
            </div>

            <div className="flex justify-between items-center text-gray-500 font-light pb-3 border-b border-gray-200/60">
              <span>Consultation Fees</span>
              <span className="font-semibold text-emerald-600 font-medium">
                + $50.00
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-950">
                  Total payable
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full select-none">
                    Paid
                  </span>
                </div>
              </div>
              <span className="text-2xl font-black text-blue-600">$148.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
