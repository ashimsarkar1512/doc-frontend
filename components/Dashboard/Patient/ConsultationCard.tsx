import React from 'react';
import Image from 'next/image';
import { Consultation } from '@/types/patientTypes';


interface ConsultationCardProps {
  consultation: Consultation;
  onOpen?: (id: string) => void;
}

export default function ConsultationCard({ consultation, onOpen }: ConsultationCardProps) {
  const statusColors: Record<string, string> = {
    ACCEPTED: 'bg-[#10b981]/90',
    PENDING: 'bg-[#f59e0b]/90',
    REJECTED: 'bg-[#ef4444]/90',
    DRAFT: 'bg-[#6b7280]/90',
    REVIEWED: 'bg-[#3b82f6]/90',
    REFIL_REQUESTED: 'bg-[#8b5cf6]/90',
  };

  return (
    <div className="flex flex-col group w-full">
      {/* Image Container with pill status tag */}
      <div className="relative w-full h-[340px] rounded-[24px] overflow-hidden bg-gray-50">
        <Image
          src={consultation.image}
          alt={consultation.title}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          unoptimized
        />
        
        {/* Pill Badge */}
        <span className={`absolute top-4 left-4 px-3.5 py-1 text-xs font-semibold rounded-full shadow-sm select-none text-white backdrop-blur-[1px] ${statusColors[consultation.status]}`}>
          {consultation.status}
        </span>
      </div>

      {/* Card Detail Content */}
      <div className="flex flex-col items-start mt-[16px]">
        {/* Category Badge */}
        <span className="inline-flex items-center justify-center gap-[15px] px-[12px] py-[8px] text-[16px] font-[Quicksand] font-normal leading-[100%] text-[#272628] bg-[#EAF3FF] rounded-[46px] mb-[8px]">
          {consultation.category}
        </span>
        
        {/* Title */}
        <h3 className="text-[24px] font-bold text-[#272628] font-[Quicksand] leading-[150%] group-hover:text-[#1D4ED8] transition-colors mb-[8px]">
          {consultation.title}
        </h3>
        
        {/* Subtitle / Doctor */}
        <p className="text-[20px] text-[#272628] font-[Quicksand] font-normal leading-[100%] mb-[16px]">
          Approved: Dr. Runa Pradhan NP
        </p>

        {/* Action Button */}
        <button 
          onClick={() => onOpen?.(consultation.id)}
          className="inline-flex items-center justify-center px-[18px] h-[42px] bg-[#2558E5] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-[Quicksand] font-medium text-[18px] leading-[100%] rounded-[50px] transition-all text-center"
        >
          Open Consultation
        </button>
      </div>
    </div>
  );
}
