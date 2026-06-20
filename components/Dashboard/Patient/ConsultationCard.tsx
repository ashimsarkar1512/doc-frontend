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
    <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Image Container with pill status tag */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
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
      <div className="p-5 flex-1 flex flex-col">
        {/* Category Badge */}
        <span className="text-[11px] font-bold text-blue-600 bg-blue-50/60 border border-blue-100/30 px-2.5 py-1 rounded-full self-start mb-3 uppercase tracking-wider">
          {consultation.category}
        </span>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors mb-1">
          {consultation.title}
        </h3>
        
        {/* Subtitle / ID */}
        <p className="text-xs text-gray-400 font-light mb-6">
          Consultation id: {consultation.code || consultation.id}
        </p>

        {/* Action Button */}
        <button 
          onClick={() => onOpen?.(consultation.id)}
          className="w-full py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold rounded-xl text-xs shadow-sm hover:shadow transition-all duration-150 text-center mt-auto"
        >
          Open Consultation
        </button>
      </div>
    </div>
  );
}
