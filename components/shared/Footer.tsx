/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";
import Logo from "../ui/Logo";
import { useGetWebsiteSettingsQuery } from "@/Redux/features/footerData/footerDataApi";

const Footer = () => {
  const { data, isLoading } = useGetWebsiteSettingsQuery();
  console.log(data);
  const officeData = data?.offices;
  const contactInfoData = data?.contactInfo;
  const logoImg = data?.whiteLogo;
  // console.log(contactInfoData);
  // console.log(officeData);
  console.log(logoImg);
  return (
    <footer className="w-full bg-[#0a0a0a] font-sans p-5 pt-12">
      {/* Office Locations Section (Constrained Width like Figma) */}
      <div className="max-w-[90%] mx-auto bg-[#1c1c1c] rounded-t-4xl pt-16 pb-12 px-8 md:px-12">
        <h2 className="text-[2.5rem] font-medium text-center mb-14 text-white tracking-wide">
          Our office locations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
          {isLoading
            ? [0, 1, 2, 3].map((i) => {
                const isFirst = i === 0;
                const isLast = i === 3;
                const paddingClass = isFirst
                  ? "md:pr-10"
                  : isLast
                    ? "md:pl-10"
                    : "md:px-10";

                return (
                  <div key={i} className={`${paddingClass} py-6 md:py-0`}>
                    <div className="h-[20px] w-2/3 bg-white/10 rounded animate-pulse mb-2" />
                    <div className="h-[15px] w-full bg-white/10 rounded animate-pulse mb-1.5" />
                    <div className="h-[15px] w-4/5 bg-white/10 rounded animate-pulse" />
                  </div>
                );
              })
            : officeData
                ?.filter((office: any) => office.isActive)
                .map((office: any, index: any, arr: any) => {
                  const isFirst = index === 0;
                  const isLast = index === arr.length - 1;
                  const paddingClass = isFirst
                    ? "md:pr-10"
                    : isLast
                      ? "md:pl-10"
                      : "md:px-10";

                  return (
                    <div
                      key={office.id}
                      className={`${paddingClass} py-6 md:py-0`}
                    >
                      <h3 className="font-medium text-pink-800 mb-2  text-2xl">
                        {office.name}
                      </h3>
                      <p className="text-xl text-gray-300  font-light">
                        {office.address}
                      </p>
                    </div>
                  );
                })}
        </div>
      </div>

      {/* Main Footer Section (Full Width Image as requested) */}
      <div className="relative w-full overflow-hidden rounded-2xl ">
        {/* Background image for the footer (Full Width) */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/footer.png"
            alt="Footer Background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Fallback gradient if image doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1b3f3a] via-[#153430] to-[#0f2421] -z-10" />
        </div>

        {/* Constrain content to match the width above */}
        <div className="relative z-10 max-w-[90%] mx-auto px-6 md:px-12 pt-8 pb-8">
          <div className="grid grid-cols-1 xl:lg:grid-cols-14 md:grid-cols-9  gap-x-8 gap-y-12 mb-10  pt-4">
            {/* Brand & Description */}
            <div className="md:col-span-5 pr-0 md:pr-12">
              <div className="flex items-center gap-1 cursor-pointer mb-4">
                <Image
                  src={logoImg?.fileUrl}
                  alt="Logo"
                  width={180}
                  height={80}
                   loading="lazy" 
                  className=" h-9 sm:h-16 md:h-16 w-auto max-w-[332px]  md:max-w-[380px] object-left"
                />
                {/* <Logo variant="light" /> */}
              </div>
              <p className="text-xl text-gray-200 leading-[1.7] font-light">
                Weight Loss MD is a medical weight loss clinic in Colorado
                offering GLP-1 Prescription weight loss medications
                CoolSculpting®, Laser Hair Removal, hormone replacement therapy,
                men's services, IV Therapy, and more!
              </p>
            </div>

            {/* Links Sections */}
          

            <div className="md:col-span-2 ">
              <h4 className="font-medium text-white mb-6 text-2xl">
                Others
              </h4>
              <ul className="space-y-4 text-xl text-gray-200 font-light">
                <li>
                  <Link
                    href="/medical-team"
                    className="hover:text-white transition-colors"
                  >
                    Medical Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/eligibility"
                    className="hover:text-white transition-colors"
                  >
                    Eligibility
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 ">
              <ul className="space-y-4 text-xl text-gray-200 font-light mt-[38px]">
                <li>
                  <Link
                    href="/coverage"
                    className="hover:text-white transition-colors"
                  >
                    Coverage
                  </Link>
                </li>
                <li>
                  <Link
                    href="/report-side-effect"
                    className="hover:text-white transition-colors"
                  >
                    Report Side Effect
                  </Link>
                </li>
                <li>
                  <Link
                    href="/request-your-records"
                    className="hover:text-white transition-colors"
                  >
                    Request Records
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-information"
                    className="hover:text-white transition-colors"
                  >
                    Shipping Information
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 ">
              <h4 className="font-medium text-white mb-6 text-2xl">
                Legal Disclaimer
              </h4>
              <ul className="space-y-4 text-xl text-gray-200 font-light">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hipaa-notice"
                    className="hover:text-white transition-colors"
                  >
                    HIPPA Notice of Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketing-and-conditions"
                    className="hover:text-white transition-colors"
                  >
                    Marketing and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/billing-and-cancellation"
                    className="hover:text-white transition-colors"
                  >
                    Billing & Cancellation
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 ">
              <h4 className="font-medium text-white mb-6 text-2xl">
                Contact Us
              </h4>
              <ul className="space-y-4 text-xl text-gray-200 font-light">
                {isLoading ? (
                  <>
                    <li>
                      <div className="h-[15px] w-3/4 bg-white/10 rounded animate-pulse" />
                    </li>
                    <li>
                      <div className="h-[15px] w-3/4 bg-white/10 rounded animate-pulse" />
                    </li>
                    <li>
                      <div className="h-[15px] w-2/3 bg-white/10 rounded animate-pulse" />
                    </li>
                    <li>
                      <div className="h-[15px] w-1/2 bg-white/10 rounded animate-pulse" />
                    </li>
                  </>
                ) : (
                  <>
                    <li className="whitespace-nowrap">Phone: {contactInfoData?.phone}</li>
                    <li className="whitespace-nowrap">Email: {contactInfoData?.email}</li>
                    <li className="whitespace-nowrap">{contactInfoData?.openHours}</li>
                    <li>{contactInfoData?.closedDays} : Closed</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Badges & Payments */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 mt-8 mb-8 pl-0 md:pl-[33.33%]">
            {/* Left: Badge Images */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
              <Image
                src="/footer1.png"
                alt="LegitScript Certified"
                width={48}
                height={48}
                className="h-[36px] sm:h-[42px] md:h-[48px] w-auto object-contain"
              />
              <Image
                src="/footer2.png"
                alt="LegitScript"
                width={150}
                height={40}
                className="h-[30px] sm:h-[35px] md:h-[40px] w-auto object-contain"
              />
              <Image
                src="/footer3.png"
                alt="HIPAA Compliant"
                width={110}
                height={44}
                className="h-[32px] sm:h-[38px] md:h-[44px] w-auto object-contain"
              />
            </div>

            {/* Right: We Support */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
              <span className="text-white text-[13px] sm:text-[14px] md:text-xl font-medium whitespace-nowrap">
                We Support
              </span>
              <div className="flex flex-col leading-[1.1] text-white font-bold text-[9px] sm:text-[10px] tracking-wider text-center">
                <span>AMERICAN</span>
                <span>EXPRESS</span>
              </div>
              <div className="flex items-center">
                <div className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] md:w-[26px] md:h-[26px] rounded-full bg-[#eb001b] relative z-10" />
                <div className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] md:w-[26px] md:h-[26px] rounded-full bg-[#f79e1b] -ml-3 relative z-0" />
              </div>
              <div className="text-white font-black text-xl sm:text-2xl italic tracking-tighter">
                VISA
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative z-10 w-full h-[1px] bg-white/20 mb-6" />

          {/* Copyright & Socials */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center text-xl text-gray-300 font-light">
            <p>
              &copy; {new Date().getFullYear()} Weight Loss MD. All Rights
              Reserved.
            </p>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <span className="mr-2 text-xl">Follow us at:</span>
              <div className="flex gap-4 text-white items-center">
                <Link
                  href="https://www.facebook.com/wlmdusa"
                  className="hover:text-gray-300 transition-colors"
                >
                  <FaFacebookF className="h-[16px] w-[16px]" />
                </Link>
                <Link
                  href="https://www.instagram.com/wlmdusa"
                  className="hover:text-gray-300 transition-colors"
                >
                  <FaInstagram className="h-[16px] w-[16px]" />
                </Link>
                <Link
                  href="https://x.com/weightlossmd_1"
                  className="hover:text-gray-300 transition-colors"
                >
                  <FaXTwitter className="h-[16px] w-[16px]" />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/weightlossmd"
                  className="hover:text-gray-300 transition-colors"
                >
                  <FaLinkedinIn className="h-[16px] w-[16px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
