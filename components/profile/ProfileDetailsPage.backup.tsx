'use client';

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Share2, 
  Download,
  Eye,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Users,
  BarChart3,
  Settings,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react';
import VerificationBadgesSection from './VerificationBadgesSection';
import ProfileCompletionCard from './ProfileCompletionCard';
import VerifiedSkillsSection from './VerifiedSkillsSection';
import VerifiedExperienceSection from './VerifiedExperienceSection';
import VerifiedCertificationsSection from './VerifiedCertificationsSection';
import VerifiedPortfolioSection from './VerifiedPortfolioSection';
import SocialProofSection from './SocialProofSection';
import TrustScoreAnalytics from './TrustScoreAnalytics';
import ProfileHeader from './ProfileHeader';
import { ProfileDetailsPage as ProfileDetailsPageType, VerificationType } from '@/types/verification';
import { UserProfile, ProfilePerformanceMetrics } from '@/types/multi-profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProfileDetailsPageProps {
  profileData: ProfileDetailsPageType;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
  onExport?: () => void;
}

export default function ProfileDetailsPage({ 
  profileData,
  isOwnProfile = true,
  onEdit,
  onShare,
  onExport
}: ProfileDetailsPageProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const handleVerificationClick = (type: VerificationType) => {
    console.log('Start verification for:', type);
    // Navigate to verification flow
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
    { id: 'social', label: 'Social Proof', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader
        personalInfo={profileData.personalInfo}
        verificationStatus={profileData.verificationStatus}
        isOwnProfile={isOwnProfile}
        onEdit={onEdit}
        onShare={onShare}
        onExport={onExport}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Navigation & Stats */}
          <div className="lg:col-span-3">
            {/* Section Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Profile Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Profile Completion */}
            <ProfileCompletionCard
              completionScore={profileData.completionScore}
              compact={true}
            />

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Profile Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Views</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Search Appearances</span>
                  <span className="font-medium">456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Connection Requests</span>
                  <span className="font-medium">89</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {/* Verification Badges Section - Always visible */}
            <VerificationBadgesSection
              verificationStatus={profileData.verificationStatus}
              onVerifyClick={handleVerificationClick}
            />

            {/* Dynamic Content Based on Active Section */}
            {activeSection === 'overview' && (
              <>
                {/* Trust Score Analytics */}
                <TrustScoreAnalytics
                  verificationStatus={profileData.verificationStatus}
                  onImprove={(area) => console.log('Improve:', area)}
                />

                {/* Key Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VerifiedSkillsSection
                    skillsData={profileData.skillsSection}
                    compact={true}
                    onAddSkill={() => console.log('Add skill')}
                  />
                  <VerifiedExperienceSection
                    experienceData={profileData.experienceSection}
                    compact={true}
                    onAddExperience={() => console.log('Add experience')}
                  />
                </div>
              </>
            )}

            {activeSection === 'skills' && (
              <VerifiedSkillsSection
                skillsData={profileData.skillsSection}
                onAddSkill={() => console.log('Add skill')}
                onVerifySkill={(skill) => console.log('Verify skill:', skill)}
              />
            )}

            {activeSection === 'experience' && (
              <VerifiedExperienceSection
                experienceData={profileData.experienceSection}
                onAddExperience={() => console.log('Add experience')}
                onVerifyExperience={(id) => console.log('Verify experience:', id)}
              />
            )}

            {activeSection === 'education' && (
              <VerifiedCertificationsSection
                certificationsData={profileData.certificationsSection}
                onAddCertification={() => console.log('Add certification')}
                onVerifyCertification={(id) => console.log('Verify certification:', id)}
              />
            )}

            {activeSection === 'portfolio' && (
              <VerifiedPortfolioSection
                portfolioData={profileData.portfolioSection}
                onAddItem={() => console.log('Add portfolio item')}
                onVerifyItem={(id) => console.log('Verify item:', id)}
              />
            )}

            {activeSection === 'social' && (
              <SocialProofSection
                socialData={profileData.socialProof}
                onRequestEndorsement={() => console.log('Request endorsement')}
                onRequestRecommendation={() => console.log('Request recommendation')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}