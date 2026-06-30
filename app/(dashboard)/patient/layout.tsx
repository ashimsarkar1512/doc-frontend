"use client";

import Footer from "@/components/shared/Footer";
import Logo from "@/components/ui/Logo";
import { useLogout } from "@/Redux/hooks/useLogout";
import { useAppSelector } from "@/Redux/store/hooks";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  X,
  Home,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const { logout, isLoading: isLoggingOut } = useLogout();
  const user = useAppSelector((state) => state.auth.user);

  const getDisplayName = () => {
    if (user?.profile?.name) return user.profile.name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
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

  // Close dropdown on outside click
  useEffect(() => {
    if (!isProfileDropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileDropdownOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Our Services", href: "#services" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* --- Top Navbar --- */}
      <header className="w-full bg-white border-b border-gray-150 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1 cursor-pointer">
            <Logo />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[15px] font-medium text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Patient Profile */}
          <div ref={profileRef} className="hidden md:flex items-center gap-3 relative">
            <button
              onClick={() => setIsProfileDropdownOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all select-none focus:outline-none"
              aria-label="Open profile menu"
              aria-expanded={isProfileDropdownOpen}
            >
              {/* Avatar */}
              <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-200 flex-shrink-0">
                {user?.profile?.avatar ? (
                  <Image
                    src={user.profile.avatar}
                    alt={getDisplayName()}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm">
                    {getInitials()}
                  </div>
                )}
              </div>

              <span className="text-sm font-semibold text-gray-900 max-w-[120px] truncate">
                {getDisplayName()}
              </span>

              <motion.div
                animate={{ rotate: isProfileDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </motion.div>
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 top-[calc(100%+12px)] w-60 bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-100 overflow-hidden"
                  style={{ transformOrigin: "top right" }}
                >
                  {/* User info header */}
                  <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-start gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                      {user?.profile?.avatar ? (
                        <Image
                          src={user.profile.avatar}
                          alt={getDisplayName()}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm">
                          {getInitials()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {getDisplayName()}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Home link */}
                  <div className="py-2">
                    <Link
                      href="/"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Home className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span>Home</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 py-2">
                    <button
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="h-4 w-4 flex-shrink-0" />
                      <span>{isLoggingOut ? "Logging out…" : "Log Out"}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden w-full bg-white border-b border-gray-150 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-3">
                <nav className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-base font-medium text-gray-600 hover:text-emerald-600 block py-1.5"
                      onClick={toggleMobileMenu}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  {/* User info */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-emerald-200">
                      {user?.profile?.avatar ? (
                        <Image
                          src={user.profile.avatar}
                          alt={getDisplayName()}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm">
                          {getInitials()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <Link
                    href="/"
                    className="flex w-full items-center gap-2 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors text-left"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>

                  <button
                    disabled={isLoggingOut}
                    onClick={() => {
                      toggleMobileMenu();
                      logout();
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Logging out…" : "Log Out"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- Dynamic Content Area --- */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* --- Footer Component --- */}
      <Footer />
    </div>
  );
}
