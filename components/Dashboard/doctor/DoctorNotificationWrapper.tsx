"use client";

import { useRouter } from "next/navigation";
import NotificationCenter from "../Patient/domains/notifications/NotificationCenter";
import { AppNotification } from "@/types/notificationTypes";

export default function DoctorNotificationWrapper() {
  const router = useRouter();

  const handleNavigate = (notif: AppNotification) => {
    if (notif.actionType === "NEW_MESSAGE") {
      router.push(`/doctor?view=messages&chatId=${notif.referenceId}`);
    } else if (notif.actionType.startsWith("ASSESSMENT_")) {
      router.push(`/doctor?view=consultations&consultationId=${notif.referenceId}`);
    } else if (notif.actionType === "ORDER_STATUS_UPDATED") {
      // Doctor orders view not explicitly defined, fallback to dashboard
      router.push(`/doctor`);
    }
  };

  return <NotificationCenter onNotificationClick={handleNavigate} />;
}
