'use client';

import React, { useState, useEffect } from 'react';
import { X, Bell, MessageSquare, Check, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'interview' | 'match' | 'message' | 'application' | 'system' | 'success' | 'info' | 'warning' | 'error';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description?: string;
  actionUrl?: string;
  actionLabel?: string;
  timestamp: Date;
  read?: boolean;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: Date;
  read?: boolean;
  type: 'recruiter' | 'system' | 'user';
  avatar?: string;
}

interface QuickToolsPanelProps {
  notifications?: Notification[];
  messages?: Message[];
  onNotificationAction?: (notification: Notification) => void;
  onMessageAction?: (message: Message) => void;
  onMarkAsRead?: (type: 'notification' | 'message', id: string) => void;
  onMarkAllAsRead?: (type: 'notification' | 'message') => void;
}

export default function QuickToolsPanel({
  notifications = [],
  messages = [],
  onNotificationAction,
  onMessageAction,
  onMarkAsRead,
  onMarkAllAsRead
}: QuickToolsPanelProps) {
  const [activePanel, setActivePanel] = useState<'notifications' | 'messages' | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Mock messages for demo
  const mockMessages: Message[] = [
    {
      id: '1',
      from: 'TechCorp Recruiting',
      subject: 'Interview Invitation',
      preview: 'We would like to invite you for an interview for the Frontend Developer position...',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: 'recruiter',
      read: false
    },
    {
      id: '2',
      from: 'SkillGlobe System',
      subject: 'Profile Update Required',
      preview: 'Please update your work experience to improve your profile score...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: 'system',
      read: true
    }
  ];

  useEffect(() => {
    setUnreadNotifications(notifications.filter(n => !n.read).length);
    setUnreadMessages([...messages, ...mockMessages].filter(m => !m.read).length);
  }, [notifications, messages]);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'interview':
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'match':
      case 'success':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'application':
      case 'info':
        return <Bell className="w-4 h-4 text-blue-600" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  const getMessageTypeIcon = (type: Message['type']) => {
    switch (type) {
      case 'recruiter':
        return '🏢';
      case 'system':
        return '⚙️';
      case 'user':
        return '👤';
      default:
        return '📧';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead('notification', notification.id);
    }
    if (onNotificationAction) {
      onNotificationAction(notification);
    }
  };

  const handleMessageClick = (message: Message) => {
    if (!message.read && onMarkAsRead) {
      onMarkAsRead('message', message.id);
    }
    if (onMessageAction) {
      onMessageAction(message);
    }
  };

  const renderNotificationPanel = () => (
    <div className="w-96 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadNotifications > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                {unreadNotifications}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePanel(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {notifications.length > 0 && (
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={() => onMarkAllAsRead?.('notification')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "p-3 rounded-lg border-l-4 cursor-pointer transition-colors",
                  getPriorityColor(notification.priority),
                  notification.read ? "bg-gray-50" : "bg-white shadow-sm hover:shadow-md"
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        notification.read ? "text-gray-600" : "text-gray-900"
                      )}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                    </div>
                    {notification.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                    )}
                    {notification.actionLabel && (
                      <div className="flex items-center mt-2 text-xs text-blue-600">
                        <span>{notification.actionLabel}</span>
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </div>
                    )}
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const renderMessagePanel = () => (
    <div className="w-96 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Messages</h3>
            {unreadMessages > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {unreadMessages}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePanel(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {[...messages, ...mockMessages].length > 0 && (
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={() => onMarkAllAsRead?.('message')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {[...messages, ...mockMessages].length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No messages yet</p>
            </div>
          ) : (
            [...messages, ...mockMessages].map((message) => (
              <div
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors border",
                  message.read 
                    ? "bg-gray-50 border-gray-200" 
                    : "bg-white border-blue-200 shadow-sm hover:shadow-md"
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {message.avatar ? (
                      <img
                        src={message.avatar}
                        alt={message.from}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                        {getMessageTypeIcon(message.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        message.read ? "text-gray-600" : "text-gray-900"
                      )}>
                        {message.from}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTimeAgo(message.timestamp)}
                      </span>
                    </div>
                    <p className={cn(
                      "text-sm truncate mt-1",
                      message.read ? "text-gray-500" : "text-gray-700"
                    )}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {message.preview}
                    </p>
                  </div>
                  {!message.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  // Listen for global events to open panels
  useEffect(() => {
    const handleNotificationClick = () => setActivePanel('notifications');
    const handleMessageClick = () => setActivePanel('messages');

    // You can dispatch custom events from the navigation to open these panels
    window.addEventListener('openNotifications', handleNotificationClick);
    window.addEventListener('openMessages', handleMessageClick);

    return () => {
      window.removeEventListener('openNotifications', handleNotificationClick);
      window.removeEventListener('openMessages', handleMessageClick);
    };
  }, []);

  if (!activePanel) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 z-40">
      {activePanel === 'notifications' && renderNotificationPanel()}
      {activePanel === 'messages' && renderMessagePanel()}
    </div>
  );
}