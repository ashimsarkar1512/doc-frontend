"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetCategoryNamesQuery,
  useGetProductsByCategoryQuery,
} from "@/Redux/features/navbarServices/navbarServicesApi";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
}

interface ProductItem {
  id: string;
  name: string;
}

interface ServicesMegaMenuProps {
  variant?: "desktop" | "mobile";
}

const ServicesMegaMenu = ({ variant = "desktop" }: ServicesMegaMenuProps) => {
  const router = useRouter();

  // ✅ category names list
  const { data: categoriesRes } = useGetCategoryNamesQuery({});
  const categoryList: CategoryItem[] = categoriesRes?.data ?? [];

  // only holds an EXPLICIT hover selection — used for the preview list on the right
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null,
  );

  const currentCategoryId = hoveredCategoryId ?? categoryList[0]?.id ?? null;

  // ✅ products for the currently hovered category (preview only)
  const { data: productsRes, isLoading: productsLoading } =
    useGetProductsByCategoryQuery(currentCategoryId, {
      skip: !currentCategoryId,
    });

  const productList: ProductItem[] = productsRes?.data ?? [];

  const handleCategoryHover = (id: string) => {
    setHoveredCategoryId(id);
  };

  const isDesktop = variant === "desktop";

  return (
    <div
      className={
        isDesktop
          ? "w-[920px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-120px)] bg-white rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.14)] p-8 text-black overflow-y-auto"
          : "w-full bg-white rounded-[20px] shadow-lg p-5 text-black max-h-[calc(100vh-120px)] overflow-y-auto"
      }
    >
      <h3
        className={`font-bold text-[#111827] tracking-tight ${
          isDesktop ? "text-[26px] mb-7" : "text-[20px] mb-5"
        }`}
      >
        Medical Weight Management Program
      </h3>

      <div
        className={
          isDesktop
            ? "grid grid-cols-[190px_minmax(0,1fr)_220px] gap-0 items-start"
            : "flex flex-col gap-5"
        }
      >
        {/* Category pills */}
        <div
          className={
            isDesktop
              ? "flex flex-col items-start gap-2.5 pr-6 border-r border-[#E5E7EB]"
              : "flex flex-wrap gap-2"
          }
        >
          {categoryList.map((category) => {
            const isActive = category.id === currentCategoryId;

            return (
              <Link
                key={category.id}
                href={`/common-services/${category.id}`}
                onMouseEnter={() => handleCategoryHover(category.id)}
                className={`rounded-full font-medium transition-colors whitespace-nowrap ${
                  isDesktop ? "px-5 py-2 text-[14px]" : "px-4 py-2 text-[13px]"
                } ${
                  isActive
                    ? "bg-[#2b5ce7] text-white"
                    : "bg-[#E8E8E8] text-[#4B5563] hover:bg-[#DDDDDD]"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>

        {/* Service list — right side, preview based on hovered category */}
        <div className={isDesktop ? "px-8 min-h-[300px]" : "order-3"}>
          {productsLoading ? (
            <p className="text-[#9CA3AF] text-[14px]">Loading...</p>
          ) : productList.length === 0 ? (
            <p className="text-[#9CA3AF] text-[14px]">No products found</p>
          ) : (
            <ul className="space-y-3.5">
              {productList.map((product) => (
                <li
                  key={product.id}
                  className={`text-[#374151] leading-snug ${
                    isDesktop ? "text-[15px]" : "text-[14px]"
                  }`}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Image */}
        {/* <div
          className={
            isDesktop
              ? "relative w-full h-[280px] rounded-[18px] overflow-hidden flex items-center justify-center bg-gray-50"
              : "relative w-full h-[180px] rounded-[16px] overflow-hidden order-2 flex items-center justify-center bg-gray-50"
          }
        >
          <Image
            src="/doctor/doc-1.jpg"
            alt={activeCategory?.name ?? "Service"}
            fill
            className="object-cover object-center"
            sizes={isDesktop ? "220px" : "100vw"}
          />
        </div> */}
      </div>
    </div>
  );
};

export default ServicesMegaMenu;
