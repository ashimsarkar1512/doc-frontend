"use client";

import Footer from "@/components/shared/Footer";
import Logo from "@/components/ui/Logo";
import { useLogout } from "@/Redux/hooks/useLogout";
import { useAppSelector } from "@/Redux/store/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Mail, Menu, X, Home, Bell, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Navbar from "@/components/shared/Navbar";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col bg-[#f8fafc]">
      <Navbar variant="dark" initialPadding="py-3" scrolledPadding="py-3" alwaysSolidBg />
      {/* --- Dynamic Content Area --- */}
      <main className="flex-1 flex flex-col mt-10">{children}</main>

   
    </div>
  );
}
