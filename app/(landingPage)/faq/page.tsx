// "use client";

// import { useState, useMemo } from "react";
// import Image from "next/image";
// import CommonHero from "@/components/shared/CommonHero";
// import Navbar from "@/components/shared/Navbar";
// import { Search } from "lucide-react";
// import { useGetFaqByPageTypeQuery } from "@/Redux/features/common/faqApi";
// import type { HeroSectionPageType } from "@/Redux/features/common/heroSectionApi";
// import faqImage from "@/app/faq.png";

// const categories: HeroSectionPageType[] = [
//   "ServiceCategory",
//   "Blog",
//   "BlogDetail",
//   "LabTest",
//   "MedicalTeam",
//   "HowItWorks",
//   "Eligiblity",
//   "Coverage",
//   "Faq",
//   "BillingCancellation",
//   "ShippingInfo",
//   "AboutUs",
//   "ContactUs",
//   "PrivacyPolicy",
//   "TermsOfService",
//   "HippaNotice",
//   "ReportSideEffect",
//   "RequestRecord",
// ];

// export default function FaqPage() {
//   const [activeCategory, setActiveCategory] = useState<HeroSectionPageType>("Faq");
//   const [search, setSearch] = useState("");
//   const [openIndex, setOpenIndex] = useState<number | null>(null);
//   const { data: faqSection } = useGetFaqByPageTypeQuery(activeCategory);

//   const faqs = faqSection?.faqs ?? [];

//   const filtered = useMemo(() => {
//     return faqs.filter((f) => {
//       const matchSearch =
//         search.trim() === "" ||
//         f.question.toLowerCase().includes(search.toLowerCase()) ||
//         f.answer.toLowerCase().includes(search.toLowerCase());
//       return matchSearch;
//     });
//   }, [faqs, search]);

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       <Navbar variant="dark" />

//       {/* ── HERO SECTION ── */}
//       <CommonHero
//         title={faqSection?.sectionTitle || "Frequently Asked Questions"}
//         description={
//           faqSection?.pageType
//             ? `Find answers to common questions for ${faqSection.pageType}.`
//             : "Find answers to common questions about our programs, medications, and process."
//         }
//         watermarkImage={faqImage}
//       >
//         <div className="relative w-full max-w-md">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 stroke-[2]" />
//           <input
//             type="text"
//             placeholder="Search questions..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setOpenIndex(null);
//             }}
//             className="w-full bg-white border-0 rounded-[10px] pl-9 pr-4 py-2.5 text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none shadow-sm"
//           />
//         </div>
//       </CommonHero>

//       {/* ── CATEGORY PILLS ── */}
//       <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-10 mb-6 w-full ">
//         <div className="flex flex-wrap gap-2">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => {
//                 setActiveCategory(cat);
//                 setOpenIndex(null);
//                 setSearch("");
//               }}
//               className={`px-3.5 py-1.5 rounded-full text-lg font-medium transition-colors ${
//                 activeCategory === cat
//                   ? "bg-[#2563eb] text-white"
//                   : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </section>

//       {/* ── FAQ LIST ── */}
//       <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-20 w-full">
//         <div className="flex flex-col gap-1.5">
//           {filtered.length === 0 && (
//             <p className="text-center text-gray-400 text-sm py-10">
//               No questions found.
//             </p>
//           )}
//           {filtered.map((faq, index) => (
//             <div
//               key={faq.id}
//               className="rounded-[12px] overflow-hidden"
//               style={{ background: "#f5f6f8" }}
//             >
//               <button
//                 onClick={() => setOpenIndex(openIndex === index ? null : index)}
//                 className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none"
//               >
//                 <span className="text-lg font-medium text-gray-800 pr-4">
//                   {faq.question}
//                 </span>
//                 <span className="flex-shrink-0 text-gray-900 text-xl font-light leading-none select-none">
//                   {openIndex === index ? "−" : "+"}
//                 </span>
//               </button>

//               {openIndex === index && (
//                 <div className="px-5 pb-4 text-lg text-gray-500 leading-relaxed border-t border-gray-200 pt-3">
//                   {faq.answer}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── CTA BANNER ── */}
//       <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-24 w-full">
//         <div
//           className="w-full rounded-[24px] flex flex-col md:flex-row items-center justify-between p-8 md:px-12 md:py-10 shadow-xl relative overflow-hidden"
//           style={{
//             background:
//               "linear-gradient(to right, #292929 0%, #292929 40%, #27457a 60%, #3e70d6 85%, #8cb5f0 100%)",
//           }}
//         >
//           <div className="flex items-center gap-5 md:gap-7 mb-6 md:mb-0 relative z-10">
//             <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-shrink-0">
//               <Image
//                 src="/weight-loss.png"
//                 alt="Weight Loss MD Logo"
//                 fill
//                 className="object-contain"
//               />
//             </div>
//             <h2 className="text-[24px] md:text-[32px] font-medium text-white tracking-wide leading-[1.25]">
//               Contact Us at Weight Loss MD
//               <br className="hidden md:block" /> Today
//             </h2>
//           </div>

//           <div className="relative z-10 p-[5px] rounded-full border-[1.5px] border-white/30 bg-white/10 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
//             <button className="bg-[#214cc7] hover:bg-[#1a3ca0] text-white font-medium px-8 py-3 rounded-full transition-colors text-[14px] md:text-[15px] whitespace-nowrap">
//               Book a consultation
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }




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
  const [activeCategory, setActiveCategory] = useState<HeroSectionPageType>("Faq");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { data: faqSection } = useGetFaqByPageTypeQuery(activeCategory);

  const faqs = faqSection?.faqs ?? [];
  console.log(faqs)

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
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 stroke-[2]" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenIndex(null);
            }}
            className="w-full bg-white border-0 rounded-[10px] pl-9 pr-4 py-2.5 text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none shadow-sm"
          />
        </div>
      </CommonHero>

      {/* ── CATEGORY PILLS ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-10 mb-6 w-full ">
        {/* <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
                setSearch("");
              }}
              className={`px-3.5 py-1.5 rounded-full text-lg font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-[#2563eb] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div> */}
      </section>

      {/* ── FAQ LIST ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-20 w-full">
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
            className="w-full bg-[#F0F0F0] border-0 rounded-[10px] pl-9 pr-4 py-3 text-lg text-gray-900 placeholder-gray-400 focus:outline-none shadow-sm"
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
