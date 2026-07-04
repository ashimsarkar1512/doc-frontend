"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium text-lg"
    >
      <ArrowLeft className="w-5 h-5" />
      Back
    </button>
  );
}
