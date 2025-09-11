import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for profiles by opportunity request
export interface ProfilesByOpportunityRequest {
  entity_id: string;
  opportunity_posting_id: string;
}

// Interface for individual profile data
export interface ProfileData {
  opportunity_match_id: string;
  profile_owner: string;
  buyer_entity: string;
  opportunity_posting: string;
  role_based_profile: string;
  match_score: number;
  is_preferred: number;
  profile_owner_shown_interest: number;
  is_visible_to_profile: number;
  creation: string;
  shown_interest_timestamp: string;
  opportunity_title: string;
  opportunity_type: string;
  work_mode: string;
  relevant_experience: number;
  preferred_city: string | null;
  preferred_country: string;
  desired_job_role: string;
  full_name: string;
  email: string;
  mobile_number: string | null;
  country_code: string | null;
  primary_skills: string[];
  secondary_skills: string[];
  status?: string; // Status field from backend (shortlisted, rejected, etc.)
}

// Interface for profiles by opportunity response
export interface ProfilesByOpportunityResponse {
  message: {
    status: string;
    message: string;
    data: ProfileData[];
    timestamp: string;
    total_count: number;
    total_pages: number;
    current_page: number;
    current_page_count: number;
  };
}

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

export const getProfilesByOpportunity = async (
  entityId: string,
  opportunityPostingId: string,
  apiKey: string,
  apiSecret: string
): Promise<ProfilesByOpportunityResponse> => {
  try {
    // Validate required parameters
    if (!entityId) {
      console.error('Entity ID is missing or empty');
      throw new Error('Entity ID is required but was not provided');
    }
    
    if (!opportunityPostingId) {
      console.error('Opportunity Posting ID is missing or empty');
      throw new Error('Opportunity Posting ID is required but was not provided');
    }
    
    console.log('Getting profiles by opportunity for:', { entityId, opportunityPostingId });

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    // API endpoint with query parameters
    const url = `${API_BASE_URL}/api/method/skillglobe_be.api.opportunity_posting.dashboard.profiles_by_opportunity`;

    const response = await axios.get<ProfilesByOpportunityResponse>(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      },
      params: {
        entity_id: entityId,
        opportunity_posting_id: opportunityPostingId
      }
    });

    console.log('Profiles by opportunity response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Profiles by opportunity error:', error.response?.data || error.message || error);
    throw error;
  }
};