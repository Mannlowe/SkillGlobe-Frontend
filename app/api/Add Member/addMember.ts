import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for add member data
export interface AddMemberData {
  entity_id: string;
  email: string;
  full_name: string;
  password: string;
  send_welcome_email: boolean;
}

// Interface for add member response
export interface AddMemberResponse {
  message: {
    status: string;
    data?: any;
    message?: string;
  };
}

export const addMember = async (
  memberData: AddMemberData,
  apiKey: string,
  apiSecret: string
): Promise<AddMemberResponse> => {
  try {
    console.log('Adding member with entity ID:', memberData.entity_id);
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    const response = await axios.post<AddMemberResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.business_admin.form.add_business_user`,
      memberData,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Add member response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Add member error:', error.response?.data || error.message || error);
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