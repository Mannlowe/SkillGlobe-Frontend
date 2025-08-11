import { create } from 'zustand';
import { getJobPostingList, JobPosting, JobPostingListResponse } from '../../app/api/job postings/jobpostingList';

interface JobPostingListState {
  jobPostings: JobPosting[];
  entityId: string;
  isLoading: boolean;
  error: string | null;
  getJobPostings: (entityId: string) => Promise<{ success: boolean }>;
  resetState: () => void;
}

export const useJobPostingListStore = create<JobPostingListState>((set) => ({
  jobPostings: [],
  entityId: '',
  isLoading: false,
  error: null,
  
  getJobPostings: async (entityId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getJobPostingList(entityId);
      
      console.log('Job posting list store response:', response);
      
      // Check if the response indicates success
      if (response.message && response.message.status === 'success') {
        set({
          isLoading: false,
          error: null,
          jobPostings: response.message.data.opportunity_posting || [],
          entityId: response.message.data.entity_id
        });
        return { success: true };
      } else {
        const errorMsg = response.message?.message || 'Failed to get job postings';
        set({ isLoading: false, error: errorMsg, jobPostings: [] });
        return { success: false };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.message || error.message || 'Failed to get job postings';
      set({ isLoading: false, error: errorMessage, jobPostings: [] });
      return { success: false };
    }
  },
  
  resetState: () => set({
    jobPostings: [],
    entityId: '',
    isLoading: false,
    error: null
  })
}));
