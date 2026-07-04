"use client";

import React from "react";
import Image from "next/image";
import { useGetContactPartnerSectionQuery } from "@/Redux/features/contact/contactApi";

export default function PartnerPharmacies() {
  const { data: partnerData, isLoading } = useGetContactPartnerSectionQuery();

  return (
    <section className="max-w-[1300px] mx-auto px-4 sm:px-6 mt-32 mb-16">
      <div className="relative flex items-center justify-center mb-14">
        <div
          className="absolute inset-0 flex items-center"
          aria-hidden="true"
        >
          <div className="w-full border-t border-dashed border-gray-200" />
        </div>
        <div className="relative bg-white px-5">
          <span className="text-gray-400 text-[13px] font-medium tracking-wide">
            {partnerData?.sectionTitle || "Our partner pharmacies"}
          </span>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center gap-x-12 gap-y-10 md:gap-x-16 lg:gap-x-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[140px] h-[60px] bg-gray-200 animate-pulse rounded-md" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 md:gap-x-16 lg:gap-x-20">
          {partnerData?.partners && partnerData.partners.length > 0 ? (
            partnerData.partners.map((partner) => (
              <div key={partner.id} className="relative w-[160px] h-[70px] flex items-center justify-center">
                {partner.image?.fileUrl ? (
                  <Image
                    src={partner.image.fileUrl}
                    alt="Partner Pharmacy"
                    fill
                    className="object-contain"
                  />
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm">No partner pharmacies found.</div>
          )}
        </div>
      )}
    </section>
  );
}
