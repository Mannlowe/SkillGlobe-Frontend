import { create } from 'zustand';
import {
  updateBusinessDetails,
  BusinessDetailsRequest,
  BusinessDetailsResponse
} from '../app/api/registration/businessDetails';
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
      set({
        isLoading: false,
        error: err.message || 'Failed to update business details'
      });
      throw err;
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
