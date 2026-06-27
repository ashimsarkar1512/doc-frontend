"use client";

import React from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useHomepageContent } from "@/providers/HomepageContentProvider";
import { useGetTestimonialsQuery } from "@/Redux/features/testimonials/testimonialsApi";

const TestiMonial: React.FC = () => {
  const { content, isLoading } = useHomepageContent();
  const { data: testimonialsData } = useGetTestimonialsQuery();
  const reviews = testimonialsData?.data || [];

  const title = content?.testimonialTitle || "Read from Hundreds of success stories";
  const subtitle = content?.testimonialCardTitle || "Client's Testimonial";
  const description = content?.testimonialCardDescription || "See how Weight Loss MD has helped people feel stronger, healthier, and more balanced.";
  const buttonLink = content?.testimonialButtonLink || "#";
  const buttonNewTab = content?.testimonialButtonNewTab ?? false;

  // Initialize Embla with Autoplay plugin configured for 4 seconds intervals
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  return (
    <section className="w-full bg-[#121314] py-10 font-sans overflow-hidden text-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center px-4 md:px-8">
        {/* Google Header Logo & Stars Group */}
        <div className="flex flex-col items-center gap-1 mb-4">
          <div className="flex items-center font-bold text-2xl tracking-tight select-none">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 font-medium tracking-wide mr-1">
              Reviews
            </span>
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#FBBC05] text-xs">
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Main Title Section */}
        {isLoading ? (
          <div className="h-10 w-1/2 bg-[#222426]/60 animate-pulse rounded-xl mb-16" />
        ) : (
          <h2 className="text-3xl md:text-[40px] font-normal text-center mb-16 tracking-tight max-w-3xl">
            {title}
          </h2>
        )}

        {/* Grid Structure: Fixed Callout Card + Carousel Slider */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Static Intro Card with Modern Radial Glow Effect */}
          <div className="lg:col-span-4 bg-[#1e2022] rounded-[2rem] p-8 flex flex-col justify-between min-h-[340px] relative overflow-hidden group border border-gray-800/40">
            {/* Soft Radial Blue Mesh Gradient inside the box corner */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-tr from-blue-600/40 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

            <div className="relative z-10 flex flex-col gap-4">
              <h3 className="text-2xl font-bold tracking-tight">
                {subtitle}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs font-normal">
                {description}
              </p>
            </div>

            <Link 
              href={buttonLink}
              target={buttonNewTab ? "_blank" : "_self"}
              rel={buttonNewTab ? "noopener noreferrer" : undefined}
              className="relative z-10 w-fit bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3.5 rounded-full transition-all duration-200 active:scale-97 shadow-md shadow-blue-600/10 text-center"
            >
              Book intake session
            </Link>
          </div>

          {/* Dynamic Carousel Slide Viewport */}
          <div className="lg:col-span-8 overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 h-full">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] min-w-0"
                >
                  {/* Google Review Card Markup */}
                  <div className="bg-[#222426] border border-gray-800/30 rounded-[2rem] p-8 flex flex-col gap-5 h-full justify-between hover:border-gray-700/50 transition-colors duration-300">
                    <div>
                      {/* Top Row: Google G-Icon Asset & Star Rating */}
                      <div className="flex flex-col gap-3 mb-4">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-xs shadow-sm select-none">
                          <span className="text-[#4285F4]">G</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <span key={i} className="text-[#FBBC05] text-sm">
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Author Meta Details */}
                      <div className="mb-4">
                        <h4 className="text-base font-bold tracking-tight text-gray-100">
                          {review.author || review.clientName || "Anonymous"}
                        </h4>
                        <span className="text-xs text-gray-500 font-medium">
                          {review.date || review.createdAt
                            ? new Date(review.date || review.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>

                      {/* Actual Review Text Area */}
                      <p className="text-sm text-gray-300 leading-relaxed font-normal line-clamp-6">
                        {review.text || review.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestiMonial;
