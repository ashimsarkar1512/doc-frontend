"use client";

import { AlertCircle, CheckCircle, HelpCircle, Shield } from "lucide-react";
import { useState } from "react";
import ActionBar from "./ActionBar";
import ConsultationCard from "./ConsultationCard";
import ConsultationDetails from "./ConsultationDetails";
import KpiCard from "./KpiCard";
import TabBar from "./TabBar";

// Domain imports representing scalable micro-frontend boundaries
import StripeCheckoutModal from "./domains/billing/StripeCheckoutModal";
import ChatWindow from "./domains/messages/ChatWindow";
import MessageList from "./domains/messages/MessageList";
import NotificationCenter from "./domains/notifications/NotificationCenter";
import SettingsCenter from "./domains/settings/SettingsCenter";

import { useAppSelector } from "@/Redux/store/hooks";
import { Consultation, TabType } from "@/types/patientTypes";

// Hardcoded stock data for illustration.
const initialConsultations: Consultation[] = [
  {
    id: "#001216",
    title: "Weight Loss",
    category: "Hormone Therapy",
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "#001217",
    title: "Individual Therapy",
    category: "Hormone Therapy",
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "#001218",
    title: "Anxiety & Stress",
    category: "Hormone Therapy",
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "#001219",
    title: "Clarity Consult",
    category: "Hormone Therapy",
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "#001210",
    title: "Personal Training",
    category: "Hormone Therapy",
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "#001211",
    title: "Dietary Consultation",
    category: "Hormone Therapy",
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop",
  },
  // Pending Consultations
  {
    id: "#001231",
    title: "Testosterone Check",
    category: "Hormone Therapy",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "#001232",
    title: "Fat Burner Injection",
    category: "Hormone Therapy",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop",
  },
  // Declined Consultations
  {
    id: "#001241",
    title: "PRP Hair Regrowth",
    category: "Regrow Hair",
    status: "Declined",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop",
  },
];

export default function PatientPortalHome() {
  const user = useAppSelector((state) => state.auth.user);
  const [consultations] = useState<Consultation[]>(initialConsultations);
  const [activeTab, setActiveTab] = useState<TabType>("Approved");

  // High scaleable Shell Orchestration Domain State
  const [activeDomain, setActiveDomain] = useState<
    "dashboard" | "messages" | "notifications" | "settings"
  >("dashboard");
  const [selectedConsultationId, setSelectedConsultationId] = useState<
    string | null
  >(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [stripeModalOpen, setStripeModalOpen] = useState(false);

  // Filter computations
  const approvedConsults = consultations.filter((c) => c.status === "Approved");
  const pendingConsults = consultations.filter((c) => c.status === "Pending");
  const declinedConsults = consultations.filter((c) => c.status === "Declined");

  const filteredList = consultations.filter((c) => {
    if (activeTab === "History") return true;
    return c.status === activeTab;
  });

  const activeConsultation = consultations.find(
    (c) => c.id === selectedConsultationId,
  );

  const handleOpenConsultation = (id: string) => {
    setSelectedConsultationId(id);
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
          value={`0${pendingConsults.length}`}
          label="Pending Requests"
          icon={Shield}
          bgColor="bg-[#FFF9E6]"
          textColor="text-[#d97706]"
          borderColor="border-[#FEF0CF]"
        />
        <KpiCard
          value={`0${approvedConsults.length}`}
          label="Total Approved"
          icon={CheckCircle}
          bgColor="bg-[#E2F6EC]"
          textColor="text-[#059669]"
          borderColor="border-[#D1FAE5]"
        />
        <KpiCard
          value={`0${declinedConsults.length}`}
          label="Total Declined"
          icon={AlertCircle}
          bgColor="bg-[#FBECE9]"
          textColor="text-[#dc2626]"
          borderColor="border-[#FEE2E2]"
        />
        <KpiCard
          value="$1250"
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
          setActiveDomain(domain);
          // Auto reset sub views when switching primary modules
          setSelectedConsultationId(null);
          setSelectedChatId(null);
        }}
        onRequestNewConsultation={handleRequestConsultation}
      />

      {/* Primary Domain Dynamic Router */}

      {/* 1. Dashboard Domain view */}
      {activeDomain === "dashboard" && (
        <div className="flex flex-col gap-6 w-full">
          {!selectedConsultationId && (
            <TabBar
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              approvedCount={approvedConsults.length}
              pendingCount={pendingConsults.length}
              declinedCount={declinedConsults.length}
            />
          )}

          {selectedConsultationId && activeConsultation ? (
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
            />
          ) : (
            <MessageList onSelectChat={setSelectedChatId} />
          )}
        </div>
      )}

      {/* 3. Event Notification Domain view */}
      {activeDomain === "notifications" && (
        <div className="w-full">
          <NotificationCenter />
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
