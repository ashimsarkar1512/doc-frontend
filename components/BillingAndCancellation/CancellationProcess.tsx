"use client";

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useGetBillingCancellationQuery } from '@/Redux/features/billing/billingApi';

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
    <section className="w-full max-w-[1520px] mx-auto px-4 mt-16 flex flex-col items-center">

      {/* ── Heading ── */}
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

      {/* ── Cancellation steps — horizontal card row ── */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full mb-12 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[140px] rounded-[16px] bg-slate-100 border border-[#E2E8F0]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full mb-12">
          {cancelSteps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-3 px-4 py-6 bg-[#F1F5F9] border border-[#E2E8F0] rounded-[16px]"
            >
              {/* Step number circle */}
              <div
                className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-semibold text-[14px] shrink-0"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {index + 1}
              </div>
              {/* Step text */}
              <p
                className="text-[#3B3B3B] text-[17px] font-normal"
                style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Refund policy grid ── */}
      <div className="w-full">
        {isLoading ? (
          <div className="h-[200px] rounded-[16px] bg-slate-100 animate-pulse" />
        ) : (
          <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white mb-16">

            {/* Eligible */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-[#E2E8F0]">
              <h4
                className="text-[#272628] font-semibold text-[30px] mb-8"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {refundEligibleTitle}
              </h4>
              <ul className="flex flex-col gap-6">
                {refundEligibleConditions.map((condition, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#22A87A] mt-2 shrink-0" />
                    <span
                      className="text-[#3B3B3B] text-[20px] font-normal"
                      style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
                    >
                      {condition}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Eligible */}
            <div className="p-8">
              <h4
                className="text-[#272628] font-semibold text-[30px] mb-8"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {refundNotEligibleTitle}
              </h4>
              <ul className="flex flex-col gap-6">
                {refundNotEligibleConditions.map((condition, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#FF173E] mt-2 shrink-0" />
                    <span
                      className="text-[#3B3B3B] text-[20px] font-normal"
                      style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '150%' }}
                    >
                      {condition}
                    </span>
                  </li>
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
