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

    // Format relative time
    const timeAgo = (() => {
      const dateString = thread.updatedAt || thread.createdAt;
      if (!dateString) return '';
      const diffInSeconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
      if (diffInSeconds < 60) return 'just now';
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) return `${diffInDays}d ago`;
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    })();

    return (
      <button
        key={thread.id}
        onClick={() => onSelectChat(thread.id)}
        className={`w-full flex items-center gap-[12px] p-3 rounded-xl text-left transition-all duration-150 group ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}`}
      >
        <div className="relative flex-shrink-0">
          <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden border border-white/20 bg-white">
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

        <div className="min-w-0 flex-1 flex flex-col justify-center gap-[4px]">
          <div className="flex justify-between items-center w-full">
            <h4 className="font-[Quicksand] text-[20px] font-semibold leading-[100%] text-white truncate pr-2">
              {doctor?.name || 'Unknown Provider'}
            </h4>
            <span className="font-[Quicksand] text-[14px] font-normal leading-[100%] text-white text-center whitespace-nowrap">
              {timeAgo}
            </span>
          </div>
          <p className="font-[Quicksand] text-[14px] font-normal leading-[100%] text-white truncate">
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
        className="flex flex-col items-start self-stretch shrink-0 w-full lg:w-[350px]"
        style={{
          padding: '16px',
          gap: '16px',
          borderRadius: '16px',
          background: 'var(--Blue, #1D4ED8)',
          height: '700px'
        }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-[10px] w-full h-[50px] px-[14px] py-[8px] rounded-[10px] bg-white/20 mb-[16px] flex-shrink-0">
          <Search className="w-4 h-4 text-white flex-shrink-0" strokeWidth={1} />
          <input
            type="text"
            placeholder="Search.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[16px] font-[Quicksand] text-white placeholder-white/70 focus:outline-none"
          />
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-white/70 text-sm w-full">Loading...</div>
        ) : (
          <div className="w-full flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {/* ACTIVE SERVICE */}
            {activeConversations.length > 0 && (
              <div className="flex flex-col w-full">
                <h4 
                  className="mb-[16px]"
                  style={{
                    color: 'var(--White, #FFF)',
                    fontFamily: 'Quicksand',
                    fontSize: '18px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '100%',
                    textTransform: 'uppercase'
                  }}
                >
                  ACTIVE SERVICE
                </h4>
                <div className="flex flex-col w-full gap-[16px]">
                  {activeConversations.map(renderThread)}
                </div>
              </div>
            )}

            {/* PAUSED SERVICE */}
            {pausedConversations.length > 0 && (
              <div className="w-full flex flex-col mt-[16px]">
                <h4 
                  className="mb-[16px]"
                  style={{
                    color: 'var(--White, #FFF)',
                    fontFamily: 'Quicksand',
                    fontSize: '18px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '100%',
                    textTransform: 'uppercase'
                  }}
                >
                  PAUSED SERVICE
                </h4>
                <div className="flex flex-col w-full gap-[16px]">
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
