import React from 'react';
import Navbar from '@/components/shared/Navbar';
import HeroSection from '@/components/RequestYourRecords/HeroSection';
import RecordsRequestForm from '@/components/RequestYourRecords/RecordsRequestForm';
import InfoCards from '@/components/RequestYourRecords/InfoCards';

export const metadata = {
  title: "Request Your Records - Weight Loss MD",
  description: "Request access, copies, or corrections to your medical records under HIPAA.",
};

const RequestYourRecordsPage = () => {
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
            <RecordsRequestForm />
          </div>
          <div className="w-full md:w-[480px] shrink-0">
            <InfoCards />
          </div>
        </div>

      </div>
    </main>
  );
};

export default RequestYourRecordsPage;