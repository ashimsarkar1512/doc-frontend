"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useGetBillingCancellationQuery } from '@/Redux/features/billing/billingApi';
import FadeIn from '@/components/shared/animations/FadeIn';

const BillingFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { data, isLoading } = useGetBillingCancellationQuery();

  const faqTitle = data?.faqTitle ?? 'Billing & Cancellation FAQ';
  const faqs = data?.faqs ?? [];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 mt-16 mb-16">
      <FadeIn>
      <h2
        className="text-[54px] font-semibold text-center text-[#272628] mb-10"
        style={{ fontFamily: 'Quicksand, sans-serif', lineHeight: '110%' }}
      >
        {faqTitle}
      </h2>
      </FadeIn>

      {isLoading ? (
        <div className="flex flex-col gap-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[64px] rounded-[16px] bg-slate-100 border border-[#E2E8F0]" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <FadeIn key={index} delay={index * 0.1} yOffset={20}>
              <div
                className="bg-[#F1F5F9] rounded-[16px] overflow-hidden border border-[#E2E8F0] transition-colors hover:bg-slate-200/60"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span
                    className="font-semibold text-[#272628] text-[20px]"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {faq.question}
                  </span>
                  <span className="text-[#6B7280] shrink-0 ml-4">
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div
                        className="px-6 pb-5 text-[#3B3B3B] text-[17px] leading-[1.6]"
                        style={{ fontFamily: 'Quicksand, sans-serif' }}
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </FadeIn>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default BillingFAQ;
