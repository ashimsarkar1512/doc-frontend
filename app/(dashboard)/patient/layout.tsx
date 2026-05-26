'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, User, LogOut, Settings, Menu, X } from 'lucide-react';
import Footer from '@/components/shared/Footer';
import Logo from '@/components/ui/Logo';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Our Services', href: '#services' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* --- Top Navbar --- */}
      <header className="w-full bg-white border-b border-gray-150 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1 cursor-pointer">
            <Logo/>
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

          {/* Desktop Patient Profile Details */}
          <div className="hidden md:flex items-center gap-3 relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all select-none"
            >
              <span className="text-sm font-semibold text-gray-900">Alan Catrech</span>
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-emerald-100 border border-emerald-200">
                {/* Fallback initials if image path is complex, or beautiful styled icon */}
                <div className="w-full h-full flex items-center justify-center bg-[#2e5e54] text-white font-bold text-sm">
                  AC
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">alan@ektahealth.com</p>
                </div>
                {/* <Link
                  href="/patient"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>My Portal</span>
                </Link>
                <Link
                  href="/patient/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Profile Settings</span>
                </Link> */}
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-50 mt-1"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    // logout logic
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburguer Toggle */}
          <button onClick={toggleMobileMenu} className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full bg-white border-b border-gray-150 px-6 py-4 space-y-3 animate-in slide-in-from-top duration-200">
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
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#2e5e54] text-white flex items-center justify-center font-bold text-sm">
                  AC
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Alan Catrech</p>
                  <p className="text-xs text-gray-400">alan@ektahealth.com</p>
                </div>
              </div>
              <Link
                href="/patient/profile"
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                onClick={toggleMobileMenu}
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* --- Dynamic Content Area --- */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* --- Footer Component --- */}
      <Footer />
    </div>
  );
}
