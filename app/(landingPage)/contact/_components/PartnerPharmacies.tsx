"use client";

import React from "react";
import Image from "next/image";
import { useGetContactPartnerSectionQuery } from "@/Redux/features/contact/contactApi";

export default function PartnerPharmacies() {
  const { data: partnerData, isLoading } = useGetContactPartnerSectionQuery();

  return (
    <section className="max-w-[1300px] mx-auto px-4 sm:px-6 ">
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
        <div className="flex justify-center items-center gap-x-12 gap-y-10 md:gap-x-16 lg:gap-x-20 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[140px] h-[60px] bg-gray-200 animate-pulse rounded-md flex-shrink-0" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden w-full relative group">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee-ltr {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0%); }
            }
            .animate-marquee-ltr {
              animation: marquee-ltr 40s linear infinite;
            }
          `}} />
          {partnerData?.partners && partnerData.partners.length > 0 ? (
            <div className="flex w-max animate-marquee-ltr gap-x-12 md:gap-x-16 lg:gap-x-20 hover:[animation-play-state:paused]">
              {Array(10)
                .fill(partnerData.partners)
                .flat()
                .map((partner, index) => (
                  <div
                    key={`${partner.id}-${index}`}
                    className="relative w-[120px] h-[50px] sm:w-[140px] sm:h-[60px] md:w-[160px] md:h-[70px] flex items-center justify-center flex-shrink-0"
                  >
                    {partner.image?.fileUrl ? (
                      <Image
                        src={partner.image.fileUrl}
                        alt="Partner Pharmacy"
                        fill
                        className="object-contain"
                      />
                    ) : null}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm text-center">No partner pharmacies found.</div>
          )}
        </div>
      )}
    </section>
  );
}
