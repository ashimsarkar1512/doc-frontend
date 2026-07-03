"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";

export default function SupplementsPage() {
  return (
    <div className="w-full bg-white text-gray-900 font-sans overflow-x-hidden min-h-screen flex flex-col">
      <Navbar
        variant="dark"
        initialPadding="pt-5 pb-4"
        scrolledPadding="py-2"
      />

      <div className="px-4 md:px-6 mt-28 pb-16 flex-grow flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto w-full relative rounded-[2.5rem] bg-[#F0F4FA] py-16 md:py-20 px-6 md:px-16 flex flex-col items-center justify-center text-center">
          <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-bold text-gray-900 leading-[1.1] tracking-tight mb-5">
            Supplements
          </h1>
          <p className="text-gray-500 text-sm md:text-[15px] leading-relaxed mb-8 max-w-2xl mx-auto">
            Explore our curated range of high-quality supplements designed to support your overall wellness, metabolic health, and weight management journey.
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
  );
}
