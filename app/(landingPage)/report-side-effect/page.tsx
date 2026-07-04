import React from 'react';
import Navbar from '@/components/shared/Navbar';
import CommonHero from '@/components/shared/CommonHero';
import ReportForm from '@/components/ReportSideEffect/ReportForm';
import ContactInfoCards from '@/components/ReportSideEffect/ContactInfoCards';

export const metadata = {
  title: "Report a Side Effect - Weight Loss MD",
  description: "Report any adverse reactions to your medication securely.",
};

const ReportSideEffectPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <Navbar 
        variant="dark" 
        initialPadding="pt-5 pb-4" 
        scrolledPadding="py-2" 
      />
      
      <CommonHero 
        title="Report a Side Effect" 
        description="Your safety is our top priority. Report any adverse reactions to your medication using the form below. A member of our clinical team will follow up within 24 hours." 
        watermarkImage="/Side Effect.png"
      />

      <div className="max-w-[1520px] mx-auto w-full px-4 md:px-6 pb-16 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 min-w-0">
          <ReportForm />
        </div>
        <div className="w-full md:w-[480px] shrink-0 sticky top-24 self-start">
          <ContactInfoCards />
        </div>
      </div>
    </main>
  );
};

export default ReportSideEffectPage;