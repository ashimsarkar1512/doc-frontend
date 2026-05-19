"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, User, Menu, X } from "lucide-react";
import Logo from "../ui/Logo";

interface NavbarProps {
  variant?: "light" | "dark";
}

const Navbar = ({ variant = "light" }: NavbarProps) => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Weight Loss");

  const isDark = variant === "dark";

  // 🎯 Theme system
  const textColor = isDark
    ? "text-black hover:text-gray-700"
    : "text-white hover:text-gray-300";

  const buttonStyle = isDark
    ? "border-black text-black hover:bg-black hover:text-white"
    : "border-white text-white hover:bg-white hover:text-black";

  const borderColor = isDark
    ? "border-black/20"
    : "border-white/20";

  const mobileBg = isDark ? "bg-white/90" : "bg-black/70";

  const tabs = [
    "Weight Loss",
    "Hormone Therapy",
    "Regrow Hair",
    "Men's Services",
    "Skin Services",
  ];

  const servicesData = {
    "Weight Loss": {
      left: [
        "GLP-1 Medications",
        "Phentermine",
        "Phendimetrazine (Bontril)",
        "Diethylpropion",
        "B12 Injections",
        "Lipotropic Injections",
      ],
      right: [
        "Vitamin C Ascorbic Acid",
        "Glutathione Intramuscular Injections",
        "B-Complex Intramuscular Injections",
        "Vitamin D Intramuscular Injections",
        "Hydroxocobalamin",
      ],
    },
    "Hormone Therapy": {
      left: ["Testosterone Therapy", "Estrogen Therapy"],
      right: ["Thyroid Management"],
    },
    "Regrow Hair": {
      left: ["PRP Therapy", "Minoxidil"],
      right: ["Finasteride"],
    },
    "Men's Services": {
      left: ["ED Treatment", "Testosterone Check"],
      right: ["Prostate Health"],
    },
    "Skin Services": {
      left: ["Botox", "Dermal Fillers"],
      right: ["Chemical Peels"],
    },
  };

  const toggleServices = () => setIsServicesOpen((p) => !p);
  const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);

  return (
    <nav className="absolute top-0 w-full z-50 pt-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer relative z-[60]">
          <Link href="/">
            <Logo variant={variant} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden relative z-[60]">
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <X className={`h-7 w-7 ${textColor}`} />
            ) : (
              <Menu className={`h-7 w-7 ${textColor}`} />
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
          <div className="relative w-full md:w-auto">
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
              <div className="md:absolute top-full md:left-1/2 md:-translate-x-1/2 mt-4 w-full md:w-[800px] bg-white rounded-2xl shadow-2xl p-6 text-black z-50">
                <h3 className="text-xl font-semibold mb-4">
                  Medical Weight Management Program
                </h3>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(tab);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <ul className="space-y-3 flex-1">
                    {servicesData[activeTab as keyof typeof servicesData].left.map(
                      (item, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                  <ul className="space-y-3 flex-1">
                    {servicesData[activeTab as keyof typeof servicesData].right.map(
                      (item, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <Link href="/blog" className={`${textColor} transition-colors text-xl md:text-base`}>
            Blog
          </Link>

          <Link href="/about" className={`${textColor} transition-colors text-xl md:text-base`}>
            About
          </Link>

          <Link href="/contact" className={`${textColor} transition-colors text-xl md:text-base`}>
            Contact
          </Link>

          {/* Mobile actions */}
          <div className={`md:hidden flex flex-col gap-4 w-full pt-8 border-t ${borderColor}`}>
            <Link href="/login" className={`${textColor} flex items-center gap-2`}>
              <User className="h-5 w-5" />
              Login
            </Link>

            <button className={`px-5 py-3 rounded-full border ${buttonStyle}`}>
              Start Consultation
            </button>
          </div>
        </div>

        {/* Desktop actions */}
        <div className={`hidden md:flex items-center gap-4 pl-4 border-l ${borderColor}`}>
          <Link href="/login" className={`${textColor} flex items-center gap-2`}>
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