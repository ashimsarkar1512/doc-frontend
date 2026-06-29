"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Expert from "@/components/home/Expert";
import QNA from "@/components/home/QNA";
import { useGetHomepageContentQuery } from "@/Redux/features/homepageContent/homepageContentApi";

export default function AboutPage() {
  const benefits = [
    "Personalized treatment plans tailored to individual goals",
    "Licensed healthcare providers and medically supervised programs",
    "In-person and telehealth appointment options",
    "Ongoing monitoring and support throughout the journey",
    "Multiple clinic locations across Colorado",
    "Focus on long-term wellness and sustainable lifestyle improvements",
  ];

  const { data } = useGetHomepageContentQuery();
  console.log(data);

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
    <div className="w-full bg-white text-gray-900 font-sans overflow-x-hidden">
      {blobDefs}

      <Navbar
        variant="dark"
        initialPadding="pt-5 pb-4" // You can set your custom padding here!
        scrolledPadding="py-2"
      />

      {/* ABOUT Section */}
      <div className="px-4 md:px-6 mt-28 pb-8">
        <div className="max-w-7xl mx-auto relative rounded-[2.5rem] overflow-hidden bg-[#F0F4FA] py-16 md:py-20 px-6 md:px-16 flex flex-col items-center justify-center text-center min-h-[500px]">
          {/* ABOUT Watermark - PNG Image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden p-5">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/aboutWatermark.png" // Replace with your actual PNG path
                alt="About watermark"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-bold text-gray-900 leading-[1.1] tracking-tight mb-5">
              A Personalized Approach
              <br />
              to Wellness
            </h1>

            <p className="text-gray-500 text-sm md:text-[15px] leading-relaxed mb-8">
              At Weight Loss MD, we believe weight management should be
              personal, medically guided, and built around long-term wellness —
              not quick fixes. Our team provides medically supervised programs
              designed to support individuals through personalized care,
              professional guidance, and ongoing support tailored to their
              health goals and lifestyle.
            </p>

            <button
              onClick={() =>
                window.open(
                  "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
                  "_blank",
                )
              }
              className="bg-[#2563EB] hover:bg-[#1e40af] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Book a consultation
            </button>
          </div>
        </div>
      </div>
      {/* MISSION + VIDEO */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10 flex flex-col items-center">
        <span className="bg-gray-100 text-gray-500 text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide">
          About us
        </span>

        <h2 className="text-center max-w-4xl text-3xl font-bold md:text-4xl lg:text-[40px] text-gray-900 leading-snug tracking-tight mb-12">
          {data?.aboutTitle}{" "}
          <span className="text-[#AEAEAE]">{data?.aboutDescription}</span>
        </h2>

        <div className="w-full relative overflow-hidden rounded-[2.5rem]  h-[00px] md:h-[500px] lg:h-[600px]">
          <Image
            src="/about_US.png"
            alt="video thumbnail"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* INCORPORATE & OVERSEE */}
      {/* INCORPORATE & OVERSEE */}
      <section className="w-full py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="flex flex-col items-start">
            <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-medium text-gray-900 leading-[1.2] mb-6">
              Incorporate and oversee Various Athletics, Administrators, and
              Trainers.
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
              Our mission is to help individuals take control of their health
              through medically supervised care, evidence-based treatments, and
              personalized wellness programs.
            </p>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
              We are committed to creating a supportive environment where
              patients feel heard, respected, and empowered at every stage of
              their transformation.
            </p>
            <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all duration-200 shadow-md">
              Contact us
            </button>
          </div>

          <div className="flex justify-center items-center">
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
              <Image
                src="/Union.png"
                alt="Medical professional"
                fill
                className="object-contain object-center drop-shadow-sm"
                sizes="(max-width: 768px) 320px, 400px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY PATIENTS CHOOSE */}
      {/* WHY PATIENTS CHOOSE */}
      <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="flex justify-center items-center order-last lg:order-first">
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
              <Image
                src="/Union2.png"
                alt="Weight loss progress"
                fill
                className="object-contain object-center drop-shadow-sm"
                sizes="(max-width: 768px) 320px, 400px"
              />
            </div>
          </div>

          <div className="flex flex-col items-start">
            <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
              Why WLMD
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-medium text-gray-900 leading-[1.2] mb-6">
              Why Patients Choose
              <br className="hidden md:block" />
              Weight Loss MD?
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
              Our mission is to help individuals take control of their health
              through medically supervised care, evidence-based treatments, and
              personalized wellness programs.
            </p>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
              We are committed to creating a supportive environment where
              patients feel heard, respected, and empowered at every stage of
              their transformation.
            </p>

            <ul className="space-y-3 mb-8 w-full">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center mt-1">
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
                  <span className="text-gray-600 text-sm md:text-[15px]">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() =>
                window.open(
                  "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
                  "_blank",
                )
              }
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all duration-200 shadow-md"
            >
              Book a consultation
            </button>
          </div>
        </div>
      </section>

      <Expert />
      <QNA />
    </div>
  );
}
