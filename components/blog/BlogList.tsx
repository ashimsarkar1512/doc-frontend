"use client";

import React, { useState, useEffect } from "react";
import BlogCard, { BlogPost } from "./BlogCard";
import BlogSidebar from "./BlogSidebar";
import fallBackImg from "@/public/p-image-fallback.jpg";
import FadeIn from "@/components/shared/animations/FadeIn";

const BlogList = () => {
  const [activeCategory, setActiveCategory] = useState("All Blogs");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Blogs"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://prod.weightlossmdcherrycreek.com";
        baseUrl = baseUrl.replace(/\/$/, "");
        if (!baseUrl.includes("/api/v1")) {
          baseUrl = `${baseUrl}/api/v1`;
        }
        const res = await fetch(`${baseUrl}/public/blogs`);
        if (!res.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const responseData = await res.json();
        const data = responseData.data || [];

        const formattedPosts: BlogPost[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          image: item.featuredImage?.fileUrl || fallBackImg.src,
          category: item.category?.name || "Uncategorized",
          link: `/blog/${item.slug || item.id}`,
          providerImage: item.provider?.avatar?.fileUrl,
          providerName: item.provider?.name,
        }));

        setPosts(formattedPosts);

        const uniqueCategories = Array.from(new Set(formattedPosts.map((post) => post.category)));
        setCategories(["All Blogs", ...uniqueCategories]);

      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredPosts =
    activeCategory === "All Blogs"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 md:px-8 py-2 mb-20">
      {/* Category Filter */}
      <FadeIn className="flex overflow-x-auto md:flex-wrap items-center justify-start gap-2 mb-10 pb-2 md:pb-0 md:overflow-visible scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setVisibleCount(10);
            }}
            className={`shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${activeCategory === cat
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-[#E5E7EB] text-gray-700 hover:bg-gray-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </FadeIn>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayedPosts.map((post, index) => (
                  <FadeIn key={post.id} delay={index * 0.1}>
                    <BlogCard post={post} />
                  </FadeIn>
                ))}
              </div>

              {/* Load More Button */}
              {filteredPosts.length > visibleCount && (
                <div className="flex justify-start mt-10">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                    className="bg-[#E5E7EB] hover:bg-gray-300 text-gray-700 text-sm font-semibold px-8 py-2.5 rounded-full transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <BlogSidebar
          />
        </div>
      </div>
    </section>
  );
};

export default BlogList;
