import { create } from 'zustand';
import { addEducation, getAuthData, getEducationList, EducationData, AddEducationResponse, EducationListResponse } from '@/app/api/portfolio/addEducation';

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
  isFetchingList: boolean;
  fetchListError: string | null;
  
  // Actions
  setEducationEntries: (entries: EducationEntry[]) => void;
  addEducationEntry: (entry: EducationEntry) => void;
  removeEducationEntry: (id: string) => void;
  updateEducationEntry: (id: string, data: Partial<EducationEntry>) => void;
  uploadEducation: (entry: EducationEntry) => Promise<AddEducationResponse | null>;
  fetchEducationList: () => Promise<EducationEntry[]>;
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
  isFetchingList: false,
  fetchListError: null,
  
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
    set({ isUploading: true, uploadProgress: 0, uploadError: null, uploadSuccess: false });
    
    try {
      // Get auth data
      const authData = getAuthData();
      
      if (!authData) {
        throw new Error('Authentication data not available');
      }
      
      // Map entry to API format
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
      const response = await addEducation(educationData, authData.apiKey, authData.apiSecret);
      
      // Update state
      set({ isUploading: false, uploadSuccess: true });
      
      // Save updated entries to localStorage to ensure they persist
      if (typeof window !== 'undefined') {
        const currentEntries = get().educationEntries;
        localStorage.setItem('educationEntries', JSON.stringify(currentEntries));
      }
      
      return response;
    } catch (error: any) {
      // Update state on error
      set({ 
        isUploading: false, 
        uploadError: error.message || 'Failed to upload education data' 
      });
      
      return null;
    }
  },
  
  fetchEducationList: async () => {
    set({ isFetchingList: true, fetchListError: null });
    
    try {
      const authData = getAuthData();
      
      if (!authData) {
        throw new Error('Authentication data not available');
      }
      
      const response = await getEducationList(
        authData.entityId,
        authData.apiKey,
        authData.apiSecret
      );
      
      if (!response || !response.message || response.exception) {
        throw new Error(response.exception || 'Invalid API response format');
      }
      
      const educationList = response.message.data?.education_list || [];
      console.log('Education list from API:', educationList);
      
      const entries = educationList.map(item => ({
        id: item.name || crypto.randomUUID(),
        educationLevel: item.education_level || '',
        yearOfCompletion: item.year_of_completion?.toString() || '',
        stream: item.stream || '',
        score: item.score?.toString() || '',
        university: item.university_board || '',
        certificateFile: null, // Can't convert remote file reference to File object
        certificateFileName: item.certificate ? 'Certificate file' : undefined
      }));
      
      console.log('Mapped education entries:', entries);
      set({ educationEntries: entries, isFetchingList: false });
      
      // Save to localStorage for offline access
      if (typeof window !== 'undefined') {
        localStorage.setItem('educationEntries', JSON.stringify(entries));
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
