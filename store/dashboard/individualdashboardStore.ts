import { create } from 'zustand';
import { getProfileInsights, getOpportunityMatches, getAuthData, markAsInterested, saveOpportunityMatch, ProfileInsightsResponse, OpportunityMatchesResponse, OpportunityMatch, MarkAsInterestedResponse, SaveOpportunityMatchResponse } from '@/app/api/Dashboard/individualDashboard';
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
    application_deadline: match.op_application_deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    
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
    seller_interested: match.seller_interested === 1,
    bookmarked: match.bookmarked_by_profile_owner === 1, // Use bookmarked_by_profile_owner instead of bookmarked
    
    // New fields from API response
    opportunity_type: match.op_opportunity_type || '',
    experience_required: match.op_experience_required || '',
    employment_type: match.op_employment_type || '',
    work_mode: match.op_work_mode || '',
    opportunity_closed: match.op_opportunity_closed === 1,
    description: match.op_description || '',
    preferred_qualifications: match.op_preferred_qualifications,
    primary_skills: match.primary_skills || [],
    secondary_skills: match.secondary_skills || [],
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
  
  // Interest marking
  isMarkingInterest: boolean;
  markInterestError: string | null;
  
  // Bookmarking
  isBookmarking: boolean;
  bookmarkError: string | null;
  bookmarkedOpportunities: JobOpportunity[] | null;
  isLoadingBookmarks: boolean;
  
  // Actions
  fetchProfileInsights: () => Promise<void>;
  fetchOpportunityMatches: (searchQuery?: string, filters?: Record<string, any>) => Promise<void>;
  markOpportunityInterest: (opportunityMatchId: string) => Promise<boolean>;
  bookmarkOpportunity: (opportunityMatchId: string, value?: number) => Promise<boolean>;
  fetchBookmarkedOpportunities: () => Promise<void>;
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
  isMarkingInterest: false,
  markInterestError: null,
  isBookmarking: false,
  bookmarkError: null,
  bookmarkedOpportunities: null,
  isLoadingBookmarks: false,
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
      
      // For authentication errors, API failures, or 401 status, show default values instead of error
      if (error.message?.includes('Authentication data not found') || 
          error.message?.includes('API credentials not found') ||
          error.message?.includes('Entity ID not found') ||
          error.response?.status === 401 ||
          (error.message && error.message.includes('401'))) {
        console.log('Setting default profile insights due to auth issues or 401 status');
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
  fetchOpportunityMatches: async (searchQuery?: string, filters?: Record<string, any>) => {
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

      console.log('Fetching opportunities with search query:', searchQuery, 'and filters:', filters);

      // Call the API with optional search query and filters
      const response: OpportunityMatchesResponse = await getOpportunityMatches(
        entityId,
        apiKey,
        apiSecret,
        searchQuery,
        filters
      );

      // Check if the response is successful
      if (response.message.status === 'success') {
        // Check if data is an empty object or null/undefined
        const isEmptyData = !response.message.data || 
                          (typeof response.message.data === 'object' && 
                           !Array.isArray(response.message.data) && 
                           Object.keys(response.message.data).length === 0);
        
        if (isEmptyData) {
          // Handle empty object response
          console.log('API returned empty data object for search:', searchQuery);
          set({
            opportunityMatches: [],
            opportunities: [],
            totalOpportunities: 0,
            totalPages: 0,
            isLoadingOpportunities: false,
            opportunityError: null,
          });
        } else {
          // Transform API data to UI format
          const transformedOpportunities = Array.isArray(response.message.data) 
            ? response.message.data.map(mapOpportunityMatchToJobOpportunity)
            : [];
          
          set({
            opportunityMatches: Array.isArray(response.message.data) ? response.message.data : [],
            opportunities: transformedOpportunities,
            totalOpportunities: response.message.total_count,
            totalPages: response.message.total_pages,
            isLoadingOpportunities: false,
            opportunityError: null,
          });
        }
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

  // Mark opportunity as interested
  markOpportunityInterest: async (opportunityMatchId: string) => {
    try {
      set({ isMarkingInterest: true, markInterestError: null });

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
      const response: MarkAsInterestedResponse = await markAsInterested(
        entityId,
        opportunityMatchId,
        apiKey,
        apiSecret
      );

      // Check if the response is successful
      if (response.message.status === 'success') {
        // Update the local state to reflect the interest
        const currentOpportunityMatches = get().opportunityMatches;
        const currentOpportunities = get().opportunities;

        if (currentOpportunityMatches) {
          const updatedMatches = currentOpportunityMatches.map(match => {
            if (match.opportunity_match_id === opportunityMatchId) {
              return { ...match, seller_interested: 1 };
            }
            return match;
          });

          // Update the transformed opportunities as well
          const updatedOpportunities = currentOpportunities?.map(opp => {
            const matchingMatch = updatedMatches.find(m => m.opportunity_posting === opp.id);
            if (matchingMatch && matchingMatch.opportunity_match_id === opportunityMatchId) {
              return { ...opp, seller_interested: true };
            }
            return opp;
          }) || null;

          set({
            opportunityMatches: updatedMatches,
            opportunities: updatedOpportunities,
            isMarkingInterest: false,
            markInterestError: null,
          });
        }

        return true;
      } else {
        throw new Error(response.message.message || 'Failed to mark interest');
      }
    } catch (error: any) {
      console.error('Error marking interest:', error);
      set({
        isMarkingInterest: false,
        markInterestError: error.message || 'Failed to mark interest',
      });
      return false;
    }
  },

  // Bookmark opportunity
  bookmarkOpportunity: async (opportunityMatchId: string, value?: number) => {
    try {
      set({ isBookmarking: true, bookmarkError: null });

      // Get authentication data
      const authData = getAuthData();
      if (!authData) {
        throw new Error('Authentication data not found. Please login again.');
      }

      const { entityId, apiKey, apiSecret } = authData;

      if (!apiKey || !apiSecret) {
        throw new Error('API credentials not found. Please login again.');
      }

      // Find the current match to determine the value if not provided
      const currentOpportunityMatches = get().opportunityMatches;
      const match = currentOpportunityMatches?.find(m => m.opportunity_match_id === opportunityMatchId);
      
      // If value is not provided, toggle the current value
      const currentBookmarkedValue = match?.bookmarked_by_profile_owner || 0;
      const bookmarkValue = value !== undefined ? value : (currentBookmarkedValue === 1 ? 0 : 1);
      
      // Call the API with the value parameter
      const response: SaveOpportunityMatchResponse = await saveOpportunityMatch(
        entityId,
        opportunityMatchId,
        apiKey,
        apiSecret,
        bookmarkValue
      );

      // Check if the response is successful
      if (response.message.status === 'success') {
        // Update the local state to reflect the bookmark
        const currentOpportunityMatches = get().opportunityMatches;
        const currentOpportunities = get().opportunities;
        const bookmarkedOpportunities = get().bookmarkedOpportunities;

        if (currentOpportunityMatches) {
          // Use the bookmarkValue we determined earlier
          const newBookmarkedValue = bookmarkValue;
          
          // Update matches
          const updatedMatches = currentOpportunityMatches.map(match => {
            if (match.opportunity_match_id === opportunityMatchId) {
              return { ...match, bookmarked_by_profile_owner: newBookmarkedValue };
            }
            return match;
          });

          // Update transformed opportunities
          const updatedOpportunities = currentOpportunities?.map(opp => {
            const matchingMatch = updatedMatches.find(m => m.opportunity_posting === opp.id);
            if (matchingMatch && matchingMatch.opportunity_match_id === opportunityMatchId) {
              return { ...opp, bookmarked: newBookmarkedValue === 1 };
            }
            return opp;
          }) || null;
          
          // Update bookmarked opportunities list - if toggling off, remove from list
          let updatedBookmarkedOpportunities = bookmarkedOpportunities;
          if (newBookmarkedValue === 0 && bookmarkedOpportunities) {
            // If toggling off, remove from bookmarked list
            updatedBookmarkedOpportunities = bookmarkedOpportunities.filter(
              opp => !opp.id.includes(opportunityMatchId.replace('OM-', ''))
            );
          } else if (newBookmarkedValue === 1) {
            // If toggling on, we'll need to refresh the bookmarked list
            // This will be handled by calling fetchBookmarkedOpportunities after this function
          }

          set({
            opportunityMatches: updatedMatches,
            opportunities: updatedOpportunities,
            bookmarkedOpportunities: updatedBookmarkedOpportunities,
            isBookmarking: false,
            bookmarkError: null,
          });
          
          // If toggling on, refresh the bookmarked list
          if (newBookmarkedValue === 1) {
            get().fetchBookmarkedOpportunities();
          }
        }

        return true;
      } else {
        throw new Error(response.message.message || 'Failed to bookmark opportunity');
      }
    } catch (error: any) {
      console.error('Error bookmarking opportunity:', error);
      set({
        isBookmarking: false,
        bookmarkError: error.message || 'Failed to bookmark opportunity',
      });
      return false;
    }
  },

  // Fetch bookmarked opportunities
  fetchBookmarkedOpportunities: async () => {
    try {
      set({ isLoadingBookmarks: true, bookmarkError: null });

      // Get authentication data
      const authData = getAuthData();
      if (!authData) {
        throw new Error('Authentication data not found. Please login again.');
      }

      const { entityId, apiKey, apiSecret } = authData;

      if (!apiKey || !apiSecret) {
        throw new Error('API credentials not found. Please login again.');
      }

      // Call the API with bookmarked filter
      const response: OpportunityMatchesResponse = await getOpportunityMatches(
        entityId,
        apiKey,
        apiSecret,
        undefined, // No search query
        { bookmarked: 1 } // Filter for bookmarked opportunities
      );

      // Check if the response is successful
      if (response.message.status === 'success') {
        // Transform API data to UI format
        const transformedOpportunities = response.message.data.map(mapOpportunityMatchToJobOpportunity);
        
        console.log('Bookmarked opportunities API response:', response.message.data);
        console.log('Transformed bookmarked opportunities for UI:', transformedOpportunities);
        
        set({
          bookmarkedOpportunities: transformedOpportunities,
          isLoadingBookmarks: false,
          bookmarkError: null,
        });
      } else {
        throw new Error(response.message.message || 'Failed to fetch bookmarked opportunities');
      }
    } catch (error: any) {
      console.error('Error fetching bookmarked opportunities:', error);
      set({
        isLoadingBookmarks: false,
        bookmarkError: error.message || 'Failed to fetch bookmarked opportunities',
        bookmarkedOpportunities: null,
      });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Clear opportunity error
  clearOpportunityError: () => {
    set({ opportunityError: null, markInterestError: null, bookmarkError: null });
  },

  // Reset store to initial state
  resetStore: () => {
    set(initialState);
  },
}));