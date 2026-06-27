"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Grid,
  FileText,
  ShoppingBag,
  UserCheck,
  Users,
  Globe,
  Settings,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: { name: string; href: string }[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Grid,
  },
  {
    name: "Assessments",
    href: "/admin/assessments",
    icon: FileText,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    name: "Providers/Doctors",
    href: "/admin/providers",
    icon: UserCheck, // doctor/provider representation
  },
  {
    name: "Patients",
    href: "/admin/patients",
    icon: Users,
  },
  {
    name: "Website Management",
    href: "#",
    icon: Globe,
    subItems: [
      { name: "Pages", href: "/admin/website/pages" },
      { name: "Site Settings", href: "/admin/website/settings" },
    ],
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [websiteExpanded, setWebsiteExpanded] = useState(true); // default open matching figma screenshot

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      {/* --- Sidebar Component --- */}
      {/* Desktop Sidebar */}


      {/* Mobile Sidebar Slide-out Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative flex flex-col w-72 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-250">
            {/* Close Button */}
            <div className="absolute top-5 right-5 z-50">
              <button
                onClick={toggleMobile}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Sidebar Logo */}
            <div className="h-20 flex items-center px-6 border-b border-gray-100">
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tighter leading-none text-gray-900">
                  WEIGHTLOSSMD
                </span>
                <span className="text-xs font-light italic text-right leading-none pr-1 text-gray-500">
                  & Wellness
                </span>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              {sidebarItems.map((item) => {
                const isSubMenu = !!item.subItems;
                const isItemActive =
                  pathname === item.href ||
                  (isSubMenu && pathname.startsWith("/admin/website"));

                if (isSubMenu) {
                  return (
                    <div key={item.name} className="space-y-1">
                      <button
                        onClick={() => setWebsiteExpanded(!websiteExpanded)}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                          ${isItemActive
                            ? "bg-blue-50/50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                            className={`h-5 w-5 ${isItemActive ? "text-blue-600" : "text-gray-400"}`}
                          />
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 text-gray-400 ${websiteExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                      {websiteExpanded && (
                        <div className="pl-12 pr-4 py-1 space-y-1">
                          {item.subItems?.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={toggleMobile}
                                className={`
                                  block py-2 px-3 rounded-lg text-xs font-medium transition-all duration-150
                                  ${isSubActive
                                    ? "text-blue-600 bg-blue-50/30"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                  }
                                `}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={toggleMobile}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${isItemActive
                        ? "bg-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <item.icon
                      className={`h-5 w-5 ${isItemActive ? "text-blue-600" : "text-gray-400"}`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* --- Main Window Wrapper --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">


        {/* --- Dynamic Content Area --- */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">{children}</main>
      </div>
    </div>
  );
}
