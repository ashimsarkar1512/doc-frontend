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
    <section className="w-full max-w-[1520px] mx-auto px-4 pt-[70px] pb-[70px] flex flex-col items-center font-sans">
      {/* Top Badge */}
      <span
        className="bg-gray-100 rounded-full mb-[50px] px-[32px] py-2 inline-block"
        style={{
          color: "#272628",
          fontFamily: "Quicksand, sans-serif",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "150%"
        }}
      >
        {subtitle}
      </span>

      {/* Main Header / Value Proposition */}
      {isLoading ? (
        <div className="h-16 w-3/4 bg-gray-100 animate-pulse rounded-xl mb-[50px]" />
      ) : title ? (
        <ScrollRevealText
          text={`${title} ${description}`}
          className="text-center max-w-[1236px] w-full text-lg font-semibold md:text-4xl lg:text-5xl leading-snug tracking-tight mb-[50px]"
        />
      ) : (
        <ScrollRevealText
          text="Weight Loss MD was built by a team of physicians and technologists who knew there had to be a better way. By leveraging secure telehealth technology  ok"
          className="text-center max-w-[1236px] w-full text-3xl md:text-4xl lg:text-[40px] font-normal text-gray-900 leading-snug tracking-tight mb-[50px]"
        />
      )}

      {/* Services Grid */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-[29px] w-full px-0 lg:px-[80px] mb-[80px] self-stretch">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex-1 w-full bg-[#F4F8FF] rounded-2xl p-[30px] flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-all duration-300 h-[172px]"
          >
            <div className="flex items-center justify-center">
              {service.icon}
            </div>
            <span
              className="uppercase"
              style={{
                color: "#2B2922",
                fontFamily: "Quicksand, sans-serif",
                fontSize: "22px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "150%"
              }}
            >
              {service.title}
            </span>
          </div>
        ))}

        {/* CTA Card */}
        <div className="flex-1 w-full bg-[#F4F8FF] rounded-2xl p-[30px] flex flex-col items-center justify-center text-center gap-4 hover:shadow-md transition-all duration-300 h-[172px]">
          <span
            style={{
              color: "#2B2922",
              fontFamily: "Quicksand, sans-serif",
              fontSize: "22px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "150%"
            }}
          >
            20+ More Services
          </span>
          <Link
            href={content?.aboutButtonLink || "#"}
            target={content?.aboutButtonNewTab ? "_blank" : "_self"}
            rel={
              content?.aboutButtonNewTab ? "noopener noreferrer" : undefined
            }
            className="flex justify-center items-center gap-[15px] bg-[#1D4ED8] hover:bg-blue-800 px-[26px] py-[18px] rounded-[46px] transition-colors duration-200"
            style={{
              color: "#FFF",
              textAlign: "center",
              fontFamily: "Quicksand, sans-serif",
              fontSize: "22px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "100%"
            }}
          >
            {content?.aboutButtonText || "Learn More"}
          </Link>
        </div>
      </div>

      {/* Video/Media Banner */}
      <div className="w-full relative group overflow-hidden rounded-2xl self-stretch h-[577px]">
        {content?.aboutMedia?.fileType?.startsWith("image/") ? (
          <img
            src={content.aboutMedia.fileUrl}
            alt="About Us"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            style={{
              clipPath:
                "polygon(0 0, 50% 4%, 100% 0, 100% 100%, 50% 96%, 0 100%)",
            }}
          />
        ) : (
          <video
            key={content?.aboutMedia?.fileUrl || "default-video"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
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
