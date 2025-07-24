import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  updateBusinessDetails, 
  BusinessDetailsRequest, 
  BusinessDetailsResponse 
} from '../app/api/registration/businessDetails';
import { useRegistrationStore } from './registration';

interface BusinessRegistrationState {
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
  
  // Actions
  setRequestId: (requestId: string) => void;
  updateBusinessData: (data: Partial<BusinessRegistrationState>) => void;
  submitBusinessDetails: () => Promise<BusinessDetailsResponse>;
  resetBusinessRegistration: () => void;
}

export const useBusinessRegistrationStore = create<BusinessRegistrationState>()(
  persist(
    (set, get) => ({
      // Initial state
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
      
      // Actions
      setRequestId: (requestId: string) => set({ requestId }),
      
      updateBusinessData: (data: Partial<BusinessRegistrationState>) => set({ ...data }),
      
      submitBusinessDetails: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const state = get();
          
          // Get request_id from registration store
          const registrationState = useRegistrationStore.getState();
          const request_id = registrationState.request_id;
          
          if (!request_id) {
            throw new Error('Registration ID not found. Please start registration first.');
          }
          
          // Prepare request payload
          const payload: BusinessDetailsRequest = {
            request_id: request_id,
            business_name: state.businessName,
            business_email: state.businessEmail,
            business_phone: state.businessPhone,
            contact_person_name: state.contactPersonName,
            contact_person_email: state.contactPersonEmail,
            contact_person_phone: state.contactPersonPhone,
            password: state.password
          };
          
          console.log('Submitting business details with request_id:', request_id);
          
          // Call API
          const response = await updateBusinessDetails(payload);
          
          // Update state with response data
          set({
            isLoading: false,
            requestId: request_id, // Store the request_id from registration store
            emailVerificationId: response.message.email_verification_id,
            phoneVerificationId: response.message.phone_verification_id,
            registrationStep: response.message.registration_step
          });
          
          return response;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update business details'
          });
          throw error;
        }
      },
      
      resetBusinessRegistration: () => set({
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
    }),
    {
      name: 'business-registration-storage',
      partialize: (state: BusinessRegistrationState) => ({
        requestId: state.requestId,
        businessName: state.businessName,
        businessEmail: state.businessEmail,
        businessPhone: state.businessPhone,
        contactPersonName: state.contactPersonName,
        contactPersonEmail: state.contactPersonEmail,
        contactPersonPhone: state.contactPersonPhone,
        emailVerificationId: state.emailVerificationId,
        phoneVerificationId: state.phoneVerificationId,
        registrationStep: state.registrationStep
        // Intentionally not persisting password for security
      }),
      storage: createJSONStorage(() => localStorage)
    }
  )
);
