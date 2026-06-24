"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Paperclip, Send, Download, FileText, X, ChevronUp, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import PaymentRequestModal from "@/components/Dashboard/doctor/PaymentRequestModal";
import { useGetMessageHistoryQuery, useGetPublicKeyQuery, useUploadAttachmentMutation } from '@/Redux/api/messageApi';
import { useSocket } from '@/providers/SocketProvider';
import { useE2EE } from '@/Redux/hooks/useE2EE';
import { useAppSelector } from '@/Redux/store/hooks';
import { toast } from 'sonner';

export default function ChatView({ chatId }: { chatId: string }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  
  const { data: historyData, isLoading: historyLoading } = useGetMessageHistoryQuery({ conversationId: chatId, cursor });
  const { socket, isConnected, joinConversation, leaveConversation, sendMessage, emitTyping, emitStopTyping } = useSocket();
  const { decrypt, encrypt } = useE2EE();
  const user = useAppSelector((state) => state.auth.user);
  const [uploadAttachment] = useUploadAttachmentMutation();
  
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const conversation = historyData?.data?.conversation;
  const patient = conversation?.patient;
  const recipientId = user?.id === conversation?.patientId ? conversation?.providerId : conversation?.patientId;

  /**
   * Resolve sender name + avatar for a message.
   * API sometimes returns sender.name = null, so we fall back
   * to the conversation's patient / provider objects which always
   * have the full profile data.
   */
  const getSenderInfo = (msg: any) => {
    const fromConversation =
      msg.senderId === conversation?.patientId
        ? { name: conversation?.patient?.name, avatar: conversation?.patient?.avatar }
        : msg.senderId === conversation?.providerId
        ? { name: conversation?.provider?.name, avatar: conversation?.provider?.avatar }
        : { name: null, avatar: null };

    return {
      name: msg.sender?.name || fromConversation.name || null,
      avatar: msg.sender?.avatar || fromConversation.avatar || null,
    };
  };

  /** Messenger-style date separator label */
  const getDateLabel = (dateStr: string): string => {
    const d = new Date(dateStr);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMsg   = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((startOfToday.getTime() - startOfMsg.getTime()) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7)  return d.toLocaleDateString('en-US', { weekday: 'long' });
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  /** Check if two messages are on different calendar days */
  const isDifferentDay = (a: string, b: string) => {
    const da = new Date(a); const db = new Date(b);
    return da.getFullYear() !== db.getFullYear() ||
           da.getMonth()    !== db.getMonth()    ||
           da.getDate()     !== db.getDate();
  };

  const { data: recipientKeyData } = useGetPublicKeyQuery(recipientId || '', { skip: !recipientId });

  // Join conversation room — retry whenever socket (re)connects
  useEffect(() => {
    if (chatId && isConnected) {
      joinConversation(chatId);
    }
    return () => {
      if (chatId) {
        leaveConversation(chatId);
      }
    };
  }, [chatId, isConnected, joinConversation, leaveConversation]);

  useEffect(() => {
    const decryptHistory = async () => {
      if (!historyData?.data?.messages) return;
      const incoming = historyData.data.messages;
      if (incoming.length < 50) setHasMore(false);
      const decrypted = await Promise.all(
        incoming.map(async (msg: any) => {
          const text = await decrypt(msg);
          return { ...msg, decryptedText: text };
        })
      );
      if (cursor) {
        setMessages(prev => [...decrypted, ...prev]);
      } else {
        setMessages(decrypted);
      }
    };
    decryptHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyData]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (msg: any) => {
      if (msg.conversationId === chatId) {
        const text = await decrypt(msg);
        setMessages((prev) => {
          if (prev.some(m => m.id === msg.id)) return prev;
          const isDuplicate = prev.some(m => m.senderId === msg.senderId && m.decryptedText === text && m.id.startsWith('opt-'));
          if (isDuplicate) {
             return prev.map(m => (m.senderId === msg.senderId && m.decryptedText === text && m.id.startsWith('opt-')) ? { ...msg, decryptedText: text } : m);
          }
          return [...prev, { ...msg, decryptedText: text }];
        });
      }
    };

    const handleTyping = ({ userId, name }: { userId: string; name: string }) => {
      if (userId !== user?.id) {
        setOtherUserTyping(name);
      }
    };

    const handleStopTyping = ({ userId }: { userId: string }) => {
      if (userId !== user?.id) {
        setOtherUserTyping(null);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTyping);
    socket.on('user_stop_typing', handleStopTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTyping);
      socket.off('user_stop_typing', handleStopTyping);
    };
  }, [socket, chatId, decrypt, user]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, otherUserTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || !recipientKeyData?.data?.publicKey) {
      if (!recipientKeyData?.data?.publicKey) toast.error("Recipient public key not found");
      return;
    }

    try {
      const encrypted = await encrypt(inputValue, recipientKeyData.data.publicKey);
      if (!encrypted) {
        toast.error("Encryption failed. Ensure you are on HTTPS or localhost to use WebCrypto.");
        return;
      }
      
      const optimisticMsg = {
          id: `opt-${Date.now()}`,
          conversationId: chatId,
          senderId: user?.id,
          messageType: 'TEXT',
          createdAt: new Date().toISOString(),
          sender: {
            id: user?.id,
            name: user?.profile?.name,
            avatar: user?.profile?.avatar,
          },
          decryptedText: inputValue,
        };
        setMessages((prev) => [...prev, optimisticMsg]);

        sendMessage({
          conversationId: chatId,
          ...encrypted,
          messageType: 'TEXT',
          senderId: user?.id,
        });
        setInputValue("");
        emitStopTyping(chatId);
    } catch (error) {
      toast.error("Failed to encrypt message");
    }
  };

  const handleLoadMore = () => {
    if (messages.length > 0) setCursor(messages[0].id);
  };

  const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      emitTyping(chatId);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      emitStopTyping(chatId);
    }, 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !recipientKeyData?.data?.publicKey) return;

    const formData = new FormData();
    formData.append('files', file);
    formData.append('context', 'CHAT_MESSAGE');

    try {
      const uploadRes = await uploadAttachment(formData).unwrap();
      const attachmentId = uploadRes.data.id;
      
      const encrypted = await encrypt(`Sent an attachment: ${file.name}`, recipientKeyData.data.publicKey);
      if (encrypted) {
        sendMessage({
          conversationId: chatId,
          ...encrypted,
          messageType: 'ATTACHMENT',
          attachmentId,
          senderId: user?.id,
        });
      }
    } catch (error) {
      toast.error("File upload failed");
    }
    e.target.value = '';
  };

  if (historyLoading) return <div className="p-8 text-center">Loading conversation...</div>;
  if (!patient) return <div className="p-8 text-center text-gray-400">Patient not found.</div>;

  return (
    <>
      <Link
        href="/doctor?view=messages"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 mb-5 hover:text-blue-600 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        {conversation?.service?.name || 'Chat'}
      </Link>

      <div className="flex gap-6 mb-10">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm h-[800px]">
          <div className="bg-[#2563eb] px-5 py-4 flex items-center gap-3">
            <div className="relative">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                {patient?.avatar ? (
                  <Image src={patient.avatar} alt={patient.name || 'Patient'} fill sizes="48px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                    <User className="h-6 w-6" />
                  </div>
                )}
              </div>
              {conversation?.isPatientOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#22c55e] border-2 border-[#2563eb] rounded-full"></div>
              )}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{patient?.name || 'Unknown Patient'}</h2>
              <p className="text-blue-100 text-[11px] mt-0.5 font-medium">
                Patient - {conversation?.submission?.submissionCode}
              </p>
            </div>
          </div>

          <div ref={messagesRef} className="bg-[#f8fafc] flex-1 px-4 py-4 overflow-y-auto flex flex-col gap-0">
            {/* Load more pagination */}
            {hasMore && messages.length >= 50 && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-all"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  Load older messages
                </button>
              </div>
            )}

            {(() => {
              const allOrdered = [...messages];
              const rendered: React.ReactNode[] = [];
              let lastDateStr: string | null = null;

              allOrdered.forEach((msg, idx) => {
                const isMe = msg.senderId === user?.id;
                const senderInfo = getSenderInfo(msg);

                // ── Date separator ──
                if (!lastDateStr || isDifferentDay(lastDateStr, msg.createdAt)) {
                  lastDateStr = msg.createdAt;
                  rendered.push(
                    <div key={`date-${msg.id}`} className="flex items-center justify-center my-4">
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-200/70 px-3 py-1 rounded-full">
                        {getDateLabel(msg.createdAt)}
                      </span>
                    </div>
                  );
                }

                // Grouping context
                const prevMsg = allOrdered[idx - 1];
                const nextMsg = allOrdered[idx + 1];
                const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId ||
                  Math.abs(new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime()) >= 3 * 60 * 1000;
                const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId ||
                  Math.abs(new Date(nextMsg.createdAt).getTime() - new Date(msg.createdAt).getTime()) >= 3 * 60 * 1000;

                // ── PROPOSAL bubble ──
                if (msg.messageType === 'PROPOSAL' && msg.proposals?.length > 0) {
                  rendered.push(
                    <div key={msg.id} className="flex gap-2 max-w-[85%] my-1">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-white border flex items-center justify-center self-end">
                        {senderInfo.avatar
                          ? <Image src={senderInfo.avatar} alt={senderInfo.name || 'User'} fill sizes="28px" className="object-cover" />
                          : <User className="h-3.5 w-3.5 text-gray-400" />}
                      </div>
                      <div className="flex flex-col gap-2 w-[360px]">
                        <div className="bg-[#e2e8f0] border border-gray-300/60 rounded-xl overflow-hidden w-full">
                          <div className="px-4 py-3 border-b border-gray-300/60 bg-[#cbd5e1]/30">
                            <h4 className="font-bold text-gray-900 text-sm">{msg.proposals[0].title}</h4>
                          </div>
                          <div className="p-4">
                            <p className="text-xs font-semibold text-gray-900 mb-1">Message:</p>
                            <p className="text-xs text-gray-700 leading-relaxed mb-4">{msg.proposals[0].description}</p>
                            <div className="flex gap-5 text-xs text-gray-700 mb-5">
                              <span>Fees: <strong className="text-blue-600 font-semibold">${msg.proposals[0].fee}</strong></span>
                            </div>
                            <div className={`text-xs font-bold py-1.5 px-3 rounded-lg w-fit ${
                              msg.proposals[0].status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              msg.proposals[0].status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>{msg.proposals[0].status}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  return;
                }

                // ── TEXT / ATTACHMENT bubble (Messenger style) ──
                const myRadius = isMe
                  ? `rounded-[20px] ${
                      !isFirstInGroup && !isLastInGroup ? 'rounded-tr-[5px] rounded-br-[5px]' :
                      isFirstInGroup && !isLastInGroup  ? 'rounded-tr-[5px]' :
                      !isFirstInGroup && isLastInGroup  ? 'rounded-br-[5px]' : ''
                    }`
                  : `rounded-[20px] ${
                      !isFirstInGroup && !isLastInGroup ? 'rounded-tl-[5px] rounded-bl-[5px]' :
                      isFirstInGroup && !isLastInGroup  ? 'rounded-tl-[5px]' :
                      !isFirstInGroup && isLastInGroup  ? 'rounded-bl-[5px]' : ''
                    }`;

                rendered.push(
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      isMe ? 'flex-row-reverse' : 'flex-row'
                    } ${isLastInGroup ? 'mb-3' : 'mb-[2px]'}`}
                  >
                    {/* Avatar — only on last message in group */}
                    <div className="w-7 h-7 flex-shrink-0">
                      {isLastInGroup ? (
                        <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white border shadow-sm flex items-center justify-center">
                          {senderInfo.avatar
                            ? <Image src={senderInfo.avatar} alt={senderInfo.name || 'User'} fill sizes="28px" className="object-cover" />
                            : <User className="h-3.5 w-3.5 text-gray-400" />}
                        </div>
                      ) : null}
                    </div>

                    <div className={`flex flex-col ${
                      isMe ? 'items-end max-w-[60%]' : 'items-start max-w-[60%]'
                    }`}>
                      {/* Name — only first in group, only other party */}
                      {!isMe && isFirstInGroup && (
                        <span className="text-[10px] font-semibold text-gray-400 mb-1 ml-1">
                          {senderInfo.name || 'Anonymous'}
                        </span>
                      )}

                      {/* Bubble */}
                      <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                        isMe
                          ? `bg-[#2563eb] text-white ${myRadius}`
                          : `bg-[#e2e8f0] text-gray-800 ${myRadius}`
                      }`}>
                        {msg.decryptedText || '...'}
                        {msg.messageType === 'ATTACHMENT' && msg.attachments?.map((file: any) => (
                          <div key={file.id} className="mt-2 p-2 bg-white/20 rounded-lg border border-white/20 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="h-4 w-4 flex-shrink-0 opacity-80" />
                              <span className="truncate text-xs opacity-90">{file.fileName}</span>
                            </div>
                            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white/20 rounded">
                              <Download className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>

                      {/* Timestamp — only last in group */}
                      {isLastInGroup && (
                        <span className={`text-[10px] text-gray-400 mt-1 ${
                          isMe ? 'text-right pr-1' : 'text-left pl-1'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                            hour: 'numeric', minute: '2-digit', hour12: true
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              });

              return rendered;
            })()}

            {/* Typing indicator — Messenger bubble style */}
            {otherUserTyping && (
              <div className="flex items-end gap-2 mb-3">
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white border shadow-sm flex items-center justify-center flex-shrink-0">
                  {patient?.avatar
                    ? <Image src={patient.avatar} alt={patient.name || 'Patient'} fill sizes="28px" className="object-cover" />
                    : <User className="h-3.5 w-3.5 text-gray-400" />}
                </div>
                <div className="bg-[#e2e8f0] rounded-[20px] rounded-bl-[5px] px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#f8fafc] border-t border-gray-200 px-4 py-4 flex items-center gap-3">
            <label className="text-[#2563eb] hover:text-blue-700 transition-colors flex-shrink-0 p-1 cursor-pointer">
              <Paperclip className="w-5 h-5" />
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleTypingInput}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 text-sm text-gray-700 placeholder-gray-500 bg-[#e2e8f0] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-[#2563eb] hover:bg-blue-700 disabled:bg-gray-300 transition-colors text-white text-sm font-semibold px-6 py-3 rounded-lg flex items-center gap-2 flex-shrink-0 shadow-sm"
            >
              Send <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-80 flex-shrink-0">
        <div className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-[#f8fafc] mb-6">
          <h3 className="font-bold text-gray-900 text-[15px] mb-5">Service Information</h3>
          
          <div className="space-y-3.5 text-xs mb-6">
            <div className="flex justify-between items-center text-gray-500">
              <span>Service Started</span>
              <span className="text-gray-900 font-medium">{conversation?.createdAt ? new Date(conversation.createdAt).toLocaleDateString() : '-'}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Service Name</span>
              <span className="text-gray-900 font-medium">{conversation?.service?.name}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Submission Code</span>
              <span className="text-gray-900 font-medium">{conversation?.submission?.submissionCode}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href={`/doctor?consultationId=${chatId}`} className="w-full">
              <button className="w-full bg-[#3f3f46] hover:bg-[#27272a] transition-colors text-white text-[13px] font-medium py-3 rounded-lg shadow-sm">
                View Details
              </button>
            </Link>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full bg-[#2563eb] hover:bg-blue-700 transition-colors text-white text-[13px] font-medium py-3 rounded-lg shadow-sm"
            >
              Send payment request
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-[#f8fafc]">
          <h3 className="font-bold text-gray-900 text-[15px] mb-4">File & attachments</h3>

          <div className="space-y-4">
            {messages.filter(m => m.messageType === 'ATTACHMENT').map((msg) => (
              <div key={msg.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-[11px] font-medium text-gray-600">by {msg.senderId === user?.id ? 'you' : msg.sender?.name}:</p>
                  <p className="text-[11px] text-gray-400 font-medium">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1.5">
                  {msg.attachments?.map((file: any) => (
                    <div key={file.id} className="flex items-center justify-between py-1 px-1 rounded hover:bg-[#e2e8f0] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-[#2563eb] flex-shrink-0" />
                        <span className="text-xs text-gray-600 group-hover:text-gray-900 truncate">{file.fileName}</span>
                      </div>
                      <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#2563eb] transition-colors flex-shrink-0 p-1">
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {messages.filter(m => m.messageType === 'ATTACHMENT').length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No attachments yet</p>
            )}
          </div>
        </div>
      </div>

      <PaymentRequestModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        patientName={patient.name}
        onSubmit={async (proposalData) => {
          if (!recipientKeyData?.data?.publicKey) return;
          try {
            const encrypted = await encrypt(`Sent a treatment proposal: ${proposalData.title}`, recipientKeyData.data.publicKey);
            if (encrypted) {
              sendMessage({
                conversationId: chatId,
                ...encrypted,
                messageType: 'PROPOSAL',
                senderId: user?.id,
                proposal: {
                  title: proposalData.title,
                  description: proposalData.message,
                  fee: proposalData.fee.replace('$', ''),
                  proposalDate: new Date().toISOString()
                }
              });
              setIsPaymentModalOpen(false);
            }
          } catch (error) {
            toast.error("Failed to send proposal");
          }
        }}
      />
    </div>
    </>
  );
}
