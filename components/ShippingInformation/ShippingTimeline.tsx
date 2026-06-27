import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  { name: 'Rx Received', day: 'Day 0', color: 'bg-slate-400' },
  { name: 'Processing', day: 'Day 1-2', color: 'bg-teal-400' },
  { name: 'Shipped', day: 'Day 3-4', color: 'bg-teal-500' },
  { name: 'In Transit', day: 'Day 5-7', color: 'bg-teal-600' },
  { name: 'Delivered', day: 'Day 5-7', color: 'bg-emerald-600' },
];

const ShippingTimeline = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-16 mb-10">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-slate-900 mb-10">
        Shipping Timeline
      </h2>

      {/* Step Bars */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
        <div className="flex gap-2 md:gap-3 items-start mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className={`w-full h-2 rounded-full ${step.color}`} />
              <p className="text-[11px] md:text-xs font-semibold text-slate-700 text-center leading-tight">{step.name}</p>
              <p className="text-[10px] md:text-xs text-slate-400 text-center">{step.day}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-400 text-xs mt-4 leading-relaxed">
          Timelines are estimates. Expedited options may be available. Cold-chain medications may require signature.
        </p>
      </div>

      {/* Tracking + Restrictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Tracking */}
        <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 text-[13px] mb-3">Tracking</h3>
          <ul className="space-y-2.5">
            {[
              'Tracking number emailed when shipped',
              'Track in your patient portal',
              'SMS notifications available',
              'Signature may be required for controlled medications',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Restrictions */}
        <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 text-[13px] mb-3">Shipping Restrictions</h3>
          <ul className="space-y-2.5">
            {[
              'Only ships within the US',
              'Cannot ship to states without licensed providers',
              'P.O. Boxes may not be eligible for cold-chain meds',
              'No international shipments',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-red-50 border border-red-100 rounded-xl px-6 py-4 text-[13px] text-slate-700 leading-relaxed">
        <span className="font-bold text-slate-900">Prescription & Pharmacy Disclaimer: </span>
        All medications dispensed through our platform require a valid prescription from a licensed provider. We partner only with NABP-accredited or PCAB-accredited pharmacies. Compounded medications are not FDA-approved drug products and are prepared by state-licensed compounding pharmacies.
      </div>
    </section>
  );
};

export default ShippingTimeline;
