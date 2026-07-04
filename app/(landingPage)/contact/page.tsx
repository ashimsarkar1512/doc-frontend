import React from "react";
import Navbar from "@/components/shared/Navbar";
import Expert from "@/components/home/Expert";
import ContactHero from "./_components/ContactHero";
import ContactForm from "./_components/ContactForm";
import OfficeHoursCard from "./_components/OfficeHoursCard";
import PartnerPharmacies from "./_components/PartnerPharmacies";

export default function ContactPage() {
  return (
    <main className="w-full bg-white pb-20">
      <Navbar variant="dark" />

      {/* ── HERO BANNER ── */}
      <ContactHero />

      {/* ── FORM + OFFICE HOURS ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        <ContactForm />
        <OfficeHoursCard />
      </section>

      {/* ── MEET OUR EXPERT PROVIDERS ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-28">
        <Expert />
      </section>

      {/* ── PARTNER PHARMACIES ── */}
      <PartnerPharmacies />
    </main>
  );
}
