import { TabType } from '@/types/patientTypes';
import React from 'react';


interface TabBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  approvedCount: number;
  pendingCount: number;
  declinedCount: number;
}

export default function TabBar({
  activeTab,
  onChangeTab,
  approvedCount,
  pendingCount,
  declinedCount
}: TabBarProps) {
  const tabs = [
    { type: 'Approved' as TabType, label: 'Approved Consultation', count: approvedCount, badgeColor: 'bg-[#10b981]' },
    { type: 'Pending' as TabType, label: 'Pending', count: pendingCount, badgeColor: 'bg-[#f59e0b]' },
    { type: 'Declined' as TabType, label: 'Declined', count: declinedCount, badgeColor: 'bg-[#ef4444]' },
    { type: 'History' as TabType, label: 'History', count: null, badgeColor: '' }
  ];

  return (
    <div className="flex items-center gap-6 md:gap-8 border-b border-gray-150 mb-8 overflow-x-auto select-none scrollbar-none">
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
