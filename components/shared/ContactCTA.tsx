"use client";
import React from "react";
import Image from "next/image";

const ContactCTA = () => {
  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 lg:px-0 mb-24 mt-12">
      <div className="bg-[linear-gradient(90deg,#2A2C2E_0%,#2D426E_40%,#5484E6_100%)] rounded-[20px] px-8 lg:px-[80px] py-[80px] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden w-full md:h-[268px]">
        
        <div className="flex items-center gap-[49px] relative z-10 w-full">
          <div className="relative w-[80px] h-[100px] shrink-0">
            <Image 
              src="/WLMD.png" 
              alt="Weight Loss MD Logo"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-[32px] md:text-[54px] font-semibold text-white font-[Quicksand] leading-[110%] w-full max-w-[684px]">
            Contact Us at Weight Loss MD Today
          </h2>
        </div>

        <div className="relative z-10 p-[12px] rounded-[60px] border border-[rgba(255,255,255,0.43)] bg-[rgba(255,255,255,0.32)] shrink-0">
          <a
            href="https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-[15px] px-[44px] py-[36px] bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-[Quicksand] font-semibold text-[24px] leading-[100%] text-center rounded-[50px] transition-all shadow-[0_0_20px_-3px_rgba(37,99,235,0.5)] whitespace-nowrap"
          >
            Book a consultation
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
