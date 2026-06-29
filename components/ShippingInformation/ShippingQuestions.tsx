"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const questions = [
  {
    question: "Can I ship to a PO Box?",
    answer: "Yes, standard shipping applies to PO Boxes, standard delivery timelines may be slightly longer depending on the pharmacy."
  },
  {
    question: "What if my medication is damaged during shipping?",
    answer: "If your medication arrives damaged, please contact our support team immediately with photos of the damaged package and contents. We will arrange a replacement at no additional cost."
  },
  {
    question: "Can I ship to a different address than mine?",
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
    <section className="w-full max-w-6xl mx-auto px-4 mt-16 mb-20">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-slate-900 mb-10">
        Shipping Questions
      </h2>
      
      <div className="flex flex-col gap-3">
        {questions.map((q, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="bg-slate-100 rounded-xl overflow-hidden transition-colors hover:bg-slate-200/60"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-medium text-slate-800 text-[15px]">
                  {q.question}
                </span>
                <span className="text-slate-400 shrink-0 ml-4">
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
                    <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed">
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
