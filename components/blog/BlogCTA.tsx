"use client";
import Image from "next/image";
import React from "react";

const BlogCTA = () => {
  return (
    <section className="w-full max-w-[85rem] mx-auto px-4 md:px-8 pb-24">
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#1E293B] flex flex-col md:flex-row items-center justify-between p-8 md:p-14 min-h-[180px]">
        
        {/* Blue Glow Effect */}
        <div className="absolute right-0 top-0 w-2/3 h-[150%] bg-[#2563EB] opacity-40 blur-[100px] z-0 rounded-full mix-blend-screen -translate-y-1/4" />

        <div className="relative z-10 flex items-center gap-6 mb-8 md:mb-0">
          {/* Logo Mark */}
          <div className="w-14 h-14 relative flex-shrink-0">
             <Image 
                src="/logo.png" 
                alt="Logo mark" 
                fill 
                className="object-cover object-left invert brightness-0" 
             />
          </div>
          <h2 className="text-3xl md:text-4xl font-normal text-white leading-tight">
            Contact Us at Weight Loss<br className="hidden md:block" />MD Today
          </h2>
        </div>

        <div className="relative z-10">
          <button
               onClick={() =>
            window.open(
              "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
              "_blank",
            )
          }
           className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-8 py-4 rounded-full transition-all shadow-lg shadow-blue-500/30">
            Book a consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogCTA;
