// Personal Details API functions
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for personal details request
export interface PersonalDetailsRequest {
  request_id: string;
  email: string;
  phone: string;
  full_name: string;
  password: string;
}

// Interface for personal details response
export interface PersonalDetailsResponse {
  message: {
    status: string;
    message: string;
    data: Record<string, any>;
    timestamp: string;
    request_id: string;
    registration_step: string;
    email_verification_id: string | null;
    phone_verification_id: string | null;
  };
}

/**
 * Update personal details in the registration process
 * @param requestId Registration request ID
 * @param email User email
 * @param phone User phone number
 * @param fullName User full name
 * @param password User password
 * @returns Promise with update response
 */
export const updatePersonalDetails = async (
  requestId: string,
  email: string,
  phone: string,
  fullName: string,
  password: string
): Promise<PersonalDetailsResponse> => {
  try {
    console.log('Updating personal details:', { requestId, email, phone, fullName });
    
    const response = await axios.post<PersonalDetailsResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.register.update_personal_details`,
      {
        request_id: requestId,
        email: email,
        phone: phone,
        full_name: fullName,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Personal details update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Personal details update error:', error.response?.data || error.message || error);
    throw error;
  }
};
