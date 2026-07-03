"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetCategoryNamesQuery } from "@/Redux/features/navbarServices/navbarServicesApi";
import Link from "next/link";
import Image from "next/image";

interface AssessmentItem {
  id: string;
  title: string;
  image: string;
}

interface CategoryItem {
  id: string;
  name: string;
  assessments: AssessmentItem[];
}

interface ServicesMegaMenuProps {
  variant?: "desktop" | "mobile";
}

const ServicesMegaMenu = ({ variant = "desktop" }: ServicesMegaMenuProps) => {
  const router = useRouter();

  // ✅ category names list with assessments
  const { data: categoriesRes } = useGetCategoryNamesQuery({});
  const categoryList: CategoryItem[] = categoriesRes?.data ?? [];

  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [hoveredAssessmentId, setHoveredAssessmentId] = useState<string | null>(null);

  const currentCategoryId = hoveredCategoryId ?? categoryList[0]?.id ?? null;
  const activeCategory = categoryList.find(c => c.id === currentCategoryId);
  const assessments = activeCategory?.assessments || [];

  const handleCategoryHover = (id: string) => {
    setHoveredCategoryId(id);
    setHoveredAssessmentId(null); // reset assessment hover on category change
  };

  const isDesktop = variant === "desktop";

  // Determine which image to show
  const activeAssessmentImage = hoveredAssessmentId 
    ? assessments.find(a => a.id === hoveredAssessmentId)?.image 
    : assessments[0]?.image;

  return (
    <div
      className={
        isDesktop
          ? "w-[920px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-120px)] bg-white rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.14)] p-8 text-black overflow-y-auto"
          : "w-full bg-white rounded-[20px] shadow-lg p-5 text-black max-h-[calc(100vh-120px)] overflow-y-auto"
      }
    >
      <h3
        style={{
          color: '#272628',
          fontFamily: 'Quicksand, sans-serif',
          fontSize: isDesktop ? '30px' : '22px',
          fontWeight: 700,
          lineHeight: '110%',
          textAlign: 'left',
          marginBottom: isDesktop ? '28px' : '20px',
        }}
      >
        Medical Weight Management Program
      </h3>

      <div
        className={
          isDesktop
            ? "grid grid-cols-[210px_minmax(0,1fr)_250px] gap-0 items-start"
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
          {categoryList.map((category) => {
            const isActive = category.id === currentCategoryId;

            return (
              <Link
                key={category.id}
                href={`/common-services/${category.id}`}
                onMouseEnter={() => handleCategoryHover(category.id)}
                className={`rounded-full font-medium transition-colors whitespace-nowrap ${
                  isDesktop ? "px-5 py-2 text-[14px]" : "px-4 py-2 text-[13px]"
                } ${
                  isActive
                    ? "bg-[#2b5ce7] text-white"
                    : "bg-[#E8E8E8] text-[#4B5563] hover:bg-[#DDDDDD]"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>

        {/* Assessment list — middle column */}
        <div className={isDesktop ? "px-8 min-h-[300px]" : "order-3"}>
          {assessments.length === 0 ? (
            <p className="text-[#9CA3AF] text-[14px]">No assessments found</p>
          ) : (
            <ul className="space-y-4">
              {assessments.map((assessment) => {
                const isActive = hoveredAssessmentId === assessment.id || (!hoveredAssessmentId && assessments[0]?.id === assessment.id);
                return (
                  <li
                    key={assessment.id}
                    onMouseEnter={() => setHoveredAssessmentId(assessment.id)}
                    style={{
                      color: isActive ? '#2b5ce7' : '#2B2922',
                      fontFamily: 'Quicksand, sans-serif',
                      fontSize: '16px',
                      fontWeight: isActive ? 600 : 400,
                      lineHeight: '100%',
                      cursor: 'pointer',
                      transition: 'color 0.15s',
                    }}
                  >
                    <Link href={`/common-services/${activeCategory?.id}?assessment=${assessment.id}`}>
                      {assessment.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Image — right column */}
        <div
          className={
            isDesktop
              ? "relative w-[228px] h-[155px] rounded-[16px] overflow-hidden flex-shrink-0 bg-gray-100"
              : "relative w-full h-[155px] rounded-[16px] overflow-hidden order-2 bg-gray-100"
          }
        >
          {activeAssessmentImage ? (
            <Image
              src={activeAssessmentImage}
              alt={activeCategory?.name ?? "Assessment"}
              fill
              className="object-cover object-center"
              sizes={isDesktop ? "228px" : "100vw"}
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesMegaMenu;
