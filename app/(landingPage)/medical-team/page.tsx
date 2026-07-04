"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Shield, CircleCheckBig, ChevronDown } from "lucide-react";
import { useGetHeroSectionByPageQuery } from "@/Redux/features/heroSection/heroSectionApi";

export default function MedicalTeamPage() {
  const { data: heroData, isLoading: isHeroLoading } = useGetHeroSectionByPageQuery("MedicalTeam");
  const providerNetwork = [
    {
      name: "Jeffrey Richker MD",
      role: "Licensed Colorado Physician",
      licenses: "TX #G12345 | CA #G67890 | NY #G11223",
      experience: "18 Years Clinical Practice",
      specialties: [
        "Obesity Medicine",
        "Endocrinology",
        "Internal Medicine",
        "Metabolic Disorders",
      ],
      image: "/expartProviders/expart1.png",
    },
    {
      name: "Jeffrey Richker MD",
      role: "Licensed Colorado Physician",
      licenses: "TX #G12345 | CA #G67890 | NY #G11223",
      experience: "18 Years Clinical Practice",
      specialties: [
        "Obesity Medicine",
        "Endocrinology",
        "Internal Medicine",
        "Metabolic Disorders",
      ],
      image: "/expartProviders/expart1.png",
    },
    {
      name: "Natalie Nicholas NP",
      role: "Licensed Colorado Nurse Practitioner",
      licenses: "TX #G12345 | CA #G67890 | NY #G11223",
      experience: "8 Years Experience",
      specialties: ["Family Medicine", "Women's Health", "Preventive Care"],
      image: "/expartProviders/expart2.png",
    },
    {
      name: "David Kim, NP-C",
      role: "Licensed Colorado Nurse Practitioner",
      licenses: "TX #G12345 | CA #G67890 | NY #G11223",
      experience: "9 Years Experience",
      specialties: [
        "Family Medicine",
        "Chronic Disease Management",
        "Primary Care",
      ],
      image: "/expartProviders/expart3.png",
    },
    {
      name: "Brooklynn Simmons",
      role: "Licensed Colorado Physician",
      licenses: "TX #G12345 | CA #G67890 | NY #G11223",
      experience: "10 Years Experience",
      specialties: ["Obesity Medicine", "Preventive Medicine"],
      image: "/expartProviders/expart1.png",
    },
    {
      name: "Kristin Watson",
      role: "Licensed Colorado Physician",
      licenses: "TX #G12345 | CA #G67890 | NY #G11223",
      experience: "8 Years Experience",
      specialties: ["Internal Medicine", "Metabolic Health"],
      image: "/expartProviders/expart2.png",
    },
    {
      name: "Devon Lane",
      role: "Licensed Colorado Nurse Practitioner",
      licenses: "TX #G12345 | CA #G67890 | NY #G11223",
      experience: "11 Years Experience",
      specialties: ["Family Nurse Practitioner", "Weight Management"],
      image: "/expartProviders/expart3.png",
    },
    {
      name: "Arlene McCoy",
      role: "Licensed Colorado Physician",
      licenses: "TX #G12345 | CA #G67890 | NY #G11223",
      experience: "15 Years Experience",
      specialties: ["Internal Medicine", "Obesity Medicine"],
      image: "/expartProviders/expart1.png",
    },
    {
      name: "Albert Flores",
      role: "Licensed Colorado Physician",
      licenses: "TX #G12345 | CA #G67890 | NY #G11223",
      experience: "12 Years Experience",
      specialties: ["Endocrinology", "Metabolic Disorders"],
      image: "/expartProviders/expart2.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO SECTION ── */}
      <section className="pt-24 md:pt-28 px-4 sm:px-6 max-w-[1200px] mx-auto w-full">
        <div
          className="relative w-full overflow-hidden py-16 md:py-20 px-6 md:px-12 flex flex-col items-center justify-center text-center"
          style={{
            borderRadius: "40px",
            background:
              "linear-gradient(0deg, #EBEEF2 0%, #EBEEF2 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.70) 100%)",
            backgroundPosition: "50% 50%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            {/* Top Badge with Lucide Shield Icon */}
            <span className="inline-flex items-center gap-2 bg-[#d7e3f4]/50 border border-[#b9cee2] text-[#427ee1] px-4 py-1.5 rounded-full text-xs font-medium mb-6 tracking-wide">
              <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
              Licensed Medical Professionals
            </span>

            {isHeroLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4 w-full mb-8">
                <div className="h-10 w-3/4 max-w-lg bg-gray-300 animate-pulse rounded-md mb-2"></div>
                <div className="h-4 w-full max-w-2xl bg-gray-300 animate-pulse rounded-md"></div>
                <div className="h-4 w-5/6 max-w-xl bg-gray-300 animate-pulse rounded-md"></div>
              </div>
            ) : (
              <>
                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-[#1f1f1f] leading-[1.15] mb-6 tracking-tight">
                  {heroData?.title || "Meet Our Medical Team"}
                </h1>

                {/* Subtitle Paragraph */}
                <p className="text-[#595959] text-[15px] leading-relaxed mb-10 font-normal max-w-3xl mx-auto px-2">
                  {heroData?.description ||
                    "All treatment decisions at WeightLossMD are made exclusively by board-certified, state-licensed healthcare professionals. Your health is in expert hands."}
                </p>
              </>
            )}

            {/* Features Grid with Lucide CircleCheckBig Icon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 text-left w-full max-w-3xl justify-center items-start text-[14px] text-[#444444]">
              <div className="flex items-start gap-2.5">
                <CircleCheckBig className="w-[17px] h-[17px] text-[#427ee1] shrink-0 mt-0.5 stroke-[2.5]" />
                <span className="leading-tight">
                  All providers board-certified
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CircleCheckBig className="w-[17px] h-[17px] text-[#427ee1] shrink-0 mt-0.5 stroke-[2.5]" />
                <span className="leading-tight">
                  State-licensed in your state
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CircleCheckBig className="w-[17px] h-[17px] text-[#427ee1] shrink-0 mt-0.5 stroke-[2.5]" />
                <span className="leading-tight">
                  Prescription-required medications only
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CircleCheckBig className="w-[17px] h-[17px] text-[#427ee1] shrink-0 mt-0.5 stroke-[2.5]" />
                <span className="leading-tight">HIPAA compliant practice</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── HIGHLIGHTED PROVIDER ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-20 mb-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ── LEFT SIDE: IMAGE CONTAINER ── */}
          <div className="relative lg:col-span-5 w-full">
            {/* ইমেজটির হাইট ছবির মতো একটু ছোট করার জন্য aspect-[4/3] বা নির্দিষ্ট হাইট ব্যবহার করা হয়েছে */}
            <div className="w-full aspect-[4/3] sm:aspect-[1.4/1] lg:h-[380px] rounded-[24px] bg-[#d7e3f5] overflow-hidden flex items-end justify-center">
              <img
                src="/expartProviders/expart1.png"
                alt="Jeffrey Richker MD"
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Medical Director Badge */}
            <div className="absolute top-5 left-5">
              <span className="bg-[#1d58d9] text-white px-4 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-sm">
                Medical Director
              </span>
            </div>
          </div>

          {/* ── RIGHT SIDE: CONTENT DETAILS ── */}
          <div className="flex flex-col gap-3.5 lg:col-span-7">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1f1f1f] tracking-tight mb-1">
                Jeffrey Richker MD
              </h2>
              <p className="text-gray-500 text-sm font-normal">
                Licensed Colorado-Physician
              </p>
            </div>

            {/* Licenses & Experience Info Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-1.5">
              <div className="bg-[#edf2f7] rounded-[14px] p-3.5 sm:col-span-7">
                <p className="text-[#3b7ddd] text-[13px] font-semibold mb-0.5">
                  State Licenses
                </p>
                <p className="text-[#4a5463] text-[13px] font-medium">
                  TX #G12345 | CA #G67890 | NY #G11223
                </p>
              </div>
              <div className="bg-[#edf2f7] rounded-[14px] p-3.5 sm:col-span-5">
                <p className="text-[#3b7ddd] text-[13px] font-semibold mb-0.5">
                  Experience
                </p>
                <p className="text-[#4a5463] text-[13px] font-medium">
                  18 Years Clinical Practice
                </p>
              </div>
            </div>

            {/* Specialty Pills */}
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="bg-[#dbe5f5]/70 text-[#3b7ddd] px-3.5 py-1.5 rounded-full text-xs font-semibold">
                Obesity Medicine
              </span>
              <span className="bg-[#dbe5f5]/70 text-[#3b7ddd] px-3.5 py-1.5 rounded-full text-xs font-semibold">
                Endocrinology
              </span>
              <span className="bg-[#dbe5f5]/70 text-[#3b7ddd] px-3.5 py-1.5 rounded-full text-xs font-semibold">
                Internal Medicine
              </span>
              <span className="bg-[#dbe5f5]/70 text-[#3b7ddd] px-3.5 py-1.5 rounded-full text-xs font-semibold">
                Metabolic Disorders
              </span>
            </div>

            {/* Description Text */}
            <p className="text-[#595959] text-[13.5px] leading-relaxed mt-2 max-w-2xl">
              Every provider in our network is credentialed, licensed in your
              state, and trained in evidence-based obesity and metabolic
              medicine.
            </p>

            {/* Profile Action Link */}
            <button className="text-[#2463eb] text-xs font-bold hover:text-[#1d4ed8] transition-colors flex items-center gap-1 mt-1 w-fit focus:outline-none">
              Read Full Profile
              <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* ── PATTERN DIVIDER ── */}
      <div className="w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA0MCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMTBIMTBDMTAgMTUgMTUgMjAgMjAgMjBDMjUgMjAgMzAgMTUgMzAgMTBIMzAiIHN0cm9rZT0iIzI1NjNlYiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==')] bg-repeat-x"></div>

      {/* ── PROVIDER NETWORK ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-16 mb-24 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
            Our Licensed Provider Network 
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Every provider in our network is credentialed, licensed in your
            state, and trained in evidence-based obesity and metabolic medicine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providerNetwork.map((provider, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="w-full aspect-[4/5] bg-[#d7e4f8] rounded-[24px] overflow-hidden">
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                  {provider.name}
                </h3>
                <p className="text-gray-600 text-xs">{provider.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <svg
                    className="w-3 h-3 text-[#2563eb]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs text-gray-500">
                    {provider.licenses}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-3 h-3 text-[#2563eb]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs text-gray-500">
                    {provider.experience}
                  </span>
                </div>
                <button className="text-[#2563eb] text-xs font-semibold hover:text-[#1d4ed8] transition-colors flex items-center gap-1 mt-1 w-fit">
                  View Full Bio
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-24 w-full">
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
            <button
              onClick={() =>
                window.open(
                  "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
                  "_blank",
                )
              }
              className="bg-[#214cc7] hover:bg-[#1a3ca0] text-white font-medium px-8 py-3 rounded-full transition-colors text-[14px] md:text-[15px] whitespace-nowrap"
            >
              Book a consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
