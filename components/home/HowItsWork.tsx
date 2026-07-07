'use client'

import Image from "next/image";
import React from "react";
import { useHomepageContent } from "@/providers/HomepageContentProvider";
import { motion } from "framer-motion";

const defaultSteps = [
  {
    number: 1,
    title: "Complete Your Medical Intake",
    description: "Share your health history and goals",
  },
  {
    number: 2,
    title: "Provider Evaluation",
    description: "A licensed medical provider reviews your information",
  },
  {
    number: 3,
    title: "Personalized Treatment Plan",
    description: "Based on your individual needs and clinical assessment",
  },
  {
    number: 4,
    title: "Ongoing Support & Monitoring",
    description: "Adjustments made as appropriate over time",
  },
];

const HowItsWork: React.FC = () => {
  const { content, isLoading } = useHomepageContent();
  // console.log(content)

  const title = content?.howItWorksTitle || "How It Works";
  const stepsToDisplay = content
    ? [
      {
        number: 1,
        title: content.howItWorksStep1Title || defaultSteps[0].title,
        description: content.howItWorksStep1Description || defaultSteps[0].description,
      },
      {
        number: 2,
        title: content.howItWorksStep2Title || defaultSteps[1].title,
        description: content.howItWorksStep2Description || defaultSteps[1].description,
      },
      {
        number: 3,
        title: content.howItWorksStep3Title || defaultSteps[2].title,
        description: content.howItWorksStep3Description || defaultSteps[2].description,
      },
      {
        number: 4,
        title: content.howItWorksStep4Title || defaultSteps[3].title,
        description: content.howItWorksStep4Description || defaultSteps[3].description,
      },
    ]
    : defaultSteps;


  return (
    <section className="w-full bg-white pt-[90px] pb-[120px] px-4 md:px-8 font-sans">
      <div className="max-w-[1520px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-[60px] items-stretch">
        {/* Left Side: Split Image Banner */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="xl:col-span-6 w-full h-full"
        >
          <div className="w-full h-full aspect-[4/3] md:aspect-[1.22] xl:aspect-auto relative rounded-[2rem] overflow-hidden shadow-sm group">
            {/* Using an Unsplash placeholder of transformation tracking to match Figma layout */}
            <Image
              src="/howItsWork.png"
              alt="Before and after progress illustration"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>

        {/* Right Side: Content & List Steps */}
        <div className="xl:col-span-6 flex flex-col justify-start">
          {/* Main Title Section */}
          {isLoading ? (
            <div className="h-10 w-2/3 bg-gray-200 animate-pulse rounded-xl mb-8" />
          ) : (
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="uppercase mb-[40px] lg:mb-[80px] text-[36px] lg:text-[54px] font-semibold text-left font-[Quicksand] leading-[110%] text-[#272628]"
            >
              {title}
            </motion.h2>
          )}

          {/* Process Rows Stack */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.4,
                },
              },
            }}
            className="flex flex-col gap-[20px] w-full"
          >
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl w-full" />
              ))
            ) : (
              stepsToDisplay.map((step) => (
                <motion.div
                  key={step.number}
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0, transition: { duration: 1.0, ease: "easeOut" } },
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="w-full bg-[#EAF3FF] rounded-[19px] px-[23px] py-[20px] flex items-center gap-[20px] border border-blue-50/10 hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm shadow-blue-600/20">
                    {step.number}
                  </div>

                  {/* Text Block */}
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[20px] lg:text-[26px] font-bold font-[Quicksand] leading-[150%] text-[#191B1C]">
                      {step.title}
                    </h3>
                    <p className="text-[16px] lg:text-[20px] font-normal font-[Quicksand] leading-[150%] text-[#2B2922]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItsWork;
