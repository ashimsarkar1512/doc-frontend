"use client";

import Image from "next/image";
import React from "react";
import fallbackDoctorImg from "@/public/doctor-blog.png";

const BlogSidebar = () => {
  return (
    <div className="sticky top-32 w-full bg-[#EBEEF2] rounded-[2rem] pt-10 px-0 pb-0 flex flex-col items-center text-center overflow-hidden h-fit">
      <h3 className="text-[28px] md:text-[34px] font-bold text-black leading-[1.2] pb-4  uppercase text-center px-6">
        Medical Weight<br />Management<br />Program
      </h3>
      
      <div className="relative w-full h-[350px] flex justify-center mt-auto">
        
        {/* WLMD Watermark */}
<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 px-4 pb-6 -translate-y-14">
  <Image
    src="/WLMD.png"
    alt="WLMD Watermark"
    fill
    className="object-contain"
  />
</div>
        {/* Doctor image (fixed) */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-end">
          <div className="absolute inset-x-0 bottom-0 top-0">
            <Image
              src={fallbackDoctorImg} 
              alt="Doctor"
              fill
              className="object-contain object-bottom drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Action Button */}
    <div className="absolute bottom-5 z-20 flex justify-center w-full">
  <div className="relative z-10 inline-block p-[5px] rounded-full border-[1.5px] border-white/30 bg-white/10 backdrop-blur-sm">
    <button
      onClick={() =>
        window.open(
          "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
          "_blank"
        )
      }
      className="bg-[#1D4ED8] hover:bg-[#143499] text-white font-medium px-6 sm:px-9 py-2.5 sm:py-3 rounded-full transition-colors text-[13px] sm:text-[15px] whitespace-nowrap"
    >
      Book a consultation
    </button>
  </div>
</div>
      </div>
    </div>
  );
};

export default BlogSidebar;