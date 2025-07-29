import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for resume upload response
export interface ResumeUploadResponse {
  message: {
    status: string;
    message: string;
    data: {
      name?: string;
      file_url?: string;
      [key: string]: any;
    };
    timestamp: string;
  };
}

/**
 * Upload resume file to the server
 * @param file Resume file to upload
 * @param entityId User's entity ID
 * @param apiKey API key from login response
 * @param apiSecret API secret from login response
 * @returns Promise with upload response
 */
export const uploadResume = async (
  file: File,
  entityId: string,
  apiKey: string,
  apiSecret: string
): Promise<ResumeUploadResponse> => {
  try {
    console.log('Uploading resume with entity ID:', entityId);
    
    // Create FormData object
    const formData = new FormData();
    formData.append('entity_id', entityId);
    formData.append('resume', file);
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    const response = await axios.post<ResumeUploadResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.upload_resume`,
      formData,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          // Don't set Content-Type when using FormData, axios will set it with the correct boundary
        }
      }
    );
    
    console.log('Resume upload response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Resume upload error:', error.response?.data || error.message || error);
    throw error;
  }
};

/**
 * Get authentication data from localStorage
 * @returns Object containing auth data or null if not found
 */
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
