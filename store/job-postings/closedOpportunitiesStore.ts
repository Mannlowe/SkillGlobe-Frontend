import { create } from 'zustand';
import { closeOpportunity, getClosedOpportunities, ClosedOpportunity, getAuthData } from '@/app/api/job postings/addjobPosting';

interface ClosedOpportunitiesState {
  closedOpportunities: ClosedOpportunity[];
  isLoading: boolean;
  isClosing: boolean;
  error: string | null;
  
  // Actions
  fetchClosedOpportunities: (entityId: string) => Promise<void>;
  closeJobOpportunity: (opportunityName: string) => Promise<boolean>;
  clearError: () => void;
}

export const useClosedOpportunitiesStore = create<ClosedOpportunitiesState>((set, get) => ({
  closedOpportunities: [],
  isLoading: false,
  isClosing: false,
  error: null,

  fetchClosedOpportunities: async (entityId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const authData = getAuthData();
      if (!authData) {
        throw new Error('Authentication data not found');
      }

      const closedOpportunities = await getClosedOpportunities(
        entityId,
        authData.apiKey,
        authData.apiSecret
      );

      set({ 
        closedOpportunities,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error fetching closed opportunities:', error);
      set({ 
        error: error.message || 'Failed to fetch closed opportunities',
        isLoading: false
      });
    }
  },

  closeJobOpportunity: async (opportunityName: string) => {
    set({ isClosing: true, error: null });
    
    try {
      const authData = getAuthData();
      if (!authData) {
        throw new Error('Authentication data not found');
      }

      const response = await closeOpportunity(
        authData.entityId,
        opportunityName,
        authData.apiKey,
        authData.apiSecret
      );

      if (response.message.status === 'success') {
        // Refresh closed opportunities list after successful close
        await get().fetchClosedOpportunities(authData.entityId);
        set({ isClosing: false });
        return true;
      } else {
        throw new Error(response.message.message || 'Failed to close opportunity');
      }
    } catch (error: any) {
      console.error('Error closing opportunity:', error);
      set({ 
        error: error.message || 'Failed to close opportunity',
        isClosing: false
      });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));
