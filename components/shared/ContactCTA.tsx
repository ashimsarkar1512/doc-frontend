"use client";
import React from "react";
import Image from "next/image";

interface ContactCTAProps {
  sectionTitle?: string;
  ctaButtonText?: string;
  url?: string;
  openInNewTab?: boolean;
}

const ContactCTA = ({
  sectionTitle = "Contact Us at Weight Loss MD Today",
  ctaButtonText = "Book a consultation",
  url = "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
  openInNewTab = true
}: ContactCTAProps) => {
  return (
    <section className="w-full self-stretch max-w-[1520px] mx-auto px-4 lg:px-0 mb-24 mt-12 rounded-[40px] bg-[#8cb5f0]">
      <div 
        className="isolate rounded-[40px] px-8 md:px-[49px] py-[80px] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden w-full md:h-[268px]"
        style={{ background: "linear-gradient(to right, #292929 0%, #292929 40%, #27457a 60%, #3e70d6 85%, #8cb5f0 100%)" }}
      >
        <div className="flex items-center gap-[49px] relative z-10 w-full">
          <div className="relative w-[126px] h-[133px] shrink-0">
            <Image 
              src="/weight-loss.png" 
              alt="Weight Loss MD Logo"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-[32px] md:text-[54px] font-semibold text-white font-[Quicksand] leading-[110%] w-full md:w-[684px] shrink-0">
            {sectionTitle}
          </h2>
        </div>

        <div className="relative z-10 p-[12px] rounded-[60px] border border-[rgba(255,255,255,0.43)] bg-[rgba(255,255,255,0.32)] shrink-0">
          <a
            href={url}
            target={openInNewTab ? "_blank" : "_self"}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            className="inline-flex items-center justify-center gap-[15px] px-[44px] py-[36px] bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-[Quicksand] font-semibold text-[24px] leading-[100%] text-center rounded-[50px] transition-all shadow-[0_0_20px_-3px_rgba(37,99,235,0.5)] whitespace-nowrap"
          >
            {ctaButtonText}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
