import { create } from 'zustand';
import { sendResetPasswordEmail, verifyResetPasswordOtp, resetPassword, ForgetPasswordResponse, VerifyOtpResponse, ResetPasswordResponse } from '../../app/api/forgetPassword';

interface ForgetPasswordState {
  email: string;
  otpId: string;
  expiresIn: number;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  otpVerified: boolean;
  passwordReset: boolean;
  sendResetPasswordEmail: (email: string) => Promise<{ success: boolean; otpId: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean }>;
  resetUserPassword: (newPassword: string) => Promise<{ success: boolean }>;
  setEmail: (email: string) => void;
  resetState: () => void;
}

export const useForgetPasswordStore = create<ForgetPasswordState>((set) => ({
  email: '',
  otpId: '',
  expiresIn: 0,
  isLoading: false,
  error: null,
  success: false,
  otpVerified: false,
  passwordReset: false,
  
  sendResetPasswordEmail: async (email: string) => {
    set({ isLoading: true, error: null, success: false });
    try {
      const response = await sendResetPasswordEmail(email);
      
      console.log('Forget password store received response:', response);
      
      // Check if the response has the expected structure
      if (!response.message || !response.message.otp_id) {
        throw new Error('Invalid response format from server');
      }
      
      // Update state with response data
      set({
        email,
        otpId: response.message.otp_id,
        expiresIn: response.message.expires_in,
        isLoading: false,
        error: null,
        success: true
      });
      
      return { success: true, otpId: response.message.otp_id };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.message || error.message || 'Failed to send reset password email';
      set({ isLoading: false, error: errorMessage, success: false });
      return { success: false, otpId: '' };
    }
  },
  
  verifyOtp: async (otp: string) => {
    const { email, otpId } = useForgetPasswordStore.getState();
    
    if (!email || !otpId) {
      set({ error: 'Missing email or OTP ID. Please start the process again.', isLoading: false });
      return { success: false };
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await verifyResetPasswordOtp(email, otp, otpId);
      
      console.log('OTP verification response:', response);
      
      // Check if the response indicates success
      if (response.message && response.message.status === 'success') {
        set({
          isLoading: false,
          error: null,
          otpVerified: true
        });
        return { success: true };
      } else {
        const errorMsg = response.message?.message || 'Failed to verify OTP';
        set({ isLoading: false, error: errorMsg, otpVerified: false });
        return { success: false };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.message || error.message || 'Failed to verify OTP';
      set({ isLoading: false, error: errorMessage, otpVerified: false });
      return { success: false };
    }
  },
  
  resetUserPassword: async (newPassword: string) => {
    const { email, otpId } = useForgetPasswordStore.getState();
    
    if (!email || !otpId) {
      set({ error: 'Missing email or OTP ID. Please start the process again.', isLoading: false });
      return { success: false };
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await resetPassword(email, newPassword, otpId);
      
      console.log('Reset password response:', response);
      
      // Check if the response indicates success
      if (response.message && response.message.status === 'success') {
        set({
          isLoading: false,
          error: null,
          passwordReset: true
        });
        return { success: true };
      } else {
        const errorMsg = response.message?.message || 'Failed to reset password';
        set({ isLoading: false, error: errorMsg, passwordReset: false });
        return { success: false };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.message || error.message || 'Failed to reset password';
      set({ isLoading: false, error: errorMessage, passwordReset: false });
      return { success: false };
    }
  },
  
  setEmail: (email: string) => set({ email }),
  
  resetState: () => set({
    email: '',
    otpId: '',
    expiresIn: 0,
    isLoading: false,
    error: null,
    success: false,
    otpVerified: false
  })
}));
