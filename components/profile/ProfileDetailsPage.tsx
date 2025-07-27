'use client';

import React, { useState } from 'react';
import { 
  User, 
  Edit2, 
  Share2, 
  Download,
  Eye,
  Calendar,
  Award,
  BarChart3,
  Target,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Building,
  Code,
  Database,
  Brain,
  Palette,
  Server,
  Cloud,
  Bot,
  LineChart,
  Star,
  ChevronDown
} from 'lucide-react';
import { 
  UserProfile, 
  ProfileCategory,
  ProfilePerformanceMetrics,
  SkillLevel,
  ProfileAnalytics
} from '@/types/multi-profile';
import { 
  VerificationBadgeSystem,
  VERIFICATION_TIERS
} from '@/types/verification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { PROFILE_TEMPLATES } from '@/lib/profileTemplates';
import VerificationBadgesSection from './VerificationBadgesSection';
import TrustScoreAnalytics from './TrustScoreAnalytics';

interface ProfileDetailsPageProps {
  userProfile: UserProfile;
  verificationStatus: VerificationBadgeSystem;
  performanceMetrics?: ProfilePerformanceMetrics;
  analytics?: ProfileAnalytics;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  onSwitchProfile?: (profileId: string) => void;
  allProfiles?: UserProfile[];
}

export default function ProfileDetailsPage({ 
  userProfile,
  verificationStatus,
  performanceMetrics,
  analytics,
  isOwnProfile = true,
  onEdit,
  onShare,
  onExport,
  onSwitchProfile,
  allProfiles = []
}: ProfileDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  // Get template info for the profile
  const profileTemplate = PROFILE_TEMPLATES.find(t => t.category === userProfile.category);
  
  // Calculate current verification tier
  const currentTier = VERIFICATION_TIERS.find(tier => {
    const hasAllRequired = tier.requiredVerifications.every(reqType => {
      const badge = Object.values(verificationStatus).find(b => 
        typeof b === 'object' && 'type' in b && b.type === reqType
      );
      return badge && badge.status === 'verified';
    });
    return hasAllRequired;
  }) || { name: 'Unverified', color: 'gray' as const, benefits: [], trustScoreBonus: 0 };

  // Get category icon
  const getCategoryIcon = (category: ProfileCategory) => {
    switch (category) {
      case ProfileCategory.DATA_ENGINEER: return Database;
      case ProfileCategory.DATA_ANALYST: return LineChart;
      case ProfileCategory.DATA_SCIENTIST: return Brain;
      case ProfileCategory.FULL_STACK_DEVELOPER: return Code;
      case ProfileCategory.FRONTEND_DEVELOPER: return Palette;
      case ProfileCategory.BACKEND_DEVELOPER: return Server;
      case ProfileCategory.DEVOPS_ENGINEER: return Cloud;
      case ProfileCategory.ML_ENGINEER: return Bot;
      case ProfileCategory.PRODUCT_MANAGER: return Target;
      case ProfileCategory.BUSINESS_ANALYST: return BarChart3;
      default: return User;
    }
  };

  const CategoryIcon = getCategoryIcon(userProfile.category);

  // Get skill level label
  const getSkillLevelLabel = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.BEGINNER: return 'Beginner';
      case SkillLevel.INTERMEDIATE: return 'Intermediate';
      case SkillLevel.PROFICIENT: return 'Proficient';
      case SkillLevel.ADVANCED: return 'Advanced';
      case SkillLevel.EXPERT: return 'Expert';
    }
  };

  const getSkillLevelColor = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.BEGINNER: return 'bg-gray-200 text-gray-700';
      case SkillLevel.INTERMEDIATE: return 'bg-blue-100 text-blue-700';
      case SkillLevel.PROFICIENT: return 'bg-green-100 text-green-700';
      case SkillLevel.ADVANCED: return 'bg-purple-100 text-purple-700';
      case SkillLevel.EXPERT: return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header with Multi-Profile Support */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Profile Avatar with Category Icon */}
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback>
                    <CategoryIcon className="w-12 h-12 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center",
                  currentTier.color === 'gold' ? 'bg-yellow-500' :
                  currentTier.color === 'purple' ? 'bg-purple-500' :
                  currentTier.color === 'green' ? 'bg-green-500' :
                  currentTier.color === 'blue' ? 'bg-blue-500' : 'bg-gray-400'
                )}>
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1">
                {/* Profile Switcher */}
                {isOwnProfile && allProfiles.length > 1 && (
                  <div className="mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      <span className="font-medium">{userProfile.name}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                    
                    {showProfileSwitcher && (
                      <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border p-2 min-w-[250px]">
                        {allProfiles.map(profile => (
                          <button
                            key={profile.id}
                            onClick={() => {
                              onSwitchProfile?.(profile.id);
                              setShowProfileSwitcher(false);
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center gap-3",
                              profile.id === userProfile.id && "bg-blue-50"
                            )}
                          >
                            <CategoryIcon className="w-4 h-4 text-gray-500" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{profile.name}</div>
                              <div className="text-xs text-gray-500">{profile.category.replace('_', ' ')}</div>
                            </div>
                            {profile.id === userProfile.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                <p className="text-gray-600 mt-1">{userProfile.description}</p>
                
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CategoryIcon className="w-3 h-3" />
                    {profileTemplate?.name || userProfile.category}
                  </Badge>
                  
                  <Badge variant={currentTier.color === 'gold' ? 'default' : 'outline'} 
                    className={cn(
                      currentTier.color === 'gold' && 'bg-yellow-500',
                      currentTier.color === 'purple' && 'bg-purple-500 text-white',
                      currentTier.color === 'green' && 'bg-green-500 text-white',
                      currentTier.color === 'blue' && 'bg-blue-500 text-white'
                    )}
                  >
                    {currentTier.name}
                  </Badge>

                  {userProfile.isActive ? (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      Inactive
                    </Badge>
                  )}
                </div>

                {/* Quick Stats */}
                {performanceMetrics && (
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{performanceMetrics.totalOpportunities} opportunities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{performanceMetrics.responseRate}% response rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{performanceMetrics.marketTrend} market</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onShare}>
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" onClick={onEdit}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Profile Strength</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completion</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">Skills added</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600">Add certifications</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trust Score</span>
                    <span className="text-lg font-bold text-blue-600">
                      {verificationStatus.overallTrustScore}/100
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Current Tier</span>
                      <Badge variant="outline" className="text-xs">
                        {currentTier.name}
                      </Badge>
                    </div>
                    
                    {currentTier.name !== 'Expert Verified' && (
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Upgrade Tier
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Preferences Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Job Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Salary Range</span>
                    <div className="font-medium">
                      ${(userProfile.jobPreferences.salaryRange[0] / 1000).toFixed(0)}k - 
                      ${(userProfile.jobPreferences.salaryRange[1] / 1000).toFixed(0)}k
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Work Type</span>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {userProfile.jobPreferences.workType.map(type => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Availability</span>
                    <div className="font-medium">
                      {new Date(userProfile.jobPreferences.availabilityDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Verification Badges */}
                <VerificationBadgesSection
                  verificationStatus={verificationStatus}
                  onVerifyClick={(type) => console.log('Verify:', type)}
                />

                {/* Trust Score */}
                <TrustScoreAnalytics
                  verificationStatus={verificationStatus}
                  onImprove={(area) => console.log('Improve:', area)}
                />

                {/* Profile Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Primary Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userProfile.primarySkills.length}</div>
                      <p className="text-sm text-gray-500 mt-1">Core competencies</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userProfile.relevantExperience.length}</div>
                      <p className="text-sm text-gray-500 mt-1">Relevant positions</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userProfile.certifications.length}</div>
                      <p className="text-sm text-gray-500 mt-1">Verified credentials</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Market Insights */}
                {profileTemplate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Market Insights</CardTitle>
                      <CardDescription>
                        Industry trends for {profileTemplate.name} roles
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Market Demand</span>
                        <Badge variant={profileTemplate.marketDemand === 'high' ? 'default' : 'secondary'}>
                          {profileTemplate.marketDemand}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Growth Rate</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-green-600">+{profileTemplate.growthRate}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600">Typical Career Path</span>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          {profileTemplate.careerProgression.slice(0, 3).map((role, idx) => (
                            <React.Fragment key={role}>
                              <span>{role}</span>
                              {idx < 2 && <ChevronRight className="w-3 h-3" />}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                {/* Primary Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Primary Skills</CardTitle>
                    <CardDescription>Core competencies for this profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userProfile.primarySkills.map((skill, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{skill.name}</span>
                              <Badge className={cn("text-xs", getSkillLevelColor(skill.level))}>
                                {getSkillLevelLabel(skill.level)}
                              </Badge>
                              {skill.certifications.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <Award className="w-3 h-3 mr-1" />
                                  Certified
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {skill.yearsExperience} years
                            </span>
                          </div>
                          <Progress value={skill.level * 20} className="h-2" />
                          <div className="text-xs text-gray-500">
                            Last used: {skill.lastUsed} • {skill.projects.length} projects
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Secondary Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Secondary Skills</CardTitle>
                    <CardDescription>Supporting skills and technologies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.secondarySkills.map((skill, idx) => (
                        <TooltipProvider key={idx}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="secondary" className="cursor-pointer">
                                {skill.name}
                                <span className="ml-1 text-xs opacity-70">
                                  L{skill.level}
                                </span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <p>{getSkillLevelLabel(skill.level)} • {skill.yearsExperience} years</p>
                                <p className="text-xs text-gray-400">Last used: {skill.lastUsed}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Skills */}
                {userProfile.learningSkills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Currently Learning</CardTitle>
                      <CardDescription>Skills in development</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.learningSkills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-purple-600 border-purple-300">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                {userProfile.relevantExperience.map((exp) => (
                  <Card key={exp.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{exp.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Building className="w-4 h-4" />
                            {exp.company} • {exp.duration}
                          </CardDescription>
                        </div>
                        {exp.verified && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{exp.description}</p>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Key Achievements:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {exp.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                {/* Certifications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Certifications</CardTitle>
                    <CardDescription>Professional certifications and credentials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userProfile.certifications.map((cert) => (
                        <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Award className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{cert.name}</h4>
                              <p className="text-sm text-gray-500">{cert.issuer} • Issued {cert.issueDate}</p>
                            </div>
                          </div>
                          {cert.verified && (
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Notable accomplishments and milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userProfile.achievements.map((achievement) => (
                        <div key={achievement.id} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {achievement.date}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {achievement.category}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {/* Performance Metrics */}
                {performanceMetrics && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>How this profile is performing in the market</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {performanceMetrics.applicationsSubmitted}
                          </div>
                          <p className="text-sm text-gray-500">Applications</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {performanceMetrics.responseRate}%
                          </div>
                          <p className="text-sm text-gray-500">Response Rate</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {performanceMetrics.interviewRate}%
                          </div>
                          <p className="text-sm text-gray-500">Interview Rate</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            ${(performanceMetrics.avgSalaryOffered / 1000).toFixed(0)}k
                          </div>
                          <p className="text-sm text-gray-500">Avg Offer</p>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div>
                        <h4 className="font-medium mb-3">Top Performing Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {performanceMetrics.topPerformingSkills.map((skill, idx) => (
                            <Badge key={idx} variant="default" className="bg-green-500">
                              <Star className="w-3 h-3 mr-1" />
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Market Analysis */}
                {analytics && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Market Analysis</CardTitle>
                      <CardDescription>Your competitiveness in the current market</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Market Competitiveness</span>
                          <span className="text-sm font-bold">{analytics.marketCompetitiveness}%</span>
                        </div>
                        <Progress value={analytics.marketCompetitiveness} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Skill Relevance</span>
                          <span className="text-sm font-bold">{analytics.skillRelevanceScore}%</span>
                        </div>
                        <Progress value={analytics.skillRelevanceScore} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Experience Alignment</span>
                          <span className="text-sm font-bold">{analytics.experienceAlignment}%</span>
                        </div>
                        <Progress value={analytics.experienceAlignment} className="h-2" />
                      </div>

                      {/* Improvement Suggestions */}
                      {analytics.improvementSuggestions.length > 0 && (
                        <div className="pt-4">
                          <h4 className="font-medium mb-3">Improvement Suggestions</h4>
                          <div className="space-y-3">
                            {analytics.improvementSuggestions.slice(0, 3).map((suggestion, idx) => (
                              <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <div className={cn(
                                  "w-2 h-2 rounded-full mt-1.5",
                                  suggestion.priority === 'high' ? 'bg-red-500' :
                                  suggestion.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                )} />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{suggestion.description}</p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {suggestion.expectedImpact} • {suggestion.timeToComplete}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}