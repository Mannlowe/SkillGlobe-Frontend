import { create } from 'zustand';
import { updatePersonalInfo, getAuthData, PersonalInfoData } from '@/app/api/portfolio/personalInfo';

interface PersonalInfoState {
  personalInfo: PersonalInfoData | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  submitError: string | null;
  fetchPersonalInfo: () => Promise<void>;
  updatePersonalInfo: (data: Partial<PersonalInfoData>) => Promise<boolean>;
  resetState: () => void;
}

export const usePersonalInfoStore = create<PersonalInfoState>((set, get) => ({
  personalInfo: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  submitError: null,
  
  fetchPersonalInfo: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Get auth data
      const authData = getAuthData();
      if (!authData) {
        set({ isLoading: false, error: 'Authentication data not found' });
        return;
      }
      
      // Note: The API endpoint for fetching personal info no longer exists
      // Instead, we'll initialize with empty values or fetch from another source if available
      const personalInfo: PersonalInfoData = {
        entity_id: authData.entityId,
        first_name: '',
        last_name: '',
        email: '',
        mobile_no: '',
        gender: '',
        date_of_birth: '',
        nationality: '',
        country: '',
        city: '',
        landmark: '',
        pincode: '',
        current_address: '',
        permanent_address: '',
        twitter_handle: '',
        linkedin_profile: '',
        instagram_handle: '',
        website: '',
        employment_status: '',
        total_experience: '',
        last_working_day: '',
        professional_summary: ''
      };
      
      set({ personalInfo, isLoading: false });
    } catch (error: any) {
      console.error('Error initializing personal info:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to initialize personal information' 
      });
    }
  },
  
  updatePersonalInfo: async (data: Partial<PersonalInfoData>) => {
    set({ isSubmitting: true, submitError: null });
    
    try {
      // Get auth data
      const authData = getAuthData();
      if (!authData) {
        set({ isSubmitting: false, submitError: 'Authentication data not found' });
        return false;
      }
      
      // Prepare data for API
      const currentData = get().personalInfo || {
        first_name: '',
        last_name: '',
        email: '',
        mobile_no: '',
        phone: '',
        gender: '',
        date_of_birth: '',
        nationality: '',
        country: '',
        city: '',
        landmark: '',
        pincode: '',
        current_address: '',
        permanent_address: '',
        twitter_handle: '',
        linkedin_profile: '',
        instagram_handle: '',
        website: '',
        employment_status: '',
        total_experience: '',
        last_working_day: '',
        professional_summary: ''
      };
      
      const personalInfoData: PersonalInfoData = {
        entity_id: authData.entityId,
        first_name: data.first_name || currentData.first_name || '',
        last_name: data.last_name || currentData.last_name || '',
        mobile_no: data.mobile_no || currentData.mobile_no || '',
        email: data.email || currentData.email || '',
        gender: data.gender || currentData.gender || '',
        date_of_birth: data.date_of_birth || currentData.date_of_birth || '',
        nationality: data.nationality || currentData.nationality || '',
        country: data.country || currentData.country || '',
city: data.city || currentData.city || '',
landmark: data.landmark || currentData.landmark || '',
        pincode: data.pincode || currentData.pincode || '',
        current_address: data.current_address || currentData.current_address || '',
        permanent_address: data.permanent_address || currentData.permanent_address || '',
        twitter_handle: data.twitter_handle || currentData.twitter_handle || '',
        linkedin_profile: data.linkedin_profile || currentData.linkedin_profile || '',
        instagram_handle: data.instagram_handle || currentData.instagram_handle || '',
        website: data.website || currentData.website || '',
        employment_status: data.employment_status || currentData.employment_status || '',
        total_experience: data.total_experience || currentData.total_experience || '',
        last_working_day: data.last_working_day || currentData.last_working_day || '',
        professional_summary: data.professional_summary || currentData.professional_summary || ''
      };
      
      // Call API
      const response = await updatePersonalInfo(personalInfoData, authData.apiKey, authData.apiSecret);
      
      // Update state with new data
      set({ 
        personalInfo: personalInfoData,
        isSubmitting: false 
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating personal info:', error);
      set({ 
        isSubmitting: false, 
        submitError: error.message || 'Failed to update personal information' 
      });
      return false;
    }
  },
  
  resetState: () => {
    set({
      personalInfo: null,
      isLoading: false,
      isSubmitting: false,
      error: null,
      submitError: null
    });
  }
}));
