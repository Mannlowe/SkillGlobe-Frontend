import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for personal info data
export interface PersonalInfoData {
  entity_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  // phone: string;
  gender: string;
  date_of_birth: string;
  nationality: string;
  country: string;
  city: string;
  landmark: string;
  pincode: string;
  current_address: string;
  permanent_address: string;
  twitter_handle?: string;
  linkedin_profile?: string;
  instagram_handle?: string;
  facebook_profile?: string;
  website?: string;
  employment_status?: string;
  total_experience?: string;
  notice_period?: string;
  professional_summary?: string;
  profile_picture?: File;
}

// Interface for update personal info response
export interface UpdatePersonalInfoResponse {
  message: {
    status: string;
    data?: any;
  };
}

export const updatePersonalInfo = async (
  personalInfoData: PersonalInfoData,
  apiKey: string,
  apiSecret: string
): Promise<UpdatePersonalInfoResponse> => {
  try {
    console.log('Updating personal info with entity ID:', personalInfoData.entity_id);
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    // Make API call
    const response = await axios.post<UpdatePersonalInfoResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.form.update_portfolio`,
      personalInfoData,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Update personal info response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update personal info error:', error.response?.data || error.message || error);
    throw error;
  }
};

/**
 * Get authentication data from localStorage
 * @returns Object containing auth data or null if not found
 */
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