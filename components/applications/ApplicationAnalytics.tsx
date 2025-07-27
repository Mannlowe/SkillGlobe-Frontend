'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Award,
  Users,
  Building,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  Briefcase,
  Filter,
  Download,
  RefreshCw,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { ApplicationAnalytics } from '@/types/application-tracking';
import { mockApplicationAnalytics, mockApplications } from '@/lib/mockApplicationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function ApplicationAnalytics() {
  const [timeRange, setTimeRange] = useState<string>('all');
  const [profileFilter, setProfileFilter] = useState<string>('all');

  const analytics = mockApplicationAnalytics;

  // Key metrics cards
  const KeyMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <Briefcase className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalApplications}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
            +{analytics.applicationsThisMonth} this month
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <Target className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{analytics.successRate}%</div>
          <Progress value={analytics.successRate} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {analytics.applicationsByStatus.offer_received} offers received
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Match Score</CardTitle>
          <Star className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{analytics.averageMatchScore}%</div>
          <Progress value={analytics.averageMatchScore} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Higher scores lead to better outcomes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          <Clock className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{analytics.averageResponseTime} days</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
            Faster than average
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Application status breakdown
  const StatusBreakdown = () => (
    <Card>
      <CardHeader>
        <CardTitle>Application Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(analytics.applicationsByStatus).map(([status, count]) => {
            if (count === 0) return null;
            
            const percentage = (count / analytics.totalApplications) * 100;
            const statusConfig = {
              'submitted': { label: 'Submitted', color: 'bg-blue-500', icon: Clock },
              'under_review': { label: 'Under Review', color: 'bg-yellow-500', icon: AlertCircle },
              'phone_screening': { label: 'Phone Screening', color: 'bg-purple-500', icon: Clock },
              'technical_interview': { label: 'Technical Interview', color: 'bg-purple-600', icon: Clock },
              'final_interview': { label: 'Final Interview', color: 'bg-purple-700', icon: Clock },
              'offer_received': { label: 'Offer Received', color: 'bg-green-500', icon: Award },
              'offer_accepted': { label: 'Offer Accepted', color: 'bg-green-600', icon: CheckCircle },
              'offer_declined': { label: 'Offer Declined', color: 'bg-gray-500', icon: XCircle },
              'rejected': { label: 'Rejected', color: 'bg-red-500', icon: XCircle },
              'withdrawn': { label: 'Withdrawn', color: 'bg-gray-400', icon: XCircle }
            };
            
            const config = statusConfig[status as keyof typeof statusConfig];
            if (!config) return null;
            
            const Icon = config.icon;
            
            return (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{config.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 w-32">
                    <Progress value={percentage} className="h-2" />
                  </div>
                  <span className="text-sm font-medium w-8">{count}</span>
                  <span className="text-xs text-gray-500 w-12">{percentage.toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  // Profile performance analysis
  const ProfilePerformance = () => (
    <Card>
      <CardHeader>
        <CardTitle>Profile Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Top Performing Profile</span>
            </div>
            <p className="text-lg font-semibold text-green-900">
              {analytics.topPerformingProfile.profileName}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
              <div>
                <span className="text-green-600">Applications:</span>
                <span className="font-medium ml-2">{analytics.topPerformingProfile.applications}</span>
              </div>
              <div>
                <span className="text-green-600">Success Rate:</span>
                <span className="font-medium ml-2">{analytics.topPerformingProfile.successRate}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">All Profiles</h4>
            {Object.entries(analytics.applicationsByProfile).map(([profileId, count]) => {
              const profileNames = {
                'profile-1': 'Senior Full Stack Developer',
                'profile-2': 'Data Engineer',
                'profile-3': 'Data Analyst'
              };
              
              const profileName = profileNames[profileId as keyof typeof profileNames];
              const percentage = (count / analytics.totalApplications) * 100;
              
              // Calculate success rate for this profile (simplified)
              const profileApps = mockApplications.filter(app => app.profileId === profileId);
              const successfulApps = profileApps.filter(app => 
                ['offer_received', 'offer_accepted'].includes(app.status)
              );
              const successRate = profileApps.length > 0 ? (successfulApps.length / profileApps.length) * 100 : 0;
              
              return (
                <div key={profileId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{profileName}</p>
                    <p className="text-sm text-gray-600">Success Rate: {successRate.toFixed(0)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{count} applications</p>
                    <p className="text-sm text-gray-600">{percentage.toFixed(0)}% of total</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Industry insights
  const IndustryInsights = () => (
    <Card>
      <CardHeader>
        <CardTitle>Industry Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analytics.industriesAppliedTo.map((industry, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{industry.industry}</p>
                  <p className="text-sm text-gray-600">
                    Success Rate: {industry.successRate}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{industry.count} applications</p>
                <div className="w-24 mt-1">
                  <Progress value={industry.successRate} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Companies applied to
  const CompanyInsights = () => (
    <Card>
      <CardHeader>
        <CardTitle>Companies Applied To</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analytics.companiesAppliedTo.map((company, index) => {
              const statusConfig = {
                'submitted': { label: 'Submitted', variant: 'secondary' as const },
                'under_review': { label: 'Under Review', variant: 'default' as const },
                'technical_interview': { label: 'Technical Interview', variant: 'default' as const },
                'offer_received': { label: 'Offer Received', variant: 'default' as const },
                'rejected': { label: 'Rejected', variant: 'destructive' as const }
              };
              
              const statusConf = statusConfig[company.status as keyof typeof statusConfig];
              
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{company.company}</TableCell>
                  <TableCell>{company.applicationCount}</TableCell>
                  <TableCell>
                    <Badge variant={statusConf?.variant || 'secondary'}>
                      {statusConf?.label || company.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // Insights and recommendations
  const InsightsRecommendations = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">✨ Key Insights</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Your Data Engineer profile has a 100% success rate</li>
              <li>• Technology industry applications have higher success rates</li>
              <li>• Applications with 85%+ match scores are more likely to get offers</li>
              <li>• Average response time is better than industry standard</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">💡 Recommendations</h4>
            <ul className="space-y-1 text-sm text-green-800">
              <li>• Focus more applications on Data Engineer roles for better success</li>
              <li>• Consider strengthening skills in high-demand areas like AWS and Python</li>
              <li>• Apply to more Technology companies based on your success pattern</li>
              <li>• Target roles with 80%+ match scores for higher success probability</li>
            </ul>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">⚡ Action Items</h4>
            <ul className="space-y-1 text-sm text-yellow-800">
              <li>• Update your Data Analyst profile with finance domain experience</li>
              <li>• Create a specialized profile for DevOps roles</li>
              <li>• Follow up on pending applications after 1 week</li>
              <li>• Consider salary expectations based on offer patterns</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Application Analytics</h1>
            <p className="text-gray-600 mt-1">
              Insights and performance analysis across all your applications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <KeyMetrics />

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profiles">Profile Performance</TabsTrigger>
            <TabsTrigger value="industries">Industry Analysis</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatusBreakdown />
              <CompanyInsights />
            </div>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-6">
            <ProfilePerformance />
          </TabsContent>

          <TabsContent value="industries" className="space-y-6">
            <IndustryInsights />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <InsightsRecommendations />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}