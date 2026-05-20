import React from 'react';
import { Home, FolderOpen, Bell, Settings, Plus } from 'lucide-react';

interface ActionBarProps {
  onRequestNewConsultation?: () => void;
}

export default function ActionBar({ onRequestNewConsultation }: ActionBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4">
      {/* Left side: Rounded Square Action Controls */}
      <div className="flex items-center gap-3">
        {/* Active Home Control */}
        <button 
          aria-label="Home"
          className="w-11 h-11 bg-[#2563eb] text-white rounded-[14px] flex items-center justify-center shadow-md shadow-blue-500/10 hover:bg-[#1d4ed8] active:scale-95 transition-all duration-150"
        >
          <Home className="h-5 w-5" />
        </button>

        {/* Documents/Files Control */}
        <button 
          aria-label="Folders"
          className="w-11 h-11 bg-[#eff6ff] text-[#2563eb] rounded-[14px] flex items-center justify-center hover:bg-[#dbeafe] active:scale-95 transition-all duration-150"
        >
          <FolderOpen className="h-5 w-5" />
        </button>

        {/* Notifications Control */}
        <button 
          aria-label="Notifications"
          className="w-11 h-11 bg-[#eff6ff] text-[#2563eb] rounded-[14px] flex items-center justify-center hover:bg-[#dbeafe] active:scale-95 transition-all duration-150"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* Settings Control */}
        <button 
          aria-label="Settings"
          className="w-11 h-11 bg-[#eff6ff] text-[#2563eb] rounded-[14px] flex items-center justify-center hover:bg-[#dbeafe] active:scale-95 transition-all duration-150"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Right side: Request New Consultation Action */}
      <button 
        onClick={onRequestNewConsultation}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold rounded-2xl shadow-sm text-[14px] transition-all duration-150 active:scale-[0.98] tracking-wide"
      >
        <span>Request New Consultation</span>
        <Plus className="h-4.5 w-4.5 bg-white/20 rounded-full p-0.5" />
      </button>
    </div>
  );
}
