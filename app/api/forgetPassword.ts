// Forget Password API functions
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for forget password request
interface ForgetPasswordRequest {
  usr: string;
}

// Interface for verify OTP request
interface VerifyOtpRequest {
  usr: string;
  otp: string;
  otp_id: string;
}

// Interface for forget password response
export interface ForgetPasswordResponse {
  message: {
    status: string;
    message: string;
    data: Record<string, any>;
    timestamp: string;
    otp_id: string;
    expires_in: number;
  };
}

// Interface for verify OTP response
export interface VerifyOtpResponse {
  message: {
    status: string;
    message: string;
    data: Record<string, any>;
    timestamp: string;
  };
}

// Interface for reset password response
export interface ResetPasswordResponse {
  message: {
    status: string;
    message: string;
    data: Record<string, any>;
    timestamp: string;
  };
}

export const sendResetPasswordEmail = async (email: string): Promise<ForgetPasswordResponse> => {
  try {
    console.log('Sending reset password email to:', { usr: email });
    
    const response = await axios.post<ForgetPasswordResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.auth.reset_password.send_reset_password_email`,
      {
        usr: email
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Reset password email response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Reset password email error:', error.response?.data || error.message || error);
    throw error;
  }
};

export const verifyResetPasswordOtp = async (email: string, otp: string, otpId: string): Promise<VerifyOtpResponse> => {
  try {
    console.log('Verifying reset password OTP:', { usr: email, otp, otp_id: otpId });
    
    const response = await axios.post<VerifyOtpResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.auth.reset_password.verify_reset_password_otp`,
      {
        usr: email,
        otp: otp,
        otp_id: otpId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Verify OTP response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Verify OTP error:', error.response?.data || error.message || error);
    throw error;
  }
};

export const resetPassword = async (email: string, newPassword: string, otpId: string): Promise<ResetPasswordResponse> => {
  try {
    console.log('Resetting password for:', { usr: email, otp_id: otpId });
    
    const response = await axios.post<ResetPasswordResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.auth.reset_password.reset_password`,
      {
        usr: email,
        new_password: newPassword,
        otp_id: otpId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Reset password response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Reset password error:', error.response?.data || error.message || error);
    throw error;
  }
};
