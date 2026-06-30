"use client";

import React from "react";
import Image from "next/image";
import { useAppSelector } from "@/Redux/store/hooks";

export default function DoctorWelcomeData() {
  const user = useAppSelector((state) => state.auth.user);
  // console.log(user)
const fallback = "/doctor/profile-doc.png";
  const name = user?.profile?.name || "X";

const avatar =
  user?.profile?.avatar ?? fallback; // use ?? instead of ||
  // const avatar = user?.profile?.avatar ;

  return (
    <div className="flex items-center gap-5 mb-8 ">
      <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-sm border border-gray-100">
     <Image
    src={avatar}
    alt={name}
    width={80}
    height={80}
    className="object-cover w-full h-full"
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