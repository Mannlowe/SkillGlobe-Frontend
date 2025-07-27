'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Clock, 
  BarChart3
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';

interface ApplicationsLayoutProps {
  children: React.ReactNode;
}

export default function ApplicationsLayout({ children }: ApplicationsLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab based on pathname
  const getActiveTab = () => {
    if (pathname === '/applications') return 'tracker';
    if (pathname === '/applications/history') return 'history';
    if (pathname === '/applications/analytics') return 'analytics';
    return 'tracker';
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case 'tracker':
        router.push('/applications');
        break;
      case 'history':
        router.push('/applications/history');
        break;
      case 'analytics':
        router.push('/applications/analytics');
        break;
    }
  };

  return (
    <ModernLayoutWrapper>
      <div className="w-full">
        {/* Tab Navigation - Fixed below main header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-30 -mx-6 -mt-6 mb-6">
          <div className="px-6 pt-6">
            <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 bg-transparent border-0 p-0">
                <TabsTrigger 
                  value="tracker" 
                  className={cn(
                    "flex items-center gap-2 h-12 rounded-none border-b-2 bg-transparent",
                    "data-[state=active]:border-[#FF6B35] data-[state=active]:text-[#FF6B35]",
                    "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-600",
                    "hover:text-gray-900 transition-colors"
                  )}
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Application Tracker</span>
                  <span className="sm:hidden">Tracker</span>
                  <Badge variant="secondary" className="ml-1 text-xs bg-blue-100 text-blue-700 hidden sm:inline-flex">
                    New
                  </Badge>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="history" 
                  className={cn(
                    "flex items-center gap-2 h-12 rounded-none border-b-2 bg-transparent",
                    "data-[state=active]:border-[#FF6B35] data-[state=active]:text-[#FF6B35]",
                    "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-600",
                    "hover:text-gray-900 transition-colors"
                  )}
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Application History</span>
                  <span className="sm:hidden">History</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="analytics" 
                  className={cn(
                    "flex items-center gap-2 h-12 rounded-none border-b-2 bg-transparent",
                    "data-[state=active]:border-[#FF6B35] data-[state=active]:text-[#FF6B35]",
                    "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-600",
                    "hover:text-gray-900 transition-colors"
                  )}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Analytics & Insights</span>
                  <span className="sm:hidden">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Page Content */}
        <div className="min-h-[calc(100vh-12rem)]">
          {children}
        </div>
      </div>
    </ModernLayoutWrapper>
  );
}