import React from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogCTA from "@/components/blog/BlogCTA";
import { notFound } from "next/navigation";
import fallBackImg from "@/public/p-image-fallback.jpg";

function getApiUrl(slug: string): string {
  let baseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://prod.weightlossmdcherrycreek.com";
  baseUrl = baseUrl.replace(/\/$/, "");
  if (!baseUrl.includes("/api/v1")) {
    baseUrl = `${baseUrl}/api/v1`;
  }
  return `${baseUrl}/public/blogs/${slug}`;
}

export async function generateMetadata({ params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.id;
    const url = getApiUrl(slug);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return { title: "Blog Details - Weight Loss MD & Wellness" };
    const responseData = await res.json();
    const blog = responseData.data;
    if (!blog) return { title: "Blog Details - Weight Loss MD & Wellness" };
    return {
      title: `${blog.title} - Weight Loss MD & Wellness`,
      description:
        blog.category?.name ||
        "Read our latest insights on medical weight management.",
    };
  } catch (error) {
    return { title: "Blog Details - Weight Loss MD & Wellness" };
  }
}

export default async function BlogDetailsPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const slug = resolvedParams.id;
  const url = getApiUrl(slug);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const res = await fetch(url, {
    next: { revalidate: 60 },
    signal: controller.signal,
  }).catch(() => null);
  clearTimeout(timeoutId);

  if (!res || !res.ok) {
    notFound();
  }

  const responseData = await res.json().catch(() => null);
  const blog = responseData?.data;

  if (!blog) {
    notFound();
  }

  const publishedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const imageUrl = blog.featuredImage?.fileUrl || fallBackImg.src;

  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar
        variant="dark"
        initialPadding="pt-5 pb-4"
        scrolledPadding="py-2"
      />
      <div className="xl:lg:pt-20 p-9" />

      {/* Hero Image Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={blog.title || "Blog Image"}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2 flex flex-col min-w-0 overflow-hidden">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">Published:</span>{" "}
                {publishedDate}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Category:</span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                  {blog.category?.name || "Uncategorized"}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
              {blog.title}
            </h1>

            {/* Article Body */}
            <div
              className="prose prose-lg max-w-none text-gray-600 custom-blog-content whitespace-pre-wrap break-words min-w-0"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar
            
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <BlogCTA />
    </main>
  );
}
