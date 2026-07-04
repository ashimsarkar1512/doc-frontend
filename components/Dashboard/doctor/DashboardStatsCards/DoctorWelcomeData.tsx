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

  const initials = name !== "X" ? name.charAt(0).toUpperCase() : "D";

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-[16px] md:gap-[24px] mb-[32px] md:mb-[44px]">
      {user?.profile?.avatar ? (
        <Image
          src={user.profile.avatar}
          alt={name}
          width={80}
          height={80}
          className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full object-cover shadow-sm select-none border-2 border-white mx-auto md:mx-0"
        />
      ) : (
        <div className="relative w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full overflow-hidden bg-[#2e5e54] text-white font-bold text-[24px] md:text-[32px] flex items-center justify-center shadow-sm select-none border-2 border-white mx-auto md:mx-0">
          {initials}
        </div>
      )}
      <div className="flex flex-col gap-[4px] md:gap-[8px]">
        <h2 className="text-[28px] md:text-[40px] font-semibold tracking-tight text-[#272628] font-[Quicksand] leading-[110%]">
          Welcome Back, {name}!
        </h2>
        <p className="text-[16px] md:text-[20px] text-[#272628] font-[Quicksand] font-normal leading-[100%]">
          Manage your patients and consultations
        </p>
      </div>
    </div>
  );
}