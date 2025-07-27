'use client';

import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  BarChart3, 
  Target, 
  Settings,
  Plus,
  Eye,
  Calendar,
  TrendingUp
} from 'lucide-react';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  mockUser, 
  mockVerificationStatus, 
  mockPerformanceMetrics 
} from '@/lib/mockMultiProfileData';
import { mockApplications, mockApplicationAnalytics } from '@/lib/mockApplicationData';
import { mockJobOpportunities } from '@/lib/mockJobOpportunities';
import { matchingEngine } from '@/lib/profileMatchingEngine';
import ApplicationTracker from '@/components/applications/ApplicationTracker';
import ApplicationHistory from '@/components/applications/ApplicationHistory';
import ApplicationAnalytics from '@/components/applications/ApplicationAnalytics';
import MatchingResults from '@/components/matching/MatchingResults';

export default function TestMultiProfilePage() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showMatchingExample, setShowMatchingExample] = useState(false);

  // Get a sample matching result for demonstration
  const sampleOpportunity = mockJobOpportunities[0]; // Senior Full Stack Developer
  const sampleMatching = matchingEngine.findBestProfileMatch(sampleOpportunity, mockUser.profiles);

  const TestSection = ({ title, description, children }: { 
    title: string; 
    description: string; 
    children: React.ReactNode;
  }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <ModernLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <h1 className="text-4xl font-bold mb-4">Multi-Profile System Testing</h1>
          <p className="text-xl text-gray-600 mb-6">
            Test all components of the new multi-profile job application system
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <p className="font-medium">Multi-Profiles</p>
              <p className="text-sm text-gray-600">{mockUser.profiles.length} Active</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <p className="font-medium">AI Matching</p>
              <p className="text-sm text-gray-600">{mockJobOpportunities.length} Opportunities</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <p className="font-medium">Applications</p>
              <p className="text-sm text-gray-600">{mockApplications.length} Tracked</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <p className="font-medium">Analytics</p>
              <p className="text-sm text-gray-600">{mockApplicationAnalytics.successRate}% Success</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="matching">Matching</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <TestSection
                title="🧪 Testing Instructions"
                description="How to test each component of the multi-profile system"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Direct URL Testing:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Profile Management:</span>
                        <code className="text-blue-600">/profile/me</code>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Job Opportunities:</span>
                        <code className="text-blue-600">/opportunities</code>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Application Tracker:</span>
                        <code className="text-blue-600">/applications</code>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Application History:</span>
                        <code className="text-blue-600">/applications/history</code>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Analytics Dashboard:</span>
                        <code className="text-blue-600">/applications/analytics</code>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Feature Testing:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-blue-50 rounded">
                        <strong>Profile Switching:</strong> Use dropdown in profile page
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <strong>AI Matching:</strong> Click "View Details" on opportunities
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <strong>Application Tracking:</strong> Filter by status/profile
                      </div>
                      <div className="p-2 bg-orange-50 rounded">
                        <strong>Analytics:</strong> View success rates by profile
                      </div>
                    </div>
                  </div>
                </div>
              </TestSection>

              <TestSection
                title="📊 Mock Data Summary"
                description="Overview of the test data available for testing"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">User Profiles ({mockUser.profiles.length})</h4>
                    {mockUser.profiles.map((profile, index) => (
                      <div key={profile.id} className="mb-2 p-2 border rounded">
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-sm text-gray-600">{profile.category}</p>
                        <Badge variant={profile.isActive ? "default" : "secondary"} className="mt-1">
                          {profile.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Job Opportunities ({mockJobOpportunities.length})</h4>
                    {mockJobOpportunities.slice(0, 4).map((job) => (
                      <div key={job.id} className="mb-2 p-2 border rounded">
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <Badge variant="outline" className="mt-1">
                          {job.industry}
                        </Badge>
                      </div>
                    ))}
                    <p className="text-sm text-gray-500">+ {mockJobOpportunities.length - 4} more...</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Applications ({mockApplications.length})</h4>
                    {mockApplications.map((app) => (
                      <div key={app.id} className="mb-2 p-2 border rounded">
                        <p className="font-medium">{app.jobTitle}</p>
                        <p className="text-sm text-gray-600">{app.company}</p>
                        <div className="flex justify-between items-center mt-1">
                          <Badge variant="outline">{app.profileName}</Badge>
                          <span className="text-sm text-gray-500">{app.matchScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TestSection>
            </div>
          </TabsContent>

          {/* Profiles Tab */}
          <TabsContent value="profiles">
            <TestSection
              title="👤 Multi-Profile System"
              description="Test profile management and switching functionality"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Available Profiles</h4>
                  <Button onClick={() => window.open('/profile/me', '_blank')}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile Page
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockUser.profiles.map((profile) => (
                    <Card key={profile.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{profile.name}</CardTitle>
                            <CardDescription>{profile.category}</CardDescription>
                          </div>
                          <Badge variant={profile.isActive ? "default" : "secondary"}>
                            {profile.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Primary Skills:</span>
                            <span>{profile.primarySkills.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Experience:</span>
                            <span>{profile.relevantExperience.length} roles</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Target Salary:</span>
                            <span>${(profile.jobPreferences.salaryRange[0] / 1000).toFixed(0)}k+</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TestSection>
          </TabsContent>

          {/* Matching Tab */}
          <TabsContent value="matching">
            <TestSection
              title="🎯 AI-Powered Matching"
              description="Test the matching algorithm with sample job opportunities"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Sample Matching Result</h4>
                  <Button onClick={() => window.open('/opportunities', '_blank')}>
                    <Target className="w-4 h-4 mr-1" />
                    View Opportunities Page
                  </Button>
                </div>
                
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {sampleOpportunity.title} at {sampleOpportunity.company}
                    </CardTitle>
                    <CardDescription>
                      Best Match: {sampleMatching.bestMatchingProfile.name} ({sampleMatching.matchScore}% match)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {sampleMatching.profileMatches[0].skillMatch.skillMatchPercentage}%
                        </div>
                        <p>Skills Match</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {sampleMatching.profileMatches[0].experienceMatch.yearsExperienceMatch}%
                        </div>
                        <p>Experience Match</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {sampleMatching.profileMatches[0].preferenceMatch.salaryAlignment}%
                        </div>
                        <p>Preference Match</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="mt-4" 
                      onClick={() => setShowMatchingExample(true)}
                    >
                      View Detailed Analysis
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TestSection>
            
            {showMatchingExample && (
              <div className="mt-6">
                <MatchingResults
                  matchingResult={sampleMatching}
                  opportunity={sampleOpportunity}
                  onApply={(profileId) => console.log('Apply with profile:', profileId)}
                  onSaveJob={(jobId) => console.log('Save job:', jobId)}
                  onShareJob={(jobId) => console.log('Share job:', jobId)}
                  onViewProfile={(profileId) => console.log('View profile:', profileId)}
                />
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <ApplicationTracker />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <ApplicationHistory />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <ApplicationAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </ModernLayoutWrapper>
  );
}