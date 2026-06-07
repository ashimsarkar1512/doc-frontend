import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const cancellationSteps = [
  "Log into your Weight Loss MD account.",
  "Navigate to 'Account Settings' -> 'Membership'.",
  "Click 'Cancel Membership' and confirm your choice.",
  "You'll receive a confirmation email within minutes.",
  "Access continues until end of billing period."
];

const CancellationProcess = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
          Cancellation Process
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          Simple, transparent process to no-hassles.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex flex-col gap-4">
          {cancellationSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-medium text-sm shrink-0">
                {index + 1}
              </div>
              <p className="text-slate-700 text-sm md:text-base">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800">
          <span className="text-slate-400">↻</span> Refund Policy
        </h3>
        
        <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
          {/* Eligible */}
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200">
            <h4 className="flex items-center gap-2 text-green-600 font-semibold mb-6">
              <CheckCircle2 className="w-5 h-5" />
              Eligible for Refund
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                <span className="text-sm text-slate-600">Medical ineligibility determined within 30 days of start. (Requires consultation)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                <span className="text-sm text-slate-600">Billing errors or duplicate charges.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                <span className="text-sm text-slate-600">Item missing or pre-paid treatment not received.</span>
              </li>
            </ul>
          </div>
          
          {/* Not Eligible */}
          <div className="p-6 md:p-8">
            <h4 className="flex items-center gap-2 text-red-500 font-semibold mb-6">
              <XCircle className="w-5 h-5" />
              Not Eligible for Refund
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span className="text-sm text-slate-600">Unused days in a billing period after cancellation.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span className="text-sm text-slate-600">Change in personal mind, independent of efficacy.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <span className="text-sm text-slate-600">Provider consultation already conducted.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CancellationProcess;
