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
    { type: 'ACCEPTED' as TabType, label: 'Approved Consultation', count: counts.ACCEPTED || 0, badgeColor: 'bg-[#10b981]' },
    { type: 'PENDING' as TabType, label: 'Pending', count: counts.PENDING || 0, badgeColor: 'bg-[#eab308]' },
    { type: 'REFIL_REQUESTED' as TabType, label: 'Refill Required', count: counts.REFIL_REQUESTED || 0, badgeColor: 'bg-[#ef4444]' },
    { type: 'REJECTED' as TabType, label: 'Declined', count: counts.REJECTED || 0, badgeColor: 'bg-[#ef4444]' },
    { type: 'My Orders' as TabType, label: 'My Order', count: totalOrders, badgeColor: 'bg-[#2563eb]' }
  ];

  return (
    <div className="flex items-center gap-[20px] border-b border-[#E5E7EB] mb-2 overflow-x-auto select-none scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.type;
        return (
          <button
            key={tab.type}
            onClick={() => onChangeTab(tab.type)}
            className={`
              pb-[8px] text-[16px] md:text-[20px] font-[Quicksand] leading-[150%] font-medium flex items-center gap-2 whitespace-nowrap transition-all duration-150 border-b-2
              ${isActive
                ? 'text-[#2558E5] border-[#2558E5]'
                : 'text-[#272628] border-transparent hover:text-black'}
            `}
          >
            <span>{tab.label}</span>
            {tab.count !== null && tab.count > 0 && (
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
