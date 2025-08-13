'use client';

import React, { useEffect, useState } from 'react';
import { useWebSocketContext } from './WebSocketProvider';
import { useNotificationStore } from '@/store/notificationStore';
import { useAccessibilityContext } from '@/components/accessibility/AccessibilityProvider';
import { cn } from '@/lib/utils';
import { Clock, Users, TrendingUp, Briefcase, Star, MessageSquare } from 'lucide-react';

interface LiveActivity {
  id: string;
  type: 'profile_view' | 'opportunity_match' | 'skill_trending' | 'interview_scheduled' | 'verification_complete' | 'message_received';
  title: string;
  description: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isConnected } = useWebSocketContext();
  const { notifications } = useNotificationStore();
  const { announcePolite } = useAccessibilityContext();

  // Convert notifications to activities
  useEffect(() => {
    const recentActivities: LiveActivity[] = notifications
      .filter(n => Date.now() - n.timestamp.getTime() < 24 * 60 * 60 * 1000) // Last 24 hours
      .slice(0, 10)
      .map(notification => ({
        id: notification.id,
        type: getActivityType(notification.type),
        title: notification.title,
        description: notification.message,
        timestamp: notification.timestamp,
        priority: notification.priority as 'high' | 'medium' | 'low',
        actionUrl: notification.actionUrl,
        metadata: {}
      }));

    setActivities(recentActivities);
  }, [notifications]);

  const getActivityType = (notificationType: string): LiveActivity['type'] => {
    switch (notificationType) {
      case 'opportunity_match': return 'opportunity_match';
      case 'interview': return 'interview_scheduled';
      case 'verification': return 'verification_complete';
      case 'message': return 'message_received';
      case 'skill': return 'skill_trending';
      default: return 'profile_view';
    }
  };

  const getActivityIcon = (type: LiveActivity['type']) => {
    switch (type) {
      case 'profile_view': return <Users className="w-4 h-4" />;
      case 'opportunity_match': return <Briefcase className="w-4 h-4" />;
      case 'skill_trending': return <TrendingUp className="w-4 h-4" />;
      case 'interview_scheduled': return <Clock className="w-4 h-4" />;
      case 'verification_complete': return <Star className="w-4 h-4" />;
      case 'message_received': return <MessageSquare className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: LiveActivity['type'], priority: LiveActivity['priority']) => {
    const baseColors = {
      profile_view: 'text-blue-500 bg-blue-50',
      opportunity_match: 'text-green-500 bg-green-50',
      skill_trending: 'text-purple-500 bg-purple-50',
      interview_scheduled: 'text-orange-500 bg-orange-50',
      verification_complete: 'text-yellow-500 bg-yellow-50',
      message_received: 'text-indigo-500 bg-indigo-50'
    };

    const priorityModifier = priority === 'high' ? ' ring-2 ring-current ring-opacity-20' : '';
    return baseColors[type] + priorityModifier;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleActivityClick = (activity: LiveActivity) => {
    if (activity.actionUrl) {
      window.location.href = activity.actionUrl;
    }
    announcePolite(`Opened ${activity.title}`);
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">No Recent Activity</h3>
          <p className="text-sm text-gray-500">
            {isConnected ? 'Activity will appear here as it happens' : 'Connect to see live updates'}
          </p>
        </div>
      </div>
    );
  }

  const visibleActivities = isExpanded ? activities : activities.slice(0, 5);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
            {isConnected && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600 font-medium">Live</span>
              </div>
            )}
          </div>
          
          {activities.length > 5 && (
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                announcePolite(isExpanded ? 'Activity feed collapsed' : 'Activity feed expanded');
              }}
              className="text-sm text-orange-600 hover:text-orange-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md px-2 py-1"
            >
              {isExpanded ? 'Show Less' : `Show All (${activities.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-100">
        {visibleActivities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              'px-6 py-4 hover:bg-gray-50 transition-colors',
              activity.actionUrl && 'cursor-pointer'
            )}
            onClick={activity.actionUrl ? () => handleActivityClick(activity) : undefined}
            role={activity.actionUrl ? 'button' : undefined}
            tabIndex={activity.actionUrl ? 0 : undefined}
            onKeyDown={(e) => {
              if (activity.actionUrl && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleActivityClick(activity);
              }
            }}
            aria-label={activity.actionUrl ? `${activity.title}: ${activity.description}` : undefined}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                getActivityColor(activity.type, activity.priority)
              )}>
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {activity.title}
                      {activity.priority === 'high' && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          High Priority
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {activity.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Action indicator */}
                {activity.actionUrl && (
                  <div className="mt-2">
                    <span className="text-xs text-orange-600 font-medium">
                      Click to view details →
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connection Status Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              isConnected ? 'bg-green-500' : 'bg-red-500'
            )} />
            <span>
              {isConnected ? 'Real-time updates active' : 'Offline - showing cached activity'}
            </span>
          </div>
          
          <span>
            Last updated: {formatTimeAgo(activities[0]?.timestamp || new Date())}
          </span>
        </div>
      </div>
    </div>
  );
}

// Compact version for sidebar
export function CompactLiveActivity() {
  const [recentActivities, setRecentActivities] = useState<LiveActivity[]>([]);
  const { isConnected } = useWebSocketContext();
  const { notifications } = useNotificationStore();

  useEffect(() => {
    const recent = notifications
      .filter(n => Date.now() - n.timestamp.getTime() < 60 * 60 * 1000) // Last hour
      .slice(0, 3)
      .map(notification => ({
        id: notification.id,
        type: getActivityType(notification.type),
        title: notification.title,
        description: notification.message,
        timestamp: notification.timestamp,
        priority: notification.priority as 'high' | 'medium' | 'low',
        actionUrl: notification.actionUrl,
        metadata: {}
      }));

    setRecentActivities(recent);
  }, [notifications]);

  const getActivityType = (notificationType: string): LiveActivity['type'] => {
    switch (notificationType) {
      case 'opportunity_match': return 'opportunity_match';
      case 'interview': return 'interview_scheduled';
      case 'verification': return 'verification_complete';
      case 'message': return 'message_received';
      case 'skill': return 'skill_trending';
      default: return 'profile_view';
    }
  };

  if (recentActivities.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-3 text-center">
        {isConnected ? 'No recent activity' : 'Offline'}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentActivities.map(activity => (
        <div key={activity.id} className="text-sm">
          <div className="flex items-center space-x-2">
            <div className={cn(
              'w-2 h-2 rounded-full flex-shrink-0',
              activity.priority === 'high' ? 'bg-red-500 animate-pulse' :
              activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            )} />
            <span className="font-medium text-gray-900 truncate">
              {activity.title}
            </span>
          </div>
          <p className="text-gray-600 line-clamp-1 ml-4">
            {activity.description}
          </p>
        </div>
      ))}
    </div>
  );
}