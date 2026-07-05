/* eslint-disable @typescript-eslint/no-explicit-any */


// "use client";

// import React, { useState, useMemo } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useGetMyConsultationsQuery } from "@/Redux/features/doctorDashboard/doctorDashboardApi";
// import  fallBackImg from "@/public/p-image-fallback.jpg"
// import { ClipLoader } from "react-spinners";

// export default function DoctorTabs() {
//   const [activeTab, setActiveTab] = useState("NEW_REQUEST");
//   const [page, setPage] = useState(1);
//   const limit = 8;

//   // ===============================
//   // API CALL
//   // ===============================
//   const { data, isLoading } = useGetMyConsultationsQuery({
//     tab: activeTab,
//     page,
//     limit,
//   });

//   // console.log(data);

//   // ===============================
//   // SAFE API RESPONSE
//   // IMPORTANT: backend is NOT nested under data.data
//   // ===============================
//   const consultations = data?.consultations || [];
//   console.log(consultations)
//   const tabCounts = data?.counts || {};
//   const meta = data?.meta || {};

//   // ===============================
//   // TRANSFORM API → UI FORMAT
//   // ===============================
//   const cards = useMemo(() => {
//     return consultations.map((item: any) => ({
//       id: item.id,
//       image: item.thumbnail || "/doctor/doc-1.jpg",
//       category: item.category || "General",
//       title: item.title || "Consultation",
//       patientName: item.patientName || "Unknown",
//       consultationId: `#${item.id}`,

//       buttonText:
//         item.status === "PENDING" ? "View Details" : "Open Consultation",

//       status:
//         item.status === "PENDING"
//           ? "Pending"
//           : item.status === "REJECTED"
//             ? "Declined"
//             : "Approved",
//     }));
//   }, [consultations]);

//   // ===============================
//   // TABS CONFIG (FIXED COUNTS)
//   // ===============================
//   const TABS = [
//     {
//       label: "Active Consultation",
//       value: "ACTIVE_CONSULTATION",
//       count: tabCounts.ACTIVE_CONSULTATION ?? 0,
//       color: "#10b981",
//     },
//     {
//       label: "New Request",
//       value: "NEW_REQUEST",
//       count: tabCounts.NEW_REQUEST ?? 0,
//       color: "#eab308",
//     },
//     {
//       label: "Declined Request",
//       value: "DECLINED_REQUEST",
//       count: tabCounts.DECLINED_REQUEST ?? 0,
//       color: "#ef4444",
//     },
//     {
//       label: "History",
//       value: "HISTORY",
//       count: tabCounts.HISTORY ?? 0,
//       color: "#6b7280",
//     },
//   ];

//   // ===============================
//   // HANDLERS
//   // ===============================
//   const handleTabChange = (tab: string) => {
//     setActiveTab(tab);
//     setPage(1);
//   };

//   const nextPage = () => {
//     if (meta?.totalPages > page) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   const prevPage = () => {
//     if (page > 1) setPage((prev) => prev - 1);
//   };

//   // ===============================
//   // UI CLASS (UNCHANGED)
//   // ===============================
//   const getTabClass = (tab: string) => {
//     const isActive = activeTab === tab;
//     const base =
//       "pb-[8px] text-[16px] md:text-[20px] font-[Quicksand] leading-[150%] font-medium flex items-center gap-2 whitespace-nowrap transition-all duration-150 border-b-2";

//     if (isActive) {
//       return `${base} text-[#2558E5] border-[#2558E5]`;
//     }

//     return `${base} text-[#272628] border-transparent hover:text-black`;
//   };

//   return (
//     <>
//       {/* ================= TABS ================= */}
//       <div className="flex items-center gap-[20px] border-b border-[#E5E7EB] mb-8 overflow-x-auto select-none scrollbar-none">
//         {TABS.map((tab) => (
//           <button
//             key={tab.value}
//             onClick={() => handleTabChange(tab.value)}
//             className={getTabClass(tab.value)}
//           >
//             <span>{tab.label}</span>
//             {tab.count > 0 && (
//               <span
//                 className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
//                 style={{ backgroundColor: tab.color }}
//               >
//                 {tab.count}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* ================= LOADING ================= */}
//       {isLoading ? (
//         <div className="w-full min-h-[300px] flex items-center justify-center">
//         <ClipLoader size={50} color="#2563eb" />
//       </div>
//       ) : (
//         <>
//           {/* ================= CARDS ================= */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//             {cards.map((card: any) => (
//               <div key={card.id} className="flex flex-col group w-full">
//                 {/* Image Container with pill status tag */}
//                 <div className="relative w-full h-[340px] rounded-[24px] overflow-hidden bg-gray-50">
//                   <Image
//                     src={card.image}
//                     alt={card.title}
//                     onError={(e) => {
//                       e.currentTarget.src = fallBackImg.src;
//                     }}
//                     fill
//                     className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
//                     unoptimized
//                   />

//                   <span
//                     className={`absolute top-4 left-4 px-3.5 py-1 text-xs font-semibold rounded-full shadow-sm select-none text-white backdrop-blur-[1px] ${
//                       card.status === "Pending"
//                         ? "bg-[#eab308]/90"
//                         : card.status === "Declined"
//                           ? "bg-red-500/90"
//                           : "bg-[#10b981]/90"
//                     }`}
//                   >
//                     {card.status}
//                   </span>
//                 </div>

//                 {/* Card Detail Content */}
//                 <div className="flex flex-col items-start mt-[16px] flex-grow">
//                   {/* Category Badge */}
//                   <span className="inline-flex items-center justify-center gap-[15px] px-[12px] py-[8px] text-[16px] font-[Quicksand] font-normal leading-[100%] text-[#272628] bg-[#EAF3FF] rounded-[46px] mb-[8px]">
//                     {card.category}
//                   </span>

//                   {/* Title */}
//                   <h3 className="text-[24px] font-bold text-[#272628] font-[Quicksand] leading-[150%] group-hover:text-[#1D4ED8] transition-colors mb-[8px]">
//                     {card.title}
//                   </h3>

//                   {/* Subtitle / Patient */}
//                   <p className="text-[20px] text-[#272628] font-[Quicksand] font-normal leading-[100%] mb-[16px]">
//                     Patient: {card.patientName}
//                   </p>

//                   <div className="mt-auto  ">
//                     <Link
//                       href={`/doctor?consultationId=${card.consultationId.replace("#", "")}`}
//                     >
//                       <button className="inline-flex items-center justify-center px-[18px] h-[42px] bg-[#2558E5] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-[Quicksand] font-medium text-[18px] leading-[100%] rounded-[50px] transition-all text-center">
//                         {card.buttonText}
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* Empty */}
//             {cards.length === 0 && (
//               <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400">
//                 <p className="text-xl font-medium">No records found.</p>
//               </div>
//             )}
//           </div>

//           {cards.length > 0 && (
//             <div className="flex justify-center gap-4 mt-10">
//               <button
//                 onClick={prevPage}
//                 disabled={page === 1}
//                 className="px-4 py-2 bg-gray-100 text-black rounded disabled:opacity-50"
//               >
//                 Prev
//               </button>

//               <span className="px-3 py-2 text-sm text-gray-600">
//                 Page {page} / {meta?.totalPages || 1}
//               </span>

//               <button
//                 onClick={nextPage}
//                 disabled={page >= (meta?.totalPages || 1)}
//                 className="px-4 py-2 bg-gray-100 text-black rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </>
//   );
// }



"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetMyConsultationsQuery } from "@/Redux/features/doctorDashboard/doctorDashboardApi";
import fallBackImg from "@/public/p-image-fallback.jpg";
import { ClipLoader } from "react-spinners";

// Define SubmissionStatus enum based on your schema
enum SubmissionStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  ACCEPTED = "ACCEPTED",
  REFIL_REQUESTED = "REFIL_REQUESTED",
  REJECTED = "REJECTED",
}

export default function DoctorTabs() {
  const [activeTab, setActiveTab] = useState("NEW_REQUEST");
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

  // ===============================
  // SAFE API RESPONSE
  // ===============================
  const consultations = data?.consultations || [];
  const tabCounts = data?.counts || {};
  const meta = data?.meta || {};

  // ===============================
  // STATUS FORMATTER (FIXED)
  // ===============================
const formatStatus = (status: string): string => {
  switch (status) {
    case SubmissionStatus.DRAFT:
      return "Draft";

    case SubmissionStatus.PENDING:
      return "Pending";

    case SubmissionStatus.REVIEWED:
      return "Reviewed";

    case SubmissionStatus.ACCEPTED:
      return "Accepted";

    case SubmissionStatus.REFIL_REQUESTED:
      return "Refill Requested";

    case SubmissionStatus.REJECTED:
      return "Declined";

    default:
      return status ? status.replaceAll("_", " ") : "Unknown";
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "Pending":
    case "Refill Requested":
      return "bg-[#eab308]/90"; // Yellow
    case "Declined":
      return "bg-red-500/90"; // Red
    case "Accepted":
    case "Reviewed":
      return "bg-[#10b981]/90"; // Green
    default:
      return "bg-gray-500/90"; // Gray for others like Draft
  }
};

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
      consultationId: item.id, // ✅ clean

      buttonText:
        item.status === SubmissionStatus.PENDING ? "View Details" : "Open Consultation",

      status: formatStatus(item.status), // ✅ fixed
    }));
  }, [consultations]);

  // ===============================
  // TABS CONFIG
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
  // UI CLASS
  // ===============================
  const getTabClass = (tab: string) => {
    const isActive = activeTab === tab;
    const base =
      "pb-[8px] text-[16px] md:text-[20px] font-[Quicksand] leading-[150%] font-medium flex items-center gap-2 whitespace-nowrap transition-all duration-150 border-b-2";

    if (isActive) {
      return `${base} text-[#2558E5] border-[#2558E5]`;
    }

    return `${base} text-[#272628] border-transparent hover:text-black`;
  };

  return (
    <>
      {/* ================= TABS ================= */}
      <div className="flex items-center gap-[20px] border-b border-[#E5E7EB] mb-8 overflow-x-auto select-none scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={getTabClass(tab.value)}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ backgroundColor: tab.color }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ================= LOADING ================= */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col w-full animate-pulse">
              {/* Image Skeleton */}
              <div className="w-full h-[340px] rounded-[24px] bg-gray-200"></div>
              {/* Content Skeleton */}
              <div className="flex flex-col items-start mt-[16px]">
                {/* Category Badge Skeleton */}
                <div className="h-[32px] w-24 bg-gray-200 rounded-full mb-[8px]"></div>
                {/* Title Skeleton */}
                <div className="h-7 w-3/4 bg-gray-200 rounded mb-[8px]"></div>
                {/* Patient Name Skeleton */}
                <div className="h-5 w-1/2 bg-gray-200 rounded mb-[16px]"></div>
                {/* Button Skeleton */}
                <div className="h-[42px] w-32 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ================= CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {cards.map((card: any) => (
              <div key={card.id} className="flex flex-col group w-full">
                <div className="relative w-full h-[340px] rounded-[24px] overflow-hidden bg-gray-50">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    // unoptimized
                  />

                  <span
                    className={`absolute top-4 left-4 px-3.5 py-1 text-xs font-semibold rounded-full shadow-sm select-none text-white backdrop-blur-[1px] ${getStatusClass(card.status)}`}
                  >
                    {card.status}
                  </span>
                </div>

                <div className="flex flex-col items-start mt-[16px] flex-grow">
                  <span className="inline-flex items-center justify-center gap-[15px] px-[12px] py-[8px] text-[16px] font-[Quicksand] text-[#272628] bg-[#EAF3FF] rounded-[46px] mb-[8px]">
                    {card.category}
                  </span>

                  <h3 className="text-[24px] font-bold text-[#272628] font-[Quicksand] leading-[150%] group-hover:text-[#1D4ED8] transition-colors mb-[8px]">
                    {card.title}
                  </h3>

                  <p className="text-[20px] text-[#272628] font-[Quicksand] mb-[16px]">
                    Patient: {card.patientName}
                  </p>

                  <div className="mt-auto">
                    <Link
                      href={`/doctor?consultationId=${card.consultationId}`}
                    >
                      <button className="inline-flex items-center justify-center px-[18px] h-[42px] bg-[#2558E5] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-[Quicksand] text-[18px] rounded-[50px] transition-all">
                        {card.buttonText}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {cards.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400">
                <p className="text-xl font-medium">No records found.</p>
              </div>
            )}
          </div>

          {meta?.total > limit && (
            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-100 text-black rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="px-3 py-2 text-sm text-gray-600">
                Page {page} / {meta?.totalPages || 1}
              </span>

              <button
                onClick={nextPage}
                disabled={page >= (meta?.totalPages || 1)}
                className="px-4 py-2 bg-gray-100 text-black rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}