'use client';

import React from 'react';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Share2, 
  Download,
  Camera,
  Shield,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import VerificationBadge from './VerificationBadge';
import { PersonalInfoDisplay, VerificationBadgeSystem, VERIFICATION_TIERS, VerificationType } from '@/types/verification';
import { cn } from '@/lib/utils';

interface ProfileHeaderProps {
  personalInfo: PersonalInfoDisplay;
  verificationStatus: VerificationBadgeSystem;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
  onExport?: () => void;
}

export default function ProfileHeader({
  personalInfo,
  verificationStatus,
  isOwnProfile = true,
  onEdit,
  onShare,
  onExport
}: ProfileHeaderProps) {
  
  // Get current verification tier
  const getCurrentTier = () => {
    const verifiedTypes = new Set<VerificationType>();
    
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

  // Get key verified badges to display
  const getKeyBadges = () => {
    const badges = [];
    
    if (verificationStatus.identityVerification.status === 'verified') {
      badges.push(verificationStatus.identityVerification);
    }
    if (verificationStatus.educationVerification.status === 'verified') {
      badges.push(verificationStatus.educationVerification);
    }
    if (verificationStatus.employmentVerification.status === 'verified') {
      badges.push(verificationStatus.employmentVerification);
    }
    
    return badges.slice(0, 3); // Show max 3 badges
  };

  const keyBadges = getKeyBadges();

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Cover Photo Area */}
      <div className="h-32 md:h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {isOwnProfile && (
          <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-colors">
            <Camera className="w-4 h-4 text-gray-700" />
          </button>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 md:-mt-20 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                {personalInfo.profilePhoto ? (
                  <Image
                    src={personalInfo.profilePhoto}
                    alt={personalInfo.name}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Verification Tier Badge */}
              {currentTier && (
                <div className={cn(
                  'absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-medium shadow-lg',
                  currentTier.color === 'gold' && 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white',
                  currentTier.color === 'purple' && 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
                  currentTier.color === 'green' && 'bg-green-500 text-white',
                  currentTier.color === 'blue' && 'bg-blue-500 text-white'
                )}>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {currentTier.name}
                  </div>
                </div>
              )}
              
              {isOwnProfile && (
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-200">
                  <Camera className="w-4 h-4 text-gray-700" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                    {personalInfo.name}
                    {/* Key Verification Badges */}
                    <div className="flex items-center gap-2">
                      {keyBadges.map((badge, index) => (
                        <VerificationBadge
                          key={index}
                          badge={badge}
                          size="small"
                          showDetails={false}
                        />
                      ))}
                    </div>
                  </h1>
                  <p className="text-lg text-gray-700 mt-1">{personalInfo.headline}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {personalInfo.location}
                    </div>
                    {personalInfo.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {personalInfo.email}
                      </div>
                    )}
                    {personalInfo.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {personalInfo.phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {isOwnProfile ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onEdit}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onShare}
                        className="flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onExport}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        Connect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              {personalInfo.bio && (
                <p className="text-gray-600 mt-4 max-w-3xl">
                  {personalInfo.bio}
                </p>
              )}

              {/* Trust Score Bar */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Trust Score</span>
                </div>
                <div className="flex-1 max-w-xs">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${verificationStatus.overallTrustScore}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {verificationStatus.overallTrustScore}/100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}