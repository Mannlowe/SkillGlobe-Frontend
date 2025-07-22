'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MarketPerformanceGrid from '@/components/dashboard/MarketPerformanceGrid';
import EnhancedStatsGrid from '@/components/dashboard/EnhancedStatsGrid';
import OpportunityFeed from '@/components/dashboard/OpportunityFeed';
import { BarChart3, Users, Briefcase, TrendingUp, Calendar, Bell, Star, ArrowUpRight, Check as CheckIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { mockHeaderMetrics, mockEnhancedStats, mockJobOpportunities } from '@/lib/mockDashboardData';

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    type: 'application',
    title: 'Applied to Senior React Developer',
    company: 'TechCorp Inc.',
    time: '2 hours ago',
    status: 'pending',
  },
  {
    id: 2,
    type: 'interview',
    title: 'Interview scheduled',
    company: 'StartupXYZ',
    time: '1 day ago',
    status: 'scheduled',
  },
  {
    id: 3,
    type: 'course',
    title: 'Completed Advanced React Course',
    company: 'SkillGlobe Academy',
    time: '3 days ago',
    status: 'completed',
  },
  {
    id: 4,
    type: 'offer',
    title: 'Job offer received',
    company: 'Design Studio',
    time: '5 days ago',
    status: 'received',
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Technical Interview',
    company: 'TechFlow Solutions',
    time: 'Today, 3:00 PM',
    type: 'interview',
  },
  {
    id: 2,
    title: 'Skill Assessment',
    company: 'SkillGlobe',
    time: 'Tomorrow, 10:00 AM',
    type: 'assessment',
  },
  {
    id: 3,
    title: 'Project Deadline',
    company: 'Freelance Client',
    time: 'Friday, 5:00 PM',
    type: 'deadline',
  },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated
    // Add a small delay to allow the auth state to be loaded from localStorage
    const checkAuth = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/auth/login');
      }
    }, 100); // Short delay to ensure auth state is loaded
    
    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, router]);
  
  // Separate effect for toast to ensure it only runs once after login
  useEffect(() => {
    // Only show toast when user is authenticated and we're actually on the dashboard page
    // This prevents the toast from showing on redirects
    if (isAuthenticated && user && window.location.pathname.includes('individual-dashboard')) {
      setUserName(user.full_name || user.name);
      
      // Show toast notification for Individual Seller
      const roles = user.roles;
      let isIndividualSeller = false;
      
      // Check roles in different formats
      if (Array.isArray(roles)) {
        isIndividualSeller = roles.includes('Individual Seller');
      } else if (typeof roles === 'string') {
        isIndividualSeller = (roles as string).indexOf('Individual Seller') >= 0;
      }
      
      // Use URL parameter to detect fresh login vs refresh
      const urlParams = new URLSearchParams(window.location.search);
      const fromLogin = urlParams.get('fromLogin') === 'true';
      
      // Show toast on fresh login or if fromLogin parameter is present
      if (isIndividualSeller && fromLogin) {
        // Create toast with custom timeout
        const { dismiss } = toast({
          title: "Login Successful",
          description: "You are logged in as individual seller",
          variant: "default",
          action: <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center"><CheckIcon className="h-4 w-4 text-green-600" /></div>,
        });
        
        // Set custom timeout (e.g., 3000ms = 3 seconds)
        setTimeout(() => {
          dismiss();
        }, 20000);
        
        // Remove the fromLogin parameter from URL without refreshing
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [isAuthenticated, user, toast]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {userName}!
              </h1>
              <p className="text-gray-600">
                Your career marketplace overview and performance metrics
              </p>
            </div>

            {/* Market Performance Header KPIs */}
            <MarketPerformanceGrid 
              metrics={mockHeaderMetrics}
              onDrillDown={(metric) => console.log('Drill down:', metric)}
            />

            {/* Enhanced Stats Grid with Benchmarking */}
            <EnhancedStatsGrid 
              stats={mockEnhancedStats}
              onActionClick={(action) => console.log('Action:', action)}
              timeframe="30d"
            />

            {/* Main Content Grid - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Opportunities & Activity */}
              <div className="lg:col-span-2 space-y-6">
                {/* Opportunity Discovery Feed */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Top Job Matches</h2>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      View all opportunities →
                    </button>
                  </div>
                  <OpportunityFeed 
                    opportunities={mockJobOpportunities}
                    onApply={(jobId) => console.log('Apply to job:', jobId)}
                    onSave={(jobId) => console.log('Save job:', jobId)}
                    onViewDetails={(jobId) => console.log('View job details:', jobId)}
                  />
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'application' ? 'bg-blue-100' :
                            activity.type === 'interview' ? 'bg-green-100' :
                            activity.type === 'course' ? 'bg-purple-100' :
                            'bg-orange-100'
                          }`}>
                            {activity.type === 'application' && <Briefcase className="text-blue-600" size={20} />}
                            {activity.type === 'interview' && <Calendar className="text-green-600" size={20} />}
                            {activity.type === 'course' && <BarChart3 className="text-purple-600" size={20} />}
                            {activity.type === 'offer' && <TrendingUp className="text-orange-600" size={20} />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.company}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{activity.time}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {activity.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-start space-x-3">
                          <div className={`w-3 h-3 rounded-full mt-2 ${
                            event.type === 'interview' ? 'bg-green-500' :
                            event.type === 'assessment' ? 'bg-blue-500' :
                            'bg-orange-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                            <p className="text-xs text-gray-600">{event.company}</p>
                            <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300">
                        Find New Jobs
                      </button>
                      <button className="w-full border-2 border-orange-500 text-orange-600 font-semibold py-3 px-4 rounded-lg hover:bg-orange-50 transition-all duration-300">
                        Update Profile
                      </button>
                      <button className="w-full border-2 border-blue-500 text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-all duration-300">
                        Take Skill Test
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}