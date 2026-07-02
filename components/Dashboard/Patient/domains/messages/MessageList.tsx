'use client';

import React, { useState, useEffect } from 'react';
import { Search, User, ArrowLeft } from 'lucide-react';
import { useGetConversationsQuery } from '@/Redux/api/messageApi';
import { useSocket } from '@/providers/SocketProvider';

interface MessageListProps {
  onSelectChat: (id: string) => void;
  selectedChatId?: string | null;
  onBack?: () => void;
}

export default function MessageList({ onSelectChat, selectedChatId, onBack }: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useGetConversationsQuery({ search: searchQuery });
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<any[]>([]);
  const hasAutoSelected = React.useRef(false);

  useEffect(() => {
    if (data?.data && data.data.length > 0 && !selectedChatId && !hasAutoSelected.current) {
      onSelectChat(data.data[0].id);
      hasAutoSelected.current = true;
    }
  }, [data, selectedChatId, onSelectChat]);

  useEffect(() => {
    if (data?.data) {
      setConversations(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = ({ userId }: { userId: string }) => {
      setConversations(prev => prev.map(conv => {
        if (conv.patientId === userId) return { ...conv, isPatientOnline: true };
        if (conv.providerId === userId) return { ...conv, isProviderOnline: true };
        return conv;
      }));
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      setConversations(prev => prev.map(conv => {
        if (conv.patientId === userId) return { ...conv, isPatientOnline: false };
        if (conv.providerId === userId) return { ...conv, isProviderOnline: false };
        return conv;
      }));
    };

    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);

    return () => {
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
    };
  }, [socket]);

  // Temporary split: Assume all are active unless they have a specific paused status.
  // We'll use service status if it exists, otherwise put all in active for now.
  const activeConversations = conversations.filter(c => c.status !== 'PAUSED');
  const pausedConversations = conversations.filter(c => c.status === 'PAUSED');

  const renderThread = (thread: any) => {
    const isOnline = thread.isProviderOnline;
    const doctor = thread.provider || {};
    const isSelected = selectedChatId === thread.id;

    // Format relative time (mock logic for "10m ago" etc)
    const timeAgo = (() => {
      if (!thread.updatedAt) return '';
      const diff = (Date.now() - new Date(thread.updatedAt).getTime()) / 60000;
      if (diff < 1) return 'just now';
      if (diff < 60) return `${Math.floor(diff)}m ago`;
      if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
      return `${Math.floor(diff / 1440)}d ago`;
    })();

    return (
      <button
        key={thread.id}
        onClick={() => onSelectChat(thread.id)}
        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 group ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}`}
      >
        <div className="relative flex-shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white">
            {doctor?.avatar ? (
              <img
                src={doctor.avatar}
                alt={doctor.name || 'Provider'}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-[#1D4ED8]">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#1D4ED8]"></span>
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-center w-full">
            <h4 className="text-sm font-bold text-white truncate pr-2">
              {doctor?.name || 'Unknown Provider'}
            </h4>
            <span className="text-[10px] text-white/60 whitespace-nowrap">
              {timeAgo}
            </span>
          </div>
          <p className="text-[11px] text-white/80 mt-0.5 truncate font-light">
            {thread.service?.name} - CID: #{thread.submission?.submissionCode || '001236'}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-in fade-in duration-200 h-full">


      {/* Blue Sidebar Box */}
      <div
        className="flex flex-col items-start self-stretch shrink-0"
        style={{
          width: '350px',
          padding: '16px',
          gap: '16px',
          borderRadius: '16px',
          background: 'var(--Blue, #1D4ED8)',
          height: '700px'
        }}
      >
        {/* Search Input */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-white/70" />
          </span>
          <input
            type="text"
            placeholder="Search.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-[10px] text-sm text-white placeholder-white/70 focus:outline-none focus:bg-white/20 transition-all shadow-none"
          />
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-white/70 text-sm w-full">Loading...</div>
        ) : (
          <div className="w-full flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {/* ACTIVE SERVICE */}
            {activeConversations.length > 0 && (
              <div className="w-full flex flex-col gap-2">
                <h4 className="text-[11px] font-semibold text-white/70 tracking-widest uppercase px-2">
                  ACTIVE SERVICE
                </h4>
                <div className="flex flex-col w-full gap-1">
                  {activeConversations.map(renderThread)}
                </div>
              </div>
            )}

            {/* PAUSED SERVICE */}
            {pausedConversations.length > 0 && (
              <div className="w-full flex flex-col gap-2">
                <h4 className="text-[11px] font-semibold text-white/70 tracking-widest uppercase px-2 mt-2 border-t border-white/10 pt-4">
                  PAUSED SERVICE
                </h4>
                <div className="flex flex-col w-full gap-1">
                  {pausedConversations.map(renderThread)}
                </div>
              </div>
            )}

            {conversations.length === 0 && (
              <div className="p-4 text-center text-white/60 text-sm w-full">
                No active message threads found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
