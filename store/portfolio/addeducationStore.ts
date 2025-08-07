import { create } from 'zustand';
import { addEducation, updateEducation, getAuthData, getEducationList, EducationData, UpdateEducationData, AddEducationResponse, UpdateEducationResponse, EducationListResponse } from '@/app/api/portfolio/addEducation';

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
  name?: string;
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
  isUpdating: boolean;
  updateSuccess: boolean;
  updateError: string | null;
  
  // Actions
  setEducationEntries: (entries: EducationEntry[]) => void;
  addEducationEntry: (entry: EducationEntry) => void;
  removeEducationEntry: (id: string) => void;
  updateEducationEntry: (id: string, data: Partial<EducationEntry>) => void;
  uploadEducation: (entry: EducationEntry) => Promise<AddEducationResponse | null>;
  updateEducationAPI: (entry: EducationEntry, entryName: string) => Promise<UpdateEducationResponse | null>;
  fetchEducationList: () => Promise<EducationEntry[]>;
  resetUploadState: () => void;
  resetUpdateState: () => void;
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
  isUpdating: false,
  updateSuccess: false,
  updateError: null,
  
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
      // Get auth data
      const authData = getAuthData();
      
      if (!authData) {
        throw new Error('Authentication data not available');
      }
      
      // Get education list from API
      const response = await getEducationList(authData.entityId, authData.apiKey, authData.apiSecret);
      
      // Check if response has data
      if (response?.message?.data?.education_list && Array.isArray(response.message.data.education_list)) {
        // Map API response to education entries
        const entries: EducationEntry[] = response.message.data.education_list.map(item => ({
          id: crypto.randomUUID(), // Generate a new ID for each entry
          educationLevel: item.education_level || '',
          yearOfCompletion: item.year_of_completion?.toString() || '',
          stream: item.stream || '',
          score: item.score?.toString() || '',
          university: item.university_board || '',
          certificateFile: null,
          certificateFileName: item.certificate || undefined,
          name: item.name || '' // Include the name field for update functionality
        }));
        
        // Update state
        set({ educationEntries: entries, isFetchingList: false });
        return entries;
      } else {
        // No education list found or empty list
        set({ educationEntries: [], isFetchingList: false });
        return [];
      }
    } catch (error: any) {
      console.error('Fetch education list error:', error.response?.data || error.message || error);
      set({
        isFetchingList: false,
        fetchListError: error.response?.data?.message || error.message || 'Failed to fetch education list'
      });
      return [];
    }
  },
  
  resetUploadState: () => {
    set({
      isUploading: false,
      uploadProgress: 0,
      uploadSuccess: false,
      uploadError: null
    });
  },
  
  updateEducationAPI: async (entry: EducationEntry, entryName: string) => {
    try {
      console.log('updateEducationAPI called with entry:', entry, 'and entryName:', entryName);
      
      // Validate name parameter
      if (!entryName || entryName.trim() === '') {
        throw new Error('Name parameter is required for update');
      }
      
      // Set updating state
      set({ isUpdating: true, updateSuccess: false, updateError: null });
      
      // Get auth data
      const authData = getAuthData();
      console.log('Auth data retrieved:', authData ? 'Available' : 'Not available');
      
      if (!authData) {
        throw new Error('Authentication data not available');
      }
      
      // Map entry to API format for update
      const updateData: UpdateEducationData = {
        entity_id: authData.entityId,
        name: entryName.trim(), // Ensure name is trimmed
        university_board: entry.university,
        education_level: entry.educationLevel,
        year_of_completion: entry.yearOfCompletion,
        stream: entry.stream,
        score: entry.score
      };
      
      console.log('Prepared update data:', updateData);
      
      // Update education data
      console.log('Calling updateEducation API function with data');
      const response = await updateEducation(updateData, authData.apiKey, authData.apiSecret);
      console.log('Update API response received:', response);
      
      // Update state
      set({ isUpdating: false, updateSuccess: true });
      
      // Refresh education list after update
      await get().fetchEducationList();
      
      return response;
    } catch (error: any) {
      console.error('Error in updateEducationAPI:', error);
      set({
        isUpdating: false,
        updateError: error.response?.data?.message || error.message || 'Failed to update education'
      });
      return null;
    }
  },
  
  resetUpdateState: () => {
    set({
      isUpdating: false,
      updateSuccess: false,
      updateError: null
    });
  }
}));
