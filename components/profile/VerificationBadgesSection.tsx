'use client';

import React from 'react';
import { Shield, TrendingUp, Award, Info } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import { VerificationBadgeSystem, VERIFICATION_TIERS, VerificationType } from '@/types/verification';
import { cn } from '@/lib/utils';

interface VerificationBadgesSectionProps {
  verificationStatus: VerificationBadgeSystem;
  onVerifyClick?: (type: VerificationType) => void;
}

export default function VerificationBadgesSection({ 
  verificationStatus,
  onVerifyClick 
}: VerificationBadgesSectionProps) {
  
  // Calculate current verification tier
  const getCurrentTier = () => {
    const verifiedTypes = new Set<VerificationType>();
    
    // Collect all verified badges
    if (verificationStatus.identityVerification.status === 'verified') {
      verifiedTypes.add(VerificationType.IDENTITY);
    }
    if (verificationStatus.emailVerification.status === 'verified') {
      verifiedTypes.add(VerificationType.EMAIL);
    }
    if (verificationStatus.phoneVerification.status === 'verified') {
      verifiedTypes.add(VerificationType.PHONE);
    }
    if (verificationStatus.educationVerification.status === 'verified') {
      verifiedTypes.add(VerificationType.EDUCATION);
    }
    if (verificationStatus.employmentVerification.status === 'verified') {
      verifiedTypes.add(VerificationType.EMPLOYMENT);
    }
    
    // Find highest matching tier
    let currentTier = null;
    for (const tier of [...VERIFICATION_TIERS].reverse()) {
      const hasAllRequired = tier.requiredVerifications.every(req => verifiedTypes.has(req));
      if (hasAllRequired) {
        currentTier = tier;
        break;
      }
    }
    
    return currentTier;
  };

  const currentTier = getCurrentTier();
  const nextTier = currentTier 
    ? VERIFICATION_TIERS[VERIFICATION_TIERS.indexOf(currentTier) + 1] 
    : VERIFICATION_TIERS[0];

  // Group badges by category
  const basicBadges = [
    verificationStatus.emailVerification,
    verificationStatus.phoneVerification,
    verificationStatus.identityVerification
  ];

  const professionalBadges = [
    verificationStatus.educationVerification,
    verificationStatus.employmentVerification
  ];

  const skillBadges = verificationStatus.skillVerification || [];
  const certBadges = verificationStatus.certificationVerification || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header with Trust Score */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Verification Status
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Build trust and unlock premium opportunities
          </p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">
              {verificationStatus.overallTrustScore}
            </span>
            <span className="text-sm text-gray-500">/100</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Trust Score</p>
        </div>
      </div>

      {/* Current Tier Status */}
      {currentTier && (
        <div className={cn(
          'rounded-lg p-4 mb-6',
          currentTier.color === 'gold' && 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200',
          currentTier.color === 'purple' && 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200',
          currentTier.color === 'green' && 'bg-green-50 border border-green-200',
          currentTier.color === 'blue' && 'bg-blue-50 border border-blue-200'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className={cn(
                'w-6 h-6',
                currentTier.color === 'gold' && 'text-yellow-600',
                currentTier.color === 'purple' && 'text-purple-600',
                currentTier.color === 'green' && 'text-green-600',
                currentTier.color === 'blue' && 'text-blue-600'
              )} />
              <div>
                <h3 className="font-semibold text-gray-900">{currentTier.name}</h3>
                <p className="text-sm text-gray-600">
                  You've unlocked {currentTier.benefits.length} benefits
                </p>
              </div>
            </div>
            {nextTier && (
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Upgrade to {nextTier.name} →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Basic Verifications */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Basic Verifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {basicBadges.map((badge, index) => (
              <VerificationBadge
                key={index}
                badge={badge}
                onClick={() => onVerifyClick?.(badge.type)}
              />
            ))}
          </div>
        </div>

        {/* Professional Verifications */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Professional Verifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {professionalBadges.map((badge, index) => (
              <VerificationBadge
                key={index}
                badge={badge}
                onClick={() => onVerifyClick?.(badge.type)}
              />
            ))}
          </div>
        </div>

        {/* Skills & Certifications */}
        {(skillBadges.length > 0 || certBadges.length > 0) && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Skills & Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {skillBadges.map((badge, index) => (
                <VerificationBadge
                  key={`skill-${index}`}
                  badge={badge}
                  size="small"
                  showDetails={false}
                />
              ))}
              {certBadges.map((badge, index) => (
                <VerificationBadge
                  key={`cert-${index}`}
                  badge={badge}
                  size="small"
                  showDetails={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Steps */}
      {nextTier && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Next: {nextTier.name}</h4>
              <p className="text-sm text-blue-700 mt-1">
                Complete {nextTier.requiredVerifications.length - (currentTier?.requiredVerifications.length || 0)} more verifications to unlock:
              </p>
              <ul className="mt-2 space-y-1">
                {nextTier.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="text-sm text-blue-600 flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-600 rounded-full" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}