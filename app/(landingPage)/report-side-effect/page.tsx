import React from 'react';
import Navbar from '@/components/shared/Navbar';
import HeroSection from '@/components/ReportSideEffect/HeroSection';
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
      
      <div className="pt-24 md:pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-12">
        
        <HeroSection />

        <div className="w-full flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0">
            <ReportForm />
          </div>
          <div className="w-full md:w-[480px] shrink-0 sticky top-24 self-start">
            <ContactInfoCards />
          </div>
        </div>

      </div>
    </main>
  );
};

export default ReportSideEffectPage;