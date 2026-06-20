"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO BANNER ── */}
      <section className="pt-28 md:pt-36 px-4 sm:px-6 max-w-[1300px] mx-auto w-full">
        <div className="relative bg-[#f4f7fa] rounded-[32px] w-full py-20 md:py-28 flex flex-col items-center justify-center min-h-[240px]">
          {/* SVG "PRIVACY" background watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[32px] p-6 md:p-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1462 375"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full max-h-full opacity-[0.55]"
            >
              <path
                d="M0 5.95999H96.552C129.133 5.95999 153.569 14.7013 169.86 32.184C186.151 49.6667 194.296 75.2947 194.296 109.068V150.192C194.296 183.965 186.151 209.593 169.86 227.076C153.569 244.559 129.133 253.3 96.552 253.3H65.56V423.16H0V5.95999ZM96.552 193.7C107.28 193.7 115.227 190.72 120.392 184.76C125.955 178.8 128.736 168.668 128.736 154.364V104.896C128.736 90.592 125.955 80.46 120.392 74.5C115.227 68.54 107.28 65.56 96.552 65.56H65.56V193.7H96.552Z"
                fill="url(#p1)"
              />
              <path
                d="M229.902 5.95999H327.05C360.824 5.95999 385.458 13.9067 400.954 29.8C416.45 45.296 424.198 69.3347 424.198 101.916V127.544C424.198 170.853 409.894 198.269 381.286 209.792V210.984C397.18 215.752 408.305 225.487 414.662 240.188C421.417 254.889 424.794 274.557 424.794 299.192V372.5C424.794 384.42 425.192 394.155 425.986 401.704C426.781 408.856 428.768 416.008 431.946 423.16H365.194C362.81 416.405 361.221 410.048 360.426 404.088C359.632 398.128 359.234 387.4 359.234 371.904V295.616C359.234 276.544 356.056 263.233 349.698 255.684C343.738 248.135 333.209 244.36 318.11 244.36H295.462V423.16H229.902V5.95999ZM319.302 184.76C332.414 184.76 342.149 181.383 348.506 174.628C355.261 167.873 358.638 156.549 358.638 140.656V108.472C358.638 93.3733 355.857 82.4467 350.294 75.692C345.129 68.9373 336.785 65.56 325.262 65.56H295.462V184.76H319.302Z"
                fill="url(#p1)"
              />
              <path
                d="M470.281 5.95999H535.841V423.16H470.281V5.95999Z"
                fill="url(#p1)"
              />
              <path
                d="M567.657 5.95999H633.813L676.725 329.588H677.917L720.829 5.95999H781.025L717.849 423.16H630.833L567.657 5.95999Z"
                fill="url(#p1)"
              />
              <path
                d="M846.297 5.95999H935.101L1003.04 423.16H937.485L925.565 340.316V341.508H851.065L839.145 423.16H778.353L846.297 5.95999ZM917.817 284.888L888.613 78.672H887.421L858.813 284.888H917.817Z"
                fill="url(#p1)"
              />
              <path
                d="M1126.07 429.12C1094.68 429.12 1070.64 420.18 1053.95 402.3C1037.66 384.42 1029.52 359.189 1029.52 326.608V102.512C1029.52 69.9307 1037.66 44.7 1053.95 26.82C1070.64 8.94 1094.68 0 1126.07 0C1157.46 0 1181.3 8.94 1197.59 26.82C1214.28 44.7 1222.62 69.9307 1222.62 102.512V146.616H1160.64V98.34C1160.64 72.5133 1149.71 59.6 1127.86 59.6C1106 59.6 1095.08 72.5133 1095.08 98.34V331.376C1095.08 356.805 1106 369.52 1127.86 369.52C1149.71 369.52 1160.64 356.805 1160.64 331.376V267.604H1222.62V326.608C1222.62 359.189 1214.28 384.42 1197.59 402.3C1181.3 420.18 1157.46 429.12 1126.07 429.12Z"
                fill="url(#p1)"
              />
              <path
                d="M1316.8 245.552L1237.53 5.95999H1307.27L1351.97 159.132H1353.16L1397.86 5.95999H1461.63L1382.36 245.552V423.16H1316.8V245.552Z"
                fill="url(#p1)"
              />
              <defs>
                <linearGradient
                  id="p1"
                  x1="723.314"
                  y1="0.669149"
                  x2="723.314"
                  y2="378.919"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#C8CDD2" />
                  <stop offset="1" stopColor="#C8CDD2" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Privacy Policy
            </h1>
          </div>
        </div>
      </section>

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
