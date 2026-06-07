"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Paperclip, Send, Download, FileText, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import PaymentRequestModal from "@/components/Dashboard/doctor/PaymentRequestModal";

const patientData: Record<string, { name: string; category: string; consultationId: string; image: string }> = {
  "001236": { name: "Alan Cattach", category: "Weight Loss", consultationId: "#001236", image: "/doctor/doc-1.jpg" },
  "001237": { name: "Jane Cooper", category: "Individual Therapy", consultationId: "#001237", image: "/doctor/doc-2.jpg" },
  "001238": { name: "Albert Flores", category: "Anxiety & Stress", consultationId: "#001238", image: "/doctor/doc-3.jpg" },
  "001239": { name: "Kristin Watson", category: "Clarity Consult", consultationId: "#001239", image: "/doctor/doc-4.jpg" },
};

type Message = {
  id: number;
  sender: "doctor" | "patient";
  text: string;
  time: string;
  proposal?: {
    title: string;
    message: string;
    fee: string;
    date: string;
  };
};

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "doctor",
    text: "Hello! I'm Dr. Runa Pradhan. I can definitely assist you with a weight loss plan. I've guided many patients through similar journeys. I propose a private consultation for $150, and we can schedule it as soon as you're ready.",
    time: "10 min ago",
  },
  {
    id: 2,
    sender: "patient",
    text: "Great, thanks! Does that consultation fee include any preliminary lab work or is that separate?",
    time: "10 min ago",
  },
  {
    id: 3,
    sender: "doctor",
    text: "That's a great question. The $150 covers the consultation itself, where we'll discuss your goals, medical history, and lifestyle. Any lab work would be a separate cost, but I can provide a detailed breakdown during our session. I want to ensure we tailor the plan to your specific needs.",
    time: "10 min ago",
  },
  {
    id: 4,
    sender: "patient",
    text: "Understood. Please send me a formal proposal through with those details so I can review it.",
    time: "10 min ago",
  },
  {
    id: 5,
    sender: "doctor",
    text: "Okay I'm sending the proposal. Accept it.",
    time: "10 min ago",
    proposal: {
      title: "Personalized Weight Loss Consultation",
      message: "A comprehensive one-on-one consultation with Dr. Morrison to discuss your weight loss goals, medical history, and create a tailored plan. Does not include the cost of lab work.",
      fee: "$150.00",
      date: "Nov 26, 2025",
    },
  },
  {
    id: 6,
    sender: "patient",
    text: "Accepted! Great, I'm excited to get started and work towards achieving my weight loss goals.",
    time: "10 min ago",
  },
];

export default function ChatView({ chatId }: { chatId: string }) {
  const patient = patientData[chatId];
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Patient not found.
      </div>
    );
  }

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "doctor",
        text: inputValue.trim(),
        time: "Just now",
      },
    ]);
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Back Link */}
      <Link
        href="/doctor?view=messages"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 mb-5 hover:text-blue-600 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Weight Loss
      </Link>

      <div className="flex gap-6 mb-10">
        {/* Chat Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Card */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm h-[800px]">
          {/* Chat Header */}
          <div className="bg-[#2563eb] px-5 py-4 flex items-center gap-3">
            <div className="relative">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                <Image src={patient.image} alt={patient.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#22c55e] border-2 border-[#2563eb] rounded-full"></div>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{patient.name}</h2>
              <p className="text-blue-100 text-[11px] mt-0.5 font-medium">
                Patient - Consultation id: {patient.consultationId}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesRef} className="bg-[#f8fafc] flex-1 px-5 py-6 space-y-6 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.sender === "doctor" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* Avatar */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm">
                      <Image 
                        src={msg.sender === "doctor" ? "/doctor/profile-doc.png" : patient.image} 
                        alt={msg.sender} 
                        fill 
                        sizes="32px" 
                        className="object-cover" 
                      />
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="flex flex-col min-w-0">
                    {msg.proposal ? (
                      <div className="flex flex-col gap-2 w-[380px]">
                        {msg.text && (
                          <div
                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm bg-[#e2e8f0] text-gray-700 w-fit self-end rounded-tr-sm`}
                          >
                            {msg.text}
                          </div>
                        )}
                        <div className="bg-[#e2e8f0] border border-gray-300/60 rounded-xl overflow-hidden w-full">
                          <div className="px-4 py-3 border-b border-gray-300/60 bg-[#cbd5e1]/30">
                            <h4 className="font-bold text-gray-900 text-sm">{msg.proposal.title}</h4>
                          </div>
                          <div className="p-4">
                            <p className="text-xs font-semibold text-gray-900 mb-1">Message:</p>
                            <p className="text-xs text-gray-700 leading-relaxed mb-4">{msg.proposal.message}</p>
                            <p className="text-xs font-semibold text-gray-900 mb-2">Proposal Includes:</p>
                            <div className="flex gap-5 text-xs text-gray-700 mb-5">
                              <span>Fees: <strong className="text-blue-600 font-semibold">{msg.proposal.fee}</strong></span>
                              <span>Date: {msg.proposal.date}</span>
                            </div>
                            <button className="border border-gray-400 text-gray-800 text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-gray-300 transition-colors w-fit">
                              Withdraw proposal
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm bg-[#e2e8f0] text-gray-700 ${
                          msg.sender === "doctor"
                            ? "rounded-tr-sm"
                            : "rounded-tl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    )}
                    <p className={`text-[10px] text-gray-400 mt-1.5 font-medium ${msg.sender === "doctor" ? "text-right" : "text-left"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="bg-[#f8fafc] border-t border-gray-200 px-4 py-4 flex items-center gap-3">
            <button className="text-[#2563eb] hover:text-blue-700 transition-colors flex-shrink-0 p-1">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 text-sm text-gray-700 placeholder-gray-500 bg-[#e2e8f0] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              onClick={handleSend}
              className="bg-[#2563eb] hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-6 py-3 rounded-lg flex items-center gap-2 flex-shrink-0 shadow-sm"
            >
              Send <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        {/* Service Information Card */}
        <div className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-[#f8fafc] mb-6">
          <h3 className="font-bold text-gray-900 text-[15px] mb-5">Service Information</h3>
          
          <div className="space-y-3.5 text-xs mb-6">
            <div className="flex justify-between items-center text-gray-500">
              <span>Service Started</span>
              <span className="text-gray-900 font-medium">12 May, 26</span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Service Duration</span>
              <span className="text-gray-900 font-medium">1 month</span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Service Fees</span>
              <span className="text-gray-900 font-medium">$50.00</span>
            </div>
            <div className="flex justify-between items-center text-gray-500 pt-2 border-t border-gray-200">
              <span>Next billing date:</span>
              <span className="text-gray-900 font-medium">12 Jun, 26</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href={`/doctor?consultationId=${chatId}`} className="w-full">
              <button className="w-full bg-[#3f3f46] hover:bg-[#27272a] transition-colors text-white text-[13px] font-medium py-3 rounded-lg shadow-sm">
                View Details
              </button>
            </Link>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full bg-[#2563eb] hover:bg-blue-700 transition-colors text-white text-[13px] font-medium py-3 rounded-lg shadow-sm"
            >
              Send payment request
            </button>
          </div>
        </div>

        {/* File & attachments Card */}
        <div className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-[#f8fafc]">
          <h3 className="font-bold text-gray-900 text-[15px] mb-4">File & attachments</h3>

          {/* By Patient */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2.5">
              <p className="text-[11px] font-medium text-gray-600">by {patient.name}:</p>
              <p className="text-[11px] text-gray-400 font-medium">12 May, 26</p>
            </div>
            <div className="space-y-1.5">
              {["previous_report.pdf", "belly_fat.jpg"].map((file) => (
                <div key={file} className="flex items-center justify-between py-1 px-1 rounded hover:bg-[#e2e8f0] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-[#2563eb] flex-shrink-0" />
                    <span className="text-xs text-gray-600 group-hover:text-gray-900 truncate">{file}</span>
                  </div>
                  <button className="text-[#2563eb] transition-colors flex-shrink-0 p-1">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* By Doctor */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <p className="text-[11px] font-medium text-gray-600">by you:</p>
              <p className="text-[11px] text-gray-400 font-medium">12 May, 26</p>
            </div>
            <div className="space-y-1.5">
              {["diet_chart.pdf", "medicine_pres.pdf"].map((file) => (
                <div key={file} className="flex items-center justify-between py-1 px-1 rounded hover:bg-[#e2e8f0] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-[#2563eb] flex-shrink-0" />
                    <span className="text-xs text-gray-600 group-hover:text-gray-900 truncate">{file}</span>
                  </div>
                  <button className="text-[#2563eb] transition-colors flex-shrink-0 p-1">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Request Modal */}
      <PaymentRequestModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        patientName={patient.name}
      />
    </div>
    </>
  );
}
