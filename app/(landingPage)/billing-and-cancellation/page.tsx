import React from 'react';
import Navbar from '@/components/shared/Navbar';
import CommonHero from '@/components/shared/CommonHero';
import BillingTimeline from '../../../components/BillingAndCancellation/BillingTimeline';
import CancellationProcess from '../../../components/BillingAndCancellation/CancellationProcess';
import BillingFAQ from '../../../components/BillingAndCancellation/BillingFAQ';
import ContactCTA from '@/components/shared/ContactCTA';

export const metadata = {
  title: "Membership, Billing & Cancellation - Weight Loss MD",
  description: "Transparent pricing with no hidden fees. Cancel anytime.",
};

const BillingAndCancellationPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <Navbar
        variant="dark"
        initialPadding="pt-5 pb-4"
        scrolledPadding="py-2"
      />

      <CommonHero
        title="Membership, Billing & Cancellation"
        description="Transparent pricing with no hidden fees. Cancel anytime."
        watermarkImage="/billing.png"
      />

      <div className="max-w-[1520px] mx-auto w-full flex flex-col items-center">
        <BillingTimeline />
        <CancellationProcess />
        <BillingFAQ />
        <ContactCTA />
      </div>
    </main>
  );
};

export default BillingAndCancellationPage;