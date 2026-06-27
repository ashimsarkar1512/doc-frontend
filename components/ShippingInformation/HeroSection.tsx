import React from 'react';

const HeroSection = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-8">
      <div className="bg-slate-100/80 rounded-3xl py-16 px-6 text-center shadow-sm">
        <h1 className="text-3xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
          Pharmacy & Shipping Information
        </h1>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Complete transparency on how your prescription is filled and delivered.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
