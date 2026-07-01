import React from "react";
import { Home, MessageSquare, Bell, Settings, Plus } from "lucide-react";
import Link from "next/link";
import { useGetNotificationsQuery } from "@/Redux/features/notifications/notificationApi";

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
  const { data: notificationsData } = useGetNotificationsQuery();
  const unreadCount = notificationsData?.data?.unreadCount || 0;

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

        {/* Messages Control */}
        <button
          onClick={() => onChangeDomain("messages")}
          aria-label="Messages"
          className={getButtonClass("messages")}
        >
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* Notifications Control */}
        <button
          onClick={() => onChangeDomain("notifications")}
          aria-label="Notifications"
          className={`${getButtonClass("notifications")} relative`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
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
        href="https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_100434"
        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold rounded-2xl shadow-sm text-[14px] transition-all duration-150 active:scale-[0.98] tracking-wide"
      >
        <span>Request New Consultation</span>
        <Plus className="h-4.5 w-4.5 bg-white/20 rounded-full p-0.5" />
      </Link>
    </div>
  );
}
