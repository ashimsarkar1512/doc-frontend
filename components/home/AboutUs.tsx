"use client";

import React from "react";
import Link from "next/link";
import { useHomepageContent } from "@/providers/HomepageContentProvider";

const services = [
  {
    id: "hormone",
    title: "HORMONE THERAPY",
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
        />
      </svg>
    ),
  },
  {
    id: "coolsculpting",
    title: "COOLSCULPTING®",
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499c.105-.183.303-.299.52-.299s.416.116.52.299l2.14 3.706a.75.75 0 0 1-.214.992l-3.11 1.794a.75.75 0 0 1-.744 0l-3.11-1.794a.75.75 0 0 1-.214-.992l2.14-3.706Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14.25a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
        />
      </svg>
    ),
  },
  {
    id: "weightloss",
    title: "WEIGHT LOSS",
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M20.25 7.5V6A2.25 2.25 0 0 0 18 3.75h-1.5M3.75 16.5V18a2.25 2.25 0 0 0 2.25 2.25h1.5m9 0H18A2.25 2.25 0 0 0 20.25 18v-1.5M9 12h6m-6-3h6m-6 6h6"
        />
      </svg>
    ),
  },
];

const AboutUs = () => {
  const { content, isLoading } = useHomepageContent();

  const subtitle = content?.aboutSubtitle || "About us ";
  const title = content?.aboutTitle || null;
  const description = content?.aboutDescription || null;
  const bullets = content?.aboutBullets ?? [];

  const primaryButtonText = content?.aboutPrimaryButtonText || "Comming soon ";
  // console.log(primaryButtonText)
  const primaryButtonLink = content?.aboutPrimaryButtonLink || "#";
  const primaryButtonNewTab = content?.aboutPrimaryButtonNewTab ?? false;

  const secondaryButtonText = content?.aboutSecondaryButtonText || null;
  // console.log(secondaryButtonText);
  const secondaryButtonLink = content?.aboutSecondaryButtonLink || "#";
  // const secondaryButtonNewTab = content?.aboutSecondaryButtonNewTab ?? false;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center font-sans">
      {/* Top Badge */}
      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide">
        {subtitle}
      </span>

      {/* Main Header / Value Proposition */}
      {isLoading ? (
        <div className="h-16 w-3/4 bg-gray-100 animate-pulse rounded-xl mb-12" />
      ) : title ? (
        <h2 className="text-center max-w-4xl text-3xl md:text-4xl lg:text-[40px] font-normal text-gray-900 leading-snug tracking-tight mb-12">
          {title}
        </h2>
      ) : (
        <h2 className="text-center max-w-4xl text-3xl md:text-4xl lg:text-[40px] font-normal text-gray-900 leading-snug tracking-tight mb-12">
          Weight Loss MD was built by a team of physicians and technologists who
          knew there had to be a better way.{" "}
          <span className="text-gray-400">
            By leveraging secure telehealth technology, we&apos;ve created a
            clinic that lives on your schedule, not ours.
          </span>
        </h2>
      )}

      {/* Description */}
      {description && (
        <p className="text-center text-gray-500 text-base max-w-2xl mb-10 leading-relaxed">
          {description}
        </p>
      )}

      {/* Bullets */}
      {bullets.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-3 mb-10">
          {bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full"
            >
              <svg
                className="w-4 h-4 text-blue-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-16">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-blue-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 border border-blue-50/20 hover:shadow-sm transition-all duration-300 min-h-[140px]"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm">
              {service.icon}
            </div>
            <span className="text-xs font-bold text-gray-800 tracking-wider">
              {service.title}
            </span>
          </div>
        ))}

        {/* CTA Card */}
        <div className="bg-blue-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 border border-blue-50/20 min-h-[140px]">
          <span className="text-sm font-semibold text-gray-800">
            20+ More Services
          </span>
          <div className="flex flex-col gap-2 w-full items-center">
            <Link
              href={primaryButtonLink}
              target={primaryButtonNewTab ? "_blank" : "_self"}
              rel={primaryButtonNewTab ? "noopener noreferrer" : undefined}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-full transition-colors duration-200 shadow-md shadow-blue-600/10 active:scale-98"
            >
              {primaryButtonText}
            </Link>
            {secondaryButtonText && (
              <Link
                // href={secondaryButtonLink}
                // target={secondaryButtonNewTab ? "_blank" : "_self"}
                // rel={secondaryButtonNewTab ? "noopener noreferrer" : undefined}
                href={secondaryButtonLink || "#"}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                className="text-blue-600 hover:underline font-medium text-sm"
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Video Banner */}
      <div className="w-full relative group overflow-hidden rounded-2xl">
        <video
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
          <source src="/aboutUs.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

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
