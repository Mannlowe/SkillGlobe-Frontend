'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import ProfileDetailsPage from '@/components/profile/ProfileDetailsPage';
import { 
  mockUser, 
  mockFullStackProfile, 
  mockVerificationStatus,
  mockPerformanceMetrics,
  mockProfileAnalytics
} from '@/lib/mockMultiProfileData';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const params = useParams();
  const { toast } = useToast();
  const { user } = useAuthStore();
  
  // In a real app, fetch profile data based on params.id
  const profileId = params.id as string;
  const isOwnProfile = profileId === 'me' || (user && profileId === user.email);
  
  // For demo purposes, determine which profile to show
  const [currentProfileId, setCurrentProfileId] = useState(
    profileId === 'me' ? mockUser.defaultProfile : 
    profileId === 'analyst' ? 'profile-analyst-1' : 
    'profile-fullstack-1'
  );
  
  const currentProfile = mockUser.profiles.find(p => p.id === currentProfileId) || mockFullStackProfile;
  const profileMetrics = mockPerformanceMetrics.get(currentProfileId);

  const handleEdit = () => {
    console.log('Edit profile');
    toast({
      title: 'Edit Mode',
      description: 'Profile editing functionality coming soon!',
    });
  };

  const handleShare = () => {
    console.log('Share profile');
    const profileUrl = `${window.location.origin}/profile/${profileId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'SkillGlobe Profile',
        text: `Check out ${mockUser.personalInfo.firstName} ${mockUser.personalInfo.lastName}'s profile on SkillGlobe`,
        url: profileUrl
      });
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: 'Link Copied!',
        description: 'Profile link has been copied to clipboard',
      });
    }
  };

  const handleExport = () => {
    console.log('Export profile');
    toast({
      title: 'Exporting Profile',
      description: 'Your profile PDF will be ready shortly',
    });
  };

  const handleSwitchProfile = (newProfileId: string) => {
    setCurrentProfileId(newProfileId);
    console.log('Switched to profile:', newProfileId);
  };

  return (
    <ModernLayoutWrapper>
      <ProfileDetailsPage
        userProfile={currentProfile}
        verificationStatus={mockVerificationStatus}
        performanceMetrics={profileMetrics}
        analytics={mockProfileAnalytics}
        isOwnProfile={isOwnProfile}
        onEdit={handleEdit}
        onShare={handleShare}
        onExport={handleExport}
        onSwitchProfile={handleSwitchProfile}
        allProfiles={mockUser.profiles}
      />
    </ModernLayoutWrapper>
  );
}