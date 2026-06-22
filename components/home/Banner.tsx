'use client'

import Image from "next/image";
import Link from "next/link";
import { useHomepageContent } from "@/providers/HomepageContentProvider";

const Banner = () => {
  const { content, isLoading } = useHomepageContent();

  // Resolve hero image URL
  const heroImageUrl =
    content?.heroImageUrl ||
    content?.heroImage?.fileUrl ||
    null;

  // Resolve badge image URL
  const badgeImageUrl =
    content?.heroBadgeImageUrl ||
    content?.heroBadgeImage?.fileUrl ||
    null;

  const heroTitle = content?.heroTitle || "Medical Weight Management Program";
  const heroDescription =
    content?.heroDescription ||
    "Our medical weight management program is designed to support individuals seeking a structured, provider-guided approach to weight loss.";
  const heroButtonText = content?.heroButtonText || "Book an Appointment";
  const heroButtonLink = content?.heroButtonLink || "#";
  const heroButtonNewTab = content?.heroButtonNewTab ?? false;
  const heroBadgeText = content?.heroBadgeText || null;
  const heroBadgeLink = content?.heroBadgeLink || null;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
      {/* Badges/Avatars Area */}
      <div className="flex flex-col items-center gap-4 mb-8">
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={badgeImageUrl}
                    alt={heroBadgeText || "Badge"}
                    className="h-20 w-auto object-contain"
                  />
                  {heroBadgeText && (
                    <span className="text-white text-sm font-medium mt-1 block">
                      {heroBadgeText}
                    </span>
                  )}
                </Link>
              ) : (
                <div className="flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={badgeImageUrl}
                    alt={heroBadgeText || "Badge"}
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
        <div className="flex -space-x-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden"
            >
              <Image
                src={`/banner/avater/Ellipse ${n}.png`}
                alt="Avatar"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Heading */}
      {isLoading ? (
        <div className="h-16 w-2/3 bg-white/20 animate-pulse rounded-xl mb-6" />
      ) : (
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl tracking-tight leading-tight drop-shadow-lg">
          {heroTitle}
        </h1>
      )}

      {/* Description */}
      {isLoading ? (
        <div className="h-8 w-1/2 bg-white/20 animate-pulse rounded-xl mb-10" />
      ) : (
        <p className="text-base md:text-lg text-gray-200 mb-10 max-w-3xl leading-relaxed drop-shadow-md">
          {heroDescription}
        </p>
      )}

      {/* CTA Button */}
      {!isLoading && (
        <Link
          href={heroButtonLink}
          target={heroButtonNewTab ? "_blank" : "_self"}
          rel={heroButtonNewTab ? "noopener noreferrer" : undefined}
          className="bg-[#2563EB] hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-medium transition-colors text-lg shadow-lg"
        >
          {heroButtonText}
        </Link>
      )}

      {/* Hero override image (if server-provided, shown as an overlay within parent) */}
      {!isLoading && heroImageUrl && (
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImageUrl}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Banner;
