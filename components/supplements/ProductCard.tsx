import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string | number;
  name: string;
  description: string;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, description, image }) => {
  return (
    <div className="flex flex-col group bg-white">
      {/* Product Image Container */}
      <div
        className="relative w-full aspect-square rounded-[40px] overflow-hidden mb-7"
        style={{
          background:
            "url('/productBg/bg.png') center/cover no-repeat, linear-gradient(180deg, #2B3239 0%, #2A394B 10%, #2C496D 20%, #2E5E99 30%, #3072C3 40%, #3584E4 50%, #5099F5 60%, #80B5FB 70%, #B6D5FD 80%, #E3EEFE 90%, #F3F8FF 100%)"
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105">
          <div className="relative w-full h-[88%]">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-1.5 flex-grow flex flex-col">
        {/* Title: Exactly 22px */}
        <h3 className="text-[22px] font-bold text-[#111827] mb-4 leading-tight">
          {name}
        </h3>

        {/* Description: Exactly 20px */}
        <p className="text-[#6B7280] text-lg md:text-[20px] font-light leading-relaxed mb-8 flex-grow">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-7 mt-auto pb-1">
          {/* Button text: Exactly 20px */}
          <button
            onClick={() =>
              window.open(
                "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
                "_blank"
              )
            }
            className="bg-[#0251D1] hover:bg-[#0241A7] text-white text-lg md:text-[20px] font-medium px-5 md:px-8 lg:px-5 xl:px-8 py-3 rounded-full transition-colors shadow-none"
          >
            Get Started
          </button>

          {/* Link text: Exactly 20px */}
          <Link
            href={`/supplements/${id}`}
            className="text-[#0251D1] hover:text-[#0241A7] text-lg md:text-[20px] font-medium underline underline-offset-4 transition-colors"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;