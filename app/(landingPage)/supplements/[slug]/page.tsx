import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import AssessmentButton from "@/components/supplements/AssessmentButton";

function getApiUrl(slug: string): string {
  let baseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://prod.weightlossmdcherrycreek.com";
  baseUrl = baseUrl.replace(/\/$/, "");
  if (!baseUrl.includes("/api/v1")) {
    baseUrl = `${baseUrl}/api/v1`;
  }
  return `${baseUrl}/public/products/${slug}`;
}

export async function generateMetadata({ params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const url = getApiUrl(slug);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return { title: "Supplement Details - Weight Loss MD & Wellness" };
    const responseData = await res.json();
    const product = responseData.data || responseData;
    if (!product) return { title: "Supplement Details - Weight Loss MD & Wellness" };
    return {
      title: `${product.title} - Supplements - Weight Loss MD & Wellness`,
      description: product.category?.name || "Premium supplements",
    };
  } catch (error) {
    return { title: "Supplement Details - Weight Loss MD & Wellness" };
  }
}

export default async function ProductDetailsPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
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
  const product = responseData?.data || responseData;

  if (!product) {
    notFound();
  }

  const imageUrl = product.image?.fileUrl || "/medicine-1.png";

  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      <Navbar
        variant="dark"
        initialPadding="pt-5 pb-4"
        scrolledPadding="py-2"
      />

      {/* Spacer for fixed navbar */}
      <div className="pt-24  p-9" />

      <section className="w-full max-w-[1520px] mx-auto px-4 md:px-6 2xl:px-0! pb-[120px]">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/supplements"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Supplements
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#272628] leading-tight mb-[30px]">
          {product.title}
        </h1>

        <div className="w-full max-w-[1520px]">

          <div className="">

            {/* Image Section */}
            <div className="w-full md:w-[515px] shrink-0">
              <div
                className="relative w-full md:w-[515px] h-[260px] md:h-[365px] rounded-2xl overflow-hidden flex items-center justify-center p-6 shadow-sm"
                style={{ backgroundColor: "#2A333C" }}
              >
                <div className="relative w-full h-full drop-shadow-xl">
                  <Image
                    src={imageUrl}
                    alt={product.title || "Product Image"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 515px"
                    priority
                  />
                </div>
              </div>

            </div>
            {/* Variants / Available sizes */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4 mb-[30px]">
                <p className="text-base md:text-[20px] text-[#3a3b3b]">
                  <span className="font-semibold">Available size: </span>
                  {product.variants.map((v: any, i: number) => (
                    <span key={i}>
                      {v.size}{v.unit ? v.unit : ""}
                      {i < product.variants.length - 1 ? " / " : ""}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {/* Details Section */}
            <div className="w-full">
              <div
                className="product-description"
                dangerouslySetInnerHTML={{
                  __html: product.description || ""
                }}
              />
            </div>

          </div>

          {/* Assessment Button - bottom of everything */}
          <div className="mt-[34px]">
            <AssessmentButton
              assessments={product.assessments || []}
              baseUrl=""
              label="Start Assessment"
            />
          </div>

        </div>
      </section>
    </main>
  );
}
