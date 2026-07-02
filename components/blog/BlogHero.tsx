import Image from "next/image";

const BlogHero = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8">
      <section className="relative bg-[#EBEEF2] w-full rounded-[2rem] py-20 px-8 md:py-28 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden px-2 md:px-4 py-12 md:py-16">
          <Image
            src="/BLOGS.png"
            alt="Blogs watermark"
            fill
            className="object-contain object-center"
            priority
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-gray-900 mb-4 tracking-tight">
            Read our insights
          </h1>
          <p className="text-gray-500 text-sm md:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
            Our medical weight management program is designed to support individuals seeking
            <br className="hidden md:block" /> a structured, provider-guided approach to weight loss. Each
          </p>
        </div>
      </section>
    </div>
  );
};

export default BlogHero;
