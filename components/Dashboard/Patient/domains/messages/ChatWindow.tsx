'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Send, FileText, Download, Check, X, ShieldAlert, Paperclip, Loader2, ChevronUp, User } from 'lucide-react';
import {
  useGetMessageHistoryQuery,
  useGetPublicKeyQuery,
  useUploadAttachmentMutation,
  useCancelSubscriptionMutation,
  useGetConversationFilesQuery,
} from '@/Redux/api/messageApi';
import { useSocket } from '@/providers/SocketProvider';
import { useE2EE } from '@/Redux/hooks/useE2EE';
import { useAppSelector } from '@/Redux/store/hooks';
import { toast } from 'sonner';

// ─── Cancel Subscription Confirmation Modal ────────────────────────────────────

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function CancelConfirmModal({ isOpen, onClose, onConfirm, isLoading }: CancelModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 animate-in zoom-in-95 duration-200">
        {/* Warning icon */}
        <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
          <ShieldAlert className="h-7 w-7 text-rose-600" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 text-center leading-tight">
          Close This Consultation?
        </h3>
        <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed font-light">
          This will cancel your active subscription for this consultation. This action cannot be undone.
        </p>

        <div className="flex gap-3 mt-7">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Keep Active
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Cancelling...</span>
              </>
            ) : (
              'Yes, Close It'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ChatWindow ───────────────────────────────────────────────────────────

interface ChatWindowProps {
  chatId: string;
  onBack: () => void;
  onTriggerPayment: () => void;
}

export default function ChatWindow({ chatId, onBack, onTriggerPayment }: ChatWindowProps) {
  const [typedMessage, setTypedMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const { data: historyData, isLoading: historyLoading } = useGetMessageHistoryQuery({
    conversationId: chatId,
    cursor,
  });
  const { data: filesData } = useGetConversationFilesQuery(chatId);
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
  const [uploadAttachment] = useUploadAttachmentMutation();

  const { socket, isConnected, joinConversation, leaveConversation, sendMessage, emitTyping, emitStopTyping } = useSocket();
  const { decrypt, encrypt } = useE2EE();
  const user = useAppSelector((state) => state.auth.user);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const conversation = historyData?.data?.conversation;
  const recipientId = user?.id === conversation?.patientId
    ? conversation?.providerId
    : conversation?.patientId;

  const { data: recipientKeyData } = useGetPublicKeyQuery(recipientId || '', {
    skip: !recipientId,
  });

  // Join conversation room — retry whenever socket (re)connects
  useEffect(() => {
    if (chatId && isConnected) joinConversation(chatId);
    return () => {
      if (chatId) leaveConversation(chatId);
    };
  }, [chatId, isConnected, joinConversation, leaveConversation]);

  // Load and decrypt message history
  useEffect(() => {
    const decryptHistory = async () => {
      if (!historyData?.data?.messages) return;

      const incoming = historyData.data.messages;

      // Check if there are more messages (less than 50 returned = end of history)
      if (incoming.length < 50) setHasMore(false);

      const decrypted = await Promise.all(
        incoming.map(async (msg: any) => {
          const text = await decrypt(msg);
          return { ...msg, decryptedText: text };
        })
      );

      if (cursor) {
        // Prepend older messages at top
        setMessages(prev => [...decrypted, ...prev]);
      } else {
        setMessages(decrypted);
      }
    };
    decryptHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyData]);

  // Listen for new real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (msg: any) => {
      if (msg.conversationId !== chatId) return;
      const text = await decrypt(msg);
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        const isDuplicate = prev.some(m => m.senderId === msg.senderId && m.decryptedText === text && m.id.startsWith('opt-'));
        if (isDuplicate) {
           return prev.map(m => (m.senderId === msg.senderId && m.decryptedText === text && m.id.startsWith('opt-')) ? { ...msg, decryptedText: text } : m);
        }
        return [...prev, { ...msg, decryptedText: text }];
      });
    };

    const handleTyping = ({ userId, name }: { userId: string; name: string }) => {
      if (userId !== user?.id) setOtherUserTyping(name);
    };

    const handleStopTyping = ({ userId }: { userId: string }) => {
      if (userId !== user?.id) setOtherUserTyping(null);
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

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherUserTyping]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!typedMessage.trim() || !recipientKeyData?.data?.publicKey) {
      if (!recipientKeyData?.data?.publicKey) toast.error('Recipient public key not found');
      return;
    }
    try {
      const encrypted = await encrypt(typedMessage, recipientKeyData.data.publicKey);
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
          decryptedText: typedMessage,
        };
        setMessages((prev) => [...prev, optimisticMsg]);

        sendMessage({ conversationId: chatId, ...encrypted, messageType: 'TEXT', senderId: user?.id });
        setTypedMessage('');
        emitStopTyping(chatId);
    } catch (error) {
      toast.error('Failed to encrypt message');
    }
  };

  const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedMessage(e.target.value);
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
        sendMessage({ conversationId: chatId, ...encrypted, messageType: 'ATTACHMENT', attachmentId, senderId: user?.id });
      }
    } catch (error) {
      toast.error('File upload failed');
    }
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleLoadMore = () => {
    if (messages.length > 0) {
      setCursor(messages[0].id);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription(chatId).unwrap();
      toast.success('Consultation closed successfully');
      setShowCancelModal(false);
      onBack();
    } catch (error) {
      toast.error('Failed to close consultation. Please try again.');
      setShowCancelModal(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (historyLoading && !cursor) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  const doctor = conversation?.provider;
  const isOnline = conversation?.isProviderOnline;

  /** Resolve sender name + avatar, falling back to conversation participant data */
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

  /** Group messages: same sender + within 3 min = same group */
  const buildGroups = (msgs: any[]) => {
    const groups: { senderId: string; msgs: any[] }[] = [];
    msgs.forEach((msg) => {
      const last = groups[groups.length - 1];
      const prev = last?.msgs[last.msgs.length - 1];
      const sameUser = last && last.senderId === msg.senderId;
      const withinWindow = prev &&
        Math.abs(new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime()) < 3 * 60 * 1000;
      if (sameUser && withinWindow) {
        last.msgs.push(msg);
      } else {
        groups.push({ senderId: msg.senderId, msgs: [msg] });
      }
    });
    return groups;
  };

  /** Check if two messages are on different calendar days */
  const isDifferentDay = (a: string, b: string) => {
    const da = new Date(a); const db = new Date(b);
    return da.getFullYear() !== db.getFullYear() ||
           da.getMonth()    !== db.getMonth()    ||
           da.getDate()     !== db.getDate();
  };

  // Collect all attachment files from messages (for sidebar) + API files response
  const attachmentMessages = messages.filter(m => m.messageType === 'ATTACHMENT');
  const allFiles = [
    ...attachmentMessages.flatMap(m => m.attachments || []),
    ...(filesData?.data?.patientFiles || []),
    ...(filesData?.data?.providerFiles || []),
  ];
  // Deduplicate by id
  const uniqueFiles = Array.from(new Map(allFiles.map(f => [f.id, f])).values());

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">

      {/* Back navigation */}
      <div className="flex items-center gap-2 text-gray-800 font-sans">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-150 rounded-lg transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-gray-800" />
        </button>
        <span className="text-base font-semibold tracking-tight text-gray-900">
          {conversation?.service?.name || 'Chat'}
        </span>
      </div>

      {/* Main Grid: Chat & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">

        {/* ── Left Column: Live Chat ── */}
        <div className="lg:col-span-8 bg-white border border-gray-150 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col h-[700px]">

          {/* Doctor header banner */}
          <div className="bg-[#2563eb] px-6 py-4 flex items-center gap-3 text-white">
            <div className="relative">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-emerald-50">
                {doctor?.avatar ? (
                  <img src={doctor.avatar} alt={doctor.name || 'Provider'} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
              {isOnline && (
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#2563eb]" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight">
                {doctor?.name || 'Unknown Provider'}
              </h4>
              <p className="text-[11px] text-blue-100 font-light mt-0.5 leading-none">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          {/* Message bubbles — Messenger style */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50/50 flex flex-col gap-0">

            {/* Load more button */}
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
              const groups = buildGroups(messages.filter(m => m.messageType !== 'PROPOSAL'));
              const proposals = messages.filter(m => m.messageType === 'PROPOSAL');
              // Merge back maintaining order
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
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
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
                  const proposal = msg.proposals[0];
                  rendered.push(
                    <div key={msg.id} className="flex gap-2 max-w-[85%] my-1 animate-in slide-in-from-bottom-2 duration-200">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white border border-gray-100 flex items-center justify-center self-end">
                        {senderInfo.avatar
                          ? <img src={senderInfo.avatar} className="object-cover w-full h-full" alt="" />
                          : <User className="h-4 w-4 text-gray-400" />}
                      </div>
                      <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-sm flex flex-col gap-4">
                        <div className="flex flex-col gap-1 border-b border-gray-50 pb-3">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded self-start uppercase tracking-wide">Medical Proposal</span>
                          <h5 className="text-base font-bold text-gray-900 mt-1 leading-snug">{proposal.title}</h5>
                        </div>
                        {proposal.description && <p className="text-xs text-gray-500 leading-relaxed font-light">{proposal.description}</p>}
                        <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100/50 flex justify-between items-center text-sm font-bold">
                          <span className="text-gray-600">Total Price</span>
                          <span className="text-blue-600 text-lg">${proposal.fee}</span>
                        </div>
                        {proposal.status === 'PENDING' && !isMe && (
                          <div className="flex items-center gap-3">
                            <button onClick={onTriggerPayment} className="flex-1 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-1.5">
                              <Check className="h-3.5 w-3.5" /><span>Accept Proposal</span>
                            </button>
                            <button className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5">
                              <X className="h-3.5 w-3.5" /><span>Decline</span>
                            </button>
                          </div>
                        )}
                        {proposal.status !== 'PENDING' && (
                          <div className={`text-xs font-bold text-center py-2 rounded-lg ${
                            proposal.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600' :
                            proposal.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-500'
                          }`}>Proposal {proposal.status}</div>
                        )}
                      </div>
                    </div>
                  );
                  return;
                }

                // ── TEXT / ATTACHMENT bubble ──
                // Border radius: Messenger style — top corners sharp for grouped, bottom sharp for first
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
                      isMe ? 'flex-row-reverse justify-start' : 'flex-row justify-start'
                    } ${isLastInGroup ? 'mb-3' : 'mb-[2px]'}`}
                  >
                    {/* Avatar — only on last message in group */}
                    <div className="w-7 h-7 flex-shrink-0">
                      {isLastInGroup ? (
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                          {senderInfo.avatar
                            ? <img src={senderInfo.avatar} className="object-cover w-full h-full" alt="" />
                            : <User className="h-3.5 w-3.5 text-gray-400" />}
                        </div>
                      ) : null}
                    </div>

                    <div className={`flex flex-col ${
                      isMe ? 'items-end max-w-[65%]' : 'items-start max-w-[65%]'
                    }`}>
                      {/* Sender name — only on first message in group for others */}
                      {!isMe && isFirstInGroup && (
                        <span className="text-[10px] font-semibold text-gray-400 mb-1 ml-1">
                          {senderInfo.name || 'Anonymous'}
                        </span>
                      )}

                      {/* Bubble */}
                      <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                        isMe
                          ? `bg-[#2563eb] text-white ${myRadius}`
                          : `bg-white text-gray-800 border border-gray-100 shadow-sm ${myRadius}`
                      }`}>
                        {msg.decryptedText || '...'}

                        {msg.messageType === 'ATTACHMENT' && msg.attachments?.map((file: any) => (
                          <div key={file.id} className="mt-2 p-2 bg-white/10 rounded-lg border border-white/20 flex items-center justify-between gap-2">
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

                      {/* Timestamp — only on last message in group */}
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
                <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0">
                  {doctor?.avatar
                    ? <img src={doctor.avatar} className="object-cover w-full h-full" alt="" />
                    : <User className="h-3.5 w-3.5 text-gray-400" />}
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-[20px] rounded-bl-[5px] px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="bg-white border-t border-gray-150 p-4 flex items-center gap-3">
            <label className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
              <Paperclip className="h-5 w-5 text-gray-500" />
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
            <input
              type="text"
              placeholder="Type your message..."
              value={typedMessage}
              onChange={handleTypingInput}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-50 border border-gray-150 rounded-[14px] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400 focus:bg-white transition-all shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={!typedMessage.trim()}
              className="w-11 h-11 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-gray-300 text-white rounded-[14px] flex items-center justify-center hover:shadow active:scale-95 transition-all flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Right Column: Files & Actions Sidebar ── */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Service info card */}
          {conversation?.submission && (
            <div className="bg-white rounded-3xl border border-gray-150 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-3">
              <h4 className="text-[14px] font-bold text-gray-900">Service Info</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Service</span>
                  <span className="font-semibold text-gray-800">{conversation.service?.name}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Submission</span>
                  <span className="font-semibold text-blue-600">{conversation.submission.submissionCode}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Status</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] uppercase ${
                    conversation.submission.status === 'ACCEPTED'
                      ? 'bg-emerald-50 text-emerald-600'
                      : conversation.submission.status === 'PENDING'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}>
                    {conversation.submission.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Assessment</span>
                  <span className="font-semibold text-gray-800 truncate max-w-[140px] text-right">
                    {conversation.submission.assessment?.title}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Files & Attachments card */}
          <div className="bg-white rounded-3xl border border-gray-150 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <div>
              <h4 className="text-[15px] font-bold text-gray-900">Files &amp; Attachments</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 font-light">Shared document attachments</p>
            </div>

            <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
              {uniqueFiles.length > 0 ? uniqueFiles.map((file: any) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl border border-gray-100 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center flex-shrink-0 border border-rose-100">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate leading-snug">{file.fileName}</p>
                      {file.fileSize && (
                        <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                          {(file.fileSize / 1024).toFixed(0)} KB
                        </p>
                      )}
                    </div>
                  </div>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-800 rounded-lg transition-all"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              )) : (
                <p className="text-xs text-gray-400 text-center py-4">No attachments yet</p>
              )}
            </div>

            {/* Cancel subscription / close consultation */}
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-sm mt-2"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Close This Consultation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cancel confirmation modal */}
      <CancelConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        isLoading={isCancelling}
      />
    </div>
  );
}
