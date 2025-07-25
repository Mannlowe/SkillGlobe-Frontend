'use client';

import { useState } from 'react';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import ProfileForm, { ProfileEntry } from '@/components/profile/ProfileForm';

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<ProfileEntry[]>([]);
  
  const handleProfileSave = (profileData: ProfileEntry[]) => {
    setProfiles(profileData);
    
    // Here you would typically save to backend
    console.log('Saving profiles:', profileData);
    
    // Show success message
    alert('Profile saved successfully!');
  };

  const handleCancel = () => {
    // Handle cancel action if needed
  };

  return (
    <ModernLayoutWrapper>
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Professional Profile</h1>
          <p className="text-gray-600 mb-6">
            Create your professional profile to showcase your skills, experience, and job preferences.
            This information will be used to match you with relevant job opportunities.
          </p>
          
          <ProfileForm 
            onSave={handleProfileSave}
            onCancel={handleCancel}
            initialData={profiles}
          />
        </div>
      </div>
    </ModernLayoutWrapper>
  );
}