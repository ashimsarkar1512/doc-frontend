"use client";

import React from "react";
import Image from "next/image";
import { useAppSelector } from "@/Redux/store/hooks";

export default function DoctorWelcomeData() {
  const user = useAppSelector((state) => state.auth.user);
//   console.log(user)

  const name = user?.profile?.name || "Doctor";
//   const avatar = user?.profile?.avatar || "/doctor/profile-doc.png";
  const avatar = user?.profile?.avatar ;

  return (
    <div className="flex items-center gap-5 mb-8 ">
      <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-sm border border-gray-100">
        {/* <Image
          src={avatar}
          alt={name}
           unoptimized
          fill
          className="object-cover"
        /> */}
        <img src={avatar} alt="name"
         className="w-full h-full object-cover"
         />
      </div>

      <div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-1">
          Welcome Back, Dr. {name} !
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your patients and consultations
        </p>
      </div>
    </div>
  );
}