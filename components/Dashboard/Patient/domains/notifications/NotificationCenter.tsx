"use client";

import React, { useMemo } from "react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  FileText,
  HelpCircle,
  Clock,
  Package,
} from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "@/Redux/features/notifications/notificationApi";
import { AppNotification } from "@/types/notificationTypes";
import { toast } from "sonner";

interface NotificationCenterProps {
  onNotificationClick?: (notification: AppNotification) => void;
}

export default function NotificationCenter({ onNotificationClick }: NotificationCenterProps = {}) {
  const { data: notificationsData, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();

  const notifications = notificationsData?.data?.notifications || [];

  const handleMarkAsRead = async (item: AppNotification) => {
    if (!item.isRead) {
      try {
        await markAsRead(item.id).unwrap();
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
    if (onNotificationClick) {
      onNotificationClick(item);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read", err);
      toast.error("Failed to mark all as read");
    }
  };

  const renderIcon = (item: AppNotification) => {
    let iconBg = "bg-gray-50";
    let iconColor = "text-gray-600";
    let Icon = Bell;

    switch (item.actionType) {
      case "PAYMENT_SUCCESS":
        iconBg = "bg-emerald-50";
        iconColor = "text-emerald-600";
        Icon = CheckCircle;
        break;
      case "ASSESSMENT_SUBMITTED":
      case "ASSESSMENT_ASSIGNED":
        iconBg = "bg-blue-50";
        iconColor = "text-blue-600";
        Icon = FileText;
        break;
      case "ASSESSMENT_STATUS_UPDATED":
        iconBg = "bg-amber-50";
        iconColor = "text-amber-600";
        Icon = Clock;
        break;
      case "PROPOSAL_ACCEPTED":
        iconBg = "bg-emerald-50";
        iconColor = "text-emerald-600";
        Icon = CheckCircle;
        break;
      case "PROPOSAL_REJECTED":
        iconBg = "bg-rose-50";
        iconColor = "text-rose-600";
        Icon = AlertCircle;
        break;
      case "ORDER_STATUS_UPDATED":
        iconBg = "bg-purple-50";
        iconColor = "text-purple-600";
        Icon = Package;
        break;
      case "SUBSCRIPTION_CANCELLED":
        iconBg = "bg-rose-50";
        iconColor = "text-rose-600";
        Icon = AlertCircle;
        break;
      default:
        iconBg = "bg-gray-50";
        iconColor = "text-gray-500";
        Icon = Bell;
        break;
    }

    return (
      <div
        className={`p-2.5 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0 relative`}
      >
        <Icon className={`h-5 w-5 ${iconColor}`} />
        {!item.isRead && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </div>
    );
  };

  // Grouping logic
  const { todayNotifications, weekNotifications, olderNotifications } = useMemo(() => {
    const today: AppNotification[] = [];
    const week: AppNotification[] = [];
    const older: AppNotification[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;

    notifications.forEach((item) => {
      const time = new Date(item.createdAt).getTime();
      if (time >= todayStart) {
        today.push(item);
      } else if (time >= weekStart) {
        week.push(item);
      } else {
        older.push(item);
      }
    });

    return { todayNotifications: today, weekNotifications: week, olderNotifications: older };
  }, [notifications]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const renderSection = (title: string, list: AppNotification[]) => {
    if (list.length === 0) return null;

    return (
      <div className="flex flex-col gap-3">
        <span className="text-[12px] font-semibold text-gray-400 pl-1 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex flex-col gap-3">
          {list.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMarkAsRead(item)}
              className={`flex items-start justify-between p-4 border rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-200 cursor-pointer ${
                !item.isRead
                  ? "bg-blue-50/30 border-blue-100 hover:shadow-md hover:border-blue-200"
                  : "bg-white border-gray-150 hover:shadow-md hover:border-blue-100"
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                {renderIcon(item)}
                <div className="min-w-0 mt-0.5">
                  <h4
                    className={`text-sm font-bold leading-snug ${
                      !item.isRead ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {item.title}
                  </h4>
                  {item.message && (
                    <p className="text-xs text-gray-500 font-light mt-1 leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-[11px] text-gray-400 leading-none whitespace-nowrap pl-4 mt-1 font-light">
                {formatTime(item.createdAt)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 leading-none">Notifications</h3>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="text-sm text-[#2563eb] font-semibold hover:underline disabled:opacity-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-150 shadow-[0_2px_8px_rgba(0,0,0,0.01)] mb-12">
          <Bell className="h-10 w-10 text-gray-300 mb-3" />
          <h4 className="font-semibold text-gray-800 text-base">No Notifications</h4>
          <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mb-12">
          {renderSection("Today", todayNotifications)}
          {renderSection("This Week", weekNotifications)}
          {renderSection("Older", olderNotifications)}
        </div>
      )}
    </div>
  );
}
