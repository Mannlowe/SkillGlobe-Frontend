'use client';

import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Award,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Building,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Send,
  Bookmark,
  Share2,
  Info,
  Lightbulb,
  ArrowRight,
  Filter,
  Search,
  SortAsc,
  Eye,
  Calendar
} from 'lucide-react';
import { 
  MatchingResult,
  ProfileMatch,
  UserProfile
} from '@/types/multi-profile';
import { JobOpportunity } from '@/lib/profileMatchingEngine';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MatchingResultsProps {
  matchingResult: MatchingResult;
  opportunity: JobOpportunity;
  onApply: (profileId: string) => void;
  onSaveJob: (jobId: string) => void;
  onShareJob: (jobId: string) => void;
  onViewProfile: (profileId: string) => void;
}

export default function MatchingResults({
  matchingResult,
  opportunity,
  onApply,
  onSaveJob,
  onShareJob,
  onViewProfile
}: MatchingResultsProps) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfileMatch | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 50) return 'Moderate Match';
    return 'Poor Match';
  };

  const handleApply = (profileMatch: ProfileMatch) => {
    setSelectedProfile(profileMatch);
    setShowApplyDialog(true);
  };

  const confirmApply = () => {
    if (selectedProfile) {
      onApply(selectedProfile.profileId);
      setShowApplyDialog(false);
      setSelectedProfile(null);
    }
  };

  // Job Overview Component
  const JobOverview = () => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{opportunity.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2 text-base">
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
            <Button variant="outline" size="sm" onClick={() => onSaveJob(opportunity.id)}>
              <Bookmark className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={() => onShareJob(opportunity.id)}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span>${(opportunity.salaryRange[0] / 1000).toFixed(0)}k - ${(opportunity.salaryRange[1] / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="capitalize">{opportunity.companySize} company</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-500" />
            <span>{opportunity.yearsExperienceRequired}+ years experience</span>
          </div>
          <Badge variant={opportunity.urgency === 'high' ? 'destructive' : opportunity.urgency === 'medium' ? 'default' : 'secondary'}>
            {opportunity.urgency} priority
          </Badge>
        </div>

        <p className="text-gray-700">{opportunity.description}</p>

        {/* Required Skills */}
        <div>
          <h4 className="font-medium mb-2">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {opportunity.requiredSkills.map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-sm">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Preferred Skills */}
        {opportunity.preferredSkills.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Preferred Skills</h4>
            <div className="flex flex-wrap gap-2">
              {opportunity.preferredSkills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Best Match Component
  const BestMatch = () => {
    const bestMatch = matchingResult.profileMatches[0];
    
    return (
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Best Match: {bestMatch.profileName}
              </CardTitle>
              <CardDescription>Recommended profile for this opportunity</CardDescription>
            </div>
            <div className="text-right">
              <div className={cn("text-2xl font-bold px-3 py-1 rounded-lg", getMatchScoreColor(bestMatch.matchScore))}>
                {bestMatch.matchScore}%
              </div>
              <p className="text-sm text-gray-600 mt-1">{getMatchScoreLabel(bestMatch.matchScore)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Match Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{bestMatch.skillMatch.skillMatchPercentage}%</div>
              <p className="text-sm text-gray-600">Skills Match</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{bestMatch.experienceMatch.yearsExperienceMatch}%</div>
              <p className="text-sm text-gray-600">Experience Match</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">
                {Math.round((
                  bestMatch.preferenceMatch.salaryAlignment * 0.4 +
                  (bestMatch.preferenceMatch.workTypeMatch ? 25 : 0) +
                  (bestMatch.preferenceMatch.locationMatch ? 20 : 0) +
                  bestMatch.preferenceMatch.industryPreferenceMatch * 0.1 +
                  (bestMatch.preferenceMatch.companySizeMatch ? 5 : 0)
                ))}%
              </div>
              <p className="text-sm text-gray-600">Preferences Match</p>
            </div>
          </div>

          {/* Key Strengths */}
          <div>
            <h4 className="font-medium mb-2">Why This is a Great Match</h4>
            <div className="space-y-2">
              {matchingResult.reasoning.whyGoodMatch.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Potential Concerns */}
          {matchingResult.reasoning.potentialConcerns.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Potential Considerations</h4>
              <div className="space-y-2">
                {matchingResult.reasoning.potentialConcerns.map((concern, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <span>{concern}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button onClick={() => handleApply(bestMatch)} className="flex-1">
              <Send className="w-4 h-4 mr-1" />
              Apply with This Profile
            </Button>
            <Button variant="outline" onClick={() => onViewProfile(bestMatch.profileId)}>
              <Eye className="w-4 h-4 mr-1" />
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // All Profile Matches Component
  const AllMatches = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">All Profile Matches ({matchingResult.profileMatches.length})</h3>
      
      {matchingResult.profileMatches.map((profileMatch, idx) => (
        <Card key={profileMatch.profileId} className={cn(
          "transition-all",
          idx === 0 && "border-blue-200 bg-blue-50"
        )}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {idx === 0 && <Star className="w-5 h-5 text-yellow-500" />}
                <div>
                  <CardTitle className="text-base">{profileMatch.profileName}</CardTitle>
                  <CardDescription>Match Score: {profileMatch.matchScore}%</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("px-3 py-1 rounded-lg font-medium", getMatchScoreColor(profileMatch.matchScore))}>
                  {profileMatch.matchScore}%
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedMatch(expandedMatch === profileMatch.profileId ? null : profileMatch.profileId)}
                >
                  {expandedMatch === profileMatch.profileId ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </Button>
              </div>
            </div>
          </CardHeader>

          {expandedMatch === profileMatch.profileId && (
            <CardContent className="space-y-4">
              {/* Detailed Match Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Skills Match */}
                <div className="space-y-2">
                  <h4 className="font-medium">Skills Analysis</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Match Rate:</span>
                      <span className="font-medium">{profileMatch.skillMatch.skillMatchPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Matched Skills:</span>
                      <span className="font-medium">{profileMatch.skillMatch.matchedSkills.length}</span>
                    </div>
                    {profileMatch.skillMatch.missingCriticalSkills.length > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Missing Critical:</span>
                        <span className="font-medium">{profileMatch.skillMatch.missingCriticalSkills.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience Match */}
                <div className="space-y-2">
                  <h4 className="font-medium">Experience Analysis</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Years Match:</span>
                      <span className="font-medium">{profileMatch.experienceMatch.yearsExperienceMatch}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Role Relevance:</span>
                      <span className="font-medium">{profileMatch.experienceMatch.roleRelevanceScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seniority:</span>
                      <span className={cn("font-medium capitalize",
                        profileMatch.experienceMatch.seniorityMatch === 'match' ? 'text-green-600' :
                        profileMatch.experienceMatch.seniorityMatch === 'over' ? 'text-blue-600' : 'text-orange-600'
                      )}>
                        {profileMatch.experienceMatch.seniorityMatch}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preferences Match */}
                <div className="space-y-2">
                  <h4 className="font-medium">Preferences</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Salary:</span>
                      <span className="font-medium">{profileMatch.preferenceMatch.salaryAlignment}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Work Type:</span>
                      <span className={cn("font-medium", profileMatch.preferenceMatch.workTypeMatch ? 'text-green-600' : 'text-red-600')}>
                        {profileMatch.preferenceMatch.workTypeMatch ? 'Match' : 'No Match'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className={cn("font-medium", profileMatch.preferenceMatch.locationMatch ? 'text-green-600' : 'text-red-600')}>
                        {profileMatch.preferenceMatch.locationMatch ? 'Match' : 'No Match'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gap Analysis */}
              {(profileMatch.gapAnalysis.skillGaps.length > 0 || 
                profileMatch.gapAnalysis.certificationGaps.length > 0) && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    Areas for Improvement
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {profileMatch.gapAnalysis.skillGaps.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-600 mb-1">Missing Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {profileMatch.gapAnalysis.skillGaps.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs text-red-600 border-red-300">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profileMatch.gapAnalysis.certificationGaps.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-600 mb-1">Recommended Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {profileMatch.gapAnalysis.certificationGaps.map((cert, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs text-blue-600 border-blue-300">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <Info className="w-4 h-4 inline mr-1" />
                    Time to qualify: {profileMatch.gapAnalysis.timeToQualify}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button 
                  onClick={() => handleApply(profileMatch)}
                  variant={idx === 0 ? "default" : "outline"}
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Apply with This Profile
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onViewProfile(profileMatch.profileId)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );

  // Overall Assessment Component
  const OverallAssessment = () => (
    <Card>
      <CardHeader>
        <CardTitle>Overall Assessment</CardTitle>
        <CardDescription>AI-powered analysis of your candidacy for this role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="font-medium text-blue-900">{matchingResult.reasoning.overallAssessment}</p>
        </div>

        {/* Improvement Suggestions */}
        {matchingResult.reasoning.improvementAreas.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Recommended Improvements
            </h4>
            <div className="space-y-2">
              {matchingResult.reasoning.improvementAreas.map((area, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <ArrowRight className="w-4 h-4 text-gray-500 mt-0.5" />
                  <span className="text-sm">{area}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Next Steps</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
              <span>Review the detailed match analysis above</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">2</div>
              <span>Choose your best matching profile for application</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">3</div>
              <span>Consider improving skills in gap areas before applying</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Job Information */}
      <JobOverview />

      {/* Matching Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Best Match</TabsTrigger>
          <TabsTrigger value="all">All Profiles</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <BestMatch />
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <AllMatches />
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          <OverallAssessment />
        </TabsContent>
      </Tabs>

      {/* Apply Confirmation Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Application</DialogTitle>
            <DialogDescription>
              You are about to apply for "{opportunity.title}" at {opportunity.company} using your "{selectedProfile?.profileName}" profile.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProfile && (
            <div className="py-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium mb-2">Application Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Match Score:</span>
                    <span className="font-medium">{selectedProfile.matchScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profile:</span>
                    <span className="font-medium">{selectedProfile.profileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skills Match:</span>
                    <span className="font-medium">{selectedProfile.skillMatch.skillMatchPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApply}>
              <Send className="w-4 h-4 mr-1" />
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}