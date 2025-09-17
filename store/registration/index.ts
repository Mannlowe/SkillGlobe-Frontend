// Registration store for managing registration state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startRegistration } from '@/app/api/registration/userType';
import { updatePersonalDetails } from '@/app/api/registration/personalDetails';
import { verifyOtp } from '@/app/api/registration/verifyOtp';
import { completeRegistration } from '@/app/api/registration/completeRegistration';

// Registration state interface
interface RegistrationState {
  // User type selection
  userType: 'individual' | 'business' | null;
  entityType: 'Individual' | 'Business' | null;
  entityCategory: 'Buyer' | 'Seller' | 'Enhancer' | null;
  request_id: string | null;
  
  // Lead parameters
  leadReference: string | null;
  emailToken: string | null;
  
  // Personal details
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  
  // OTP verification
  emailOtp: string;
  phoneOtp: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isRegistrationComplete: boolean;
  
  // User email and entity ID after registration
  userEmail: string | null;
  entityId: string | null;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUserType: (userType: 'individual' | 'business') => Promise<void>;
  setEntityCategory: (category: 'Buyer' | 'Seller' | 'Enhancer') => void;
  setLeadParameters: (leadReference: string | null, emailToken: string | null) => void;
  initializeWithLead: (userType: 'individual' | 'business', leadReference: string, emailToken: string) => Promise<void>;
  updatePersonalDetails: (firstName: string, lastName: string, email: string, mobile: string, password: string) => Promise<any>;
  verifyOtpCodes: (emailOtp: string, phoneOtp: string) => Promise<any>;
  completeRegistration: (agreed?: number) => Promise<any>;
  resetRegistration: () => void;
}

// Create registration store
export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      // Initial state
      userType: null,
      entityType: null,
      entityCategory: null,
      request_id: null,
      leadReference: null,
      emailToken: null,
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      emailOtp: '',
      phoneOtp: '',
      isEmailVerified: false,
      isPhoneVerified: false,
      isRegistrationComplete: false,
      userEmail: null,
      entityId: null,
      isLoading: false,
      error: null,
      
      // Set user type and start registration
      setUserType: async (userType: 'individual' | 'business') => {
        set({ isLoading: true, error: null });
        
        try {
          // Convert userType to the format expected by the API
          const entityType = userType === 'individual' ? 'Individual' : 'Business';

          // Individual users are 'Seller' by default
          // Business users are 'Buyer' by default
          const entityCategory = userType === 'individual' ? 'Seller' : 'Buyer';
          
          const { leadReference, emailToken } = get();
          const response = await startRegistration(entityType, entityCategory, leadReference || undefined, emailToken || undefined);
          
          // Update state with response data
          set({
            userType,
            entityType,
            entityCategory,
            request_id: response.message?.request_id || null,
            isLoading: false
          });
        } catch (error: any) {
          console.error('Registration error:', error);
          set({
            error: 'Failed to start registration. Please try again.',
            isLoading: false
          });
        }
      },
      
      // Set entity category
      setEntityCategory: (category: 'Buyer' | 'Seller' | 'Enhancer') => {
        set({ entityCategory: category });
      },
      
      // Set lead parameters
      setLeadParameters: (leadReference: string | null, emailToken: string | null) => {
        set({ leadReference, emailToken });
      },
      
      // Initialize registration with lead parameters (skip user type selection)
      initializeWithLead: async (userType: 'individual' | 'business', leadReference: string, emailToken: string) => {
        set({ isLoading: true, error: null, leadReference, emailToken });
        
        try {
          // Convert userType to the format expected by the API
          const entityType = userType === 'individual' ? 'Individual' : 'Business';
          const entityCategory = userType === 'individual' ? 'Seller' : 'Buyer';
          
          const response = await startRegistration(entityType, entityCategory, leadReference, emailToken);
          
          // Update state with response data
          set({
            userType,
            entityType,
            entityCategory,
            request_id: response.message?.request_id || null,
            isLoading: false
          });
        } catch (error: any) {
          console.error('Lead registration error:', error);
          set({
            error: 'Failed to start lead registration. Please try again.',
            isLoading: false
          });
        }
      },
      
      // Update personal details
      updatePersonalDetails: async (firstName: string, lastName: string, email: string, mobile: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { request_id } = get();
          
          if (!request_id) {
            throw new Error('Registration ID not found. Please start registration first.');
          }
          
          // Combine first and last name for the API
          const fullName = `${firstName} ${lastName}`.trim();
          
          // Get lead parameters
          const { leadReference, emailToken } = get();
          
          // Call the API to update personal details
          const response = await updatePersonalDetails(
            request_id,
            email,
            mobile,
            fullName,
            password,
            leadReference || undefined,
            emailToken || undefined
          );
          
          // Update state with response data
          set({
            firstName,
            lastName,
            email,
            mobile,
            password,
            isLoading: false
          });
          
          return response as any;
        } catch (error: any) {
          console.error('Personal details update error:', error);
          set({
            error: 'This email ID or phone number already exists.',
            isLoading: false
          });
          throw error;
        }
      },
      
      // Verify OTP codes
      verifyOtpCodes: async (emailOtp: string, phoneOtp: string) => {
        set({ isLoading: true, error: null, emailOtp, phoneOtp });
        
        try {
          const { request_id } = get();
          
          if (!request_id) {
            throw new Error('Registration ID not found. Please start registration first.');
          }
          
          // Get lead parameters
          const { leadReference, emailToken } = get();
          
          // Call the API to verify OTP codes
          const response = await verifyOtp(
            request_id,
            emailOtp,
            phoneOtp,
            leadReference || undefined,
            emailToken || undefined
          );
          
          // Update state with response data
          set({
            isEmailVerified: response.message.email_verified,
            isPhoneVerified: response.message.phone_verified,
            isRegistrationComplete: response.message.is_complete,
            isLoading: false
          });
          
          return response as any;
        } catch (error: any) {
          console.error('OTP verification error:', error);
          set({
            error: 'Failed to verify OTP codes. Please try again.',
            isLoading: false
          });
          throw error;
        }
      },
      
      // Complete registration
      completeRegistration: async (agreed: number = 1) => {
        set({ isLoading: true, error: null });
        
        try {
          const { request_id, password } = get();
          
          if (!request_id) {
            throw new Error('Registration ID not found. Please start registration first.');
          }
          
          if (!password) {
            throw new Error('Password not found. Please complete the personal details step first.');
          }
          
          // Get lead parameters
          const { leadReference, emailToken } = get();
          
          // Call the API to complete registration
          const response = await completeRegistration(
            request_id,
            password,
            agreed,
            leadReference || undefined,
            emailToken || undefined
          );
          
          // Update state with response data
          set({
            isRegistrationComplete: true,
            userEmail: response.message.user_email,
            entityId: response.message.entity_id,
            isLoading: false
          });
          
          return response as any;
        } catch (error: any) {
          console.error('Complete registration error:', error);
          set({
            error: 'Failed to complete registration. Please try again.',
            isLoading: false
          });
          throw error;
        }
      },
      
      // Reset registration state
      resetRegistration: () => {
        set({
          userType: null,
          entityType: null,
          entityCategory: null,
          request_id: null,
          leadReference: null,
          emailToken: null,
          firstName: '',
          lastName: '',
          email: '',
          mobile: '',
          password: '',
          emailOtp: '',
          phoneOtp: '',
          isEmailVerified: false,
          isPhoneVerified: false,
          isRegistrationComplete: false,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'registration-storage', // Name for localStorage
      partialize: (state) => ({
        userType: state.userType,
        entityType: state.entityType,
        entityCategory: state.entityCategory,
        request_id: state.request_id,
        leadReference: state.leadReference,
        emailToken: state.emailToken,
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        mobile: state.mobile
        // Intentionally not persisting password for security
      })
    }
  )
);
