// Authentication utility functions
export interface AuthData {
  api_url: string;
  auth_key_secret: string;
  entity_id?: string;
  entityId?: string;
  apiKey?: string;
  apiSecret?: string;
  user_data?: any;
  entity_data?: any;
}

/**
 * Get authentication data from localStorage and environment
 * @returns AuthData object with API URL and authentication credentials
 */
export const getAuthData = (): AuthData | null => {
  if (typeof window !== 'undefined') {
    try {
      // Get API base URL from environment
      const api_url = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';
      
      // Get entity data from localStorage
      const entityDataStr = localStorage.getItem('entity_data');
      const entityData = entityDataStr ? JSON.parse(entityDataStr) : {};
      
      // Get API credentials from localStorage
      const apiKey = localStorage.getItem('auth_api_key');
      const apiSecret = localStorage.getItem('auth_api_secret');
      
      // If we don't have the API credentials in localStorage, try to get them from auth-storage
      if (!apiKey || !apiSecret) {
        const authString = localStorage.getItem('auth-storage');
        
        if (authString) {
          const authStorage = JSON.parse(authString);
          const state = authStorage.state;
          
          // Try to get API credentials from state
          if (state && state.token) {
            const retrievedEntityId = entityData.details?.entity_id || entityData.entity_id || state.entityId || '';
            
            if (!retrievedEntityId) {
              console.error('Entity ID not found in auth storage');
              return null;
            }
            
            return {
              api_url,
              auth_key_secret: apiSecret || state.apiSecret || '',
              entity_id: retrievedEntityId,
              entityId: retrievedEntityId,
              apiKey: state.apiKey || '',
              apiSecret: state.apiSecret || '',
              user_data: entityData,
              entity_data: entityData
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
      
      return {
        api_url,
        auth_key_secret: apiSecret,
        entity_id: retrievedEntityId,
        entityId: retrievedEntityId,
        apiKey,
        apiSecret,
        user_data: entityData,
        entity_data: entityData
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return null;
    }
  }
  return null;
};
