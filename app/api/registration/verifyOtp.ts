// OTP Verification API functions
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for OTP verification request
export interface VerifyOtpRequest {
  request_id: string;
  email_otp: string;
  phone_otp: string;
  lead_reference?: string; // Optional
  email_token?: string; // Optional
}

// Interface for OTP verification response
export interface VerifyOtpResponse {
  message: {
    status: string;
    message: string;
    data: Record<string, any>;
    timestamp: string;
    request_id: string;
    email_verified: boolean;
    phone_verified: boolean;
    registration_step: string;
    is_complete: boolean;
  };
}

/**
 * Verify OTP codes for email and phone
 * @param requestId Registration request ID
 * @param emailOtp Email OTP code
 * @param phoneOtp Phone OTP code
 * @param leadReference Optional lead reference for lead tracking
 * @param emailToken Optional email token for lead verification
 * @returns Promise with verification response
 */
export const verifyOtp = async (
  requestId: string,
  emailOtp: string,
  phoneOtp: string,
  leadReference?: string,
  emailToken?: string
): Promise<VerifyOtpResponse> => {
  try {
    console.log('Verifying OTP with:', { request_id: requestId, email_otp: emailOtp, phone_otp: phoneOtp });
    
    const response = await axios.post<VerifyOtpResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.register.register_both_contacts.verify_both_contacts`,
      {
        request_id: requestId,
        email_otp: emailOtp,
        phone_otp: phoneOtp,
        ...(leadReference && { lead_reference: leadReference }),
        ...(emailToken && { email_token: emailToken })
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('OTP verification response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('OTP verification error:', error.response?.data || error.message || error);
    throw error;
  }
};
