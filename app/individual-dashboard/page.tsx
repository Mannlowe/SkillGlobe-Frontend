// 'use client';

// import { useState, useEffect } from 'react';
// import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
// import { ProgressiveGrid, ProgressiveList } from '@/components/ui/ProgressiveLoader';
// import { DashboardStatsSkeleton, OpportunityCardSkeleton, ProfileCardSkeleton } from '@/components/ui/SkeletonLoader';
// import LazyImage, { LazyAvatar } from '@/components/ui/LazyImage';
// import CompactMarketMetrics from '@/components/dashboard/CompactMarketMetrics';
// import CompactOpportunityCard from '@/components/dashboard/CompactOpportunityCard';
// import EnhancedStatsGrid from '@/components/dashboard/EnhancedStatsGrid';
// import OpportunityDiscoveryHub from '@/components/dashboard/OpportunityDiscoveryHub';
// import ApplicationPipelineManager from '@/components/dashboard/ApplicationPipelineManager';
// import CommunicationCenter from '@/components/dashboard/CommunicationCenter';
// import StrategicProfileOptimizer from '@/components/dashboard/StrategicProfileOptimizer';
// import FloatingCareerCoach from '@/components/dashboard/FloatingCareerCoach';
// import ProfileAnalytics from '@/components/dashboard/ProfileAnalytics';
// import ProfileLevelIndicator from '@/components/dashboard/ProfileLevelIndicator';
// import AchievementShowcase from '@/components/dashboard/AchievementBadges';
// import WeeklyChallenges from '@/components/dashboard/WeeklyChallenges';
// import SocialRecognition from '@/components/dashboard/SocialRecognition';
// import StreakTracker from '@/components/dashboard/StreakTracker';
// import { BarChart3, Users, Briefcase, TrendingUp, Calendar, Bell, Star, ArrowUpRight, Check as CheckIcon, Eye, Filter } from 'lucide-react';
// import { useAuthStore } from '@/store/authStore';
// import { useToast } from '@/hooks/use-toast';
// import { useRouter } from 'next/navigation';
// import { mockHeaderMetrics, mockEnhancedStats, mockJobOpportunities } from '@/lib/mockDashboardData';
// import { mockSavedSearches, mockApplications, mockConversations } from '@/lib/mockPhase2Data';
// import { mockProfileOptimizationHub, mockFloatingCareerCoach, mockProfileAnalytics } from '@/lib/mockPhase3Data';
// import { mockGamificationHub, mockLeaderboard } from '@/lib/mockPhase4Data';

// // Mock data for recent activities (compact version)
// const recentActivities = [
//   { id: 1, type: 'application', title: 'Applied to Senior React Developer', company: 'TechCorp', time: '2 hours ago', status: 'pending' },
//   { id: 2, type: 'interview', title: 'Interview scheduled', company: 'StartupXYZ', time: '1 day ago', status: 'scheduled' },
//   { id: 3, type: 'course', title: 'Completed Advanced React Course', company: 'SkillGlobe', time: '3 days ago', status: 'completed' },
// ];

// export default function CompactDashboardPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [userName, setUserName] = useState('User');
//   const [showCareerCoach, setShowCareerCoach] = useState(true);
//   const { user, isAuthenticated } = useAuthStore();
//   const { toast } = useToast();
//   const router = useRouter();
  
//   useEffect(() => {
//     const checkAuth = setTimeout(() => {
//       if (!isAuthenticated) {
//         router.push('/auth/login');
//       }
//     }, 100);
    
//     return () => clearTimeout(checkAuth);
//   }, [isAuthenticated, router]);
  
//   useEffect(() => {
//     if (isAuthenticated && user && window.location.pathname.includes('individual-dashboard')) {
//       setUserName(user.full_name || user.name);
//     }
//   }, [isAuthenticated, user]);

//   // Tab content components
//   const overviewContent = (
//     <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-rubik">
//       {/* Compact Market Metrics */}
//       <CompactMarketMetrics 
//         metrics={mockHeaderMetrics}
//         onViewDetails={() => console.log('View market details')}
//       />

//       {/* Two Column Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Top Opportunities */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Top Matches</h3>
//             <button className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1">View all →</button>
//           </div>
//           <div className="space-y-3">
//             {mockJobOpportunities.slice(0, 2).map((job) => (
//               <CompactOpportunityCard 
//                 key={job.id}
//                 opportunity={job}
//                 onApply={(id) => console.log('Apply:', id)}
//                 onSave={(id) => console.log('Save:', id)}
//                 onViewDetails={(id) => console.log('Details:', id)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
//             <button className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1">View all →</button>
//           </div>
//           <div className="space-y-3">
//             {recentActivities.map((activity) => (
//               <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                     activity.type === 'application' ? 'bg-blue-100' :
//                     activity.type === 'interview' ? 'bg-green-100' :
//                     'bg-purple-100'
//                   }`}>
//                     {activity.type === 'application' && <Briefcase className="text-blue-600" size={16} />}
//                     {activity.type === 'interview' && <Calendar className="text-green-600" size={16} />}
//                     {activity.type === 'course' && <BarChart3 className="text-purple-600" size={16} />}
//                   </div>
//                   <div>
//                     <p className="font-medium text-sm text-gray-900">{activity.title}</p>
//                     <p className="text-xs text-gray-600">{activity.company} • {activity.time}</p>
//                   </div>
//                 </div>
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                   activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                   activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
//                   'bg-green-100 text-green-800'
//                 }`}>
//                   {activity.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//     </div>
//   );

//   const opportunitiesContent = (
//     <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       <OpportunityDiscoveryHub
//         opportunities={mockJobOpportunities}
//         savedSearches={mockSavedSearches}
//         onSearch={(filters) => console.log('Search with filters:', filters)}
//         onSaveSearch={(search) => console.log('Save search:', search)}
//         onApply={(jobId) => console.log('Apply to job:', jobId)}
//         onSave={(jobId) => console.log('Save job:', jobId)}
//         onViewDetails={(jobId) => console.log('View job details:', jobId)}
//       />
//     </div>
//   );

//   const activityContent = (
//     <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
//       {/* Application Pipeline */}
//       <ApplicationPipelineManager
//         applications={mockApplications}
//         onUpdateApplication={(id, updates) => console.log('Update application:', id, updates)}
//         onAddNote={(id, note) => console.log('Add note:', id, note)}
//         onScheduleFollowup={(id, date, type) => console.log('Schedule followup:', id, date, type)}
//       />
      
//       {/* Enhanced Stats - Secondary */}
//       <EnhancedStatsGrid 
//         stats={mockEnhancedStats}
//         onActionClick={(action) => console.log('Action:', action)}
//         timeframe="30d"
//       />
//     </div>
//   );

//   const messagesContent = (
//     <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       <div style={{ height: 'calc(100vh - 200px)' }}>
//         <CommunicationCenter
//           conversations={mockConversations}
//           onSendMessage={(threadId, message) => console.log('Send message:', threadId, message)}
//           onScheduleInterview={(threadId, details) => console.log('Schedule interview:', threadId, details)}
//           onMarkAsRead={(messageId) => console.log('Mark as read:', messageId)}
//           onArchive={(messageId) => console.log('Archive:', messageId)}
//         />
//       </div>
//     </div>
//   );

//   const profileContent = (
//     <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
//       {/* Strategic Profile Optimizer */}
//       <StrategicProfileOptimizer
//         profileData={mockProfileOptimizationHub}
//         completionTasks={mockProfileOptimizationHub.strategic_completion.completion_priorities}
//         onTaskComplete={(taskId) => {
//           console.log('Task completed:', taskId);
//           toast({
//             title: "Task Completed!",
//             description: "Your profile has been updated successfully.",
//           });
//         }}
//         onSkillAdd={(skill) => console.log('Add skill:', skill)}
//         marketImpactMode={true}
//       />
      
//       {/* Profile Analytics */}
//       <ProfileAnalytics
//         analytics={mockProfileAnalytics}
//         onViewDetails={(section) => console.log('View details:', section)}
//       />
//     </div>
//   );

//   const insightsContent = (
//     <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
//       {/* Profile Level and Achievements Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Profile Level */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center">
//           <ProfileLevelIndicator
//             level={mockGamificationHub.user_stats.current_level}
//             size="large"
//             animated={true}
//           />
//         </div>

//         {/* Achievement Showcase */}
//         <AchievementShowcase
//           achievements={mockGamificationHub.achievements.earned.concat(mockGamificationHub.achievements.available)}
//           title="Recent Achievements"
//           maxDisplay={6}
//           onViewAll={() => console.log('View all achievements')}
//           onAchievementClick={(achievement) => {
//             console.log('Achievement clicked:', achievement);
//             toast({
//               title: achievement.name,
//               description: achievement.description,
//             });
//           }}
//         />
//       </div>

//       {/* Weekly Challenges */}
//       <WeeklyChallenges
//         challenges={mockGamificationHub.weekly_challenges.active}
//         onAcceptChallenge={(challengeId) => {
//           console.log('Accept challenge:', challengeId);
//           toast({
//             title: "Challenge Accepted!",
//             description: "Good luck achieving your goal!",
//           });
//         }}
//         onCompleteChallenge={(challengeId) => {
//           console.log('Complete challenge:', challengeId);
//           toast({
//             title: "Challenge Completed!",
//             description: "Congratulations! You've earned bonus points!",
//           });
//         }}
//         onViewAll={() => console.log('View all challenges')}
//       />

//       {/* Social Recognition & Streaks Row */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//         {/* Social Recognition */}
//         <SocialRecognition
//           socialData={mockGamificationHub.social_recognition}
//           leaderboard={mockLeaderboard}
//           onShareAchievement={(achievementName) => {
//             console.log('Share achievement:', achievementName);
//             toast({
//               title: "Shared!",
//               description: `Your ${achievementName} achievement has been shared!`,
//             });
//           }}
//           onViewProfile={(userId) => console.log('View profile:', userId)}
//         />

//         {/* Streak Tracker */}
//         <StreakTracker
//           streaks={mockGamificationHub.streaks}
//           onStreakClick={(type) => {
//             console.log('Streak clicked:', type);
//             toast({
//               title: "Streak Details",
//               description: `View your ${type.replace('_', ' ')} streak progress`,
//             });
//           }}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex min-h-screen bg-gray-50 max-w-full">
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
//         <main className="flex-1 overflow-y-auto scrollbar-custom">
//           {/* Custom scrollbar styles */}
//           <style jsx global>{`
//             .scrollbar-custom::-webkit-scrollbar {
//               width: 8px;
//             }
//             .scrollbar-custom::-webkit-scrollbar-track {
//               background: transparent;
//             }
//             .scrollbar-custom::-webkit-scrollbar-thumb {
//               background-color: rgba(255, 255, 255, 0.7);
//               border-radius: 20px;
//             }
//             .scrollbar-custom::-webkit-scrollbar-thumb:hover {
//               background-color: rgba(255, 255, 255, 0.9);
//             }
//             /* For Firefox */
//             .scrollbar-custom {
//               scrollbar-width: thin;
//               scrollbar-color: rgba(255, 255, 255, 0.7) transparent;
//             }
//           `}</style>
//           {/* Welcome Section - Minimal */}
//           <div className="bg-white border-b border-gray-200 max-w-full">
//             <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h1 className="text-xl md:text-2xl font-bold text-gray-900">
//                     Welcome back, {userName}!
//                   </h1>
//                   <p className="text-sm text-gray-600">
//                     Your career marketplace overview
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm">
//                     Quick Apply
//                   </button>
//                   <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//                     <Bell size={20} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {overviewContent}
//       </div>
      
//       {/* Floating Career Coach */}
//       {showCareerCoach && (
//         <FloatingCareerCoach
//           coachData={mockFloatingCareerCoach}
//           onClose={() => setShowCareerCoach(false)}
//           onMinimize={() => console.log('Minimize coach')}
//           onActionClick={(actionType, actionId) => {
//             console.log('Coach action:', actionType, actionId);
//             if (actionType === 'full-optimization') {
//               // Navigate to profile tab
//               const profileTab = document.querySelector('[role="tab"]:nth-child(5)') as HTMLButtonElement;
//               profileTab?.click();
//             }
//           }}
//         />
//       )}
//     </ModernLayoutWrapper>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import { ProgressiveGrid, ProgressiveList } from '@/components/ui/ProgressiveLoader';
import { DashboardStatsSkeleton, OpportunityCardSkeleton, ProfileCardSkeleton } from '@/components/ui/SkeletonLoader';
import LazyImage, { LazyAvatar } from '@/components/ui/LazyImage';
import CompactMarketMetrics from '@/components/dashboard/CompactMarketMetrics';
import CompactOpportunityCard from '@/components/dashboard/CompactOpportunityCard';
import EnhancedStatsGrid from '@/components/dashboard/EnhancedStatsGrid';
import OpportunityDiscoveryHub from '@/components/dashboard/OpportunityDiscoveryHub';
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
import { mockHeaderMetrics, mockEnhancedStats, mockJobOpportunities } from '@/lib/mockDashboardData';
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

  // Tab content components
  const overviewContent = (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-rubik">
      {/* Compact Market Metrics */}
      <CompactMarketMetrics 
        metrics={mockHeaderMetrics}
        onViewDetails={() => console.log('View market details')}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Opportunities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Matches</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1">View all →</button>
          </div>
          <div className="space-y-3">
            {mockJobOpportunities.slice(0, 2).map((job) => (
              <CompactOpportunityCard 
                key={job.id}
                opportunity={job}
                onApply={(id) => console.log('Apply:', id)}
                onSave={(id) => console.log('Save:', id)}
                onViewDetails={(id) => console.log('Details:', id)}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
        </div>
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
            <div className="bg-white border-b border-gray-200 max-w-full">
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
            </div>

            {overviewContent}
          </main>
        </div>
      </div>

      {/* Floating Career Coach */}
      {showCareerCoach && (
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
      )}
    </ModernLayoutWrapper>
  );
}
