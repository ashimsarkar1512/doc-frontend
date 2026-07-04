import React from 'react';
import Navbar from '@/components/shared/Navbar';
import CommonHero from '@/components/shared/CommonHero';
import PartnerPharmacyNetwork from '@/components/ShippingInformation/PartnerPharmacyNetwork';
import ShippingTimeline from '@/components/ShippingInformation/ShippingTimeline';
import ShippingQuestions from '@/components/ShippingInformation/ShippingQuestions';
import ContactCTA from '@/components/shared/ContactCTA';

export const metadata = {
  title: "Shipping Information - Weight Loss MD",
  description: "Learn about our partner pharmacy network, shipping timelines, and tracking.",
};

const ShippingInformationPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <Navbar 
        variant="dark" 
        initialPadding="pt-5 pb-4" 
        scrolledPadding="py-2" 
      />
      
      <div className="pt-24 md:pt-32 pb-16 w-full flex flex-col items-center ">
        <CommonHero 
          title="Pharmacy & Shipping Information" 
          description="Complete transparency on how your prescription is filled and delivered." 
        />
        <PartnerPharmacyNetwork />
        <ShippingTimeline />
        <ShippingQuestions />
        <div className="w-full max-w-7xl ">
          <ContactCTA />
        </div>
      </div>
    </main>
  );
};

export default ShippingInformationPage;