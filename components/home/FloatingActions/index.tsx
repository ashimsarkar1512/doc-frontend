"use client";

import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import ChatBotModal from './ChatBotModal';
import AppointmentModal from './AppointmentModal';
import ChatBotIcon from '@/components/ui/ChatBotIcon';

export type FloatingAction = {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  bgColor: string;
  textColor: string;
};

export const FloatingActions = () => {
  const [activeModal, setActiveModal] = useState<'chat' | 'calendar' | null>(null);

  const actions: FloatingAction[] = [
  {
  id: 'chat',
  icon: <ChatBotIcon width={28} height={28} />,
  label: 'Chat',
  onClick: () => setActiveModal(activeModal === 'chat' ? null : 'chat'),
  bgColor: 'bg-[#2563EB]',
  textColor: 'text-white'
},
    {
      id: 'calendar',
      icon: <CalendarDays size={22} strokeWidth={2.5} />,
      label: 'Calendar',
      onClick: () => setActiveModal(activeModal === 'calendar' ? null : 'calendar'),
      bgColor: 'bg-[#F97316]', // Orange
      textColor: 'text-white'
    }
  ];

  return (
    <>
      {/* Modals are rendered here so they overlay the whole screen when active */}
      <ChatBotModal isOpen={activeModal === 'chat'} onClose={() => setActiveModal(null)} />
      <AppointmentModal isOpen={activeModal === 'calendar'} onClose={() => setActiveModal(null)} />

      {/* Floating Buttons Container */}
      <div className="absolute bottom-6 right-6 z-40">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-full flex flex-col gap-3 shadow-2xl">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`${action.bgColor} ${action.textColor} w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95`}
              aria-label={action.label}
              title={action.label}
            >
              {action.icon}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default FloatingActions;
