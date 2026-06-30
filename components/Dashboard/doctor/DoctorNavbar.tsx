"use client";

import Logo from "@/components/ui/Logo";
import { useLogout } from "@/Redux/hooks/useLogout";
import { useAppSelector } from "@/Redux/store/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, LogOut, User, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

export default function DoctorNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout, isLoading: isLoggingOut } = useLogout();
  const user = useAppSelector((state) => state.auth.user);
  // console.log(user)

  const getDisplayName = () => {
    if (user?.profile?.name) return user.profile.name;
    if (user?.email) return user.email.split("@")[0];
    return "Doctor";
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "My Profile",
      href: "/doctor?view=settings",
      icon: User,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 md:px-8 md:py-4">
        <Link
          href="/"
          className="flex min-w-0 items-center"
          aria-label="Doctor dashboard"
        >
          <span className="block w-[132px] sm:w-[160px] md:w-[180px] [&_img]:h-auto [&_img]:w-full">
            <Logo />
          </span>
        </Link>

        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          {/* Notifications */}
          <NotificationDropdown />

          <div className="hidden min-w-0 text-right min-[380px]:block">
            <span className="block max-w-[150px] truncate text-xs font-semibold text-gray-700 sm:max-w-none sm:text-sm">
              {getDisplayName()}
            </span>
            <span className="hidden text-[11px] text-gray-400 sm:block">
              Doctor
            </span>
          </div>

          {/* Profile Button + Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex min-w-0 items-center gap-1 rounded-xl px-1.5 py-1 transition-colors hover:bg-gray-50 sm:px-2"
              aria-label="Open doctor profile menu"
              aria-expanded={isOpen}
            >
              <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 sm:h-10 sm:w-10">
                {user?.profile?.avatar ? (
                  // <Image
                  //   src={user.profile.avatar}
                  //   alt={getDisplayName()}
                  //   fill
                  //   sizes="40px"
                  //   className="object-cover"
                  // />
                  <img src={user.profile.avatar} alt={getDisplayName()} className="object-cover w-full h-full"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm">
                    {getInitials()}
                  </div>
                )}
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-500" />
              </motion.div>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60 overflow-hidden"
                  style={{ transformOrigin: "top right" }}
                >
                  {/* Header */}
                  <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Divider + Logout */}
                  <div className="border-t border-gray-100 py-2">
                    <button
                      disabled={isLoggingOut}
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="h-4 w-4 flex-shrink-0" />
                      <span>{isLoggingOut ? "Logging out…" : "Log out"}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
