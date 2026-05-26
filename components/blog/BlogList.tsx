"use client";

import React, { useState } from "react";
import BlogCard, { BlogPost } from "./BlogCard";
import BlogSidebar from "./BlogSidebar";

const CATEGORIES = [
  "All Blogs",
  "Weight Loss",
  "Hormone Therapy",
  "Regrow Hair",
  "Men's Services",
  "Skin Services",
];

const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Sildenafil & Tadalafil: Treatment Options & Evaluation",
    image: "https://i.pinimg.com/736x/26/45/c5/2645c5de51ce043e2b8242b23f8b9fa1.jpg",
    category: "Men's Services",
    link: "/blog/1",
  },
  {
    id: "2",
    title: "3 Male Body Types: Ectomorph, Mesomorph, and Endomorph",
    image: "https://i.pinimg.com/736x/65/5d/65/655d65e0402c36b3fcc5f82d7840275d.jpg",
    category: "Weight Loss",
    link: "/blog/2",
  },
  {
    id: "3",
    title: "Protein and Hair Growth: Why It Matters for Healthy Hair",
    image: "https://i.pinimg.com/1200x/32/75/8c/32758c4905e2a04cc1a5e08695c36d28.jpg",
    category: "Regrow Hair",
    link: "/blog/3",
  },
  {
    id: "4",
    title: "Does Enclomiphene Increase Testosterone?",
    image: "https://i.pinimg.com/736x/da/fc/fa/dafcfa7b27d405d40a1e07e12bb8542d.jpg",
    category: "Hormone Therapy",
    link: "/blog/4",
  },
  {
    id: "5",
    title: "Does Shilajit Increase Testosterone Levels?",
    image: "https://i.pinimg.com/736x/79/c4/b2/79c4b28efedc81b65a4da922e8152ea5.jpg",
    category: "Hormone Therapy",
    link: "/blog/5",
  },
  {
    id: "6",
    title: "Enclomiphene Price Guide: Average Costs and Alternatives",
    image: "https://i.pinimg.com/736x/60/e9/bf/60e9bf6eae4a5de9b3b5e32e9b3e4e19.jpg",
    category: "Hormone Therapy",
    link: "/blog/6",
  },
];

const BlogList = () => {
  const [activeCategory, setActiveCategory] = useState("All Blogs");
  
  const filteredPosts =
    activeCategory === "All Blogs"
      ? MOCK_POSTS
      : MOCK_POSTS.filter((post) => post.category === activeCategory);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 mb-20">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          
          {/* Load More Button */}
          {filteredPosts.length > 0 && (
            <div className="flex justify-start mt-10">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-8 py-3 rounded-full transition-colors">
                Load More
              </button>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <BlogSidebar />
        </div>
      </div>
    </section>
  );
};

export default BlogList;
