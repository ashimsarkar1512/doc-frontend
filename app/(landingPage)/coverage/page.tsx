"use client";

import { useState } from "react";
import Image from "next/image";
import CommonHero from "@/components/shared/CommonHero";
import Navbar from "@/components/shared/Navbar";
import { CircleCheckBig, Clock, Info, ChevronDown } from "lucide-react";
import {
  useCheckStateCoverageAvailabilityQuery,
  useGetCoverageCategoriesQuery,
} from "@/Redux/features/common/coverageApi";
import { useGetHeroSectionsQuery } from "@/Redux/features/common/heroSectionApi";
import coverageImage from "@/app/coverage.png";
import FadeIn from "@/components/shared/animations/FadeIn";
import { motion, AnimatePresence } from "framer-motion";

export default function CoveragePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [appliedCategoryId, setAppliedCategoryId] = useState("");
  const [appliedStateId, setAppliedStateId] = useState("");
  const { data: heroSections } = useGetHeroSectionsQuery("Coverage");
  const { data: categories = [] } = useGetCoverageCategoriesQuery();
  const { data: allStateCoverages = [] } = useCheckStateCoverageAvailabilityQuery();
  const hasAppliedFilters = Boolean(appliedCategoryId || appliedStateId);
  const { data: filteredStateCoverages = [], isFetching: isCheckingAvailability } =
    useCheckStateCoverageAvailabilityQuery(
      {
        ...(appliedCategoryId ? { categoryId: appliedCategoryId } : {}),
        ...(appliedStateId ? { stateId: appliedStateId } : {}),
      },
      { skip: !hasAppliedFilters }
    );

  const stateCoverages = hasAppliedFilters ? filteredStateCoverages : allStateCoverages;
  const stateOptions = selectedCategoryId
    ? allStateCoverages.filter((state) => {
        const restrictedCategoryIds = state.restrictedCategories.map((category) => category.id);
        return !restrictedCategoryIds.includes(selectedCategoryId);
      })
    : allStateCoverages;

  const handleCheck = () => {
    setAppliedCategoryId(selectedCategoryId);
    setAppliedStateId(selectedStateId);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    setSelectedStateId((currentStateId) => {
      if (!currentStateId) return currentStateId;

      const matchingState = allStateCoverages.find((state) => state.id === currentStateId);
      if (!matchingState) return "";

      const restrictedCategoryIds = matchingState.restrictedCategories.map(
        (category) => category.id
      );

      return value && restrictedCategoryIds.includes(value) ? "" : currentStateId;
    });
  };

  const checkedState = appliedStateId
    ? stateCoverages.find((state) => state.id === appliedStateId) ?? null
    : null;

  const heroSection = heroSections?.[0];
  const availableCount = stateCoverages.filter((state) => !state.isComingSoon).length;
  const soonCount = stateCoverages.filter((state) => state.isComingSoon).length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO SECTION ── */}
      <CommonHero
        title={heroSection?.title || "Where We Provide Care"}
        description={
          heroSection?.description ||
          "WeightLossMD providers are licensed to practice in your state. Care is only available in states where our providers hold an active license."
        }
        watermarkImage={coverageImage}
      />

      {/* ── CHECK AVAILABILITY ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-12 mb-8 w-full">
        <FadeIn>
          <div className="border border-gray-200 rounded-[20px] p-8 md:p-10 bg-white">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6 text-center">
              Check Availability
            </h2>

          <div className="max-w-lg mx-auto flex flex-col items-center gap-5">
            {/* State dropdown */}
            <div className="w-full relative">
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  handleCategoryChange(e.target.value);
                }}
                className="w-full appearance-none bg-[#f2f3f5] border-0 rounded-[10px] px-4 py-3.5 text-[13.5px] text-gray-500 focus:outline-none cursor-pointer"
              >
                <option value="">Select Service</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <ChevronDown className="w-4 h-4 stroke-[2]" />
              </span>
            </div>
            <div className="w-full relative">
              <select
                value={selectedStateId}
                onChange={(e) => {
                  setSelectedStateId(e.target.value);
                }}
                className="w-full appearance-none bg-[#f2f3f5] border-0 rounded-[10px] px-4 py-3.5 text-[13.5px] text-gray-500 focus:outline-none cursor-pointer"
              >
                <option value="">Select your state</option>
                {stateOptions.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.stateName}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <ChevronDown className="w-4 h-4 stroke-[2]" />
              </span>
            </div>

            {/* Result message */}
            {checkedState && (
              <div
                className={`w-full rounded-[10px] px-4 py-3 text-[13px] flex items-center gap-2 ${
                  checkedState.isComingSoon
                    ? "bg-[#fffbeb] border border-[#fde68a] text-[#92400e]"
                    : "bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534]"
                }`}
              >
                {checkedState.isComingSoon ? (
                  <Clock className="w-4 h-4 flex-shrink-0 text-[#f59e0b]" />
                ) : (
                  <CircleCheckBig className="w-4 h-4 flex-shrink-0 text-[#22c55e]" />
                )}
                {checkedState.isComingSoon
                  ? `${checkedState.stateName} is coming soon — not yet available.`
                  : `Great news! WeightLossMD is available in ${checkedState.stateName}.`}
              </div>
            )}

            {hasAppliedFilters && !checkedState && !isCheckingAvailability && stateCoverages.length > 0 && (
              <div className="w-full rounded-[10px] border border-[#dbeafe] bg-[#eff6ff] px-4 py-3 text-[13px] text-[#1d4ed8]">
                Showing {stateCoverages.length} matching state
                {stateCoverages.length > 1 ? "s" : ""} for your selected filters.
              </div>
            )}

            {/* Button — 46px border-radius, blue gradient */}
            <button
              onClick={handleCheck}
              disabled={!selectedCategoryId && !selectedStateId}
              className="text-white font-semibold px-10 py-3 text-[14px] transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                borderRadius: "46px",
                background: "#1D4ED8",
              }}
            >
              {isCheckingAvailability ? "Checking..." : "Check Availability"}
            </button>
          </div>
          </div>
        </FadeIn>
      </section>

      {/* ── STATES GRID ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-2 mb-10 w-full">
        <FadeIn delay={0.1}>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <span className="inline-flex items-center gap-1.5 text-[12.5px] text-gray-600">
              <CircleCheckBig className="w-[15px] h-[15px] text-[#22c55e] stroke-[2]" />
              Available ({availableCount})
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12.5px] text-gray-600">
              <Clock className="w-[15px] h-[15px] text-[#f59e0b] stroke-[2]" />
              Coming Soon ({soonCount})
            </span>
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
          {stateCoverages.map((state, index) => (
            <FadeIn key={state.id} delay={index * 0.02} yOffset={10}>
              <div
                className={`flex flex-col items-center justify-center gap-1 rounded-[12px] py-3 px-2 border text-center h-full ${
                  state.isComingSoon
                    ? "bg-[#fffbeb] border-[#fde68a]"
                    : "bg-white border-gray-200"
                }`}
              >
                {state.isComingSoon ? (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#f59e0b]">
                    <Clock className="w-3 h-3 stroke-[2.5]" />
                    Soon
                  </span>
                ) : (
                  <CircleCheckBig className="w-[15px] h-[15px] text-[#22c55e] stroke-[2]" />
                )}
                <span
                  className={`text-[12.5px] font-medium leading-tight ${
                    state.isComingSoon ? "text-[#92400e]" : "text-gray-700"
                  }`}
                >
                  {state.stateName}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Licensing Disclaimer */}
        <FadeIn delay={0.2}>
          <div
            className="flex items-start gap-3 rounded-[14px] px-4 py-3.5 mt-6"
            style={{ background: "#e8f0fb" }}
          >
            <Info className="w-[16px] h-[16px] flex-shrink-0 mt-0.5 text-[#3b82f6] stroke-[2]" />
            <p className="text-gray-600 text-[12.5px] leading-relaxed">
              <strong className="text-[#2563eb]">Licensing Disclaimer:</strong>{" "}
              Care through WeightLossMD is only available in states where our
              providers are licensed to practice medicine. State licensing
              requirements vary. Availability may change as we add new providers
              and expand our network.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-24 w-full">
        <FadeIn>
          <div
            className="w-full rounded-[24px] flex flex-col md:flex-row items-center justify-between p-8 md:px-12 md:py-10 shadow-xl relative overflow-hidden"
            style={{
              background:
                "linear-gradient(to right, #292929 0%, #292929 40%, #27457a 60%, #3e70d6 85%, #8cb5f0 100%)",
            }}
          >
            <div className="flex items-center gap-5 md:gap-7 mb-6 md:mb-0 relative z-10">
              <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-shrink-0">
                <Image
                  src="/weight-loss.png"
                  alt="Weight Loss MD Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-[24px] md:text-[32px] font-medium text-white tracking-wide leading-[1.25]">
                Contact Us at Weight Loss MD
                <br className="hidden md:block" /> Today
              </h2>
            </div>

            <div className="relative z-10 p-[5px] rounded-full border-[1.5px] border-white/30 bg-white/10 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <button className="bg-[#214cc7] hover:bg-[#1a3ca0] text-white font-medium px-8 py-3 rounded-full transition-colors text-[14px] md:text-[15px] whitespace-nowrap">
                Book a consultation
              </button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
