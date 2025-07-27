'use client';

import React from 'react';
import { 
  Shield, 
  TrendingUp, 
  Award, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Users,
  Briefcase,
  FileCheck
} from 'lucide-react';
import { VerificationBadgeSystem, VerificationType, VERIFICATION_TIERS } from '@/types/verification';
import { cn } from '@/lib/utils';

interface TrustScoreAnalyticsProps {
  verificationStatus: VerificationBadgeSystem;
  onImprove?: (area: string) => void;
}

export default function TrustScoreAnalytics({
  verificationStatus,
  onImprove
}: TrustScoreAnalyticsProps) {
  
  // Calculate trust score breakdown
  const calculateScoreBreakdown = () => {
    const breakdown = {
      identity: 0,
      professional: 0,
      skills: 0,
      social: 0
    };

    // Identity score (max 30 points)
    if (verificationStatus.identityVerification.status === 'verified') {
      breakdown.identity += 15;
    }
    if (verificationStatus.emailVerification.status === 'verified') {
      breakdown.identity += 8;
    }
    if (verificationStatus.phoneVerification.status === 'verified') {
      breakdown.identity += 7;
    }

    // Professional score (max 30 points)
    if (verificationStatus.educationVerification.status === 'verified') {
      breakdown.professional += 15;
    }
    if (verificationStatus.employmentVerification.status === 'verified') {
      breakdown.professional += 15;
    }

    // Skills score (max 25 points)
    const verifiedSkills = verificationStatus.skillVerification?.filter(s => s.status === 'verified').length || 0;
    const verifiedCerts = verificationStatus.certificationVerification?.filter(c => c.status === 'verified').length || 0;
    breakdown.skills = Math.min(25, (verifiedSkills * 5) + (verifiedCerts * 10));

    // Social score (max 15 points)
    if (verificationStatus.socialVerification?.status === 'verified') {
      breakdown.social = 15;
    }

    return breakdown;
  };

  const scoreBreakdown = calculateScoreBreakdown();
  const totalPossible = 100;

  // Get improvement opportunities
  const getImprovementOpportunities = () => {
    const opportunities = [];

    if (verificationStatus.identityVerification.status !== 'verified') {
      opportunities.push({
        type: 'identity',
        title: 'Verify Your Identity',
        description: 'Complete identity verification to boost trust by 15 points',
        impact: 15,
        difficulty: 'easy',
        icon: Shield
      });
    }

    if (verificationStatus.educationVerification.status !== 'verified') {
      opportunities.push({
        type: 'education',
        title: 'Verify Education',
        description: 'Add your educational credentials for +15 trust points',
        impact: 15,
        difficulty: 'medium',
        icon: FileCheck
      });
    }

    if (verificationStatus.employmentVerification.status !== 'verified') {
      opportunities.push({
        type: 'employment',
        title: 'Verify Employment',
        description: 'Confirm your work history for +15 trust points',
        impact: 15,
        difficulty: 'medium',
        icon: Briefcase
      });
    }

    if (!verificationStatus.skillVerification?.length) {
      opportunities.push({
        type: 'skills',
        title: 'Verify Skills',
        description: 'Take skill assessments to prove your expertise',
        impact: 10,
        difficulty: 'easy',
        icon: Award
      });
    }

    return opportunities.sort((a, b) => b.impact - a.impact).slice(0, 3);
  };

  const opportunities = getImprovementOpportunities();

  // Calculate score trend (mock data for now)
  const scoreTrend = [
    { month: 'Jan', score: 20 },
    { month: 'Feb', score: 35 },
    { month: 'Mar', score: 45 },
    { month: 'Apr', score: 60 },
    { month: 'May', score: verificationStatus.overallTrustScore }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Trust Score Analytics
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Understand and improve your credibility score
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {verificationStatus.overallTrustScore}
          </div>
          <div className="text-sm text-gray-500">out of 100</div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-semibold">{scoreBreakdown.identity}/30</div>
          <div className="text-xs text-gray-600">Identity</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-semibold">{scoreBreakdown.professional}/30</div>
          <div className="text-xs text-gray-600">Professional</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-lg font-semibold">{scoreBreakdown.skills}/25</div>
          <div className="text-xs text-gray-600">Skills</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-lg font-semibold">{scoreBreakdown.social}/15</div>
          <div className="text-xs text-gray-600">Social</div>
        </div>
      </div>

      {/* Score Trend Chart (simplified) */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Trust Score Trend</h3>
        <div className="h-32 flex items-end justify-between gap-2">
          {scoreTrend.map((point, index) => (
            <div key={point.month} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t relative">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500"
                  style={{ height: `${(point.score / 100) * 128}px` }}
                />
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                  {point.score}
                </span>
              </div>
              <span className="text-xs text-gray-600 mt-1">{point.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Opportunities */}
      {opportunities.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Wins to Improve Score</h3>
          <div className="space-y-3">
            {opportunities.map((opp, index) => {
              const Icon = opp.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => onImprove?.(opp.type)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">{opp.title}</div>
                      <div className="text-sm text-blue-700">{opp.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">+{opp.impact}</span>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievement Status */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium text-purple-900">
                {verificationStatus.overallTrustScore >= 80 ? 'Excellent Trust Score!' :
                 verificationStatus.overallTrustScore >= 60 ? 'Good Progress!' :
                 'Keep Building Trust'}
              </div>
              <div className="text-sm text-purple-700">
                {verificationStatus.overallTrustScore >= 80 
                  ? 'You have access to premium opportunities'
                  : `${100 - verificationStatus.overallTrustScore} points away from maximum benefits`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}