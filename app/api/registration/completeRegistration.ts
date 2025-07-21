// Complete Registration API functions
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for complete registration request
export interface CompleteRegistrationRequest {
  request_id: string;
  password: string;
}

// Interface for complete registration response
export interface CompleteRegistrationResponse {
  message: {
    status: string;
    message: string;
    data: Record<string, any>;
    timestamp: string;
    user_email: string;
    entity_id: string;
    entity_type: string;
    entity_category: string;
  };
}

/**
 * Complete the registration process
 * @param requestId Registration request ID
 * @param password User password
 * @returns Promise with complete registration response
 */
export const completeRegistration = async (
  requestId: string,
  password: string
): Promise<CompleteRegistrationResponse> => {
  try {
    console.log('Completing registration with:', { request_id: requestId });
    
    const response = await axios.post<CompleteRegistrationResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.register.complete_registration`,
      {
        request_id: requestId,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Complete registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Complete registration error:', error.response?.data || error.message || error);
    throw error;
  }
};
