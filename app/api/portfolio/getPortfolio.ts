import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for portfolio response
export interface PortfolioResponse {
  message?: {
    status: string;
    message_text?: string;
    data?: {
      portfolio?: any;
      entity_id?: string;
    }
  };
  status: string;
  data?: {
    portfolio?: any;
    entity_id?: string;
  };
  exception?: string;
  exc_type?: string;
  exc?: string;
  _server_messages?: string;
}

/**
 * Get portfolio data for an entity
 * @param entityId - The entity ID
 * @param apiKey - API key for authentication
 * @param apiSecret - API secret for authentication
 * @returns Promise with portfolio data
 */
export const getPortfolio = async (
  entityId: string,
  apiKey: string,
  apiSecret: string
): Promise<PortfolioResponse> => {
  try {
    // Validate entity_id to ensure it's not empty
    if (!entityId) {
      console.error('Entity ID is missing or empty');
      throw new Error('Entity ID is required but was not provided');
    }
    
    console.log('Getting portfolio for entity ID:', entityId);

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    // Construct URL without query param
    const url = `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.form.get_portfolio`;

    const response = await axios.get<PortfolioResponse>(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'X-Entity-ID': entityId  // Pass entity_id in custom header
      },
      params: {
        entity_id: entityId  // Also pass as a parameter in case the API expects it
      }
    });

    console.log('Get portfolio response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get portfolio error:', error.response?.data || error.message || error);
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
      // Get token and entity data from localStorage
      const token = localStorage.getItem('auth_token');
      const entityDataStr = localStorage.getItem('entity_data');
      console.log('Entity data from localStorage:', entityDataStr);
      
      const entityData = entityDataStr ? JSON.parse(entityDataStr) : {};
      console.log('Parsed entity data:', entityData);
      
      // Entity ID is stored in details.entity_id, not directly in entity_id
      const entityId = entityData.details?.entity_id;
      console.log('Entity ID from parsed data:', entityId);
      
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
            const retrievedEntityId = entityId || state.entityId || '';
            
            if (!retrievedEntityId) {
              console.error('Entity ID not found in localStorage or auth-storage');
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
        
        return null;
      }
      
      const retrievedEntityId = entityId || '';
      
      if (!retrievedEntityId) {
        console.error('Entity ID not found in localStorage');
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
