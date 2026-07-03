"use client";

import Image from "next/image";
import Link from "next/link";
import { useHomepageContent } from "@/providers/HomepageContentProvider";

const Banner = () => {
  const { content, isLoading } = useHomepageContent();

  // Resolve hero image URL
  const heroImageUrl = content?.heroMedia?.fileUrl || null;

  // Resolve badge image URL
  const badgeImageUrl = content?.heroBadgeImage?.fileUrl || null;

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
    <div className="relative z-10 flex flex-col items-center justify-center md:min-h-[90vh] text-center px-4 pt-32 pb-16 md:pt-20 md:pb-0">
      {/* Badges/Avatars Area */}
      <div className="flex flex-col items-center gap-4 mb-[80px]">
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
                className="relative w-10 h-10 rounded-full overflow-hidden"
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
      </div>

      {/* Heading */}
      {isLoading ? (
        <div className="h-16 w-2/3 bg-white/20 animate-pulse rounded-xl mb-6" />
      ) : (
        <h1 
          className="mb-[50px] max-w-[1112px] mx-auto drop-shadow-lg"
          style={{
            color: "#FFF",
            textAlign: "center",
            fontFamily: "Quicksand, sans-serif",
            fontSize: "84px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "100%"
          }}
        >
          {heroTitle}
        </h1>
      )}

      {/* Description */}
      {isLoading ? (
        <div className="h-8 w-1/2 bg-white/20 animate-pulse rounded-xl mb-10" />
      ) : (
        <p 
          className="mb-[50px] max-w-[796px] mx-auto drop-shadow-md"
          style={{
            color: "#FFF",
            textAlign: "center",
            fontFamily: "Quicksand, sans-serif",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "150%"
          }}
        >
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

    </div>
  );
};

export default Banner;
