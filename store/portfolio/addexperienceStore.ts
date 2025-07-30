import { create } from 'zustand';
import { addExperience, getAuthData, ExperienceData, AddExperienceResponse, getExperienceList } from '@/app/api/portfolio/addExperience';

// Interface for experience entry
export interface ExperienceEntry {
  id: string;
  employmentStatus: string;
  space: string;
  role: string;
  organization: string;
  relevantExperience: string;
}

// Interface for experience store state
interface ExperienceState {
  // State
  isUploading: boolean;
  uploadProgress: number;
  uploadSuccess: boolean;
  uploadError: string | null;
  isFetchingList: boolean;
  fetchListError: string | null;
  experienceEntries: ExperienceEntry[];
  
  // Actions
  setExperienceEntries: (entries: ExperienceEntry[]) => void;
  addExperienceEntry: (entry: ExperienceEntry) => void;
  removeExperienceEntry: (id: string) => void;
  updateExperienceEntry: (id: string, data: Partial<ExperienceEntry>) => void;
  uploadExperience: (entry: ExperienceEntry) => Promise<AddExperienceResponse | null>;
  fetchExperienceList: () => Promise<ExperienceEntry[]>;
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
  isFetchingList: false,
  fetchListError: null,
  
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

   fetchExperienceList: async () => {
      set({ isFetchingList: true, fetchListError: null });
      
      try {
        const authData = getAuthData();
        
        if (!authData) {
          throw new Error('Authentication data not available');
        }
        
        const response = await getExperienceList(
          authData.entityId,
          authData.apiKey,
          authData.apiSecret
        );
        
        if (!response || !response.message || response.exception) {
          throw new Error(response.exception || 'Invalid API response format');
        }
        
        const experienceList = response.message.data?.experience_list || [];
        console.log('Experience list from API:', experienceList);
        
        const entries = experienceList.map((item: any) => ({
          id: item.name || crypto.randomUUID(),
          employmentStatus: item.employment_status || '',
          space: item.space || '',
          role: item.role || '',
          organization: item.organization || '',
          relevantExperience: item.relevant_experience?.toString() || '',
        }));
        
        console.log('Mapped experience entries:', entries);
        set({ experienceEntries: entries, isFetchingList: false });
        
        // Save to localStorage for offline access
        if (typeof window !== 'undefined') {
          localStorage.setItem('experienceEntries', JSON.stringify(entries));
        }
        
        return entries;
      } catch (error: any) {
        let errorMessage = 'Failed to fetch education list';
        
        if (error.response?.data) {
          if (error.response.data.exception) {
            errorMessage = `API Error: ${error.response.data.exception.split(':').pop()?.trim() || 'Unknown error'}`;
          } else if (error.response.data.message) {
            errorMessage = `API Error: ${error.response.data.message}`;
          } else if (error.response.data._server_messages) {
            try {
              const serverMessages = JSON.parse(error.response.data._server_messages);
              errorMessage = `API Error: ${serverMessages[0].message || 'Unknown error'}`;
            } catch (e) {
              // If parsing fails, use the original error message
            }
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        set({ isFetchingList: false, fetchListError: errorMessage });
        throw error;
      }
    },
  
  resetUploadState: () => set({ 
    isUploading: false,
    uploadProgress: 0,
    uploadSuccess: false,
    uploadError: null
  })
}));