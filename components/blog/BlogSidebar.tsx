import Image from "next/image";
import React from "react";

const BlogSidebar = () => {
  return (
    <div className="sticky top-32 w-full bg-[#F3F4F6] rounded-3xl p-8 flex flex-col items-center text-center overflow-hidden h-fit">
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-snug mb-8 uppercase tracking-wide">
        Medical Weight<br />Management<br />Program
      </h3>
      
      <div className="relative w-full h-[320px] flex justify-center mt-auto">
        {/* Abstract text background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] z-0 text-[120px] font-black text-blue-900 overflow-hidden select-none whitespace-nowrap tracking-tighter pointer-events-none">
          WLMD
        </div>
        
        {/* Abstract blue background shape */}
        <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-blue-200/50 to-transparent rounded-t-full z-0" />
        
        {/* Doctor image (placeholder) */}
        <div className="relative z-10 w-[80%] h-full">
          <Image
            src="/doctor/doc-2.jpg" 
            alt="Doctor"
            fill
            className="object-contain object-bottom drop-shadow-2xl"
          />
        </div>

        {/* Action Button */}
        <div className="absolute bottom-6 w-full z-20 px-2">
          <button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium py-3.5 rounded-full transition-all shadow-md shadow-blue-500/30">
            Book a consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
