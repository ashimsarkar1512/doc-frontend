"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface Provider {
  id: string;
  name: string;
  role: string;
  image: string;
}

const providers: Provider[] = [
  {
    id: "1",
    name: "Jeffrey Richker MD",
    role: "Licensed Colorado Physician",
    image: "/expartProviders/expart1.png",
  },
  {
    id: "2",
    name: "Runa Pradhan NP",
    role: "Licensed Colorado Nurse Practitioner - Family",
    image: "/expartProviders/expart2.png",
  },
  {
    id: "3",
    name: "Nicole Sheeder NP",
    role: "Licensed Colorado Nurse Practitioner - Family",
    image: "/expartProviders/expart3.png",
  },
];

const Expert: React.FC = () => {
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
          Meet our expert providers
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
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                >
                  {/* Card Structure */}
                  <div className="flex flex-col gap-4">
                    {/* Image Container with the exact soft blue tint fill background */}
                    <div className="w-full aspect-[4/5] bg-[#dbe8ff] rounded-[2rem] overflow-hidden relative group">
                      <img
                        src={provider.image}
                        alt={provider.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103 mix-blend-multiply opacity-90"
                        draggable={false}
                      />
                    </div>
                    {/* Meta Text */}
                    <div className="px-2">
                      <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
                        {provider.name}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        {provider.role}
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
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-8 py-4 rounded-full transition-all duration-200 shadow-md shadow-blue-600/10 active:scale-98">
          Schedule your consultation
        </button>
      </div>
    </section>
  );
};

export default Expert;
