"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useGetAllFeaturesDoctorQuery } from "@/Redux/features/homePageDoctor/homePageDoctorApi";
import fallBackImg from "@/public/fallback-man.jpeg";
import { useHomepageContent } from "@/providers/HomepageContentProvider";


const Expert: React.FC = () => {
  const { content } = useHomepageContent();
  const { data } = useGetAllFeaturesDoctorQuery();
  
  const providersTitle = content?.providersTitle || "Meet our expert providers";
  const buttonText = content?.providersButtonText || "Schedule your consultation";
  const buttonLink = content?.providersButtonLink || "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434";
  const buttonNewTab = content?.providersButtonNewTab ?? true;

  const providersD = data?.data?.filter((doctor) => doctor.featured);

  // console.log(providersD)
  // const providers=
  // Initialize Embla Carousel with basic configurations
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="w-full bg-[#f0f6ff] py-20  relative font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Title */}
        <h2 className="text-3xl md:text-[40px] font-normal text-gray-900 mb-16 tracking-tight text-center">
          {providersTitle}
        </h2>

        {/* Carousel Container Wrapper */}
        <div className="w-full relative px-12 mb-16">
          {/* Navigation Arrow: Left */}
          <button
            onClick={scrollPrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-blue-100/70 hover:bg-blue-200/90 text-blue-800 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 select-none">
              {providersD?.map((provider) => (
                <div
                  key={provider.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                >
                  {/* Card Structure */}
                  <div className="flex flex-col gap-4">
                    {/* Image Container with the exact soft blue tint fill background */}
                    <div className="w-full aspect-[4/5] bg-[#dbe8ff] rounded-[2rem] overflow-hidden relative group">
                      <img
                        src={provider?.thumbnail || fallBackImg.src}
                        onError={(e) => {
                          e.currentTarget.src = fallBackImg.src;
                        }}
                        alt={provider?.fullName}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103 mix-blend-multiply opacity-90"
                        draggable={false}
                      />
                    </div>
                    {/* Meta Text */}
                    <div className="px-2">
                      <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
                        {provider?.fullName}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        {provider?.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrow: Right */}
          <button
            onClick={scrollNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-blue-100/70 hover:bg-blue-200/90 text-blue-800 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        {/* CTA Consultation Button */}
        <button
          onClick={() =>
            window.open(
              buttonLink,
              buttonNewTab ? "_blank" : "_self"
            )
          }
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-8 py-4 rounded-full transition-all duration-200 shadow-md shadow-blue-600/10 active:scale-98"
        >
          {buttonText}
        </button>
        {/* best for SEO  */}
        {/* <a
          href="https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-8 py-4 rounded-full transition-all duration-200 shadow-md shadow-blue-600/10 active:scale-98"
        >
          Schedule your consultation
        </a> */}
      </div>
    </section>
  );
};

export default Expert;
