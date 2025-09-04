import { create } from 'zustand';
import { getProfileInsights, getOpportunityMatches, getAuthData, ProfileInsightsResponse, OpportunityMatchesResponse, OpportunityMatch } from '@/app/api/Dashboard/individualDashboard';
import type { JobOpportunity } from '@/types/dashboard';

// Utility function to convert API opportunity match to JobOpportunity format
const mapOpportunityMatchToJobOpportunity = (match: OpportunityMatch): JobOpportunity => {
  return {
    id: match.opportunity_posting,
    title: match.opportunity_title,
    company: match.business_name || 'Company Name Not Available',
    match_score: match.match_score,
    salary_range: [match.min_remuneration, match.min_remuneration * 1.3] as [number, number], // Estimate range
    location: match.location || 'Location Not Specified',
    remote_option: match.work_mode === 'WFH' || match.work_mode === 'Hybrid',
    application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    
    // AI Analysis - using defaults since not provided by API
    match_reasons: [`${match.match_score}% skill match`, `${match.role_skill_category} expertise`],
    skill_gaps: [], // Would need additional API call to get this
    growth_potential: match.match_score >= 85 ? 'High' : match.match_score >= 70 ? 'Medium' : 'Low',
    culture_fit_score: Math.min(match.match_score + 10, 100), // Estimate based on match score
    
    // Application Intelligence - using defaults
    estimated_response_time: '2-3 days',
    application_competition: match.match_score >= 90 ? 'High' : match.match_score >= 75 ? 'Medium' : 'Low',
    hiring_urgency: 'Normal' as const,
    recruiter_activity: 'Recently posted',
    buyer_interested: match.buyer_interested === 1,
  };
};

// Interface for profile insights data
export interface ProfileInsightsData {
  total_matches: number;
  great_matches: number;
  interest_shown: number;
  current_week_matches: number;
}

// Interface for the store state
interface IndividualDashboardState {
  // Profile insights data
  profileInsights: ProfileInsightsData | null;
  isLoading: boolean;
  error: string | null;
  
  // Opportunity matches data
  opportunityMatches: OpportunityMatch[] | null;
  opportunities: JobOpportunity[] | null; // Transformed data for UI
  isLoadingOpportunities: boolean;
  opportunityError: string | null;
  totalOpportunities: number;
  totalPages: number;
  
  // Actions
  fetchProfileInsights: () => Promise<void>;
  fetchOpportunityMatches: () => Promise<void>;
  clearError: () => void;
  clearOpportunityError: () => void;
  resetStore: () => void;
}

// Initial state
const initialState = {
  profileInsights: null,
  isLoading: false,
  error: null,
  opportunityMatches: null,
  opportunities: null,
  isLoadingOpportunities: false,
  opportunityError: null,
  totalOpportunities: 0,
  totalPages: 0,
};

// Create the store
export const useIndividualDashboardStore = create<IndividualDashboardState>((set, get) => ({
  ...initialState,

  // Fetch profile insights data
  fetchProfileInsights: async () => {
    try {
      set({ isLoading: true, error: null });

      // Get authentication data
      const authData = getAuthData();
      if (!authData) {
        throw new Error('Authentication data not found. Please login again.');
      }

      const { entityId, apiKey, apiSecret } = authData;

      if (!apiKey || !apiSecret) {
        throw new Error('API credentials not found. Please login again.');
      }

      // Call the API
      const response: ProfileInsightsResponse = await getProfileInsights(
        entityId,
        apiKey,
        apiSecret
      );

      // Check if the response is successful
      if (response.message.status === 'success') {
        // Use the actual API data, only fallback to zeros if data is null/undefined
        const data = response.message.data ? response.message.data : {
          total_matches: 0,
          great_matches: 0,
          interest_shown: 0,
          current_week_matches: 0
        };
        
        set({
          profileInsights: data,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.message.message || 'Failed to fetch profile insights');
      }
    } catch (error: any) {
      console.error('Error fetching profile insights:', error);
      
      // For authentication errors or API failures, show default values instead of error
      if (error.message?.includes('Authentication data not found') || 
          error.message?.includes('API credentials not found') ||
          error.message?.includes('Entity ID not found')) {
        console.log('Setting default profile insights due to auth issues');
        set({
          profileInsights: {
            total_matches: 0,
            great_matches: 0,
            interest_shown: 0,
            current_week_matches: 0
          },
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: error.message || 'Failed to fetch profile insights',
          profileInsights: null,
        });
      }
    }
  },

  // Fetch opportunity matches data
  fetchOpportunityMatches: async () => {
    try {
      set({ isLoadingOpportunities: true, opportunityError: null });

      // Get authentication data
      const authData = getAuthData();
      if (!authData) {
        throw new Error('Authentication data not found. Please login again.');
      }

      const { entityId, apiKey, apiSecret } = authData;

      if (!apiKey || !apiSecret) {
        throw new Error('API credentials not found. Please login again.');
      }

      // Call the API
      const response: OpportunityMatchesResponse = await getOpportunityMatches(
        entityId,
        apiKey,
        apiSecret
      );

      // Check if the response is successful
      if (response.message.status === 'success') {
        // Transform API data to UI format
        const transformedOpportunities = response.message.data.map(mapOpportunityMatchToJobOpportunity);
        
        set({
          opportunityMatches: response.message.data,
          opportunities: transformedOpportunities,
          totalOpportunities: response.message.total_count,
          totalPages: response.message.total_pages,
          isLoadingOpportunities: false,
          opportunityError: null,
        });
      } else {
        throw new Error(response.message.message || 'Failed to fetch opportunity matches');
      }
    } catch (error: any) {
      console.error('Error fetching opportunity matches:', error);
      
      // For authentication errors or API failures, show empty opportunities instead of error
      if (error.message?.includes('Authentication data not found') || 
          error.message?.includes('API credentials not found') ||
          error.message?.includes('Entity ID not found') ||
          error.message?.includes('Entity ID is required')) {
        console.log('Setting empty opportunities due to auth issues');
        set({
          opportunityMatches: [],
          opportunities: [],
          totalOpportunities: 0,
          totalPages: 0,
          isLoadingOpportunities: false,
          opportunityError: null,
        });
      } else {
        set({
          isLoadingOpportunities: false,
          opportunityError: error.message || 'Failed to fetch opportunity matches',
          opportunityMatches: null,
          opportunities: null,
        });
      }
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Clear opportunity error
  clearOpportunityError: () => {
    set({ opportunityError: null });
  },

  // Reset store to initial state
  resetStore: () => {
    set(initialState);
  },
}));