import { create } from 'zustand';
import { 
  getProfileAndPortfolio, 
  type GetProfileAndPortfolioRequest,
  type ProfileAndPortfolioData 
} from '@/app/api/Resume Template/resumetemplatelist';
import { getAuthData } from '@/utils/auth';

interface ResumeTemplateState {
  // Profile preview data
  profilePreviewData: ProfileAndPortfolioData | null;
  isLoadingPreview: boolean;
  previewError: string | null;
  
  // Actions
  fetchProfilePreview: (profileName?: string) => Promise<void>;
  clearPreviewData: () => void;
  clearPreviewError: () => void;
}

export const useResumeTemplateStore = create<ResumeTemplateState>((set, get) => ({
  // Initial state
  profilePreviewData: null,
  isLoadingPreview: false,
  previewError: null,

  // Fetch profile preview data
  fetchProfilePreview: async (profileName?: string) => {
    set({ isLoadingPreview: true, previewError: null });
    
    try {
      // Get authentication data
      const authData = getAuthData();
      
      if (!authData || !authData.entityId) {
        throw new Error('Authentication data not found');
      }

      const request: GetProfileAndPortfolioRequest = {
        entity_id: authData.entityId,
        name: profileName || ''
      };

      const response = await getProfileAndPortfolio(request);
      
      set({
        profilePreviewData: response.message.data,
        isLoadingPreview: false,
        previewError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile preview data';
      
      set({
        profilePreviewData: null,
        isLoadingPreview: false,
        previewError: errorMessage,
      });
      
      throw error;
    }
  },

  // Clear preview data
  clearPreviewData: () => {
    set({
      profilePreviewData: null,
      previewError: null,
    });
  },

  // Clear preview error
  clearPreviewError: () => {
    set({ previewError: null });
  },
}));