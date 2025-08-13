'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { useUserStore } from '@/store/userStore';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  id?: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  lastError: string | null;
  reconnectAttempt: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

export function useWebSocket(config: WebSocketConfig) {
  const {
    url,
    protocols,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
    onConnect,
    onDisconnect,
    onError,
    onMessage
  } = config;

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    lastError: null,
    reconnectAttempt: 0,
    connectionQuality: 'disconnected'
  });

  const [latency, setLatency] = useState<number>(0);
  const lastPingTime = useRef<number>(0);

  // Clear all timeouts
  const clearTimeouts = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
    if (pingTimeoutRef.current) {
      clearTimeout(pingTimeoutRef.current);
      pingTimeoutRef.current = null;
    }
  }, []);

  // Update connection quality based on latency
  const updateConnectionQuality = useCallback((latency: number) => {
    let quality: WebSocketState['connectionQuality'];
    if (latency < 100) quality = 'excellent';
    else if (latency < 300) quality = 'good';
    else if (latency < 1000) quality = 'poor';
    else quality = 'disconnected';

    setState(prev => ({ ...prev, connectionQuality: quality }));
  }, []);

  // Send heartbeat/ping
  const sendHeartbeat = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      lastPingTime.current = Date.now();
      ws.current.send(JSON.stringify({
        type: 'ping',
        timestamp: lastPingTime.current
      }));

      // Set timeout for pong response
      pingTimeoutRef.current = setTimeout(() => {
        // No pong received, connection might be dead
        updateConnectionQuality(1000);
        ws.current?.close();
      }, 5000);
    }
  }, [updateConnectionQuality]);

  // Handle incoming messages
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // Handle system messages
      if (message.type === 'pong') {
        const currentLatency = Date.now() - lastPingTime.current;
        setLatency(currentLatency);
        updateConnectionQuality(currentLatency);
        
        if (pingTimeoutRef.current) {
          clearTimeout(pingTimeoutRef.current);
          pingTimeoutRef.current = null;
        }
        return;
      }

      // Call user-defined message handler
      onMessage?.(message);
    } catch (error) {
      console.error('WebSocket message parsing error:', error);
    }
  }, [onMessage, updateConnectionQuality]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, lastError: null }));

    try {
      ws.current = new WebSocket(url, protocols);

      ws.current.onopen = () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          reconnectAttempt: 0,
          connectionQuality: 'good'
        }));

        // Start heartbeat
        heartbeatTimeoutRef.current = setInterval(sendHeartbeat, heartbeatInterval);
        
        onConnect?.();
      };

      ws.current.onmessage = handleMessage;

      ws.current.onclose = (event) => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          connectionQuality: 'disconnected'
        }));

        clearTimeouts();
        onDisconnect?.();

        // Attempt reconnection if not a clean close
        if (!event.wasClean && state.reconnectAttempt < reconnectAttempts) {
          setState(prev => ({ ...prev, reconnectAttempt: prev.reconnectAttempt + 1 }));
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval * Math.pow(1.5, state.reconnectAttempt)); // Exponential backoff
        }
      };

      ws.current.onerror = (error) => {
        setState(prev => ({
          ...prev,
          lastError: 'Connection error occurred',
          isConnecting: false,
          connectionQuality: 'disconnected'
        }));
        
        onError?.(error);
      };

    } catch (error) {
      setState(prev => ({
        ...prev,
        lastError: 'Failed to create WebSocket connection',
        isConnecting: false,
        connectionQuality: 'disconnected'
      }));
    }
  }, [url, protocols, reconnectAttempts, reconnectInterval, heartbeatInterval, state.reconnectAttempt, onConnect, onDisconnect, onError, handleMessage, sendHeartbeat, clearTimeouts]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    clearTimeouts();
    
    if (ws.current) {
      ws.current.close(1000, 'User disconnected');
      ws.current = null;
    }

    setState(prev => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      reconnectAttempt: 0,
      connectionQuality: 'disconnected'
    }));
  }, [clearTimeouts]);

  // Send message
  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: Date.now()
      };
      
      ws.current.send(JSON.stringify(fullMessage));
      return true;
    }
    return false;
  }, []);

  // Force reconnect
  const reconnect = useCallback(() => {
    disconnect();
    setState(prev => ({ ...prev, reconnectAttempt: 0 }));
    setTimeout(connect, 1000);
  }, [disconnect, connect]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...state,
    latency,
    connect,
    disconnect,
    reconnect,
    sendMessage
  };
}

// Specialized hook for SkillGlobe notifications
export function useSkillGlobeWebSocket() {
  const { user } = useUserStore();
  const { addNotification, markAsRead, updateUnreadCount } = useNotificationStore();
  
  const websocketUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://skillglobedev.m.frappe.cloud/ws';
  
  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'notification':
        addNotification({
          id: message.data.id || `ws-${Date.now()}`,
          type: message.data.type || 'info',
          title: message.data.title,
          message: message.data.message,
          timestamp: new Date(message.timestamp),
          read: false,
          priority: message.data.priority || 'medium',
          actionUrl: message.data.actionUrl,
          actionText: message.data.actionText
        });
        break;

      case 'notification_read':
        markAsRead(message.data.notificationId);
        break;

      case 'unread_count':
        updateUnreadCount(message.data.count);
        break;

      case 'opportunity_match':
        addNotification({
          id: `match-${message.data.opportunityId}`,
          type: 'success',
          title: 'New Opportunity Match!',
          message: `You have a ${message.data.matchPercentage}% match with ${message.data.company}`,
          timestamp: new Date(message.timestamp),
          read: false,
          priority: 'high',
          actionUrl: `/opportunities/${message.data.opportunityId}`,
          actionText: 'View Opportunity'
        });
        break;

      case 'interview_scheduled':
        addNotification({
          id: `interview-${message.data.interviewId}`,
          type: 'info',
          title: 'Interview Scheduled',
          message: `Interview with ${message.data.company} scheduled for ${new Date(message.data.scheduledAt).toLocaleDateString()}`,
          timestamp: new Date(message.timestamp),
          read: false,
          priority: 'high',
          actionUrl: `/interviews/${message.data.interviewId}`,
          actionText: 'View Details'
        });
        break;

      case 'skill_verification_complete':
        addNotification({
          id: `skill-${message.data.skillId}`,
          type: 'success',
          title: 'Skill Verified!',
          message: `Your ${message.data.skillName} skill has been verified`,
          timestamp: new Date(message.timestamp),
          read: false,
          priority: 'medium',
          actionUrl: '/skills',
          actionText: 'View Skills'
        });
        break;

      case 'message':
        addNotification({
          id: `msg-${message.data.messageId}`,
          type: 'info',
          title: `New message from ${message.data.senderName}`,
          message: message.data.preview,
          timestamp: new Date(message.timestamp),
          read: false,
          priority: 'medium',
          actionUrl: `/messages/${message.data.conversationId}`,
          actionText: 'View Message'
        });
        break;

      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  }, [addNotification, markAsRead, updateUnreadCount]);

  const webSocket = useWebSocket({
    url: user ? `${websocketUrl}?userId=${user.id}&token=${user.token}` : websocketUrl,
    reconnectAttempts: 10,
    reconnectInterval: 2000,
    heartbeatInterval: 25000,
    onConnect: () => {
      console.log('Connected to SkillGlobe WebSocket');
      // Send authentication if needed
      if (user) {
        webSocket.sendMessage({
          type: 'authenticate',
          data: { userId: user.id, token: user.token }
        });
      }
    },
    onDisconnect: () => {
      console.log('Disconnected from SkillGlobe WebSocket');
    },
    onError: (error) => {
      console.error('SkillGlobe WebSocket error:', error);
    },
    onMessage: handleMessage
  });

  // Subscribe to notifications
  const subscribeToNotifications = useCallback(() => {
    webSocket.sendMessage({
      type: 'subscribe',
      data: { channel: 'notifications' }
    });
  }, [webSocket]);

  // Subscribe to messages
  const subscribeToMessages = useCallback(() => {
    webSocket.sendMessage({
      type: 'subscribe',
      data: { channel: 'messages' }
    });
  }, [webSocket]);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    webSocket.sendMessage({
      type: 'mark_notification_read',
      data: { notificationId }
    });
  }, [webSocket]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((conversationId: string, isTyping: boolean) => {
    webSocket.sendMessage({
      type: 'typing',
      data: { conversationId, isTyping }
    });
  }, [webSocket]);

  useEffect(() => {
    if (webSocket.isConnected && user) {
      subscribeToNotifications();
      subscribeToMessages();
    }
  }, [webSocket.isConnected, user, subscribeToNotifications, subscribeToMessages]);

  return {
    ...webSocket,
    subscribeToNotifications,
    subscribeToMessages,
    markNotificationAsRead,
    sendTypingIndicator
  };
}