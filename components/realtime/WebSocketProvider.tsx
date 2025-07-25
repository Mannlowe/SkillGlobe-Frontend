'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSkillGlobeWebSocket } from '@/hooks/useWebSocket';
import { useNotificationStore } from '@/store/notificationStore';
import { useUserStore } from '@/store/userStore';
import { useAccessibilityContext } from '@/components/accessibility/AccessibilityProvider';

interface WebSocketContextType {
  isConnected: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  latency: number;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { user } = useUserStore();
  const { announcePolite } = useAccessibilityContext();
  const [hasShownConnectionStatus, setHasShownConnectionStatus] = useState(false);
  
  const webSocket = useSkillGlobeWebSocket();

  // Announce connection status changes to screen readers
  useEffect(() => {
    if (!hasShownConnectionStatus && webSocket.isConnected) {
      announcePolite('Real-time notifications connected');
      setHasShownConnectionStatus(true);
    } else if (hasShownConnectionStatus && !webSocket.isConnected && webSocket.connectionQuality === 'disconnected') {
      announcePolite('Real-time notifications disconnected');
    }
  }, [webSocket.isConnected, webSocket.connectionQuality, hasShownConnectionStatus, announcePolite]);

  const contextValue: WebSocketContextType = {
    isConnected: webSocket.isConnected,
    connectionQuality: webSocket.connectionQuality,
    latency: webSocket.latency,
    reconnect: webSocket.reconnect
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
      
      {/* Connection Status Indicator */}
      <ConnectionStatusIndicator 
        isConnected={webSocket.isConnected}
        connectionQuality={webSocket.connectionQuality}
        latency={webSocket.latency}
        onReconnect={webSocket.reconnect}
      />
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
}

// Connection Status Indicator Component
interface ConnectionStatusIndicatorProps {
  isConnected: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  latency: number;
  onReconnect: () => void;
}

function ConnectionStatusIndicator({
  isConnected,
  connectionQuality,
  latency,
  onReconnect
}: ConnectionStatusIndicatorProps) {
  const [showStatus, setShowStatus] = useState(false);
  const [wasConnected, setWasConnected] = useState(isConnected);

  // Show status when connection changes
  useEffect(() => {
    if (wasConnected !== isConnected) {
      setShowStatus(true);
      setWasConnected(isConnected);
      
      // Auto-hide after 3 seconds if connected
      if (isConnected) {
        setTimeout(() => setShowStatus(false), 3000);
      }
    }
  }, [isConnected, wasConnected]);

  // Don't show if connected and not explicitly shown
  if (isConnected && !showStatus) {
    return null;
  }

  const getStatusColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'poor': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected from real-time updates';
    return `Connected • ${connectionQuality} quality • ${latency}ms`;
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        showStatus ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-80">
        <div className="flex items-center space-x-3">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}>
              {isConnected && (
                <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
              )}
            </div>
            <span className="text-sm font-medium text-gray-900">
              Real-time Updates
            </span>
          </div>
          
          {/* Dismiss button */}
          {isConnected && (
            <button
              onClick={() => setShowStatus(false)}
              className="ml-auto text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md p-1"
              aria-label="Dismiss connection status"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mt-1">
          {getStatusText()}
        </p>
        
        {/* Reconnect button for disconnected state */}
        {!isConnected && (
          <div className="mt-3 flex space-x-2">
            <button
              onClick={onReconnect}
              className="px-3 py-1 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Reconnect
            </button>
            <button
              onClick={() => setShowStatus(false)}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Real-time Notification Toast
interface RealtimeNotificationProps {
  notification: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
  };
  onDismiss: (id: string) => void;
  onAction?: (url: string) => void;
}

export function RealtimeNotification({
  notification,
  onDismiss,
  onAction
}: RealtimeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { announceAssertive } = useAccessibilityContext();

  useEffect(() => {
    // Slide in animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Announce to screen readers
    announceAssertive(`${notification.title}: ${notification.message}`);
    
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  const handleAction = () => {
    if (notification.actionUrl) {
      onAction?.(notification.actionUrl);
      handleDismiss();
    }
  };

  const getNotificationStyles = () => {
    const baseStyles = 'border-l-4';
    switch (notification.type) {
      case 'success': return `${baseStyles} border-green-500 bg-green-50`;
      case 'error': return `${baseStyles} border-red-500 bg-red-50`;
      case 'warning': return `${baseStyles} border-yellow-500 bg-yellow-50`;
      case 'info': return `${baseStyles} border-blue-500 bg-blue-50`;
      default: return `${baseStyles} border-gray-500 bg-gray-50`;
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-96 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`rounded-lg shadow-lg p-4 ${getNotificationStyles()}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 text-lg">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {notification.message}
            </p>
            
            {notification.actionUrl && (
              <button
                onClick={handleAction}
                className="mt-2 text-sm font-medium text-orange-600 hover:text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md"
              >
                {notification.actionText || 'View'}
              </button>
            )}
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md p-1"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for managing real-time notifications display
export function useRealtimeNotifications() {
  const [displayedNotifications, setDisplayedNotifications] = useState<string[]>([]);
  const { notifications } = useNotificationStore();

  // Show new unread notifications
  useEffect(() => {
    const newNotifications = notifications
      .filter(n => !n.read && !displayedNotifications.includes(n.id))
      .slice(0, 3); // Limit to 3 simultaneous notifications

    newNotifications.forEach(notification => {
      setDisplayedNotifications(prev => [...prev, notification.id]);
    });
  }, [notifications, displayedNotifications]);

  const dismissNotification = (id: string) => {
    setDisplayedNotifications(prev => prev.filter(nId => nId !== id));
  };

  const currentNotifications = notifications.filter(n => 
    displayedNotifications.includes(n.id) && !n.read
  );

  return {
    notifications: currentNotifications,
    dismissNotification
  };
}