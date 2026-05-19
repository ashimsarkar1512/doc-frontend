
'use client'

import { AssessmentCardProps, FilterButtonProps, PaginationButtonProps } from "@/types";
import { useState, useMemo, useCallback } from "react";

//  Constants 

const FILTERS = ["All", "Weight Loss", "Hormone Therapy", "Regrow Hair", "Men's Services", "Skin Services"];

const CARDS = [
  {
    id: 1,
    title: "Weight Loss",
    category: "Weight Loss",
    description: "Medically supervised weight management with GLP-1 prescriptions tailored to your body.",
    gradient: "from-stone-900 via-amber-950 to-stone-900",
  },
  {
    id: 2,
    title: "Individual Therapy",
    category: "Hormone Therapy",
    description: "Comprehensive evaluation of joint and muscle discomfort with custom rehab and pain management.",
    gradient: "from-slate-900 via-teal-950 to-slate-900",
  },
  {
    id: 3,
    title: "Anxiety & Stress",
    category: "Men's Services",
    description: "Expert support and tailored strategies for managing anxiety, stress, and improving well-being.",
    gradient: "from-stone-900 via-orange-950 to-stone-900",
  },
  {
    id: 4,
    title: "Clarity Consult",
    category: "Skin Services",
    description: "Effective treatments for various skin issues such as acne, rashes, and eczema using Rx.",
    gradient: "from-slate-900 via-blue-950 to-slate-900",
  },
  {
    id: 5,
    title: "Hair Restoration",
    category: "Regrow Hair",
    description: "Clinically proven treatments to restore thinning hair and promote lasting regrowth.",
    gradient: "from-stone-900 via-yellow-950 to-stone-900",
  },
  {
    id: 6,
    title: "Hormone Balance",
    category: "Hormone Therapy",
    description: "Personalized hormone replacement therapy to restore vitality, mood, and well-being.",
    gradient: "from-zinc-900 via-rose-950 to-zinc-900",
  },
  {
    id: 7,
    title: "Men's Wellness",
    category: "Men's Services",
    description: "Targeted programs for testosterone, ED, and male health using advanced medical protocols.",
    gradient: "from-slate-900 via-indigo-950 to-slate-900",
  },
  {
    id: 8,
    title: "Skin Rejuvenation",
    category: "Skin Services",
    description: "Laser and Rx-based treatments to reduce wrinkles, dark spots, and improve skin texture.",
    gradient: "from-stone-900 via-red-950 to-stone-900",
  },
];

const PAGE_SIZE = 4;

// Icons (memoized for performance) 
const Icons = {
  ChevronLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

// Sub-components

const FilterButton = ({ label, isActive, onClick }: FilterButtonProps) => (
  <button
    onClick={onClick}
    className={`
      px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      ${isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
        : "bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
      }
    `}
    aria-pressed={isActive}
  >
    {label}
  </button>
);

const AssessmentCard = ({ title, description, gradient }: AssessmentCardProps) => (
  <div className={`
    group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient}
    h-[420px] flex flex-col cursor-pointer
    transition-all duration-500 ease-out
    hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1
  `}>
    {/* Noise texture overlay */}
    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')] bg-repeat" />

    {/* Radial gradient glow */}
    <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full p-6">
      <h3 className="text-white font-bold text-xl leading-tight tracking-tight">
        {title}
      </h3>

      <div className="flex-1" />

      <div className="transform transition-transform duration-500 translate-y-0">
        <p className="text-white/70 text-sm leading-relaxed mb-5 line-clamp-3">
          {description}
        </p>

        <button
          className="
            opacity-0 -translate-y-2
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-400 ease-out
            bg-gradient-to-r from-blue-600 to-blue-500
            hover:from-blue-500 hover:to-blue-600
            active:scale-95
            text-white text-sm font-semibold
            px-6 py-2.5 rounded-full
            shadow-lg shadow-blue-900/30
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          "
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Starting assessment: ${title}`);
          }}
        >
          Start Assessment
        </button>
      </div>
    </div>
  </div>
);

const PaginationButton = ({ onClick, disabled, children, ariaLabel } : PaginationButtonProps) => (
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
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);

  // Memoized filtered cards - prevents unnecessary recalculations
  const filteredCards = useMemo(() => {
    if (activeFilter === "All") return CARDS;
    return CARDS.filter(card => card.category === activeFilter);
  }, [activeFilter]);

  // Memoized pagination values
  const { totalPages, visibleCards } = useMemo(() => {
    const total = Math.ceil(filteredCards.length / PAGE_SIZE);
    const start = currentPage * PAGE_SIZE;
    const visible = filteredCards.slice(start, start + PAGE_SIZE);
    return { totalPages: total, visibleCards: visible };
  }, [filteredCards, currentPage]);

  // Reset to first page when filter changes
  const handleFilterChange = useCallback((filter : string) => {
    setActiveFilter(filter);
    setCurrentPage(0);
  }, []);

  const handlePageChange = useCallback((newPage : number) => {
    setCurrentPage(newPage);
    // Optional: scroll to top of cards section
    document.querySelector('.cards-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) handlePageChange(currentPage - 1);
  }, [currentPage, handlePageChange]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) handlePageChange(currentPage + 1);
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <section className="bg-gradient-to-b from-white via-gray-50 to-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with modern gradient text */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Start from a tailored assessment
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            Comprehensive care for a wide range of everyday conditions, managed safely from home.
          </p>
        </div>

        {/* Filters with scroll into view on filter change */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {FILTERS.map((filter) => (
            <FilterButton
              key={filter}
              label={filter}
              isActive={activeFilter === filter}
              onClick={() => handleFilterChange(filter)}
            />
          ))}
        </div>

        {/* Cards Grid */}
        <div className="cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCards.map((card) => (
            <AssessmentCard key={card.id} {...card} />
          ))}
        </div>

        {/* Empty State */}
        {visibleCards.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No assessments found in this category.</p>
            <button
              onClick={() => handleFilterChange("All")}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
            >
              View all assessments
            </button>
          </div>
        )}

        {/* Pagination with page indicator */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
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
          background-image: radial-gradient(ellipse at 30% 20%, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
}