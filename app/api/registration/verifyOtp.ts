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
    email_verified: number; // API returns 0 or 1 instead of boolean
    phone_verified: number; // API returns 0 or 1 instead of boolean
    registration_step: string;
    is_complete: boolean;
    email_verification_id?: string;
    phone_verification_id?: string;
    email_error?: string;
    email_error_code?: string;
    phone_error?: string;
    phone_error_code?: string;
  };
}

// Interface for resend OTP request
export interface ResendOtpRequest {
  otp_id: string;
}

// Interface for resend OTP response
export interface ResendOtpResponse {
  message: {
    status: string;
    message: string;
    data: Record<string, any>;
    timestamp: string;
  };
}

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

export const resendOtp = async (otpId: string): Promise<ResendOtpResponse> => {
  try {
    console.log('Resending OTP with ID:', otpId);
    
    const response = await axios.post<ResendOtpResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.skillglobe_backend.api.otp.resend_otp`,
      {
        otp_id: otpId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Resend OTP response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Resend OTP error:', error.response?.data || error.message || error);
    throw error;
  }
};
