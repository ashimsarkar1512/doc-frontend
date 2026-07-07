"use client";

import React from 'react';
import { Shield } from 'lucide-react';
import { useGetShippingInfoQuery } from '@/Redux/features/shipping/shippingApi';
import FadeIn from '@/components/shared/animations/FadeIn';

// Colors for the step bars cycling through
const STEP_COLORS = [
  'bg-[#1A5C8A]',
  'bg-[#22A87A]',
  'bg-[#2E86C1]',
  'bg-[#1A5C8A]',
  'bg-[#22A87A]',
];

const ShippingTimeline = () => {
  const { data, isLoading } = useGetShippingInfoQuery();
  const timelineSection = data?.shippingTimelineSection;
  const policySection = data?.shippingPolicySection;

  const steps = timelineSection?.steps ?? [];
  const policies = policySection?.policies ?? [];
  const disclaimerTitle = policySection?.disclaimerTitle ?? 'Prescription & Pharmacy Disclosure:';
  const disclaimerDescription = policySection?.disclaimerDescription ?? '';

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 mt-10 mb-6 flex flex-col items-center">
      {/* ── Shipping Timeline ── */}
      <FadeIn>
      <h2
        className="text-[54px] font-semibold text-center text-[#272628] mb-3"
        style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '110%' }}
      >
        {timelineSection?.title ?? 'Shipping Timeline'}
      </h2>
      <p
        className="text-center text-[#272628] text-[20px] font-normal mb-10 max-w-3xl mx-auto"
        style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
      >
        {timelineSection?.description ?? 'Timelines are estimates. Expedited options may be available. Cold-chain medications may require signature.'}
      </p>
      </FadeIn>

      {/* Step bars */}
      <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-[16px] px-8 py-8 mb-6 w-full">
        {isLoading ? (
          <div className="flex gap-4 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4">
                <div className="w-full h-[6px] rounded-full bg-slate-200" />
                <div className="h-4 w-16 bg-slate-200 rounded" />
                <div className="h-3 w-12 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 items-start w-full">
            {steps.map((step, index) => (
              <FadeIn key={step.id} delay={index * 0.1} yOffset={20} className="flex-1 flex flex-col items-center gap-4">
                <div className={`w-full h-[6px] rounded-full ${STEP_COLORS[index % STEP_COLORS.length]}`} />
                <div className="flex flex-col items-center gap-1 mt-1">
                  <p
                    className="text-[17px] font-semibold text-[#272628] text-center"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {step.title}
                  </p>
                  <p
                    className="text-[16px] text-[#6B7280] text-center"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      {/* ── Shipping Policy ── */}
      <div className="mt-10 mb-4 w-full flex flex-col items-center">
        <FadeIn>
        <h2
          className="text-[54px] font-semibold text-[#272628] mb-6 text-center"
          style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '110%' }}
        >
          {policySection?.title ?? 'Shipping Policy'}
        </h2>
        </FadeIn>

        {isLoading ? (
          <div className="flex flex-col gap-3 w-full animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-[72px] rounded-[16px] bg-slate-100 border border-[#E2E8F0]" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {policies.map((policy, index) => (
              <FadeIn key={policy.id} delay={index * 0.1}>
              <div
                className="flex items-center gap-[12px] p-[24px] rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC]"
              >
                <div className="w-2 h-2 rounded-full bg-[#22A87A] shrink-0" />
                <span
                  className="text-[20px] text-[#3B3B3B] font-normal leading-[1.5]"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {policy.text}
                </span>
              </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      {/* ── Disclaimer ── */}
      {(disclaimerTitle || disclaimerDescription) && (
        <FadeIn delay={0.2} yOffset={20} className="w-full">
        <div className="bg-[#FFF5F5] rounded-[16px] px-[20px] py-[30px] mt-[40px] mb-[60px] flex items-start gap-[12px] w-full border border-[#FF778E]/20">
          <Shield className="w-6 h-6 text-[#FF173E] flex-shrink-0 mt-0.5 stroke-[1.8]" />
          <p className="leading-[1.5] m-0" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            {disclaimerTitle && (
              <strong className="text-[#FF173E] text-[20px] font-semibold mr-1">
                {disclaimerTitle}
              </strong>
            )}
            {disclaimerDescription && (
              <span className="text-[#272628] text-[20px] font-normal">
                {disclaimerDescription}
              </span>
            )}
          </p>
        </div>
        </FadeIn>
      )}
    </section>
  );
};

export default ShippingTimeline;
