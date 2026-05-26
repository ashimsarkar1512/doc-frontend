import Image from "next/image";
import React from "react";

const BlogHero = () => {
  return (
    <section className="relative bg-gray-100 max-w-7xl mx-auto rounded-2xl  pt-32 pb-16 md:pt-40 md:pb-24 px-4 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <Image
          src="/BLOGS.png"
          alt="Blogs watermark"
          width={1200}
          height={400}
          className="object-contain opacity-40 max-w-[90%] md:max-w-full"
          priority
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-medium text-gray-900 mb-6">
          Read our insights
        </h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Our medical weight management program is designed to support
          individuals seeking a structured, provider-guided approach to weight
          loss. Each
        </p>
      </div>
    </section>
  );
};

export default BlogHero;
