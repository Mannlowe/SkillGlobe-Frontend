import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for experience data
export interface ExperienceData {
  entity_id: string;
  space: string;
  designation: string;
  company: string;
  relevant_experience: number;
}

// Interface for add experience response
export interface AddExperienceResponse {
  message: {
    status: string;
    data?: any;
  };
}

export interface ExperienceListResponse {
  message?: {
    status: string;
    message: string;
    data?: {
      portfolio?: string;
      entity_id?: string;
      experience_list?: Array<{
        name?: string;
        space?: string;
        designation?: string;
        company?: string;
        relevant_experience?: number;
      }>
    }
  };
  exception?: string;
  exc_type?: string;
  exc?: string;
  _server_messages?: string;
}

/**
 * Add work experience details to user portfolio
 * @param experienceData Experience data to be added
 * @param apiKey API key for authentication
 * @param apiSecret API secret for authentication
 * @returns Promise with the response
 */
export const addExperience = async (
  experienceData: ExperienceData,
  apiKey: string,
  apiSecret: string
): Promise<AddExperienceResponse> => {
  try {
    console.log('Adding work experience with entity ID:', experienceData.entity_id);
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    const response = await axios.post<AddExperienceResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.experience.add_work_experience`,
      experienceData,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Add work experience response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Add work experience error:', error.response?.data || error.message || error);
    throw error;
  }
};

export const getExperienceList = async (
  entityId: string,
  apiKey: string,
  apiSecret: string
): Promise<ExperienceListResponse> => {
  try {
    console.log('Getting experience list for entity ID:', entityId);

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    // Construct URL with query param
    const url = `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.experience.get_experience_list?entity_id=${entityId}`;

    const response = await axios.get(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    console.log('Get experience list response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get experience list error:', error.response?.data || error.message || error);
    throw error;
  }
};


export const getAuthData = () => {
  if (typeof window !== 'undefined') {
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
      
      // Check if we have all required auth data
      if (!token || !entityData?.details?.entity_id || !apiKey || !apiSecret) {
        console.log('Missing auth data:', { 
          hasToken: !!token, 
          hasEntityId: !!entityData?.details?.entity_id, 
          hasApiKey: !!apiKey, 
          hasApiSecret: !!apiSecret 
        });
        return null;
      }
      
      return {
        token,
        entityId: entityData.details.entity_id,
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