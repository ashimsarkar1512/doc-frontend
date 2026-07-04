'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from "next/image";
import { User, Paperclip, Send, Download, FileText, Check, X, ShieldAlert, FileMinus, UploadCloud, Loader2, ChevronUp, ArrowLeft } from "lucide-react";
import {
  useGetMessageHistoryQuery,
  useGetPublicKeyQuery,
  useUploadMessageAttachmentMutation,
  useCancelSubscriptionMutation,
  useGetConversationFilesQuery,
  useGetServiceInfoQuery,
  useAcceptProposalMutation,
  useRejectProposalMutation,
} from '@/Redux/api/messageApi';
import { useSocket } from '@/providers/SocketProvider';
import { useE2EE } from '@/Redux/hooks/useE2EE';
import { useAppSelector } from '@/Redux/store/hooks';
import StripeCheckoutModal from "../billing/StripeCheckoutModal";
import { toast } from 'sonner';
import AcceptProposalPaymentModal from './AcceptProposalPaymentModal';

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
  onViewDetails?: (consultationId: string) => void;
}

export default function ChatWindow({ chatId, onBack, onTriggerPayment, onViewDetails }: ChatWindowProps) {
  const [typedMessage, setTypedMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const isTypingRef = useRef(false);
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pendingProposalForPayment, setPendingProposalForPayment] = useState<any>(null);
  const [isAcceptProposalModalOpen, setIsAcceptProposalModalOpen] = useState(false);
  const [proposalMsgId, setProposalMsgId] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const { data: historyData, isLoading: historyLoading } = useGetMessageHistoryQuery({
    conversationId: chatId,
    cursor,
  });
  const { data: serviceInfoRes } = useGetServiceInfoQuery(chatId, { skip: !chatId });
  const serviceInfo = serviceInfoRes?.data;
  const { data: filesData } = useGetConversationFilesQuery(chatId);
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
  const [uploadAttachment] = useUploadMessageAttachmentMutation();
  const [acceptProposal] = useAcceptProposalMutation();
  const [rejectProposal] = useRejectProposalMutation();

  const { socket, isConnected, joinConversation, leaveConversation, sendMessage, emitTyping, emitStopTyping } = useSocket();
  const { decrypt, encrypt, isInitializing } = useE2EE();
  const user = useAppSelector((state) => state.auth.user);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastLoadedChatIdRef = useRef<string | null>(null);

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
      if (!historyData?.data?.messages || isInitializing) return;

      const incoming = historyData.data.messages;

      // Check if there are more messages (less than 50 returned = end of history)
      if (incoming.length < 50) setHasMore(false);

      const decrypted = await Promise.all(
        incoming.map(async (msg: any) => {
          const text = await decrypt(msg);
          return { ...msg, decryptedText: text };
        })
      );

      setMessages(prev => {
        if (lastLoadedChatIdRef.current !== chatId) {
          lastLoadedChatIdRef.current = chatId;
          return decrypted;
        }
        
        // Smart merge to prevent wiping out live/optimistic messages
        const newMap = new Map(prev.map(m => [m.id, m]));
        decrypted.forEach(m => {
          if (!newMap.has(m.id)) {
            newMap.set(m.id, m);
          } else {
            // Keep the decrypted text if we already had it
            newMap.set(m.id, { ...m, decryptedText: newMap.get(m.id).decryptedText });
          }
        });
        
        return Array.from(newMap.values()).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });
    };
    decryptHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyData, isInitializing, chatId]);

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

    const handleTyping = (payload: { userId: string; name?: string }) => {
      if (payload.userId !== user?.id) setOtherUserTyping(payload.name || 'Someone');
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
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, otherUserTyping]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleSend = async () => {
    if ((!typedMessage.trim() && !selectedFile) || !recipientKeyData?.data?.publicKey) {
      if (!recipientKeyData?.data?.publicKey) toast.error('Recipient public key not found');
      return;
    }

    setIsUploading(true);
    let attachmentId = null;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('files', selectedFile);
      formData.append('context', 'CHAT_MESSAGE');
      try {
        const uploadRes = await uploadAttachment(formData).unwrap();
        attachmentId = uploadRes.data.id;
      } catch (error) {
        toast.error('File upload failed');
        setIsUploading(false);
        return;
      }
    }

    try {
      const textToSend = typedMessage.trim() || (selectedFile ? `Sent an attachment: ${selectedFile.name}` : '');
      const encrypted = await encrypt(textToSend, recipientKeyData.data.publicKey);
      if (!encrypted) {
        toast.error("Encryption failed. Ensure you are on HTTPS or localhost to use WebCrypto.");
        setIsUploading(false);
        return;
      }

      const optimisticMsg = {
        id: `opt-${Date.now()}`,
        conversationId: chatId,
        senderId: user?.id,
        messageType: attachmentId ? 'ATTACHMENT' : 'TEXT',
        createdAt: new Date().toISOString(),
        sender: {
          id: user?.id,
          name: user?.profile?.name,
          avatar: user?.profile?.avatar,
        },
        decryptedText: textToSend,
        attachments: selectedFile ? [{
          id: 'temp',
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
          fileUrl: URL.createObjectURL(selectedFile)
        }] : []
      };
      setMessages((prev) => [...prev, optimisticMsg]);

      sendMessage({
        conversationId: chatId,
        ...encrypted,
        messageType: attachmentId ? 'ATTACHMENT' : 'TEXT',
        attachmentId,
        senderId: user?.id
      });
      setTypedMessage('');
      setSelectedFile(null);
      emitStopTyping(chatId);
    } catch (error) {
      toast.error('Failed to encrypt message');
    }
    setIsUploading(false);
  };

  const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedMessage(e.target.value);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitTyping(chatId);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      emitStopTyping(chatId);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    e.target.value = '';
  };

  const handleDownload = async (url: string, filename: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback
      window.open(url, '_blank');
    }
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
    const startOfMsg = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((startOfToday.getTime() - startOfMsg.getTime()) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return d.toLocaleDateString('en-US', { weekday: 'long' });
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
      da.getMonth() !== db.getMonth() ||
      da.getDate() !== db.getDate();
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
      {/* Main Grid: Chat & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">

        {/* ── Left Column: Live Chat ── */}
        <div className="lg:col-span-8 bg-white border border-gray-150 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col h-[700px]">

          {/* Doctor header banner */}
          <div
            className="flex items-center self-stretch text-white gap-3"
            style={{
              padding: '20px',
              borderRadius: '16px 16px 0 0',
              borderBottom: '1px solid rgba(217, 217, 217, 0.40)',
              background: 'var(--Blue, #1D4ED8)'
            }}
          >
            <button onClick={onBack} className="lg:hidden p-1.5 -ml-2 hover:bg-white/10 rounded-full transition-colors mr-1">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="relative flex-shrink-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-emerald-50">
                {doctor?.avatar ? (
                  <img src={doctor.avatar} alt={doctor.name || 'Provider'} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                    <User className="h-6 w-6" />
                  </div>
                )}
              </div>
              {isOnline && (
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#1D4ED8]" />
              )}
            </div>
            <div className="flex flex-col gap-[4px]">
              <h2 className="font-[Quicksand] text-[20px] font-semibold leading-[100%] text-white">
                {doctor?.name || 'Unknown Provider'}
              </h2>
              <p className="font-[Quicksand] text-[14px] font-normal leading-[100%] text-white">
                Patient - {conversation?.submission?.submissionCode || `#${chatId.substring(0, 6)}`}
              </p>
            </div>
          </div>

          {/* Message bubbles — Messenger style */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50/50 flex flex-col gap-0 scroll-smooth scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">

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
                  const proposalDate = proposal.proposalDate
                    ? new Date(proposal.proposalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : null;
                  const timeAgo = (() => {
                    const diff = (Date.now() - new Date(msg.createdAt).getTime()) / 60000;
                    if (diff < 1) return 'just now';
                    if (diff < 60) return `${Math.floor(diff)} min ago`;
                    if (diff < 1440) return `${Math.floor(diff / 60)} hr ago`;
                    return `${Math.floor(diff / 1440)} days ago`;
                  })();
                  rendered.push(
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 my-2 ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white border border-gray-100 shadow-sm flex items-center justify-center self-end">
                          {senderInfo.avatar
                            ? <img src={senderInfo.avatar} className="object-cover w-full h-full" alt="" />
                            : <User className="h-4 w-4 text-gray-400" />}
                        </div>
                        <div className="w-full sm:w-[360px] bg-[#e8edf2] rounded-2xl overflow-hidden shadow-sm">
                          {/* Title */}
                          <div className="px-5 pt-5 pb-0">
                            <h5 className="font-bold text-gray-900 text-[15px] leading-snug">{proposal.title}</h5>
                            <div className="border-t border-gray-300/70 mt-3" />
                          </div>
                          {/* Body */}
                          <div className="px-5 pt-3 pb-2 flex flex-col gap-2">
                            {proposal.description && (
                              <>
                                <p className="text-[13px] font-bold text-gray-800">Message:</p>
                                <p className="text-[12px] text-gray-600 leading-relaxed">{proposal.description}</p>
                              </>
                            )}
                            <p className="text-[13px] font-bold text-gray-800 mt-1">Proposal Includes:</p>
                            <div className="flex items-center gap-5 text-[12px] text-gray-700">
                              <span>Fees: <strong className="text-blue-600">${proposal.fee}</strong></span>
                              {proposalDate && <span>Date: <strong className="text-gray-800">{proposalDate}</strong></span>}
                            </div>
                          </div>
                          {/* Footer - action buttons */}
                          <div className="px-5 py-4">
                            {proposal.status === 'PENDING' && !isMe ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setPendingProposalForPayment(proposal);
                                    setProposalMsgId(msg.id);
                                    setIsAcceptProposalModalOpen(true);
                                  }}
                                  className="px-5 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-full text-[12px] shadow-sm transition-all"
                                >
                                  Accept Proposal
                                </button>
                                <button
                                  onClick={async () => {
                                    try {
                                      await rejectProposal(proposal.id).unwrap();
                                      setMessages(prev => prev.map(m =>
                                        m.id === msg.id
                                          ? { ...m, proposals: [{ ...proposal, status: 'REJECTED', rejectedBy: user?.id }] }
                                          : m
                                      ));
                                      toast.success('Proposal declined.');
                                    } catch {
                                      toast.error('Failed to decline proposal. Please try again.');
                                    }
                                  }}
                                  className="px-5 py-2 border border-gray-400 text-gray-700 font-semibold rounded-full text-[12px] hover:bg-gray-200/60 transition-all"
                                >
                                  Decline
                                </button>
                              </div>
                            ) : (
                              <div className={`text-[11px] font-bold py-1.5 px-3 rounded-full w-fit ${proposal.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                                proposal.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                {proposal.status === 'ACCEPTED' ? '✓ You accepted this proposal' :
                                  proposal.status === 'REJECTED' ? (
                                    proposal.rejectedBy === user?.id ? '✕ You declined this proposal' :
                                      proposal.rejectedBy === conversation?.providerId ? '✕ Doctor withdrew this proposal' :
                                        '✕ Proposal Cancelled'
                                  ) :
                                    'Awaiting your response'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Timestamp below the card */}
                      <span className={`text-[10px] text-gray-400 px-11 ${isMe ? 'text-right' : 'text-left'}`}>{timeAgo}</span>
                    </div>
                  );
                  return;
                }

                // ── TEXT / ATTACHMENT bubble ──
                // Border radius: Charkona (rectangular/soft square) style
                const myRadius = "rounded-[8px]";

                rendered.push(
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse justify-start' : 'flex-row justify-start'
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

                    <div className={`flex flex-col ${isMe ? 'items-end max-w-[65%]' : 'items-start max-w-[65%]'
                      }`}>
                      {/* Sender name — only on first message in group for others */}
                      {!isMe && isFirstInGroup && (
                        <span className="text-[10px] font-semibold text-gray-400 mb-1 ml-1">
                          {senderInfo.name || 'Anonymous'}
                        </span>
                      )}

                      {/* Bubble */}
                      <div className={`px-4 py-2.5 text-sm leading-relaxed ${isMe
                        ? `bg-[#2563eb] text-white ${myRadius}`
                        : `bg-[#e2e8f0] text-gray-800 ${myRadius}`
                        }`}>
                        {msg.decryptedText || '...'}

                        {msg.messageType === 'ATTACHMENT' && msg.attachments?.map((file: any) => {
                          const isImage = file.fileType?.startsWith('image/') || file.fileName?.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i);
                          if (isImage) {
                            return (
                              <div key={file.id} className="mt-2 rounded-xl overflow-hidden border border-black/10 relative group bg-black/5">
                                <img src={file.fileUrl} alt={file.fileName} className="max-w-full max-h-[250px] object-contain" />
                                <a
                                  href={file.fileUrl}
                                  onClick={(e) => handleDownload(file.fileUrl, file.fileName, e)}
                                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </div>
                            );
                          }

                          const isVideo = file.fileType?.startsWith('video/') || file.fileName?.match(/\.(mp4|webm|ogg|mov)$/i);
                          if (isVideo) {
                            return (
                              <div key={file.id} className="mt-2 rounded-xl overflow-hidden border border-black/10 relative group bg-black/90 flex justify-center items-center">
                                <video
                                  controls
                                  playsInline
                                  preload="metadata"
                                  src={file.fileUrl}
                                  className="max-w-full max-h-[280px] object-contain"
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            );
                          }

                          return (
                            <div key={file.id} className={`mt-2 p-2 rounded-lg border flex items-center justify-between gap-3 min-w-[180px] max-w-full ${isMe ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'
                              }`}>
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="h-5 w-5 flex-shrink-0 opacity-80" />
                                <span className="truncate text-xs font-medium">{file.fileName}</span>
                              </div>
                              <a
                                href={file.fileUrl}
                                onClick={(e) => handleDownload(file.fileUrl, file.fileName, e)}
                                className={`p-1.5 rounded-md transition-colors flex-shrink-0 ${isMe ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-gray-700'
                                  }`}
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </div>
                          );
                        })}
                      </div>

                      {/* Timestamp — only on last message in group */}
                      {isLastInGroup && (
                        <span className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'text-right pr-1' : 'text-left pl-1'
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
                <div className="bg-[#e2e8f0] rounded-[20px] rounded-bl-[5px] px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

          </div>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="bg-white border-t border-gray-150 p-4 pb-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {selectedFile.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(selectedFile)} alt="preview" className="object-cover w-full h-full" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 max-w-[200px] truncate">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Message input */}
          <div className="bg-white border-t border-gray-150 p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <label className={`text-[#2563eb] hover:text-blue-700 transition-colors flex-shrink-0 p-1 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              <Paperclip className="h-5 w-5" />
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            </label>
            <input
              type="text"
              placeholder="Type your message..."
              value={typedMessage}
              onChange={handleTypingInput}
              disabled={isUploading}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 min-w-0 text-sm text-gray-700 placeholder-gray-500 bg-[#e2e8f0] px-3 sm:px-4 py-2 sm:py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={(!typedMessage.trim() && !selectedFile) || isUploading}
              className="bg-[#1D4ED8] hover:bg-[#1a40b3] disabled:bg-[#1D4ED8] disabled:opacity-100 transition-colors text-white text-[16px] font-semibold flex justify-center items-center px-3 sm:px-[16px] py-2 sm:py-[10px] gap-2 sm:gap-[11px] rounded-[12px] flex-shrink-0 shadow-sm disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <span className="text-sm">...</span>
              ) : (
                <>
                  <span className="hidden sm:inline">Send</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Right Column: Files & Actions Sidebar ── */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-[#f0f4f8] rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-[16px] pb-2 border-b border-[#2563eb]">Service Information</h3>

            <div className="space-y-4 mt-4 mb-4">
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--Black-2, #3B3B3B)', textAlign: 'center', fontFamily: 'Quicksand', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%' }}>Service Started</span>
                <span style={{ color: 'var(--Black-2, #3B3B3B)', textAlign: 'center', fontFamily: 'Quicksand', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%' }}>{serviceInfo?.serviceStart ? new Date(serviceInfo.serviceStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--Black-2, #3B3B3B)', textAlign: 'center', fontFamily: 'Quicksand', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%' }}>Service Duration</span>
                <span style={{ color: 'var(--Black-2, #3B3B3B)', textAlign: 'center', fontFamily: 'Quicksand', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%' }}>{serviceInfo?.serviceDuration === 'MONTHLY' ? '1 month' : serviceInfo?.serviceDuration?.toLowerCase() || '-'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#2563eb]">
                <span style={{ color: 'var(--Black-2, #3B3B3B)', textAlign: 'center', fontFamily: 'Quicksand', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%' }}>Service Fees</span>
                <span style={{ color: 'var(--Black-2, #3B3B3B)', textAlign: 'center', fontFamily: 'Quicksand', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%' }}>${serviceInfo?.serviceFees ? parseFloat(serviceInfo.serviceFees).toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span style={{ color: 'var(--Black-2, #3B3B3B)', textAlign: 'center', fontFamily: 'Quicksand', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%' }}>Next billing date:</span>
                <span style={{ color: 'var(--Black-2, #3B3B3B)', textAlign: 'center', fontFamily: 'Quicksand', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: '100%' }}>{serviceInfo?.nextBillingDate ? new Date(serviceInfo.nextBillingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '-'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-5">
              <button
                onClick={() => {
                  if (conversation?.submission?.id) {
                    if (onViewDetails) {
                      onViewDetails(conversation.submission.id);
                    }
                  } else {
                    toast.error("Submission details not found");
                  }
                }}
                className="w-full bg-[#3f3f46] hover:bg-[#27272a] transition-colors text-white text-[14px] font-medium py-2.5 rounded-lg shadow-sm"
              >
                View details
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full bg-[#e11d48] hover:bg-rose-700 transition-colors text-white text-[14px] font-medium py-2.5 rounded-lg shadow-sm"
              >
                Close treatment
              </button>
            </div>
          </div>

          <div className="bg-[#f0f4f8] rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-gray-900 text-[16px] pb-2 border-b border-gray-200 mb-4">File & attachments</h3>

            <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
              {messages.filter(m => m.messageType === 'ATTACHMENT').map((msg) => (
                <div key={msg.id}>
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-[11px] font-medium text-gray-600">by {msg.senderId === user?.id ? 'you' : getSenderInfo(msg).name || 'Provider'}:</p>
                    <p className="text-[11px] text-gray-400 font-medium">{new Date(msg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</p>
                  </div>
                  <div className="space-y-1.5">
                    {msg.attachments?.map((file: any) => (
                      <div key={file.id} className="flex items-center justify-between py-1 px-1 rounded hover:bg-[#e2e8f0] transition-colors cursor-pointer group">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-[#2563eb] flex-shrink-0" />
                          <span className="text-xs text-gray-600 group-hover:text-gray-900 truncate">{file.fileName}</span>
                        </div>
                        <a
                          href={file.fileUrl}
                          onClick={(e) => handleDownload(file.fileUrl, file.fileName, e)}
                          className="text-[#2563eb] transition-colors flex-shrink-0 p-1"
                        >
                          <Download className="w-4 h-4" />
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
      </div>

      {/* Cancel confirmation modal */}
      <CancelConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        isLoading={isCancelling}
      />

      {/* Accept Proposal Payment Modal */}
      {isAcceptProposalModalOpen && pendingProposalForPayment && (
        <AcceptProposalPaymentModal
          isOpen={isAcceptProposalModalOpen}
          onClose={() => {
            setIsAcceptProposalModalOpen(false);
            setPendingProposalForPayment(null);
            setProposalMsgId(null);
          }}
          proposal={pendingProposalForPayment}
          onSuccess={() => {
            // Update the local message cache to show 'ACCEPTED'
            if (proposalMsgId) {
              setMessages(prev => prev.map(m => {
                if (m.id === proposalMsgId && m.messageType === 'PROPOSAL') {
                  return {
                    ...m,
                    proposals: m.proposals.map((p: any) => 
                      p.id === pendingProposalForPayment.id 
                        ? { ...p, status: 'ACCEPTED' } 
                        : p
                    )
                  };
                }
                return m;
              }));
            }
          }}
        />
      )}
    </div>
  );
}
