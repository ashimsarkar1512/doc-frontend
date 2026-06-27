import React from 'react';

const HeroSection = () => {
  return (
    <section className="w-full max-w-9xl mx-auto px-4 ">
      <div className="bg-slate-100 rounded-3xl py-16 px-6 text-center shadow-sm">
        <h1 className="text-3xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
          Report a Side Effect
        </h1>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Your safety is our top priority. Report any adverse reactions to your medication using the form below. A member of our clinical team will follow up within 24 hours.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
