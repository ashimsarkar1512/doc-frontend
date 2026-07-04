import React from 'react';
import Navbar from '@/components/shared/Navbar';
import CommonHero from '@/components/shared/CommonHero';
import RecordsRequestForm from '@/components/RequestYourRecords/RecordsRequestForm';
import InfoCards from '@/components/RequestYourRecords/InfoCards';

export const metadata = {
  title: "Request Your Records - Weight Loss MD ",
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
      
      <CommonHero 
        title="Request Your Records" 
        description="You have the right to access, receive a copy of, and request corrections to your medical records under HIPAA."
        watermarkImage="/Records.png"
      />

      <div className="max-w-[1520px] mx-auto w-full px-4 md:px-6 pb-16 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 min-w-0">
          <RecordsRequestForm />
        </div>
        <div className="w-full md:w-[480px] shrink-0 sticky top-24 self-start">
          <InfoCards />
        </div>
      </div>
    </main>
  );
};

export default RequestYourRecordsPage;