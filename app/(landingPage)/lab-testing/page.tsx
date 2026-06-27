"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { ChevronDown } from "lucide-react";

const panelServices = [
  {
    title: "Weight Loss lab test",
    description:
      "Your heart pumps blood to deliver oxygen and nutrients throughout the body. Cholesterol and inflammation markers are crucial to assess cardiovascular risk.",
    image: "/wight-loss.png",
    tests: [
      "Apolipoprotein B",
      "High-Sensitivity C-Reactive Protein",
      "Lipoprotein (a)",
      "Non-HDL Cholesterol",
      "HDL Cholesterol",
    ],
  },
  {
    title: "Hormone Therapy",
    description:
      "Your test results capture testosterone levels in the blood and focus on prevention.",
    image: "/hormone-therapy.png",
    tests: [
      "Apolipoprotein B",
      "Testosterone, Free",
      "Testosterone",
      "CK (total)",
    ],
  },
  {
    title: "Regrow Hair",
    description:
      "Your test results capture the thyroid function, full blood counts and metabolic clarity and focus on prevention.",
    image: "/regrow-hair.png",
    tests: [
      "Apolipoprotein B",
      "High-Sensitivity C-Reactive Protein",
      "Mean Platelet Volume",
      "Albumin",
      "CK (total)",
    ],
  },
  {
    title: "Men's Services",
    description:
      "Your test results capture the hemoglobin levels in the blood and focus on prevention.",
    image: "/mens-service.png",
    tests: [
      "Apolipoprotein B",
      "High-Sensitivity C-Reactive Protein",
      "Mean Platelet Volume",
      "Albumin",
      "CK (total)",
    ],
  },
  {
    title: "Skin Services",
    description:
      "Your test results capture the iron, vitamins, full blood counts and focus on prevention.",
    image: "/skin-services.png",
    tests: [
      "Apolipoprotein B",
      "High-Sensitivity C-Reactive Protein",
      "Mean Platelet Volume",
      "Albumin",
      "CK (total)",
    ],
  },
];

export default function LabTestingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── HERO BANNER ── */}
      <section className="px-4 md:px-6 pt-4 sm:pt-6 md:pt-8">
        <div className="relative w-full rounded-[28px] sm:rounded-4xl overflow-hidden min-h-[420px] sm:min-h-[540px] md:min-h-[600px] flex flex-col">
          <Image
            src="/lab-testing.png"
            alt="WLMD Lab Tests"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.18) 100%)",
            }}
          />

          <Navbar
            embedded
            overlay
            initialPadding="py-4 sm:py-5 md:py-8"
            scrolledPadding="py-3 md:py-4"
            className="!px-5 sm:!px-6 md:!px-8"
          />

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-5 sm:px-6 pb-8 sm:pb-10 pt-20 sm:pt-24 md:pt-28">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-white leading-[1.12] mb-4 sm:mb-6 drop-shadow-md tracking-tight">
              WLMD Lab Tests
            </h1>
            <button
                onClick={() =>
                window.open(
                  "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
                  "_blank",
                )
              }
             className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-colors shadow-md text-[13px] sm:text-[14px]">
              Book a consultation
            </button>
          </div>
        </div>
      </section>

      {/* ── PANEL SECTION ── */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 md:mt-16 mb-12 w-full">
        <div className="mb-10 sm:mb-14 md:mb-16">
          <h2 className="text-[22px] sm:text-[26px] md:text-[32px] font-bold text-[#111827] mb-4 sm:mb-5 tracking-tight">
            See what&apos;s inside the panel
          </h2>
          <p className="text-[13px] sm:text-[14px] md:text-[15px] text-[#4b5563] leading-[1.85] max-w-[780px]">
            Measure what matters—up to 130 biomarker tests, twice a year on the Advanced plan.
            Each test is selected by Hims experts and grouped into 10 vital areas for a holistic
            picture of your health. Dive in, then get ready for your first test.
          </p>
        </div>

        <div>
          {panelServices.map((service, index) => (
            <div
              key={index}
              className={`py-8 sm:py-10 md:py-14 ${
                index !== panelServices.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 xl:gap-24 items-start">
                {/* Left: Image + Description */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-7 items-start">
                  <div className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] rounded-[20px] overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0 pt-0 sm:pt-1">
                    <h3 className="text-[17px] sm:text-[18px] md:text-[20px] font-bold text-[#111827] mb-2 sm:mb-2.5 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-[13px] md:text-[14px] text-[#6b7280] leading-[1.75] mb-4 sm:mb-5">
                      {service.description}
                    </p>
                    <button className="self-start bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[12px] sm:text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full transition-colors">
                    Coming soon
                    </button>
                  </div>
                </div>

                {/* Right: Test List */}
                <div className="w-full lg:pt-0">
                  {service.tests.map((test, testIndex) => (
                    <div
                      key={testIndex}
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 md:gap-6 py-3.5 sm:py-4 ${
                        testIndex !== service.tests.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <span className="text-[13px] sm:text-[14px] md:text-[15px] text-[#374151] font-medium break-words">
                        {test}
                      </span>
                      <button className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-[#6b7280] bg-[#f3f4f6] hover:bg-[#e5e7eb] rounded-full px-3 sm:px-3.5 py-1.5 transition-colors whitespace-nowrap self-start sm:self-auto flex-shrink-0">
                        Tested 2x/year
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 md:mb-28 w-full">
        <div
          className="w-full rounded-[20px] sm:rounded-[24px] flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:px-14 md:py-12 shadow-xl relative overflow-hidden text-center md:text-left"
          style={{
            background:
              "linear-gradient(to right, #292929 0%, #292929 40%, #27457a 60%, #3e70d6 85%, #8cb5f0 100%)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-0 relative z-10">
            <div className="relative w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[72px] md:h-[72px] flex-shrink-0">
              <Image
                src="/weight-loss.png"
                alt="Weight Loss MD Logo"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-[20px] sm:text-[24px] md:text-[32px] font-medium text-white tracking-wide leading-[1.25]">
              Contact Us at Weight Loss MD
              <br className="hidden sm:block" /> Today
            </h2>
          </div>

          <div className="relative z-10 p-[5px] rounded-full border-[1.5px] border-white/30 bg-white/10 backdrop-blur-sm">
            <button
                onClick={() =>
                window.open(
                  "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
                  "_blank",
                )
              }
             className="bg-[#214cc7] hover:bg-[#1a3ca0] text-white font-medium px-6 sm:px-9 py-2.5 sm:py-3 rounded-full transition-colors text-[13px] sm:text-[15px] whitespace-nowrap">
              Book a consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
