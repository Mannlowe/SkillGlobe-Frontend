import { create } from 'zustand';
import { updatePersonalInfo, getPersonalInfo, getAuthData, PersonalInfoData } from '@/app/api/portfolio/personalInfo';

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
      
      // Fetch personal info
      const response = await getPersonalInfo(authData.entityId, authData.apiKey, authData.apiSecret);
      
      if (response && response.message && response.message.data) {
        // Map API response to our state format
        const apiData = response.message.data;
        
        const personalInfo: PersonalInfoData = {
          entity_id: authData.entityId,
          first_name: apiData.first_name || '',
          last_name: apiData.last_name || '',
          email: apiData.email || '',
          phone: apiData.phone || '',
          gender: apiData.gender || '',
          date_of_birth: apiData.date_of_birth || '',
          nationality: apiData.nationality || '',
          country: apiData.country || '',
          city: apiData.city || '',
          landmark: apiData.landmark || '',
          pincode: apiData.pincode || '',
          current_address: apiData.current_address || '',
          permanent_address: apiData.permanent_address || '',
          twitter_handle: apiData.twitter_handle || '',
          linkedin_profile: apiData.linkedin_profile || '',
          instagram_handle: apiData.instagram_handle || '',
          website: apiData.website || '',
          employment_status: apiData.employment_status || '',
          total_experience: apiData.total_experience || '',
          notice_period: apiData.notice_period || '',
          professional_summary: apiData.professional_summary || ''
        };
        
        set({ personalInfo, isLoading: false });
      } else {
        set({ isLoading: false, error: 'Invalid response format' });
      }
    } catch (error: any) {
      console.error('Error fetching personal info:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch personal information' 
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
        notice_period: '',
        professional_summary: ''
      };
      
      const personalInfoData: PersonalInfoData = {
        entity_id: authData.entityId,
        first_name: data.first_name || currentData.first_name || '',
        last_name: data.last_name || currentData.last_name || '',
        email: data.email || currentData.email || '',
        phone: data.phone || currentData.phone || '',
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
        notice_period: data.notice_period || currentData.notice_period || '',
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
