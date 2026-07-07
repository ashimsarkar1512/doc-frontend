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
    <section className="w-full max-w-[1520px] mx-auto px-4 py-5 flex flex-col items-center font-sans">
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
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full lg:px-[80px] mb-16"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: "easeOut" } },
            }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#F4F8FF] rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:shadow-lg transition-all duration-300 min-h-[130px] h-full cursor-pointer"
          >
            <div className="flex items-center justify-center">
              {service.icon}
            </div>
            <span className="text-[13px] sm:text-[14px] font-semibold text-[#1F2937] tracking-wider uppercase">
              {service.title}
            </span>
          </motion.div>
        ))}

        {/* CTA Card */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: "easeOut" } },
          }}
          whileHover={{ scale: 1.05 }}
          className="bg-[#F4F8FF] rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 shadow-sm hover:shadow-lg transition-all duration-300 min-h-[130px] h-full"
        >
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
        </motion.div>
      </motion.div>

      {/* Video/Media Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full relative group overflow-hidden rounded-2xl shadow-xl"
      >
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
      </motion.div>
    </section>
  );
};

export default AboutUs;
