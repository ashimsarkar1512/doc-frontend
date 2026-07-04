"use client";

import React from "react";
import { useGetHeroSectionByPageQuery } from "@/Redux/features/heroSection/heroSectionApi";

export default function ContactHero() {
  const { data: heroData, isLoading: isHeroLoading } = useGetHeroSectionByPageQuery("ContactUs");

  return (
    <section className="pt-28 md:pt-36 px-4 sm:px-6 max-w-[1520px] mx-auto">
      <div className="relative bg-[#f4f7fa] rounded-[32px] w-full py-20 md:py-28 flex flex-col items-center justify-center min-h-[240px]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[32px] px-6 md:px-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 394"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto max-h-[90%] opacity-[0.55]"
          >
            <path
              d="M88.6828 394C59.8517 394 37.7723 385.792 22.4444 369.375C7.48147 352.958 0 329.793 0 299.878V94.1222C0 64.2074 7.48147 41.0417 22.4444 24.625C37.7723 8.20833 59.8517 0 88.6828 0C117.514 0 139.411 8.20833 154.374 24.625C169.702 41.0417 177.366 64.2074 177.366 94.1222V134.617H120.433V90.2917C120.433 66.5787 110.397 54.7222 90.325 54.7222C70.2528 54.7222 60.2167 66.5787 60.2167 90.2917V304.256C60.2167 327.604 70.2528 339.278 90.325 339.278C110.397 339.278 120.433 327.604 120.433 304.256V245.703H177.366V299.878C177.366 329.793 169.702 352.958 154.374 369.375C139.411 385.792 117.514 394 88.6828 394Z"
              fill="url(#g1)"
            />
            <path
              d="M301.503 394C271.942 394 249.315 385.609 233.622 368.828C217.929 352.046 210.083 328.333 210.083 297.689V96.3111C210.083 65.6667 217.929 41.9537 233.622 25.1722C249.315 8.39074 271.942 0 301.503 0C331.063 0 353.69 8.39074 369.383 25.1722C385.076 41.9537 392.922 65.6667 392.922 96.3111V297.689C392.922 328.333 385.076 352.046 369.383 368.828C353.69 385.609 331.063 394 301.503 394ZM301.503 339.278C322.305 339.278 332.706 326.692 332.706 301.519V92.4806C332.706 67.3083 322.305 54.7222 301.503 54.7222C280.7 54.7222 270.299 67.3083 270.299 92.4806V301.519C270.299 326.692 280.7 339.278 301.503 339.278Z"
              fill="url(#g1)"
            />
            <path
              d="M433.646 5.47222H509.19L567.765 234.758H568.859V5.47222H622.507V388.528H560.648L488.388 108.897H487.293V388.528H433.646V5.47222Z"
              fill="url(#g1)"
            />
            <path
              d="M714.342 60.1944H651.388V5.47222H837.512V60.1944H774.559V388.528H714.342V60.1944Z"
              fill="url(#g1)"
            />
            <path
              d="M888.072 5.47222H969.638L1032.04 388.528H971.828L960.88 312.464V313.558H892.451L881.503 388.528H825.666L888.072 5.47222ZM953.763 261.572L926.939 72.2333H925.844L899.568 261.572H953.763Z"
              fill="url(#g1)"
            />
            <path
              d="M1145.04 394C1116.21 394 1094.13 385.792 1078.8 369.375C1063.84 352.958 1056.36 329.793 1056.36 299.878V94.1222C1056.36 64.2074 1063.84 41.0417 1078.8 24.625C1094.13 8.20833 1116.21 0 1145.04 0C1173.87 0 1195.77 8.20833 1210.73 24.625C1226.06 41.0417 1233.72 64.2074 1233.72 94.1222V134.617H1176.79V90.2917C1176.79 66.5787 1166.76 54.7222 1146.68 54.7222C1126.61 54.7222 1116.57 66.5787 1116.57 90.2917V304.256C1116.57 327.604 1126.61 339.278 1146.68 339.278C1166.76 339.278 1176.79 327.604 1176.79 304.256V245.703H1233.72V299.878C1233.72 329.793 1226.06 352.958 1210.73 369.375C1195.77 385.792 1173.87 394 1145.04 394Z"
              fill="url(#g1)"
            />
            <path
              d="M1316.83 60.1944H1253.88V5.47222H1440V60.1944H1377.05V388.528H1316.83V60.1944Z"
              fill="url(#g1)"
            />
            <defs>
              <linearGradient
                id="g1"
                x1="720"
                y1="0"
                x2="720"
                y2="394"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#C8CDD2" />
                <stop offset="1" stopColor="#C8CDD2" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative z-10 text-center px-4">
          {isHeroLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-64 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-4 w-96 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-4 w-72 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-5xl xl:lg:text-[76px] font-bold text-gray-900 mb-4 tracking-tight">
                {heroData?.title || "Contact Us"}
              </h1>
              <p className="text-sm md:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
                {heroData?.description ||
                  "Contact us to schedule a consultation with our medical team and explore personalized options to support your weight management goals."}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
