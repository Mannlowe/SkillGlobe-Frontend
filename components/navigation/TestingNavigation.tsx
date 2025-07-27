'use client';

import React from 'react';
import Link from 'next/link';
import { 
  User, 
  Briefcase, 
  BarChart3, 
  Target, 
  Clock,
  TestTube,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TestingNavigation() {
  const testPages = [
    {
      title: 'Multi-Profile Testing',
      description: 'Comprehensive testing interface for all components',
      url: '/test-multiprofile',
      icon: TestTube,
      badge: 'Main Testing Hub',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'Profile Management',
      description: 'Test profile switching, verification badges, and multi-profile features',
      url: '/profile/me',
      icon: User,
      badge: 'Core Feature',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Job Opportunities',
      description: 'AI-powered matching with detailed analysis',
      url: '/opportunities',
      icon: Target,
      badge: 'AI Matching',
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Application Tracker',
      description: 'Track applications with profile context and status management',
      url: '/applications',
      icon: Briefcase,
      badge: 'New Feature',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      title: 'Application History',
      description: 'Complete history with filtering and detailed views',
      url: '/applications/history',
      icon: Clock,
      badge: 'Enhanced',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      title: 'Application Analytics',
      description: 'Performance insights and success rate analysis',
      url: '/applications/analytics',
      icon: BarChart3,
      badge: 'Analytics',
      color: 'bg-red-100 text-red-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Multi-Profile System Testing</h1>
          <p className="text-xl text-gray-600 mb-6">
            Test all components of the new job application system
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800">
              <strong>🚀 Start Here:</strong> Use the "Multi-Profile Testing" page for the complete testing experience, 
              or visit individual pages to test specific components.
            </p>
          </div>
        </div>

        {/* Test Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testPages.map((page, index) => {
            const Icon = page.icon;
            
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{page.title}</CardTitle>
                        <Badge className={page.color}>{page.badge}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{page.description}</p>
                  <Link href={page.url}>
                    <Button className="w-full group">
                      Test Component
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Testing Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🧪 What to Test:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Profile Switching:</strong> Change between different career profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>AI Matching:</strong> View detailed match analysis for job opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Application Flow:</strong> Test application submission with profile context</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Status Management:</strong> Update application statuses and add notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Analytics:</strong> View success rates and performance insights</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">📊 Mock Data Available:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>User Profiles:</span>
                    <Badge variant="outline">3 Active</Badge>
                  </li>
                  <li className="flex justify-between">
                    <span>Job Opportunities:</span>
                    <Badge variant="outline">8 Jobs</Badge>
                  </li>
                  <li className="flex justify-between">
                    <span>Applications:</span>
                    <Badge variant="outline">4 Tracked</Badge>
                  </li>
                  <li className="flex justify-between">
                    <span>Interview Data:</span>
                    <Badge variant="outline">Multiple Rounds</Badge>
                  </li>
                  <li className="flex justify-between">
                    <span>Analytics:</span>
                    <Badge variant="outline">Full Dashboard</Badge>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/test-multiprofile">
              <Button variant="outline" size="sm">
                <TestTube className="w-4 h-4 mr-1" />
                Main Testing Hub
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button variant="outline" size="sm">
                <Target className="w-4 h-4 mr-1" />
                View Opportunities
              </Button>
            </Link>
            <Link href="/applications">
              <Button variant="outline" size="sm">
                <Briefcase className="w-4 h-4 mr-1" />
                Application Tracker
              </Button>
            </Link>
            <Link href="/applications/analytics">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}