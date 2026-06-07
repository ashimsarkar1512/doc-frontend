import React from 'react';
import { Syringe, Stethoscope, Package, Lock } from 'lucide-react';

const timelineSteps = [
  {
    icon: <Syringe className="w-6 h-6 text-blue-600" />,
    day: 'Day 1',
    description: 'Enrolled in GLP-1/GIP',
  },
  {
    icon: <Stethoscope className="w-6 h-6 text-yellow-500" />,
    day: 'Day 24',
    description: 'Follow-up Consultations',
  },
  {
    icon: <Package className="w-6 h-6 text-slate-500" />,
    day: 'Day 28',
    description: 'Next Refill Ships',
  },
  {
    icon: <Lock className="w-6 h-6 text-blue-500" />,
    day: 'Day 30',
    description: 'Next Billing Cycle Starts',
  },
];

const BillingTimeline = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-16">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-slate-900 mb-8">
        Billing Timeline
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {timelineSteps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-3">{step.icon}</div>
            <div className="text-sm font-semibold text-blue-600 mb-1">{step.day}</div>
            <div className="text-sm text-slate-600 text-center font-medium">{step.description}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Auto-Renewal Policy</h3>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Your membership is billed monthly automatically based on your initial sign-up day. You will receive an email 2-4 days prior to your auto-renewal. You can cancel at any time before the renewal date through your account settings or by contacting our support team. Cancellations take effect at the end of your current billing cycle.
        </p>
      </div>
    </section>
  );
};

export default BillingTimeline;
