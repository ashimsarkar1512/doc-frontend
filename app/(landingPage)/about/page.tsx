"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Expert from "@/components/home/Expert";
import QNA from "@/components/home/QNA";
import { useGetAboutUsDataQuery } from "@/Redux/api/aboutUsApi";
import { ScrollRevealText } from "@/components/shared/ScrollRevealText";
import CommonHero from "@/components/shared/CommonHero";
import FadeIn from "@/components/shared/animations/FadeIn";

export default function AboutPage() {
  const { data: response, isLoading } = useGetAboutUsDataQuery();
  const data = response?.data;

  const getMediaUrl = (url: string | undefined) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("/")) return url;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (baseUrl.includes("prod.weightlossmdcherrycreek.com")) {
      return `https://storage.weightlossmdcherrycreek.com/${url}`;
    }
    return `https://pre-storage.weightlossmdcherrycreek.com/${url}`;
  };

  const benefits = [
    "Personalized treatment plans tailored to individual goals",
    "Licensed healthcare providers and medically supervised programs",
    "In-person and telehealth appointment options",
    "Ongoing monitoring and support throughout the journey",
    "Multiple clinic locations across Colorado",
    "Focus on long-term wellness and sustainable lifestyle improvements",
  ];

  const blobDefs = (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <clipPath id="blob-a" clipPathUnits="objectBoundingBox">
          <path d="M0.5,0 C0.8,0 1,0.2 1,0.5 C1,0.8 0.8,1 0.5,1 C0.2,1 0,0.8 0,0.5 C0,0.2 0.2,0 0.5,0 Z" />
        </clipPath>
        <clipPath id="blob-b" clipPathUnits="objectBoundingBox">
          <path d="M0.5,0 C0.85,0.05 1,0.35 0.95,0.65 C0.9,0.9 0.7,1 0.45,0.95 C0.2,0.9 0,0.7 0.05,0.4 C0.1,0.1 0.15,0 0.5,0 Z" />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <div className="w-full bg-white text-gray-900 font-sans overflow-x-clip">
      {blobDefs}

      <Navbar
        variant="dark"
        initialPadding="pt-5 pb-4" // You can set your custom padding here!
        scrolledPadding="py-2"
      />

      <CommonHero
        title={data?.heroTitle || "A Personalized Approach to Wellness"}
        description={
          data?.heroDescription ||
          "At Weight Loss MD, we believe weight management should be personal, medically guided, and built around long-term wellness — not quick fixes. Our team provides medically supervised programs designed to support individuals through personalized care, professional guidance, and ongoing support tailored to their health goals and lifestyle."
        }
        watermarkImage="/aboutWatermark.png"
      >
        <button
          onClick={() =>
            window.open(
              data?.heroButtonUrl ||
                "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
              data?.heroTargetBlank !== false ? "_blank" : "_self",
            )
          }
          className="bg-[#2563EB] hover:bg-[#1e40af] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          {data?.heroButtonText || "Book a consultation"}
        </button>
      </CommonHero>
      {/* MISSION + VIDEO */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10 flex flex-col items-center">
        <span className="bg-[#E6E6E6] text-[#272628] text-[16px] font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide">
          About us
        </span>

        <ScrollRevealText
          text={
            data?.bodySection1Title && data?.bodySection1Description
              ? `${data.bodySection1Title} ${data.bodySection1Description}`
              : "A Personalized Approach to Wellness"
          }
          className="text-center max-w-[1520px] text-3xl font-bold md:text-4xl lg:text-[40px] text-gray-900 leading-snug tracking-tight mb-12"
        />

        <FadeIn delay={0.1}>
          <div className="w-full relative group overflow-hidden rounded-[2.5rem] h-[300px] md:h-[500px] lg:h-[600px]">
          {data?.bodySection1Image?.fileType?.startsWith("video/") ? (
            <video
              src={getMediaUrl(data.bodySection1Image.fileUrl)}
              controls
              autoPlay
              muted
              loop
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              style={{
                clipPath:
                  "polygon(0 0, 50% 4%, 100% 0, 100% 100%, 50% 96%, 0 100%)",
              }}
            />
          ) : (
            <img
              src={
                data?.bodySection1Image?.fileUrl
                  ? getMediaUrl(data.bodySection1Image.fileUrl)
                  : "/about_US.png"
              }
              alt="Section thumbnail"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              style={{
                clipPath:
                  "polygon(0 0, 50% 4%, 100% 0, 100% 100%, 50% 96%, 0 100%)",
              }}
            />
          )}
          <div
            className="absolute inset-0 bg-black/5 pointer-events-none"
            style={{
              clipPath:
                "polygon(0 0, 50% 4%, 100% 0, 100% 100%, 50% 96%, 0 100%)",
            }}
            />
          </div>
        </FadeIn>
      </section>

      {/* INCORPORATE & OVERSEE */}
      <section className="w-full pt-16 md:pt-24 pb-8 md:pb-12 px-4 md:px-8">
        <div className="max-w-[1520px] mx-auto grid grid-cols-1 lg:grid-cols-2  items-center">
          <FadeIn className="flex flex-col items-start pr-0 lg:pr-12 ">
            <span className="text-[54px] font-bold  w-full">
              {data?.bodySection2Tag || "Our Mission"}
            </span>
            <h2 className=" text-[#272628] text-lg md:text-xl leading-[1.15] mb-6">
              {data?.bodySection2Title ||
                "Incorporate and oversee Various Athletics, Administrators, and Trainers."}
            </h2>
            <p className="text-[#3B3B3B] text-lg md:text-xl leading-relaxed mb-8">
              {data?.bodySection2Description ||
                "Our mission is to help individuals take control of their health through medically supervised care, evidence-based treatments, and personalized wellness programs."}
            </p>
            <button
              onClick={() => {
                const link = data?.bodySection2ButtonUrl || "/";
                const target = data?.bodySection2TargetBlank
                  ? "_blank"
                  : "_self";
                window.open(link, target);
              }}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all duration-200 shadow-md"
            >
              {data?.bodySection2ButtonText || "Contact us"}
            </button>
          </FadeIn>

          {/* Right: Image */}
          <FadeIn delay={0.2} className="flex justify-end items-center overflow-visible">
            {data?.bodySection2Image?.fileUrl ? (
              <div className="relative  w-full max-w-[460px] h-[460px] md:h-[520px] flex items-center justify-center">
                {/* doctorShape.png as background (blue blob) */}
                <img
                  src="/doctorShape.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                {/* Dynamic image masked to the same shape — no rectangular edges */}
                <img
                  src={getMediaUrl(data.bodySection2Image.fileUrl)}
                  alt="Medical professional"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  style={{
                    maskImage: "url('/doctorShape.png')",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskImage: "url('/doctorShape.png')",
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                  }}
                />
              </div>
            ) : (
              <div className="relative w-full max-w-[420px] h-[420px]">
                <img
                  src="/Union.png"
                  alt="Medical professional"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* WHY PATIENTS CHOOSE */}
      <section className="w-full pt-8 md:pt-12 pb-16 md:pb-24 px-4 md:px-8 bg-white">
        <div className="max-w-[1520px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Image */}
          <FadeIn className="flex justify-start items-center overflow-visible">
            {data?.bodySection3Image?.fileUrl ? (
              <div className="relative w-full max-w-[460px] h-[460px] md:h-[520px] flex items-center justify-center">
                {/* doctorShape.png as background (blue blob) */}
                <img
                  src="/doctorShape.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                {/* Dynamic image masked to the same shape — no rectangular edges */}
                <img
                  src={getMediaUrl(data.bodySection3Image.fileUrl)}
                  alt="Weight loss progress"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  style={{
                    maskImage: "url('/doctorShape.png')",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskImage: "url('/doctorShape.png')",
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                  }}
                />
              </div>
            ) : (
              <div className="relative w-full max-w-[420px] h-[420px]">
                <img
                  src="/Union2.png"
                  alt="Weight loss progress"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.2} className="flex flex-col items-start">
            <span className="text-[54px] font-bold">
              {data?.bodySection3Tag || "Why WLMD"}
            </span>
            <h2 className=" text-gray-900 text-lg md:text-xl leading-[1.2] mb-6 whitespace-pre-line">
              {data?.bodySection3Title ||
                "Why Patients Choose\nWeight Loss MD?"}
            </h2>
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed mb-8">
              {data?.bodySection3Description ||
                "Our mission is to help individuals take control of their health through medically supervised care, evidence-based treatments, and personalized wellness programs. We are committed to creating a supportive environment where patients feel heard, respected, and empowered at every stage of their transformation."}
            </p>

            <ul className="space-y-3 mb-8 w-full ">
              {(data?.bodySection3Points?.length > 0
                ? data.bodySection3Points
                : benefits
              ).map((benefit: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 ">
                  <span className="flex-shrink-0 flex items-center justify-center mt-1 ">
                    <svg
                      className="w-4 h-4 text-[#2563EB]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </span>
                  <span className="text-gray-600 text-lg md:text-xl">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                const link =
                  data?.bodySection3ButtonUrl ||
                  "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434";
                const target =
                  data?.bodySection3TargetBlank !== false ? "_blank" : "_self";
                window.open(link, target);
              }}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all duration-200 shadow-md"
            >
              {data?.bodySection3ButtonText || "Book a consultation"}
            </button>
          </FadeIn>
        </div>
      </section>

      <Expert />

      {/* ── FAQ SECTION (Dynamic based on page data) ── */}
      {/* ── FAQ SECTION (Dynamic based on page data) ── */}
      <QNA
        faqData={data?.faqs?.map((item: any) => ({
          id: item.id || Math.random().toString(),
          question: item.question,
          answer: item.answer,
        }))}
        title={data?.faqSectionTitle || "About Us FAQs"}
        cardTitle={data?.faqCardTitle}
        cardDescription={data?.faqCardDescription}
        buttonText={data?.faqButtonText}
        buttonLink={data?.faqButtonUrl}
        buttonNewTab={data?.faqTargetBlank}
        cardMediaUrl={
          data?.faqCardImage?.fileUrl
            ? getMediaUrl(data.faqCardImage.fileUrl)
            : undefined
        }
      />
    </div>
  );
}
