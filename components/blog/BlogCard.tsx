"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import fallBackImg from "@/public/p-image-fallback.jpg";

export interface BlogPost {
  id: string;
  title: string;
  image: string;
  category: string;
  link: string;
  providerImage?: string;
  providerName?: string;
}

const BlogCard = ({ post }: { post: BlogPost }) => {
  const [imgSrc, setImgSrc] = useState(post.image || fallBackImg.src);

  return (
    <div className="flex flex-col bg-[#F3F4F6] p-4 rounded-3xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative w-full aspect-[1.5] overflow-hidden rounded-[1.25rem]">
        <Image
          src={imgSrc}
          alt={post.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => setImgSrc(fallBackImg.src)}
        />
      </div>
      <div className="p-3 pt-5 flex flex-col flex-grow">
        <h3 className="text-[1.1rem] md:text-lg font-bold text-gray-900 leading-snug mb-4 flex-grow">
          {post.title}
        </h3>
        <Link
          href={post.link}
          className="text-[#2563EB] text-sm font-semibold underline underline-offset-4 decoration-[#2563EB]/40 hover:decoration-[#2563EB] w-max transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
