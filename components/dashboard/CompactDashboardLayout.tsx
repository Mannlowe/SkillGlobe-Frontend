'use client';

import { useState } from 'react';
import { LayoutGrid, TrendingUp, Briefcase, MessageSquare, Trophy, User } from 'lucide-react';

interface TabConfig {
  id: string;
  label: string;
  icon: any;
  badge?: number;
}

interface CompactDashboardLayoutProps {
  children: {
    overview: React.ReactNode;
    opportunities: React.ReactNode;
    activity: React.ReactNode;
    messages?: React.ReactNode;
    insights?: React.ReactNode;
    profile?: React.ReactNode;
  };
  defaultTab?: string;
}

export default function CompactDashboardLayout({ children, defaultTab = 'overview' }: CompactDashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase, badge: 15 },
    { id: 'activity', label: 'Activity', icon: TrendingUp },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { id: 'profile', label: 'Profile', icon: User, badge: 5 },
    { id: 'insights', label: 'Insights', icon: Trophy, badge: 2 },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation - Horizontal on Desktop, Scrollable on Mobile */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-all duration-200
                    ${isActive 
                      ? 'border-orange-500 text-orange-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`
                      ml-1.5 px-2 py-0.5 text-xs rounded-full
                      ${isActive 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content - Full height minus header */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {activeTab === 'overview' && children.overview}
          {activeTab === 'opportunities' && children.opportunities}
          {activeTab === 'activity' && children.activity}
          {activeTab === 'messages' && (children.messages || <EmptyState type="messages" />)}
          {activeTab === 'profile' && (children.profile || <EmptyState type="profile" />)}
          {activeTab === 'insights' && (children.insights || <EmptyState type="insights" />)}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ type }: { type: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-gray-500">No {type} available yet</p>
      </div>
    </div>
  );
}