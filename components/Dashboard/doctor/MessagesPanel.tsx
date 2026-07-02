"use client";

import Image from "next/image";
import { Search, MoreHorizontal, User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetConversationsQuery } from "@/Redux/api/messageApi";
import { useSocket } from "@/providers/SocketProvider";

export default function MessagesPanel() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetConversationsQuery({ search });
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<any[]>([]);

  const searchParams = useSearchParams();
  const activeChatId = searchParams.get('chatId');

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
    <div className="w-full flex flex-col gap-4 animate-in fade-in duration-200 h-full">
      {/* Title */}
      <div className="flex items-center gap-2 text-gray-900 font-sans px-1 h-[26px]">
        <h3 className="text-xl font-bold leading-none">Messages</h3>
      </div>

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
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-[10px] text-sm text-white placeholder-white/70 focus:outline-none focus:bg-white/20 transition-all shadow-none"
          />
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-white/70 text-sm w-full">Loading...</div>
        ) : (
          <div className="w-full flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {conversations.length > 0 && (
              <div className="w-full flex flex-col gap-2">
                <h4 className="text-[11px] font-semibold text-white/70 tracking-widest uppercase px-2">
                  ACTIVE PATIENTS
                </h4>
                {conversations.map((thread) => {
                  const patient = thread.patient || {};
                  const isOnline = thread.isPatientOnline;
                  const isSelected = activeChatId === thread.id;
                  
                  return (
                    <Link
                      key={thread.id}
                      href={`/doctor?view=messages&chatId=${thread.id}`}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all border w-full ${
                        isSelected 
                          ? 'bg-white/20 border-white/20 shadow-sm' 
                          : 'hover:bg-white/10 border-transparent'
                      }`}
                    >
                      <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                        {patient?.avatar ? (
                          <Image
                            src={patient.avatar}
                            alt={patient.name || 'Patient'}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        {isOnline && (
                          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#1D4ED8]"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-semibold text-white truncate max-w-[140px]">
                            {patient?.name || 'Unknown Patient'}
                          </h4>
                        </div>
                        <p className="text-[11px] text-white/70 truncate">
                          {thread.service.name}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            {conversations.length === 0 && (
              <p className="text-sm text-white/70 text-center py-8 w-full">No patients found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
