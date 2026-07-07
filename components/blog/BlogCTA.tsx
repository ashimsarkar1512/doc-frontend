"use client";
import Image from "next/image";
import React from "react";

import FadeIn from "@/components/shared/animations/FadeIn";

const BlogCTA = () => {
  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 md:mb-28 w-full">
      <FadeIn>
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
              className="bg-[#1D4ED8] hover:bg-[#1D4ED8] text-white font-medium px-6 sm:px-9 py-2.5 sm:py-3 rounded-full transition-colors text-[13px] sm:text-[15px] whitespace-nowrap"
            >
              Book a consultation
            </button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

export default BlogCTA;
