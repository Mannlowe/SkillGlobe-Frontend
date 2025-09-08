import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for profile insights request
export interface ProfileInsightsRequest {
  entity_id: string;
}

// Interface for profile insights response
export interface ProfileInsightsResponse {
  message: {
    status: string;
    message: string;
    data: {
      total_matches: number;
      great_matches: number;
      interest_shown: number;
      current_week_matches: number;
    };
    timestamp: string;
    entity_id: string;
  };
}

// Interface for opportunity match item
export interface OpportunityMatch {
  name: string;
  opportunity_posting: string;
  role_based_profile: string;
  entity: string;
  match_score: number;
  buyer_interested: number;
  seller_interested: number;
  visible_to_profile: number;
  opportunity_title: string;
  location: string | null;
  work_mode: string;
  min_remuneration: number;
  role_skill_category: string;
  business_name: string | null;
}

// Interface for opportunity matches request
export interface OpportunityMatchesRequest {
  entity_id: string;
}

// Interface for opportunity matches response
export interface OpportunityMatchesResponse {
  message: {
    status: string;
    message: string;
    data: OpportunityMatch[];
    timestamp: string;
    total_count: number;
    total_pages: number;
  };
}

export const getProfileInsights = async (
  entityId: string,
  apiKey: string,
  apiSecret: string
): Promise<ProfileInsightsResponse> => {
  try {
    // Validate entity_id to ensure it's not empty
    if (!entityId) {
      console.error('Entity ID is missing or empty');
      throw new Error('Entity ID is required but was not provided');
    }
    
    console.log('Getting profile insights for entity ID:', entityId);

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    // API endpoint
    const url = `${API_BASE_URL}/api/method/skillglobe_be.api.opportunity_posting.dashboard.profile_insights`;

    const response = await axios.get<ProfileInsightsResponse>(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      },
      params: {
        entity_id: entityId
      }
    });

    console.log('Profile insights response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Profile insights error:', error.response?.data || error.message || error);
    throw error;
  }
};

/**
 * Get authentication data from local storage
 * @returns Object containing entity ID, API key, and API secret
 */
export const getAuthData = () => {
  if (typeof window !== 'undefined') {
    try {
      // Get entity data from localStorage
      const entityDataStr = localStorage.getItem('entity_data');
      console.log('Entity data from localStorage:', entityDataStr);
      
      const entityData = entityDataStr ? JSON.parse(entityDataStr) : {};
      console.log('Parsed entity data:', entityData);
      
      // Get API credentials from localStorage
      const apiKey = localStorage.getItem('auth_api_key');
      const apiSecret = localStorage.getItem('auth_api_secret');
      
      console.log('Direct localStorage API credentials:', { apiKey: !!apiKey, apiSecret: !!apiSecret });
      
      // If we don't have the API credentials in localStorage, try to get them from auth-storage
      if (!apiKey || !apiSecret) {
        console.log('API credentials not found in direct localStorage, checking auth-storage...');
        const authString = localStorage.getItem('auth-storage');
        
        if (authString) {
          const authStorage = JSON.parse(authString);
          const state = authStorage.state;
          
          console.log('Auth storage state:', { 
            hasToken: !!state?.token, 
            hasApiKey: !!state?.apiKey, 
            hasApiSecret: !!state?.apiSecret 
          });
          
          // Try to get API credentials from state
          if (state && state.token) {
            const retrievedEntityId = entityData.details?.entity_id || entityData.entity_id || state.entityId || '';
            
            if (!retrievedEntityId) {
              console.error('Entity ID not found in auth storage');
              return null;
            }
            
            console.log('Using entity ID from auth-storage:', retrievedEntityId);
            
            return {
              entityId: retrievedEntityId,
              apiKey: state.apiKey || '',
              apiSecret: state.apiSecret || ''
            };
          }
        }
        
        console.log('No valid auth-storage found, returning null');
        return null;
      }
      
      const retrievedEntityId = entityData.details?.entity_id || entityData.entity_id || '';
      
      if (!retrievedEntityId) {
        console.error('Entity ID not found in localStorage');
        return null;
      }
      
      // Check if we have valid API credentials
      if (!apiKey || !apiSecret) {
        console.error('API credentials not found in localStorage');
        return null;
      }
      
      // Log the entity ID being used
      console.log('Using entity ID:', retrievedEntityId);
      
      return {
        entityId: retrievedEntityId,
        apiKey,
        apiSecret
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return null;
    }
  }
  
  return null;
};

export const getOpportunityMatches = async (
  entityId: string,
  apiKey: string,
  apiSecret: string,
  searchQuery?: string
): Promise<OpportunityMatchesResponse> => {
  try {
    // Validate entity_id to ensure it's not empty
    if (!entityId) {
      console.error('Entity ID is missing or empty');
      throw new Error('Entity ID is required but was not provided');
    }
    
    console.log('Getting opportunity matches for entity ID:', entityId);

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    // API endpoint with entity_id and optional search_query as query parameters
    let url = `${API_BASE_URL}/api/method/skillglobe_be.api.opportunity_match.list.opportunity_matches?entity_id=${entityId}`;
    if (searchQuery && searchQuery.trim()) {
      url += `&search_query=${encodeURIComponent(searchQuery.trim())}`;
    }

    const response = await axios.get<OpportunityMatchesResponse>(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    console.log('Opportunity matches response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Opportunity matches error:', error.response?.data || error.message || error);
    throw error;
  }
};