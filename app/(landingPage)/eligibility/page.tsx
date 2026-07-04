"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import CommonHero from "@/components/shared/CommonHero";
import { CircleCheckBig, Info, XCircle, Shield } from "lucide-react";

export default function EligibilityPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const eligibilityCriteria = [
    "No history of MTC or MEN2 syndrome (for GLP-1 medications)",
    "BMI ≥ 27 with at least one weight-related condition, or BMI ≥ 30",
    "No active eating disorders",
    "Not pregnant, breastfeeding, or planning pregnancy",
    "Age 18 or older",
    "Willing to complete required monitoring",
  ];

  const weightRelatedConditions = [
    "Type 2 Diabetes",
    "Prediabetes",
    "Hypertension",
    "High Cholesterol",
    "Sleep Apnea",
    "Osteoarthritis",
    "Non-alcoholic Fatty Liver Disease",
    "Cardiovascular Disease",
    "Polycystic Ovary Syndrome (PCOS)",
  ];

  const contraindications = [
    "Prior serious hypersensitivity to GLP-1/GIP receptor agonists",
    "Personal or family history of medullary thyroid carcinoma (MTC)",
    "Active pancreatitis or history of chronic pancreatitis",
    "Multiple Endocrine Neoplasia syndrome type 2 (MEN2)",
    "Severe renal impairment (eGFR < 30 mL/min/1.73 m²)",
    "Current use of insulin (in some cases)",
    "Current or recent pregnancy",
    "Current use of insulin (in some cases)",
  ];

  const requiredLabWork = [
    "Comprehensive Metabolic Panel (CMP)",
    "Hemoglobin A1c (HbA1c)",
    "Thyroid Stimulating Hormone (TSH)",
    "Lipid Panel",
    "Complete Blood Count (CBC)",
  ];

  const ongoingMonitoring = [
    "Quarterly metabolic panel (Comprehensive plan)",
    "HbA1c monitoring for diabetic patients",
    "Pancreatic enzyme monitoring if indicated",
    "Renal function for at-risk patients",
  ];

  const faqs = [
    {
      q: "How is BMI calculated?",
      a: "BMI is weight (kg) ÷ height (m²). You can use our free BMI calculator during your assessment. Providers may also consider waist circumference and body composition.",
    },
    {
      q: "Do I need labs before starting?",
      a: "Labs are often required before starting treatment. Your provider will specify exactly which labs are needed based on your health profile. Labs from within 90 days may be accepted.",
    },
    {
      q: "What if I have a contraindication?",
      a: "If you have a contraindication, your provider may determine that GLP-1 medications are not appropriate for you. Alternative treatments may be discussed during your evaluation.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col ">
      <Navbar variant="dark" />

      {/* ── HERO SECTION ── */}
      <CommonHero
        title="Am I Eligible?"
        description="Learn the medical criteria our licensed providers use to evaluate candidacy for GLP-1 weight loss treatment."
      />

      {/* ── GENERAL ELIGIBILITY CRITERIA ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-16 mb-10 w-full">
        <h2 className="text-2xl md:text-[54px] font-bold text-[#272628] tracking-tight mb-8 text-center">
          General Eligibility Criteria
        </h2>

        {/* 2-col grid of light blue-gray cards with lucide CircleCheckBig */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {eligibilityCriteria.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-[14px] px-4 py-6"
              style={{ background: "#E8F4FD" }}
            >
              <CircleCheckBig className="w-[17px] h-[17px] text-[#22A87A] flex-shrink-0 mt-0.5 stroke-[2]" />
              <span className="text-[#3B3B3B] text-lg leading-snug">{item}</span>
            </div>
          ))}
        </div>

        {/* Blue info note — full width */}
        <div
          className="flex items-start gap-3 rounded-[14px] px-4 py-6"
          style={{ background: "#e8f0fb" }}
        >
          <Info className="w-[16px] h-[16px] flex-shrink-0 mt-0.5 text-[#1A5C8A] stroke-[2]" />
          <p className="text-gray-600 text-[14px] leading-relaxed">
            Final eligibility is determined solely by your licensed provider
            after reviewing your complete health history. Meeting these general
            criteria does not guarantee approval.
          </p>
        </div>
      </section>

      {/* ── BMI QUALIFICATION ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-6 mb-10 w-full">
        <h2 className="text-2xl md:text-[54px] font-bold text-[#0D2137] tracking-tight mb-8 text-center">
          BMI Qualification
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* BMI 27–29.9 */}
          <div className="rounded-[16px] p-5 bg-white border border-gray-200">
            <div className="flex items-center gap-2 mb-3 text-[22px]">
              <span className="bg-[#dbeafe] text-[#2563eb] text-[10px] font-bold px-2 py-0.5 rounded-md">
                ≥27
              </span>
              <span className="text-[22px] font-bold text-[#0D2137]">BMI 27–29.9</span>
            </div>
            <p className="text-[#3B3B3B] text-lg leading-relaxed">
              Eligible if accompanied by at least one weight-related health
              condition such as hypertension, type 2 diabetes, dyslipidemia,
              or sleep apnea.
            </p>
          </div>

          {/* BMI 30+ */}
          <div className="rounded-[16px] p-5 bg-white border border-gray-200">
            <div className="flex items-center gap-2 mb-3 text-[22px]">
              <span className="bg-[#dbeafe] text-[#2563eb] text-[10px] font-bold px-2 py-0.5 rounded-md">
                ≥30
              </span>
              <span className="text-[22px] font-bold text-gray-900">BMI 30+</span>
            </div>
            <p className="text-[#3B3B3B] text-lg leading-relaxed">
              Eligible for treatment regardless of presence of comorbid
              conditions. GLP-1 medications are FDA-approved for this BMI
              category.
            </p>
          </div>
        </div>
      </section>

      {/* ── WEIGHT-RELATED CONDITIONS ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-6 mb-10 w-full">
        <h2 className="text-2xl md:text-[54px] font-semibold text-[#272628] tracking-tight mb-8 text-center">
          Weight-Related Conditions Considered
        </h2>

        <div className="flex flex-wrap justify-center gap-2.5">
          {weightRelatedConditions.map((condition, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 bg-[#E6E6E6] border border-gray-200 text-gray-700 px-3.5 py-1.5 rounded-full text-lg text-[#272628]"
            >
              <CircleCheckBig className="w-[14px] h-[14px] text-[#1D4ED8] flex-shrink-0 stroke-[2]" />
              {condition}
            </span>
          ))}
        </div>
      </section>

      {/* ── CONTRAINDICATIONS ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-6 mb-10 w-full">
        <h2 className="text-2xl md:text-[54px] font-semibold text-[#272628] tracking-tight mb-8 text-center">
          Contraindications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contraindications.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-[14px] px-4 py-6 bg-white border border-gray-200"
            >
              <XCircle className="w-[17px] h-[17px] text-[#C0392B] flex-shrink-0 mt-0.5 stroke-[1.8]" />
              <span className="text-[#3B3B3B] text-lg leading-snug">{item}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-[#3B3B3B] text-lg mt-5">
          This list is not exhaustive. Your provider will conduct a full
          clinical review.
        </p>
      </section>

      {/* ── REQUIRED LAB WORK + ONGOING MONITORING ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-6 mb-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Required Lab Work */}
          <div>
            <h2 className="text-xl md:text-[54px] font-semibold text-[#272628] tracking-tight mb-5">
              Required Lab Work
            </h2>
            <div className="flex flex-col gap-2.5">
              {requiredLabWork.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-[12px] px-4 py-4 bg-white border border-gray-200"
                >
                  <span className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0" />
                  <span className="text-[#3B3B3B] text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ongoing Monitoring */}
          <div>
            <h2 className="text-xl md:text-[54px] font-semibold text-gray-900 tracking-tight mb-5">
              Ongoing Monitoring
            </h2>
            <div className="flex flex-col gap-2.5">
              {ongoingMonitoring.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-[12px] px-4 py-4 bg-white border border-gray-200"
                >
                  <span className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0" />
                  <span className="text-[#3B3B3B] text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[#3B3B3B] text-lg mt-5">
          Labs from within 90 days may be accepted. Your provider will specify
          requirements.
        </p>

        {/* Provider Review Disclaimer — pink bg, red shield icon */}
        <div className="bg-[#fff5f5]  rounded-[16px] p-5 mt-5 text-lg flex items-start gap-3">
          <Shield className="w-[30px] h-[30px] text-[#ef4444] flex-shrink-0 mt-0.5 stroke-[1.8]" />
          <p className="text-gray-700 text-lg leading-relaxed">
            <strong className="text-red-500 ">Provider Review Disclaimer</strong>
            : Eligibility criteria presented here are general guidelines. All
            final treatment decisions are made exclusively by licensed
            healthcare providers. Meeting criteria on this page does not
            guarantee prescription approval.
          </p>
        </div>
      </section>

      {/* ── ELIGIBILITY QUESTIONS / FAQ ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-6 mb-20 w-full">
        <h2 className="text-2xl md:text-[54px] font-semibold text-[#272628] tracking-tight mb-8 text-center">
          Eligibility Questions
        </h2>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#EBEEF2] border border-gray-200 rounded-[16px] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-[#272628] pr-4">
                  {faq.q}
                </span>
                <span className="flex-shrink-0 text-gray-400 text-xl font-light leading-none select-none">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>

              {openFaq === index && (
                <div className="px-5 pb-4 text-lg text-[#272628] leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-24 w-full">
        <div
          className="w-full rounded-[24px] flex flex-col md:flex-row items-center justify-between p-8 md:px-12 md:py-10 shadow-xl relative overflow-hidden"
          style={{
            background:
              "linear-gradient(to right, #292929 0%, #292929 40%, #27457a 60%, #3e70d6 85%, #8cb5f0 100%)",
          }}
        >
          <div className="flex items-center gap-5 md:gap-7 mb-6 md:mb-0 relative z-10">
            <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-shrink-0">
              <Image
                src="/weight-loss.png"
                alt="Weight Loss MD Logo"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-[24px] md:text-[32px] font-medium text-white tracking-wide leading-[1.25]">
              Contact Us at Weight Loss MD
              <br className="hidden md:block" /> Today
            </h2>
          </div>

          <div className="relative z-10 p-[5px] rounded-full border-[1.5px] border-white/30 bg-white/10 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <button
                onClick={() =>
                window.open(
                  "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
                  "_blank",
                )
              }
             className="bg-[#214cc7] hover:bg-[#1a3ca0] text-white font-medium px-8 py-3 rounded-full transition-colors text-[14px] md:text-[15px] whitespace-nowrap">
              Book a consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
