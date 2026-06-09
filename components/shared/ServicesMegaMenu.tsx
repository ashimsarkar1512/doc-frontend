"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export const SERVICE_CATEGORIES = [
  {
    id: "weight-loss",
    label: "Weight Loss",
    href: "/weight-loss",
    image: "/service.jpg",
    items: [
      "GLP-1 Medications",
      "Phentermine",
      "Phendimetrazine (Bontril)",
      "Diethylpropion",
      "B12 Injections",
      "Lipotropic Injections",
      "Vitamin C Ascorbic Acid",
      "Glutathione Intramuscular Injections",
      "B-Complex Intramuscular Injections",
      "Vitamin D Intramuscular Injections",
      "Hydroxocobalamin",
    ],
  },
  {
    id: "hormone-therapy",
    label: "Hormone Therapy",
    image: "/hormone-therapy.png",
    items: [
      "Testosterone Therapy",
      "Estrogen Therapy",
      "Thyroid Management",
      "Hormone Replacement",
    ],
  },
  {
    id: "anxiety-depression",
    label: "Anxiety & Depression",
    image: "/service.jpg",
    items: [
      "Anxiety Management",
      "Depression Treatment",
      "Stress Support",
      "Mood Evaluation",
    ],
  },
  {
    id: "sexual-health",
    label: "Sexual Health",
    image: "/mens-service.png",
    items: [
      "ED Treatment",
      "Testosterone Check",
      "Prostate Health",
      "Performance Support",
    ],
  },
  {
    id: "hair-care",
    label: "Hair care",
    image: "/regrow-hair.png",
    items: ["PRP Therapy", "Minoxidil", "Finasteride", "Hair Restoration"],
  },
  {
    id: "skin-care",
    label: "Skin Care",
    image: "/skin-services.png",
    items: ["Botox", "Dermal Fillers", "Chemical Peels", "Skin Rejuvenation"],
  },
  {
    id: "sleep",
    label: "Sleep",
    image: "/service.jpg",
    items: [
      "Sleep Evaluation",
      "Insomnia Support",
      "Sleep Hygiene Coaching",
    ],
  },
  {
    id: "supplements",
    label: "Supplements",
    image: "/medicine-4.png",
    items: [
      "Vitamin D Intramuscular Injections",
      "B-Complex Intramuscular Injections",
      "Vitamin C Ascorbic Acid",
      "B12 Injections",
    ],
  },
] as const;

type CategoryId = (typeof SERVICE_CATEGORIES)[number]["id"];

interface ServicesMegaMenuProps {
  activeCategoryId: CategoryId;
  onCategoryChange: (id: CategoryId) => void;
  variant?: "desktop" | "mobile";
}

const ServicesMegaMenu = ({
  activeCategoryId,
  onCategoryChange,
  variant = "desktop",
}: ServicesMegaMenuProps) => {
  const activeCategory =
    SERVICE_CATEGORIES.find((c) => c.id === activeCategoryId) ??
    SERVICE_CATEGORIES[0];

  const isDesktop = variant === "desktop";

  return (
    <div
      className={
        isDesktop
          ? "w-[920px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-120px)] bg-white rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.14)] p-8 text-black overflow-y-auto"
          : "w-full bg-white rounded-[20px] shadow-lg p-5 text-black max-h-[calc(100vh-120px)] overflow-y-auto"
      }
    >
      <h3
        className={`font-bold text-[#111827] tracking-tight ${
          isDesktop ? "text-[26px] mb-7" : "text-[20px] mb-5"
        }`}
      >
        Medical Weight Management Program
      </h3>

      <div
        className={
          isDesktop
            ? "grid grid-cols-[190px_minmax(0,1fr)_220px] gap-0 items-start"
            : "flex flex-col gap-5"
        }
      >
        {/* Category pills */}
        <div
          className={
            isDesktop
              ? "flex flex-col items-start gap-2.5 pr-6 border-r border-[#E5E7EB]"
              : "flex flex-wrap gap-2"
          }
        >
          {SERVICE_CATEGORIES.map((category) => {
            const isActive = category.id === activeCategoryId;

            if (category.id === "weight-loss" && "href" in category) {
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryChange(category.id);
                  }}
                  className={`rounded-full font-medium transition-colors whitespace-nowrap ${
                    isDesktop ? "px-5 py-2 text-[14px]" : "px-4 py-2 text-[13px]"
                  } ${
                    isActive
                      ? "bg-[#2b5ce7] text-white"
                      : "bg-[#E8E8E8] text-[#4B5563] hover:bg-[#DDDDDD]"
                  }`}
                >
                  {category.label}
                </Link>
              );
            }

            return (
              <button
                key={category.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCategoryChange(category.id);
                }}
                className={`rounded-full font-medium transition-colors whitespace-nowrap ${
                  isDesktop ? "px-5 py-2 text-[14px]" : "px-4 py-2 text-[13px]"
                } ${
                  isActive
                    ? "bg-[#2b5ce7] text-white"
                    : "bg-[#E8E8E8] text-[#4B5563] hover:bg-[#DDDDDD]"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Service list */}
        <div
          className={
            isDesktop
              ? "px-8 min-h-[300px]"
              : "order-3"
          }
        >
          <ul className="space-y-3.5">
            {activeCategory.items.map((item) => (
              <li
                key={item}
                className={`text-[#374151] leading-snug ${
                  isDesktop ? "text-[15px]" : "text-[14px]"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Image */}
        <div
          className={
            isDesktop
              ? "relative w-full h-[280px] rounded-[18px] overflow-hidden flex items-center justify-center bg-gray-50"
              : "relative w-full h-[180px] rounded-[16px] overflow-hidden order-2 flex items-center justify-center bg-gray-50"
          }
        >
          <Image
            src="/doctor/doc-1.jpg"
            alt={activeCategory.label}
            fill
            className="object-cover object-center"
            sizes={isDesktop ? "220px" : "100vw"}
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesMegaMenu;
