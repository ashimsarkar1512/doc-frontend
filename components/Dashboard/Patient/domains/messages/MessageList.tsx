'use client';

import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

interface ChatThread {
  id: string;
  doctorName: string;
  category: string;
  consultationId: string;
  avatar: string;
  isActive: boolean;
}

const mockThreads: ChatThread[] = [
  {
    id: 'chat-1',
    doctorName: 'Dr. Jeffrey Richter MD',
    category: 'Weight Loss',
    consultationId: '#001256',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop',
    isActive: true,
  },
  {
    id: 'chat-2',
    doctorName: 'Dr. Runa Pradhan NP',
    category: 'Individual Therapy',
    consultationId: '#001257',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop',
    isActive: true,
  },
  {
    id: 'chat-3',
    doctorName: 'Dr. Nicole Sheeder NP',
    category: 'Anxiety & Stress',
    consultationId: '#001258',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop',
    isActive: false,
  },
];

interface MessageListProps {
  onSelectChat: (id: string) => void;
}

export default function MessageList({ onSelectChat }: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = mockThreads.filter((t) =>
    t.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 leading-none">Messages</h3>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-150 rounded-[14px] text-sm text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400 shadow-sm shadow-black/5"
        />
      </div>

      {/* Message Chat List */}
      <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col divide-y divide-gray-100">
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => onSelectChat(thread.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 text-left transition-all duration-150 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Avatar with indicator */}
                <div className="relative flex-shrink-0">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-emerald-50">
                    <img
                      src={thread.avatar}
                      alt={thread.doctorName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {thread.isActive && (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {thread.doctorName}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 font-light flex flex-wrap items-center gap-1.5 leading-none">
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px]">
                      {thread.category}
                    </span>
                    <span>&bull;</span>
                    <span>Consultation id: {thread.consultationId}</span>
                  </p>
                </div>
              </div>

              {/* Right Chevron */}
              <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          ))
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            No active message threads found.
          </div>
        )}
      </div>
    </div>
  );
}
