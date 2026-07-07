"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import ProductCard from "./ProductCard";
import { useGetPublicProductsQuery, useGetPublicCategoriesQuery } from "@/Redux/api/publicProductApi";
import FadeIn from "@/components/shared/animations/FadeIn";

const ProductsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("All Categories");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: fetchedCategories } = useGetPublicCategoriesQuery();
  
  const queryParams = useMemo(() => {
    const params: { search?: string; category?: string } = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategoryId) params.category = selectedCategoryId;
    return Object.keys(params).length > 0 ? params : undefined;
  }, [debouncedSearch, selectedCategoryId]);

  const { data: fetchedProducts, isLoading, error } = useGetPublicProductsQuery(queryParams);

  const products = useMemo(() => {
    if (!fetchedProducts) return [];
    
    return fetchedProducts.map((item) => {
      let desc = item.description || "";
      // strip HTML tags
      desc = desc.replace(/<[^>]*>?/gm, '');
      // replace common HTML entities
      desc = desc.replace(/&nbsp;/g, ' ');
      desc = desc.replace(/&amp;/g, '&');
      desc = desc.replace(/&lt;/g, '<');
      desc = desc.replace(/&gt;/g, '>');
      desc = desc.replace(/&quot;/g, '"');
      desc = desc.replace(/&#39;/g, "'");

      if (desc.length > 80) {
        desc = desc.substring(0, 80) + "..."; // truncate
      }

      return {
        id: item.id || item.slug,
        name: item.title,
        description: desc,
        image: item.image?.fileUrl || "/medicine-1.png",
        category: item.category?.name || "Uncategorized",
        assessments: item.assessments || [],
      };
    });
  }, [fetchedProducts]);

  const categories = useMemo(() => {
    const defaultCat = { id: "", name: "All Categories" };
    if (!fetchedCategories) return [defaultCat];
    return [defaultCat, ...fetchedCategories];
  }, [fetchedCategories]);

  return (
    <div className="w-full max-w-[1520px] mx-auto px-4 md:px-6 2xl:px-0! mb-[150px]">
      {/* Filters & Search Bar */}
      <FadeIn className="flex flex-row justify-between items-start sm:items-center gap-4 mb-10">
        {/* Search */}
        <div className="relative w-full sm:w-[320px] md:w-[400px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="sm:h-5 h-4 md:h-5 md:w-5 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search supplements"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F5F6] border-none rounded-full text-[15px] md:text-base lg:text-xl text[#3B3B3B] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
          />
        </div>

        {/* Categories Dropdown */}
        <div className="relative w-full sm:w-auto z-20">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full sm:w-auto px-4 md:px-5 py-2.5 bg-[#F4F5F6] rounded-full flex items-center justify-between gap-3 text-[15px] sm:text-base lg:text-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors focus:outline-none"
          >
            <span>{selectedCategoryName}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {isCategoryOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsCategoryOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-full sm:w-48 sm:min-w-[220px] bg-white border border-gray-100 rounded-2xl shadow-lg z-20 overflow-y-auto max-h-[350px] py-2">
                {categories.map((category) => (
                  <button
                    key={category.id || 'all'}
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                      setSelectedCategoryName(category.name);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-base lg:text-lg hover:bg-gray-50 transition-colors ${selectedCategoryId === category.id
                      ? "text-blue-600 font-medium bg-blue-50/50"
                      : "text-gray-700"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </FadeIn>

      {/* Product Grid */}
      {isLoading ? (
        <div className="w-full py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
        </div>
      ) : error ? (
        <div className="w-full py-20 flex justify-center items-center text-red-500">
          Failed to load products.
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-[30px]">
          {products.map((product, index) => (
            <FadeIn key={product.id} delay={index * 0.1}>
              <ProductCard
                id={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                assessments={product.assessments}
              />
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 text-lg">
            No supplements found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategoryId("");
              setSelectedCategoryName("All Categories");
            }}
            className="mt-4 text-blue-600 font-medium hover:underline text-xl"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
