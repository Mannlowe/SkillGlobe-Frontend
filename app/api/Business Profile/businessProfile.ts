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

// Interface for industry types response
export interface IndustryTypesResponse {
  message: string[];
}

// Interface for business profile data
export interface BusinessProfileData {
  name: string;
  entity: string;
  business_name: string;
  status: string;
  profile_completion: number;
  about_company: string;
  company_logo: string | null;
  number_of_employees: string;
  industry: string;
  business_type: string;
  headquarters_address: string;
  website: string;
  tax_id: string;
  // Add other fields as needed
}

// Interface for get business profile response
export interface GetBusinessProfileResponse {
  message: {
    status: string;
    message: string;
    data: {
      business_profile: BusinessProfileData;
    };
    timestamp: string;
  };
}

// Interface for logo upload response
export interface LogoUploadResponse {
  message: {
    status: string;
    message: string;
    data?: {
      file_url?: string;
      url?: string;
      logo_url?: string;
      company_logo?: string;
      [key: string]: any; // Allow for other possible fields
    };
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

export const getIndustryTypes = async (
  apiKey?: string,
  apiSecret?: string
): Promise<IndustryTypesResponse> => {
  try {
    console.log('Fetching industry types...');
    
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
    
    const response = await axios.get<IndustryTypesResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.business_profile.utils.get_industry_type`,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Industry types response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Industry types fetch error:', error.response?.data || error.message || error);
    throw error;
  }
};

export const getBusinessProfile = async (
  entityId: string,
  apiKey?: string,
  apiSecret?: string
): Promise<GetBusinessProfileResponse> => {
  try {
    console.log('Fetching business profile for entity:', entityId);
    
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
    
    const response = await axios.get<GetBusinessProfileResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.business_profile.form.get_business_profile?entity_id=${entityId}`,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Business profile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Business profile fetch error:', error.response?.data || error.message || error);
    throw error;
  }
};

export const uploadCompanyLogo = async (
  entityId: string,
  logoFile: File,
  apiKey?: string,
  apiSecret?: string
): Promise<LogoUploadResponse> => {
  try {
    console.log('Uploading company logo for entity:', entityId);
    
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
    
    // Create FormData
    const formData = new FormData();
    formData.append('entity_id', entityId);
    formData.append('company_logo', logoFile, logoFile.name);
    
    console.log('FormData contents:');
    console.log('entity_id:', entityId);
    console.log('company_logo file:', logoFile.name, logoFile.type, logoFile.size);
    
    const response = await axios.post<LogoUploadResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.business_profile.form.upload_company_logo`,
      formData,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json'
          // Let axios set Content-Type automatically for FormData with boundary
        }
      }
    );
    
    console.log('Logo upload response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Logo upload error:', error.response?.data || error.message || error);
    throw error;
  }
};

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
