"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useHomepageContent } from "@/providers/HomepageContentProvider";
import { motion } from "framer-motion";

const Banner = () => {
  const { content, isLoading } = useHomepageContent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Resolve hero image URL
  const heroImageUrl = mounted ? (content?.heroMedia?.fileUrl || null) : null;

  // Resolve badge image URL
  const badgeImageUrl = mounted ? (content?.heroBadgeImage?.fileUrl || null) : null;

  const heroTitle = mounted ? (content?.heroTitle || "Medical Weight Management Program") : "Medical Weight Management Program";
  const heroDescription = mounted ? (content?.heroDescription || "Our medical weight management program is designed to support individuals seeking a structured, provider-guided approach to weight loss.") : "Our medical weight management program is designed to support individuals seeking a structured, provider-guided approach to weight loss.";
  const heroButtonText = mounted ? (content?.heroButtonText || "Book an Appointment") : "Book an Appointment";
  const heroButtonLink = mounted ? (content?.heroButtonLink || "#") : "#";
  const heroButtonNewTab = mounted ? (content?.heroButtonNewTab ?? false) : false;
  const heroBadgeText = mounted ? (content?.heroBadgeText || null) : null;
  const heroBadgeLink = mounted ? (content?.heroBadgeLink || null) : null;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center self-stretch w-full px-4 pt-[140px] pb-16 md:pt-[180px] md:pb-24 lg:h-[905px] lg:pt-[80px] lg:pb-0">
      {/* Animated Container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.4, // Stagger the appearance of children
            },
          },
        }}
        className="flex flex-col items-center w-full"
      >
        {/* Badges/Avatars Area */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="flex flex-col items-center gap-[26.67px] mb-[47px]"
        >
          {/* Badge Image or Default Wreath Badge */}
          {!isLoading && (
            <div className="relative mb-2 flex items-center justify-center gap-1">
              {badgeImageUrl ? (
                heroBadgeLink ? (
                  <Link
                    href={heroBadgeLink}
                    target={content?.heroButtonNewTab ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={badgeImageUrl}
                      alt={heroBadgeText || "Badge"}
                      width={200}
                      height={80}
                      className="h-20 w-auto object-contain"
                    />
                    {heroBadgeText && (
                      <span className="text-white text-sm font-medium mt-1 block bg-blur">
                        {heroBadgeText}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div className="flex flex-col items-center">
                    <Image
                      src={badgeImageUrl}
                      alt={heroBadgeText || "Badge"}
                      width={200}
                      height={80}
                      className="h-20 w-auto object-contain"
                    />
                    {heroBadgeText && (
                      <span className="text-white text-sm font-medium mt-1">
                        {heroBadgeText}
                      </span>
                    )}
                  </div>
                )
              ) : (
                <>
                  <Image
                    src="/banner/badge/Vector.png"
                    alt="Wreath Left"
                    width={40}
                    height={20}
                    className="object-contain"
                    style={{ width: "auto", height: "auto" }}
                  />
                  <div className="relative">
                    <Image
                      src="/banner/badge/13220301 1.png"
                      alt="LegitScript Certified"
                      width={80}
                      height={80}
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <Image
                    src="/banner/badge/Vector (2).png"
                    alt="Wreath Right"
                    width={40}
                    height={20}
                    className="object-contain"
                    style={{ width: "auto", height: "auto" }}
                  />
                </>
              )}
            </div>
          )}

          {/* Avatars */}
          {!isLoading && !badgeImageUrl && (
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="relative w-10 h-10 rounded-full overflow-hidden shadow-md"
                >
                  <Image
                    src={`/banner/avater/Ellipse ${n}.png`}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Heading */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="w-full flex justify-center"
        >
          {isLoading ? (
            <div className="h-16 w-2/3 bg-white/20 animate-pulse rounded-xl mb-6" />
          ) : (
            <h1
              className="mb-[50px] max-w-[1112px] mx-auto drop-shadow-lg text-[40px] sm:text-[50px] md:text-[60px] lg:text-[70px] xl:text-[84px] font-bold leading-none"
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Quicksand, sans-serif",
              }}
            >
              {heroTitle}
            </h1>
          )}
        </motion.div>

        {/* Description */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="w-full flex justify-center"
        >
          {isLoading ? (
            <div className="h-8 w-1/2 bg-white/20 animate-pulse rounded-xl mb-10" />
          ) : (
            <p
              className="mb-[50px] max-w-[796px] mx-auto drop-shadow-md text-[16px] md:text-[18px] xl:text-[20px] font-normal leading-relaxed"
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Quicksand, sans-serif",
              }}
            >
              {heroDescription}
            </p>
          )}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          {!isLoading && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={heroButtonLink}
                target={heroButtonNewTab ? "_blank" : "_self"}
                rel={heroButtonNewTab ? "noopener noreferrer" : undefined}
                className="flex justify-center items-center gap-[15px] px-[32px] py-[22px] rounded-[46px] bg-[#1D4ED8] hover:bg-blue-800 transition-colors shadow-lg"
                style={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Quicksand, sans-serif",
                  fontSize: "22px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "100%",
                }}
              >
                {heroButtonText}
              </Link>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

    </div>
  );
};

export default Banner;
