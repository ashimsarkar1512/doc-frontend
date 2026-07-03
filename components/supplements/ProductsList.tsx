"use client";

import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import ProductCard from "./ProductCard";

const mockProducts = [
  {
    id: 1,
    name: "GLP-1",
    description:
      "GLP-1 weight management options. Evaluation required. Medically supervised care. Results may vary.",
    image: "/medicine-1.png", // Ensure this image path corresponds to available images in your public folder
    category: "Weight Loss",
  },
  {
    id: 2,
    name: "Phentermine",
    description:
      "Phentermine weight management options. Evaluation required. Medically supervised care. Results may vary.",
    image: "/medicine-2.png",
    category: "Weight Loss",
  },
  {
    id: 3,
    name: "Phendimetrazine (Bontril)",
    description:
      "Phendimetrazine weight management options. Evaluation required. Medically supervised care. Results may vary.",
    image: "/medicine-3.png",
    category: "Appetite Suppressant",
  },
];

const categories = ["All Categories", "Weight Loss", "Appetite Suppressant"];

const ProductsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-[1520px] mx-auto px-4 md:px-6 2xl:px-0! mb-[150px]">
      {/* Filters & Search Bar */}
      <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-10">
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
            <span>{selectedCategory}</span>
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
              <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 overflow-hidden py-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-base lg:text-lg hover:bg-gray-50 transition-colors ${selectedCategory === category
                      ? "text-blue-600 font-medium bg-blue-50/50"
                      : "text-gray-700"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-[30px]">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              image={product.image}
            />
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
              setSelectedCategory("All Categories");
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
