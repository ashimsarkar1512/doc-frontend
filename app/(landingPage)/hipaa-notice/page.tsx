"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CommonHero from "@/components/shared/CommonHero";
export default function HipaaNoticePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO BANNER ── */}
      <CommonHero title="HIPAA Notice" />

      {/* ── CONTENT ── */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 mt-14 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">

          {/* LEFT: Main Content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Title & Meta */}
            <div className="border-b border-gray-100 pb-8">
              <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 mb-3 leading-tight">
                HIPAA Notice of Privacy Practices
              </h2>
              <p className="text-[14px] text-gray-500 mb-1">Weight Loss MD Notice of Privacy Practices</p>
              <p className="text-[14px] text-gray-500">
                <span className="font-semibold text-gray-700">Effective Date:</span> April 9, 2024 &nbsp;|&nbsp;
                <span className="font-semibold text-gray-700">Last Revised:</span> April 9, 2024
              </p>
              <p className="text-[14px] text-gray-600 mt-4 leading-relaxed">
                This notice describes how medical information about you may be used and disclosed and how you can get
                access to this information. <span className="font-semibold text-gray-900">Please review it carefully.</span>
              </p>
            </div>

            {/* Section: Our Contact Information */}
            <div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">Our Contact Information</h3>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                By accessing or using wlmd.us, weightlossmdfarm.com/wlmd, or affiliated services (the &ldquo;website&rdquo;), you agree to
                these Terms of Service. If you do not agree, you must not use the Website.
              </p>
            </div>

            {/* Section: Medical Disclaimer */}
            <div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">2. MEDICAL DISCLAIMER</h3>
              <p className="text-[14px] font-semibold text-gray-800 mb-3">Weight Loss MD</p>
              <ul className="space-y-2 text-[14px] text-gray-600 list-disc list-inside leading-relaxed">
                <li>Cherry Creek: 700 E Speer Blvd, Denver, CO 80203</li>
                <li>DTC / Greenwood Village: 8100 E Union Ave, Suite 104, Denver, CO 80237</li>
                <li>Boulder: 2425 Canyon Blvd, Suite G, Boulder, CO 80302</li>
                <li>Colorado Springs: 1625 Medical Center Point, Suite 130, Colorado Springs, CO 80907</li>
              </ul>
              <p className="text-[14px] text-gray-600 mt-3 leading-relaxed">
                <span className="font-semibold text-gray-800">Website:</span>{" "}
                <a href="https://wlmd.us" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://wlmd.us</a>{" "}
                &nbsp;<span className="font-semibold text-gray-800">Phone:</span> (720) 279-1164{" "}
                &nbsp;<span className="font-semibold text-gray-800">Email:</span>{" "}
                <a href="mailto:privacy@wlmd.net" className="text-blue-600 underline">privacy@wlmd.net</a>
              </p>
              <p className="text-[14px] text-gray-600 mt-1">
                <span className="font-semibold text-gray-800">Privacy Officer:</span> Claire Hoffman &nbsp;|&nbsp;
                <span className="font-semibold text-gray-800">Personal Email:</span>{" "}
                <a href="mailto:privacy@wlmd.net" className="text-blue-600 underline">privacy@wlmd.net</a>{" "}
                &nbsp;<span className="font-semibold text-gray-800">Phone:</span> (720) 279-1164
              </p>
            </div>

            {/* Section: Your Rights */}
            <div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">Your Rights</h3>
              <p className="text-[14px] text-gray-600 mb-3">You have the right to:</p>
              <ul className="space-y-2 text-[14px] text-gray-600 list-disc list-inside leading-relaxed">
                <li>Get a copy of your paper or electronic medical record</li>
                <li>Correct your paper or electronic medical record</li>
                <li>Request confidential communication</li>
                <li>Ask us to limit the information we share</li>
                <li>Get a list of those with whom we&apos;ve shared your information</li>
                <li>Get a copy of this privacy notice</li>
                <li>Choose someone to act for you</li>
                <li>File a complaint if you believe your privacy rights have been violated</li>
              </ul>
            </div>

            {/* Section: Your Choices */}
            <div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">Your Choices</h3>
              <p className="text-[14px] text-gray-600 mb-3">You have some choices in the way that we use and share information as we:</p>
              <ul className="space-y-2 text-[14px] text-gray-600 list-disc list-inside leading-relaxed">
                <li>Tell family and friends about your condition</li>
                <li>Provide disaster relief</li>
                <li>Market our services and sell your information</li>
                <li>Raise funds</li>
                <li>(Note: we are not maintain a hospital directory in a credit plan/therapy policy.)</li>
              </ul>
            </div>

            {/* Section: Our Uses and Disclosures */}
            <div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">Our Uses and Disclosures</h3>
              <p className="text-[14px] text-gray-600 mb-3">We may use and share your information to:</p>
              <ul className="space-y-2 text-[14px] text-gray-600 list-disc list-inside leading-relaxed">
                <li>Treat you (including to telehealth)</li>
                <li>Run our organization</li>
                <li>Bill for your services</li>
                <li>Help with public health and safety issues</li>
                <li>Do research</li>
                <li>Comply with the law</li>
                <li>Respond to organ and tissue donation requests</li>
                <li>Work with a medical examiner or a funeral director</li>
                <li>Address workers&apos; compensation, law enforcement, and other government requests</li>
                <li>Respond to lawsuits and legal actions</li>
              </ul>
            </div>

            {/* Section: Detailed Your Rights */}
            <div className="space-y-6">
              <h3 className="text-[18px] font-bold text-gray-900">Detailed Your Rights</h3>

              <div>
                <p className="text-[14px] font-semibold text-gray-800 mb-1">Get a copy of your medical record</p>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  You can request an electronic or paper copy. We will respond within 30 days and may charge a reasonable fee.
                </p>
              </div>

              <div>
                <p className="text-[14px] font-semibold text-gray-800 mb-1">Correct your record</p>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  We may deny your request but will explain any denial in writing.
                </p>
              </div>

              <div>
                <p className="text-[14px] font-semibold text-gray-800 mb-1">Confidential communications</p>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  We can contact you at a specific address or phone. We will accommodate reasonable requests.
                </p>
              </div>

              <div>
                <p className="text-[14px] font-semibold text-gray-800 mb-1">Limit uses and disclosures</p>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  We are not required to agree except when you pay out of pocket in full and request we not share with your insurer (we will say yes to those requests).
                </p>
              </div>

              <div>
                <p className="text-[14px] font-semibold text-gray-800 mb-1">Accounting of disclosures</p>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  One free per year; additional requests may incur a fee.
                </p>
              </div>

              <div>
                <p className="text-[14px] font-semibold text-gray-800 mb-1">File a complaint</p>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  Contact our Privacy Officer or the U.S. Department of Health and Human Services Office for Civil Rights (
                  <a href="https://hhs.gov/ocr" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">hhs.gov/ocr</a>
                  ). We will not retaliate.
                </p>
              </div>
            </div>

            {/* Section: Telehealth */}
            <div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">Detailed Your Choices & Telehealth</h3>
              <p className="text-[14px] text-gray-600 mb-3">For telehealth services, Colorado law requires us to inform you and obtain your consent that:</p>
              <ul className="space-y-2 text-[14px] text-gray-600 list-disc list-inside leading-relaxed">
                <li>You may refuse telehealth services at any time without affecting your right to future in-person care or treatment and without loss of any program benefits</li>
                <li>All applicable confidentiality protections apply to telehealth services</li>
                <li>You have the right to all medical information resulting from the telehealth services as provided by law</li>
              </ul>
              <p className="text-[14px] text-gray-500 mt-3 italic">This consent will be documented in your medical record.</p>
            </div>

            {/* Section: Our Uses (Details) */}
            <div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">Our Uses and Disclosures (Details)</h3>
              <p className="text-[14px] text-gray-600 mb-3">Standard HIPAA categories apply plus:</p>
              <ul className="space-y-2 text-[14px] text-gray-600 list-disc list-inside leading-relaxed">
                <li>We use and disclose your information to provide, coordinate, and document telehealth encounters while maintaining required privacy and security safeguards</li>
                <li>Substance Use Disorder Records: We comply with applicable federal (42 CFR Part 2) and Colorado laws. We will not disclose substance abuse treatment records without your specific written consent (except in limited circumstances permitted by law)</li>
              </ul>
            </div>

            {/* Section: Our Responsibilities */}
            <div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">Our Responsibilities</h3>
              <ul className="space-y-2 text-[14px] text-gray-600 list-disc list-inside leading-relaxed">
                <li>Maintain the privacy and security of your protected health information (PHI)</li>
                <li>Notify you promptly of any breach</li>
                <li>Follow the practices in this notice</li>
                <li>Comply with all applicable federal and Colorado privacy laws</li>
              </ul>
            </div>

            {/* Section: Changes */}
            <div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">Changes to This Notice</h3>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                We may change this notice; changes apply to all information we hold. The revised notice will be posted on our website and available in our offices.
              </p>
              <p className="text-[14px] text-gray-600 mt-3 leading-relaxed">
                For more information:{" "}
                <a
                  href="https://www.hhs.gov/ocr/privacy/hipaa/understanding/consumers/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  www.hhs.gov/ocr/privacy/hipaa/understanding/consumers/index.html
                </a>{" "}
                This Notice applies to Weight Loss MD. We are not part of an Organized Health Care Arrangement.
              </p>
            </div>

          </div>

          {/* RIGHT: Sticky Doctor Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              {/* Card container — full bleed image with WLMD text behind and Contact Us button overlaid */}
              <div
                className="rounded-[28px] overflow-hidden relative w-full"
                style={{ background: "#dce8f4", aspectRatio: "4/5" }}
              >
                {/* WLMD large watermark — top area behind doctor */}
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

                {/* Doctor image — fills the card */}
                <div className="absolute inset-0 z-[2]">
                  <Image
                    src="/expartProviders/expart1.png"
                    alt="Doctor"
                    fill
                    className="object-cover object-top"
                    style={{ objectPosition: '50% 10%' }}
                  />
                </div>

                {/* Contact Us button — overlaid at bottom center */}
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
