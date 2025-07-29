import { create } from 'zustand';
import { addEducation, getAuthData, EducationData, AddEducationResponse } from '@/app/api/portfolio/addEducation';

// Interface for education entry
export interface EducationEntry {
  id: string;
  educationLevel: string;
  yearOfCompletion: string;
  stream: string;
  score: string;
  university: string;
  certificateFile: File | null;
  certificateFileName?: string;
}

// Interface for education store state
interface EducationState {
  // State
  isUploading: boolean;
  uploadProgress: number;
  uploadSuccess: boolean;
  uploadError: string | null;
  educationEntries: EducationEntry[];
  
  // Actions
  setEducationEntries: (entries: EducationEntry[]) => void;
  addEducationEntry: (entry: EducationEntry) => void;
  removeEducationEntry: (id: string) => void;
  updateEducationEntry: (id: string, data: Partial<EducationEntry>) => void;
  uploadEducation: (entry: EducationEntry) => Promise<AddEducationResponse | null>;
  resetUploadState: () => void;
}

// Create Zustand store
export const useEducationStore = create<EducationState>((set, get) => ({
  // Initial state
  isUploading: false,
  uploadProgress: 0,
  uploadSuccess: false,
  uploadError: null,
  educationEntries: [],
  
  // Actions
  setEducationEntries: (entries) => set({ educationEntries: entries }),
  
  addEducationEntry: (entry) => {
    set((state) => ({
      educationEntries: [...state.educationEntries, entry]
    }));
  },
  
  removeEducationEntry: (id) => {
    set((state) => ({
      educationEntries: state.educationEntries.filter(entry => entry.id !== id)
    }));
  },
  
  updateEducationEntry: (id, data) => {
    set((state) => ({
      educationEntries: state.educationEntries.map(entry => 
        entry.id === id ? { ...entry, ...data } : entry
      )
    }));
  },
  
  uploadEducation: async (entry) => {
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
      
      // Map EducationEntry to EducationData
      const educationData: EducationData = {
        entity_id: authData.entityId,
        education_level: entry.educationLevel,
        year_of_completion: entry.yearOfCompletion,
        stream: entry.stream,
        score: entry.score,
        university_board: entry.university,
        certificate: entry.certificateFile || undefined
      };
      
      // Upload education data
      const response = await addEducation(
        educationData,
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
        uploadError: error.message || 'Failed to upload education details' 
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
