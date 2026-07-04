"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CommonHero from "@/components/shared/CommonHero";
export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO BANNER ── */}
      <CommonHero title="Terms of Service" />

      {/* ── CONTENT ── */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 mt-14 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">

          {/* LEFT: Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Header */}
            <div className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 mb-3 leading-tight">Terms of Service</h2>
              <p className="text-[14px] text-gray-500 mb-1">Weight Loss MD — Terms of Service Agreement</p>
              <p className="text-[14px] text-gray-500">
                <span className="font-semibold text-gray-700">Effective Date:</span> April 9, 2024 &nbsp;|&nbsp;
                <span className="font-semibold text-gray-700">Last Revised:</span> April 9, 2024
              </p>
              <p className="text-[14px] text-gray-600 mt-4 leading-relaxed">
                By accessing or using our services, website, or mobile applications, you agree to be bound by these
                Terms of Service. <span className="font-semibold text-gray-900">Please read them carefully before using our services.</span>
              </p>
            </div>

            {/* 1. Acceptance */}
            <Section title="1. ACCEPTANCE OF TERMS">
              <p>By accessing or using wlmd.us, weightlossmdfarm.com/wlmd, or affiliated services (the &ldquo;website&rdquo;), you agree to these Terms of Service. If you do not agree, you must not use the Website.</p>
            </Section>

            {/* 2. Medical Disclaimer */}
            <Section title="2. MEDICAL DISCLAIMER">
              <p>Weight Loss MD provides medical services including but not limited to weight management, hormone therapy, and related health services. The information on this website is for informational purposes only and does not constitute medical advice.</p>
            </Section>

            {/* 3. Provider Relationship */}
            <Section title="3. PROVIDER RELATIONSHIP">
              <p>All medical services are provided by licensed healthcare providers affiliated with Weight Loss MD.</p>
              <p className="mt-3">A provider-patient relationship is established only after:</p>
              <BulletList items={[
                "Completion of required intake forms",
                "Review by a licensed provider",
                "Acceptance into care",
              ]} />
            </Section>

            {/* 4. No Guarantee */}
            <Section title="4. NO GUARANTEE OF TREATMENT OR PRESCRIPTION">
              <BulletList items={[
                "Not all patients will qualify for treatment",
                "Prescriptions are issued solely at the discretion of a licensed provider",
                "Payment, registration, or questionnaire completion does NOT guarantee:",
              ]} />
              <ul className="mt-2 ml-8 space-y-1 text-[14px] text-gray-600 list-disc leading-relaxed">
                <li>Not all patients will qualify for treatment</li>
                <li>Prescriptions are issued solely at the discretion of a licensed provider</li>
                <li>Payment, registration, or questionnaire completion does NOT guarantee:</li>
              </ul>
              <p className="mt-3 text-[14px] text-gray-600">Results vary by individual.</p>
            </Section>

            {/* 5. Not an Online Pharmacy */}
            <Section title="5. NOT AN ONLINE PHARMACY">
              <p className="font-semibold">Weight Loss MD does not operate as an online pharmacy.</p>
              <p className="mt-2">We do not sell, ship, or distribute prescription medications directly to consumers through this Website.</p>
            </Section>

            {/* 6. No Direct Purchase */}
            <Section title="6. NO DIRECT PURCHASE OF PRESCRIPTION MEDICATIONS">
              <p>Prescription medications are not available for direct purchase on this Website.</p>
              <p className="mt-3">Any checkout, payment, or cart functionality is for:</p>
              <BulletList items={[
                "Medical consultations",
                "Program enrollment",
                "Wellness or aesthetic services",
                "Non-prescription products (if applicable)",
              ]} />
            </Section>

            {/* 7. Medical Evaluation */}
            <Section title="7. MEDICAL EVALUATION REQUIRED">
              <p>All prescriptions require:</p>
              <BulletList items={[
                "Medical history review",
                "Clinical evaluation",
                "Determination of medical necessity",
              ]} />
              <p className="mt-3">Only a licensed provider may issue prescriptions.</p>
            </Section>

            {/* 8. Controlled Substances */}
            <Section title="8. CONTROLLED SUBSTANCES COMPLIANCE">
              <p>Certain medications, including controlled substances (such as phentermine), are subject to federal law, including the Ryan Haight Online Pharmacy Consumer Protection Act.</p>
              <p className="mt-3">These medications may require:</p>
              <BulletList items={[
                "An in-person medical evaluation",
                "Additional regulatory compliance",
              ]} />
            </Section>

            {/* 9. Dispensing */}
            <Section title="9. DISPENSING & PHARMACY FULFILLMENT">
              <p>Where permitted by law:</p>
              <BulletList items={[
                "Medications may be dispensed directly by the clinic",
                "Or prescribed and filled through a licensed U.S. pharmacy",
              ]} />
              <p className="mt-3">All dispensing complies with:</p>
              <BulletList items={["Colorado law", "Federal regulations"]} />
            </Section>

            {/* 10. Telehealth */}
            <Section title="10. TELEHEALTH SERVICES (COLORADO LAW)">
              <SubSection title="10.1 Eligibility">
                <p>Telehealth services are available only to patients physically located in Colorado at the time of the consultation.</p>
              </SubSection>
              <SubSection title="10.2 Consent">
                <p>Patients must provide informed consent before receiving telehealth services.</p>
                <p className="mt-2">Consent includes acknowledgment that:</p>
                <BulletList items={[
                  "Telehealth is voluntary",
                  "You may withdraw consent at any time",
                  "Confidentiality protections apply",
                  "You have access to your medical information",
                ]} />
              </SubSection>
              <SubSection title="10.3 Technology">
                <p>Telehealth services are conducted using <span className="font-semibold">HIPAA-compliant platforms.</span></p>
              </SubSection>
            </Section>

            {/* 11. Services */}
            <Section title="11. SERVICES OFFERED">
              <p>Weight Loss MD may provide:</p>
              <BulletList items={[
                "Medical weight management programs",
                "GLP-1-based treatment programs (e.g., semaglutide, tirzepatide) when appropriate",
                "Hormone therapy (including TRT when appropriate)",
                "Erectile dysfunction treatment (e.g., sildenafil, tadalafil when appropriate)",
                "Aesthetic and wellness services",
              ]} />
              <p className="mt-3">All services are subject to provider evaluation and medical appropriateness.</p>
            </Section>

            {/* 12. Medication-Specific */}
            <Section title="12. MEDICATION-SPECIFIC DISCLOSURES">
              <SubSection title="12.1 GLP-1 Medications">
                <p>GLP-1 medications may be prescribed only after evaluation by a licensed provider.</p>
                <p className="mt-2">These medications:</p>
                <BulletList items={[
                  "Are not appropriate for all patients",
                  "Require medical supervision",
                  "Are not sold directly through this Website",
                ]} />
                <p className="mt-2">Results vary.</p>
              </SubSection>
              <SubSection title="12.2 Erectile Dysfunction Medications">
                <p>Medications such as sildenafil or tadalafil:</p>
                <BulletList items={[
                  "Require provider evaluation",
                  "Are not available for direct purchase",
                  "Are prescribed only when medically appropriate",
                ]} />
              </SubSection>
              <SubSection title="12.3 Hormone Therapy / TRT">
                <p>Hormone therapy is:</p>
                <BulletList items={[
                  "Individually prescribed",
                  "Based on labs, symptoms, and medical history",
                  "Not guaranteed",
                ]} />
              </SubSection>
            </Section>

            {/* 13. Ordering */}
            <Section title="13. ORDERING, PAYMENTS & CHECKOUT TERMS">
              <SubSection title="13.1 Nature of Transactions">
                <p>All payments are for:</p>
                <BulletList items={[
                  "Professional medical services",
                  "Consultations",
                  "Program participation",
                  "Non-prescription offerings",
                ]} />
              </SubSection>
              <SubSection title="13.2 No Guarantee of Prescription">
                <p>Payment does NOT guarantee:</p>
                <BulletList items={[
                  "Prescription approval",
                  "Treatment eligibility",
                  "Medication access",
                ]} />
              </SubSection>
              <SubSection title="13.3 Billing Responsibility">
                <p>You agree to:</p>
                <BulletList items={[
                  "Provide accurate billing information",
                  "Pay all applicable fees",
                  "Be responsible for non-covered services",
                ]} />
              </SubSection>
              <SubSection title="13.4 Refunds & Cancellations">
                <BulletList items={[
                  "Cancellation and no-show fees may apply",
                  "Certain services may be non-refundable once rendered",
                ]} />
              </SubSection>
              <SubSection title="13.5 Prohibited Use">
                <p>You may not:</p>
                <BulletList items={[
                  "Attempt to obtain prescription medications without evaluation",
                  "Misrepresent medical information",
                  "Circumvent provider review",
                ]} />
              </SubSection>
            </Section>

            {/* 14. SMS */}
            <Section title="14. SMS COMMUNICATIONS">
              <p>By opting in, you agree to receive SMS messages including:</p>
              <BulletList items={[
                "Appointment reminders",
                "Promotions",
                "Service updates",
                "Message frequency: approx. 3–5 per month",
                "Message/data rates may apply",
              ]} />
              <p className="mt-3">You may opt out by replying STOP at any time.</p>
              <p className="mt-1">Consent is not required to receive services.</p>
            </Section>

            {/* 15. Privacy & HIPAA */}
            <Section title="15. PRIVACY & HIPAA">
              <p>Your use of the Website is also governed by:</p>
              <BulletList items={[
                "Our Privacy Policy (non-PHI data)",
                "HIPAA Notice of Privacy Practices (PHI data)",
              ]} />
            </Section>

            {/* 16. User Responsibilities */}
            <Section title="16. USER RESPONSIBILITIES">
              <p>You agree to:</p>
              <BulletList items={[
                "Provide accurate information",
                "Use the Website lawfully",
                "Not misuse services or systems",
              ]} />
            </Section>

            {/* 17. Intellectual Property */}
            <Section title="17. INTELLECTUAL PROPERTY">
              <p>All Website content is owned by Weight Loss MD and may not be copied or reproduced without permission.</p>
            </Section>

            {/* 18. Limitation of Liability */}
            <Section title="18. LIMITATION OF LIABILITY">
              <p>To the fullest extent permitted by law, Weight Loss MD is not liable for:</p>
              <BulletList items={[
                "Indirect or consequential damages",
                "Loss of profits or data",
                "Medical outcomes",
              ]} />
            </Section>

            {/* 19. Indemnification */}
            <Section title="19. INDEMNIFICATION">
              <p>You agree to indemnify and hold harmless Weight Loss MD from claims arising from:</p>
              <BulletList items={[
                "Misuse of the Website",
                "False information",
                "Violation of these Terms",
              ]} />
            </Section>

            {/* 20. Third-Party */}
            <Section title="20. THIRD-PARTY SERVICES">
              <p>We may use third-party platforms (e.g., payment processors, EMR systems).</p>
              <p className="mt-2">We are not responsible for their independent policies.</p>
            </Section>

            {/* 21. Governing Law */}
            <Section title="21. GOVERNING LAW">
              <p>These Terms are governed by:</p>
              <BulletList items={[
                "The laws of the State of Colorado",
                "Applicable federal laws",
              ]} />
            </Section>

            {/* 22. Dispute Resolution */}
            <Section title="22. DISPUTE RESOLUTION">
              <p>Disputes shall be resolved in Colorado courts unless otherwise required by law.</p>
            </Section>

            {/* 23. Changes */}
            <Section title="23. CHANGES TO TERMS">
              <p>We may update these Terms at any time. Continued use constitutes acceptance.</p>
            </Section>

            {/* 24. Contact */}
            <Section title="24. CONTACT INFORMATION">
              <p className="font-semibold text-gray-800">Weight Loss MD</p>
              <p className="mt-1">Privacy Officer: Darin McFarland</p>
              <p className="mt-1">
                📧{" "}
                <a href="mailto:antonia@wlmd.net" className="text-blue-600 underline">antonia@wlmd.net</a>
              </p>
              <p className="mt-1">
                📞{" "}
                <a href="tel:7202791164" className="text-blue-600 underline">(720) 279-1164</a>
              </p>
            </Section>

          </div>

          {/* RIGHT: Sticky Doctor Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div
                className="rounded-[28px] overflow-hidden relative w-full"
                style={{ background: "#dce8f4", aspectRatio: "4/5" }}
              >
                {/* WLMD watermark */}
                <div className="absolute top-8 left-0 right-0 text-center z-[1] pointer-events-none select-none">
                  <span
                    className="font-black tracking-[0.14em] uppercase"
                    style={{
                      fontSize: "clamp(72px, 10vw, 104px)",
                      background: "linear-gradient(180deg, #a8c0e8 60%, rgba(168,192,232,0) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1,
                      display: "block",
                    }}
                  >
                    WLMD
                  </span>
                </div>

                {/* Doctor image */}
                <div className="absolute inset-0 z-[2]">
                  <Image
                    src="/expartProviders/expart1.png"
                    alt="Doctor"
                    fill
                    className="object-cover object-top"
                    style={{ objectPosition: "50% 10%" }}
                  />
                </div>

                {/* Contact Us button */}
                <div className="absolute bottom-8 left-0 right-0 z-[3] flex justify-center">
                  <Link
                    href="/contact"
                    className="bg-[#2563eb] hover:bg-blue-700 text-white text-[16px] font-semibold px-10 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Reusable section wrappers ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[15px] font-black text-gray-900 uppercase tracking-wide mb-3">{title}</h3>
      <div className="text-[14px] text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h4 className="text-[15px] font-bold text-gray-800 mb-2">{title}</h4>
      <div className="text-[14px] text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1 text-[14px] text-gray-600 list-disc list-inside leading-relaxed">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
