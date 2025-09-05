import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for organization insights request
export interface OrganizationInsightsRequest {
  entity_id: string;
}

// Interface for organization insights response
export interface OrganizationInsightsResponse {
  message: {
    status: string;
    message: string;
    data: {
      total_postings: number;
      active_postings: number;
      shortlisted: number;
      total_postings_change?: string;
      active_postings_change?: string;
      shortlisted_change?: string;
    };
    timestamp: string;
    entity_id: string;
  };
}

/**
 * Get organization insights data for business dashboard
 * @param entityId Entity ID of the business
 * @param apiKey API key for authentication
 * @param apiSecret API secret for authentication
 * @returns Promise with organization insights response
 */
export const getOrganizationInsights = async (
  entityId: string,
  apiKey: string,
  apiSecret: string
): Promise<OrganizationInsightsResponse> => {
  try {
    // Validate entity_id to ensure it's not empty
    if (!entityId) {
      console.error('Entity ID is missing or empty');
      throw new Error('Entity ID is required but was not provided');
    }
    
    console.log('Getting organization insights for entity ID:', entityId);

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    // API endpoint
    const url = `${API_BASE_URL}/api/method/skillglobe_be.api.opportunity_posting.dashboard.organization_insights`;

    const response = await axios.get<OrganizationInsightsResponse>(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      },
      params: {
        entity_id: entityId
      }
    });

    console.log('Organization insights response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Organization insights error:', error.response?.data || error.message || error);
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