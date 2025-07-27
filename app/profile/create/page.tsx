'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import ProfileCreationWizard from '@/components/profile/ProfileCreationWizard';
import { ProfileCreationData } from '@/types/multi-profile';
import { useToast } from '@/hooks/use-toast';

export default function CreateProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleComplete = (profileData: ProfileCreationData) => {
    console.log('Profile created:', profileData);
    
    // In a real app, this would save to backend
    toast({
      title: 'Profile Created Successfully!',
      description: `Your ${profileData.name} profile has been created. You can now add more details and start applying to jobs.`,
    });
    
    // Navigate to the new profile (in real app, use actual profile ID)
    router.push('/profile/me');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ModernLayoutWrapper>
      <ProfileCreationWizard
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </ModernLayoutWrapper>
  );
}