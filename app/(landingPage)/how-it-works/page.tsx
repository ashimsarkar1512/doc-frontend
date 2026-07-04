"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import CommonHero from "@/components/shared/CommonHero";
import {
  Shield,
  ClipboardList,
  Stethoscope,
  BadgeCheck,
  Package,
  HeartPulse,
  AlertCircle,
  Clock,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { useGetHeroSectionByPageQuery } from "@/Redux/features/heroSection/heroSectionApi";

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { data: heroData, isLoading: isHeroLoading } =
    useGetHeroSectionByPageQuery("HowItWorks");

  const journeySteps = [
    {
      step: "01",
      icon: <ClipboardList className="w-5 h-5 text-white stroke-[2]" />,
      title: "Complete Assessment",
      duration: "5–10 minutes",
      description:
        "Fill out a comprehensive health questionnaire covering your medical history, current medications, weight history, and health goals. Your information is protected by HIPAA encryption.",
      tags: [
        "Personal health history",
        "Current medications list",
        "BMI & weight history",
        "Treatment goals",
        "Lifestyle assessment",
      ],
    },
    {
      step: "02",
      icon: <Stethoscope className="w-5 h-5 text-white stroke-[2]" />,
      title: "Medical Review by Provider",
      duration: "Within 24 hours",
      description:
        "A licensed provider in your state reviews your complete health profile, may request additional information, and determines medical appropriateness for treatment.",
      tags: [
        "Full chart review",
        "Contraindications screening",
        "Lab requirement identification",
        "Clinical care verification",
      ],
    },
    {
      step: "03",
      icon: <BadgeCheck className="w-5 h-5 text-white stroke-[2]" />,
      title: "Treatment Approval",
      duration: "48–72 hours",
      description:
        "If medically appropriate, your provider issues an e-prescription to our partner pharmacy. Payment does not guarantee approval — all decisions are clinical.",
      tags: [
        "E-prescription issued",
        "Dosing instructions provided",
        "Follow-up scheduled",
        "Patient education delivered",
      ],
    },
    {
      step: "04",
      icon: <Package className="w-5 h-5 text-white stroke-[2]" />,
      title: "Medication Shipment",
      duration: "3–7 business days",
      description:
        "Your prescription is filled by a licensed compounding or retail pharmacy and shipped directly to your door in discreet, temperature-appropriate packaging.",
      tags: [
        "NABP-accredited pharmacy",
        "Discreet packaging",
        "Tracking number provided",
        "Cold chain if required",
      ],
    },
    {
      step: "05",
      icon: <HeartPulse className="w-5 h-5 text-white stroke-[2]" />,
      title: "Ongoing Follow-Up Care",
      duration: "Bi-monthly",
      description:
        "Your provider monitors your progress, adjusts dosing as clinically appropriate, and addresses any side effects or questions throughout your treatment journey.",
      tags: [
        "Monthly provider check-ins",
        "Dose titration support",
        "Side effect management",
        "Lab monitoring coordination",
      ],
    },
  ];

  const faqs = [
    {
      q: "Do I need to be a patient of record before starting?",
      a: "No. Your assessment creates a new patient relationship with your assigned provider, who reviews your health information to establish the relationship as part of the clinical process.",
    },
    {
      q: "What if my provider requests more information?",
      a: "Your provider may request additional labs, records, or a short virtual visit to complete your evaluation, which helps ensure safety and appropriateness.",
    },
    {
      q: "Is payment taken before or after approval?",
      a: "Payment is required to start the process, but it does not guarantee approval for treatment. If you are not approved, you will be refunded promptly.",
    },
    {
      q: "How quickly can I receive my medication?",
      a: "If approved, medication is typically shipped within 1–3 business days of processing your order, though timelines can vary by pharmacy and shipping method.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO SECTION ── */}
      <CommonHero
        title="How WeightLoss MD Works"
        description="A clear, transparent process from your first health question to ongoing medical support — all from licensed providers."
        badge={
          <span className="inline-flex items-center gap-2 bg-[#d7e3f4]/50 border border-[#b9cee2] text-[#427ee1] px-4 py-1.5 rounded-full text-xs font-medium tracking-wide">
            <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
            Most patients approved within 72 hours
          </span>
        }
      />

      {/* ── PATIENT JOURNEY ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-16 mb-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
            Your Patient Journey
          </h2>
          <p className="text-gray-500 text-sm">
            Six structured steps from assessment to ongoing care
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {journeySteps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Icon + Step number — floats outside the card */}
              <div className="flex flex-col items-center flex-shrink-0 pt-1">
                <div className="w-12 h-12 bg-[#2563eb] rounded-[14px] flex items-center justify-center shadow-md">
                  {step.icon}
                </div>
                <span className="text-[11px] text-gray-400 font-semibold mt-1.5 tracking-wide">
                  {step.step}
                </span>
              </div>

              {/* Card */}
              <div
                className="flex-1 rounded-[18px] px-5 py-4 md:px-6 md:py-5"
                style={{ background: "#F0F4FB" }}
              >
                {/* Title + Duration */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-[15.5px] font-semibold text-gray-900 leading-snug">
                    {step.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 bg-[#dce8fb] text-[#3b7ddd] text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                    <Clock className="w-3 h-3 stroke-[2.5]" />
                    {step.duration}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-[13px] leading-relaxed mb-3">
                  {step.description}
                </p>

                {/* Tags — plain with circle-check icon, no pill bg */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {step.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-gray-500 text-[12px]"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#2563eb] flex-shrink-0 stroke-[2]" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── DISCLAIMER ── */}
        <div className="bg-[#fff5f5] border  rounded-2xl p-5 mt-5 flex items-start gap-3">
          <ShieldAlert className="w-[22px] h-[22px] text-[#dc2626] flex-shrink-0 mt-0.5 stroke-[2]" />
          <p className="text-gray-700 text-sm leading-relaxed">
            <strong className="text-[#dc2626]">
              Provider Review Disclaimer
            </strong>
            : All treatment decisions are made exclusively by licensed
            healthcare providers. Payment of any membership fee does not
            guarantee a prescription or approval for treatment. Providers may
            deny treatment if it is not medically appropriate.
          </p>
        </div>
      </section>

      {/* ── PROCESS QUESTIONS / FAQ ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-4 mb-20 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-8 text-center">
          Process Questions
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
                <span className="text-[13.5px] font-semibold text-gray-800 pr-4">
                  {faq.q}
                </span>
                <span className="flex-shrink-0 text-gray-400 text-xl font-light leading-none select-none">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>

              {openFaq === index && (
                <div className="px-5 pb-4 text-[13px] text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
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
              className="bg-[#214cc7] hover:bg-[#1a3ca0] text-white font-medium px-8 py-3 rounded-full transition-colors text-[14px] md:text-[15px] whitespace-nowrap"
            >
              Book a consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
