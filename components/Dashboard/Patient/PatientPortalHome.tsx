"use client";

import { AlertCircle, CheckCircle, HelpCircle, Shield } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useAppSelector } from "@/Redux/store/hooks";
import { Consultation, TabType } from "@/types/patientTypes";
import NotificationCenter from "./domains/notifications/NotificationCenter";
import SettingsCenter from "./domains/settings/SettingsCenter";


// Hardcoded stock data for illustration.
  // const initialConsultations: Consultation[] = [
  //   {
  //     id: "#001216",
  //     title: "Weight Loss",
  //     category: "Hormone Therapy",
  //     status: "Approved",
  //     image:
  //       "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
  //   },
  //   {
  //     id: "#001217",
  //     title: "Individual Therapy",
  //     category: "Hormone Therapy",
  //     status: "Approved",
  //     image:
  //       "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
  //   },
  //   {
  //     id: "#001218",
  //     title: "Anxiety & Stress",
  //     category: "Hormone Therapy",
  //     status: "Approved",
  //     image:
  //       "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
  //   },
  //   {
  //     id: "#001219",
  //     title: "Clarity Consult",
  //     category: "Hormone Therapy",
  //     status: "Approved",
  //     image:
  //       "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
  //   },
  //   {
  //     id: "#001210",
  //     title: "Personal Training",
  //     category: "Hormone Therapy",
  //     status: "Approved",
  //     image:
  //       "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  //   },
  //   {
  //     id: "#001211",
  //     title: "Dietary Consultation",
  //     category: "Hormone Therapy",
  //     status: "Approved",
  //     image:
  //       "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop",
  //   },
  //   // Pending Consultations
  //   {
  //     id: "#001231",
  //     title: "Testosterone Check",
  //     category: "Hormone Therapy",
  //     status: "Pending",
  //     image:
  //       "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop",
  //   },
  //   {
  //     id: "#001232",
  //     title: "Fat Burner Injection",
  //     category: "Hormone Therapy",
  //     status: "Pending",
  //     image:
  //       "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop",
  //   },
  //   // Declined Consultations
  //   {
  //     id: "#001241",
  //     title: "PRP Hair Regrowth",
  //     category: "Regrow Hair",
  //     status: "Declined",
  //     image:
  //       "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop",
  //   },
  // ];

export default function PatientPortalHome() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: statsResponse } = useGetDashboardStatsQuery();
  console.log("statsResponse",statsResponse)
  const stats = statsResponse?.data;
  
  const [activeTab, setActiveTab] = useState<TabType>("ACCEPTED");

  const getApiStatus = (tab: TabType) => {
    if (tab === "My Orders") return undefined; // Don't filter, or just don't fetch
    return tab; // Because TabType now exactly matches the API status strings
  };

  const { data: assessmentsResponse } = useGetMyAssessmentsQuery({
    status: getApiStatus(activeTab)
  }, { skip: activeTab === "My Orders" });
  const submissions = assessmentsResponse?.submissions || [];
  const counts = assessmentsResponse?.counts || {};

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
  // Holds an ID navigated directly from chat (bypasses tab filtering)
  const [directSubmissionId, setDirectSubmissionId] = useState<string | null>(null);

  const activeConsultation = mappedConsultations.find(
    (c) => c.id === selectedConsultationId,
  );

  const handleOpenConsultation = (id: string) => {
    setSelectedConsultationId(id);
    setDirectSubmissionId(null);
  };

  const handleRequestConsultation = () => {
    console.log("Initiating new consultation flow...");
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
    <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1 flex flex-col font-sans">
      {/* Welcome Banner */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#2e5e54] text-white font-bold text-2xl flex items-center justify-center shadow-sm select-none border-2 border-white">
          {getInitials()}
        </div>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 leading-tight">
            Welcome Back, {getDisplayName()}!
          </h2>
          <p className="text-sm text-gray-400 font-light mt-0.5 leading-none">
            Manage your daily activities.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid - Uniform and elegant flat styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          value={stats?.TotalPending?.toString().padStart(2, "0") || "00"}
          label="Pending Requests"
          icon={Shield}
          bgColor="bg-[#FFF9E6]"
          textColor="text-[#d97706]"
          borderColor="border-[#FEF0CF]"
        />
        <KpiCard
          value={stats?.TotalApproved?.toString().padStart(2, "0") || "00"}
          label="Total Approved"
          icon={CheckCircle}
          bgColor="bg-[#E2F6EC]"
          textColor="text-[#059669]"
          borderColor="border-[#D1FAE5]"
        />
        <KpiCard
          value={stats?.TotalDeclined?.toString().padStart(2, "0") || "00"}
          label="Total Declined"
          icon={AlertCircle}
          bgColor="bg-[#FBECE9]"
          textColor="text-[#dc2626]"
          borderColor="border-[#FEE2E2]"
        />
        <KpiCard
          value={`$${stats?.TotalPayment || 0}`}
          label="Total Paid"
          icon={Shield}
          bgColor="bg-[#E1EBFD]"
          textColor="text-[#2563eb]"
          borderColor="border-[#DBEAFE]"
        />
      </div>

      {/* Action Navigation Controls */}
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
        <div className="flex flex-col gap-6 w-full">
          {!selectedConsultationId && !directSubmissionId && (
            <TabBar
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              counts={counts}
            />
          )}

          {activeTab === "My Orders" ? (
            <MyOrdersDomain />
          ) : directSubmissionId ? (
            // Navigated directly from chat — build a minimal shell, ConsultationDetails fetches the real data
            <ConsultationDetails
              consultation={{ id: directSubmissionId, title: '', category: '', status: 'ACCEPTED' as any, image: '' }}
              onBack={() => {
                setDirectSubmissionId(null);
                setActiveDomain('messages');
              }}
            />
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
      )}

      {/* 2. Messages & Chat Domain view */}
      {activeDomain === "messages" && (
        <div className="w-full">
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
            <MessageList onSelectChat={setSelectedChatId} />
          )}
        </div>
      )}

      {/* 3. Event Notification Domain view */}
      {activeDomain === "notifications" && (
        <div className="w-full">
          <NotificationCenter/>
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
