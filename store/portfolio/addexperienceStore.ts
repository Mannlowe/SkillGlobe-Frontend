import { create } from 'zustand';
import { addExperience, getAuthData, ExperienceData, AddExperienceResponse } from '@/app/api/portfolio/addExperience';

// Interface for experience entry
export interface ExperienceEntry {
  id: string;
  employmentStatus: string;
  space: string;
  role: string;
  organization: string;
  website: string;
  relevantExperience: string;
  professionalSummary: string;
}

// Interface for experience store state
interface ExperienceState {
  // State
  isUploading: boolean;
  uploadProgress: number;
  uploadSuccess: boolean;
  uploadError: string | null;
  experienceEntries: ExperienceEntry[];
  
  // Actions
  setExperienceEntries: (entries: ExperienceEntry[]) => void;
  addExperienceEntry: (entry: ExperienceEntry) => void;
  removeExperienceEntry: (id: string) => void;
  updateExperienceEntry: (id: string, data: Partial<ExperienceEntry>) => void;
  uploadExperience: (entry: ExperienceEntry) => Promise<AddExperienceResponse | null>;
  resetUploadState: () => void;
}

// Create Zustand store
export const useExperienceStore = create<ExperienceState>((set, get) => ({
  // Initial state
  isUploading: false,
  uploadProgress: 0,
  uploadSuccess: false,
  uploadError: null,
  experienceEntries: [],
  
  // Actions
  setExperienceEntries: (entries) => set({ experienceEntries: entries }),
  
  addExperienceEntry: (entry) => {
    set((state) => ({
      experienceEntries: [...state.experienceEntries, entry]
    }));
  },
  
  removeExperienceEntry: (id) => {
    set((state) => ({
      experienceEntries: state.experienceEntries.filter(entry => entry.id !== id)
    }));
  },
  
  updateExperienceEntry: (id, data) => {
    set((state) => ({
      experienceEntries: state.experienceEntries.map(entry => 
        entry.id === id ? { ...entry, ...data } : entry
      )
    }));
  },
  
  uploadExperience: async (entry) => {
    // Reset state
    set({ 
      isUploading: true, 
      uploadProgress: 0,
      uploadSuccess: false,
      uploadError: null 
    });
    
    try {
      // Get auth data
      const authData = getAuthData();
      
      if (!authData) {
        throw new Error('Authentication data not available');
      }
      
      // Map ExperienceEntry to ExperienceData
      const experienceData: ExperienceData = {
        entity_id: authData.entityId,
        space: entry.space,
        designation: entry.role,
        company: entry.organization,
        relevant_experience: parseFloat(entry.relevantExperience) || 0
      };
      
      // Upload experience data
      const response = await addExperience(
        experienceData,
        authData.apiKey,
        authData.apiSecret
      );
      
      // Update state on success
      set({ 
        isUploading: false, 
        uploadProgress: 100,
        uploadSuccess: true 
      });
      
      return response;
    } catch (error: any) {
      // Update state on error
      set({ 
        isUploading: false, 
        uploadError: error.message || 'Failed to upload work experience details' 
      });
      
      return null;
    }
  },
  
  resetUploadState: () => set({ 
    isUploading: false,
    uploadProgress: 0,
    uploadSuccess: false,
    uploadError: null
  })
}));