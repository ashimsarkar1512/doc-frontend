"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import CommonHero from "@/components/shared/CommonHero";
import { ChevronDown, MapPin, X } from "lucide-react";
import { useGetCtaSectionByPageQuery } from "@/Redux/features/ctaSection/ctaSectionApi";
import { useGetHeroSectionByPageQuery } from "@/Redux/features/heroSection/heroSectionApi";
import { useGetMedicalTeamSectionQuery } from "@/Redux/features/medicalTeam/medicalTeamApi";
import {
  useGetAllFeaturesDoctorQuery,
  Doctor,
} from "@/Redux/features/homePageDoctor/homePageDoctorApi";
import FadeIn from "@/components/shared/animations/FadeIn";
import { motion, AnimatePresence } from "framer-motion";

export default function MedicalTeamPage() {
  const { data: heroData, isLoading: isHeroLoading } =
    useGetHeroSectionByPageQuery("MedicalTeam");
  const { data: teamSectionData, isLoading: isTeamSectionLoading } =
    useGetMedicalTeamSectionQuery();
  const { data: ctaData, isLoading: isCtaLoading } =
    useGetCtaSectionByPageQuery("MedicalTeam");
  const { data: doctorsData, isLoading: isDoctorsLoading } =
    useGetAllFeaturesDoctorQuery();
  console.log(doctorsData);
  const [selectedDoctor, setSelectedDoctor] = React.useState<Doctor | null>(
    null,
  );
  

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO SECTION ── */}
      <CommonHero
        watermarkImage="/providerWatermark.png"
        title={heroData?.title || "Meet Our Medical Team"}
        description={
          isHeroLoading ? (
            <span className="flex space-x-2 justify-center">
              <span className="h-4 w-64 bg-gray-200 animate-pulse rounded-md inline-block"></span>
            </span>
          ) : (
            heroData?.description ||
            "All treatment decisions at WeightLossMD are made exclusively by board-certified, state-licensed healthcare professionals. Your health is in expert hands."
          )
        }
      ></CommonHero>

      {/* ── PROVIDER NETWORK ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-16 mb-24 w-full">
        <FadeIn className="text-center mb-12">
          {isTeamSectionLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-64 h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-96 h-4 bg-gray-200 animate-pulse rounded mt-2"></div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-[54px] font-bold text-gray-900 tracking-tight mb-3">
                {teamSectionData?.title || "Our Licensed Provider Network"}
              </h2>
              <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                {teamSectionData?.description ||
                  "Every provider in our network is credentialed, licensed in your state, and trained in evidence-based obesity and metabolic medicine."}
              </p>
            </>
          )}
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isDoctorsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-full aspect-[4/5] bg-gray-200 animate-pulse rounded-[24px]"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
              </div>
            ))
          ) : doctorsData?.data && doctorsData.data.length > 0 ? (
            doctorsData.data.map((doctor: any, index: number) => (
              <FadeIn key={doctor.id} delay={index * 0.1}>
                <div className="flex flex-col gap-3 h-full">
                  <div className="w-full aspect-[4/5] bg-[#d7e4f8] rounded-[24px] overflow-hidden">
                    <img
                      src={doctor.thumbnail}
                      alt={doctor.fullName}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className="text-2xl font-semibold text-[#272628] tracking-tight">
                      {doctor.fullName}
                    </h3>
                    <p className="text-[#272628] text-xl">{doctor.title}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-6 h-6  text-[#272628]" />
                      <span className="text-xl text-[#272628]">
                        {doctor.officeLocation}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[#272628] text-xl line-clamp-2 min-h-[2rem]">{doctor?.shortBio}</p>
                    </div>
                    <button
                      onClick={() => setSelectedDoctor(doctor)}
                      className="text-[#2563eb] text-xl  hover:text-[#1d4ed8] transition-colors flex items-center gap-1 mt-1 w-fit focus:outline-none"
                    >
                      View Full Bio
                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              No providers found.
            </div>
          )}
        </div>
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
              {isCtaLoading ? (
                <div className="h-8 w-64 bg-white/20 animate-pulse rounded-md" />
              ) : (
                <h2 className="text-[24px] md:text-[32px] font-medium text-white tracking-wide leading-[1.25]">
                  {ctaData?.sectionTitle ? (
                    ctaData.sectionTitle
                  ) : (
                    <>
                      Contact Us at Weight Loss MD
                      <br className="hidden md:block" /> Today
                    </>
                  )}
                </h2>
              )}
            </div>
            <div className="relative z-10 p-[5px] rounded-full border-[1.5px] border-white/30 bg-white/10 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              {isCtaLoading ? (
                <div className="w-32 h-10 bg-white/20 animate-pulse rounded-full" />
              ) : (
                <button
                  onClick={() =>
                    window.open(
                      ctaData?.url ||
                        "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
                      ctaData?.openInNewTab ? "_blank" : "_self",
                    )
                  }
                  className="bg-[#214cc7] hover:bg-[#1a3ca0] text-white font-medium px-8 py-3 rounded-full transition-colors text-[14px] md:text-[15px] whitespace-nowrap"
                >
                  {ctaData?.ctaButtonText || "Book a consultation"}
                </button>
              )}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── PROVIDER DETAILS MODAL ── */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="bg-white rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
                <h3 className="text-xl font-bold text-gray-900">
                  Provider Details
                </h3>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 flex flex-col items-center text-center overflow-y-auto">
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-[#d7e4f8] rounded-[24px] overflow-hidden mb-5 flex-shrink-0">
                  <img
                    src={selectedDoctor.thumbnail}
                    alt={selectedDoctor.fullName}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedDoctor.fullName}
                </h4>
                <p className="text-gray-600 text-base mb-3">
                  {selectedDoctor.title}
                </p>

                <div className="flex items-center justify-center gap-1.5 text-gray-700 mb-5">
                  <MapPin className="w-6 h-6 text-gray-500" />
                  <span className="text-xl">
                    Office: {selectedDoctor.officeLocation}
                  </span>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed px-2 text-center">
                  {selectedDoctor.shortBio}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


