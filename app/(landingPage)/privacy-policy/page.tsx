"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CommonHero from "@/components/shared/CommonHero";
import FallbackImage from "@/components/shared/FallbackImage";
import RichTextRenderer from "@/components/shared/RichTextRenderer";
import QNA, { FAQItem } from "@/components/home/QNA";
import { useGetDynamicPageDataQuery } from "@/Redux/api/dynamicPageApi";
import FadeIn from "@/components/shared/animations/FadeIn";

export default function PrivacyPolicyPage() {
  const { data: pageData, isLoading } =
    useGetDynamicPageDataQuery("PrivacyPolicy");

  const hero = pageData?.hero || { title: "Privacy Policy" };
  const content = pageData?.content || "";
  const widget = pageData?.widget;
  const widgetImage = widget?.image?.fileUrl || "/expartProviders/expart1.png";
  const faqList = pageData?.faqList;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO BANNER ── */}
      <CommonHero title={hero.title} description={hero.description} />

      {/* ── CONTENT ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 md:mt-8 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* LEFT: Main Content */}
          <div className="lg:col-span-2 min-w-0">
            <FadeIn>
              <RichTextRenderer content={content} />
            </FadeIn>
          </div>

          {/* RIGHT: Sticky Doctor Card */}
          <div className="lg:col-span-1">
            <FadeIn className="sticky top-28" delay={0.2}>
              <div
                className="rounded-[28px] overflow-hidden relative w-full"
                style={{ background: "#dce8f4", aspectRatio: "4/5" }}
              >
                {/* WLMD watermark */}
                <div className="absolute top-8 left-0 right-0 text-center z-[1] pointer-events-none select-none">
                  <span
                    className="font-black tracking-[0.14em] uppercase"
                    style={{
                      fontSize: "clamp(72px, 10vw, 104px)",
                      background:
                        "linear-gradient(180deg, #a8c0e8 60%, rgba(168,192,232,0) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1,
                      display: "block",
                    }}
                  >
                    WLMD
                  </span>
                </div>

                {/* Doctor image */}
                <div className="absolute inset-0 z-[2]">
                  <FallbackImage
                    src={widgetImage}
                    fallbackSrc="/expartProviders/expart1.png"
                    alt="Doctor"
                    fill
                    className="object-cover object-top"
                    style={{ objectPosition: "50% 10%" }}
                  />
                </div>

                {/* Contact Us button */}
                <div className="absolute bottom-8 left-0 right-0 z-[3] flex justify-center">
                  <Link
                    href={widget?.buttonUrl || "/contact"}
                    target={widget?.isBlank ? "_blank" : "_self"}
                    className="bg-[#2563eb] hover:bg-blue-700 text-white text-[16px] font-semibold px-10 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    {widget?.buttonText || "Contact Us"}
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION (Dynamic based on page data) ── */}
      {faqList && faqList.length > 0 && (
        <QNA faqData={faqList} title="Privacy Policy FAQs" />
      )}

      {/* <Footer /> */}
    </div>
  );
}
