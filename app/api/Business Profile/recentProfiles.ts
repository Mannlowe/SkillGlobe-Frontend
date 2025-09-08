import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

export const getAuthData = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    // Get token and entity data from localStorage
    const token = localStorage.getItem('auth_token');
    const entityDataStr = localStorage.getItem('entity_data');
    const entityData = entityDataStr ? JSON.parse(entityDataStr) : {};
    
    // Store auth data directly in localStorage during login
    const apiKey = localStorage.getItem('auth_api_key');
    const apiSecret = localStorage.getItem('auth_api_secret');
    
    // If we don't have the API credentials in localStorage, try to get them from auth-storage
    if (!apiKey || !apiSecret) {
      console.log('API credentials not found in direct localStorage, checking auth-storage...');
      const authString = localStorage.getItem('auth-storage');
      
      if (authString) {
        const authStorage = JSON.parse(authString);
        const state = authStorage.state;
        
        // Try to get API credentials from state
        if (state && state.token) {
          console.log('Found token in auth-storage, checking for auth data...');
        }
      }
    }
    
    // Try to get entity ID from multiple sources
    let entityId = '';
    
    // First try from entity_data
    if (entityData?.details?.entity_id) {
      entityId = entityData.details.entity_id;
    }
    
    // If not found, try from userInfo in localStorage
    if (!entityId) {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo?.entity_id) {
          entityId = userInfo.entity_id;
        }
      }
    }
    
    // Check if we have all required auth data
    if (!token || !entityId || !apiKey || !apiSecret) {
      console.log('Missing auth data:', { 
        hasToken: !!token, 
        hasEntityId: !!entityId, 
        hasApiKey: !!apiKey, 
        hasApiSecret: !!apiSecret 
      });
      return null;
    }
    
    return {
      token,entityId,apiKey,apiSecret
    };
  } catch (error) {
    console.error('Error getting auth data from localStorage:', error);
    return null;
  }
};

// Interface for recent profiles request
export interface RecentProfilesRequest {
  entity_id: string;
}

// Interface for recent profile item
export interface RecentProfile {
  name: string;
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
  desired_job_role: string;
}

// Interface for recent profiles response
export interface RecentProfilesResponse {
  message: {
    status: string;
    message: string;
    data: RecentProfile[];
    timestamp: string;
    total_count: number;
    total_pages: number;
    current_page: number;
    current_page_count: number;
  };
}

// Function to get recent profiles
export const getRecentProfiles = async (
  entityId: string,
  apiKey?: string,
  apiSecret?: string
): Promise<RecentProfile[]> => {
  try {
    console.log('Fetching recent profiles for entity:', entityId);
    
    // Get auth data if not provided
    if (!apiKey || !apiSecret) {
      const authData = getAuthData();
      if (authData) {
        apiKey = authData.apiKey;
        apiSecret = authData.apiSecret;
      } else {
        console.error('Authentication data not available');
        throw new Error('Authentication data not available');
      }
    }
    
    // Create authorization header with proper token format
    const authHeader = `token ${apiKey}:${apiSecret}`;
    console.log('Authorization header created (length):', authHeader.length);
    
    const requestData: RecentProfilesRequest = {
      entity_id: entityId
    };
    
    console.log('Request payload:', requestData);
    
    // Try using GET method with params instead of POST with body
    const response = await axios.get<RecentProfilesResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.opportunity_posting.dashboard.recent_profiles`,
      {
        params: requestData,
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Recent profiles response:', response.data);
    
    if (response.data.message.status === 'success' && response.data.message.data) {
      return response.data.message.data;
    }
    
    return [];
  } catch (error: any) {
    console.error('Recent profiles API error:', error);
    
    // Log more detailed error information
    if (error.response) {
      console.error('Error response data:', error.response.data);
      
      // Handle specific 403 permission error
      if (error.response.status === 403) {
        const errorMessage = error.response.data?.exception || 'Permission denied - check API credentials and permissions';
        throw new Error(`Authentication failed: ${errorMessage}`);
      }
    }
    
    throw error;
  }
};

// Helper function to determine status based on API flags
export const getProfileStatus = (profile: RecentProfile): string => {
  if (profile.profile_owner_shown_interest === 1) {
    return 'Shortlisted';
  } else if (profile.is_visible_to_profile === 1) {
    return 'Pending';
  }
  return 'New';
};