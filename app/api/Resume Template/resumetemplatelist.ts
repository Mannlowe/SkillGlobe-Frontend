import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// API Request Interface
export interface GetProfileAndPortfolioRequest {
  entity_id: string;
  name: string;
}

// API Response Interfaces
export interface Portfolio {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  city: string;
  country: string;
  linkedin_profile: string;
  facebook_profile: string | null;
  twitter_handle: string;
  instagram_handle: string;
  professional_summary: string;
  education: any[];
  work_experience: any[];
}

export interface RoleBasedProfile {
  name: string;
  role: string;
  desired_job_role: string | null;
  space: string;
  industry: string | null;
  career_level: string | null;
  employment_type: string;
  nature_of_work: string;
  work_mode: string;
  relevant_experience: number;
  total_experience_years: string;
  certifications: string | null;
  primary_skills: any[];
  secondary_skills: any[];
}

export interface ProfileAndPortfolioData {
  portfolio: Portfolio;
  role_based_profile: RoleBasedProfile;
}

export interface GetProfileAndPortfolioResponse {
  message: {
    status: string;
    data: ProfileAndPortfolioData;
  };
}

// API Function
export const getProfileAndPortfolio = async (
  request: GetProfileAndPortfolioRequest
): Promise<GetProfileAndPortfolioResponse> => {
  try {
    const authData = getAuthData();
    
    if (!authData?.apiKey || !authData?.apiSecret) {
      throw new Error('Authentication data not found');
    }

    // Log request for debugging
    console.log('Profile request:', request);

    // Use axios GET method for this API call
    const response = await axios.get<GetProfileAndPortfolioResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.seller_resume_template.list.get_profile_and_portfolio`,
      {
        params: {
          entity_id: request.entity_id,
          name: request.name // This should be the profile ID (e.g., RBP00004)
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${authData.apiKey}:${authData.apiSecret}`,
          'X-Entity-ID': request.entity_id // Add entity ID in header as well
        }
      }
    );

    // Log response status for debugging
    console.log('API response status:', response.status);
    console.log('API response headers:', response.headers);
    
    const data = response.data;
    
    if (data.message.status !== 'success') {
      throw new Error('API request failed');
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile and portfolio:', error);
    throw error;
  }
};

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