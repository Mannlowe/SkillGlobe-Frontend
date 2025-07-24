// Complete Registration API functions
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';
export interface CompleteRegistrationRequest {
  request_id: string;
  password: string;
  agreed?: number; // 1 for accepted, 0 for not accepted
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

export const completeRegistration = async (
  requestId: string,
  password: string,
  agreed: number = 1 // Default to 1 (accepted)
): Promise<CompleteRegistrationResponse> => {
  try {
    console.log('Completing registration with:', { request_id: requestId });
    
    const response = await axios.post<CompleteRegistrationResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.register.complete_registration`,
      {
        request_id: requestId,
        password: password,
        agreed: agreed
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
