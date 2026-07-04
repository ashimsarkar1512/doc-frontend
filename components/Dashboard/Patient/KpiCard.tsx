import { KpiCardProps } from "@/types/patientTypes";
import React from "react";

export default function KpiCard({
  value,
  label,
  icon: Icon,
  bgColor,
  textColor,
  borderColor,
}: KpiCardProps) {
  return (
    <div
      className={`
        ${bgColor} ${borderColor} border rounded-[22px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]
         transition-all duration-300 hover:shadow-md
      `}
    >
      <div className="flex justify-between items-center mb-[13px]">
        <span
          className={`text-[40px] font-bold tracking-tight ${textColor} leading-[110%] font-[Quicksand]`}
        >
          {value}
        </span>

          <Icon className={`h-10 w-10 ${textColor}`} />
      </div>
      <span className="text-[20px] font-medium text-[#272628] leading-[100%] font-[Quicksand]">
        {label}
      </span>
     
    </div>
  );
}
