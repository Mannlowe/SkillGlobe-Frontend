'use client';

import { useState } from 'react';
import { MessageSquare, Search, Filter, Phone, Video, Calendar, Paperclip, Send, MoreHorizontal, Star, Archive, Trash2 } from 'lucide-react';
import type { ConversationThread, ThreadMessage } from '@/types/opportunities';
import { StandardizedButton } from '@/components/ui/StandardizedButton';

interface Message {
  id: string;
  type: 'recruiter' | 'employer' | 'platform' | 'networking';
  from: {
    name: string;
    company: string;
    avatar: string;
    role: string;
  };
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  priority: 'high' | 'medium' | 'low';
  hasAttachment: boolean;
  applicationId?: string;
}


interface CommunicationCenterProps {
  conversations: ConversationThread[];
  onSendMessage: (threadId: string, message: string) => void;
  onScheduleInterview: (threadId: string, details: any) => void;
  onMarkAsRead: (messageId: string) => void;
  onArchive: (messageId: string) => void;
}

export default function CommunicationCenter({
  conversations,
  onSendMessage,
  onScheduleInterview,
  onMarkAsRead,
  onArchive
}: CommunicationCenterProps) {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'unread' | 'starred' | 'recruiter' | 'employer'>('all');

  const quickReplies = [
    "Thank you for your message. I'm very interested in this opportunity.",
    "I'm available for an interview at your convenience.",
    "Could you please provide more details about the role?",
    "I've attached my updated resume for your review.",
    "When would be a good time to discuss this further?"
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recruiter': return 'bg-blue-100 text-blue-700';
      case 'employer': return 'bg-green-100 text-green-700';
      case 'platform': return 'bg-gray-100 text-gray-700';
      case 'networking': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (searchQuery) {
      return conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             conv.participant.company.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    switch (filterBy) {
      case 'unread': return conv.unreadCount > 0;
      case 'starred': return false; // Add starred logic
      case 'recruiter': return conv.type === 'job_inquiry';
      case 'employer': return conv.type === 'interview';
      default: return true;
    }
  });

  const selectedConversation = conversations.find(c => c.id === selectedThread);

  const handleSendMessage = () => {
    if (messageText.trim() && selectedThread) {
      onSendMessage(selectedThread, messageText);
      setMessageText('');
    }
  };

  return (
    <div className="flex h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1">
            {['all', 'unread', 'recruiter', 'employer'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterBy(filter as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  filterBy === filter
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter}
                {filter === 'unread' && conversations.filter(c => c.unreadCount > 0).length > 0 && (
                  <span className="ml-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {conversations.filter(c => c.unreadCount > 0).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedThread(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedThread === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {conversation.participant.name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    conversation.participant.status === 'online' ? 'bg-green-500' :
                    conversation.participant.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-medium text-sm truncate ${
                      conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {conversation.participant.name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1">{conversation.participant.company}</p>
                  
                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                  }`}>
                    {conversation.lastMessage.content}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(conversation.type)}`}>
                      {conversation.type.replace('_', ' ')}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Conversation View */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {selectedConversation.participant.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedConversation.participant.name}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.participant.role} at {selectedConversation.participant.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Phone size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Video size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Calendar size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'self' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'self'
                      ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'self' ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t border-gray-100">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickReplies.slice(0, 3).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => setMessageText(reply)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {reply.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end gap-3">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Paperclip size={20} />
                </button>
                
                <div className="flex-1">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>

                <StandardizedButton
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  variant="primary"
                  size="icon"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </StandardizedButton>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}