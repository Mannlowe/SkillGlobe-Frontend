'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { BarChart3, Users, Briefcase, TrendingUp, Calendar, Bell, Star, ArrowUpRight } from 'lucide-react';

const stats = [
  {
    title: 'Active Applications',
    value: '12',
    change: '+2.5%',
    trend: 'up',
    icon: Briefcase,
    color: 'bg-blue-500',
  },
  {
    title: 'Profile Views',
    value: '1,247',
    change: '+12.3%',
    trend: 'up',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    title: 'Skill Rating',
    value: '4.8',
    change: '+0.2',
    trend: 'up',
    icon: Star,
    color: 'bg-yellow-500',
  },
  {
    title: 'Earnings',
    value: '$3,240',
    change: '+18.7%',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
];

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
  
  useEffect(() => {
    // Get user info from localStorage on component mount
    const getUserInfo = () => {
      if (typeof window !== 'undefined') {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr);
            setUserName(userInfo.name);
          } catch (error) {
            console.error('Error parsing user info:', error);
          }
        }
      }
    };
    
    getUserInfo();
  }, []);

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
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-gray-600">
                Here&apos;s what&apos;s happening with your career journey today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <div className="flex items-center mt-2">
                          <ArrowUpRight className="text-green-500 mr-1" size={16} />
                          <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
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