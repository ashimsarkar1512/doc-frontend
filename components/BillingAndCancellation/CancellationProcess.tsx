"use client";

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useGetBillingCancellationQuery } from '@/Redux/features/billing/billingApi';
import FadeIn from '@/components/shared/animations/FadeIn';

const CancellationProcess = () => {
  const { data, isLoading } = useGetBillingCancellationQuery();

  const cancelTitle = data?.cancelTitle ?? 'Cancellation Process';
  const cancelDescription = data?.cancelDescription ?? '';
  const cancelSteps = data?.cancelSteps ?? [];
  const refundEligibleTitle = data?.refundEligibleTitle ?? 'Eligible for Refund';
  const refundEligibleConditions = data?.refundEligibleConditions ?? [];
  const refundNotEligibleTitle = data?.refundNotEligibleTitle ?? 'Not Eligible for Refund';
  const refundNotEligibleConditions = data?.refundNotEligibleConditions ?? [];

  return (
    <section className="w-full max-w-[1520px] mx-auto  mt-16 flex flex-col items-center">

      {/* ── Heading ── */}
      <FadeIn>
        <h2
          className="text-[54px] font-semibold text-[#272628] text-center mb-3"
          style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '110%' }}
        >
          {cancelTitle}
        </h2>
        {cancelDescription && (
          <p
            className="text-[#3B3B3B] text-[20px] font-normal text-center mb-10"
            style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
          >
            {cancelDescription}
          </p>
        )}
      </FadeIn>

      {/* ── Cancellation steps — horizontal card row ── */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full mb-12 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[140px] rounded-[16px] bg-slate-100 border border-[#E2E8F0]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[20px] w-full mb-12">
          {cancelSteps.map((step, index) => (
            <FadeIn key={index} delay={index * 0.1} yOffset={20}>
              <div
                className="flex flex-col items-center justify-center text-center gap-[20px] p-[24px] bg-[#F1F5F9] border border-[#E2E8F0] rounded-[16px] h-full"
              >
                {/* Step number circle */}
                <div
                  className="w-[30px] h-[30px] rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-semibold text-[14px] shrink-0"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {index + 1}
                </div>
                {/* Step text */}
                <p
                  className="text-[#272628] text-[20px] font-medium"
                  style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
                >
                  {step}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      {/* ── Refund policy grid ── */}
      <div className="w-full py-10 lg:py-[100px]">
        {isLoading ? (
          <div className="h-[200px] rounded-[16px] bg-slate-100 animate-pulse" />
        ) : (
          <div className="grid md:grid-cols-2 gap-y-12 gap-x-[30px] w-full">

            {/* Eligible */}
            <div className="flex flex-col">
              <FadeIn>
              <h4
                className="text-[#272628] font-semibold text-[54px] mb-[40px] text-center"
                style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '110%' }}
              >
                {refundEligibleTitle}
              </h4>
              </FadeIn>
              <ul className="flex flex-col gap-[30px]">
                {refundEligibleConditions.map((condition, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                  <li className="flex items-start gap-3 bg-[#F1F5F9] p-[24px] rounded-[16px]">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#22A87A] shrink-0 mt-[10px]" />
                    <span
                      className="flex-1 text-[#3B3B3B] text-[18px] font-normal"
                      style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
                    >
                      {condition}
                    </span>
                  </li>
                  </FadeIn>
                ))}
              </ul>
            </div>

            {/* Not Eligible */}
            <div className="flex flex-col">
              <FadeIn>
              <h4
                className="text-[#272628] font-semibold text-[54px] mb-[40px] text-center"
                style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '110%' }}
              >
                {refundNotEligibleTitle}
              </h4>
              </FadeIn>
              <ul className="flex flex-col gap-[30px]">
                {refundNotEligibleConditions.map((condition, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                  <li className="flex items-start gap-3 bg-[#F1F5F9] p-[24px] rounded-[16px]">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#FF173E] shrink-0 mt-[10px]" />
                    <span
                      className="flex-1 text-[#3B3B3B] text-[18px] font-normal"
                      style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
                    >
                      {condition}
                    </span>
                  </li>
                  </FadeIn>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>

    </section>
  );
};

export default CancellationProcess;
