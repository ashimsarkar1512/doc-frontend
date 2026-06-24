'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, User } from 'lucide-react';
import { useGetConversationsQuery } from '@/Redux/api/messageApi';
import { useSocket } from '@/providers/SocketProvider';

interface MessageListProps {
  onSelectChat: (id: string) => void;
}

export default function MessageList({ onSelectChat }: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useGetConversationsQuery({ search: searchQuery });
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<any[]>([]);

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
          placeholder="Search by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-150 rounded-[14px] text-sm text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400 shadow-sm shadow-black/5"
        />
      </div>

      {/* Message Chat List */}
      <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading conversations...</div>
        ) : conversations.length > 0 ? (
          conversations.map((thread) => {
            const isOnline = thread.isProviderOnline; // For patient view, we care about doctor's status
            const doctor = thread.provider || {};
            
            return (
              <button
                key={thread.id}
                onClick={() => onSelectChat(thread.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 text-left transition-all duration-150 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Avatar with indicator */}
                  <div className="relative flex-shrink-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-emerald-50">
                      {doctor?.avatar ? (
                        <img
                          src={doctor.avatar}
                          alt={doctor.name || 'Provider'}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                          <User className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {doctor?.name || 'Unknown Provider'}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 font-light flex flex-wrap items-center gap-1.5 leading-none">
                      <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px]">
                        {thread.service.name}
                      </span>
                      {thread.submission && (
                        <>
                          <span>&bull;</span>
                          <span>{thread.submission.submissionCode}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right Chevron */}
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            No active message threads found.
          </div>
        )}
      </div>
    </div>
  );
}
