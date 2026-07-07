import React from "react";
import { Home, MessageSquare, Bell, Settings, Plus } from "lucide-react";
import Link from "next/link";


interface ActionBarProps {
  activeDomain: "dashboard" | "messages" | "notifications" | "settings";
  onChangeDomain: (
    domain: "dashboard" | "messages" | "notifications" | "settings",
  ) => void;
  onRequestNewConsultation?: () => void;
}

export default function ActionBar({
  activeDomain,
  onChangeDomain,
}: ActionBarProps) {

  const getButtonClass = (
    domain: "dashboard" | "messages" | "notifications" | "settings",
  ) => {
    const base =
      "w-11 h-11 rounded-[14px] flex items-center justify-center active:scale-95 transition-all duration-150";
    if (activeDomain === domain) {
      return `${base} bg-[#2563eb] text-white shadow-md shadow-blue-500/10 hover:bg-[#1d4ed8]`;
    }
    return `${base} bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe]`;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4">
      {/* Left side: Rounded Square Action Controls */}
      <div className="flex flex-wrap items-center gap-[16px] justify-center sm:justify-start">
        {/* Active Home Control */}
        <button
          onClick={() => onChangeDomain("dashboard")}
          aria-label="Home"
          className={getButtonClass("dashboard")}
        >
          <Home className="h-[24px] w-[24px]" />
        </button>

        {/* Messages Control */}
        <button
          onClick={() => onChangeDomain("messages")}
          aria-label="Messages"
          className={getButtonClass("messages")}
        >
          <MessageSquare className="h-[24px] w-[24px]" />
        </button>

        {/* Settings Control */}
        <button
          onClick={() => onChangeDomain("settings")}
          aria-label="Settings"
          className={getButtonClass("settings")}
        >
          <Settings className="h-[24px] w-[24px]" />
        </button>
      </div>

      {/* Right side: Request New Consultation Action */}
      <Link
        href="/#assessments"
        className="flex items-center justify-center gap-[10px] px-[20px] h-[50px] w-full sm:w-auto bg-[#1D4ED8] hover:bg-[#1e40af] active:bg-[#172554] text-white font-[Quicksand] font-semibold text-[20px] leading-[100%] rounded-[12px] transition-all duration-150 active:scale-[0.98]"
      >
        <span>Book an Appointment</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-[24px] h-[24px]">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
