"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { Search } from "lucide-react";

const categories = [
  "All",
  "Weight Loss",
  "Hormone Therapy",
  "Anxiety & Depression",
  "Sexual Health",
  "Hair care",
  "Skin Care",
  "Sleep",
  "Supplements",
  "Membership",
  "Billing",
  "Shipping",
  "Medical Review",
  "Provider Visits",
];

const faqs = [
  {
    category: "Weight Loss",
    q: "How much weight can I expect to lose?",
    a: "Results vary by individual. Clinical studies show patients on GLP-1 medications lose an average of 10–15% of body weight over 12–18 months when combined with lifestyle changes.",
  },
  {
    category: "Weight Loss",
    q: "How long will I be on treatment?",
    a: "Treatment duration depends on your health goals and provider recommendations. Many patients continue treatment for 12–24 months or longer as part of a long-term weight management plan.",
  },
  {
    category: "Weight Loss",
    q: "What is compounded semaglutide?",
    a: "Compounded semaglutide is a version of the GLP-1 medication prepared by a licensed compounding pharmacy. It contains the same active ingredient as brand-name products but may differ in formulation.",
  },
  {
    category: "Weight Loss",
    q: "What are common side effects of semaglutide?",
    a: "Common side effects include nausea, vomiting, diarrhea, constipation, and decreased appetite. These often improve after the first few weeks as your body adjusts to the medication.",
  },
  {
    category: "Weight Loss",
    q: "How is tirzepatide different from semaglutide?",
    a: "Tirzepatide is a dual GIP/GLP-1 receptor agonist, while semaglutide is a GLP-1 receptor agonist only. Studies suggest tirzepatide may produce greater weight loss in some patients.",
  },
  {
    category: "Weight Loss",
    q: "Is tirzepatide FDA-approved for weight loss?",
    a: "Yes. Tirzepatide (brand name Zepbound) received FDA approval for chronic weight management in adults with obesity or overweight with at least one weight-related condition.",
  },
  {
    category: "Medical Review",
    q: "Do I need labs before starting?",
    a: "Labs are often required before starting treatment. Your provider will specify which labs are needed. Labs completed within the past 90 days may be accepted.",
  },
  {
    category: "Medical Review",
    q: "Can I use labs from my regular doctor?",
    a: "Yes, recent labs from your primary care provider are typically accepted if they are within 90 days and include the required panels specified by your WeightLossMD provider.",
  },
  {
    category: "Membership",
    q: "What is included in my membership?",
    a: "Your membership includes provider consultations, ongoing monitoring, prescription management, and access to our care team throughout your treatment journey.",
  },
  {
    category: "Membership",
    q: "Can I pause or cancel my membership?",
    a: "Yes. You can pause or cancel your membership at any time. Please review our billing and cancellation policy for details on refunds and processing times.",
  },
  {
    category: "Billing",
    q: "When am I charged?",
    a: "You are charged at the time of enrollment. Recurring charges occur monthly or per billing cycle depending on your selected plan.",
  },
  {
    category: "Billing",
    q: "Do you accept insurance?",
    a: "WeightLossMD does not currently accept insurance for membership fees. However, some patients may be able to use HSA or FSA funds. Check with your plan administrator.",
  },
  {
    category: "Shipping",
    q: "How long does shipping take?",
    a: "Shipping typically takes 3–7 business days after your prescription is processed and approved by the pharmacy. You will receive a tracking number once shipped.",
  },
  {
    category: "Shipping",
    q: "Is shipping discreet?",
    a: "Yes. All medications are shipped in discreet, plain packaging with no indication of the contents on the outside of the package.",
  },
  {
    category: "Provider Visits",
    q: "Who reviews my health information?",
    a: "A licensed healthcare provider — either a physician or nurse practitioner — licensed in your state reviews your health intake and makes all treatment decisions.",
  },
  {
    category: "Provider Visits",
    q: "What if I'm not approved?",
    a: "If your provider determines you are not a candidate for treatment, you will be notified and a refund will be issued. All decisions are based on clinical criteria.",
  },
  {
    category: "Provider Visits",
    q: "Do I need to see a provider in person?",
    a: "No. WeightLossMD operates as a telehealth platform. All consultations and follow-ups are conducted remotely through our secure online system.",
  },
  {
    category: "Provider Visits",
    q: "How do I contact my provider?",
    a: "You can message your provider directly through your patient portal. For urgent matters, our care team is also available via the support contact options in your dashboard.",
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const matchCat =
        activeCategory === "All" || f.category === activeCategory;
      const matchSearch =
        search.trim() === "" ||
        f.q.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO SECTION ── */}
      <section className="pt-24 md:pt-28 px-4 sm:px-6 max-w-[1200px] mx-auto w-full">
        <div
          className="relative w-full overflow-hidden py-14 md:py-16 px-6 md:px-12 flex flex-col items-center justify-center text-center"
          style={{
            borderRadius: "40px",
            background:
              "linear-gradient(0deg, #EBEEF2 0%, #EBEEF2 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.70) 100%)",
          }}
        >
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-5">
            <h1 className="text-3xl md:text-4xl lg:text-[48px] font-bold text-[#1f1f1f] leading-[1.15] tracking-tight">
              Frequently Asked Questions 
            </h1>
            <p className="text-[#595959] text-[14px] leading-relaxed font-normal max-w-xl mx-auto">
              Find answers to common questions about our programs, medications,
              and process.
            </p>

            {/* Search input inside hero */}
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
          </div>
        </div>
      </section>

      {/* ── CATEGORY PILLS ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-10 mb-6 w-full">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-[#2563eb] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── FAQ LIST ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-20 w-full">
        <div className="flex flex-col gap-1.5">
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">
              No questions found.
            </p>
          )}
          {filtered.map((faq, index) => (
            <div
              key={index}
              className="rounded-[12px] overflow-hidden"
              style={{ background: "#f5f6f8" }}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none"
              >
                <span className="text-[15px] font-medium text-gray-800 pr-4">
                  {faq.q}
                </span>
                <span className="flex-shrink-0 text-gray-400 text-xl font-light leading-none select-none">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-5 pb-4 text-[13px] text-gray-500 leading-relaxed border-t border-gray-200 pt-3">
                  {faq.a}
                </div>
              )}
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
            <button className="bg-[#214cc7] hover:bg-[#1a3ca0] text-white font-medium px-8 py-3 rounded-full transition-colors text-[14px] md:text-[15px] whitespace-nowrap">
              Book a consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
