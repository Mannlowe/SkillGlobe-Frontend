'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DynamicSidebar from './DynamicSidebar';
import HorizontalNavigation from './HorizontalNavigation';
import QuickToolsPanel from './QuickToolsPanel';
import SlideInDetailPane from './SlideInDetailPane';
import GlobalSearch from '@/components/ui/GlobalSearch';
import { useUILayout } from '@/contexts/UILayoutContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigation } from '@/contexts/SimpleNavigationContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/utils';

interface ModernLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function ModernLayout({ children, className }: ModernLayoutProps) {
  const pathname = usePathname();
  const [quickToolsActivePanel, setQuickToolsActivePanel] = useState<'notifications' | 'messages' | null>(null);
  
  // Layout state
  const {
    isSidebarOpen,
    isDetailPaneOpen,
    currentDetailId,
    currentDetailType,
    isMobile,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    openDetailPane,
    closeDetailPane
  } = useUILayout();

  // Notifications
  const { notifications, addNotification } = useNotifications();
  const [notificationCount, setNotificationCount] = useState(0);

  // Messages (mock data for now)
  const [messageCount] = useState(2);

  // Mock opportunity data for detail pane
  const [currentOpportunity, setCurrentOpportunity] = useState<any>(null);

  // Global search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Listen for global search keyboard shortcut
  useEffect(() => {
    const handleGlobalSearch = () => setIsSearchOpen(true);
    window.addEventListener('openGlobalSearch', handleGlobalSearch);
    return () => window.removeEventListener('openGlobalSearch', handleGlobalSearch);
  }, []);

  useEffect(() => {
    setNotificationCount(notifications.length);
  }, [notifications]);

  useEffect(() => {
    if (isDetailPaneOpen && currentDetailId && currentDetailType === 'opportunity') {
      // Mock opportunity data - in real app, this would fetch from API
      const mockOpportunity = {
        id: currentDetailId,
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        salary: { min: 120, max: 160, currency: 'USD' },
        postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        matchScore: 92,
        requirements: [
          { skill: 'React', level: 'Required' as const, userHas: true, userLevel: 'expert' as const },
          { skill: 'TypeScript', level: 'Required' as const, userHas: true, userLevel: 'advanced' as const },
          { skill: 'GraphQL', level: 'Preferred' as const, userHas: false },
          { skill: 'Next.js', level: 'Preferred' as const, userHas: true, userLevel: 'advanced' as const },
          { skill: 'Python', level: 'Nice-to-have' as const, userHas: false },
        ],
        description: 'We are looking for a passionate Senior Frontend Developer to join our growing team.',
        highlights: [
          'Work with cutting-edge technologies',
          'Remote-first company culture',
          'Equity package included',
          'Professional development budget'
        ],
        applicationStatus: 'not-applied' as const,
        aiInsights: {
          summary: 'Your React and TypeScript expertise aligns perfectly with this role.',
          strengths: ['Strong React expertise', 'TypeScript experience', 'Next.js knowledge'],
          improvements: ['Learn GraphQL basics', 'Add Python skills']
        }
      };
      setCurrentOpportunity(mockOpportunity);
    } else {
      setCurrentOpportunity(null);
    }
  }, [isDetailPaneOpen, currentDetailId, currentDetailType]);

  // Handle navigation events
  const handleNavigationClick = (type: 'notifications' | 'messages') => {
    setQuickToolsActivePanel(type);
  };

  const handleUserAction = (action: string) => {
    console.log('User action:', action);
  };

  // Handle opportunity interactions
  const handleOpportunityApply = (opportunityId: string, type: 'quick' | 'custom') => {
    console.log('Apply to opportunity:', opportunityId, type);
    
    addNotification({
      type: 'success',
      priority: 'medium',
      title: 'Application Submitted',
      description: `Your ${type} application has been submitted successfully`,
      actionUrl: `/opportunities/${opportunityId}`,
      actionLabel: 'View Status'
    });

    closeDetailPane();
  };

  const handleOpportunitySave = (opportunityId: string) => {
    console.log('Save opportunity:', opportunityId);
    
    addNotification({
      type: 'info',
      priority: 'low',
      title: 'Opportunity Saved',
      description: 'You can find saved opportunities in your bookmarks',
      actionUrl: '/opportunities/saved'
    });
  };

  const handleAskAI = (opportunityId: string, question: string) => {
    console.log('Ask AI:', opportunityId, question);
    
    addNotification({
      type: 'info',
      priority: 'low',
      title: 'AI Assistant',
      description: 'Your question has been sent to the AI assistant',
      actionUrl: '/ai-chat'
    });
  };

  // Handle mock opportunity card clicks
  const handleOpportunityClick = (opportunityId: string) => {
    openDetailPane(opportunityId, 'opportunity');
  };

  // Demo function to add sample notifications (for testing)
  const addSampleNotification = () => {
    const notifications = [
      {
        type: 'interview' as const,
        priority: 'high' as const,
        title: 'Interview Reminder',
        description: 'Your interview with TechCorp is in 2 hours',
        actionUrl: '/opportunities/interview/1'
      },
      {
        type: 'match' as const,
        priority: 'medium' as const,
        title: '3 New Matches',
        description: 'We found 3 new opportunities matching your React skills',
        actionUrl: '/opportunities'
      }
    ];
    
    const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
    addNotification(randomNotif);
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 font-rubik", className)}>
      {/* Horizontal Navigation */}
      <HorizontalNavigation
        onMenuClick={isMobile ? toggleSidebar : undefined}
        onSidebarToggle={!isMobile ? toggleSidebar : undefined}
        isSidebarOpen={isSidebarOpen}
        notifications={notificationCount}
        messages={messageCount}
        onNotificationClick={() => handleNavigationClick('notifications')}
        onMessageClick={() => handleNavigationClick('messages')}
        onSettingsClick={() => handleUserAction('settings')}
        onProfileClick={() => handleUserAction('profile')}
        userName="John Doe"
      />

      <div className="flex">
        {/* Dynamic Sidebar */}
        {(!isMobile || isSidebarOpen) && (
          <DynamicSidebar
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
            isMobile={isMobile}
          />
        )}

        {/* Main Content Area */}
        <main className={cn(
          "flex-1 transition-all duration-200 min-h-screen",
          isMobile ? "pb-16" : "", // Space for mobile bottom nav
          isDetailPaneOpen && !isMobile ? "mr-[600px] lg:mr-[700px]" : ""
        )}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Demo Content for opportunities page */}
            {pathname === '/opportunities' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
                  {/* <button 
                    onClick={addSampleNotification}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                  >
                    Add Sample Notification
                  </button> */}
                </div>
                
                {/* Mock opportunity cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((id) => (
                    <div
                      key={id}
                      onClick={() => handleOpportunityClick(id.toString())}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Frontend Developer {id}</h3>
                        <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                          {90 + id}% match
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">TechCorp {id} • San Francisco, CA</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>${100 + id * 10}k - ${120 + id * 10}k</span>
                        <span>2 days ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular page content */}
            {pathname !== '/opportunities' && children}
          </div>
        </main>
      </div>

      {/* Quick Tools Panel */}
      <QuickToolsPanel
        notifications={notifications}
        onNotificationAction={(notification) => {
          console.log('Notification action:', notification);
          if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
          }
        }}
        onMessageAction={(message) => {
          console.log('Message action:', message);
        }}
        onMarkAsRead={(type, id) => {
          console.log('Mark as read:', type, id);
        }}
        onMarkAllAsRead={(type) => {
          console.log('Mark all as read:', type);
        }}
      />

      {/* Slide-in Detail Pane */}
      <SlideInDetailPane
        isOpen={isDetailPaneOpen}
        onClose={closeDetailPane}
        opportunity={currentOpportunity}
        onApply={handleOpportunityApply}
        onSave={handleOpportunitySave}
        onAskAI={handleAskAI}
        isMobile={isMobile}
      />

      {/* Global Search */}
      <GlobalSearch 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

    </div>
  );
}