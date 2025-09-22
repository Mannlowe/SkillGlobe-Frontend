import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Function to get authentication data from localStorage
export const getAuthData = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    // Get auth data from individual localStorage items
    const apiKey = localStorage.getItem('auth_api_key');
    const apiSecret = localStorage.getItem('auth_api_secret');
    
    // Get entity ID from entity_data
    let entityId = '';
    const entityDataStr = localStorage.getItem('entity_data');
    if (entityDataStr) {
      const entityData = JSON.parse(entityDataStr);
      if (entityData && entityData.details && entityData.details.entity_id) {
        entityId = entityData.details.entity_id;
      }
    }
    
    // Check if we have all required data
    if (!apiKey || !apiSecret || !entityId) {
      console.log('Missing auth data:', { hasApiKey: !!apiKey, hasApiSecret: !!apiSecret, hasEntityId: !!entityId });
      return null;
    }
    
    return {
      apiKey,
      apiSecret,
      entityId
    };
  } catch (error) {
    console.error('Error getting auth data from localStorage:', error);
    return null;
  }
};

/**
 * API function to fetch profile count based on filters
 */

// Interface for profile count parameters
export interface ProfileCountParams {
  city?: string;
  work_mode?: string;
  min_experience?: string | number;
  skills?: string;
}

// Interface for profile count API response
export interface ProfileCountResponse {
  message: number;
}

/**
 * Fetches the count of profiles matching the specified filters
 * @param params - Filter parameters
 * @returns Promise with the count of matching profiles
 */
export async function getProfileCount(params: ProfileCountParams = {}): Promise<number> {
  try {
    console.log('Fetching profile count with params:', params);
    
    // Get authentication data
    const authData = getAuthData();
    if (!authData) {
      console.error('No auth data available for profile count API');
      return 0;
    }
    
    // Create authorization header
    const authHeader = `token ${authData.apiKey}:${authData.apiSecret}`;
    console.log('Auth header created for profile count API');
    
    // Construct the URL
    const baseUrl = `${API_BASE_URL}/api/method/elasticonnect.es_search.search_profiles`;
    
    // Make the API request with axios
    const response = await axios.get<ProfileCountResponse>(baseUrl, {
      params: params,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('Profile count API response:', response.data);
    
    // Check if the response contains the expected data
    if (response.data && typeof response.data.message === 'number') {
      return response.data.message;
    } else {
      console.warn('API response does not contain expected message format:', response.data);
      return 0; // Return 0 if no valid message is found
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching profile count:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        params: error.config?.params,
      });
      // If we get a 403 Forbidden error, it might be an authentication issue
      if (error.response?.status === 403) {
        console.warn('Authentication error: You might need to add authentication headers or cookies');
      }
    } else {
      console.error('Error fetching profile count:', error);
    }
    
    // Return 0 on error, as we don't want to show incorrect data
    return 0;
  }
}
