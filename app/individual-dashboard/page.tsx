'use client';

import { useState, useEffect } from 'react';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import { ProgressiveGrid, ProgressiveList } from '@/components/ui/ProgressiveLoader';
import { DashboardStatsSkeleton, OpportunityCardSkeleton, ProfileCardSkeleton } from '@/components/ui/SkeletonLoader';
import LazyImage, { LazyAvatar } from '@/components/ui/LazyImage';
import CompactMarketMetrics from '@/components/dashboard/CompactMarketMetrics';
import CompactOpportunityCard from '@/components/dashboard/CompactOpportunityCard';
import EnhancedStatsGrid from '@/components/dashboard/EnhancedStatsGrid';
import ApplicationPipelineManager from '@/components/dashboard/ApplicationPipelineManager';
import CommunicationCenter from '@/components/dashboard/CommunicationCenter';
import StrategicProfileOptimizer from '@/components/dashboard/StrategicProfileOptimizer';
import FloatingCareerCoach from '@/components/dashboard/FloatingCareerCoach';
import ProfileAnalytics from '@/components/dashboard/ProfileAnalytics';
import ProfileLevelIndicator from '@/components/dashboard/ProfileLevelIndicator';
import AchievementShowcase from '@/components/dashboard/AchievementBadges';
import WeeklyChallenges from '@/components/dashboard/WeeklyChallenges';
import SocialRecognition from '@/components/dashboard/SocialRecognition';
import StreakTracker from '@/components/dashboard/StreakTracker';
import { BarChart3, Users, Briefcase, TrendingUp, Calendar, Bell, Star, ArrowUpRight, Check as CheckIcon, Eye, Filter } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { mockHeaderMetrics, mockEnhancedStats } from '@/lib/mockDashboardData';
import { useIndividualDashboardStore } from '@/store/dashboard/individualdashboardStore';
import { mockSavedSearches, mockApplications, mockConversations } from '@/lib/mockPhase2Data';
import { mockProfileOptimizationHub, mockFloatingCareerCoach, mockProfileAnalytics } from '@/lib/mockPhase3Data';
import { mockGamificationHub, mockLeaderboard } from '@/lib/mockPhase4Data';
import DynamicSidebar from '@/components/layout/DynamicSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// Mock data for recent activities (compact version)
const recentActivities = [
  { id: 1, type: 'application', title: 'Applied to Senior React Developer', company: 'TechCorp', time: '2 hours ago', status: 'pending' },
  { id: 2, type: 'interview', title: 'Interview scheduled', company: 'StartupXYZ', time: '1 day ago', status: 'scheduled' },
  { id: 3, type: 'course', title: 'Completed Advanced React Course', company: 'SkillGlobe', time: '3 days ago', status: 'completed' },
];

export default function CompactDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [showCareerCoach, setShowCareerCoach] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  
  // Get opportunity data from store
  const { 
    opportunities, 
    isLoadingOpportunities, 
    opportunityError,
    fetchOpportunityMatches 
  } = useIndividualDashboardStore();
  
  useEffect(() => {
    const checkAuth = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/auth/login');
      }
    }, 100);
    
    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, router]);
  
  useEffect(() => {
    if (isAuthenticated && user && window.location.pathname.includes('individual-dashboard')) {
      setUserName(user.full_name || user.name);
    }
  }, [isAuthenticated, user]);

  // Fetch opportunities when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchOpportunityMatches();
    }
  }, [isAuthenticated, fetchOpportunityMatches]);

  // Tab content components
  const overviewContent = (
    <div className="w-full py-2 space-y-6 font-rubik">
      {/* Compact Market Metrics */}
      <CompactMarketMetrics 
        onViewDetails={() => console.log('View market details')}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Top Opportunities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Matches</h3>
            <button
            onClick={() => router.push('/opportunities')}
            className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1">View all →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingOpportunities ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading opportunities...</span>
              </div>
            ) : opportunityError ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="bg-red-50 rounded-full p-4 mb-4">
                  <Briefcase className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Opportunities Found</h3>
                <p className="text-gray-500 text-center max-w-sm mb-4">
                  We couldn't load your opportunities right now.
                </p>
                <button 
                  onClick={() => fetchOpportunityMatches()}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
                >
                  Refresh
                </button>
              </div>
            ) : opportunities && opportunities.length > 0 ? (
              opportunities
                .filter(job => job.match_score >= 85 || job.buyer_interested)
                .slice(0, 3)
                .map((job) => (
                  <CompactOpportunityCard 
                    key={job.id}
                    opportunity={job}
                    opportunityMatches={opportunities}
                    onApply={(id) => console.log('Apply:', id)}
                    onSave={(id) => console.log('Save:', id)}
                    onViewDetails={(id) => console.log('Details:', id)}
                  />
                ))
            ) : !isLoadingOpportunities && !opportunityError ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="bg-gray-50 rounded-full p-4 mb-4">
                  <Briefcase className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities Found</h3>
                <p className="text-gray-500 text-center max-w-sm">
                  We're working to find the perfect matches for your skills. Check back soon or update your profile to improve matches.
                </p>
                <button 
                  onClick={() => router.push('/profile')}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
                >
                  Update Profile
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Recent Activity */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1">View all →</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'application' ? 'bg-blue-100' :
                    activity.type === 'interview' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'application' && <Briefcase className="text-blue-600" size={16} />}
                    {activity.type === 'interview' && <Calendar className="text-green-600" size={16} />}
                    {activity.type === 'course' && <BarChart3 className="text-purple-600" size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.company} • {activity.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div> */}
      </div>

    </div>
  );

  return (
    <ModernLayoutWrapper>
      <div className="flex min-h-screen bg-gray-50 max-w-full">
        <DynamicSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <DashboardHeader onMenuClick={() => setSidebarOpen(true)} /> */}
          
          <main className="flex-1 overflow-y-auto scrollbar-custom">
            {/* Custom scrollbar styles */}
            <style jsx global>{`
              .scrollbar-custom::-webkit-scrollbar {
                width: 8px;
              }
              .scrollbar-custom::-webkit-scrollbar-track {
                background: transparent;
              }
              .scrollbar-custom::-webkit-scrollbar-thumb {
                background-color: rgba(255, 255, 255, 0.7);
                border-radius: 20px;
              }
              .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                background-color: rgba(255, 255, 255, 0.9);
              }
              /* For Firefox */
              .scrollbar-custom {
                scrollbar-width: thin;
                scrollbar-color: rgba(255, 255, 255, 0.7) transparent;
              }
            `}</style>

            {/* Welcome Section - Minimal */}
            {/* <div className="bg-white border-b border-gray-200 max-w-full rounded-lg">
              <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                      Welcome back, {userName}!
                    </h1>
                    <p className="text-sm text-gray-600">
                      Your career marketplace overview
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm">
                      Quick Apply
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Bell size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div> */}

            {overviewContent}
          </main>
        </div>
      </div>

      {/* Floating Career Coach */}
      {/* {showCareerCoach && (
        <FloatingCareerCoach
          coachData={mockFloatingCareerCoach}
          onClose={() => setShowCareerCoach(false)}
          onMinimize={() => console.log('Minimize coach')}
          onActionClick={(actionType, actionId) => {
            console.log('Coach action:', actionType, actionId);
            if (actionType === 'full-optimization') {
              const profileTab = document.querySelector('[role="tab"]:nth-child(5)') as HTMLButtonElement;
              profileTab?.click();
            }
          }} 
        />
      )} */}
    </ModernLayoutWrapper>
  );
}
