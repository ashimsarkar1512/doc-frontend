"use client";

import React from 'react';
import Image from 'next/image';
import { useGetBillingCancellationQuery } from '@/Redux/features/billing/billingApi';

// Icon mapping by index (cycles if more than 4 steps)
const STEP_ICONS = [
  <Image key="card" src="/card.png" alt="Card" width={32} height={32} className="object-contain" />,
  <Image key="docp" src="/docp.png" alt="Provider" width={32} height={32} className="object-contain" />,
  <Image key="calendar" src="/calendar.png" alt="Calendar" width={32} height={32} className="object-contain" />,
  <Image key="refresh" src="/refresh.png" alt="Refresh" width={32} height={32} className="object-contain" />,
];

const BillingTimeline = () => {
  const { data, isLoading } = useGetBillingCancellationQuery();

  const title = data?.timelineTitle ?? 'Billing Timeline';
  const steps = data?.timelineSteps ?? [];
  const disclaimerTitle = data?.timelineDisclaimerTitle ?? '';
  const disclaimerDescription = data?.timelineDisclaimerDescription ?? '';

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 mt-16 flex flex-col items-center">
      {/* Title */}
      <h2
        className="text-[54px] font-semibold text-center text-[#272628] mb-10"
        style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '110%' }}
      >
        {title}
      </h2>

      {/* Step cards grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mb-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[160px] rounded-[16px] bg-slate-100 border border-[#E2E8F0]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-[20px] p-[24px] bg-[#F1F5F9] border border-[#E2E8F0] rounded-[16px] text-center min-h-[179px]"
            >
              {/* Icon */}
              <div>
                {STEP_ICONS[index % STEP_ICONS.length]}
              </div>
              {/* Day label */}
              <p
                className="text-[#0D2137] font-bold text-[22px]"
                style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '27px' }}
              >
                {step.step}
              </p>
              {/* Description */}
              <p
                className="text-[#3B3B3B] text-[20px] font-normal"
                style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer box */}
      {(disclaimerTitle || disclaimerDescription) && (
        <div className="bg-[#F1F5F9] rounded-[16px] p-[20px] mt-[40px] mb-10 w-full border border-[#E2E8F0]">
          {disclaimerTitle && (
            <p
              className="text-[#272628] font-bold text-[20px] mb-2"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              {disclaimerTitle}
            </p>
          )}
          {disclaimerDescription && (
            <p
              className="text-[#3B3B3B] text-[20px] font-normal"
              style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
            >
              {disclaimerDescription}
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default BillingTimeline;
