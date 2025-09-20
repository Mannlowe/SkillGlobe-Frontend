import { create } from 'zustand';
import { addJobPosting, getAuthData, JobPostingData, AddJobPostingResponse } from '@/app/api/job postings/addjobPosting';

// Interface for job posting form data
export interface JobPostingFormData {
  title: string;
  skillCategory: string;
  opportunityType: string;
  employmentType: string;
  workMode: string;
  experienceRequired: string;
  minRemuneration: string;
  applicationDeadline: string;
  opportunityClosed: boolean;
  numberOfOpenings: string;
  description: string;
  primarySkills: string[];
  secondarySkills: string[];
  preferredQualifications: string;
  location: string[];
  gender: string[];
  language: string[];
  visibilitySettings: string;
  anticipatedApplications: string;
  documents: any[];
}

// Interface for job posting store state
interface JobPostingState {
  // State
  isSubmitting: boolean;
  submitProgress: number;
  submitSuccess: boolean;
  submitError: string | null;
  
  // Actions
  submitJobPosting: (formData: JobPostingFormData) => Promise<AddJobPostingResponse | null>;
  resetSubmitState: () => void;
}

// Create Zustand store
export const useJobPostingStore = create<JobPostingState>((set, get) => ({
  // Initial state
  isSubmitting: false,
  submitProgress: 0,
  submitSuccess: false,
  submitError: null,
  
  // Actions
  submitJobPosting: async (formData: JobPostingFormData) => {
    set({ isSubmitting: true, submitProgress: 0, submitError: null, submitSuccess: false });
    
    try {
      // Get auth data
      const authData = getAuthData();
      
      if (!authData) {
        throw new Error('Authentication data not available');
      }
      
      // Validate required fields
      if (!formData.title || !formData.skillCategory || !formData.description || !formData.location || !formData.applicationDeadline) {
        throw new Error('Please fill in all required fields');
      }

      // Ensure we have at least one skill
      const allSkills = [...formData.primarySkills, ...formData.secondarySkills];
      if (allSkills.length === 0) {
        throw new Error('Please select at least one primary skill');
      }

      // Map skill category to API expected values
      const getSkillCategoryValue = (category: string) => {
        const categoryMap: { [key: string]: string } = {
          'frontend': 'Service',
          'backend': 'Service', 
          'fullstack': 'Service',
          'mobile': 'Service',
          'devops': 'Service',
          'data': 'Service',
          'design': 'Service',
          'product': 'Service',
          'marketing': 'Service',
          'sales': 'Service'
        };
        return categoryMap[category] || 'Service';
      };

      // Convert visibility settings to proper apply_opportunity value
      const getApplyOpportunityValue = (visibilitySettings: string) => {
        const visibilityMap: { [key: string]: string } = {
          'all': 'All verified users',
          'skill-matched': 'Skill-matched profiles only (AI-recommended)',
          'location-matched': 'Location-matched only',
          'private': 'Private (shared via link or invite only)',
          'remuneration-matched': 'Remuneration match only',
          'availability-matched': 'Availability match only'
        };
        return visibilityMap[visibilitySettings] || 'All verified users';
      };

      // Format skills arrays as JSON strings for form-data
      const formatSkillsForAPI = (skills: string[]) => {
        if (skills.length === 0) return '';
        console.log('Formatting skills for API:', skills);
        return JSON.stringify(skills.map(skill => ({ skill })));
      };

      // Format location as required by the API (list of dictionaries with city information)
      const formatLocationForAPI = (locationArray: string[]) => {
        if (!locationArray || locationArray.length === 0) return '';
        return JSON.stringify(locationArray.map(city => ({ city })));
      };

      // Get the first document file if available
      const jobDescriptionFile = formData.documents.length > 0 ? formData.documents[0] : undefined;

      // Map form data to API format - matching exact payload structure from requirements
      const jobData: JobPostingData = {
        entity_id: authData.entityId,
        name: `OP${Date.now().toString().slice(-6)}`, // Generate opportunity name
        opportunity_title: formData.title,
        role_skill_category: formData.skillCategory,
        opportunity_type: formData.opportunityType,
        employment_type: formData.employmentType,
        work_mode: formData.workMode,
        experience_required: formData.experienceRequired,
        apply_opportunity: getApplyOpportunityValue(formData.visibilitySettings),
        country: 'India',
        location: formatLocationForAPI(formData.location),
        min_remuneration: formData.minRemuneration || '0',
        application_deadline: formData.applicationDeadline,
        opportunity_closed: formData.opportunityClosed ? 1 : 0,
        number_of_openings: parseInt(formData.numberOfOpenings) || 1,
        description: formData.description,
        primary_skills: formatSkillsForAPI(formData.primarySkills),
        secondary_skills: formatSkillsForAPI(formData.secondarySkills),
        preferred_qualifications: formData.preferredQualifications || '',
        job_description: jobDescriptionFile
      };

      console.log('Submitting job data:', jobData);
      
      // Submit job posting
      const response = await addJobPosting(jobData, authData.apiKey, authData.apiSecret);
      
      // Update state
      set({ isSubmitting: false, submitSuccess: true });
      
      return response;
    } catch (error: any) {
      // Extract proper error message from API response
      let errorMessage = 'Failed to submit job posting';
      
      if (error.response?.data?.message) {
        if (typeof error.response.data.message === 'string') {
          errorMessage = error.response.data.message;
        } else if (error.response.data.message.message) {
          errorMessage = error.response.data.message.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Update state on error
      set({ 
        isSubmitting: false, 
        submitError: errorMessage
      });
      
      return null;
    }
  },
  
  resetSubmitState: () => {
    set({
      isSubmitting: false,
      submitProgress: 0,
      submitSuccess: false,
      submitError: null
    });
  }
}));