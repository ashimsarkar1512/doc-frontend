"use client";

import { Bell, Calendar, CheckCircle, XCircle, Clock, FileText, Package, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "@/Redux/features/notifications/notificationApi";
import { AppNotification } from "@/types/notificationTypes";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notificationsData } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notificationsData?.data?.unreadCount || 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const router = useRouter();

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleNotificationClick = async (notification: AppNotification) => {
    await handleMarkAsRead(notification.id, notification.isRead);
    setIsOpen(false);
    if (notification.actionType === "NEW_MESSAGE") {
      router.push(`/patient?domain=messages`);
    } else if (notification.actionType.startsWith("ASSESSMENT_")) {
      router.push(`/patient?domain=dashboard`);
    } else if (notification.actionType === "ORDER_STATUS_UPDATED") {
      router.push(`/patient?domain=dashboard`);
    } else {
      router.push(`/patient?domain=dashboard`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error("Failed to mark all as read", err);
      toast.error("Failed to mark all as read");
    }
  };

  const getIcon = (item: AppNotification) => {
    switch (item.actionType) {
      case "PAYMENT_SUCCESS":
      case "PROPOSAL_ACCEPTED":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "ASSESSMENT_SUBMITTED":
      case "ASSESSMENT_ASSIGNED":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "ASSESSMENT_STATUS_UPDATED":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "ORDER_STATUS_UPDATED":
        return <Package className="w-5 h-5 text-purple-500" />;
      case "SUBSCRIPTION_CANCELLED":
      case "PROPOSAL_REJECTED":
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

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

  const renderNotificationItem = (notification: AppNotification) => (
    <div
      key={notification.id}
      onClick={() => handleNotificationClick(notification)}
      className={`px-5 py-4 transition-colors cursor-pointer ${
        !notification.isRead ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(notification)}</div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-semibold mb-1 ${
              !notification.isRead ? "text-gray-900" : "text-gray-700"
            }`}
          >
            {notification.title}
          </p>
          {notification.message && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
              {notification.message}
            </p>
          )}
          <p className="text-[11px] text-gray-400 mt-2">{formatTime(notification.createdAt)}</p>
        </div>
        {!notification.isRead && (
          <div className="flex-shrink-0 mt-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-full transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+10px)] w-80 sm:w-96 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 z-50 overflow-hidden"
            style={{ transformOrigin: "top right" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[11px] text-[#2563eb] font-semibold cursor-pointer hover:underline uppercase tracking-wide"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {notifications.length === 0 ? (
                <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
                  <Bell className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm font-medium text-gray-900">No notifications</p>
                  <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
                </div>
              ) : (
                <>
                  {todayNotifications.length > 0 && (
                    <>
                      <div className="px-5 py-2.5 bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Today
                        </p>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {todayNotifications.map(renderNotificationItem)}
                      </div>
                    </>
                  )}

                  {weekNotifications.length > 0 && (
                    <>
                      <div className="px-5 py-2.5 bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm border-t border-gray-50">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          This Week
                        </p>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {weekNotifications.map(renderNotificationItem)}
                      </div>
                    </>
                  )}

                  {olderNotifications.length > 0 && (
                    <>
                      <div className="px-5 py-2.5 bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm border-t border-gray-50">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Older
                        </p>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {olderNotifications.map(renderNotificationItem)}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
