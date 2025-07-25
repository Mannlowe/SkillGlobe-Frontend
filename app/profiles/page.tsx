'use client';

import { useState } from 'react';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import StrategicProfileOptimizer from '@/components/dashboard/StrategicProfileOptimizer';
import ProfileAnalytics from '@/components/dashboard/ProfileAnalytics';
import { mockProfileOptimizationHub, mockProfileAnalytics } from '@/lib/mockPhase3Data';
import { useToast } from '@/hooks/use-toast';
import { Plus, User, Settings, Eye, Share2 } from 'lucide-react';

export default function ProfilesPage() {
  const { toast } = useToast();
  const [activeProfile, setActiveProfile] = useState('default');

  const profiles = [
    {
      id: 'default',
      name: 'Main Profile',
      type: 'General',
      completeness: 85,
      views: 1247,
      isActive: true
    },
    {
      id: 'frontend',
      name: 'Frontend Developer',
      type: 'Specialized',
      completeness: 92,
      views: 823,
      isActive: false
    },
    {
      id: 'fullstack',
      name: 'Full Stack Engineer',
      type: 'Specialized',
      completeness: 78,
      views: 654,
      isActive: false
    }
  ];

  const handleTaskComplete = (taskId: string) => {
    console.log('Task completed:', taskId);
    toast({
      title: "Task Completed!",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleSkillAdd = (skill: string) => {
    console.log('Add skill:', skill);
    toast({
      title: "Skill Added!",
      description: `${skill} has been added to your profile.`,
    });
  };

  const handleCreateProfile = () => {
    console.log('Create new profile');
    toast({
      title: "Create Profile",
      description: "Profile creation wizard will open soon.",
    });
  };

  const handleProfileSelect = (profileId: string) => {
    setActiveProfile(profileId);
    const profile = profiles.find(p => p.id === profileId);
    toast({
      title: "Profile Switched",
      description: `Switched to ${profile?.name} profile.`,
    });
  };

  return (
    <ModernLayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Professional Profiles</h1>
            <p className="text-gray-600 mt-2">Manage multiple professional profiles for different career paths</p>
          </div>
          
          <button 
            onClick={handleCreateProfile}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Create Profile
          </button>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => handleProfileSelect(profile.id)}
              className={`bg-white rounded-xl shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${
                activeProfile === profile.id ? 'border-orange-500 ring-2 ring-orange-100' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    activeProfile === profile.id ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    <User className={`w-6 h-6 ${
                      activeProfile === profile.id ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                    <p className="text-sm text-gray-600">{profile.type}</p>
                  </div>
                </div>
                {profile.isActive && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completeness</span>
                    <span className="font-medium">{profile.completeness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${profile.completeness}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{profile.views} views</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Profile Management */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Optimize: {profiles.find(p => p.id === activeProfile)?.name}
          </h2>

          {/* Strategic Profile Optimizer */}
          <StrategicProfileOptimizer
            profileData={mockProfileOptimizationHub}
            completionTasks={mockProfileOptimizationHub.strategic_completion.completion_priorities}
            onTaskComplete={handleTaskComplete}
            onSkillAdd={handleSkillAdd}
            marketImpactMode={true}
          />
          
          {/* Profile Analytics */}
          <ProfileAnalytics
            analytics={mockProfileAnalytics}
            onViewDetails={(section) => console.log('View details:', section)}
          />
        </div>
      </div>
    </ModernLayoutWrapper>
  );
}