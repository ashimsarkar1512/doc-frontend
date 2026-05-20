'use client';

import React from 'react';
import { Bell, CheckCircle, AlertCircle, FileText, Gift, HelpCircle } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'message' | 'approved' | 'declined' | 'attachment' | 'proposal';
  avatar?: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description?: string;
  time: string;
}

const todayNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'message',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'New message from Dr. Runa Pradhan NP',
    description: 'Dr. Runa has sent you messages. Please open your consultations.',
    time: '2h ago',
  },
  {
    id: 'notif-2',
    type: 'approved',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Assessment Approved',
    description: 'Your Weight Loss / GLP-1 Assessment has been approved by doctor.',
    time: '1d ago',
  },
];

const thisWeekNotifications: NotificationItem[] = [
  {
    id: 'notif-3',
    type: 'declined',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    title: 'Assessment Declined',
    description: 'Your Acne Treatment Assessment was declined due to eligibility factors.',
    time: '3 days ago',
  },
  {
    id: 'notif-4',
    type: 'attachment',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'New Attachment from Dr. Mark Torres',
    description: 'Attached vitamins_protocol.pdf to your file.',
    time: '4 days ago',
  },
  {
    id: 'notif-5',
    type: 'approved',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Assessment Approved',
    description: 'Your Individual Therapy session was approved by advisor.',
    time: '5 days ago',
  },
  {
    id: 'notif-6',
    type: 'proposal',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'New consultation proposal',
    description: 'Dr. Jeffrey Richter sent customized consultation proposals.',
    time: '6 days ago',
  },
];

export default function NotificationCenter() {
  const renderIcon = (item: NotificationItem) => {
    if (item.avatar) {
      return (
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
          <img src={item.avatar} alt="Sender" className="object-cover w-full h-full" />
        </div>
      );
    }

    const icons = {
      approved: <CheckCircle className={`h-5 w-5 ${item.iconColor}`} />,
      declined: <AlertCircle className={`h-5 w-5 ${item.iconColor}`} />,
      proposal: <FileText className={`h-5 w-5 ${item.iconColor}`} />,
      attachment: <FileText className={`h-5 w-5 ${item.iconColor}`} />,
      message: <Bell className={`h-5 w-5 ${item.iconColor}`} />
    };

    return (
      <div className={`p-2.5 rounded-full ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
        {icons[item.type] || <HelpCircle className={`h-5 w-5 ${item.iconColor}`} />}
      </div>
    );
  };

  const renderSection = (title: string, list: NotificationItem[]) => (
    <div className="flex flex-col gap-3">
      <span className="text-[12px] font-semibold text-gray-400 pl-1 uppercase tracking-wider">
        {title}
      </span>
      <div className="flex flex-col gap-3">
        {list.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between p-4 bg-white border border-gray-150 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-blue-100 transition-all duration-200"
          >
            <div className="flex items-start gap-4 min-w-0">
              {renderIcon(item)}
              <div className="min-w-0 mt-0.5">
                <h4 className="text-sm font-bold text-gray-900 leading-snug">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-gray-400 font-light mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
            
            <span className="text-[11px] text-gray-400 leading-none whitespace-nowrap pl-4 mt-1 font-light">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 leading-none">Notifications</h3>
      </div>

      {/* Sections List */}
      <div className="flex flex-col gap-6 mb-12">
        {renderSection('Today', todayNotifications)}
        {renderSection('This Week', thisWeekNotifications)}
      </div>

    </div>
  );
}
