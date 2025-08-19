'use client';

import { useState, useEffect } from 'react';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import StrategicProfileOptimizer from '@/components/dashboard/StrategicProfileOptimizer';
import ProfileAnalytics from '@/components/dashboard/ProfileAnalytics';
import ProfileForm, { ProfileEntry } from '@/components/profile/ProfileForm';
import { mockProfileOptimizationHub, mockProfileAnalytics } from '@/lib/mockPhase3Data';
import { useToast } from '@/hooks/use-toast';
// Import useModals but use it inside useEffect to prevent infinite loop
import { useModals } from '@/store/uiStore';
import { Plus, User, Settings, Eye, Share2, Pencil, Trash2, AlertCircle } from 'lucide-react';

export default function ProfilesPage() {
  const { toast } = useToast();
  // Temporarily disable modal functionality to fix the infinite loop
  // We'll implement a simple local state modal system instead
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Define a type for our modal content
  type ModalContentType = {
    component: React.ComponentType<any>;
    props: Record<string, any>;
  } | null;
  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const [activeProfile, setActiveProfile] = useState('default');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  const [profiles, setProfiles] = useState([
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
  ]);

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
    // Create a new profile entry directly
    setModalContent({
      component: ProfileForm,
      props: {
        onSave: handleProfileFormSave,
        onCancel: () => setIsModalOpen(false),
        initialData: [],
        showFormDirectly: true  // Add this flag to show form directly
      }
    });
    setIsModalOpen(true);
  };

  const handleProfileFormSave = (profileData: ProfileEntry[]) => {
    console.log('Profile data saved:', profileData);
    
    if (!profileData.length) return;
    
    const profileEntry = profileData[0];
    const existingProfileIndex = profiles.findIndex(p => p.id === profileEntry.id);
    
    if (existingProfileIndex >= 0) {
      // Update existing profile
      const updatedProfiles = [...profiles];
      updatedProfiles[existingProfileIndex] = {
        ...updatedProfiles[existingProfileIndex],
        name: profileEntry.role || updatedProfiles[existingProfileIndex].name,
        completeness: Math.min(updatedProfiles[existingProfileIndex].completeness + 5, 100) // Increase completeness slightly
      };
      
      setProfiles(updatedProfiles);
      
      // Show toast notification
      setTimeout(() => {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }, 100);
    } else {
      // Create a new profile based on the form data
      const newProfile = {
        id: profileEntry.id || `profile-${Date.now()}`,
        name: profileEntry.role || 'New Profile',
        type: 'Specialized',
        completeness: 60,
        views: 0,
        isActive: false
      };

      // Add the new profile to the list using a callback to avoid stale state
      setProfiles(prevProfiles => [...prevProfiles, newProfile]);
      
      // Show toast notification
      setTimeout(() => {
        toast({
          title: "Profile Created",
          description: "Your new profile has been created successfully.",
        });
      }, 100);
    }
    
    // Close the modal
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleProfileSelect = (profileId: string) => {
    setActiveProfile(profileId);
    const profile = profiles.find(p => p.id === profileId);
    toast({
      title: "Profile Switched",
      description: `Switched to ${profile?.name} profile.`,
    });
  };
  
  const handleEditProfile = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation(); // Prevent profile selection
    const profileToEdit = profiles.find(p => p.id === profileId);
    
    if (profileToEdit) {
      // Create a ProfileEntry object from the profile data
      const profileEntry: ProfileEntry = {
        id: profileToEdit.id,
        role: profileToEdit.name,
        employmentType: 'Permanent', // Default values since we don't store these in the profile object
        natureOfWork: 'Full-time',
        workMode: 'No Preference',
        minimumEarnings: '',
        currency: '',
        preferredCity: '',
        preferredCountry: '',
        totalExperience: '',
        relevantExperience: '',
        resume: null
      };
      
      // Directly show the form with the profile data
      setModalContent({
        component: ProfileForm,
        props: {
          onSave: handleProfileFormSave,
          onCancel: () => setIsModalOpen(false),
          initialData: [profileEntry],
          showFormDirectly: true,
          isEditing: true
        }
      });
      setIsModalOpen(true);
    }
  };
  
  const handleDeleteClick = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation(); // Prevent profile selection
    setProfileToDelete(profileId);
    setDeleteModalOpen(true);
  };
  
  const confirmDeleteProfile = () => {
    if (profileToDelete) {
      setProfiles(profiles.filter(p => p.id !== profileToDelete));
      
      // If the deleted profile was active, set another one as active
      if (profileToDelete === activeProfile && profiles.length > 1) {
        const newActiveProfile = profiles.find(p => p.id !== profileToDelete)?.id || '';
        setActiveProfile(newActiveProfile);
      }
      
      toast({
        title: "Profile Deleted",
        description: "The profile has been deleted successfully.",
      });
      
      setDeleteModalOpen(false);
      setProfileToDelete(null);
    }
  };

  // Render the modal if it's open and has content
  const renderModal = () => {
    if (isModalOpen && modalContent) {
      const ModalComponent = modalContent.component;
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ModalComponent {...modalContent.props} />
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Render delete confirmation modal
  const renderDeleteModal = () => {
    if (!deleteModalOpen) return null;
    
    const profileName = profiles.find(p => p.id === profileToDelete)?.name || 'this profile';
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Delete Profile</h3>
            <p className="text-gray-600">
              Are you sure you want to delete <span className="font-medium">{profileName}</span>? This action cannot be undone.
            </p>
            <div className="flex space-x-3 w-full pt-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProfile}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ModernLayoutWrapper>
      {renderModal()}
      {renderDeleteModal()}
      <div className="space-y-8 font-rubik">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Professional Profiles</h1>
            <p className="text-gray-600 mt-2">Manage multiple professional profiles for different career paths</p>
          </div>
          
          <button 
            onClick={handleCreateProfile}
            className=" flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            Add Profile
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
                    {/* <p className="text-sm text-gray-600">{profile.type}</p> */}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {profile.isActive && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mr-2">
                      Active
                    </span>
                  )}
                  <button 
                    onClick={(e) => handleEditProfile(e, profile.id)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteClick(e, profile.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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

                {/* <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
                </div> */}
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