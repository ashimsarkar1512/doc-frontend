"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import CommonHero from "@/components/shared/CommonHero";
import {
  Shield,
  AlertCircle,
  Clock,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { useGetHeroSectionByPageQuery } from "@/Redux/features/heroSection/heroSectionApi";
import { useGetHowItWorksContentQuery } from "@/Redux/features/howItWorks/howItWorksApi";
import { useGetCtaSectionByPageQuery } from "@/Redux/features/ctaSection/ctaSectionApi";

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { data: heroData, isLoading: isHeroLoading } = useGetHeroSectionByPageQuery("HowItWorks");
  const { data: pageData, isLoading: isPageLoading } = useGetHowItWorksContentQuery();
  const { data: ctaData, isLoading: isCtaLoading } = useGetCtaSectionByPageQuery("HowItWorks");


  const journeySteps = pageData?.steps || [];
  const faqs = pageData?.faqs || [];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO SECTION ── */}
      <CommonHero
        watermarkImage="/howItWorksWatermark.png"
        title={heroData?.title || "How WeightLoss MD Works"}
        description={
          isHeroLoading ? (
            <span className="flex space-x-2 justify-center">
              <span className="h-4 w-64 bg-gray-200 animate-pulse rounded-md inline-block"></span>
            </span>
          ) : (
            heroData?.description ||
            "A clear, transparent process from your first health question to ongoing medical support — all from licensed providers."
          )
        }
      />

      {/* ── PATIENT JOURNEY ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-16 mb-16 w-full">
        {isPageLoading ? (
          <div className="flex flex-col items-center gap-3 mb-12">
            <div className="w-64 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-96 h-4 bg-gray-200 animate-pulse rounded mt-2"></div>
          </div>
        ) : (
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
              {pageData?.sectionTitle || "Your Patient Journey"}
            </h2>
            <p className="text-gray-500 text-sm">
              {pageData?.sectionDescription || "Six structured steps from assessment to ongoing care"}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {journeySteps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Step number block — floats outside the card */}
              <div className="flex flex-col items-center flex-shrink-0 pt-1">
                <div className="w-14 h-14 bg-[#2563eb] rounded-[14px] flex flex-col items-center justify-center shadow-md text-white leading-tight">
                  <span className="text-[13px] font-normal tracking-wide">Step</span>
                  <span className="text-[18px] font-medium">{index + 1}</span>
                </div>
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
                    {step.timeline}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-[13px] leading-relaxed mb-3">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── DISCLAIMER ── */}
        <div className="bg-[#fff5f5] border  rounded-2xl p-5 mt-5 flex items-start gap-3">
          <ShieldAlert className="w-[22px] h-[22px] text-[#dc2626] flex-shrink-0 mt-0.5 stroke-[2]" />
          <p className="text-gray-700 text-sm leading-relaxed">
            <strong className="text-[#dc2626]">
              {pageData?.disclaimerTitle || "Provider Review Disclaimer"}
            </strong>
            : {pageData?.disclaimerDescription || "All treatment decisions are made exclusively by licensed healthcare providers. Payment of any membership fee does not guarantee a prescription or approval for treatment. Providers may deny treatment if it is not medically appropriate."}
          </p>
        </div>
      </section>

      {/* ── PROCESS QUESTIONS / FAQ ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-4 mb-20 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-8 text-center">
          {pageData?.faqSectionTitle || "Process Questions"}
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
                  {faq.question}
                </span>
                <span className="flex-shrink-0 text-gray-400 text-xl font-light leading-none select-none">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>

              {openFaq === index && (
                <div className="px-5 pb-4 text-[13px] text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.answer}
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
            {isCtaLoading ? (
              <div className="h-8 w-64 bg-white/20 animate-pulse rounded-md" />
            ) : (
              <h2 className="text-[24px] md:text-[32px] font-medium text-white tracking-wide leading-[1.25]">
                {ctaData?.sectionTitle ? (
                  ctaData.sectionTitle
                ) : (
                  <>
                    Contact Us at Weight Loss MD
                    <br className="hidden md:block" /> Today
                  </>
                )}
              </h2>
            )}
          </div>

          <div className="relative z-10 p-[5px] rounded-full border-[1.5px] border-white/30 bg-white/10 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {isCtaLoading ? (
              <div className="w-32 h-10 bg-white/20 animate-pulse rounded-full" />
            ) : (
              <button
                onClick={() =>
                  window.open(
                    ctaData?.url || "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
                    ctaData?.openInNewTab ? "_blank" : "_self",
                  )
                }
                className="bg-[#214cc7] hover:bg-[#1a3ca0] text-white font-medium px-8 py-3 rounded-full transition-colors text-[14px] md:text-[15px] whitespace-nowrap"
              >
                {ctaData?.ctaButtonText || "Book a consultation"}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
