"use client";

import React from "react";
import Image from "next/image";
import { useGetContactSideWidgetQuery } from "@/Redux/features/contact/contactApi";

export default function OfficeHoursCard() {
  const { data: widgetData, isLoading: isWidgetLoading } = useGetContactSideWidgetQuery();

  return (
    <div className="lg:col-span-1 h-[540px] mt-9 sticky top-24 self-start">
      <div
        className="rounded-[24px] overflow-hidden flex flex-col items-center pt-10 relative h-full border border-gray-200"
        style={{ background: "#eef2f6" }}
      >
        <div className="text-center px-6 relative z-10 w-full mb-6">
          <h3 className="font-bold text-[#212121] text-[30px] mb-4 tracking-tight">
            {widgetData?.title || "Office Hours"}
          </h3>
          {isWidgetLoading ? (
            <div className="space-y-2 mb-5">
              <div className="h-4 w-3/4 mx-auto bg-gray-300/60 rounded animate-pulse" />
              <div className="h-3 w-full bg-gray-300/40 rounded animate-pulse" />
              <div className="h-3 w-4/5 mx-auto bg-gray-300/40 rounded animate-pulse" />
              <div className="h-3 w-2/3 mx-auto bg-gray-300/40 rounded animate-pulse mt-2" />
            </div>
          ) : (
            <>
              <p className="text-lg text-[#272628] mb-2 font-semibold">
                {widgetData?.opening || "Monday - Friday: 9 AM - 6 PM"}
              </p>

              <p className="text-lg text-[#3B3B3B] mb-5 leading-relaxed max-w-[280px] mx-auto">
                {widgetData?.offDay || "Our Office is closed from 2 PM to 3 PM for lunch during the week."}
              </p>

              <div className="text-lg font-bold text-[#272628] flex justify-center gap-4 items-center gap-1.5 z-20">
                <span>{widgetData?.phone || "(720) 279-1164"}</span>
                <span>{widgetData?.email || "Info@wlmd.net"}</span>
              </div>
            </>
          )}
        </div>
        <div className="absolute bottom-[180px] left-0 right-0 text-center z-[1] pointer-events-none select-none">
          <span
            className="font-black tracking-[0.18em] uppercase"
            style={{
              fontSize: "clamp(64px, 8vw, 88px)",
              background:
                "linear-gradient(180deg, #a8c0e8 0%, rgba(168,192,232,0) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
              display: "block",
            }}
          >
            WLMD
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-[2] flex justify-center pointer-events-none">
          <div className="relative w-full h-[280px]">
            <Image
              src={widgetData?.image?.fileUrl || "/doctor-blog.png"}
              alt={widgetData?.title || "Doctor"}
              fill
              className="object-contain object-bottom drop-shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
