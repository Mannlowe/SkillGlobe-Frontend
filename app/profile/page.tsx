'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfileForm, { ProfileEntry } from '@/components/profile/ProfileForm';

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 font-rubik">
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
        </main>
      </div>
    </div>
  );
}