"use client";

import React from 'react';
import { CreditCard, Stethoscope, Package, RefreshCw, Shield } from 'lucide-react';
import { useGetBillingCancellationQuery } from '@/Redux/features/billing/billingApi';

// Icon mapping by index (cycles if more than 4 steps)
const STEP_ICONS = [
  <CreditCard key="card" className="w-7 h-7 text-[#C9A84C]" />,
  <Stethoscope key="steth" className="w-7 h-7 text-[#C9A84C]" />,
  <Package key="pkg" className="w-7 h-7 text-[#8B9BAD]" />,
  <RefreshCw key="refresh" className="w-7 h-7 text-[#6B8CAE]" />,
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
              className="flex flex-col items-center justify-center gap-3 px-6 py-8 bg-[#F1F5F9] border border-[#E2E8F0] rounded-[16px] text-center"
            >
              {/* Icon */}
              <div className="mb-1">
                {STEP_ICONS[index % STEP_ICONS.length]}
              </div>
              {/* Day label */}
              <p
                className="text-[#272628] font-bold text-[22px]"
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
        <div className="bg-[#F1F5F9] rounded-[16px] px-[24px] py-[20px] mt-2 mb-10 w-full border border-[#E2E8F0]">
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
