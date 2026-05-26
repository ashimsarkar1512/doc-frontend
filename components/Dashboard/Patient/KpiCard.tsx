import { KpiCardProps } from '@/types/patientTypes';
import React from 'react';


export default function KpiCard({
  value,
  label,
  icon: Icon,
  bgColor,
  textColor,
  borderColor
}: KpiCardProps) {
  return (
    <div 
      className={`
        ${bgColor} ${borderColor} border rounded-[22px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]
        flex items-center justify-between transition-all duration-300 hover:shadow-md
      `}
    >
      <div className="flex flex-col gap-1.5">
        <span className={`text-[2.2rem] font-bold tracking-tight ${textColor} leading-none`}>
          {value}
        </span>
        <span className="text-[13px] font-medium text-gray-500 leading-none">
          {label}
        </span>
      </div>
      <div className={`p-3.5 bg-white/60 rounded-2xl border border-white/40 flex items-center justify-center`}>
        <Icon className={`h-6 w-6 ${textColor}`} />
      </div>
    </div>
  );
}
