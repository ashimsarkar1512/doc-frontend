'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../Redux/store/hooks';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (payload: any) => void;
  emitTyping: (conversationId: string) => void;
  emitStopTyping: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

/**
 * Derive the Socket.IO server origin from the REST API base URL.
 *
 * REST base:  https://prod.example.com/api/v1
 * Socket URL: https://prod.example.com          (origin only — no path)
 *
 * Socket.IO client handles http→ws / https→wss upgrade internally,
 * so we MUST pass an http/https URL, NOT ws/wss.
 */
function deriveSocketOrigin(apiBaseUrl: string): string {
  try {
    const url = new URL(apiBaseUrl);
    return url.origin; // e.g. "https://prod.example.com"
  } catch {
    // Fallback: strip trailing path segments
    return apiBaseUrl.replace(/\/api\/.*$/, '');
  }
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = useAppSelector((state) => state.auth.token);

  // Queue rooms that were requested before the socket connected
  const pendingJoinsRef = useRef<Set<string>>(new Set());
  // Queue messages that were sent before the socket connected
  const pendingMessagesRef = useRef<any[]>([]);

  const socketOrigin = deriveSocketOrigin(process.env.NEXT_PUBLIC_API_BASE_URL || '');

  useEffect(() => {
    if (!token || !socketOrigin) return;

    console.log('[Socket] Connecting to:', socketOrigin);

    // Socket.IO accepts http/https URL — it upgrades to WebSocket automatically
    const newSocket = io(`${socketOrigin}/chat`, {
      auth: { token },
      transports: ['websocket', 'polling'], // polling as fallback
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    const handleConnect = () => {
      console.log('[Socket] Connected ✓');
      setIsConnected(true);

      // Flush pending room joins
      pendingJoinsRef.current.forEach((conversationId) => {
        console.log('[Socket] Flushing join:', conversationId);
        newSocket.emit('join_conversation', { conversationId });
      });
      pendingJoinsRef.current.clear();

      // Flush pending messages
      pendingMessagesRef.current.forEach((payload) => {
        console.log('[Socket] Flushing message');
        newSocket.emit('send_message', payload);
      });
      pendingMessagesRef.current = [];
    };

    const handleDisconnect = (reason: string) => {
      console.warn('[Socket] Disconnected:', reason);
      setIsConnected(false);
    };

    const handleConnectError = (err: Error) => {
      console.error('[Socket] Connection error:', err.message);
    };

    const handleError = (error: any) => {
      console.error('[Socket] Server error:', error);
    };

    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleConnectError);
    newSocket.on('error', handleError);

    setSocket(newSocket);

    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('connect_error', handleConnectError);
      newSocket.off('error', handleError);
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, socketOrigin]);

  const joinConversation = useCallback(
    (conversationId: string) => {
      if (socket && socket.connected) {
        console.log('[Socket] Joining room:', conversationId);
        socket.emit('join_conversation', { conversationId });
      } else {
        console.log('[Socket] Queuing join:', conversationId);
        pendingJoinsRef.current.add(conversationId);
      }
    },
    [socket]
  );

  const leaveConversation = useCallback(
    (conversationId: string) => {
      pendingJoinsRef.current.delete(conversationId);
      if (socket && socket.connected) {
        socket.emit('leave_conversation', { conversationId });
      }
    },
    [socket]
  );

  const sendMessage = useCallback(
    (payload: any) => {
      if (socket && socket.connected) {
        socket.emit('send_message', payload);
      } else {
        // Queue and flush when connected
        console.warn('[Socket] Not connected — queuing message');
        pendingMessagesRef.current.push(payload);
      }
    },
    [socket]
  );

  const emitTyping = useCallback(
    (conversationId: string) => {
      if (socket && socket.connected) {
        socket.emit('typing', { conversationId });
      }
    },
    [socket]
  );

  const emitStopTyping = useCallback(
    (conversationId: string) => {
      if (socket && socket.connected) {
        socket.emit('stop_typing', { conversationId });
      }
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage,
        emitTyping,
        emitStopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
