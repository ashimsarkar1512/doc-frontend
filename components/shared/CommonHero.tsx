import React from 'react';
import Image from 'next/image';

interface CommonHeroProps {
  title: string;
  description: string;
  watermarkImage: string;
}

const CommonHero: React.FC<CommonHeroProps> = ({ title, description, watermarkImage }) => {
  return (
    <div className="w-full px-4 md:px-6 mt-28 pb-20 flex justify-center">
      <div className="max-w-[1520px] mx-auto w-full relative rounded-[2.5rem] overflow-hidden bg-[#F2F4F7] py-16 md:py-28 px-6 md:px-16 flex flex-col items-center justify-center text-center min-h-[300px] md:min-h-[400px]">
        {/* Watermark - PNG Image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden p-5">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={watermarkImage}
              alt={`${title} watermark`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto mt-4 md:mt-8">
          <h1 className="text-[42px] md:text-[62px] lg:text-[76px] font-bold text-[#2A2B2C] leading-[1.1] tracking-tight mb-5 ">
            {title}
          </h1>
          <p className="text-gray-500 text-base md:text-xl leading-relaxed max-w-[700px] mx-auto">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommonHero;
