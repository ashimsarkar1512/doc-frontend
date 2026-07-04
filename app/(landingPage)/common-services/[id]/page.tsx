/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetProductsByCategoryIdQuery, useGetServicePageDetailsQuery } from "@/Redux/features/patient/assesmentcategory";
import { useRouter } from "next/navigation";
import image from "@/public/common.png";
import Link from "next/link";
import ContactCTA from "@/components/shared/ContactCTA";

export default function CommonServicesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [openFaq, setOpenFaq] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<string | null>(null);

  const { data } = useGetProductsByCategoryIdQuery(id as string);
  const detailesData = data?.data;

  const { data: servicePageRes } = useGetServicePageDetailsQuery(id as string);
  const servicePageData = servicePageRes?.data;

  // Use dynamic FAQs if available, otherwise fallback to hardcoded ones
  const dynamicFaqs = servicePageData?.faqSection?.faqs?.length 
    ? servicePageData.faqSection.faqs.map((f: any) => ({ q: f.question, a: f.answer }))
    : [
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


  const handleEnter = (id: string) => {
    setShowPopup(id);
  };

  const handleLeave = () => {
    setShowPopup(null);
  };
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="dark" />

      {/* ── HERO BANNER ── */}
      <section className="pt-24 md:pt-32 px-4 sm:px-6 max-w-[1520px] mx-auto w-full">
        <div className="relative w-full h-[495px] rounded-[32px] overflow-hidden flex flex-col items-center justify-center text-center shadow-sm">
          <Image
            src={servicePageData?.heroSection?.bannerImage?.fileUrl || "/service.jpg"}
            alt="Service Banner"
            fill
            className="object-cover object-center z-0"
            priority
          />
          {/* Subtle gradient for text readability without washing out the image */}
          <div className="absolute inset-0 bg-black/10 z-10" />

          <div className="relative z-20 flex flex-col items-center justify-center w-full h-full py-[35px] px-[20px] md:px-[108px]">
            <p className="text-white text-[15px] font-light tracking-wide mb-[44px] flex items-center gap-1.5 drop-shadow-md">
              <Link href="/" className="hover:underline cursor-pointer">
                Services
              </Link>{" "}
              <ChevronRight className="w-4 h-4" />{" "}
              {detailesData?.[0]?.categoryName}
            </p>
            <h1 className="text-center text-white font-[Quicksand] text-[40px] md:text-[84px] font-bold leading-[100%] max-w-[1200px] mb-[44px] drop-shadow-lg">
              {servicePageData?.heroSection?.pageTitle || (
                <>Take control of your body with <br className="hidden md:block" /> our {detailesData?.[0]?.categoryName?.toLowerCase() || "weight loss"} service</>
              )}
            </h1>
            {/* <button className="bg-[#2563eb] hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-full transition-all duration-300 shadow-md text-[16px] tracking-wide">
              Start Assessment
            </button> */}
            <div
              className="relative inline-block"
            >
              <button
                className="flex items-center justify-center gap-[15px] px-[32px] py-[22px] rounded-[46px] bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-semibold text-[18px] transition-colors leading-none"
                onClick={() => {
                  const assessments = detailesData?.[0]?.assessments || [];
                  if (assessments.length === 1) {
                    router.push(`/assessment/${assessments[0].id}`);
                  } else if (assessments.length > 1) {
                    setShowPopup(showPopup === "hero" ? null : "hero");
                  }
                }}
              >
                Start Assessment
              </button>

              {showPopup === "hero" && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-0.5 w-64 bg-white rounded-xl shadow-lg p-2 z-50">
                  <div className="flex flex-col">
                    {detailesData?.[0]?.assessments?.map((item: any) => (
                      <Link
                        key={item.id}
                        href={`/assessment/${item.id}`}
                        className="px-4 py-1 text-left text-sm text-gray-700 hover:bg-blue-50 cursor-pointer rounded-md"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO TEXT ── */}
      <section className="max-w-[1168px] mx-auto px-4 sm:px-6 mt-16 text-center flex flex-col items-center">
        <h2 className="font-[Quicksand] text-[22px] font-semibold text-[#272628] text-center leading-[100%] mb-6">
          {servicePageData?.secondSection?.sectionTitle || `${detailesData?.[0]?.categoryName || "Weight Loss"} at WLMD`}
        </h2>
        <p className="text-center text-[#3B3B3B] font-[Quicksand] text-[16px] md:text-[20px] font-normal leading-[150%] mb-12">
          {servicePageData?.secondSection?.sectionDescription || (
            `We provide medical ${detailesData?.[0]?.categoryName?.toLowerCase() || "weight loss"} plans for our patients in Colorado. We offer programs customized to fit your specific needs, focusing on steady, consistent results over time. Your customized program may include a combination of FDA-approved medications, supplements, and B12/Lipotropic injections. Results may vary depending based on strict compliance. All treatments are supervised carefully with WLMD and state regulations. Results usually are often directly correlated with keeping up with care. For more details on individual outcomes, ask to see our medical providers.`
          )}
        </p>
        <button
          onClick={() =>
            window.open(
              servicePageData?.secondSection?.url || "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
              servicePageData?.secondSection?.buttonTarget ? "_blank" : "_self"
            )
          }
          className="flex items-center justify-center gap-[15px] border-[1.5px] border-[#272628] text-[#3B3B3B] font-[Quicksand] text-[20px] font-normal leading-[150%] px-[32px] py-[22px] rounded-[46px] hover:bg-gray-50 transition-colors"
        >
          {servicePageData?.secondSection?.ctaButtonText || "Book Appointment"}
        </button>
      </section>

      {/* ── SERVICE-2 IMAGE ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-16 w-full">
        <div className="relative w-full h-[300px] md:h-[450px] rounded-[32px] overflow-hidden">
          <Image
            // src="/service-2.png"
            src={image}
            alt="Fitness and wellness"
            fill
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-[100px] mb-16 w-full">
        <h2 className="font-[Quicksand] text-[54px] font-semibold text-[#272628] text-center leading-[110%] mb-[80px]">
          Our {detailesData?.[0]?.categoryName} Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {detailesData
            ?.flatMap((item) =>
              item.products.map((product) => ({
                ...product,
                title: product.name,
                desc: product.description,
                fullBleed: false,
              })),
            )
            ?.map((service, index) => (
              <div key={service.id || index} className="flex flex-col h-full">
                {/* Image Container */}
                <div
                  className={`relative flex items-end justify-center overflow-hidden rounded-[32px] mb-5 ${
                    service.fullBleed ? "bg-[#1a4a8a]" : ""
                  }`}
                  style={{
                    width: '100%',
                    height: '408px',
                    ...(service.fullBleed ? {} : {
                      background: "linear-gradient(180deg, #164095 0%, #3886FF 55%, #A3C7FF 85%, #FFFFFF 100%)",
                    })
                  }}
                >
                  {service.fullBleed ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="relative w-full h-[88%] flex items-end justify-center px-6 pb-2">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="object-contain max-h-full w-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 px-1">
                  <h3 className="font-[Quicksand] text-[22px] font-bold text-[#272628] leading-[120%] mb-2">
                    {service.title}
                  </h3>

                  <p className="font-[Quicksand] text-[20px] font-normal text-[#3B3B3B] leading-[150%] self-stretch flex-grow mb-5 line-clamp-3">
                    {service.desc
                      ? service.desc.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#[^;]+;/g, '').trim().slice(0, 120) + (service.desc.replace(/<[^>]*>/g, '').length > 120 ? '…' : '')
                      : 'No description available.'}
                  </p>

                  {/* <div>
                    <button className="bg-[#1D4ED8] hover:bg-[#1E40AF] active:scale-95 text-white text-[14px] font-medium px-6 py-2.5 rounded-full transition-all duration-150 shadow-sm">
                      Get Started
                    </button>
                  </div> */}
                  <div className="flex items-center gap-[24px]">
                    <div
                      className="relative inline-block"
                    >
                      {/* BUTTON */}
                      <button
                        className="flex items-center justify-center gap-[5px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-[Poppins] text-[20px] font-medium px-[30px] py-[4px] h-[50px] rounded-full transition-all"
                        onClick={() => {
                          const assessments = detailesData?.[0]?.assessments || [];
                          if (assessments.length === 1) {
                            router.push(`/assessment/${assessments[0].id}`);
                          } else if (assessments.length > 1) {
                            setShowPopup(showPopup === service.id ? null : service.id);
                          }
                        }}
                      >
                        Get Started
                      </button>

                      {/* POPUP */}
                      {showPopup === service.id && (
                        <div className="absolute top-full left-0 mt-1 w-60 bg-white rounded-xl shadow-lg p-2 z-50">
                          <div className="flex flex-col">
                            {detailesData?.[0]?.assessments?.map((item: any) => (
                              <div
                                key={item.id}
                                onClick={() => router.push(`/assessment/${item.id}`)}
                                className="px-4 py-2 text-base text-gray-700 hover:bg-blue-50 cursor-pointer rounded-md"
                              >
                                {item.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* VIEW DETAILS LINK */}
                    <Link
                      href={`/supplements/${service.id}`}
                      className="font-[Quicksand] text-[20px] font-semibold text-[#1D4ED8] leading-normal underline decoration-solid underline-offset-auto hover:text-[#1e40af] transition-colors"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-6 mt-[100px] mb-24 w-full">
        <h2 className="font-[Quicksand] text-[54px] font-semibold text-[#272628] text-center leading-[110%] mb-[50px]">
          {servicePageData?.faqSection?.sectionTitle || "Popular Facts & Questions"}
        </h2>


        {/* Accordion */}
        <div className="space-y-3">
          {dynamicFaqs.map((faq: any, index: number) => (
            <div
              key={index}
              className="rounded-[14px] overflow-hidden transition-all duration-300 bg-[#EBEEF2] self-stretch"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                <span className="font-[Quicksand] text-[20px] font-semibold text-[#272628] leading-[150%]">
                  {faq.q}
                </span>
                <span className="text-[24px] text-gray-500 font-light select-none flex-shrink-0 w-6 text-center">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaq === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex items-start gap-[20px] self-stretch pt-0 pb-[20px] px-[16px] pl-[26px]">
                  <p className="font-[Quicksand] text-[20px] font-normal text-[#272628] leading-[150%]">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactCTA />

      {/* <Footer />   */}
    </div>
  );
}
