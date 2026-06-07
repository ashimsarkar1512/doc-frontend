"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, User, Menu, X } from "lucide-react";
import Logo from "../ui/Logo";
import ServicesMegaMenu, {
  SERVICE_CATEGORIES,
} from "./ServicesMegaMenu";

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
  const [activeCategoryId, setActiveCategoryId] = useState<
    (typeof SERVICE_CATEGORIES)[number]["id"]
  >("weight-loss");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDetached, setIsDetached] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (embedded) setIsDetached(window.scrollY > 72);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [embedded]);

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

  const isDark = variant === "dark";

  // 🎯 Theme system
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

  const mobileMenuBtnClass = isDark
    ? "bg-black/5 border-black/15 hover:bg-black/10 active:bg-black/15"
    : "bg-white/15 border-white/30 hover:bg-white/25 active:bg-white/35 backdrop-blur-md";

  const navPosition = embedded && !isDetached ? "absolute" : "fixed";

  return (
    <nav 
      className={`${navPosition} top-0 left-0 w-full z-50 px-5 sm:px-6 md:px-8 transition-all duration-300 ${
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
          <div ref={servicesRef} className="relative w-full md:w-auto">
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
                <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-5 z-50">
                  <ServicesMegaMenu
                    activeCategoryId={activeCategoryId}
                    onCategoryChange={setActiveCategoryId}
                    variant="desktop"
                  />
                </div>

                <div className="md:hidden mt-4">
                  <ServicesMegaMenu
                    activeCategoryId={activeCategoryId}
                    onCategoryChange={setActiveCategoryId}
                    variant="mobile"
                  />
                </div>
              </>
            )}
          </div>

          <Link
            href="/lab-testing"
            className={`${textColor} transition-colors text-xl md:text-base font-medium`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Lab Testing
          </Link>

          <Link
            href="/blog"
            className={`${textColor} transition-colors text-xl md:text-base`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
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
            <Link
              href="/login"
              className={`${textColor} flex items-center gap-2`}
            >
              <User className="h-5 w-5" />
              Login
            </Link>

            <button className={`px-5 py-3 rounded-full border ${buttonStyle}`}>
              Start Consultation
            </button>
          </div>
        </div>

        {/* Desktop actions */}
        <div
          className={`hidden md:flex items-center gap-4 pl-4 border-l ${borderColor}`}
        >
          <Link
            href="/login"
            className={`${textColor} flex items-center gap-2`}
          >
            <User className="h-4 w-4" />
            <span>Login</span>
          </Link>

          <button className={`px-5 py-2 rounded-full border ${buttonStyle}`}>
            Start Consultation
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
