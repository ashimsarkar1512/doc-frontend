"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useGetAllFeaturesDoctorQuery } from "@/Redux/features/homePageDoctor/homePageDoctorApi";
import fallBackImg from "@/public/fallback-man.jpeg";
import { useHomepageContent } from "@/providers/HomepageContentProvider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
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
    <section className="w-full mt-0 pt-[120px] pb-[90px] relative font-sans overflow-hidden">
      <div className="max-w-[1520px] mx-auto flex flex-col items-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="mb-[40px] lg:mb-[80px] text-center text-[36px] lg:text-[54px] font-semibold text-[#272628] font-[Quicksand] leading-[110%]"
        >
          {providersTitle}
        </motion.h2>

        {/* Carousel Container Wrapper */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.0, ease: "easeOut", delay: 0.1 }}
          className="w-full relative px-12 mb-[80px]"
        >
          {/* Navigation Arrow: Left */}
          <button
            onClick={scrollPrev}
            className="absolute left-2 2xl:-left-8 top-[40%] -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100/70 hover:bg-blue-200/90 text-blue-800 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>

          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-[40px] select-none">
              {providersD?.map((provider) => (
                <div
                  key={provider.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-20px)] lg:flex-[0_0_calc(33.333%-26px)] min-w-0"
                >
                  {/* Card Structure */}
                  <div className="flex flex-col gap-[14px]">
                    {/* Image Container with the exact soft blue tint fill background */}
                    <div className="w-full aspect-[480/523] bg-[#dbe8ff] rounded-[2rem] overflow-hidden relative group cursor-pointer">
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
                    <div className="flex flex-col">
                      <h3 className="text-[20px] lg:text-[26px] font-bold text-[#2B2922] font-[Quicksand] leading-[150%]">
                        {provider?.fullName}
                      </h3>
                      <p className="text-[16px] lg:text-[20px] font-normal text-[#2B2922] font-[Quicksand] leading-[150%]">
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
            className="absolute right-2 2xl:-right-8 top-[40%] -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100/70 hover:bg-blue-200/90 text-blue-800 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>
        </motion.div>

        {/* CTA Consultation Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              window.open(
                buttonLink,
                buttonNewTab ? "_blank" : "_self"
              )
            }
            className="flex justify-center items-center gap-[15px] bg-[#1D4ED8] hover:bg-blue-800 px-[24px] py-[16px] lg:px-[32px] lg:py-[22px] rounded-[46px] transition-all duration-200 shadow-md active:scale-98 text-center text-[18px] lg:text-[22px] text-white font-semibold font-[Quicksand] leading-[100%]"
          >
            {buttonText}
          </motion.button>
        </motion.div>
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
