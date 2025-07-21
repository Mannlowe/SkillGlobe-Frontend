// Registration API functions
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for user type selection request
export interface UserTypeSelectionRequest {
  entity_type: 'Individual' | 'Business';
  entity_category: 'Buyer' | 'Seller' | 'Enhancer';
}

// Interface for user type selection response
export interface UserTypeSelectionResponse {
  message: {
    status: string;
    message: string;
    registration_id: string;
    data: Record<string, any>;
    timestamp: string;
  };
}

export const startRegistration = async (
  entityType: 'Individual' | 'Business',
  entityCategory: 'Buyer' | 'Seller' | 'Enhancer'
): Promise<UserTypeSelectionResponse> => {
  try {
    console.log('Starting registration with:', { entity_type: entityType, entity_category: entityCategory });
    
    const response = await axios.post<UserTypeSelectionResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.register.start_registration`,
      {
        entity_type: entityType,
        entity_category: entityCategory
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error.response?.data || error.message || error);
    throw error;
  }
};
