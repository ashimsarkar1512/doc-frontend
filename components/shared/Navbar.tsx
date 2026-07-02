"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  User,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Mail,
  Home,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../ui/Logo";
import ServicesMegaMenu from "./ServicesMegaMenu";
import { useAppSelector } from "@/Redux/store/hooks";
import { useLogout } from "@/Redux/hooks/useLogout";
import { useGetCurrentUserQuery } from "@/Redux/api/authApi";
import { useRouter, usePathname } from "next/navigation";

interface NavbarProps {
  variant?: "light" | "dark";
  initialPadding?: string;
  scrolledPadding?: string;
  className?: string;
  /** Hero overlay: softer header bar + readable controls on top of imagery */
  overlay?: boolean;
  /** Position inside a relative hero container instead of viewport-fixed */
  embedded?: boolean;
}

const Navbar = ({
  variant = "light",
  initialPadding = "py-12",
  scrolledPadding = "py-4",
  className = "",
  overlay = false,
  embedded = false,
}: NavbarProps) => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDetached, setIsDetached] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { logout, isLoading: isLoggingOut } = useLogout();
  const router = useRouter();
  const pathname = usePathname();

  const { data: currentUser } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  // const handleStartConsultation = () => {
  //   setIsMobileMenuOpen(false);
  //   if (pathname === "/") {
  //     const el = document.getElementById("assessments");
  //     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  //   } else {
  //     router.push("/#assessments");
  //   }
  // };
  const handleStartConsultation = () => {
    setIsMobileMenuOpen(false);

    window.open(
      "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434",
      "_blank",
    );
  };

  const getDisplayName = () => {
    if (user?.profile?.name) return user.profile.name;
    if (user?.email) return user.email.split("@")[0];
    return "Account";
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

  const getDashboardHref = () => {
    const activeRole = currentUser?.data?.role || user?.role;
    if (!activeRole) return "/";

    const role = activeRole.toUpperCase();

    if (role === "DOCTOR" || role === "PROVIDER") return "/doctor";
    return "/patient";
  };

  useEffect(() => {
    const handleScroll = () => {
      // Use the actual banner height as the scroll threshold so the navbar
      // switches exactly when the banner leaves the viewport — no delay.
      const bannerH = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--banner-height",
        ) || "0",
      );
      const threshold = bannerH > 0 ? bannerH : 20;
      setIsScrolled(window.scrollY > threshold);
      if (embedded) setIsDetached(window.scrollY > 72);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [embedded]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // Close Services on outside click
  useEffect(() => {
    if (!isServicesOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isServicesOpen]);

  // Close Profile dropdown on outside click
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const isDark = variant === "dark";

  const textColor = isDark
    ? "text-black hover:text-gray-700"
    : "text-white hover:text-gray-300";

  const buttonStyle = isDark
    ? "border-black text-black hover:bg-black hover:text-white"
    : "border-white text-white hover:bg-white hover:text-black";

  const borderColor = isDark ? "border-black/20" : "border-white/20";
  const mobileBg = isDark ? "bg-white/90" : "bg-black/70";

  const toggleServices = () => setIsServicesOpen((p) => !p);
  const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);

  const handleServicesMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 200);
  };

  const mobileMenuBtnClass = isDark
    ? "bg-black/5 border-black/15 hover:bg-black/10 active:bg-black/15"
    : "bg-white/15 border-white/30 hover:bg-white/25 active:bg-white/35 backdrop-blur-md";

  const navPosition = embedded && !isDetached ? "absolute" : "fixed";

  return (
    <nav
      style={{ top: isScrolled ? "0px" : "var(--banner-height, 0px)" }}
      className={`${navPosition} left-0 w-full z-50 px-5 sm:px-6 md:px-8 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? `bg-white/90 backdrop-blur-md shadow-sm ${scrolledPadding} border-b border-black/10`
            : `bg-black/40 backdrop-blur-md shadow-md ${scrolledPadding} border-b border-white/10`
          : overlay && !isDark
            ? `bg-gradient-to-b from-black/45 via-black/15 to-transparent ${initialPadding}`
            : overlay && isDark
              ? `bg-gradient-to-b from-white/80 via-white/40 to-transparent ${initialPadding}`
              : `bg-transparent ${initialPadding}`
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between min-h-[44px] sm:min-h-[48px]">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 min-w-0 relative z-[60]">
          <Link href="/" className="block py-1">
            <Logo variant={variant} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden relative z-[60] flex-shrink-0 ml-3">
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className={`flex items-center justify-center w-11 h-11 rounded-full border transition-colors ${mobileMenuBtnClass}`}
          >
            {isMobileMenuOpen ? (
              <X className={`h-5 w-5 ${textColor}`} strokeWidth={2.25} />
            ) : (
              <Menu className={`h-5 w-5 ${textColor}`} strokeWidth={2.25} />
            )}
          </button>
        </div>

        {/* NAV LINKS */}
        <div
          className={`
            fixed md:static top-0 left-0 w-full md:w-auto h-screen md:h-auto
            ${mobileBg} backdrop-blur-2xl md:backdrop-blur-none md:bg-transparent
            px-8 pt-28 md:pt-0 md:px-0
            flex-col md:flex-row items-start md:items-center gap-8
            transition-transform duration-300 ease-in-out z-[50]
            overflow-y-auto md:overflow-visible
            ${isMobileMenuOpen ? "flex translate-x-0" : "hidden md:flex translate-x-full md:translate-x-0"}
          `}
        >
          <Link
            href="/"
            className={`${textColor} transition-colors text-xl md:text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>

          {/* Services */}
          <div
            ref={servicesRef}
            className="relative w-full md:w-auto"
            onMouseEnter={handleServicesMouseEnter}
            onMouseLeave={handleServicesMouseLeave}
          >
            <div
              className={`${textColor} flex items-center gap-1 cursor-pointer transition-colors`}
              onClick={toggleServices}
            >
              <span>Our Services</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  isServicesOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isServicesOpen && (
              <>
                {/* desktop */}
                <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-5 z-50">
                  <ServicesMegaMenu variant="desktop" />
                </div>
                {/* mobile */}
                <div className="md:hidden mt-4">
                  <ServicesMegaMenu variant="mobile" />
                </div>
              </>
            )}
          </div>

          <Link
            href="/lab-testing"
            prefetch={true}
            className={`${textColor} transition-colors text-xl md:text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Lab Testing
          </Link>

          <Link
            href="/blog"
            prefetch={true}
            className={`${textColor} transition-colors text-xl md:text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>

          <Link
            href="/eligibility"
            className={`${textColor} transition-colors text-xl md:text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Eligibility
          </Link>

          <Link
            href="/about"
            className={`${textColor} transition-colors text-xl md:text-base`}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`${textColor} transition-colors text-xl md:text-base`}
          >
            Contact
          </Link>

          {/* Mobile actions */}
          <div
            className={`md:hidden flex flex-col gap-4 w-full pt-8 border-t ${borderColor}`}
          >
            {isAuthenticated && user ? (
              <>
                {/* Mobile user info */}
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/30">
                    {user.profile?.avatar ? (
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
                    <p
                      className={`text-base font-semibold truncate ${isDark ? "text-gray-900" : "text-white"}`}
                    >
                      {getDisplayName()}
                    </p>
                    <p
                      className={`text-xs truncate ${isDark ? "text-gray-500" : "text-white/70"}`}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href={getDashboardHref()}
                  className={`flex items-center gap-2 text-base font-medium ${textColor} w-full text-left`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleStartConsultation}
                  className={`px-5 py-3 rounded-full border ${buttonStyle} text-left`}
                >
                  Start Consultation
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 text-base font-medium text-red-400 disabled:opacity-50"
                >
                  <LogOut className="h-5 w-5" />
                  {isLoggingOut ? "Logging out…" : "Log Out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`${textColor} flex items-center gap-2`}
                >
                  <User className="h-5 w-5" />
                  Login
                </Link>
                <button
                  onClick={handleStartConsultation}
                  className={`px-5 py-3 rounded-full border ${buttonStyle}`}
                >
                  Start Consultation
                </button>
              </>
            )}
          </div>
        </div>

        {/* Desktop actions */}
        <div
          className={`hidden md:flex items-center gap-4 pl-4 border-l ${borderColor}`}
        >
          {isAuthenticated && user ? (
            /* ── Profile Widget ── */
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((p) => !p)}
                aria-label="Open profile menu"
                aria-expanded={isProfileOpen}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/10 focus:outline-none"
              >
                {/* Avatar or Icon */}
                <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/40 shadow-sm">
                  {user.profile?.avatar ? (
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

                {/* Name */}
                <span
                  className={`text-sm font-semibold max-w-[120px] truncate ${isDark ? "text-gray-900" : "text-white"}`}
                >
                  {getDisplayName()}
                </span>

                <motion.div
                  animate={{ rotate: isProfileOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronDown
                    className={`h-4 w-4 ${isDark ? "text-gray-500" : "text-white/70"}`}
                  />
                </motion.div>
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-[calc(100%+12px)] w-60 rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-300/40 overflow-hidden"
                    style={{ transformOrigin: "top right" }}
                  >
                    {/* Header — email */}
                    <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-start gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                        {user.profile?.avatar ? (
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
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard */}
                    <div className="py-2">
                      <Link
                        href={getDashboardHref()}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        <LayoutDashboard className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>Dashboard</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-2">
                      <button
                        disabled={isLoggingOut}
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LogOut className="h-4 w-4 flex-shrink-0" />
                        <span>{isLoggingOut ? "Logging out…" : "Log Out"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ── Guest: Login ── */
            <Link
              href="/login"
              className={`${textColor} flex items-center gap-2`}
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}

          {/* Start Consultation — always visible */}
          <button
            onClick={handleStartConsultation}
            className={`px-5 py-2 rounded-full border ${buttonStyle} transition-colors`}
          >
            Start Consultation
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
