"use client";

import { Bell, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: number;
  type: "appointment" | "payment" | "message" | "alert";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "appointment",
    title: "New appointment scheduled",
    description: "Alan Cattach has scheduled a consultation for tomorrow at 10:00 AM",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: 2,
    type: "payment",
    title: "Payment received",
    description: "Jane Cooper has paid $150.00 for consultation",
    time: "5 hours ago",
    isRead: false,
  },
  {
    id: 3,
    type: "message",
    title: "New message from patient",
    description: "Albert Flores sent you a message regarding weight loss plan",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: 4,
    type: "alert",
    title: "Consultation reminder",
    description: "Reminder: Consultation with Kristin Watson in 30 minutes",
    time: "2 days ago",
    isRead: true,
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "payment":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "message":
        return <Clock className="w-5 h-5 text-purple-500" />;
      case "alert":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const todayNotifications = notifications.filter((n) => !n.isRead);
  const weekNotifications = notifications.filter((n) => n.isRead);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm bg-white border border-gray-200 text-[#2563eb] hover:bg-gray-50"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-14 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                Mark all as read
              </span>
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto">
              {/* Today */}
              {todayNotifications.length > 0 && (
                <>
                  <div className="px-5 py-3 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Today</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {todayNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {notification.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* This Week */}
              {weekNotifications.length > 0 && (
                <>
                  <div className="px-5 py-3 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-500 uppercase">This Week</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {weekNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {notification.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100">
              <button className="w-full text-center text-sm text-blue-600 font-medium hover:underline">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
