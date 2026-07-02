"use client";

import { useHomepageContent } from "@/providers/HomepageContentProvider";
import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollRevealText } from "../shared/ScrollRevealText";
import { Dna, Dumbbell, Sparkles } from "lucide-react";

const services = [
  {
    id: "hormone",
    title: "HORMONE THERAPY",
    icon: <Dna className="w-10 h-10 text-[#1D4ED8]" />
  },
  {
    id: "coolsculpting",
    title: "COOLSCULPTING®",
    icon: <Sparkles className="w-10 h-10 text-[#1D4ED8]" />
  },
  {
    id: "weightloss",
    title: "WEIGHT LOSS",
    icon: <Dumbbell className="w-10 h-10 text-[#1D4ED8]" />
  },
];

const AboutUs = () => {
  const { content, isLoading } = useHomepageContent();

  const subtitle = "About us";
  const title = content?.aboutTitle || null;
  const description = content?.aboutDescription || null;
  const bullets: string[] = [];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-5 flex flex-col items-center font-sans">
      {/* Top Badge */}
      <span className="bg-gray-100 text-gray-600 text-lg font-bold px-4 py-1.5 rounded-full mb-8 tracking-wide">
        {subtitle}
      </span>

      {/* Main Header / Value Proposition */}
      {isLoading ? (
        <div className="h-16 w-3/4 bg-gray-100 animate-pulse rounded-xl mb-12" />
      ) : title ? (
        <ScrollRevealText
          text={`${title} ${description}`}
          className="text-center max-w-7xl text-lg font-semibold md:text-4xl lg:text-5xl leading-snug tracking-tight mb-12"
        />
      ) : (
        <ScrollRevealText
          text="Weight Loss MD was built by a team of physicians and technologists who knew there had to be a better way. By leveraging secure telehealth technology  ok"
          className="text-center max-w-7xl text-3xl md:text-4xl lg:text-[40px] font-normal text-gray-900 leading-snug tracking-tight mb-12"
        />
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full mb-16">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-[#F4F8FF] rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-all duration-300 min-h-[130px] h-full"
          >
            <div className="flex items-center justify-center">
              {service.icon}
            </div>
            <span className="text-[13px] sm:text-[14px] font-semibold text-[#1F2937] tracking-wider uppercase">
              {service.title}
            </span>
          </div>
        ))}

        {/* CTA Card */}
        <div className="bg-[#F4F8FF] rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:shadow-md transition-all duration-300 min-h-[130px] h-full">
          <span className="text-[14px] font-semibold text-[#1F2937]">
            20+ More Services
          </span>
          <Link
            href={content?.aboutButtonLink || "#"}
            target={content?.aboutButtonNewTab ? "_blank" : "_self"}
            rel={
              content?.aboutButtonNewTab ? "noopener noreferrer" : undefined
            }
            className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-sm px-6 py-2 rounded-full transition-colors duration-200"
          >
            {content?.aboutButtonText || "Learn More"}
          </Link>
        </div>
      </div>

      {/* Video/Media Banner */}
      <div className="w-full relative group overflow-hidden rounded-2xl">
        {content?.aboutMedia?.fileType?.startsWith("image/") ? (
          <img
            src={content.aboutMedia.fileUrl}
            alt="About Us"
            className="w-full aspect-18/9 md:aspect-18/8 object-cover transition-transform duration-700 group-hover:scale-102"
            style={{
              clipPath:
                "polygon(0 0, 50% 4%, 100% 0, 100% 100%, 50% 96%, 0 100%)",
            }}
          />
        ) : (
          <video
            key={content?.aboutMedia?.fileUrl || "default-video"}
            className="w-full aspect-18/9 md:aspect-18/8 object-cover transition-transform duration-700 group-hover:scale-102"
            style={{
              clipPath:
                "polygon(0 0, 50% 4%, 100% 0, 100% 100%, 50% 96%, 0 100%)",
            }}
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src={content?.aboutMedia?.fileUrl || "/aboutUs.mp4"}
              type={content?.aboutMedia?.fileType || "video/mp4"}
            />
            Your browser does not support the video tag.
          </video>
        )}

        <div
          className="absolute inset-0 bg-black/5 pointer-events-none"
          style={{
            clipPath:
              "polygon(0 0, 50% 4%, 100% 0, 100% 100%, 50% 96%, 0 100%)",
          }}
        />
      </div>
    </section>
  );
};

export default AboutUs;
