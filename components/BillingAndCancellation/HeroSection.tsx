import React from 'react';

const HeroSection = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-8">
      <div className="bg-slate-100 rounded-3xl py-16 px-6 text-center shadow-sm">
        <h1 className="text-3xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
          Membership, Billing & Cancellation
        </h1>
        <p className="text-slate-600 text-lg md:text-xl font-medium">
          Transparent pricing with no hidden fees. Cancel anytime.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
