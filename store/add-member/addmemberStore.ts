import { create } from 'zustand';
import { addMember, getAuthData, AddMemberData, AddMemberResponse } from '@/app/api/Add Member/addMember';

interface AddMemberState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  addMemberToTeam: (memberData: Omit<AddMemberData, 'entity_id'>) => Promise<void>;
  resetState: () => void;
}

export const useAddMemberStore = create<AddMemberState>((set, get) => ({
  isLoading: false,
  error: null,
  success: false,

  addMemberToTeam: async (memberData: Omit<AddMemberData, 'entity_id'>) => {
    set({ isLoading: true, error: null, success: false });

    try {
      // Get authentication data
      const authData = getAuthData();
      
      if (!authData) {
        throw new Error('Authentication data not found. Please login again.');
      }

      // Prepare the complete member data with entity_id
      const completeData: AddMemberData = {
        ...memberData,
        entity_id: authData.entityId
      };

      console.log('Adding member with data:', completeData);

      // Call the API
      const response = await addMember(completeData, authData.apiKey, authData.apiSecret);

      if (response.message.status === 'success') {
        set({ isLoading: false, success: true, error: null });
        console.log('Member added successfully:', response);
      } else {
        throw new Error(response.message.message || 'Failed to add member');
      }
    } catch (error: any) {
      console.error('Error adding member:', error);
      const errorMessage = error.response?.data?.message?.message || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to add member';
      set({ isLoading: false, error: errorMessage, success: false });
    }
  },

  resetState: () => {
    set({ isLoading: false, error: null, success: false });
  }
}));