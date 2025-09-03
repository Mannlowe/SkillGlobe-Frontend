import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for job posting data
export interface JobPostingData {
  entity_id: string;
  name: string;
  opportunity_title: string;
  role_skill_category: string;
  opportunity_type: string;
  employment_type: string;
  work_mode: string;
  experience_required: string;
  apply_opportunity: string;
  country: string;
  location: string;
  min_remuneration: string;
  application_deadline: string;
  opportunity_closed: number;
  number_of_openings: number;
  description: string;
  primary_skills: string;
  secondary_skills: string;
  preferred_qualifications: string;
  job_description?: File;
}

// Interface for add job posting response
export interface AddJobPostingResponse {
  message: {
    status: string;
    data?: any;
    message?: string;
  };
}

export const addJobPosting = async (
  jobData: JobPostingData,
  apiKey: string,
  apiSecret: string
): Promise<AddJobPostingResponse> => {
  try {
    console.log('Adding job posting with data:', jobData);
    console.log('API URL:', `${API_BASE_URL}/api/method/skillglobe_be.api.opportunity_posting.form.create_or_update_opportunity_posting`);
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    console.log('Auth header created (key length):', apiKey?.length);
    
    // Create FormData
    const formData = new FormData();
    
    // Add all form fields
    formData.append('entity_id', jobData.entity_id);
    formData.append('name', jobData.name);
    formData.append('opportunity_title', jobData.opportunity_title);
    formData.append('role_skill_category', jobData.role_skill_category);
    formData.append('opportunity_type', jobData.opportunity_type);
    formData.append('employment_type', jobData.employment_type);
    formData.append('work_mode', jobData.work_mode);
    formData.append('experience_required', jobData.experience_required);
    formData.append('apply_opportunity', jobData.apply_opportunity);
    formData.append('country', jobData.country);
    formData.append('location', jobData.location);
    formData.append('min_remuneration', jobData.min_remuneration);
    formData.append('application_deadline', jobData.application_deadline);
    formData.append('opportunity_closed', jobData.opportunity_closed.toString());
    formData.append('number_of_openings', jobData.number_of_openings.toString());
    formData.append('description', jobData.description);
    formData.append('primary_skills', jobData.primary_skills);
    formData.append('secondary_skills', jobData.secondary_skills);
    formData.append('preferred_qualifications', jobData.preferred_qualifications);
    
    // Add file if provided
    if (jobData.job_description) {
      formData.append('job_description', jobData.job_description);
    }
    
    const response = await axios.post<AddJobPostingResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.opportunity_posting.form.create_or_update_opportunity_posting`,
      formData,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json'
          // Note: Don't set Content-Type for FormData, let axios handle it
        }
      }
    );
    
    console.log('Add job posting response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Add job posting error details:');
    throw error;
  }
};

// Interface for skill data
export interface Skill {
  name: string;
  canonical_name: string;
  skill_id?: string;
}
// Interface for skills API response
export interface SkillsResponse {
  message: {
    status: string;
    data?: Skill[];
    message?: string;
  };
}
// Function to fetch skills from API with search functionality
export const getSkills = async (
  searchTerm: string = '',
  apiKey: string,
  apiSecret: string
): Promise<Skill[]> => {
  try {
    console.log('Fetching skills with search term:', searchTerm);
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    // Build URL with search parameter if provided
    let url = `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.skill.global_skills?limit_start=0&limit_page_length=5000`;
    if (searchTerm.trim()) {
      url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }
    
    const response = await axios.get<SkillsResponse>(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Skills API response:', response.data);
    
    if (response.data.message.status === 'success' && response.data.message.data) {
      return response.data.message.data;
    }
    
    return [];
  } catch (error: any) {
    console.error('Skills API error details:');
    return [];
  }
};

// Interface for apply opportunities API response
export interface ApplyOpportunitiesResponse {
  message: {
    status: string;
    message?: string;
    data?: {
      apply_opportunities: string[];
    };
    timestamp?: string;
  };
}

// Function to fetch apply opportunities from API
export const getApplyOpportunities = async (
  apiKey: string,
  apiSecret: string
): Promise<string[]> => {
  try {
    console.log('Fetching apply opportunities');
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    const response = await axios.get<ApplyOpportunitiesResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.opportunity_posting.form.get_apply_opportunities`,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Apply opportunities API response:', response.data);
    
    if (response.data.message.status === 'success' && response.data.message.data?.apply_opportunities) {
      return response.data.message.data.apply_opportunities;
    }
    
    return [];
  } catch (error: any) {
    console.error('Apply opportunities API error details:');
    return [];
  }
};

export const getAuthData = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    // Get auth data from individual localStorage items
    const apiKey = localStorage.getItem('auth_api_key');
    const apiSecret = localStorage.getItem('auth_api_secret');
    
    // Get entity ID from entity_data
    let entityId = '';
    const entityDataStr = localStorage.getItem('entity_data');
    if (entityDataStr) {
      const entityData = JSON.parse(entityDataStr);
      if (entityData && entityData.details && entityData.details.entity_id) {
        entityId = entityData.details.entity_id;
      }
    }
    
    // Check if we have all required data
    if (!apiKey || !apiSecret || !entityId) {
      console.log('Missing auth data:', { hasApiKey: !!apiKey, hasApiSecret: !!apiSecret, hasEntityId: !!entityId });
      return null;
    }
    
    return {
      apiKey,
      apiSecret,
      entityId
    };
  } catch (error) {
    console.error('Error getting auth data from localStorage:', error);
    return null;
  }
};