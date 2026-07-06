"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import CommonHero from "@/components/shared/CommonHero";
import ProductsList from "@/components/supplements/ProductsList";

export default function SupplementsPage() {
  return (
    <div className="w-full bg-white text-gray-900 font-sans overflow-x-clip min-h-screen flex flex-col">
      <Navbar
        variant="dark"
        initialPadding="pt-5 pb-4"
        scrolledPadding="py-2"
      />

      <CommonHero 
        title="Supplements"
        description="Support your body with high-quality supplements designed to meet your daily nutritional needs. Carefully selected ingredients help promote overall wellness and balance."
        watermarkImage="/supplements/Supplements.png"
      />
      <ProductsList />
    </div>
  );
}
