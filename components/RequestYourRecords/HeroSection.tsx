import React from 'react';
import { ShieldCheck } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-8">
      <div className="bg-slate-100/80 rounded-3xl py-16 px-6 text-center flex flex-col items-center justify-center shadow-sm">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <ShieldCheck className="w-4 h-4" />
          HIPAA-Compliant Records Request
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
          Request Your Records
        </h1>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          You have the right to access, receive a copy of, and request corrections to your medical records under HIPAA.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
