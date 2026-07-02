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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 pt-8">
        {/* Welcome Section & Stats Cards */}
        {!view && !consultationId && (
          <>
            <DoctorWelcomeData />
            <DashboardStatsCards />
          </>
        )}
      
        {/* Action Buttons  i cone*/}
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
          <Link href="/doctor?view=notifications">
            <span className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm ${isNotifications ? "bg-[#2563eb] text-white shadow-blue-200" : "bg-white border border-gray-200 text-[#2563eb] hover:bg-gray-50"}`}>
              <Bell className="w-5 h-5" />
            </span>
          </Link>
          <Link href="/doctor?view=settings">
            <span className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm ${isSettings ? "bg-[#2563eb] text-white shadow-blue-200" : "bg-white border border-gray-200 text-[#2563eb] hover:bg-gray-50"}`}>
              <Settings className="w-5 h-5" />
            </span>
          </Link>
        </div>

        {getContent()}
      </main>

      <Footer />
    </div>
  );
}
