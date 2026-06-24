"use client";

import Image from "next/image";
import { Search, MoreHorizontal, User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetConversationsQuery } from "@/Redux/api/messageApi";
import { useSocket } from "@/providers/SocketProvider";

export default function MessagesPanel() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetConversationsQuery({ search });
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
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-5">Messages</h2>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 caret-[#2563eb] bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-colors"
        />
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Patients:</p>

      <div className="divide-y divide-gray-100">
        {isLoading ? (
          <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
        ) : conversations.length > 0 ? (
          conversations.map((thread) => {
            const patient = thread.patient || {};
            const isOnline = thread.isPatientOnline;
            
            return (
              <div key={thread.id} className="flex items-center gap-4 py-4 hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors group">
                <Link
                  href={`/doctor?view=messages&chatId=${thread.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
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
                      <span className="absolute bottom-0.5 right-0.5 block h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{patient?.name || 'Unknown Patient'}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {thread.service.name}
                      {thread.submission && (
                        <>
                          <span className="mx-1 text-gray-300">·</span>
                          Consultation id: {thread.submission.submissionCode}
                        </>
                      )}
                    </p>
                  </div>
                </Link>
                <button className="text-gray-400 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No patients found.</p>
        )}
      </div>
    </div>
  );
}
