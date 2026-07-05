"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const questions = [
  {
    question: "Can I ship to a P.O. box?",
    answer: "Medications requiring cold storage cannot be shipped to P.O. boxes. Standard medications may be shipped to P.O. boxes depending on the pharmacy."
  },
  {
    question: "What if my medication is damaged during shipping?",
    answer: "If your medication arrives damaged, please contact our support team immediately with photos of the damaged package and contents. We will arrange a replacement at no additional cost."
  },
  {
    question: "Can I ship to a different address each time?",
    answer: "Yes, you can update your shipping address in your patient portal before your order processes. Note that we can only ship to states where our providers are licensed."
  },
  {
    question: "Do you ship internationally?",
    answer: "At this time, we only ship within the United States. We cannot ship internationally or to US territories."
  }
];

const ShippingQuestions = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 mt-16 mb-20 flex flex-col items-center">
      <h2 
        className="text-[30px] font-semibold text-center text-slate-900 mb-10"
        style={{ fontFamily: 'Quicksand, sans-serif' }}
      >
        Shipping Questions
      </h2>
      
      <div className="flex flex-col gap-3 w-full">
        {questions.map((q, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] overflow-hidden transition-colors hover:bg-slate-100"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span 
                  className="font-medium text-[#272628] text-[20px]"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {q.question}
                </span>
                <span className="text-slate-500 shrink-0 ml-4">
                  {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </span>
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div 
                      className="px-6 pb-6 text-[#3B3B3B] text-[17px] leading-[1.5]"
                      style={{ fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {q.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ShippingQuestions;
