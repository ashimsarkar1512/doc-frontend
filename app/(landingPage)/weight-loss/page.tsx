"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function WeightLossPage() {
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [activeFaqTab, setActiveFaqTab] = useState("GLP-1");

  const services = [
    {
      title: "GLP-1",
      desc: "GLP-1 weight management options. Evaluation required. Medically supervised care. Results may vary.",
      image: "/medicine-1.png",
    },
    {
      title: "Phentermine",
      desc: "Phentermine weight management options. Evaluation required. Medically supervised care. Results may vary.",
      image: "/medicine-2.png",
    },
    {
      title: "Phendimetrazine (Bontril)",
      desc: "Phendimetrazine weight management options. Evaluation required. Medically supervised care. Results may vary.",
      image: "/medicine-2.png",
    },
    {
      title: "B12 Injections",
      desc: "B12 injection weight management options. Evaluation required. Medically supervised care. Results may vary.",
      image: "/medicine-3.png",
    },
    {
      title: "Lipotropic Injections",
      desc: "Lipotropic injection weight management options. Evaluation required. Medically supervised care. Results may vary.",
      image: "/medicine-1.png",
    },
    {
      title: "Vitamin C Ascorbic Acid",
      desc: "Vitamin C weight management options. Evaluation required. Medically supervised care. Results may vary.",
      image: "/medicine-4.png",
    },
    {
      title: "Glutathione Intramuscular Injections",
      desc: "Glutathione injection weight management options. Evaluation required. Medically supervised care. Results may vary.",
      image: "/medicine-1.png",
    },
    {
      title: "B-Complex Intramuscular Injections",
      desc: "B-Complex injection weight management options. Evaluation required. Medically supervised care. Results may vary.",
      image: "/medicine-5.png",
      fullBleed: true,
    },
    {
      title: "Vitamin D Intramuscular Injections",
      desc: "Vitamin D injection weight management options. Evaluation required. Medically supervised care. Results may vary.",
      image: "/medicine-1.png",
    },
  ];

  const faqs = [
    {
      q: "What is Phentermine?",
      a: "Phentermine is an FDA-approved prescription medication used for weight loss. It works as an appetite suppressant, helping you feel full sooner and eat less. It's typically prescribed as part of a comprehensive weight loss plan that includes a healthy diet and regular exercise.",
    },
    {
      q: "How do GLP-1 medications help with weight loss?",
      a: "GLP-1 medications work by mimicking a hormone that targets areas of the brain involved in regulating appetite and food intake, leading to reduced hunger and increased feelings of fullness.",
    },
    {
      q: "What is the difference between semaglutide and tirzepatide?",
      a: "Semaglutide is a GLP-1 receptor agonist, while tirzepatide is a dual GIP/GLP-1 receptor agonist. Both are effective for weight loss, but they work through slightly different mechanisms in the body.",
    },
    {
      q: "Do I need a prescription for weight loss medications?",
      a: "Yes, all the weight loss medications and injections we offer require a prescription from one of our licensed medical providers after a thorough evaluation.",
    },
    {
      q: "Do you offer in-person consultations?",
      a: "Yes, we offer both in-person consultations at our Colorado clinics and convenient telehealth appointments for eligible patients.",
    },
    {
      q: "How do I get started?",
      a: "You can get started by booking an initial consultation through our website or by calling our clinic. We will review your medical history and discuss the best options for you.",
    },
  ];

  const faqTabs = ["GLP-1", "Phentermine", "Phendimetrazine", "B12 Injections", "Lipotropic Injections"];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO BANNER ── */}
      <section className="pt-24 md:pt-32 px-4 sm:px-6 max-w-[1300px] mx-auto w-full">
        <div className="relative w-full h-[350px] md:h-[440px] rounded-[32px] overflow-hidden flex flex-col items-center justify-center text-center px-4 shadow-sm">
          <Image
            src="/service.jpg"
            alt="Weight Loss Service"
            fill
            className="object-cover object-center z-0"
            priority
          />
          {/* Subtle gradient for text readability without washing out the image */}
          <div className="absolute inset-0 bg-black/10 z-10" />

          <div className="relative z-20 flex flex-col items-center justify-center w-full h-full py-10">
            <p className="text-white text-[15px] font-light tracking-wide mb-8 flex items-center gap-1.5 drop-shadow-md">
              Services <ChevronRight className="w-4 h-4" /> Weight Loss
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-white max-w-[1000px] leading-[1.15] mb-12 drop-shadow-lg tracking-tight">
              Take control of your body with <br className="hidden md:block" /> our weight loss service
            </h1>
            <button className="bg-[#2563eb] hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-full transition-all duration-300 shadow-md text-[16px] tracking-wide">
              Start Assessment
            </button>
          </div>
        </div>
      </section>

      {/* ── INTRO TEXT ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 text-center">
        <h2 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-6 tracking-tight">Weight Loss Shots at WLMD</h2>
        <p className="text-[14px] md:text-[15px] text-gray-500 leading-[1.8] mb-8 font-light">
          We provide medical weight loss plans for our patients in Colorado. We offer programs customized to fit your specific
          needs, focusing on steady, consistent weight loss over time. Your customized program may include a combination of
          FDA-approved weight loss medications, supplements, and B12/Lipotropic injections. Weight loss results may vary depending
          based on strict compliance. All treatments are supervised carefully with WLMD and state regulations. Results usually
          are often directly correlated with keeping up with care. For more details on individual outcomes, ask to see our medical
          providers.
        </p>
        <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-3 rounded-full transition-colors text-[14px]">
          Book Appointment
        </button>
      </section>

      {/* ── SERVICE-2 IMAGE ── */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 mt-16 w-full">
        <div className="relative w-full h-[300px] md:h-[450px] rounded-[32px] overflow-hidden">
          <Image
            src="/service-2.png"
            alt="Fitness and wellness"
            fill
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-20 mb-16 w-full">
        <h2 className="text-[32px] md:text-[36px] font-bold text-gray-900 mb-14 text-center tracking-tight">
          Our Weight Loss Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col h-full bg-white">
              <div
                className={`w-full aspect-[4/3] rounded-[24px] overflow-hidden relative mb-5 ${
                  service.fullBleed
                    ? "bg-[#1a4a8a]"
                    : "bg-gradient-to-b from-[#0c1f3f] via-[#4a9fd4] to-white"
                }`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  quality={100}
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={
                    service.fullBleed
                      ? "object-cover object-center"
                      : "object-contain object-center p-4 md:p-5 mix-blend-screen contrast-[1.15] brightness-[1.05]"
                  }
                />
              </div>

              <h3 className="text-[15px] font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-[12px] text-gray-500 leading-[1.7] flex-grow mb-5 font-light">
                {service.desc}
              </p>

              <div className="mt-auto">
                <button className="bg-[#2563eb] hover:bg-blue-700 text-white text-[13px] font-medium px-6 py-2.5 rounded-full transition-all duration-200">
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="max-w-[1000px] mx-auto px-4 sm:px-6 mt-24 mb-24 w-full">
        <h2 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-8 text-center tracking-tight">Popular Facts & Questions</h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {faqTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFaqTab(tab)}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-colors ${activeFaqTab === tab
                  ? "bg-[#2563eb] text-white"
                  : "bg-[#f2f4f7] text-gray-600 hover:bg-gray-200"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${openFaq === index ? "bg-[#f8fafc]" : "bg-[#f4f7fa]"
                }`}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                <span className="text-[14px] font-semibold text-gray-800">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="p-5 pt-0 text-[14px] text-gray-500 leading-relaxed font-light">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 mb-24 w-full">
        <div className="w-full rounded-[24px] bg-gradient-to-r from-[#2c3e50] via-[#34495e] to-[#2c3e50] flex flex-col md:flex-row items-center justify-between p-8 md:p-12 shadow-xl">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 text-white font-bold text-xl shrink-0">
              {/* Simple logo mark */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Contact Us at Weight Loss MD<br className="hidden md:block" /> Today
            </h2>
          </div>

          <button className="bg-[#2563eb] hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-[15px] whitespace-nowrap shadow-lg">
            Book a consultation
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
