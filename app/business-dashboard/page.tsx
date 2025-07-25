'use client';

import { useState, useEffect } from 'react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import BusinessDashboardHeader from '@/components/dashboard/BusinessDashboardHeader';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Eye, 
  Plus, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react';

const stats = [
  {
    title: 'Active Opportunities',
    value: '8',
    change: '+2 this week',
    trend: 'up',
    icon: Briefcase,
    color: 'bg-blue-500',
  },
  {
    title: 'Total Applications',
    value: '156',
    change: '+23 this week',
    trend: 'up',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    title: 'Profile Views',
    value: '2,340',
    change: '+12% this month',
    trend: 'up',
    icon: Eye,
    color: 'bg-purple-500',
  },
  {
    title: 'Hiring Success Rate',
    value: '78%',
    change: '+5% improvement',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
];

const recentOpportunities = [
  {
    id: 1,
    title: 'Senior React Developer',
    type: 'Full-time',
    applications: 23,
    status: 'active',
    posted: '3 days ago',
    deadline: '2024-02-15',
  },
  {
    id: 2,
    title: 'UX Designer',
    type: 'Contract',
    applications: 45,
    status: 'active',
    posted: '1 week ago',
    deadline: '2024-02-20',
  },
  {
    id: 3,
    title: 'Marketing Specialist',
    type: 'Part-time',
    applications: 12,
    status: 'draft',
    posted: '2 days ago',
    deadline: '2024-02-18',
  },
];

const recentApplications = [
  {
    id: 1,
    candidateName: 'Sarah Johnson',
    position: 'Senior React Developer',
    appliedDate: '2024-01-10',
    status: 'shortlisted',
    experience: '5 years',
    skills: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: 2,
    candidateName: 'Michael Chen',
    position: 'UX Designer',
    appliedDate: '2024-01-09',
    status: 'under-review',
    experience: '3 years',
    skills: ['Figma', 'User Research', 'Prototyping'],
  },
  {
    id: 3,
    candidateName: 'Emily Rodriguez',
    position: 'Marketing Specialist',
    appliedDate: '2024-01-08',
    status: 'new',
    experience: '4 years',
    skills: ['Digital Marketing', 'SEO', 'Analytics'],
  },
];

export default function BusinessDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [companyName, setCompanyName] = useState('');
  
  useEffect(() => {
    // Get user info from localStorage on component mount
    const getUserInfo = () => {
      if (typeof window !== 'undefined') {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr);
            setUserName(userInfo.name);
            if (userInfo.company) {
              setCompanyName(userInfo.company);
            }
          } catch (error) {
            console.error('Error parsing user info:', error);
          }
        }
      }
    };
    
    getUserInfo();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-orange-100 text-orange-800';
      case 'new': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessSidebar />
      
      <div className="lg:pl-64 pt-1">
        <BusinessDashboardHeader title="Business Dashboard" />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome, {userName}! 🚀
              </h1>
              <p className="text-gray-600">
                {companyName ? `Manage ${companyName}'s opportunities, review applications, and grow your team.` : 
                'Manage your opportunities, review applications, and grow your team.'}
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
                        <p className="text-sm text-green-600 font-medium mt-1">{stat.change}</p>
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
              {/* Recent Opportunities */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Recent Opportunities</h2>
                      {/* <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center">
                        <Plus size={16} className="mr-2" />
                        Post New
                      </button> */}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentOpportunities.map((opportunity) => (
                        <div key={opportunity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(opportunity.status)}`}>
                                {opportunity.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{opportunity.type}</span>
                              <span>{opportunity.applications} applications</span>
                              <span>Posted {opportunity.posted}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Deadline</p>
                            <p className="font-medium text-gray-900">{opportunity.deadline}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Applications */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                        Post New Opportunity
                      </button>
                      <button className="w-full border-2 border-orange-500 text-orange-600 font-semibold py-3 px-4 rounded-lg hover:bg-orange-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                        Review Applications
                      </button>
                      <button className="w-full border-2 border-blue-500 text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Manage Team
                      </button>
                      <button className="w-full border-2 border-purple-500 text-purple-600 font-semibold py-3 px-4 rounded-lg hover:bg-purple-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                        View Analytics
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentApplications.map((application) => (
                        <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{application.candidateName}</h4>
                              <p className="text-sm text-gray-600">{application.position}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                              {application.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <p>{application.experience} experience</p>
                            <p>Applied {application.appliedDate}</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {application.skills.slice(0, 2).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                            {application.skills.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{application.skills.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
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