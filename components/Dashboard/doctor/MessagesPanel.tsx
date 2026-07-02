"use client";

import Image from "next/image";
import { Search, MoreHorizontal, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetConversationsQuery } from "@/Redux/api/messageApi";
import { useSocket } from "@/providers/SocketProvider";

export default function MessagesPanel() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetConversationsQuery({ search });
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<any[]>([]);

  const searchParams = useSearchParams();
  const activeChatId = searchParams.get('chatId');
  const router = useRouter();
  const hasAutoSelected = useRef(false);

  useEffect(() => {
    if (data?.data && data.data.length > 0 && !activeChatId && !hasAutoSelected.current) {
      router.replace(`/doctor?view=messages&chatId=${data.data[0].id}`);
      hasAutoSelected.current = true;
    }
  }, [data, activeChatId, router]);

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
      {/* <div className="flex items-center gap-2 text-gray-900 font-sans px-1 h-[26px]">
        <h3 className="text-xl font-bold leading-none">Messages</h3>
      </div> */}

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
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 group ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white">
                          {patient?.avatar ? (
                            <img
                              src={patient.avatar}
                              alt={patient.name || 'Patient'}
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
                            {patient?.name || 'Unknown Patient'}
                          </h4>
                        </div>
                        <p className="text-[11px] text-white/80 mt-0.5 truncate font-light">
                          {thread.service?.name || 'Service'}
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
