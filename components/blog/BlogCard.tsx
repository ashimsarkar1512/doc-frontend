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
    <div className="flex flex-col bg-[#F3F4F6] rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={imgSrc}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => setImgSrc(fallBackImg.src)}
        />
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-medium text-gray-900 leading-snug mb-6 flex-grow">
          {post.title}
        </h3>
        <Link
          href={post.link}
          className="text-[#2563EB] text-sm font-semibold hover:underline w-max"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
