'use client';

import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Award,
  BadgeCheck,
  FileCheck,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  User,
  Lock,
  Sparkles,
  TrendingUp,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { 
  VerificationBadgeSystem,
  VerificationType,
  VerificationBadge,
  VERIFICATION_TIERS,
  VerificationTier
} from '@/types/verification';

interface VerificationBadgeSystemProps {
  verificationStatus: VerificationBadgeSystem;
  onVerifyClick: (type: VerificationType) => void;
  onUpgradeTier?: (tier: VerificationTier) => void;
  compact?: boolean;
}

export default function VerificationBadgeSystemComponent({
  verificationStatus,
  onVerifyClick,
  onUpgradeTier,
  compact = false
}: VerificationBadgeSystemProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate current tier and progress
  const getCurrentTier = () => {
    let currentTier: VerificationTier | null = null;
    
    for (const tier of VERIFICATION_TIERS) {
      const hasAllRequired = tier.requiredVerifications.every(reqType => {
        const badge = Object.values(verificationStatus).find(b => 
          typeof b === 'object' && 'type' in b && b.type === reqType
        ) as VerificationBadge | undefined;
        return badge && badge.status === 'verified';
      });
      
      if (hasAllRequired) {
        currentTier = tier;
      }
    }
    
    return currentTier || null;
  };

  const getNextTier = () => {
    const current = getCurrentTier();
    const currentIndex = current ? VERIFICATION_TIERS.indexOf(current) : -1;
    return VERIFICATION_TIERS[currentIndex + 1] || null;
  };

  const calculateTierProgress = (tier: VerificationTier) => {
    const verifiedCount = tier.requiredVerifications.filter(reqType => {
      const badge = Object.values(verificationStatus).find(b => 
        typeof b === 'object' && 'type' in b && b.type === reqType
      ) as VerificationBadge | undefined;
      return badge && badge.status === 'verified';
    }).length;
    
    return (verifiedCount / tier.requiredVerifications.length) * 100;
  };

  const getVerificationIcon = (type: VerificationType) => {
    switch (type) {
      case VerificationType.IDENTITY: return User;
      case VerificationType.EMAIL: return Mail;
      case VerificationType.PHONE: return Phone;
      case VerificationType.EDUCATION: return GraduationCap;
      case VerificationType.EMPLOYMENT: return Briefcase;
      case VerificationType.SKILL_ASSESSMENT: return Award;
      case VerificationType.SKILL_ENDORSEMENT: return BadgeCheck;
      case VerificationType.CERTIFICATION: return FileCheck;
      case VerificationType.PORTFOLIO: return Code;
      case VerificationType.SOCIAL_LINKEDIN: return Globe;
      case VerificationType.SOCIAL_GITHUB: return Code;
      case VerificationType.BACKGROUND_CHECK: return Shield;
      default: return CheckCircle;
    }
  };

  const getVerificationLabel = (type: VerificationType) => {
    switch (type) {
      case VerificationType.IDENTITY: return 'Identity Verification';
      case VerificationType.EMAIL: return 'Email Verified';
      case VerificationType.PHONE: return 'Phone Verified';
      case VerificationType.EDUCATION: return 'Education Verified';
      case VerificationType.EMPLOYMENT: return 'Employment Verified';
      case VerificationType.SKILL_ASSESSMENT: return 'Skills Tested';
      case VerificationType.SKILL_ENDORSEMENT: return 'Skills Endorsed';
      case VerificationType.CERTIFICATION: return 'Certifications Verified';
      case VerificationType.PORTFOLIO: return 'Portfolio Verified';
      case VerificationType.SOCIAL_LINKEDIN: return 'LinkedIn Connected';
      case VerificationType.SOCIAL_GITHUB: return 'GitHub Connected';
      case VerificationType.BACKGROUND_CHECK: return 'Background Checked';
      default: return 'Verification';
    }
  };

  const getTierColor = (tierColor: string) => {
    switch (tierColor) {
      case 'gold': return 'bg-yellow-500 text-white';
      case 'purple': return 'bg-purple-500 text-white';
      case 'green': return 'bg-green-500 text-white';
      case 'blue': return 'bg-blue-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getBadgeColorClasses = (color: string, status: string) => {
    if (status !== 'verified') return 'bg-gray-100 text-gray-400 border-gray-200';
    
    switch (color) {
      case 'gold': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'purple': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'green': return 'bg-green-50 text-green-700 border-green-200';
      case 'blue': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  // Get all verification badges from the system
  const allBadges: VerificationBadge[] = [];
  Object.entries(verificationStatus).forEach(([key, value]) => {
    if (typeof value === 'object' && 'type' in value) {
      if (Array.isArray(value)) {
        allBadges.push(...value);
      } else {
        allBadges.push(value as VerificationBadge);
      }
    }
  });

  const verifiedBadges = allBadges.filter(b => b.status === 'verified');
  const pendingBadges = allBadges.filter(b => b.status === 'pending');
  const notStartedBadges = allBadges.filter(b => b.status === 'not_started');

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            Verification Status
            <Badge className={cn("text-xs", currentTier ? getTierColor(currentTier.color) : 'bg-gray-400')}>
              {currentTier?.name || 'Unverified'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Trust Score</span>
              <span className="text-lg font-bold text-blue-600">
                {verificationStatus.overallTrustScore}/100
              </span>
            </div>
            
            <Progress value={verificationStatus.overallTrustScore} className="h-2" />
            
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="text-center">
                <div className="text-sm font-medium">{verifiedBadges.length}</div>
                <div className="text-xs text-gray-500">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{pendingBadges.length}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{notStartedBadges.length}</div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
            </div>
            
            {nextTier && (
              <Button 
                size="sm" 
                className="w-full mt-2"
                onClick={() => onUpgradeTier?.(nextTier)}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Upgrade to {nextTier.name}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Verification System</CardTitle>
            <CardDescription>
              Build trust and unlock opportunities with verified credentials
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {verificationStatus.overallTrustScore}/100
            </div>
            <p className="text-sm text-gray-500">Trust Score</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Current Tier Status */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    currentTier ? getTierColor(currentTier.color) : 'bg-gray-400'
                  )}>
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {currentTier?.name || 'Unverified'}
                    </h3>
                    <p className="text-sm text-gray-600">Current verification tier</p>
                  </div>
                </div>
                {nextTier && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Next tier</p>
                    <p className="font-medium">{nextTier.name}</p>
                  </div>
                )}
              </div>

              {nextTier && (
                <>
                  <Progress value={calculateTierProgress(nextTier)} className="h-2 mb-2" />
                  <p className="text-xs text-gray-600">
                    {Math.floor(calculateTierProgress(nextTier))}% progress to {nextTier.name}
                  </p>
                </>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{verifiedBadges.length}</div>
                    <p className="text-sm text-gray-500">Verified</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{pendingBadges.length}</div>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{notStartedBadges.length}</div>
                    <p className="text-sm text-gray-500">Available</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Benefits */}
            {currentTier && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Your Current Benefits
                </h4>
                <div className="space-y-2">
                  {currentTier.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            {/* Verification Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allBadges.map((badge, idx) => {
                const Icon = getVerificationIcon(badge.type);
                const isVerified = badge.status === 'verified';
                const isPending = badge.status === 'pending';
                
                return (
                  <div
                    key={idx}
                    className={cn(
                      "border rounded-lg p-4 transition-all",
                      isVerified && "border-green-200 bg-green-50",
                      isPending && "border-yellow-200 bg-yellow-50",
                      !isVerified && !isPending && "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          getBadgeColorClasses(badge.displayColor, badge.status)
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{getVerificationLabel(badge.type)}</h4>
                          <p className="text-xs text-gray-500">{badge.verificationMethod}</p>
                        </div>
                      </div>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge 
                              variant={isVerified ? "default" : isPending ? "secondary" : "outline"}
                              className={cn(
                                "text-xs",
                                isVerified && "bg-green-500",
                                isPending && "bg-yellow-500"
                              )}
                            >
                              {badge.status}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <p className="font-medium">Trust Value: +{badge.trustValue}</p>
                              {badge.verifiedDate && (
                                <p className="text-xs">Verified: {new Date(badge.verifiedDate).toLocaleDateString()}</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">{badge.description}</p>
                      
                      {!isVerified && (
                        <Button
                          size="sm"
                          variant={isPending ? "secondary" : "outline"}
                          className="mt-3 w-full"
                          onClick={() => onVerifyClick(badge.type)}
                          disabled={isPending}
                        >
                          {isPending ? 'Verification in Progress' : 'Start Verification'}
                          {!isPending && <ChevronRight className="w-4 h-4 ml-1" />}
                        </Button>
                      )}
                      
                      {isVerified && badge.expiryDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          Expires: {new Date(badge.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-4">
            {/* Verification Tiers */}
            <div className="space-y-4">
              {VERIFICATION_TIERS.map((tier, idx) => {
                const isCurrentTier = currentTier?.name === tier.name;
                const isAchieved = currentTier && VERIFICATION_TIERS.indexOf(currentTier) >= idx;
                const progress = calculateTierProgress(tier);
                
                return (
                  <div
                    key={tier.name}
                    className={cn(
                      "border rounded-lg p-4",
                      isCurrentTier && "border-blue-500 bg-blue-50",
                      isAchieved && !isCurrentTier && "border-green-200 bg-green-50",
                      !isAchieved && "border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          getTierColor(tier.color),
                          !isAchieved && "opacity-50"
                        )}>
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {tier.name}
                            {isCurrentTier && (
                              <Badge variant="default" className="text-xs">Current</Badge>
                            )}
                            {isAchieved && !isCurrentTier && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </h4>
                          <p className="text-sm text-gray-600">
                            +{tier.trustScoreBonus} Trust Score
                          </p>
                        </div>
                      </div>
                      
                      {!isAchieved && (
                        <div className="text-right">
                          <div className="text-sm font-medium">{Math.floor(progress)}%</div>
                          <Progress value={progress} className="w-20 h-2" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Required Verifications:</p>
                        <div className="flex flex-wrap gap-2">
                          {tier.requiredVerifications.map(reqType => {
                            const badge = allBadges.find(b => b.type === reqType);
                            const isVerified = badge?.status === 'verified';
                            
                            return (
                              <Badge
                                key={reqType}
                                variant={isVerified ? "default" : "outline"}
                                className={cn(
                                  "text-xs",
                                  isVerified && "bg-green-500"
                                )}
                              >
                                {isVerified && <CheckCircle className="w-3 h-3 mr-1" />}
                                {getVerificationLabel(reqType)}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Benefits:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {tier.benefits.slice(0, 3).map((benefit, bidx) => (
                            <li key={bidx} className="flex items-start gap-2">
                              <TrendingUp className="w-3 h-3 mt-0.5 text-gray-400" />
                              <span className="text-xs">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {!isAchieved && nextTier?.name === tier.name && (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => onUpgradeTier?.(tier)}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Upgrade to {tier.name}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}