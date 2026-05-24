"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DoctorTabs() {
  const [activeTab, setActiveTab] = useState("Active Consultation");

  const activeConsultationCards = [
    {
      id: 1,
      image: "/doctor/doc-1.jpg",
      category: "Weight Loss",
      title: "Weight Loss",
      consultationId: "#001236",
      buttonText: "Open Consultation",
      status: "Approved",
    },
    {
      id: 2,
      image: "/doctor/doc-2.jpg",
      category: "Hormone Therapy",
      title: "Individual Therapy",
      consultationId: "#001237",
      buttonText: "Open Consultation",
      status: "Approved",
    },
    {
      id: 3,
      image: "/doctor/doc-3.jpg",
      category: "Hormone Therapy",
      title: "Anxiety & Stress",
      consultationId: "#001238",
      buttonText: "Open Consultation",
      status: "Approved",
    },
    {
      id: 4,
      image: "/doctor/doc-4.jpg",
      category: "Hormone Therapy",
      title: "Clarity Consult",
      consultationId: "#001239",
      buttonText: "View Details",
      status: "Approved",
    },
    {
      id: 5,
      image: "/doctor/doc-1.jpg",
      category: "Hormone Therapy",
      title: "Personal Training",
      consultationId: "#001240",
      buttonText: "Open Consultation",
      status: "Approved",
    },
    {
      id: 6,
      image: "/doctor/doc-2.jpg",
      category: "Hormone Therapy",
      title: "Dietary Consultation",
      consultationId: "#001241",
      buttonText: "Open Consultation",
      status: "Approved",
    },
  ];

  const newRequestCards = [
    {
      id: 7,
      image: "/doctor/doc-2.jpg",
      category: "Hormone Therapy",
      title: "Individual Therapy",
      consultationId: "#001237",
      buttonText: "View Details",
      status: "Pending",
    },
    {
      id: 8,
      image: "/doctor/doc-3.jpg",
      category: "Hormone Therapy",
      title: "Anxiety & Stress",
      consultationId: "#001238",
      buttonText: "View Details",
      status: "Pending",
    },
  ];

  const getCards = () => {
    if (activeTab === "New Request") return newRequestCards;
    if (activeTab === "Active Consultation") return activeConsultationCards;
    return [];
  };

  const cards = getCards();

  const getTabClass = (tab: string) => {
    const isActive = activeTab === tab;
    const base =
      "flex flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors md:rounded-none md:border-x-0 md:border-t-0 md:bg-transparent md:px-0 md:pb-4 md:pt-0 md:text-sm";

    if (isActive) {
      return `${base} border-[#2563eb] bg-[#2563eb] text-white shadow-sm shadow-blue-100 md:border-b-2 md:text-[#2563eb] md:shadow-none`;
    }

    return `${base} border-transparent bg-white text-gray-600 hover:bg-blue-50 hover:text-gray-900 md:border-b-2 md:hover:bg-transparent`;
  };

  return (
    <>
      <div className="mb-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible">
        <div className="flex w-max min-w-full gap-2 rounded-2xl bg-gray-50 p-1 md:w-full md:gap-8 md:rounded-none md:border-b md:border-gray-200 md:bg-transparent md:p-0">
        <button 
          onClick={() => setActiveTab("Active Consultation")}
          className={getTabClass("Active Consultation")}
        >
          Active Consultation
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#10b981] text-xs text-white">
            5
          </span>
        </button>
        <button 
          onClick={() => setActiveTab("New Request")}
          className={getTabClass("New Request")}
        >
          New Request
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#eab308] text-xs text-white">
            2
          </span>
        </button>
        <button 
          onClick={() => setActiveTab("Declined Request")}
          className={getTabClass("Declined Request")}
        >
          Declined Request
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#ef4444] text-xs text-white">
            1
          </span>
        </button>
        <button 
          onClick={() => setActiveTab("History")}
          className={getTabClass("History")}
        >
          History
        </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="flex flex-col">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50 shadow-sm border border-gray-100/50">
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div 
                className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-semibold shadow-sm backdrop-blur-md border ${
                  card.status === 'Pending' 
                    ? 'bg-[#eab308]/80 border-[#eab308]' 
                    : 'bg-white/30 border-white/40'
                }`}
              >
                {card.status}
              </div>
            </div>
            
              <div className="flex flex-col flex-grow">
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full w-fit mb-2">
                  {card.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-gray-500 text-sm mb-4">Consultation id: {card.consultationId}</p>
                
                <div className="mt-auto">
                  <Link href={`/doctor?consultationId=${card.consultationId.replace('#', '')}`}>
                    <button className="bg-[#2563eb] hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2.5 px-6 rounded-full w-fit">
                      {card.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
          </div>
        ))}
      </div>
    </>
  );
}
