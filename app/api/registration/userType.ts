// User Type Selection API functions
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for user type selection request
export interface UserTypeSelectionRequest {
  entity_type: 'Individual' | 'Business';
  entity_category: 'Buyer' | 'Seller' | 'Enhancer';
  lead_reference?: string; // Optional
  email_token?: string; // Optional
}

// Interface for user type selection response
export interface UserTypeSelectionResponse {
  message: {
    status: string;
    message: string;
    data: Record<string, any>;
    timestamp: string;
    request_id: string;
    entity_type: string;
    entity_category: string;
    registration_step: string;
  };
}

export const startRegistration = async (
  entityType: 'Individual' | 'Business',
  entityCategory: 'Buyer' | 'Seller' | 'Enhancer',
  leadReference?: string,
  emailToken?: string
): Promise<UserTypeSelectionResponse> => {
  try {
    const payload = {
      entity_type: entityType,
      entity_category: entityCategory,
      ...(leadReference && { lead_reference: leadReference }),
      ...(emailToken && { email_token: emailToken })
    };
    
    console.log('Starting registration with payload:', payload);
    console.log('Lead parameters:', { leadReference, emailToken });
    
    const response = await axios.post<UserTypeSelectionResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.register.register.start_registration`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Registration response:', response.data);
    console.log('Request ID generated:', response.data.message?.request_id);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error.response?.data || error.message || error);
    throw error;
  }
};
