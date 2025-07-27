'use client';

import React, { useState } from 'react';
import {
  Heart,
  Target,
  Handshake,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Calendar,
  Briefcase,
  Award,
  Users,
  Building,
  MapPin,
  DollarSign,
  Eye,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  mockUser, 
  mockPerformanceMetrics 
} from '@/lib/mockMultiProfileData';
import { 
  mockJobOpportunities 
} from '@/lib/mockJobOpportunities';
import { 
  mockApplications, 
  mockApplicationAnalytics 
} from '@/lib/mockApplicationData';
import { matchingEngine } from '@/lib/profileMatchingEngine';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// New types for matchmaking model
interface InterestExpression {
  opportunityId: string;
  profileId: string;
  interest: 'yes' | 'maybe' | 'not_interested';
  timestamp: string;
  notes?: string;
}

interface MutualInterest {
  opportunityId: string;
  opportunity: any;
  matchScore: number;
  profileUsed: string;
  status: 'new' | 'contacted' | 'interviewing' | 'resolved';
  nextAction: string;
}

export default function ConsolidatedDashboard() {
  const { toast } = useToast();
  const [userInterests, setUserInterests] = useState<InterestExpression[]>([]);

  // Mock data for new matchmaking model
  const newMatches = mockJobOpportunities.slice(0, 3).map(opportunity => {
    const matchResult = matchingEngine.findBestProfileMatch(opportunity, mockUser.profiles);
    return {
      opportunity,
      matchResult,
      matchScore: matchResult.matchScore,
      profileUsed: matchResult.bestMatchingProfile.name
    };
  });

  const mutualInterests: MutualInterest[] = [
    {
      opportunityId: 'job-2',
      opportunity: mockJobOpportunities[1], // Data Engineer
      matchScore: 92,
      profileUsed: 'Data Engineer',
      status: 'new',
      nextAction: 'Begin application process'
    },
    {
      opportunityId: 'job-6', 
      opportunity: mockJobOpportunities[5], // ML Engineer
      matchScore: 85,
      profileUsed: 'Data Engineer',
      status: 'contacted',
      nextAction: 'Schedule initial conversation'
    }
  ];

  const activeApplications = mockApplications.filter(app => 
    ['technical_interview', 'offer_received'].includes(app.status)
  );

  const handleExpressInterest = (opportunityId: string, profileId: string, interest: 'yes' | 'maybe' | 'not_interested') => {
    const newInterest: InterestExpression = {
      opportunityId,
      profileId,
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
    return userInterests.find(interest => interest.opportunityId === opportunityId);
  };

  // Header with profile overview
  const ProfileOverview = () => (
    <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matchmaking Dashboard</h1>
          <p className="text-gray-600 mt-1">AI-powered opportunity matching with mutual interest</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{mockUser.profiles.length} Profiles</Badge>
            <Badge variant="outline">Health: {mockPerformanceMetrics.overallScore}%</Badge>
          </div>
          <Progress value={mockPerformanceMetrics.overallScore} className="w-32 h-2" />
        </div>
      </div>
    </div>
  );

  // New Matches Section
  const NewMatchesSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          New AI Matches ({newMatches.length})
          <Badge variant="secondary" className="ml-2">Awaiting Your Interest</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newMatches.map(({ opportunity, matchScore, profileUsed }) => {
            const userInterest = getUserInterest(opportunity.id);
            
            return (
              <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{opportunity.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {opportunity.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {opportunity.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${(opportunity.salaryRange[0] / 1000).toFixed(0)}k - ${(opportunity.salaryRange[1] / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        {matchScore}% Match
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">Best fit: {profileUsed}</p>
                  </div>
                </div>

                {userInterest ? (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      You {userInterest.interest === 'yes' ? 'expressed interest' : 
                           userInterest.interest === 'maybe' ? 'marked as maybe' : 'declined'} - 
                      waiting for employer response
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => handleExpressInterest(opportunity.id, 'profile-1', 'yes')}
                      className="flex-1"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Interested
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleExpressInterest(opportunity.id, 'profile-1', 'maybe')}
                      className="flex-1"
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Maybe
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleExpressInterest(opportunity.id, 'profile-1', 'not_interested')}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  // Mutual Interests Section
  const MutualInterestsSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Mutual Interests ({mutualInterests.length})
          <Badge variant="default" className="ml-2 bg-red-100 text-red-700">Ready for Application</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mutualInterests.map((mutualInterest) => (
            <div key={mutualInterest.opportunityId} className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    {mutualInterest.opportunity.title}
                    <Badge variant="outline" className="text-red-600 border-red-300">
                      {mutualInterest.matchScore}% Match
                    </Badge>
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {mutualInterest.opportunity.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Profile: {mutualInterest.profileUsed}
                    </span>
                  </div>
                </div>
                <Badge 
                  variant={mutualInterest.status === 'new' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {mutualInterest.status}
                </Badge>
              </div>

              <div className="bg-white p-3 rounded-lg mb-3">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <strong>Next Action:</strong> {mutualInterest.nextAction}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleBeginApplication(mutualInterest)}
                  className="flex-1"
                >
                  <Handshake className="w-4 h-4 mr-1" />
                  Begin Application
                </Button>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Active Applications Section
  const ActiveApplicationsSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          Active Applications ({activeApplications.length})
          <Badge variant="secondary" className="ml-2">In Progress</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeApplications.map((application) => (
            <div key={application.id} className="border rounded-lg p-4 bg-purple-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{application.jobTitle}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {application.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {application.profileName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {application.matchScore}% match
                    </span>
                  </div>
                </div>
                <Badge 
                  variant={application.status === 'offer_received' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {application.status.replace('_', ' ')}
                </Badge>
              </div>

              {application.interviews.length > 0 && (
                <div className="bg-white p-3 rounded-lg mb-3">
                  <p className="text-sm font-medium mb-1">Upcoming Interview:</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(application.interviews[0].scheduledDate).toLocaleDateString()} - {application.interviews[0].interviewer}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button size="sm" className="flex-1">
                  <ArrowRight className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                {application.status === 'offer_received' && (
                  <Button variant="outline" size="sm">
                    <Award className="w-4 h-4 mr-1" />
                    Review Offer
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Performance Insights Section  
  const PerformanceInsightsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          AI Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Top Performing Profile</p>
                <p className="text-sm text-green-700">{mockApplicationAnalytics.topPerformingProfile.profileName}</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-300">
                {mockApplicationAnalytics.topPerformingProfile.successRate}% Success
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Average Match Score</p>
                <p className="text-sm text-blue-700">Across all opportunities</p>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                {mockApplicationAnalytics.averageMatchScore}%
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                AI Recommendation
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Technology companies show 33% higher success rates for your profiles
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-medium text-purple-900">Quick Stats</p>
              <div className="text-sm text-purple-700 mt-1 space-y-1">
                <div className="flex justify-between">
                  <span>Total Applications:</span>
                  <span>{mockApplicationAnalytics.totalApplications}</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span>{mockApplicationAnalytics.successRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <ProfileOverview />
      <NewMatchesSection />
      <MutualInterestsSection />
      <ActiveApplicationsSection />
      <PerformanceInsightsSection />
    </div>
  );
}