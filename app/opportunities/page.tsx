'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  DollarSign, 
  Clock, 
  Target, 
  TrendingUp,
  Briefcase,
  Users,
  Calendar,
  Star,
  Eye,
  Bookmark,
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Settings,
  Sparkles
} from 'lucide-react';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import MatchingResults from '@/components/matching/MatchingResults';
import { 
  mockUser, 
  mockVerificationStatus,
  mockPerformanceMetrics 
} from '@/lib/mockMultiProfileData';
import { 
  mockJobOpportunities,
  getOpportunitiesByIndustry,
  getOpportunitiesByWorkType,
  getUrgentOpportunities
} from '@/lib/mockJobOpportunities';
import { matchingEngine, JobOpportunity } from '@/lib/profileMatchingEngine';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function OpportunitiesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('all');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('match_score');
  const [activeTab, setActiveTab] = useState('for_you');
  const [selectedOpportunity, setSelectedOpportunity] = useState<JobOpportunity | null>(null);
  const [showMatchingResults, setShowMatchingResults] = useState(false);

  // Calculate matching results for all opportunities
  const opportunitiesWithMatches = useMemo(() => {
    return mockJobOpportunities.map(opportunity => {
      try {
        const matchingResult = matchingEngine.findBestProfileMatch(opportunity, mockUser.profiles);
        return {
          opportunity,
          matchingResult,
          bestMatchScore: matchingResult.matchScore
        };
      } catch (error) {
        console.error('Error calculating match for opportunity:', opportunity.id, error);
        return {
          opportunity,
          matchingResult: null,
          bestMatchScore: 0
        };
      }
    });
  }, []);

  // Filter and sort opportunities
  const filteredOpportunities = useMemo(() => {
    let filtered = opportunitiesWithMatches.filter(item => {
      const opportunity = item.opportunity;
      
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (!opportunity.title.toLowerCase().includes(searchLower) &&
            !opportunity.company.toLowerCase().includes(searchLower) &&
            !opportunity.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Industry filter
      if (selectedIndustry !== 'all' && opportunity.industry !== selectedIndustry) {
        return false;
      }
      
      // Work type filter
      if (selectedWorkType !== 'all' && opportunity.workType !== selectedWorkType) {
        return false;
      }
      
      // Salary range filter
      if (selectedSalaryRange !== 'all') {
        const [min, max] = selectedSalaryRange.split('-').map(Number);
        if (opportunity.salaryRange[0] < min || opportunity.salaryRange[1] > max) {
          return false;
        }
      }
      
      return true;
    });

    // Sort opportunities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match_score':
          return b.bestMatchScore - a.bestMatchScore;
        case 'salary_high':
          return b.opportunity.salaryRange[1] - a.opportunity.salaryRange[1];
        case 'salary_low':
          return a.opportunity.salaryRange[0] - b.opportunity.salaryRange[0];
        case 'date_posted':
          return new Date(b.opportunity.postedDate).getTime() - new Date(a.opportunity.postedDate).getTime();
        case 'urgency':
          const urgencyOrder = { high: 3, medium: 2, low: 1 };
          return urgencyOrder[b.opportunity.urgency] - urgencyOrder[a.opportunity.urgency];
        default:
          return b.bestMatchScore - a.bestMatchScore;
      }
    });

    return filtered;
  }, [opportunitiesWithMatches, searchQuery, selectedIndustry, selectedWorkType, selectedSalaryRange, sortBy]);

  // Get opportunities by category
  const getRecommendedOpportunities = () => {
    return filteredOpportunities.filter(item => item.bestMatchScore >= 70);
  };

  const getUrgentOpportunitiesWithMatches = () => {
    return filteredOpportunities.filter(item => item.opportunity.urgency === 'high');
  };

  const getRecentOpportunities = () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return filteredOpportunities.filter(item => 
      new Date(item.opportunity.postedDate) >= threeDaysAgo
    );
  };

  // Get match score color
  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // Handle actions
  const handleViewOpportunity = (opportunity: JobOpportunity) => {
    setSelectedOpportunity(opportunity);
    setShowMatchingResults(true);
  };

  const handleApply = (profileId: string) => {
    toast({
      title: 'Application Submitted!',
      description: `Your application has been submitted using your selected profile.`,
    });
    setShowMatchingResults(false);
  };

  const handleSaveJob = (jobId: string) => {
    toast({
      title: 'Job Saved',
      description: 'This opportunity has been saved to your favorites.',
    });
  };

  const handleShareJob = (jobId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/opportunities/${jobId}`);
    toast({
      title: 'Link Copied',
      description: 'Job link has been copied to clipboard.',
    });
  };

  const handleViewProfile = (profileId: string) => {
    // Navigate to profile view
    window.open(`/profile/${profileId}`, '_blank');
  };

  // Opportunity Card Component
  const OpportunityCard = ({ item, showMatchScore = true }: { 
    item: typeof filteredOpportunities[0], 
    showMatchScore?: boolean 
  }) => {
    const { opportunity, matchingResult, bestMatchScore } = item;
    
    return (
      <Card className="hover:shadow-md transition-all cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {opportunity.title}
                </CardTitle>
                {showMatchScore && (
                  <div className={cn("px-2 py-1 rounded-md text-sm font-medium", getMatchScoreColor(bestMatchScore))}>
                    {bestMatchScore}%
                  </div>
                )}
              </div>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {opportunity.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {opportunity.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {opportunity.workType}
                </span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={opportunity.urgency === 'high' ? 'destructive' : 
                             opportunity.urgency === 'medium' ? 'default' : 'secondary'}>
                {opportunity.urgency}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">{opportunity.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-gray-500" />
                ${(opportunity.salaryRange[0] / 1000).toFixed(0)}k - ${(opportunity.salaryRange[1] / 1000).toFixed(0)}k
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4 text-gray-500" />
                {opportunity.yearsExperienceRequired}+ years
              </span>
            </div>
            <span className="text-gray-500">
              {new Date(opportunity.postedDate).toLocaleDateString()}
            </span>
          </div>

          {/* Required Skills Preview */}
          <div className="flex flex-wrap gap-1">
            {opportunity.requiredSkills.slice(0, 4).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {skill.name}
              </Badge>
            ))}
            {opportunity.requiredSkills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{opportunity.requiredSkills.length - 4} more
              </Badge>
            )}
          </div>

          {/* Best Profile Match Preview */}
          {showMatchScore && matchingResult && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Best Match: {matchingResult.bestMatchingProfile.name}</span>
                <div className="flex items-center gap-2">
                  <Progress value={bestMatchScore} className="w-16 h-2" />
                  <span className="font-medium">{bestMatchScore}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button 
              onClick={() => handleViewOpportunity(opportunity)}
              className="flex-1"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveJob(opportunity.id);
              }}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <ModernLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Opportunities</h1>
            <p className="text-gray-600 mt-1">
              AI-powered matching with your specialized profiles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Preferences
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
                  <p className="text-2xl font-bold">{filteredOpportunities.length}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Great Matches (70%+)</p>
                  <p className="text-2xl font-bold text-green-600">{getRecommendedOpportunities().length}</p>
                </div>
                <Star className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgent Openings</p>
                  <p className="text-2xl font-bold text-red-600">{getUrgentOpportunitiesWithMatches().length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New This Week</p>
                  <p className="text-2xl font-bold text-blue-600">{getRecentOpportunities().length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Fintech">Fintech</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedWorkType} onValueChange={setSelectedWorkType}>
                <SelectTrigger>
                  <SelectValue placeholder="Work Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Work Types</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedSalaryRange} onValueChange={setSelectedSalaryRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Salary Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Salaries</SelectItem>
                  <SelectItem value="50000-100000">50k - 100k</SelectItem>
                  <SelectItem value="100000-150000">100k - 150k</SelectItem>
                  <SelectItem value="150000-200000">150k - 200k</SelectItem>
                  <SelectItem value="200000-999999">200k+</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match_score">Match Score</SelectItem>
                  <SelectItem value="date_posted">Date Posted</SelectItem>
                  <SelectItem value="salary_high">Salary (High to Low)</SelectItem>
                  <SelectItem value="salary_low">Salary (Low to High)</SelectItem>
                  <SelectItem value="urgency">Urgency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="for_you">For You ({getRecommendedOpportunities().length})</TabsTrigger>
            <TabsTrigger value="urgent">Urgent ({getUrgentOpportunitiesWithMatches().length})</TabsTrigger>
            <TabsTrigger value="recent">Recent ({getRecentOpportunities().length})</TabsTrigger>
            <TabsTrigger value="all">All ({filteredOpportunities.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="for_you" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Recommended for You</h2>
              <Badge variant="secondary">70%+ match</Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getRecommendedOpportunities().map((item) => (
                <OpportunityCard key={item.opportunity.id} item={item} />
              ))}
            </div>
            
            {getRecommendedOpportunities().length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No high-match opportunities found</p>
                <p className="text-sm">Try adjusting your filters or updating your profiles</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="urgent" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold">Urgent Openings</h2>
              <Badge variant="destructive">High Priority</Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getUrgentOpportunitiesWithMatches().map((item) => (
                <OpportunityCard key={item.opportunity.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Recently Posted</h2>
              <Badge variant="secondary">Last 3 days</Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getRecentOpportunities().map((item) => (
                <OpportunityCard key={item.opportunity.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOpportunities.map((item) => (
                <OpportunityCard key={item.opportunity.id} item={item} />
              ))}
            </div>
            
            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No opportunities found</p>
                <p className="text-sm">Try adjusting your search filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Matching Results Dialog */}
        <Dialog open={showMatchingResults} onOpenChange={setShowMatchingResults}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>AI-Powered Opportunity Analysis</DialogTitle>
              <DialogDescription>
                Detailed matching analysis using your specialized profiles
              </DialogDescription>
            </DialogHeader>
            
            {selectedOpportunity && (
              <MatchingResults
                matchingResult={matchingEngine.findBestProfileMatch(selectedOpportunity, mockUser.profiles)}
                opportunity={selectedOpportunity}
                onApply={handleApply}
                onSaveJob={handleSaveJob}
                onShareJob={handleShareJob}
                onViewProfile={handleViewProfile}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ModernLayoutWrapper>
  );
}