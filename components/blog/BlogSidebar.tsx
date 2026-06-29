"use client";

import Image from "next/image";
import React from "react";
import fallbackDoctorImg from "@/public/doctor-blog.png";

interface BlogSidebarProps {
  providerImage?: string;
  providerName?: string;
}

const BlogSidebar = ({ providerImage, providerName }: BlogSidebarProps) => {
  return (
    <div className="sticky top-32 w-full bg-[#F3F4F6] rounded-3xl p-8 flex flex-col items-center text-center overflow-hidden h-fit">
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-snug mb-8 uppercase tracking-wide">
        Medical Weight<br />Management<br />Program
      </h3>
      
      <div className="relative w-full h-[350px] flex justify-center mt-auto">

        
        {/* Doctor image (dynamic or fallback) */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-24">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={providerImage || fallbackDoctorImg} 
              alt={providerName || "Doctor"}
              fill
              unoptimized
              className="object-contain object-bottom drop-shadow-2xl scale-110 origin-bottom"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="absolute bottom-6 w-full z-20 px-2">
          <button
            onClick={() => window.open("https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434", "_blank")}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium py-3.5 rounded-full transition-all shadow-md shadow-blue-500/30"
          >
            Book a consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
