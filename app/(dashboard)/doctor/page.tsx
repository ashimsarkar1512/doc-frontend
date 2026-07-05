import Image from "next/image";
import type { ElementType } from "react";
import {
  Stethoscope,
  ClipboardPlus,
  Shield,
  ShieldBan,
  Home,
  MessageSquare,
  Bell,
  Settings,
  ShieldCheck,
  CircleX,
  BadgeDollarSign,
} from "lucide-react";
import Link from "next/link";
import DoctorTabs from "@/components/Dashboard/doctor/DoctorTabs";
import Footer from "@/components/shared/Footer";
import ConsultationDetails from "@/components/Dashboard/doctor/ConsultationDetails";
import ChatView from "@/components/Dashboard/doctor/ChatView";
import MessagesPanel from "@/components/Dashboard/doctor/MessagesPanel";
import DoctorSettings from "@/components/Dashboard/doctor/DoctorSettings";
import DashboardStatsCards from "@/components/Dashboard/doctor/DashboardStatsCards/DashboardStatsCards";
import DoctorNotificationWrapper from "@/components/Dashboard/doctor/DoctorNotificationWrapper";
import DoctorWelcomeData from "@/components/Dashboard/doctor/DashboardStatsCards/DoctorWelcomeData";

type SearchParams = Promise<{
  consultationId?: string;
  view?: string;
  chatId?: string;
  domain?: string;
}>;

export default async function DoctorDashboard({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const consultationId = params.consultationId;
  const view = params.view || params.domain;
  const chatId = params.chatId;
  const isMessages = view === "messages";
  const isNotifications = view === "notifications";
  const isSettings = view === "settings";

  const getContent = () => {
    // if (consultationId) return <ConsultationDetails id={consultationId} />;
    if (consultationId) return <ConsultationDetails />;
    if (isMessages && chatId) return <ChatView chatId={chatId} />;
    if (isMessages) return <MessagesPanel />;
    if (isSettings) return <DoctorSettings />;
    if (isNotifications) {
      return <DoctorNotificationWrapper />;
    }
    return <DoctorTabs />;
  };

  return (
    <div className="h-full flex flex-col [&_button:not(:disabled)]:cursor-pointer [&_button:disabled]:cursor-not-allowed">
      <main
        className={`flex-1 max-w-[1520px] w-full mx-auto px-4 md:px-8 font-sans py-8 pt-8`}
      >
        {/* Action Buttons at the Top */}
        <div className="flex flex-wrap items-center gap-[16px] justify-center sm:justify-start mb-[24px]">
          <Link href="/doctor">
            <span
              className={`w-11 h-11 rounded-[14px] flex items-center justify-center active:scale-95 transition-all duration-150 ${!view && !consultationId ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/10 hover:bg-[#1d4ed8]" : "bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe]"}`}
            >
              <Home className="w-[24px] h-[24px]" />
            </span>
          </Link>
          <Link href="/doctor?view=messages">
            <span
              className={`w-11 h-11 rounded-[14px] flex items-center justify-center active:scale-95 transition-all duration-150 ${isMessages || chatId ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/10 hover:bg-[#1d4ed8]" : "bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe]"}`}
            >
              <MessageSquare className="w-[24px] h-[24px]" />
            </span>
          </Link>
          <Link href="/doctor?view=settings">
            <span
              className={`w-11 h-11 rounded-[14px] flex items-center justify-center active:scale-95 transition-all duration-150 ${isSettings ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/10 hover:bg-[#1d4ed8]" : "bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe]"}`}
            >
              <Settings className="w-[24px] h-[24px]" />
            </span>
          </Link>
        </div>

        {/* Dashboard Domain specific content */}
        {!view && !consultationId && (
          <>
            {/* Welcome Section */}
            <DoctorWelcomeData />

            {/* Stats Cards */}
            <DashboardStatsCards />
          </>
        )}

        {isMessages ? (
          <div className="w-full flex lg:gap-8 min-h-[750px] ">
            <div
              className={`flex-shrink-0 sticky top-10 w-full lg:w-auto ${chatId ? "hidden lg:block" : "block"}`}
            >
              <MessagesPanel />
            </div>
            <div
              className={`flex-1 min-w-0 w-full ${!chatId ? "hidden lg:block" : "block"}`}
            >
              {chatId ? (
                <ChatView chatId={chatId} />
              ) : (
                <div className="w-full h-[700px] flex items-center justify-center">
                  <div className="bg-gray-100 rounded-full px-6 py-2.5 text-gray-500 text-sm font-medium">
                    Select a patient to start messaging
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          getContent()
        )}
      </main>
    </div>
  );
}
