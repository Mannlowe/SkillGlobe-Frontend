import { create } from 'zustand';
import { 
  addSkills, 
  deleteSkill, 
  getAuthData, 
  getSkillsList, 
  AddSkillsRequest, 
  DeleteSkillRequest, 
  SkillData, 
  SkillListResponse 
} from '@/app/api/Individual Skills/addSkills';

// Interface for skill entry in the UI
export interface SkillEntry {
  id: string;
  name: string;
  category: string;
}

interface AddSkillsState {
  // State for adding skills
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  
  // State for fetching skills
  skillsList: SkillEntry[];
  isFetchingList: boolean;
  fetchListError: string | null;
  
  // State for deleting skills
  isDeleting: boolean;
  deleteError: string | null;
  deleteSuccess: boolean;
  
  // Actions
  addSkills: (skills: SkillData[]) => Promise<boolean>;
  fetchSkillsList: () => Promise<SkillEntry[]>;
  deleteSkill: (skillId: string) => Promise<boolean>;
  resetState: () => void;
}

export const useAddSkillsStore = create<AddSkillsState>((set, get) => ({
  // Initial state for adding skills
  isSubmitting: false,
  submitError: null,
  submitSuccess: false,
  
  // Initial state for fetching skills
  skillsList: [],
  isFetchingList: false,
  fetchListError: null,
  
  // Initial state for deleting skills
  isDeleting: false,
  deleteError: null,
  deleteSuccess: false,
  
  addSkills: async (skills: SkillData[]) => {
    set({ isSubmitting: true, submitError: null, submitSuccess: false });
    
    try {
      // Get auth data
      const authData = getAuthData();
      if (!authData) {
        set({ isSubmitting: false, submitError: 'Authentication data not found' });
        return false;
      }
      
      // Prepare data for API
      const skillsData: AddSkillsRequest = {
        entity_id: authData.entityId,
        skills: skills
      };
      
      // Call API
      await addSkills(skillsData, authData.apiKey, authData.apiSecret);
      
      // Update state on success
      set({ 
        isSubmitting: false,
        submitSuccess: true
      });
      
      return true;
    } catch (error: any) {
      console.error('Error adding skills:', error);
      set({ 
        isSubmitting: false, 
        submitError: error.message || 'Failed to add skills'
      });
      return false;
    }
  },
  
  fetchSkillsList: async () => {
    set({ isFetchingList: true, fetchListError: null });
    
    try {
      const authData = getAuthData();
      
      if (!authData) {
        throw new Error('Authentication data not available');
      }
      
      const response = await getSkillsList(
        authData.entityId,
        authData.apiKey,
        authData.apiSecret
      );
      
      if (!response || !response.message || response.exception) {
        throw new Error(response.exception || 'Invalid API response format');
      }
      
      const skillsList = response.message.data?.skills_list || [];
      console.log('Skills list from API:', skillsList);
      
      // Map skills and deduplicate by name and category (case-insensitive)
      const uniqueSkillsMap = new Map();
      
      skillsList.forEach(item => {
        const skillName = item.skills || '';
        const skillCategory = item.type_of_skills || 'Technical';
        
        // Create a unique key based on lowercase name and category
        const key = `${skillName.toLowerCase()}-${skillCategory.toLowerCase()}`;
        
        // Only add if this combination doesn't exist yet
        if (!uniqueSkillsMap.has(key) && skillName) {
          uniqueSkillsMap.set(key, {
            id: item.name || crypto.randomUUID(),
            name: skillName,
            category: skillCategory
          });
        }
      });
      
      // Convert map to array
      const entries = Array.from(uniqueSkillsMap.values());
      
      console.log('Mapped and deduplicated skill entries:', entries);
      set({ skillsList: entries, isFetchingList: false });
      
      return entries;
    } catch (error: any) {
      let errorMessage = 'Failed to fetch skills list';
      
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
  
  deleteSkill: async (skillId: string) => {
    set({ isDeleting: true, deleteError: null, deleteSuccess: false });
    
    try {
      // Get auth data
      const authData = getAuthData();
      if (!authData) {
        set({ isDeleting: false, deleteError: 'Authentication data not found' });
        return false;
      }
      
      // Find the skill in the list
      const skillsList = get().skillsList;
      const skillToDelete = skillsList.find(skill => skill.id === skillId);
      
      if (!skillToDelete) {
        set({ isDeleting: false, deleteError: 'Skill not found' });
        return false;
      }
      
      // Prepare data for API
      const deleteData: DeleteSkillRequest = {
        entity_id: authData.entityId,
        name: skillToDelete.id // Using the id field which contains the 'name' value from API
      };
      
      // Call API
      await deleteSkill(deleteData, authData.apiKey, authData.apiSecret);
      
      // Update local state by removing the deleted skill
      set({
        skillsList: skillsList.filter(skill => skill.id !== skillId),
        isDeleting: false,
        deleteSuccess: true
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting skill:', error);
      set({ 
        isDeleting: false, 
        deleteError: error.message || 'Failed to delete skill'
      });
      return false;
    }
  },
  
  resetState: () => {
    set({
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
      isFetchingList: false,
      fetchListError: null,
      isDeleting: false,
      deleteError: null,
      deleteSuccess: false
    });
  }
}));
