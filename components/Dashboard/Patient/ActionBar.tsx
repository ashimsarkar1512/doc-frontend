import React from "react";
import { Home, FolderOpen, Bell, Settings, Plus } from "lucide-react";
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
      <div className="flex items-center gap-3">
        {/* Active Home Control */}
        <button
          onClick={() => onChangeDomain("dashboard")}
          aria-label="Home"
          className={getButtonClass("dashboard")}
        >
          <Home className="h-5 w-5" />
        </button>

        {/* Documents/Files Control (Messages) */}
        <button
          onClick={() => onChangeDomain("messages")}
          aria-label="Folders"
          className={getButtonClass("messages")}
        >
          <FolderOpen className="h-5 w-5" />
        </button>

        {/* Notifications Control */}
        <button
          onClick={() => onChangeDomain("notifications")}
          aria-label="Notifications"
          className={getButtonClass("notifications")}
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* Settings Control */}
        <button
          onClick={() => onChangeDomain("settings")}
          aria-label="Settings"
          className={getButtonClass("settings")}
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Right side: Request New Consultation Action */}
      <Link
        href="/"
        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold rounded-2xl shadow-sm text-[14px] transition-all duration-150 active:scale-[0.98] tracking-wide"
      >
        <span>Request New Consultation</span>
        <Plus className="h-4.5 w-4.5 bg-white/20 rounded-full p-0.5" />
      </Link>
    </div>
  );
}
