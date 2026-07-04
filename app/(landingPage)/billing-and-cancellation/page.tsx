import React from 'react';
import CommonHero from '@/components/shared/CommonHero';
import BillingTimeline from '../../../components/BillingAndCancellation/BillingTimeline';
import CancellationProcess from '../../../components/BillingAndCancellation/CancellationProcess';
import BillingFAQ from '../../../components/BillingAndCancellation/BillingFAQ';
import ContactCTA from '@/components/shared/ContactCTA';
import Navbar from '@/components/shared/Navbar';

const BillingAndCancellationPage = () => {
  return (
    <main className="min-h-screen bg-white pt-24 pb-12 overflow-hidden">
      {/* 
        The pt-24 provides space for the fixed navbar. 
        Adjust if navbar height is different. 
      */}
      <Navbar 
        variant="dark" 
        initialPadding="pt-5 pb-4" // You can set your custom padding here!
        scrolledPadding="py-2" 
      />
     {/* matches navbar height */}
      <div className="flex flex-col w-full mx-auto">
        <CommonHero 
          title="Membership, Billing & Cancellation" 
          description="Transparent pricing with no hidden fees. Cancel anytime." 
        />
        <BillingTimeline />
        <CancellationProcess />
        <BillingFAQ />
        <ContactCTA />
      </div>
    </main>
  );
};

export default BillingAndCancellationPage;