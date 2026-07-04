"use client";

import React from 'react';
import { useGetRequestRecordsContentQuery } from '@/Redux/features/records/recordsApi';

const InfoCards = () => {
  const { data: contentData, isLoading } = useGetRequestRecordsContentQuery();
  const widgets = contentData?.data ? [...contentData.data].sort((a, b) => a.order - b.order) : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Dynamic Cards */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-pulse">
            <div className="h-5 w-1/3 bg-slate-200 rounded" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-3/4 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-pulse">
            <div className="h-5 w-1/3 bg-slate-200 rounded" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-5/6 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      ) : widgets.length > 0 ? (
        widgets.map((widget) => {
          const isProcessingTime = widget.title.toLowerCase().includes('processing');
          const isHIPAARights = widget.title.toLowerCase().includes('hipaa');
          const items = [...widget.items].sort((a, b) => a.order - b.order);

          return (
            <div key={widget.id} className="bg-white border border-[#D1D5DC] rounded-[16px] p-[20px] shadow-sm flex flex-col items-start gap-3 w-full">
              <h3 
                className="text-[26px] font-bold text-slate-800 leading-none" 
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {widget.title}
              </h3>
              
              {isProcessingTime ? (
                <ul className="space-y-3 w-full">
                  {items.map((item) => {
                    const parts = item.text.split(':');
                    const label = parts[0]?.trim();
                    const value = parts.slice(1).join(':')?.trim();
                    
                    return (
                      <li key={item.id} className="text-[20px] text-[#3B3B3B] font-normal leading-none flex justify-between gap-4 w-full" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                        <span>{label}{value ? ':' : ''}</span>
                        {value && <span className="font-normal text-right">{value}</span>}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="space-y-4 w-full">
                  {items.map((item) => (
                    <li key={item.id} className="text-[20px] text-[#3B3B3B] font-normal leading-none" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })
      ) : (
        <>
          {/* Processing Time (Fallback) */}
          <div className="bg-white border border-[#D1D5DC] rounded-[16px] p-[20px] shadow-sm flex flex-col items-start gap-3 w-full">
            <h3 
              className="text-[26px] font-bold text-slate-800 leading-none" 
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Processing Time
            </h3>
            <ul className="space-y-4 w-full">
              <li className="text-[20px] text-[#3B3B3B] font-normal leading-none flex justify-between gap-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                <span>Medical Records:</span>
                <span className="font-normal text-right">Up to 30 days</span>
              </li>
              <li className="text-[20px] text-[#3B3B3B] font-normal leading-none flex justify-between gap-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                <span>Prescription History:</span>
                <span className="font-normal text-right">3-5 business days</span>
              </li>
              <li className="text-[20px] text-[#3B3B3B] font-normal leading-none flex justify-between gap-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                <span>Billing Records:</span>
                <span className="font-normal text-right">1-3 business days</span>
              </li>
              <li className="text-[20px] text-[#3B3B3B] font-normal leading-none flex justify-between gap-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                <span>Account Deletion:</span>
                <span className="font-normal text-right">Up to 45 days</span>
              </li>
            </ul>
          </div>

          {/* HIPAA Rights (Fallback) */}
          <div className="bg-white border border-[#D1D5DC] rounded-[16px] p-[20px] shadow-sm flex flex-col items-start gap-3 w-full">
            <h3 
              className="text-[26px] font-bold text-slate-800 leading-none" 
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              HIPAA Rights 
            </h3>
            <ul className="space-y-4 w-full">
              <li className="text-[20px] text-[#3B3B3B] font-normal leading-none" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                Right to access your medical records
              </li>
              <li className="text-[20px] text-[#3B3B3B] font-normal leading-none" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                Right to request corrections
              </li>
              <li className="text-[20px] text-[#3B3B3B] font-normal leading-none" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                Right to receive an accounting of disclosures
              </li>
              <li className="text-[20px] text-[#3B3B3B] font-normal leading-none" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                Right to restrict certain uses
              </li>
              <li className="text-[20px] text-[#3B3B3B] font-normal leading-none" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                Right to receive records in electronic format
              </li>
            </ul>
          </div>
        </>
      )}

      {/* Need Help? */}
      <div className="bg-white border border-[#D1D5DC] rounded-[16px] p-[20px] shadow-sm flex flex-col items-start gap-3 w-full">
        <h3 
          className="text-[26px] font-bold text-slate-800 leading-none" 
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          Need Help?
        </h3>
        <p className="text-[20px] text-slate-600 leading-none font-normal" style={{ fontFamily: 'Quicksand, sans-serif' }}>
          Contact our Privacy Officer for assistance with records requests.
        </p>
        <div className="space-y-1">
          <p className="text-[20px] font-normal text-slate-900 leading-none" style={{ fontFamily: 'Quicksand, sans-serif' }}>privacy@weightlossmd.com</p>
          <p className="text-[20px] font-normal text-slate-900 leading-none" style={{ fontFamily: 'Quicksand, sans-serif' }}>1-800-555-0177</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
