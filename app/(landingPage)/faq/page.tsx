
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import CommonHero from "@/components/shared/CommonHero";
import Navbar from "@/components/shared/Navbar";
import { Search } from "lucide-react";
import { useGetFaqByPageTypeQuery } from "@/Redux/features/common/faqApi";
import type { HeroSectionPageType } from "@/Redux/features/common/heroSectionApi";
import faqImage from "@/app/faq.png";
import FadeIn from "@/components/shared/animations/FadeIn";
import { motion, AnimatePresence } from "framer-motion";
import ContactCTA from "@/components/shared/ContactCTA";

const categories: HeroSectionPageType[] = [
  "ServiceCategory",
  "Blog",
  "BlogDetail",
  "LabTest",
  "MedicalTeam",
  "HowItWorks",
  "Eligiblity",
  "Coverage",
  "Faq",
  "BillingCancellation",
  "ShippingInfo",
  "AboutUs",
  "ContactUs",
  "PrivacyPolicy",
  "TermsOfService",
  "HippaNotice",
  "ReportSideEffect",
  "RequestRecord",
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] =
    useState<HeroSectionPageType>("Faq");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { data: faqSection } = useGetFaqByPageTypeQuery(activeCategory);

  const faqs = faqSection?.faqs ?? [];
  console.log(faqs);

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const matchSearch =
        search.trim() === "" ||
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [faqs, search]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO SECTION ── */}
      <CommonHero
        title={faqSection?.sectionTitle || "Frequently Asked Questions "}
        description={
          faqSection?.pageType
            ? `Find answers to common questions for ${faqSection.pageType}.`
            : "Find answers to common questions about our programs, medications, and process."
        }
        watermarkImage={faqImage}
      >
    
      </CommonHero>

      {/* ── FAQ LIST ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mb-20 w-full">
        <div className="relative w-full mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-700 stroke-[2]" />
          <input
            type="text"
            placeholder="Search from questions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenIndex(null);
            }}
            className="w-full bg-[#F0F0F0] border-0 rounded-[10px] pl-12 pr-4 py-3 text-lg text-gray-900 placeholder-gray-400 focus:outline-none shadow-sm"
          />
        </div>
        <FadeIn>
          <div className="flex flex-col gap-1.5">
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-10">
                No questions found.
              </p>
          )}
          {filtered.map((faq: any, index: number) => (
            <div
              key={faq.id}
              className="rounded-[12px] overflow-hidden"
              style={{ background: "#f5f6f8" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-800 pr-4">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 text-gray-900 text-xl font-light leading-none select-none">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-5 pb-4 text-lg text-gray-500 leading-relaxed border-t border-gray-200 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        </FadeIn>
      </section>
      <ContactCTA pageType="Faq" />
    </div>
  );
}
