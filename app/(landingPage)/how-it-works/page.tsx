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
import FadeIn from "@/components/shared/animations/FadeIn";
import { motion, AnimatePresence } from "framer-motion";
import ContactCTA from "@/components/shared/ContactCTA";

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
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 mt-16 mb-16 w-full">
        {isPageLoading ? (
          <div className="flex flex-col items-center gap-3 mb-12">
            <div className="w-64 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-96 h-4 bg-gray-200 animate-pulse rounded mt-2"></div>
          </div>
        ) : (
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-[54px] font-bold text-[#3B3B3B] tracking-tight mb-3">
              {pageData?.sectionTitle || "Your Patient Journey"}
            </h2>
            <p className="text-gray-500 text-xl">
              {pageData?.sectionDescription || "Six structured steps from assessment to ongoing care"}
            </p>
          </FadeIn>
        )}

        <div className="flex flex-col gap-4">
          {journeySteps.map((step: any, index: number) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="flex items-start gap-4">
                {/* Step number block — floats outside the card */}
                <div className="flex flex-col items-center flex-shrink-0 pt-1">
                  <div className="w-14 h-14 bg-[#2563eb] rounded-[14px] flex flex-col items-center justify-center shadow-md text-white leading-tight">
                    <span className="text-base font-normal tracking-wide">Step</span>
                    <span className="text-base font-medium">{index + 1}</span>
                  </div>
                </div>

                {/* Card */}
                <div
                  className="flex-1 rounded-[18px] px-5 py-4 md:px-6 md:py-5"
                  style={{ background: "#F0F4FB" }}
                >
                  {/* Title + Duration */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-2xl font-semibold text-[#2B2922] leading-snug">
                      {step.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 bg-[#dce8fb] text-[#3b7ddd] text-lg font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                      <Clock className="w-4 h-4 stroke-[2.5]" />
                      {step.timeline}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-xl leading-relaxed mb-3">
                    {step.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ── DISCLAIMER ── */}
        <FadeIn delay={0.2}>
          <div className="bg-[#fff5f5] border  rounded-2xl p-5 mt-5 flex items-start gap-3">
            <ShieldAlert className="w-[24px] h-[24px] text-[#dc2626] flex-shrink-0 mt-0.5 stroke-[2]" />
            <p className="text-gray-700 text-xl leading-relaxed">
              <strong className="text-[#dc2626]">
                {pageData?.disclaimerTitle || "Provider Review Disclaimer"}
              </strong>
              : {pageData?.disclaimerDescription || "All treatment decisions are made exclusively by licensed healthcare providers. Payment of any membership fee does not guarantee a prescription or approval for treatment. Providers may deny treatment if it is not medically appropriate."}
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ── PROCESS QUESTIONS / FAQ ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-4 mb-20 w-full">
        <FadeIn>
          <h2 className="text-2xl md:text-[54px] font-bold text-gray-900 tracking-tight mb-8 text-center">
            {pageData?.faqSectionTitle || "Process Questions"}
          </h2>
        </FadeIn>

        <FadeIn delay={0.2} className="flex flex-col gap-3">
          {faqs.map((faq: any, index: number) => (
            <div
              key={index}
              className="bg-[#EBEEF2] border border-gray-200 rounded-[16px] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none"
              >
                <span className="text-xl font-semibold text-gray-800 pr-4">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 text-gray-800 text-xl font-light leading-none select-none">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-xl text-[#272628] leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </FadeIn>
      </section>

      <ContactCTA pageType="HowItWorks" />
    </div>
  );
}
