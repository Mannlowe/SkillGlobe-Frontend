// Business Profile API functions
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for business profile request
export interface BusinessProfileRequest {
  entity_id: string;
  tax_id: string;
  website: string;
  industry: string;
  number_of_employees: string;
  headquarters_address: string;
  about_company: string;
}

// Interface for business profile response
export interface BusinessProfileResponse {
  message: {
    status: string;
    message: string;
    data?: Record<string, any>;
    timestamp: string;
  };
}

/**
 * Get authentication data from localStorage
 * @returns Object containing auth data or null if not found
 */
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
      token,
      entityId,
      apiKey,
      apiSecret
    };
  } catch (error) {
    console.error('Error getting auth data from localStorage:', error);
    return null;
  }
};

/**
 * Update business profile
 * @param profileData Business profile data object
 * @param apiKey API key for authentication
 * @param apiSecret API secret for authentication
 * @returns Promise with business profile response
 */
export const updateBusinessProfile = async (
  profileData: BusinessProfileRequest,
  apiKey?: string,
  apiSecret?: string
): Promise<BusinessProfileResponse> => {
  try {
    console.log('Updating business profile with:', profileData);
    
    // Get auth data if not provided
    if (!apiKey || !apiSecret) {
      const authData = getAuthData();
      if (authData) {
        apiKey = authData.apiKey;
        apiSecret = authData.apiSecret;
      } else {
        throw new Error('Authentication data not available');
      }
    }
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    const response = await axios.post<BusinessProfileResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.business_profile.form.update_business_profile`,
      profileData,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Business profile update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Business profile update error:', error.response?.data || error.message || error);
    throw error;
  }
};
