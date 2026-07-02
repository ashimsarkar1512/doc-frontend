import { TabType } from '@/types/patientTypes';
import React from 'react';


interface TabBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  counts: {
    DRAFT?: number;
    PENDING?: number;
    REVIEWED?: number;
    ACCEPTED?: number;
    REFIL_REQUESTED?: number;
    REJECTED?: number;
  };
  totalOrders?: number;
}

export default function TabBar({
  activeTab,
  onChangeTab,
  counts,
  totalOrders = 0
}: TabBarProps) {
  const tabs = [

    { type: 'PENDING' as TabType, label: 'Pending', count: counts.PENDING || 0, badgeColor: 'bg-[#f59e0b]' },
    { type: 'REVIEWED' as TabType, label: 'Reviewed', count: counts.REVIEWED || 0, badgeColor: 'bg-[#3b82f6]' },
    { type: 'ACCEPTED' as TabType, label: 'Accepted', count: counts.ACCEPTED || 0, badgeColor: 'bg-[#10b981]' },
    { type: 'REFIL_REQUESTED' as TabType, label: 'Refill Requested', count: counts.REFIL_REQUESTED || 0, badgeColor: 'bg-[#8b5cf6]' },
    { type: 'REJECTED' as TabType, label: 'Rejected', count: counts.REJECTED || 0, badgeColor: 'bg-[#ef4444]' },
    { type: 'My Orders' as TabType, label: 'My Orders', count: totalOrders, badgeColor: 'bg-[#2563eb]' }
  ];

  return (
    <div className="flex items-center gap-6 md:gap-8 border-b border-gray-150 mb-2 overflow-x-auto select-none scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.type;
        return (
          <button
            key={tab.type}
            onClick={() => onChangeTab(tab.type)}
            className={`
              pb-4 text-[15px] font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-150 border-b-2
              ${isActive
                ? 'text-[#2563eb] border-[#2563eb]'
                : 'text-gray-500 border-transparent hover:text-gray-800'}
            `}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${tab.badgeColor}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
