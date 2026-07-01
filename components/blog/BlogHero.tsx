import Image from "next/image";

const BlogHero = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8">
      <section className="relative bg-[#EBEEF2] w-full rounded-[2rem] py-16 px-12 md:py-24 overflow-hidden flex flex-col items-center justify-center text-center min-h-[280px] md:min-h-[380px]">
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden px-12 md:px-20 py-8 md:py-12">
          <Image
            src="/BLOGS.png"
            alt=""
            fill
            className="object-contain object-center opacity-90 mt-3 md:mt-4"
            priority
          />
        </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center font-['Quicksand']">

  <h1 className="text-[40px] md:text-[76px] font-bold text-black mb-6 leading-[100%] tracking-tight">
    Read our insights
  </h1>

  <p className="max-w-[796px] mx-auto text-gray-700 text-base md:text-[20px] leading-[150%] tracking-tight">
    Our medical weight management program is designed to support individuals seeking
    a structured, provider-guided approach to weight loss. Each
  </p>
</div>
      </section>
    </div>
  );
};

export default BlogHero;