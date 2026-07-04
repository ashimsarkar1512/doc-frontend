"use client";

import { AlertCircle, BadgeDollarSign, CheckCircle, HelpCircle, Shield, ShieldBan } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import ActionBar from "./ActionBar";
import ConsultationCard from "./ConsultationCard";
import ConsultationDetails from "./ConsultationDetails";
import KpiCard from "./KpiCard";
import TabBar from "./TabBar";

// Domain imports representing scalable micro-frontend boundaries
import MyOrdersDomain from "./domains/orders/MyOrdersDomain";
import StripeCheckoutModal from "./domains/billing/StripeCheckoutModal";
import ChatWindow from "./domains/messages/ChatWindow";
import MessageList from "./domains/messages/MessageList";
import { useGetDashboardStatsQuery } from "@/Redux/features/patient/dashboard/dashboardApi";
import { useGetMyAssessmentsQuery } from "@/Redux/features/patient/assessmentSubmission/assessmentSubmissionApi";
import { useGetMyOrdersQuery } from "@/Redux/features/patient/orders/orderApi";
import { useAppSelector } from "@/Redux/store/hooks";
import { Consultation, TabType } from "@/types/patientTypes";
import NotificationCenter from "./domains/notifications/NotificationCenter";
import SettingsCenter from "./domains/settings/SettingsCenter";


export default function PatientPortalHome() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: statsResponse } = useGetDashboardStatsQuery();
  console.log("statsResponse", statsResponse)
  const stats = statsResponse?.data;

  const [activeTab, setActiveTab] = useState<TabType>("PENDING");

  const getApiStatus = (tab: TabType) => {
    if (tab === "My Orders") return undefined; // Don't filter, or just don't fetch
    return tab; // Because TabType now exactly matches the API status strings
  };

  const { data: assessmentsResponse } = useGetMyAssessmentsQuery({
    status: getApiStatus(activeTab)
  }, { skip: activeTab === "My Orders" });
  const submissions = assessmentsResponse?.submissions || [];
  const counts = assessmentsResponse?.counts || {};

  const { data: ordersResponse } = useGetMyOrdersQuery({}, { pollingInterval: 5000 });
  const totalOrders = ordersResponse?.orders?.length || 0;

  const mappedConsultations: Consultation[] = submissions.map((sub) => ({
    id: sub.id,
    code: sub.submissionCode,
    title: sub.assessment?.title || "Unknown",
    category: sub.assessment?.category?.name || "Unknown",
    status: sub.status as any, // Using exact status strings
    image: sub.assessment?.thumbnail || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
  }));

  const filteredList = mappedConsultations;

  const router = useRouter();
  const searchParams = useSearchParams();

  // High scaleable Shell Orchestration Domain State
  const initialDomain = (searchParams.get("domain") as any) || "dashboard";
  const [activeDomain, setActiveDomain] = useState<
    "dashboard" | "messages" | "notifications" | "settings"
  >(initialDomain);

  useEffect(() => {
    const domain = searchParams.get("domain") as any;
    if (domain && domain !== activeDomain) {
      setActiveDomain(domain);
    }
  }, [searchParams]);

  const handleDomainChange = (domain: "dashboard" | "messages" | "notifications" | "settings") => {
    setActiveDomain(domain);
    const params = new URLSearchParams(searchParams.toString());
    params.set("domain", domain);
    router.push(`?${params.toString()}`);
  };
  const [selectedConsultationId, setSelectedConsultationId] = useState<
    string | null
  >(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [stripeModalOpen, setStripeModalOpen] = useState(false);
  // Holds an ID navigated directly from chat or orders (bypasses tab filtering)
  const [directSubmissionId, setDirectSubmissionId] = useState<string | null>(null);
  const [directSubmissionReturnTo, setDirectSubmissionReturnTo] = useState<"messages" | "orders">("messages");

  const activeConsultation = mappedConsultations.find(
    (c) => c.id === selectedConsultationId,
  );

  const handleOpenConsultation = (id: string) => {
    setSelectedConsultationId(id);
    setDirectSubmissionId(null);
  };

  const handleRequestConsultation = () => {
    router.push("/#assessments");
  };

  const getDisplayName = () => {
    if (user?.profile?.name) return user.profile.name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`max-w-[1520px] mx-auto px-6 w-full flex-1 flex flex-col font-sans `}>
      {/* Action Navigation Controls at the Top */}
      <ActionBar
        activeDomain={activeDomain}
        onChangeDomain={(domain) => {
          handleDomainChange(domain);
          // Auto reset sub views when switching primary modules
          setSelectedConsultationId(null);
          setSelectedChatId(null);
          setDirectSubmissionId(null);
        }}
        onRequestNewConsultation={handleRequestConsultation}
      />

      {/* Primary Domain Dynamic Router */}

      {/* 1. Dashboard Domain view */}
      {activeDomain === "dashboard" && (
        <div className="flex flex-col w-full">
          {/* Welcome Banner & KPI Cards only on Dashboard home */}
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-[16px] md:gap-[24px] mb-[32px] md:mb-[44px]">
            {user?.profile?.avatar ? (
              <Image
                src={user.profile.avatar}
                alt={getDisplayName()}
                width={80}
                height={80}
                className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full object-cover shadow-sm select-none border-2 border-white mx-auto md:mx-0"
              />
            ) : (
              <div className="relative w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full overflow-hidden bg-[#2e5e54] text-white font-bold text-[24px] md:text-[32px] flex items-center justify-center shadow-sm select-none border-2 border-white mx-auto md:mx-0">
                {getInitials()}
              </div>
            )}
            <div className="flex flex-col gap-[4px] md:gap-[8px]">
              <h2 className="text-[28px] md:text-[40px] font-semibold tracking-tight text-[#272628] font-[Quicksand] leading-[110%]">
                Welcome Back, {getDisplayName()}!
              </h2>
              <p className="text-[16px] md:text-[20px] text-[#272628] font-[Quicksand] font-normal leading-[100%]">
                Manage your daily activities
              </p>
            </div>
          </div>

          {/* KPI Cards Grid - Uniform and elegant flat styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard
              value={stats?.TotalPending?.toString().padStart(2, "0") || "00"}
              label="Pending Requests"
              icon={Shield}
              bgColor="bg-[#FDC70029]"
              textColor="text-[#D4AF37]"
              borderColor="border-[#FEF0CF]"
            />
            <KpiCard
              value={stats?.TotalApproved?.toString().padStart(2, "0") || "00"}
              label="Total Approved"
              icon={CheckCircle}
              bgColor="bg-[#24B57B29]"
              textColor="text-[#24B57B]"
              borderColor="border-[#D1FAE5]"
            />
            <KpiCard
              value={stats?.TotalDeclined?.toString().padStart(2, "0") || "00"}
              label="Total Declined"
              icon={ShieldBan}
              bgColor="bg-[#D4563729]"
              textColor="text-[#D45637]"
              borderColor="border-[#FEE2E2]"
            />
            <KpiCard
              value={`$${stats?.TotalPayment || 0}`}
              label="Total Paid"
              icon={BadgeDollarSign}
              bgColor="bg-[#1D4ED829]"
              textColor="text-[#1D4ED8]"
              borderColor="border-[#DBEAFE]"
            />
          </div>

          <div className="flex flex-col gap-6 w-full">
            {!selectedConsultationId && !directSubmissionId && (
              <TabBar
                activeTab={activeTab}
                onChangeTab={setActiveTab}
                counts={counts}
                totalOrders={totalOrders}
              />
            )}

            {directSubmissionId ? (
              // Navigated directly from chat or orders — build a minimal shell, ConsultationDetails fetches the real data
              <ConsultationDetails
                consultation={{ id: directSubmissionId, title: '', category: '', status: 'ACCEPTED' as any, image: '' }}
                onBack={() => {
                  setDirectSubmissionId(null);
                  if (directSubmissionReturnTo === "messages") {
                    setActiveDomain('messages');
                  } else {
                    setActiveDomain('dashboard');
                  }
                }}
              />
            ) : activeTab === "My Orders" ? (
              <MyOrdersDomain onViewSubmission={(id) => {
                setDirectSubmissionReturnTo("orders");
                setDirectSubmissionId(id);
              }} />
            ) : selectedConsultationId && activeConsultation ? (
              <ConsultationDetails
                consultation={activeConsultation}
                onBack={() => setSelectedConsultationId(null)}
              />
            ) : filteredList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {filteredList.map((item) => (
                  <ConsultationCard
                    key={item.id}
                    consultation={item}
                    onOpen={handleOpenConsultation}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-150 shadow-[0_2px_8px_rgba(0,0,0,0.01)] mb-12">
                <HelpCircle className="h-10 w-10 text-gray-300 mb-3" />
                <h4 className="font-semibold text-gray-800 text-base">
                  No Consultations Found
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  There are no {activeTab.toLowerCase()} consultations listed
                  right now.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Messages & Chat Domain view */}
      {activeDomain === "messages" && (
        <div className="w-full flex lg:gap-8 min-h-[750px]">
          <div className={`flex-shrink-0 sticky top-10 w-full lg:w-auto ${selectedChatId ? 'hidden lg:block' : 'block'}`}>
            <MessageList
              onSelectChat={setSelectedChatId}
              selectedChatId={selectedChatId}
              onBack={() => {
                setActiveDomain('dashboard');
                setSelectedChatId(null);
              }}
            />
          </div>
          <div className={`flex-1 min-w-0 w-full ${!selectedChatId ? 'hidden lg:block' : 'block'}`}>
            {selectedChatId ? (
              <ChatWindow
                chatId={selectedChatId}
                onBack={() => setSelectedChatId(null)}
                onTriggerPayment={() => setStripeModalOpen(true)}
                onViewDetails={(submissionId) => {
                  setActiveDomain('dashboard');
                  setDirectSubmissionId(submissionId);
                  setSelectedConsultationId(null);
                }}
              />
            ) : (
              <div className="w-full h-[700px] flex items-center justify-center">
                <div className="bg-gray-100 rounded-full px-6 py-2.5 text-gray-500 text-sm font-medium">
                  Select a consultation to start messging
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Event Notification Domain view */}
      {activeDomain === "notifications" && (
        <div className="w-full">
          <NotificationCenter
            onNotificationClick={(notif) => {
              if (notif.actionType === "NEW_MESSAGE") {
                setActiveDomain("messages");
                setSelectedChatId(notif.referenceId);
              } else if (notif.actionType.startsWith("ASSESSMENT_")) {
                setActiveDomain("dashboard");
                setSelectedConsultationId(notif.referenceId);
              } else if (notif.actionType === "ORDER_STATUS_UPDATED") {
                setActiveDomain("dashboard");
                setActiveTab("My Orders");
              }
            }}
          />
        </div>
      )}

      {/* 4. Settings Domain view */}
      {activeDomain === "settings" && (
        <div className="w-full">
          <SettingsCenter />
        </div>
      )}

      {/* Stripe Payment Modal Portal sheet */}
      <StripeCheckoutModal
        isOpen={stripeModalOpen}
        onClose={() => setStripeModalOpen(false)}
        onSuccess={() => {
          setStripeModalOpen(false);
          // Set to static simulation alert
          alert(
            "Payment accepted successfully! Your appointment has been secured.",
          );
        }}
      />
    </div>
  );
}
