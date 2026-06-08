"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { CircleCheckBig, Clock, Info, MapPin } from "lucide-react";

const states = [
  { name: "Alabama", soon: false },
  { name: "Alaska", soon: true },
  { name: "Arizona", soon: false },
  { name: "Arkansas", soon: false },
  { name: "California", soon: false },
  { name: "Colorado", soon: false },
  { name: "Connecticut", soon: false },
  { name: "Delaware", soon: false },
  { name: "Florida", soon: false },
  { name: "Georgia", soon: false },
  { name: "Hawaii", soon: true },
  { name: "Idaho", soon: false },
  { name: "Illinois", soon: false },
  { name: "Indiana", soon: false },
  { name: "Iowa", soon: false },
  { name: "Kansas", soon: false },
  { name: "Kentucky", soon: false },
  { name: "Louisiana", soon: false },
  { name: "Maine", soon: false },
  { name: "Maryland", soon: false },
  { name: "Massachusetts", soon: false },
  { name: "Michigan", soon: false },
  { name: "Minnesota", soon: false },
  { name: "Mississippi", soon: false },
  { name: "Missouri", soon: false },
  { name: "Montana", soon: false },
  { name: "Nebraska", soon: false },
  { name: "Nevada", soon: false },
  { name: "New Hampshire", soon: false },
  { name: "New Jersey", soon: false },
  { name: "New Mexico", soon: false },
  { name: "New York", soon: false },
  { name: "North Carolina", soon: false },
  { name: "North Dakota", soon: true },
  { name: "Ohio", soon: false },
  { name: "Oklahoma", soon: false },
  { name: "Oregon", soon: false },
  { name: "Pennsylvania", soon: false },
  { name: "Rhode Island", soon: false },
  { name: "South Carolina", soon: false },
  { name: "South Dakota", soon: true },
  { name: "Tennessee", soon: false },
  { name: "Texas", soon: false },
  { name: "Utah", soon: false },
  { name: "Vermont", soon: false },
  { name: "Virginia", soon: false },
  { name: "Washington", soon: false },
  { name: "West Virginia", soon: false },
  { name: "Wisconsin", soon: false },
  { name: "Wyoming", soon: false },
];

const availableCount = states.filter((s) => !s.soon).length;
const soonCount = states.filter((s) => s.soon).length;

export default function CoveragePage() {
  const [selectedState, setSelectedState] = useState("");
  const [checkedState, setCheckedState] = useState<string | null>(null);

  const handleCheck = () => {
    if (selectedState) setCheckedState(selectedState);
  };

  const found = checkedState
    ? states.find((s) => s.name === checkedState)
    : null;

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
              "linear-gradient(0deg, #EBEEF2 0%, #EBEEF2 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.70) 100%)",
          }}
        >
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-[#d7e3f4]/50 border border-[#b9cee2] text-[#427ee1] px-4 py-1.5 rounded-full text-xs font-medium mb-6 tracking-wide">
              <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
              Licensed in 46 states
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-[#1f1f1f] leading-[1.15] mb-5 tracking-tight">
              Where We Provide Care
            </h1>
            <p className="text-[#595959] text-[15px] leading-relaxed font-normal max-w-2xl mx-auto">
              WeightLossMD providers are licensed to practice in your state.
              Care is only available in states where our providers hold an
              active license.
            </p>
          </div>
        </div>
      </section>

      {/* ── CHECK AVAILABILITY ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-12 mb-8 w-full">
        <div className="border border-gray-200 rounded-[20px] p-8 md:p-10 bg-white">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6 text-center">
            Check Availability
          </h2>

          <div className="max-w-md mx-auto flex flex-col items-center gap-4">
            {/* State dropdown */}
            <div className="w-full relative">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setCheckedState(null);
                }}
                className="w-full appearance-none bg-[#f5f6f8] border border-gray-200 rounded-[10px] px-4 py-3 text-[13.5px] text-gray-600 focus:outline-none focus:border-[#2563eb] cursor-pointer"
              >
                <option value="">Select your state</option>
                {states.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                ▾
              </span>
            </div>

            {/* Result message */}
            {checkedState && found !== undefined && (
              <div
                className={`w-full rounded-[10px] px-4 py-3 text-[13px] flex items-center gap-2 ${
                  found?.soon
                    ? "bg-[#fffbeb] border border-[#fde68a] text-[#92400e]"
                    : "bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534]"
                }`}
              >
                {found?.soon ? (
                  <Clock className="w-4 h-4 flex-shrink-0 text-[#f59e0b]" />
                ) : (
                  <CircleCheckBig className="w-4 h-4 flex-shrink-0 text-[#22c55e]" />
                )}
                {found?.soon
                  ? `${checkedState} is coming soon — not yet available.`
                  : `Great news! WeightLossMD is available in ${checkedState}.`}
              </div>
            )}

            {/* Button */}
            <button
              onClick={handleCheck}
              disabled={!selectedState}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-10 py-3 rounded-full text-[14px] transition-colors"
            >
              Check Availability
            </button>
          </div>
        </div>
      </section>

      {/* ── STATES GRID ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-2 mb-10 w-full">
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

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
          {states.map((state) => (
            <div
              key={state.name}
              className={`flex flex-col items-center justify-center gap-1 rounded-[12px] py-3 px-2 border text-center ${
                state.soon
                  ? "bg-[#fffbeb] border-[#fde68a]"
                  : "bg-white border-gray-200"
              }`}
            >
              {state.soon ? (
                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#f59e0b]">
                  <Clock className="w-3 h-3 stroke-[2.5]" />
                  Soon
                </span>
              ) : (
                <CircleCheckBig className="w-[15px] h-[15px] text-[#22c55e] stroke-[2]" />
              )}
              <span
                className={`text-[12.5px] font-medium leading-tight ${
                  state.soon ? "text-[#92400e]" : "text-gray-700"
                }`}
              >
                {state.name}
              </span>
            </div>
          ))}
        </div>

        {/* Licensing Disclaimer */}
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
            <button className="bg-[#214cc7] hover:bg-[#1a3ca0] text-white font-medium px-8 py-3 rounded-full transition-colors text-[14px] md:text-[15px] whitespace-nowrap">
              Book a consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
