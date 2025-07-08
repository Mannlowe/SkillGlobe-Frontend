'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { BarChart3, TrendingUp, Users, Eye, Calendar, Download } from 'lucide-react';

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    {
      title: 'Profile Views',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
    },
    {
      title: 'Job Applications',
      value: '23',
      change: '+8.2%',
      trend: 'up',
      icon: BarChart3,
    },
    {
      title: 'Skill Endorsements',
      value: '156',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Course Completions',
      value: '8',
      change: '+25.0%',
      trend: 'up',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600 mt-2">Track your career progress and performance</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                
                <button className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Download size={16} className="mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Icon className="text-orange-600" size={24} />
                      </div>
                      <span className="text-green-600 text-sm font-medium">{metric.change}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                    <p className="text-gray-600 text-sm">{metric.title}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Views Over Time</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart placeholder - Profile views trend
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Success Rate</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart placeholder - Success rate
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}