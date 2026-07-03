"use client";

import { FilterButtonProps, PaginationButtonProps } from "@/types";
import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, RotateCcw } from "lucide-react";
import {
  useGetCategoriesNamesQuery,
  useGetCategoriesQuery,
  type Assessment,
} from "@/Redux/features/patient/assesmentcategory";
import { useHomepageContent } from "@/providers/HomepageContentProvider";

//  Constants

const GRADIENTS = [
  "from-stone-900 via-amber-950 to-stone-900",
  "from-slate-900 via-teal-950 to-slate-900",
  "from-stone-900 via-orange-950 to-stone-900",
  "from-slate-900 via-blue-950 to-slate-900",
  "from-stone-900 via-yellow-950 to-stone-900",
  "from-zinc-900 via-rose-950 to-zinc-900",
  "from-slate-900 via-indigo-950 to-slate-900",
  "from-stone-900 via-red-950 to-stone-900",
];

const PAGE_SIZE = 4;

// Icons (memoized for performance)
const Icons = {
  ChevronLeft: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

// Sub-components

const FilterButton = ({ label, isActive, onClick }: FilterButtonProps) => (
  <button
    onClick={onClick}
    className={`
      flex justify-center items-center gap-[15px] px-[32px] py-[9px] rounded-full transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      ${isActive
        ? "bg-[#2563EB] shadow-md shadow-blue-500/20"
        : "bg-[#E6E6E6] hover:bg-gray-300"
      }
    `}
    style={{
      fontFamily: "Quicksand, sans-serif",
      fontSize: "20px",
      fontStyle: "normal",
      fontWeight: 600,
      lineHeight: "150%",
      color: isActive ? "#FFF" : "#272628"
    }}
    aria-pressed={isActive}
  >
    {label}
  </button>
);

const AssessmentCard = ({
  assessment,
  index,
}: {
  assessment: Assessment;
  index: number;
}) => (
  <div
    className={`
    group relative overflow-hidden rounded-[30px] h-[390px] max-h-[430px] flex-1
    bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}
    flex flex-col cursor-pointer
    transition-all duration-500 ease-out
    hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1
    border border-white/10
  `}
  >
    {/* Background image — full card using Next.js Image for optimized loading */}
    {assessment.thumbnail && (
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={assessment.thumbnail}
          alt={assessment.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    )}

    {/* Dark overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/85 z-10" />

    {/* Content */}
    <div className="relative z-20 flex flex-col justify-between items-start h-full p-[30px] w-full">
      {/* Fees badge */}
      {assessment.paymentPlan && (
        <div className="self-start mb-3">
          <span className="bg-white/20 backdrop-blur-md text-white text-sm font-normal px-4 py-1.5 rounded-full border border-white/20">
            Fees:{" "}
            <span className="font-bold">${assessment.paymentPlan.price}</span>/
            {assessment.paymentPlan.billingCycle === "MONTHLY"
              ? "m"
              : assessment.paymentPlan.billingCycle.toLowerCase()}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 style={{ color: "#FFF", fontFamily: "Quicksand, sans-serif", fontSize: "26px", fontWeight: 700, lineHeight: "150%" }} className="capitalize">
        {assessment.title.replace(/-/g, " ")}
      </h3>

      <div className="flex-1 w-full" />

      {/* Description */}
      <p style={{ color: "#FFF", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 400, lineHeight: "25.2px" }} className="mb-[28px] line-clamp-3 w-full">
        {assessment.description}
      </p>

      {/* Button — visible on hover */}
      <Link
        href={`/assessment/${assessment.id}`}
        prefetch={true}
        onClick={(e) => e.stopPropagation()}
        className="
          flex justify-center items-center gap-[15px] self-start
          opacity-0 translate-y-2
          group-hover:opacity-100 group-hover:translate-y-0
          bg-[#1D4ED8] hover:bg-blue-800 active:scale-95
          text-white text-[15px] font-medium
          px-[32px] py-[16px] rounded-[46px] shadow-lg text-center
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-blue-400
        "
      >
        Start Assessment
      </Link>
    </div>
  </div>
);

const PaginationButton = ({
  onClick,
  disabled,
  children,
  ariaLabel,
}: PaginationButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="
      w-10 h-10 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm
      flex items-center justify-center text-gray-600
      hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md
      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/80
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    "
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

//  Main Component

export default function Assessments() {
  const { content } = useHomepageContent();
  const [activeFilter, setActiveFilter] = useState<string | undefined>(
    undefined,
  );

  const [currentPage, setCurrentPage] = useState(0);

  // Auto-scroll to this section when navigated via /#assessments
  useEffect(() => {
    if (window.location.hash === "#assessments") {
      const el = document.getElementById("assessments");
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          100,
        );
      }
    }
  }, []);

  const { data: categoryNamesData } = useGetCategoriesNamesQuery();
  const { data: categoriesData, isLoading } =
    useGetCategoriesQuery(activeFilter);

  const filters = useMemo(() => {
    const names = categoryNamesData?.data?.map((c) => c.name) ?? [];
    return ["All", ...names];
  }, [categoryNamesData]);

  // Flatten all assessments from all categories — inject paymentPlan from category
  const allCards = useMemo(() => {
    return (
      categoriesData?.data?.flatMap((cat) =>
        cat.assessments.map((a) => ({ ...a, paymentPlan: cat.paymentPlan })),
      ) ?? []
    );
  }, [categoriesData]);

  const { totalPages, visibleCards } = useMemo(() => {
    const total = Math.ceil(allCards.length / PAGE_SIZE);
    const start = currentPage * PAGE_SIZE;
    const visible = allCards.slice(start, start + PAGE_SIZE);
    return { totalPages: total, visibleCards: visible };
  }, [allCards, currentPage]);

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter === "All" ? undefined : filter);
    setCurrentPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    // Optional: scroll to top of cards section
    document
      .querySelector(".cards-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) handlePageChange(currentPage - 1);
  }, [currentPage, handlePageChange]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) handlePageChange(currentPage + 1);
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <section
      id="assessments"
      className="bg-gradient-to-b from-white via-gray-50 to-white pt-[100px] pb-[100px] px-6"
    >
      <div className="max-w-[1520px] mx-auto">
        {/* Header with modern gradient text */}
        <div className="text-center mb-[80px]">
          <h2 style={{
            color: "#272628",
            textAlign: "center",
            fontFamily: "Quicksand, sans-serif",
            fontSize: "54px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "110%"
          }} className="mb-[20px]">
            {content?.assessmentTitle || "Start from a tailored assessment"}
          </h2>
          <p style={{
            color: "#272628",
            textAlign: "center",
            fontFamily: "Quicksand, sans-serif",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "150%"
          }} className="max-w-5xl mx-auto">
            {content?.assessmentDescription ||
              "Comprehensive care for a wide range of everyday conditions, managed safely from home."}
          </p>
        </div>

        {/* Filters with scroll into view on filter change */}
        <div className="flex flex-wrap justify-start gap-3 mb-[40px]">
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              label={filter}
              isActive={
                activeFilter === (filter === "All" ? undefined : filter)
              }
              onClick={() => handleFilterChange(filter)}
            />
          ))}
        </div>

        {/* Cards Grid */}
        <div
          className={`cards-grid gap-[30px] ${visibleCards.length > 0 && visibleCards.length < 4
              ? "flex flex-wrap justify-start"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            }`}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-2xl bg-gray-200 animate-pulse w-full"
              />
            ))
            : visibleCards.map((assessment, i) => (
              <div
                key={assessment.id}
                className={
                  visibleCards.length > 0 && visibleCards.length < 4
                    ? "w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                    : ""
                }
              >
                <AssessmentCard
                  assessment={assessment}
                  index={currentPage * PAGE_SIZE + i}
                />
              </div>
            ))}
        </div>

        {/* Empty State */}
        {visibleCards.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Search className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No assessments found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
              {activeFilter ? (
                <>
                  We couldn't find any assessments matching the{" "}
                  <span className="font-semibold text-blue-600">
                    "{activeFilter}"
                  </span>{" "}
                  category at the moment.
                </>
              ) : (
                "There are currently no assessments available. Please check back later."
              )}
            </p>
            {activeFilter && (
              <button
                onClick={() => handleFilterChange("All")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95 group"
              >
                <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-[-45deg]" />
                View all assessments
              </button>
            )}
          </div>
        )}

        {/* Pagination with page indicator */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-[40px]">
            <PaginationButton
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              ariaLabel="Previous page"
            >
              <Icons.ChevronLeft />
            </PaginationButton>

            {/* <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Smart pagination - show pages around current
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (currentPage < 3) {
                  pageNum = i;
                } else if (currentPage > totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                if (pageNum >= 0 && pageNum < totalPages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`
                        w-10 h-10 rounded-full text-sm font-medium transition-all duration-200
                        ${currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600"
                        }
                      `}
                    >
                      {pageNum + 1}
                    </button>
                  );
                }
                return null;
              })}
            </div> */}

            <PaginationButton
              onClick={goToNextPage}
              disabled={currentPage >= totalPages - 1}
              ariaLabel="Next page"
            >
              <Icons.ChevronRight />
            </PaginationButton>
          </div>
        )}
      </div>

      {/* Add custom CSS for radial gradient (since Tailwind doesn't have it by default) */}
      <style jsx>{`
        .bg-gradient-radial {
          background-image: radial-gradient(
            ellipse at 30% 20%,
            var(--tw-gradient-stops)
          );
        }
      `}</style>
    </section>
  );
}
