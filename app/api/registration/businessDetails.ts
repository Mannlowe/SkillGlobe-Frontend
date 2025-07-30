// Business Details API functions
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for business details request
export interface BusinessDetailsRequest {
  request_id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_phone: string;
  password: string;
}

// Interface for business details response
export interface BusinessDetailsResponse {
  message: {
    status: string;
    message: string;
    data: Record<string, any>;
    timestamp: string;
    request_id: string;
    registration_step: string;
    email_verification_id: string;
    phone_verification_id: string;
  };
}

/**
 * Update business details
 * @param businessDetails Business details object
 * @returns Promise with business details response
 */
export const updateBusinessDetails = async (
  businessDetails: BusinessDetailsRequest
): Promise<BusinessDetailsResponse> => {
  try {
    console.log('Updating business details with:', businessDetails);
    
    const response = await axios.post<BusinessDetailsResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.register.register.update_business_details`,
      businessDetails,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Business details update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Business details update error:', error.response?.data || error.message || error);
    throw error;
  }
};
