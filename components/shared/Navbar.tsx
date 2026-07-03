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
import NotificationDropdown from "@/components/Dashboard/Patient/NotificationDropdown";
import { useAppSelector } from "@/Redux/store/hooks";
import { useLogout } from "@/Redux/hooks/useLogout";
import { useGetCurrentUserQuery } from "@/Redux/api/authApi";
import { useRouter, usePathname } from "next/navigation";
import { useGetWebsiteSettingsQuery } from "@/Redux/features/footerData/footerDataApi";

interface NavbarProps {
  variant?: "light" | "dark";
  initialPadding?: string;
  scrolledPadding?: string;
  className?: string;
  /** Hero overlay: softer header bar + readable controls on top of imagery */
  overlay?: boolean;
  /** Position inside a relative hero container instead of viewport-fixed */
  embedded?: boolean;
  /** Always show the solid background regardless of scroll position */
  alwaysSolidBg?: boolean;
}

const Navbar = ({
  variant = "light",
  initialPadding = "py-12",
  scrolledPadding = "py-4",
  className = "",
  overlay = false,
  embedded = false,
  alwaysSolidBg = false,
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

  // Determine effective theme based on scroll state
  const isDark = variant === "dark" || isScrolled || alwaysSolidBg;
  const effectiveVariant = isDark ? "dark" : "light";

  const textColor = isDark
    ? "text-black hover:text-gray-700"
    : "text-white hover:text-gray-300";

  const buttonStyle = isDark
    ? "border-black text-black hover:bg-black hover:text-white"
    : "border-white text-white hover:bg-white hover:text-black";

  const borderColor = isDark ? "border-black/20" : "border-white/20";
  const mobileBg = isDark ? "bg-white/95" : "bg-[#111111]/95";

  const isDashboard = pathname?.startsWith("/patient") || pathname?.startsWith("/doctor") || pathname?.startsWith("/admin");

  const toggleServices = () => setIsServicesOpen((p) => !p);
  const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== '/' && pathname?.startsWith(path));
    // if (isActive) {
    //   return isDark ? "text-[#1D4ED8] font-semibold" : "text-[#1D4ED8] font-semibold";
    // }
    return `${textColor} font-medium transition-colors`;
  };

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
        isScrolled || alwaysSolidBg
          ? `bg-white/95 backdrop-blur-2xl backdrop-saturate-150 transform-gpu shadow-sm ${alwaysSolidBg && !isScrolled ? initialPadding : scrolledPadding} border-b border-black/5`
          : overlay && !isDark
            ? `bg-gradient-to-b from-black via-black/15 to-transparent ${initialPadding}`
            : overlay && isDark
              ? `bg-gradient-to-b from-white/80 via-white/40 to-transparent ${initialPadding}`
              : `bg-transparent ${initialPadding}`
      } ${className}`}
    >
      <div className="max-w-[1604px] mx-auto flex items-center justify-between min-h-[44px] sm:min-h-[48px]">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 min-w-0 relative z-[60]">
          <Link href="/" className="block py-1">
            <Logo variant={effectiveVariant} />
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="xl:hidden relative z-[60] flex items-center gap-2 ml-3 flex-shrink-0">
          {isAuthenticated && user && (
            <div className="flex items-center">
              <NotificationDropdown 
                iconColor={textColor} 
                hoverBgClass={mobileMenuBtnClass}
              />
            </div>
          )}
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
          style={{ WebkitBackdropFilter: "blur(24px) saturate(1.5)" }}
          className={`
            fixed xl:static top-0 left-0 w-full xl:w-auto h-screen xl:h-auto
            ${mobileBg}  xl:bg-transparent
            px-8 pt-40 xl:pt-0 xl:px-0
            flex-col xl:flex-row items-start xl:items-center gap-4 xl:gap-8
            transition-transform duration-300 ease-in-out z-[50]
            overflow-y-auto xl:overflow-visible
            ${isMobileMenuOpen ? "flex translate-x-0" : "hidden xl:flex translate-x-full xl:translate-x-0"}
          `}
        >
          <Link
            href="/"
            className={`text-xl xl:text-base ${getLinkClass("/")}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>

          {/* Services */}
          <div
            ref={servicesRef}
            className="relative w-full xl:w-auto"
            onMouseEnter={handleServicesMouseEnter}
            onMouseLeave={handleServicesMouseLeave}
          >
            <div
              className={`${textColor} flex items-center gap-1 cursor-pointer transition-colors font-medium`}
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
                <div className="hidden xl:block absolute top-full left-1/2 -translate-x-1/2 mt-5 z-50">
                  <ServicesMegaMenu variant="desktop" />
                </div>
                {/* mobile */}
                <div className="xl:hidden mt-4">
                  <ServicesMegaMenu variant="mobile" />
                </div>
              </>
            )}
          </div>

          <Link
            href="/lab-testing"
            prefetch={true}
            className={`text-xl xl:text-base ${getLinkClass("/lab-testing")}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Lab Testing
          </Link>

          <Link
            href="/supplements"
            prefetch={true}
            className={`text-xl xl:text-base ${getLinkClass("/supplements")}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Supplements
          </Link>

          <Link
            href="/blog"
            prefetch={true}
            className={`text-xl xl:text-base ${getLinkClass("/blog")}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>

          <Link
            href="/eligibility"
            className={`text-xl xl:text-base ${getLinkClass("/eligibility")}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Eligibility
          </Link>

          <Link
            href="/about"
            className={`text-xl xl:text-base ${getLinkClass("/about")}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`text-xl xl:text-base ${getLinkClass("/contact")}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>

          {/* Mobile actions */}
          <div
            className={`xl:hidden flex flex-col gap-4 w-full pt-8 border-t ${borderColor}`}
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
                {!isDashboard && (
                  <button
                    onClick={handleStartConsultation}
                    className={`px-5 py-3 rounded-full border ${buttonStyle}`}
                  >
                    Start Consultation
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Desktop actions */}
        <div
          className={`hidden xl:flex items-center gap-2 xl:gap-4 pl-4 border-l ${borderColor}`}
        >
          {isAuthenticated && user ? (
            <>
              {/* Notification Bell */}
              <div className="flex items-center">
                <NotificationDropdown 
                  iconColor={textColor} 
                  hoverBgClass={isDark ? "hover:bg-black/5" : "hover:bg-white/10"}
                />
              </div>

              {/* ── Profile Widget ── */}
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
                        onClick={() => setIsProfileOpen(false)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        <LayoutDashboard className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>My Portal</span>
                      </Link>
                      <Link
                        href={`${getDashboardHref()}?domain=settings`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>My Profile</span>
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
            </>
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

          {/* Start Consultation — conditionally visible */}
          {!isDashboard && (
            <button
              onClick={handleStartConsultation}
              className={`px-5 py-2 rounded-full border ${buttonStyle} transition-colors`}
            >
              Start Consultation
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
