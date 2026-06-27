"use client";

import Image from "next/image";
// import { useGetCurrentUserQuery } from "@/Redux/features/auth/authApi";
import fallBackImg from "@/public/p-image-fallback.jpg";
import { useGetCurrentUserQuery } from "@/Redux/api/authApi";

export default function DoctorWelcome() {
  const { data, isLoading } = useGetCurrentUserQuery();

  const user = data?.data;

  // ✅ match your backend structure
  const name = user?.profile?.name || "Doctor";
  const avatar = user?.profile?.avatar || fallBackImg;

  return (
    <div className="flex items-center gap-5 mb-8 ">
      <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-sm border border-gray-100">
        <Image
          src={avatar}
          alt={name}
          fill
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = fallBackImg.src;
          }}
          className="object-cover"
        />
      </div>

      <div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-1">
          {isLoading
            ? "Loading..."
            : `Welcome Back, Dr. ${name}!`}
        </h1>

        <p className="text-gray-500 text-sm">
          Manage your patients and consultations
        </p>
      </div>
    </div>
  );
}