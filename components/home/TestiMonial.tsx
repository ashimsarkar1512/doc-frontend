"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useHomepageContent } from "@/providers/HomepageContentProvider";
import {
  Testimonial,
  useGetTestimonialsQuery,
} from "@/Redux/features/testimonials/testimonialsApi";
import { FcGoogle } from "react-icons/fc";
import { IoStarSharp } from "react-icons/io5";
const TestiMonial: React.FC = () => {
  const { content, isLoading } = useHomepageContent();
  const { data: testimonialsData } = useGetTestimonialsQuery();

  const dummyReviews: Testimonial[] = [
    {
      id: "d1",
      author: "Sarah M.",
      feedback:
        "I lost 25 lbs in 3 months! The process was so easy and the doctors were amazing.",
      rating: 5,
      createdAt: "2023-10-01T00:00:00Z",
    },
    {
      id: "d2",
      author: "James K.",
      feedback:
        "Finally a weight loss program that actually works. The continuous support makes all the difference.",
      rating: 5,
      createdAt: "2023-09-28T00:00:00Z",
    },
    {
      id: "d3",
      author: "Elena R.",
      feedback:
        "The personalized plan and medications helped me break through my plateau. Highly recommended!",
      rating: 5,
      createdAt: "2023-09-15T00:00:00Z",
    },
    {
      id: "d4",
      author: "Michael B.",
      feedback:
        "I feel 10 years younger. My energy levels are up and I've reached my goal weight.",
      rating: 5,
      createdAt: "2023-08-30T00:00:00Z",
    },
  ];

  const reviews = testimonialsData?.data?.length
    ? testimonialsData.data
    : dummyReviews;

  const title =
    content?.testimonialTitle || "Read from Hundreds of success stories";
  const subtitle = content?.testimonialCardTitle || "Client's Testimonial";
  const description =
    content?.testimonialCardDescription ||
    "See how Weight Loss MD has helped people feel stronger, healthier, and more balanced.";
  const buttonLink = content?.testimonialButtonLink || "#";
  const buttonNewTab = content?.testimonialButtonNewTab ?? false;

  return (
    <section className="w-full bg-[#121314] py-10 font-sans overflow-hidden text-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center px-4 md:px-8">
        {/* Google Header Logo & Stars Group */}
        <div className="flex flex-col items-center gap-1 mb-4">
          <div className="flex items-center font-bold text-5xl tracking-tight select-none">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg text-gray-400 font-bold tracking-wide mr-1">
              Reviews
            </span>
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#FFA64D] text-xl">
                <IoStarSharp />
              </span>
            ))}
          </div>
        </div>

        {/* Main Title Section */}
        {isLoading ? (
          <div className="h-10 w-1/2 bg-[#222426]/60 animate-pulse rounded-xl mb-16" />
        ) : (
          <h2 className="text-4xl md:text-[40px] font-semibold text-center mb-16 tracking-tight max-w-3xl">
            {title}
          </h2>
        )}

        {/* Grid Structure: Fixed Callout Card + Carousel Slider */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Static Intro Card with Modern Radial Glow Effect */}
          <div className="lg:col-span-4 bg-[#292C2D] rounded-[2rem] p-8 flex flex-col justify-between min-h-[340px] relative overflow-hidden group border border-gray-800/40">
            {/* Soft Radial Blue Mesh Gradient inside the box corner */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-tr from-blue-600 via-blue-500/90 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

            <div className="relative z-10 flex flex-col gap-4">
              <h3 className="text-2xl font-bold tracking-tight">{subtitle}</h3>
              <p className="text-lg text-[#FFFFFF] leading-relaxed max-w-xs font-normal">
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
          <div className="lg:col-span-8 overflow-hidden relative w-full flex items-center">
            {/* Gradient masks for smooth edges */}
           
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#121314] to-transparent z-10"></div>

            <motion.div
              className="flex gap-5 h-full min-w-max"
              animate={{ x: ["0%", "-40%"] }}
              transition={{
                duration: reviews.length * 5,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[...reviews, ...reviews].map((review, idx) => (
                <div
                  key={`${review.id}-${idx}`}
                  className="w-[320px] sm:w-[400px] flex-shrink-0"
                >
                  {/* Google Review Card Markup */}
                  <div className="bg-[#292C2D] border border-gray-800/30 rounded-[2rem] p-6 sm:p-8 flex flex-col gap-5 h-[450px] sm:h-[500px] w-full justify-between hover:border-gray-700/50 transition-colors duration-300 ">
                    <div>
                      {/* Top Row: Google G-Icon Asset & Star Rating */}
                      <div className="flex flex-col gap-3 mb-4">
                        <div className="w-10.5 h-10.5 rounded-full bg-[#383C3D] flex items-center justify-center font-bold text-xs shadow-sm select-none">
                          <span className="text-[#4285F4]">
                            <FcGoogle size={30} />
                          </span>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <span key={i} className="text-[#FBBC05] text-lg">
                              <IoStarSharp />
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Author Meta Details */}
                      <div className="mb-4">
                        <h4 className=" text-lg font-bold tracking-tight text-gray-100">
                          {review.author || review.clientName || "Anonymous"}
                        </h4>
                        <span className="text-sm text-[#929292] font-medium">
                          {review.date || review.createdAt
                            ? new Date(
                                review.date || review.createdAt,
                              ).toLocaleDateString()
                            : ""}
                        </span>
                      </div>

                      {/* Actual Review Text Area */}
                      <p className="text-lg text-[#FFFFFF] leading-relaxed font-normal line-clamp-6">
                        {review.feedback || review.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestiMonial;
