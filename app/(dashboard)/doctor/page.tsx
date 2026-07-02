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



type SearchParams = Promise<{ consultationId?: string; view?: string; chatId?: string; domain?: string }>;

export default async function DoctorDashboard({ searchParams }: { searchParams: SearchParams }) {
  
  const params = await searchParams;
  const consultationId = params.consultationId;
  const view = params.view || params.domain;
  const chatId = params.chatId;
  const isMessages = view === "messages";
  const isNotifications = view === "notifications";
  const isSettings = view === "settings";



  const getContent = () => {
    // if (consultationId) return <ConsultationDetails id={consultationId} />;
    if (consultationId) return <ConsultationDetails  />;
    if (isMessages && chatId) return <ChatView chatId={chatId} />;
    if (isMessages) return <MessagesPanel />;
    if (isSettings) return <DoctorSettings />;
    if (isNotifications) {
      return <DoctorNotificationWrapper />;
    }
    return <DoctorTabs />;
  };

  return (
    <div className="min-h-screen flex flex-col [&_button:not(:disabled)]:cursor-pointer [&_button:disabled]:cursor-not-allowed">
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 font-sans py-8 pt-8`}>
        {/* Action Buttons at the Top */}
        <div className="flex gap-4 mb-8">
          <Link href="/doctor">
            <span className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm ${!view && !consultationId ? "bg-[#2563eb] text-white shadow-blue-200" : "bg-white border border-gray-200 text-[#2563eb] hover:bg-gray-50"}`}>
              <Home className="w-5 h-5" />
            </span>
          </Link>
          <Link href="/doctor?view=messages">
            <span className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm ${isMessages || chatId ? "bg-[#2563eb] text-white shadow-blue-200" : "bg-white border border-gray-200 text-[#2563eb] hover:bg-gray-50"}`}>
              <MessageSquare className="w-5 h-5" />
            </span>
          </Link>
          <Link href="/doctor?view=settings">
            <span className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm ${isSettings ? "bg-[#2563eb] text-white shadow-blue-200" : "bg-white border border-gray-200 text-[#2563eb] hover:bg-gray-50"}`}>
              <Settings className="w-5 h-5" />
            </span>
          </Link>
        </div>

        {/* Dashboard Domain specific content */}
        {!view && !consultationId && (
          <>
            {/* Welcome Section */}
            <DoctorWelcomeData/>

            {/* Stats Cards */}
            <DashboardStatsCards/>
          </>
        )}

        {isMessages ? (
          <div className="w-full flex gap-8 min-h-[750px]">
            <div className="flex-shrink-0 sticky top-10">
               <MessagesPanel />
            </div>
            <div className="flex-1 min-w-0 pt-[42px]">
              {chatId ? (
                <ChatView chatId={chatId} />
              ) : (
                <div className="w-full h-[700px] flex items-center justify-center bg-gray-50/50 rounded-[24px] border border-gray-150 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
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
