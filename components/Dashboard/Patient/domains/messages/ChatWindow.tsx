'use client';

import React, { useState } from 'react';
import { ArrowLeft, Send, FileText, Download, Check, X, ShieldAlert } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  senderName: string;
  avatar: string;
  message: string;
  time: string;
  isProposal?: boolean;
}

interface AttachedFile {
  name: string;
  size: string;
}

interface ChatWindowProps {
  chatId: string;
  onBack: () => void;
  onTriggerPayment: () => void;
}

export default function ChatWindow({ chatId, onBack, onTriggerPayment }: ChatWindowProps) {
  const [typedMessage, setTypedMessage] = useState('');
  
  // Custom mock conversation matching screen 2
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'doctor',
      senderName: 'Dr. Runa Pradhan NP',
      avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop',
      message: "Hello, I'm Dr. Runa Pradhan. I am delighted to assist you with your weight loss journey. I have reviewed your medical history, and everything looks excellent. Let's start with a custom schedule.",
      time: '10:04 AM',
    },
    {
      id: 'm2',
      sender: 'patient',
      senderName: 'Alan Catrech',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      message: 'Great, thank you! How will the consultation flow, and what medications do you recommend for my GLP-1 weight program?',
      time: '10:07 AM',
    },
    {
      id: 'm3',
      sender: 'doctor',
      senderName: 'Dr. Runa Pradhan NP',
      avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop',
      message: "That's a great question. We will review the consultation elements, select the correct GLP-1 dosage, and perform weekly check-ins. Our treatment covers complete medical support throughout your cycle.",
      time: '10:09 AM',
    },
    {
      id: 'm4',
      sender: 'patient',
      senderName: 'Alan Catrech',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      message: 'Understood. Please send me the medical proposal and invoices so I can review details and complete the initial checkout.',
      time: '10:11 AM',
    },
    {
      id: 'm5',
      sender: 'doctor',
      senderName: 'Dr. Runa Pradhan NP',
      avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop',
      message: "Sure! I'm sending the medical proposal over now. Please review the services and pricing structure below. Let me know if you have any questions.",
      time: '10:12 AM',
    },
    {
      id: 'm6',
      sender: 'doctor',
      senderName: 'Dr. Runa Pradhan NP',
      avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop',
      message: 'PROPOSAL_CARD_TOKEN', // Token indicating proposal card renders here
      time: '10:12 AM',
      isProposal: true
    }
  ]);

  const attachments: AttachedFile[] = [
    { name: 'prescription_weight.pdf', size: '240 KB' },
    { name: 'diet_plan.pdf', size: '1.2 MB' },
    { name: 'vitamins_protocol.pdf', size: '350 KB' },
  ];

  const handleSend = () => {
    if (!typedMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: `m-new-${Date.now()}`,
      sender: 'patient',
      senderName: 'Alan Catrech',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      message: typedMessage,
      time: 'Just now',
    };
    setMessages([...messages, newMsg]);
    setTypedMessage('');
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Thread back navigation */}
      <div className="flex items-center gap-2 text-gray-800 font-sans">
        <button 
          onClick={onBack}
          className="p-1 hover:bg-gray-150 rounded-lg transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-gray-800" />
        </button>
        <span className="text-base font-semibold tracking-tight text-gray-900">
          Weight Loss
        </span>
      </div>

      {/* Main Grid: Chat & Sidebar Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* Left Column: Live Chat Board */}
        <div className="lg:col-span-8 bg-white border border-gray-150 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col h-[700px]">
          
          {/* Active Doctor Header banner */}
          <div className="bg-[#2563eb] px-6 py-4 flex items-center gap-3 text-white">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-emerald-50">
              <img
                src="https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop"
                alt="Dr. Runa Pradhan NP"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight">Dr. Runa Pradhan NP</h4>
              <p className="text-[11px] text-blue-100 font-light mt-0.5 leading-none">
                Licensed Prescription Advisor &bull; Online
              </p>
            </div>
          </div>

          {/* Bubbles Conversation Streams */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {messages.map((msg) => {
              const isMe = msg.sender === 'patient';
              
              if (msg.isProposal) {
                return (
                  <div key={msg.id} className="flex gap-3 max-w-[85%] animate-in slide-in-from-bottom-2 duration-200">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white border border-gray-100">
                      <img src={msg.avatar} className="object-cover w-full h-full" />
                    </div>
                    
                    {/* Proposal Card */}
                    <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-sm flex flex-col gap-4">
                      <div className="flex flex-col gap-1 border-b border-gray-50 pb-3">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded self-start uppercase tracking-wide">
                          Medical Proposal
                        </span>
                        <h5 className="text-base font-bold text-gray-900 mt-1 leading-snug">
                          Personalized Weight Loss Consultation
                        </h5>
                      </div>
                      
                      <p className="text-xs text-gray-500 leading-relaxed font-light">
                        A comprehensive weight management program with Dr. Runa Pradhan, including GLP-1 consultation approval, prescription setup, and monthly tracking details.
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-xs font-medium text-gray-600">
                        <div>
                          <p className="text-gray-400 text-[10px] uppercase font-light leading-none">Proposal Category</p>
                          <p className="text-gray-800 mt-1">Weight Loss Program</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-[10px] uppercase font-light leading-none">Scheduled Date</p>
                          <p className="text-gray-800 mt-1">Jun 28, 2026</p>
                        </div>
                      </div>

                      <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100/50 flex justify-between items-center text-sm font-bold">
                        <span className="text-gray-600">Total Price</span>
                        <span className="text-blue-600 text-lg">$148.00</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={onTriggerPayment}
                          className="flex-1 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold rounded-xl text-xs shadow-sm hover:shadow transition-all text-center flex items-center justify-center gap-1.5"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Accept Proposal</span>
                        </button>
                        <button className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 font-semibold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1.5">
                          <X className="h-3.5 w-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex gap-3 max-w-[75%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                  {/* Bubble Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white border border-gray-100 shadow-sm">
                    <img src={msg.avatar} alt={msg.senderName} className="object-cover w-full h-full" />
                  </div>

                  {/* Bubble content */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-gray-400 pl-1 leading-none">{msg.senderName}</span>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm font-light ${
                      isMe 
                        ? 'bg-[#eff6ff] text-gray-800 rounded-tr-none' 
                        : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                    }`}>
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-gray-300 text-right pr-2 leading-none mt-0.5">{msg.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input controls */}
          <div className="bg-white border-t border-gray-150 p-4 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-50 border border-gray-150 rounded-[14px] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400 focus:bg-white transition-all shadow-inner"
            />
            <button 
              onClick={handleSend}
              className="w-11 h-11 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-[14px] flex items-center justify-center hover:shadow active:scale-95 transition-all flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>

        {/* Right Column: Files & Attachments Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Attachments Section */}
          <div className="bg-white rounded-3xl border border-gray-150 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <div>
              <h4 className="text-[15px] font-bold text-gray-900">Files & Attachments</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 font-light">Shared document attachments</p>
            </div>

            <div className="flex flex-col gap-3">
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl border border-gray-100 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center flex-shrink-0 border border-rose-100">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate leading-snug">{file.name}</p>
                      <p className="text-[10px] text-gray-400 leading-none mt-0.5">{file.size}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-800 rounded-lg transition-all">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all text-center mt-2 shadow-sm">
              View Details
            </button>

            <button className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-sm">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Close This Consultation</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
