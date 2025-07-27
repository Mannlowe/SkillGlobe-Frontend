'use client';

import { useState, useEffect } from 'react';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import { ProgressiveGrid, ProgressiveList } from '@/components/ui/ProgressiveLoader';
import { DashboardStatsSkeleton, OpportunityCardSkeleton, ProfileCardSkeleton } from '@/components/ui/SkeletonLoader';
import LazyImage, { LazyAvatar } from '@/components/ui/LazyImage';
import CompactMarketMetrics from '@/components/dashboard/CompactMarketMetrics';
import CompactOpportunityCard from '@/components/dashboard/CompactOpportunityCard';
import EmployerInterestCard from '@/components/dashboard/EmployerInterestCard';
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
import { BarChart3, Users, Briefcase, TrendingUp, Calendar, Bell, Star, ArrowUpRight, Check as CheckIcon, Eye, Filter, Heart, Handshake } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { mockHeaderMetrics, mockEnhancedStats, mockJobOpportunities } from '@/lib/mockDashboardData';
import { mockSavedSearches, mockApplications, mockConversations } from '@/lib/mockPhase2Data';
import { mockProfileOptimizationHub, mockFloatingCareerCoach, mockProfileAnalytics } from '@/lib/mockPhase3Data';
import { mockGamificationHub, mockLeaderboard } from '@/lib/mockPhase4Data';
import '@/lib/mockUserData'; // Initialize mock user data for demo
import SlideInDetailPane from '@/components/layout/SlideInDetailPane';
import type { JobOpportunity } from '@/types/dashboard';

// Mock data for recent activities (compact version)
const recentActivities = [
  { id: 1, type: 'application', title: 'Applied to Senior React Developer', company: 'TechCorp', time: '2 hours ago', status: 'pending' },
  { id: 2, type: 'interview', title: 'Interview scheduled', company: 'StartupXYZ', time: '1 day ago', status: 'scheduled' },
  { id: 3, type: 'course', title: 'Completed Advanced React Course', company: 'SkillGlobe', time: '3 days ago', status: 'completed' },
];

// Types for matchmaking
interface InterestExpression {
  opportunityId: string;
  interest: 'yes' | 'maybe' | 'no';
  timestamp: string;
}

interface MutualInterest {
  opportunityId: string;
  opportunity: JobOpportunity;
  status: 'new' | 'contacted' | 'interviewing';
  nextAction: string;
}

export default function CompactDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Amit Verma');
  const [showCareerCoach, setShowCareerCoach] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<JobOpportunity | null>(null);
  const [isDetailPaneOpen, setIsDetailPaneOpen] = useState(false);
  const [userInterests, setUserInterests] = useState<InterestExpression[]>([]);
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

  // Mock mutual interests
  const mutualInterests: MutualInterest[] = [
    {
      opportunityId: 'job-2',
      opportunity: mockJobOpportunities[1], // Data Engineer
      status: 'new',
      nextAction: 'Begin application process'
    },
    {
      opportunityId: 'job-6',
      opportunity: mockJobOpportunities[5] || mockJobOpportunities[0], // ML Engineer or fallback
      status: 'contacted',
      nextAction: 'Schedule initial conversation'
    }
  ];

  const handleExpressInterest = (opportunityId: string, interest: 'yes' | 'maybe' | 'no') => {
    const newInterest: InterestExpression = {
      opportunityId,
      interest,
      timestamp: new Date().toISOString()
    };
    
    setUserInterests(prev => [...prev, newInterest]);
    
    toast({
      title: 'Interest Expressed',
      description: `You ${interest === 'yes' ? 'expressed interest in' : interest === 'maybe' ? 'marked as maybe for' : 'declined'} this opportunity.`,
    });
  };

  const handleBeginApplication = (mutualInterest: MutualInterest) => {
    toast({
      title: 'Application Started',
      description: `Starting application process with ${mutualInterest.opportunity.company}`,
    });
  };

  const getUserInterest = (opportunityId: string) => {
    return userInterests.find(interest => interest.opportunityId === opportunityId)?.interest;
  };

  // Convert JobOpportunity to SlideInDetailPane format
  const convertToDetailPaneFormat = (job: JobOpportunity) => {
    // Mock required skills based on job title and common tech skills
    const mockRequiredSkills = [
      'React', 'TypeScript', 'JavaScript', 'Node.js', 'CSS', 'HTML',
      'Git', 'REST APIs', 'MongoDB', 'PostgreSQL'
    ];
    
    // Create a realistic set of requirements
    const selectedSkills = mockRequiredSkills.slice(0, 6 + Math.floor(Math.random() * 4));
    
    return {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: {
        min: Math.floor(job.salary_range[0] / 1000),
        max: Math.floor(job.salary_range[1] / 1000),
        currency: '$'
      },
      postedDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000), // Random date within 2 weeks
      matchScore: job.match_score,
      requirements: selectedSkills.map((skill, index) => ({
        skill,
        level: index < 3 ? 'required' : index < 6 ? 'preferred' : 'nice-to-have',
        userHas: Math.random() > 0.3, // Mock data - 70% chance user has the skill
        userLevel: ['beginner', 'intermediate', 'advanced', 'expert'][Math.floor(Math.random() * 4)] as any
      })),
      description: job.match_reasons.join(' ') + ' This is a great opportunity to work with cutting-edge technologies and contribute to meaningful projects that impact millions of users. You will collaborate with cross-functional teams, participate in code reviews, and help build scalable applications.',
      highlights: [
        'Competitive salary and benefits package',
        'Remote-first work culture with flexible hours',
        'Professional development budget ($3,000/year)',
        'Health, dental, and vision insurance',
        'Stock options and equity participation',
        'Modern tech stack and development tools'
      ],
      applicationStatus: 'not-applied' as const,
      aiInsights: {
        summary: `You're a ${job.match_score}% match for this role. Your technical skills align well with their requirements, and your experience level matches what they're seeking.`,
        strengths: job.match_reasons.slice(0, 3),
        improvements: job.skill_gaps.length > 0 ? job.skill_gaps : ['Consider expanding cloud platform knowledge', 'Explore modern testing frameworks']
      }
    };
  };

  const handleViewDetails = (jobId: string) => {
    const job = mockJobOpportunities.find(j => j.id === jobId);
    if (job) {
      const detailJob = convertToDetailPaneFormat(job);
      setSelectedOpportunity(detailJob as any);
      setIsDetailPaneOpen(true);
      console.log('Opening detail pane for job:', jobId);
    }
  };

  const handleCloseDetailPane = () => {
    setIsDetailPaneOpen(false);
    setSelectedOpportunity(null);
  };

  const handleApplyFromDetail = (opportunityId: string, type: 'quick' | 'custom') => {
    console.log(`${type} apply for job:`, opportunityId);
    toast({
      title: "Application Submitted!",
      description: `Your ${type} application has been sent successfully.`,
    });
    handleCloseDetailPane();
  };

  const handleSaveFromDetail = (opportunityId: string) => {
    console.log('Save job from detail:', opportunityId);
    toast({
      title: "Job Saved!",
      description: "This opportunity has been added to your saved jobs.",
    });
  };

  const handleAskAI = (opportunityId: string, question: string) => {
    console.log('Ask AI:', question, 'for job:', opportunityId);
    toast({
      title: "AI Question Submitted!",
      description: "Our AI will analyze this role and provide insights shortly.",
    });
  };

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
        {/* Top Matches - Employer Interest */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Employers Interested in You</h3>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">3 new</span>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1">View all →</button>
          </div>
          <div className="space-y-3">
            {mockJobOpportunities.slice(0, 2).map((job) => (
              <EmployerInterestCard
                key={job.id}
                opportunity={job}
                userInterest={getUserInterest(job.id)}
                onExpressInterest={handleExpressInterest}
                onViewDetails={handleViewDetails}
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

      {/* Mutual Interests Section */}
      {mutualInterests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Mutual Interests ({mutualInterests.length})</h3>
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Ready for Application</span>
            </div>
          </div>
          <div className="space-y-4">
            {mutualInterests.map((mutualInterest) => (
              <div key={mutualInterest.opportunityId} className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      {mutualInterest.opportunity.title}
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full border border-red-300">
                        {mutualInterest.opportunity.match_score}% Match
                      </span>
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {mutualInterest.opportunity.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Location: {mutualInterest.opportunity.location}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                    mutualInterest.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {mutualInterest.status}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg mb-3">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <strong>Next Action:</strong> {mutualInterest.nextAction}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleBeginApplication(mutualInterest)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Handshake className="w-4 h-4" />
                    Begin Application
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );

  const opportunitiesContent = (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <OpportunityDiscoveryHub
        opportunities={mockJobOpportunities}
        savedSearches={mockSavedSearches}
        onSearch={(filters) => console.log('Search with filters:', filters)}
        onSaveSearch={(search) => console.log('Save search:', search)}
        onApply={(jobId) => console.log('Apply to job:', jobId)}
        onSave={(jobId) => console.log('Save job:', jobId)}
        onViewDetails={(jobId) => console.log('View job details:', jobId)}
      />
    </div>
  );

  const activityContent = (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Application Pipeline */}
      <ApplicationPipelineManager
        applications={mockApplications}
        onUpdateApplication={(id, updates) => console.log('Update application:', id, updates)}
        onAddNote={(id, note) => console.log('Add note:', id, note)}
        onScheduleFollowup={(id, date, type) => console.log('Schedule followup:', id, date, type)}
      />
      
      {/* Enhanced Stats - Secondary */}
      <EnhancedStatsGrid 
        stats={mockEnhancedStats}
        onActionClick={(action) => console.log('Action:', action)}
        timeframe="30d"
      />
    </div>
  );

  const messagesContent = (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div style={{ height: 'calc(100vh - 200px)' }}>
        <CommunicationCenter
          conversations={mockConversations}
          onSendMessage={(threadId, message) => console.log('Send message:', threadId, message)}
          onScheduleInterview={(threadId, details) => console.log('Schedule interview:', threadId, details)}
          onMarkAsRead={(messageId) => console.log('Mark as read:', messageId)}
          onArchive={(messageId) => console.log('Archive:', messageId)}
        />
      </div>
    </div>
  );

  const profileContent = (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Strategic Profile Optimizer */}
      <StrategicProfileOptimizer
        profileData={mockProfileOptimizationHub}
        completionTasks={mockProfileOptimizationHub.strategic_completion.completion_priorities}
        onTaskComplete={(taskId) => {
          console.log('Task completed:', taskId);
          toast({
            title: "Task Completed!",
            description: "Your profile has been updated successfully.",
          });
        }}
        onSkillAdd={(skill) => console.log('Add skill:', skill)}
        marketImpactMode={true}
      />
      
      {/* Profile Analytics */}
      <ProfileAnalytics
        analytics={mockProfileAnalytics}
        onViewDetails={(section) => console.log('View details:', section)}
      />
    </div>
  );

  const insightsContent = (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Profile Level and Achievements Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Level */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center">
          <ProfileLevelIndicator
            level={mockGamificationHub.user_stats.current_level}
            size="large"
            animated={true}
          />
        </div>

        {/* Achievement Showcase */}
        <AchievementShowcase
          achievements={mockGamificationHub.achievements.earned.concat(mockGamificationHub.achievements.available)}
          title="Recent Achievements"
          maxDisplay={6}
          onViewAll={() => console.log('View all achievements')}
          onAchievementClick={(achievement) => {
            console.log('Achievement clicked:', achievement);
            toast({
              title: achievement.name,
              description: achievement.description,
            });
          }}
        />
      </div>

      {/* Weekly Challenges */}
      <WeeklyChallenges
        challenges={mockGamificationHub.weekly_challenges.active}
        onAcceptChallenge={(challengeId) => {
          console.log('Accept challenge:', challengeId);
          toast({
            title: "Challenge Accepted!",
            description: "Good luck achieving your goal!",
          });
        }}
        onCompleteChallenge={(challengeId) => {
          console.log('Complete challenge:', challengeId);
          toast({
            title: "Challenge Completed!",
            description: "Congratulations! You've earned bonus points!",
          });
        }}
        onViewAll={() => console.log('View all challenges')}
      />

      {/* Social Recognition & Streaks Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Social Recognition */}
        <SocialRecognition
          socialData={mockGamificationHub.social_recognition}
          leaderboard={mockLeaderboard}
          onShareAchievement={(achievementName) => {
            console.log('Share achievement:', achievementName);
            toast({
              title: "Shared!",
              description: `Your ${achievementName} achievement has been shared!`,
            });
          }}
          onViewProfile={(userId) => console.log('View profile:', userId)}
        />

        {/* Streak Tracker */}
        <StreakTracker
          streaks={mockGamificationHub.streaks}
          onStreakClick={(type) => {
            console.log('Streak clicked:', type);
            toast({
              title: "Streak Details",
              description: `View your ${type.replace('_', ' ')} streak progress`,
            });
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 max-w-full">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
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
        </div>

        {overviewContent}
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
              // Navigate to profile tab
              const profileTab = document.querySelector('[role="tab"]:nth-child(5)') as HTMLButtonElement;
              profileTab?.click();
            }
          }}
        />
      )}

      {/* Job Detail Slide-in Pane */}
      <SlideInDetailPane
        isOpen={isDetailPaneOpen}
        onClose={handleCloseDetailPane}
        opportunity={selectedOpportunity}
        onApply={handleApplyFromDetail}
        onSave={handleSaveFromDetail}
        onAskAI={handleAskAI}
        isMobile={false}
      />
    </ModernLayoutWrapper>
  );
}