import { create } from 'zustand';
import { getOrganizationInsights, getAuthData, OrganizationInsightsResponse } from '@/app/api/Dashboard/businessDashboard';

// Interface for organization insights data
export interface OrganizationInsights {
  total_postings: number;
  active_postings: number;
  shortlisted: number;
  total_postings_change?: string;
  active_postings_change?: string;
  shortlisted_change?: string;
}

// Interface for business dashboard store state
interface BusinessDashboardState {
  // Organization insights data
  insights: OrganizationInsights | null;
  isLoadingInsights: boolean;
  insightsError: string | null;
  
  // Actions
  fetchOrganizationInsights: () => Promise<void>;
  clearInsightsError: () => void;
  resetInsights: () => void;
}

export const useBusinessDashboardStore = create<BusinessDashboardState>((set, get) => ({
  // Initial state
  insights: null,
  isLoadingInsights: false,
  insightsError: null,

  // Fetch organization insights
  fetchOrganizationInsights: async () => {
    set({ isLoadingInsights: true, insightsError: null });
    
    try {
      const authData = getAuthData();
      
      if (!authData) {
        throw new Error('Authentication data not found. Please log in again.');
      }

      const { entityId, apiKey, apiSecret } = authData;
      
      if (!entityId) {
        throw new Error('Entity ID not found. Please ensure you are logged in properly.');
      }

      console.log('Fetching organization insights for entity:', entityId);
      
      const response: OrganizationInsightsResponse = await getOrganizationInsights(
        entityId,
        apiKey,
        apiSecret
      );

      if (response.message.status === 'success') {
        set({
          insights: response.message.data,
          isLoadingInsights: false,
          insightsError: null
        });
        
        console.log('Organization insights fetched successfully:', response.message.data);
      } else {
        throw new Error(response.message.message || 'Failed to fetch organization insights');
      }
    } catch (error: any) {
      console.error('Error fetching organization insights:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch organization insights. Please try again.';
      
      set({
        insights: null,
        isLoadingInsights: false,
        insightsError: errorMessage
      });
    }
  },

  // Clear insights error
  clearInsightsError: () => {
    set({ insightsError: null });
  },

  // Reset insights data
  resetInsights: () => {
    set({
      insights: null,
      isLoadingInsights: false,
      insightsError: null
    });
  }
}));