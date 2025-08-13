'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWebSocketContext } from './WebSocketProvider';
import { useSkillGlobeWebSocket } from '@/hooks/useWebSocket';
import { useAccessibilityContext } from '@/components/accessibility/AccessibilityProvider';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Users } from 'lucide-react';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  read: boolean;
  edited?: boolean;
  replyTo?: string;
}

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    online: boolean;
    lastSeen?: Date;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  typing: string[]; // User IDs currently typing
}

interface RealtimeMessagingProps {
  userId: string;
  conversationId?: string;
  className?: string;
}

export function RealtimeMessaging({ userId, conversationId, className }: RealtimeMessagingProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(conversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { isConnected } = useWebSocketContext();
  const webSocket = useSkillGlobeWebSocket();
  const { announcePolite } = useAccessibilityContext();

  // Handle incoming WebSocket messages
  useEffect(() => {
    const handleWebSocketMessage = (data: any) => {
      switch (data.type) {
        case 'message':
          handleNewMessage(data.data);
          break;
        case 'typing':
          handleTypingIndicator(data.data);
          break;
        case 'message_read':
          handleMessageRead(data.data);
          break;
        case 'user_online':
          handleUserOnlineStatus(data.data);
          break;
      }
    };

    // This would be connected to the WebSocket message handler
    // For now, we'll simulate it with mock data
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        type: 'direct',
        name: 'Sarah Johnson',
        participants: [
          { id: 'user-1', name: 'Sarah Johnson', online: true },
          { id: userId, name: 'You', online: true }
        ],
        unreadCount: 2,
        typing: []
      },
      {
        id: 'conv-2',
        type: 'group',
        name: 'Frontend Developers',
        participants: [
          { id: 'user-2', name: 'Mike Chen', online: true },
          { id: 'user-3', name: 'Emma Wilson', online: false, lastSeen: new Date(Date.now() - 30 * 60 * 1000) },
          { id: userId, name: 'You', online: true }
        ],
        unreadCount: 0,
        typing: ['user-2']
      }
    ];

    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-1',
        senderName: 'Sarah Johnson',
        content: 'Hi! I saw your profile and I\'m interested in discussing a Frontend Developer position at our company.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'text',
        read: true
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: userId,
        senderName: 'You',
        content: 'That sounds great! I\'d love to learn more about the role and your company.',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        type: 'text',
        read: true
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        senderId: 'user-1',
        senderName: 'Sarah Johnson',
        content: 'Perfect! Are you available for a quick call this week to discuss the opportunity?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text',
        read: false
      }
    ];

    setConversations(mockConversations);
    if (activeConversation) {
      setMessages(mockMessages.filter(m => m.conversationId === activeConversation));
    }
  };

  const handleNewMessage = (messageData: any) => {
    const message: Message = {
      id: messageData.id,
      conversationId: messageData.conversationId,
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      content: messageData.content,
      timestamp: new Date(messageData.timestamp),
      type: messageData.type || 'text',
      read: messageData.senderId === userId
    };

    setMessages(prev => [...prev, message]);
    
    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === message.conversationId 
        ? { ...conv, lastMessage: message, unreadCount: conv.unreadCount + (message.senderId !== userId ? 1 : 0) }
        : conv
    ));

    // Announce new message to screen readers
    if (message.senderId !== userId) {
      announcePolite(`New message from ${message.senderName}: ${message.content}`);
    }

    // Scroll to bottom
    scrollToBottom();
  };

  const handleTypingIndicator = (data: { conversationId: string; userId: string; isTyping: boolean; userName: string }) => {
    if (data.conversationId === activeConversation) {
      setTypingUsers(prev => 
        data.isTyping 
          ? [...prev.filter(id => id !== data.userId), data.userId]
          : prev.filter(id => id !== data.userId)
      );
    }

    // Update conversation typing status
    setConversations(prev => prev.map(conv =>
      conv.id === data.conversationId
        ? {
            ...conv,
            typing: data.isTyping
              ? [...conv.typing.filter(id => id !== data.userId), data.userId]
              : conv.typing.filter(id => id !== data.userId)
          }
        : conv
    ));
  };

  const handleMessageRead = (data: { messageId: string }) => {
    setMessages(prev => prev.map(msg =>
      msg.id === data.messageId ? { ...msg, read: true } : msg
    ));
  };

  const handleUserOnlineStatus = (data: { userId: string; online: boolean; lastSeen?: Date }) => {
    setConversations(prev => prev.map(conv => ({
      ...conv,
      participants: conv.participants.map(p =>
        p.id === data.userId
          ? { ...p, online: data.online, lastSeen: data.lastSeen }
          : p
      )
    })));
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation || !isConnected) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation,
      senderId: userId,
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      read: true
    };

    // Add to local state immediately (optimistic update)
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Send via WebSocket
    webSocket.sendMessage({
      type: 'send_message',
      data: {
        conversationId: activeConversation,
        content: message.content,
        type: 'text'
      }
    });

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      webSocket.sendTypingIndicator(activeConversation, false);
    }

    scrollToBottom();
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);

    if (!activeConversation) return;

    // Start typing indicator
    if (!isTyping && value.trim()) {
      setIsTyping(true);
      webSocket.sendTypingIndicator(activeConversation, true);
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        webSocket.sendTypingIndicator(activeConversation, false);
      }
    }, 3000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const activeConv = conversations.find(c => c.id === activeConversation);
  const activeMessages = messages.filter(m => m.conversationId === activeConversation);

  return (
    <div className={cn('flex h-96 bg-white border border-gray-200 rounded-lg overflow-hidden', className)}>
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Messages</h3>
          <div className="flex items-center space-x-1 mt-1">
            <div className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-green-500' : 'bg-red-500')} />
            <span className="text-xs text-gray-500">
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={cn(
                'p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50',
                activeConversation === conversation.id && 'bg-orange-50 border-orange-200'
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveConversation(conversation.id);
                }
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm text-gray-900 truncate">
                  {conversation.name}
                </h4>
                {conversation.unreadCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 truncate flex-1">
                  {conversation.typing.length > 0
                    ? `${conversation.typing.length === 1 ? 'Someone is' : `${conversation.typing.length} people are`} typing...`
                    : conversation.lastMessage?.content || 'No messages yet'
                  }
                </p>
                <div className="flex items-center space-x-1 ml-2">
                  {conversation.participants.some(p => p.online && p.id !== userId) && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{activeConv.name}</h3>
                  {activeConv.participants.some(p => p.online && p.id !== userId) && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.senderId === userId ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                      message.senderId === userId
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    )}
                  >
                    {message.senderId !== userId && activeConv.type === 'group' && (
                      <div className="text-xs font-medium mb-1 opacity-75">
                        {message.senderName}
                      </div>
                    )}
                    <div className="text-sm">{message.content}</div>
                    <div className={cn(
                      'text-xs mt-1 opacity-75',
                      message.senderId === userId ? 'text-right' : 'text-left'
                    )}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-xs ml-2">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <Paperclip className="w-4 h-4" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    disabled={!isConnected}
                  />
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <Smile className="w-4 h-4" />
                </button>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}