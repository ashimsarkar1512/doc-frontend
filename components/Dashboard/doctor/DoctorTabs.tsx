// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// export default function   DoctorTabs() {
//   const [activeTab, setActiveTab] = useState("Active Consultation");

//   const activeConsultationCards = [
//     {
//       id: 1,
//       image: "/doctor/doc-1.jpg",
//       category: "Weight Loss",
//       title: "Weight Loss",
//       patientName: "Jenny Wilson",
//       consultationId: "#001236",
//       buttonText: "Open Consultation",
//       status: "Approved",
//     },
//     {
//       id: 2,
//       image: "/doctor/doc-2.jpg",
//       category: "Hormone Therapy",
//       title: "Individual Therapy",
//       patientName: "Annette Black",
//       consultationId: "#001237",
//       buttonText: "Open Consultation",
//       status: "Approved",
//     },
//     {
//       id: 3,
//       image: "/doctor/doc-3.jpg",
//       category: "Hormone Therapy",
//       title: "Anxiety & Stress",
//       patientName: "Robert Fox",
//       consultationId: "#001238",
//       buttonText: "Open Consultation",
//       status: "Approved",
//     },
//     {
//       id: 4,
//       image: "/doctor/doc-4.jpg",
//       category: "Hormone Therapy",
//       title: "Clarity Consult",
//       patientName: "Esther Howard",
//       consultationId: "#001239",
//       buttonText: "View Details",
//       status: "Approved",
//     },
//     {
//       id: 5,
//       image: "/doctor/doc-1.jpg",
//       category: "Hormone Therapy",
//       title: "Personal Training",
//       patientName: "Cameron Williamson",
//       consultationId: "#001240",
//       buttonText: "Open Consultation",
//       status: "Approved",
//     },
//     {
//       id: 6,
//       image: "/doctor/doc-2.jpg",
//       category: "Hormone Therapy",
//       title: "Dietary Consultation",
//       patientName: "Floyd Miles",
//       consultationId: "#001241",
//       buttonText: "Open Consultation",
//       status: "Approved",
//     },
//   ];

//   const newRequestCards = [
//     {
//       id: 7,
//       image: "/doctor/doc-2.jpg",
//       category: "Hormone Therapy",
//       title: "Individual Therapy",
//       patientName: "Jenny Wilson",
//       consultationId: "#001237",
//       buttonText: "View Details",
//       status: "Pending",
//     },
//     {
//       id: 8,
//       image: "/doctor/doc-3.jpg",
//       category: "Hormone Therapy",
//       title: "Anxiety & Stress",
//       patientName: "Wade Warren",
//       consultationId: "#001238",
//       buttonText: "View Details",
//       status: "Pending",
//     },
//   ];

//   const getCards = () => {
//     if (activeTab === "New Request") return newRequestCards;
//     if (activeTab === "Active Consultation") return activeConsultationCards;
//     return [];
//   };

//   const cards = getCards();

//   const getTabClass = (tab: string) => {
//     const isActive = activeTab === tab;
//     const base =
//       "flex flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors md:rounded-none md:border-x-0 md:border-t-0 md:bg-transparent md:px-0 md:pb-4 md:pt-0 md:text-sm";

//     if (isActive) {
//       return `${base} border-[#2563eb] bg-[#2563eb] text-white shadow-sm shadow-blue-100 md:border-b-2 md:text-[#2563eb] md:shadow-none`;
//     }

//     return `${base} border-transparent bg-white text-gray-600 hover:bg-blue-50 hover:text-gray-900 md:border-b-2 md:hover:bg-transparent`;
//   };

//   return (
//     <>
//       {/* Tabs */}
//       <div className="mb-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible">
//         <div className="flex w-max min-w-full gap-2 rounded-2xl bg-gray-50 p-1 md:w-full md:gap-8 md:rounded-none md:border-b md:border-gray-200 md:bg-transparent md:p-0">
//           <button
//             onClick={() => setActiveTab("Active Consultation")}
//             className={getTabClass("Active Consultation")}
//           >
//             Active Consultation
//             <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#10b981] text-xs text-white">
//               5
//             </span>
//           </button>
//           <button
//             onClick={() => setActiveTab("New Request")}
//             className={getTabClass("New Request")}
//           >
//             New Request
//             <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#eab308] text-xs text-white">
//               2
//             </span>
//           </button>
//           <button
//             onClick={() => setActiveTab("Declined Request")}
//             className={getTabClass("Declined Request")}
//           >
//             Declined Request
//             <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#ef4444] text-xs text-white">
//               1
//             </span>
//           </button>
//           <button
//             onClick={() => setActiveTab("History")}
//             className={getTabClass("History")}
//           >
//             History
//           </button>
//         </div>
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {cards.map((card) => (
//           <div key={card.id} className="flex flex-col">
//             {/* Image */}
//             <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50 shadow-sm border border-gray-100/50">
//               <Image
//                 src={card.image}
//                 alt={card.title}
//                 fill
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//                 className="object-cover hover:scale-105 transition-transform duration-500"
//               />
//               {/* Status Badge */}
//               <div
//                 className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-semibold shadow-sm backdrop-blur-md border ${
//                   card.status === "Pending"
//                     ? "bg-[#eab308]/90 border-[#eab308]/60"
//                     : "bg-white/25 border-white/40"
//                 }`}
//               >
//                 {card.status}
//               </div>
//             </div>

//             {/* Card Body */}
//             <div className="flex flex-col flex-grow">
//               {/* Category */}
//               <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full w-fit mb-2">
//                 {card.category}
//               </span>

//               {/* Title */}
//               <h3 className="text-base font-bold text-gray-900 mb-1">
//                 {card.title}
//               </h3>

//               {/* Patient Name */}
//               <p className="text-gray-500 text-sm mb-4">
//                 Patient:{" "}
//                 <span className="text-gray-700 font-medium">
//                   {card.patientName}
//                 </span>
//               </p>

//               {/* Button */}
//               <div className="mt-auto">
//                 <Link
//                   href={`/doctor?consultationId=${card.consultationId.replace("#", "")}`}
//                 >
//                   <button className="bg-[#2563eb] hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2.5 px-6 rounded-full w-fit">
//                     {card.buttonText}
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Empty state */}
//         {cards.length === 0 && (
//           <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400">
//             <p className="text-sm font-medium">No records found.</p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }



"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetMyConsultationsQuery } from "@/Redux/features/doctorDashboard/doctorDashboardApi";

export default function DoctorTabs() {
  const [activeTab, setActiveTab] = useState("ACTIVE_CONSULTATION");
  const [page, setPage] = useState(1);
  const limit = 8;

  // ===============================
  // API CALL
  // ===============================
  const { data, isLoading } = useGetMyConsultationsQuery({
    tab: activeTab,
    page,
    limit,
  });

  console.log(data);

  // ===============================
  // SAFE API RESPONSE
  // IMPORTANT: backend is NOT nested under data.data
  // ===============================
  const consultations = data?.consultations || [];
  const tabCounts = data?.counts || {};
  const meta = data?.meta || {};

  // ===============================
  // TRANSFORM API → UI FORMAT
  // ===============================
  const cards = useMemo(() => {
    return consultations.map((item: any) => ({
      id: item.id,
      image: item.thumbnail || "/doctor/doc-1.jpg",
      category: item.category || "General",
      title: item.title || "Consultation",
      patientName: item.patientName || "Unknown",
      consultationId: `#${item.id}`,

      buttonText:
        item.status === "PENDING"
          ? "View Details"
          : "Open Consultation",

      status:
        item.status === "PENDING"
          ? "Pending"
          : item.status === "REJECTED"
          ? "Declined"
          : "Approved",
    }));
  }, [consultations]);

  // ===============================
  // TABS CONFIG (FIXED COUNTS)
  // ===============================
  const TABS = [
    {
      label: "Active Consultation",
      value: "ACTIVE_CONSULTATION",
      count: tabCounts.ACTIVE_CONSULTATION ?? 0,
      color: "#10b981",
    },
    {
      label: "New Request",
      value: "NEW_REQUEST",
      count: tabCounts.NEW_REQUEST ?? 0,
      color: "#eab308",
    },
    {
      label: "Declined Request",
      value: "DECLINED_REQUEST",
      count: tabCounts.DECLINED_REQUEST ?? 0,
      color: "#ef4444",
    },
    {
      label: "History",
      value: "HISTORY",
      count: tabCounts.HISTORY ?? 0,
      color: "#6b7280",
    },
  ];

  // ===============================
  // HANDLERS
  // ===============================
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const nextPage = () => {
    if (meta?.totalPages > page) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // ===============================
  // UI CLASS (UNCHANGED)
  // ===============================
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
      {/* ================= TABS ================= */}
      <div className="mb-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible">
        <div className="flex w-max min-w-full gap-2 rounded-2xl bg-gray-50 p-1 md:w-full md:gap-8 md:rounded-none md:border-b md:border-gray-200 md:bg-transparent md:p-0">

          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={getTabClass(tab.value)}
            >
              {tab.label}

              <span
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs text-white"
                style={{ backgroundColor: tab.color }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= LOADING ================= */}
      {isLoading ? (
        <div className="py-10 text-center text-gray-400">
          Loading...
        </div>
      ) : (
        <>
          {/* ================= CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card: any) => (
              <div key={card.id} className="flex flex-col">

                {/* Image */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50 shadow-sm border border-gray-100/50">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />

                  <div
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-semibold shadow-sm ${
                      card.status === "Pending"
                        ? "bg-[#eab308]/90"
                        : card.status === "Declined"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {card.status}
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-grow">
                  <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full w-fit mb-2">
                    {card.category}
                  </span>

                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {card.title}
                  </h3>

                  <p className="text-gray-500 text-sm mb-4">
                    Patient:{" "}
                    <span className="text-gray-700 font-medium">
                      {card.patientName}
                    </span>
                  </p>

                  <div className="mt-auto">
                    <Link
                      href={`/doctor?consultationId=${card.consultationId.replace("#", "")}`}
                    >
                      <button className="bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-6 rounded-full w-fit">
                        {card.buttonText}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty */}
            {cards.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400">
                <p className="text-sm font-medium">No records found.</p>
              </div>
            )}
          </div>

          {/* ================= PAGINATION ================= */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-3 py-2 text-sm text-gray-600">
              Page {page} / {meta?.totalPages || 1}
            </span>

            <button
              onClick={nextPage}
              disabled={page >= (meta?.totalPages || 1)}
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}