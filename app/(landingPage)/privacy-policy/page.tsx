"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CommonHero from "@/components/shared/CommonHero";
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO BANNER ── */}
      <CommonHero title="Privacy Policy" />

      {/* ── CONTENT ── */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 mt-14 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* LEFT: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 mb-3 leading-tight">
                Website Privacy Policy| Terms of Service| SMS Marketing Terms
                and Conditions
              </h2>
              <p className="text-[14px] text-gray-500 mb-1">
                Weight Loss MD Website Privacy Policy
              </p>
              <p className="text-[14px] text-gray-500">
                <span className="font-semibold text-gray-700">
                  Effective Date:
                </span>{" "}
                April 9, 2024
              </p>
              <p className="text-[14px] text-gray-600 mt-4 leading-relaxed">
                This Privacy Policy explains how Weight Loss MD collects, uses,
                and protects personal information when you visit{" "}
                <a
                  href="https://wlmd.us"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://wlmd.us
                </a>
                , weightlossmdcherrycreek.com, book appointments, or interact
                with our site.
              </p>
              <p className="text-[14px] text-gray-600 mt-4 leading-relaxed">
                This policy covers non-protected health information (non-PHI).
                For medical records and PHI (including telehealth), see our
                HIPAA Notice of Privacy Practices.
              </p>
            </div>

            {/* Information We Collect */}
            <Section title="Information We Collect">
              <BulletList
                items={[
                  <span>
                    <span className="font-semibold text-gray-900">
                      Personal Information you provide:
                    </span>{" "}
                    name, email, phone, address, date of birth, health
                    inquiries, appointment details.
                  </span>,
                  <span>
                    <span className="font-semibold text-gray-900">
                      Automatically Collected:
                    </span>{" "}
                    IP address, device/browser info, pages visited, cookies, and
                    analytics data.
                  </span>,
                  <span>
                    <span className="font-semibold text-gray-900">
                      Sensitive Data (under Colorado Privacy Act - CPA):
                    </span>{" "}
                    We treat health-related inquiries carefully and obtain
                    consent where required for processing sensitive personal
                    data (e.g., data revealing physical or mental health
                    conditions).
                  </span>,
                ]}
              />
            </Section>

            {/* How We Use Your Information */}
            <Section title="How We Use Your Information">
              <BulletList
                items={[
                  "Respond to inquiries and schedule in-person or telehealth appointments.",
                  "Provide service updates, reminders, and marketing (with consent).",
                  "Improve our website and analyze usage.",
                  "Comply with legal obligations, including the Colorado Privacy Act (CPA) and telehealth laws.",
                ]}
              />
            </Section>

            {/* Sharing Your Information */}
            <Section title="Sharing Your Information">
              <p>We do not sell personal data. We may share with:</p>
              <BulletList
                items={[
                  "Trusted service providers (e.g., Tebra, booking platforms) under contracts that protect your data.",
                  "Healthcare professionals involved in your care (including telehealth).",
                  "As required by law or to protect safety.",
                ]}
              />
            </Section>

            {/* Colorado Privacy Act (CPA) Rights */}
            <Section title="Colorado Privacy Act (CPA) Rights">
              <p>
                As a Colorado resident, you have rights to: access, correct,
                delete, or opt out of processing/sale/targeted advertising of
                your personal data. Submit requests to our Privacy Officer. We
                respond within required timelines (no 60-day cure period applies
                for certain violations as of 2026).
              </p>
            </Section>

            {/* Cookies and Tracking */}
            <Section title="Cookies and Tracking">
              <p>
                We use essential cookies for functionality and analytics
                cookies. You can manage preferences in your browser. We honor
                universal opt-out signals where applicable under CPA.
              </p>
            </Section>

            {/* Telehealth-Specific Notes */}
            <Section title="Telehealth-Specific Notes">
              <p>
                When you book or engage in telehealth, we collect and transmit
                data securely using HIPAA-compliant platforms. We obtain
                informed consent specific to telehealth as required by Colorado
                law.
              </p>
            </Section>

            {/* Data Security & Retention */}
            <Section title="Data Security & Retention">
              <p>
                We use reasonable administrative, technical, and physical
                safeguards. We retain data only as long as necessary for the
                purposes described or as required by law.
              </p>
            </Section>

            {/* Changes to This Policy */}
            <Section title="Changes to This Policy">
              <p>
                We may update this policy and will post the new version with the
                revised date.
              </p>
              <p className="mt-4">
                Contact our Privacy Officer (Darin McFarland) at{" "}
                <a
                  href="mailto:antonia@wlmd.net"
                  className="text-blue-600 underline"
                >
                  antonia@wlmd.net
                </a>{" "}
                or{" "}
                <a href="tel:7202791164" className="text-blue-600 underline">
                  (720) 279-1164
                </a>{" "}
                to exercise rights or ask questions.
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
                      background:
                        "linear-gradient(180deg, #a8c0e8 60%, rgba(168,192,232,0) 100%)",
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
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[18px] font-bold text-gray-900 mb-3">{title}</h3>
      <div className="text-[14px] text-gray-600 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="mt-2 space-y-2 text-[14px] text-gray-600 list-disc list-inside leading-relaxed">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
