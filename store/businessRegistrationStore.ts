import { create } from 'zustand';
import {
  updateBusinessDetails,
  BusinessDetailsRequest,
  BusinessDetailsResponse
} from '../app/api/registration/businessDetails';
import { resendOtp } from '../app/api/registration/verifyOtp';
import { useRegistrationStore } from './registration';

export interface BusinessRegistrationState {
  requestId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string | null;
  emailVerificationId: string | null;
  phoneVerificationId: string | null;
  registrationStep: string | null;

  setRequestId: (requestId: string) => void;
  updateBusinessData: (data: Partial<BusinessRegistrationState>) => void;
  submitBusinessDetails: () => Promise<BusinessDetailsResponse>;
  resendEmailOtp: () => Promise<void>;
  resendPhoneOtp: () => Promise<void>;
  clearError: () => void;
  resetBusinessRegistration: () => void;
}

export const useBusinessRegistrationStore = create<BusinessRegistrationState>((set, get) => ({
  requestId: '',
  businessName: '',
  businessEmail: '',
  businessPhone: '',
  contactPersonName: '',
  contactPersonEmail: '',
  contactPersonPhone: '',
  password: '',
  confirmPassword: '',
  isLoading: false,
  error: null,
  emailVerificationId: null,
  phoneVerificationId: null,
  registrationStep: null,

  setRequestId: (requestId: string) => set({ requestId }),

  updateBusinessData: (data) => set({ ...data }),

  clearError: () => set({ error: null }),

  submitBusinessDetails: async () => {
    set({ isLoading: true, error: null });

    try {
      const state = get();
      const { request_id } = useRegistrationStore.getState();

      if (!request_id) {
        throw new Error('Registration ID not found. Please start registration first.');
      }

      const payload: BusinessDetailsRequest = {
        request_id,
        business_name: state.businessName,
        business_email: state.businessEmail,
        business_phone: state.businessPhone,
        contact_person_name: state.contactPersonName,
        contact_person_email: state.contactPersonEmail,
        contact_person_phone: state.contactPersonPhone,
        password: state.password
      };

      const response = await updateBusinessDetails(payload);

      set({
        isLoading: false,
        requestId: request_id,
        emailVerificationId: response.message.email_verification_id,
        phoneVerificationId: response.message.phone_verification_id,
        registrationStep: response.message.registration_step
      });

      return response;
    } catch (err: any) {
      console.log('Error in submitBusinessDetails:', err);
      
      // Just pass through the error message directly
      // The API layer has already formatted the error message appropriately
      const errorMessage = err.message || 'Failed to update business details';
      
      set({
        isLoading: false,
        error: errorMessage
      });
      
      // Re-throw the same error without wrapping it in a new Error object
      throw err;
    }
  },

  resendEmailOtp: async () => {
    const state = get();
    
    if (!state.emailVerificationId) {
      throw new Error('Email verification ID not found. Please complete business details first.');
    }

    try {
      await resendOtp(state.emailVerificationId);
      console.log('Email OTP resent successfully for business registration');
    } catch (error: any) {
      console.error('Error resending email OTP for business:', error);
      throw new Error(error.response?.data?.message || 'Failed to resend email OTP');
    }
  },

  resendPhoneOtp: async () => {
    const state = get();
    
    if (!state.phoneVerificationId) {
      throw new Error('Phone verification ID not found. Please complete business details first.');
    }

    try {
      await resendOtp(state.phoneVerificationId);
      console.log('Phone OTP resent successfully for business registration');
    } catch (error: any) {
      console.error('Error resending phone OTP for business:', error);
      throw new Error(error.response?.data?.message || 'Failed to resend phone OTP');
    }
  },

  resetBusinessRegistration: () =>
    set({
      businessName: '',
      businessEmail: '',
      businessPhone: '',
      contactPersonName: '',
      contactPersonEmail: '',
      contactPersonPhone: '',
      password: '',
      confirmPassword: '',
      isLoading: false,
      error: null,
      emailVerificationId: null,
      phoneVerificationId: null,
      registrationStep: null
    })
}));
