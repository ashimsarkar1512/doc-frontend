"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import Expert from "@/components/home/Expert";
import { useGetWebsiteSettingsQuery } from "@/Redux/features/footerData/footerDataApi";
import CommonHero from "@/components/shared/CommonHero";
import ContactForm from "./_components/ContactForm";
import OfficeHoursCard from "./_components/OfficeHoursCard";
import PartnerPharmacies from "./_components/PartnerPharmacies";
import { useGetHeroSectionByPageQuery } from "@/Redux/features/heroSection/heroSectionApi";
import FadeIn from "@/components/shared/animations/FadeIn";
// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SERVICES = [
  "Medical Weight Loss",
  "Hormone Therapy",
  "Telehealth Consultation",
  "Prescription Management",
  "Wellness & Nutrition",
];

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const { data: heroData, isLoading: isHeroLoading } = useGetHeroSectionByPageQuery("ContactUs");

  return (
    <main className="w-full bg-white pb-20">
      <Navbar 
        variant="dark"
        initialPadding="pt-5 pb-4"
        scrolledPadding="py-2"
      />

      {/* ── HERO BANNER ── */}
      <CommonHero
        watermarkImage="/contactueWatermark.png"
        title={heroData?.title || "Contact Us"}
        description={
          isHeroLoading ? (
            <span className="flex space-x-2 justify-center">
              <span className="h-4 w-64 bg-gray-200 animate-pulse rounded-md inline-block"></span>
            </span>
          ) : (
            heroData?.description ||
            "Contact us to schedule a consultation with our medical team and explore personalized options to support your weight management goals."
          )
        }
      />

      {/* ── FORM + OFFICE HOURS ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        <FadeIn delay={0.1} className="lg:col-span-2">
          <ContactForm />
        </FadeIn>
        <FadeIn delay={0.2} className="lg:col-span-1">
          <OfficeHoursCard />
        </FadeIn>
      </section>

      {/* ── MEET OUR EXPERT PROVIDERS ── */}
      <section>
        <Expert />
      </section>

      {/* ── PARTNER PHARMACIES ── */}
      <FadeIn delay={0.1}>
        <PartnerPharmacies />
      </FadeIn>
    </main>
  );
}
