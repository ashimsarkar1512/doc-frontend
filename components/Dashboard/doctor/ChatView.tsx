"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Paperclip, Send, Download, FileText, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import PaymentRequestModal from "@/components/Dashboard/doctor/PaymentRequestModal";

const patientData: Record<string, { name: string; category: string; consultationId: string; image: string }> = {
  "001236": { name: "Alan Cattach", category: "Weight Loss", consultationId: "#001236", image: "/doctor/doc-1.png" },
  "001237": { name: "Jane Cooper", category: "Individual Therapy", consultationId: "#001237", image: "/doctor/doc-2.png" },
  "001238": { name: "Albert Flores", category: "Anxiety & Stress", consultationId: "#001238", image: "/doctor/doc-3.png" },
  "001239": { name: "Kristin Watson", category: "Clarity Consult", consultationId: "#001239", image: "/doctor/doc-4.png" },
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
    <div className="flex gap-6 mb-10">
      {/* Chat Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Back Link */}
        <Link
          href="/doctor?view=messages"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4 hover:text-blue-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Weight Loss
        </Link>

        {/* Chat Card */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm h-[600px]">
          {/* Chat Header */}
          <div className="bg-[#2563eb] px-5 py-4 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
              <Image src={patient.image} alt={patient.name} fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{patient.name}</p>
              <p className="text-blue-100 text-xs mt-0.5">
                Patient · Consultation id: {patient.consultationId}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesRef} className="bg-[#f0f4ff] flex-1 px-5 py-5 space-y-5 min-h-[420px] max-h-[520px] overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === "doctor" ? "items-end" : "items-start"}`}>
                {msg.sender === "patient" && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 mb-1.5 flex-shrink-0">
                    <Image src={patient.image} alt={patient.name} fill sizes="32px" className="object-cover" />
                  </div>
                )}

                {msg.proposal ? (
                  <div className="max-w-[78%]">
                    <div className="bg-white rounded-2xl rounded-tr-sm border border-gray-200 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-2 p-3 border-b border-gray-100">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          <Image src="/doctor/profile-doc.png" alt="Dr" fill sizes="24px" className="object-cover" />
                        </div>
                        <p className="text-xs text-gray-500">{msg.text}</p>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 text-sm mb-3">{msg.proposal.title}</h4>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Message:</p>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">{msg.proposal.message}</p>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Proposal Includes:</p>
                        <div className="flex gap-5 text-xs text-gray-600 mb-4">
                          <span>Fees: <strong className="text-blue-600">{msg.proposal.fee}</strong></span>
                          <span>Date: {msg.proposal.date}</span>
                        </div>
                        <button className="border border-gray-300 text-gray-700 text-xs font-medium px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
                          Withdraw proposal
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 text-right">{msg.time}</p>
                  </div>
                ) : (
                  <div className="max-w-[78%]">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.sender === "doctor"
                          ? "bg-white text-gray-800 rounded-tr-sm"
                          : "bg-[#e8edf8] text-gray-800 rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className={`text-xs text-gray-400 mt-1.5 ${msg.sender === "doctor" ? "text-right" : "text-left"}`}>
                      {msg.time}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-[#2563eb] hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-5 py-2 rounded-full flex items-center gap-2 flex-shrink-0 shadow-sm"
            >
              Send <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 mt-10">
        <div className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-white">
          <h3 className="font-bold text-gray-900 text-sm mb-4">File & attachments</h3>

          {/* By Patient */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500">by {patient.name}:</p>
              <p className="text-xs text-gray-400">12 May, 26</p>
            </div>
            <div className="space-y-2">
              {["previous_report.pdf", "belly_fat.jpg"].map((file) => (
                <div key={file} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-blue-600 truncate">{file}</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* By Doctor */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500">by you:</p>
              <p className="text-xs text-gray-400">12 May, 26</p>
            </div>
            <div className="space-y-2">
              {["diet_chart.pdf", "medicine_pres.pdf"].map((file) => (
                <div key={file} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-blue-600 truncate">{file}</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
        <div className="flex flex-col gap-6 mt-auto">
  <Link href={`/doctor?consultationId=${chatId}`} className="w-full">
    <button className="w-full bg-gray-900 hover:bg-gray-800 transition-colors text-white text-sm font-semibold py-3 rounded-xl">
      View Details
    </button>
  </Link>

  <button
    onClick={() => setIsPaymentModalOpen(true)}
    className="w-full bg-[#2563eb] hover:bg-blue-700 transition-colors text-white text-sm font-semibold py-3 rounded-xl"
  >
    Send payment request
  </button>
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
  );
}
