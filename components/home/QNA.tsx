'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useHomepageContent } from "@/providers/HomepageContentProvider";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const defaultFaqData: FAQItem[] = [
  {
    id: '1',
    question: 'What weight loss treatments do you offer?',
    answer: 'We offer medically supervised weight loss programs that may include GLP-1 medications such as semaglutide and tirzepatide, appetite suppressants, B12 injections, lipotropic injections, nutritional guidance, and personalized wellness support. Treatment plans are customized based on your health goals and medical history.',
  },
  {
    id: '2',
    question: 'How do GLP-1 medications help with weight loss?',
    answer: 'GLP-1 medications mimic natural hormones that regulate appetite and blood sugar levels, helping you feel full longer and reducing cravings effectively.',
  },
  {
    id: '3',
    question: 'What is the difference between semaglutide and tirzepatide?',
    answer: 'While both target weight management receptors, semaglutide mimics one metabolic hormone (GLP-1), whereas tirzepatide mimics two (GLP-1 and GIP), sometimes offering slightly altered efficacy profiles.',
  },
  {
    id: '4',
    question: 'Do I need a prescription for weight loss medications?',
    answer: 'Yes, all powerful clinical weight loss options require a full diagnostic medical screening and a valid prescription from our certified clinical medical providers.',
  },
  {
    id: '5',
    question: 'Do you offer in-person consultations?',
    answer: 'We focus primarily on our seamless, continuous secure telehealth portal, allowing complete evaluation and follow-up care from the comfort of your home.',
  },
  {
    id: '6',
    question: 'How do I get started?',
    answer: 'Simply complete your basic intake profile questionnaire, pick a convenient time slot, and schedule your clinical evaluation with an expert medical provider.',
  },
];

const QNA: React.FC = () => {
  const { content, isLoading } = useHomepageContent();
  
  // Track open state using unique ID string or null for clean closing control
  const [openId, setOpenId] = useState<string | null>('1');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const apiFaqs = content?.faqs || [];
  
  const faqDataToDisplay = apiFaqs.length > 0
    ? [...apiFaqs].sort((a, b) => a.order - b.order).map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
      }))
    : defaultFaqData;

  // Set the first item as open by default when data loads
  React.useEffect(() => {
    if (faqDataToDisplay.length > 0 && !openId && !isLoading) {
      setOpenId(faqDataToDisplay[0].id);
    }
  }, [faqDataToDisplay, openId, isLoading]);

  return (
    <section className="w-full bg-[#121314] py-20 px-4 md:px-8 font-sans text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <h2 className="text-3xl md:text-[40px] font-normal text-center mb-16 tracking-tight">
          Frequently asked questions  
        </h2>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Accordion Stack */}
          <div className="lg:col-span-7 flex flex-col gap-3 w-full">
            {isLoading ? (
               [1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="h-16 bg-[#222426]/60 animate-pulse rounded-xl" />
               ))
            ) : (
              faqDataToDisplay.map((item) => {
                const isOpen = openId === item.id;
                
                return (
                  <div
                    key={item.id}
                    className="bg-[#222426]/60 rounded-xl overflow-hidden border border-gray-800/30 transition-colors duration-300"
                  >
                    {/* Trigger Banner */}
                    <button
                      onClick={() => toggleFAQ(item.id)}
                      className="w-full flex items-center justify-between p-5 text-left transition-colors duration-200 hover:bg-gray-800/20 group"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm md:text-base font-medium text-gray-100 group-hover:text-white tracking-tight transition-colors">
                        {item.question}
                      </span>
                      {/* State Symbol Indicator */}
                      <span className="text-xl font-light text-gray-400 select-none ml-4 flex-shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {/* Clean Hardware-Accelerated Dynamic Expanding Wrap */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-xs md:text-sm text-gray-400 leading-relaxed font-normal whitespace-pre-wrap">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Featured Callout Action Frame */}
          <div className="lg:col-span-5 w-full h-full relative group rounded-[2rem] overflow-hidden min-h-[460px] flex flex-col justify-end p-8 md:p-10 border border-gray-800/20 shadow-2xl">
            {/* Background Medical Art Vector Frame */}
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-103">
              <Image
                src="/QNA.png"
                alt="Medical Background"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {/* Dark Linear Vignette Layer to keep typography razor crisp */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

            {/* Callout Typography Stack */}
            <div className="relative z-10 flex flex-col gap-3">
              <h3 className="text-3xl md:text-4xl font-normal tracking-tight">
                Still have a Question?
              </h3>
              <p className="text-sm text-gray-300 font-light max-w-sm leading-relaxed mb-6">
                Everything you need to know before getting started.
              </p>
              
              <button
              onClick={() =>
            window.open(
              "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
              "_blank",
            )
          }
               className="w-fit bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 active:scale-97 shadow-lg shadow-blue-600/10">
                Book An Appointment
              </button>
            </div>
          </div>  

        </div>
      </div>
    </section>
  );
};

export default QNA;