"use client"

import React from "react";
import {
  Stethoscope,
  ClipboardPlus,
  Shield,
  ShieldBan,

} from "lucide-react";
import { useGetDoctorDashboardStatsQuery } from "@/Redux/features/doctorDashboard/doctorDashboardApi";

export default function DashboardStatsCards() {
    const {data}=useGetDoctorDashboardStatsQuery({})
    // console.log(data)
    const metaData=data?.data
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-[rgba(29,78,216,0.16)]  rounded-2xl p-6 flex items-start justify-between shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-[#355ff5] mb-5">{metaData?.totalConsulted || 0}</h2>
            <p className="text-gray-700 font-medium text-xl">Total Consulted</p>
          </div>
          <Stethoscope className="w-7 h-7 text-[#355ff5]" strokeWidth={2} />
        </div>

        <div className="bg-[#dcfce7] rounded-2xl p-6 flex items-start justify-between shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-[#16a34a] mb-5">{metaData?.activeConsultation || 0}</h2>
            <p className="text-gray-700 font-medium text-xl">
              Active Consultation
            </p>
          </div>
          <ClipboardPlus className="w-7 h-7 text-[#16a34a]" strokeWidth={2} />
        </div>

        <div className="bg-[#fef9c3] rounded-2xl p-6 flex items-start justify-between shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-[#ca8a04] mb-5">{metaData?.newConsultation || 0}</h2>
            <p className="text-gray-700 font-medium text-xl ">New Request</p>
          </div>
          <Shield className="w-7 h-7 text-[#ca8a04]" strokeWidth={2} />
        </div>

        <div className="bg-[#ffe4e6] rounded-2xl p-6 flex items-start justify-between shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-[#e11d48] mb-5">{metaData?.declined || 0}</h2>
            <p className="text-gray-700 font-medium text-xl">
              Declined Request
            </p>
          </div>
          <ShieldBan className="w-7 h-7 text-[#e11d48]" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
