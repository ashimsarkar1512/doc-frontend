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
import DoctorNavbar from "@/components/Dashboard/doctor/DoctorNavbar";
import DoctorSettings from "@/components/Dashboard/doctor/DoctorSettings";
import DashboardStatsCards from "@/components/Dashboard/doctor/DashboardStatsCards/DashboardStatsCards";



type SearchParams = Promise<{ consultationId?: string; view?: string; chatId?: string }>;

export default async function DoctorDashboard({ searchParams }: { searchParams: SearchParams }) {
  
  const params = await searchParams;
  const consultationId = params.consultationId;
  const view = params.view;
  const chatId = params.chatId;
  const isMessages = view === "messages";
  const isNotifications = view === "notifications";
  const isSettings = view === "settings";

  const doctorNotifications = {
    today: [
      {
        id: 1,
        title: "New message from patient",
        description: "Patient Alan Cattach send you a message",
        time: "2h ago",
        image: "/doctor/doc-1.jpg",
      },
      {
        id: 2,
        title: "New request assigned",
        description: "A new Consultation id: #001236 has been assigned by admin.",
        time: "1d ago",
        icon: ShieldCheck,
        iconClassName: "bg-[#d8a91f] text-white",
      },
    ],
    thisWeek: [
      {
        id: 3,
        title: "Consultation closed!",
        description: "Patient Alan Cattach closed the consultation id: #001236",
        time: "1d ago",
        icon: CircleX,
        iconClassName: "bg-[#e4522e] text-white",
      },
      {
        id: 4,
        title: "New attachment from patient",
        description: "Your patient Mari Torres has sent a new attachment.",
        time: "1d ago",
        image: "/doctor/profile-doc.png",
      },
      {
        id: 5,
        title: "Consultation proposal accepted!",
        description: "Patient Alan Cattach has accepted and paid for new consultation",
        time: "2d ago",
        icon: BadgeDollarSign,
        iconClassName: "bg-[#07b456] text-white",
      },
    ],
  };

  const renderNotificationItem = (
    item: {
      id: number;
      title: string;
      description: string;
      time: string;
      image?: string;
      icon?: ElementType;
      iconClassName?: string;
    },
    highlighted = false
  ) => {
    const Icon = item.icon;

    return (
      <div
        key={item.id}
        className={`flex items-center gap-3 rounded-xl px-4 py-4 ${
          highlighted ? "bg-[#e8f1ff]" : "bg-white"
        }`}
      >
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : Icon ? (
            <div className={`flex h-full w-full items-center justify-center ${item.iconClassName}`}>
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
        </div>

        <span className="flex-shrink-0 text-xs text-gray-500">{item.time}</span>
      </div>
    );
  };

  const getContent = () => {
    if (consultationId) return <ConsultationDetails id={consultationId} />;
    if (isMessages && chatId) return <ChatView chatId={chatId} />;
    if (isMessages) return <MessagesPanel />;
    if (isSettings) return <DoctorSettings />;
    if (isNotifications) {
      return (
        <section className="pt-1">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Notifications</h2>

          <div className="space-y-7">
            <div>
              <p className="mb-2 text-sm text-gray-500">Today</p>
              <div className="space-y-3">
                {doctorNotifications.today.map((item, index) =>
                  renderNotificationItem(item, index === 0)
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm text-gray-500">This week</p>
              <div className="space-y-3">
                {doctorNotifications.thisWeek.map((item) =>
                  renderNotificationItem(item)
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }
    return <DoctorTabs />;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col [&_button:not(:disabled)]:cursor-pointer [&_button:disabled]:cursor-not-allowed"> 
      <DoctorNavbar /> 

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 pt-28">
        {/* Welcome Section */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-sm border border-gray-100">
            <Image
              src="/doctor/profile-doc.png"
              alt="Dr. Runa"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-1">
              Welcome Back, Dr. Runa! (shaikot)
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your patients and consultations
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStatsCards/>
      
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
