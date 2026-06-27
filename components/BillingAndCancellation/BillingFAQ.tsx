"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "When is my card charged?",
    answer: "Your card is charged on the day you enroll and on the same calendar date each month thereafter. You'll receive an email receipt within minutes of each charge."
  },
  {
    question: "What does my membership fee include?",
    answer: "Your membership includes access to medical consultations, customized treatment plans, ongoing support, and medication shipped directly to you if prescribed."
  },
  {
    question: "Can I pause my membership?",
    answer: "Currently, we do not offer a pause option. However, you can cancel and re-enroll when you are ready to resume your weight loss journey."
  },
  {
    question: "How do I cancel?",
    answer: "You can easily cancel at any time through your account settings portal or by contacting our dedicated support team."
  },
  {
    question: "Do you offer refunds?",
    answer: "Refunds are processed according to our Refund Policy. Please review the 'Refund Policy' section above for specific eligibility criteria."
  }
];

const BillingFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mt-20 mb-16">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-slate-900 mb-10">
        Billing FAQ
      </h2>
      
      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="bg-slate-100 rounded-xl overflow-hidden transition-colors hover:bg-slate-200/60"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-medium text-slate-800 text-[15px]">
                  {faq.question}
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
                      {faq.answer}
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

export default BillingFAQ;
