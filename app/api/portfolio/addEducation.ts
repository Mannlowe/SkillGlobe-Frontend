import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for education data
export interface EducationData {
  entity_id: string;
  education_level: string;
  year_of_completion: string;
  stream: string;
  score: string;
  university_board: string;
  certificate?: File;
}

// Interface for add education response
export interface AddEducationResponse {
  message: {
    status: string;
    data?: any;
  };
}

// Interface for education list response
export interface EducationListResponse {
  message?: {
    status: string;
    message: string;
    data?: {
      portfolio?: string;
      entity_id?: string;
      education_list?: Array<{
        name?: string;
        education_level?: string;
        year_of_completion?: number | string;
        stream?: string;
        score?: string | number;
        university_board?: string;
        certificate?: string | null;
      }>
    }
  };
  exception?: string;
  exc_type?: string;
  exc?: string;
  _server_messages?: string;
}

export const addEducation = async (
  educationData: EducationData,
  apiKey: string,
  apiSecret: string
): Promise<AddEducationResponse> => {
  try {
    console.log('Adding education with entity ID:', educationData.entity_id);
    
    // Create FormData object
    const formData = new FormData();
    formData.append('entity_id', educationData.entity_id);
    formData.append('education_level', educationData.education_level);
    formData.append('year_of_completion', educationData.year_of_completion);
    formData.append('stream', educationData.stream);
    formData.append('score', educationData.score);
    formData.append('university_board', educationData.university_board);
    
    // Add certificate file if available
    if (educationData.certificate) {
      formData.append('certificate', educationData.certificate);
    }
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    const response = await axios.post<AddEducationResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.add_education`,
      formData,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          // Don't set Content-Type when using FormData, axios will set it with the correct boundary
        }
      }
    );
    
    console.log('Add education response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Add education error:', error.response?.data || error.message || error);
    throw error;
  }
};

/**
 * Get authentication data from localStorage
 * @returns Object containing auth data or null if not found
 */
/**
 * Get education list for a user
 * @param entityId Entity ID of the user
 * @param apiKey API key for authentication
 * @param apiSecret API secret for authentication
 * @returns Promise with the education list response
 */
export const getEducationList = async (
  entityId: string,
  apiKey: string,
  apiSecret: string
): Promise<EducationListResponse> => {
  try {
    console.log('Getting education list for entity ID:', entityId);
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    // Use JSON payload format like addExperience instead of FormData
    const payload = { entity_id: entityId };
    
    const response = await axios.post<EducationListResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.education.add_education`,
      payload,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Get education list response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get education list error:', error.response?.data || error.message || error);
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
      // We need to add this to the storeAuthData function in auth.ts
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
            // The token is stored, but we need to check if the full auth object is available
            console.log('Found token in auth-storage, checking for auth data...');
            
            // Since we don't have direct access to api_key and api_secret in the state,
            // we'll need to modify the auth.ts file to store these values separately
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
