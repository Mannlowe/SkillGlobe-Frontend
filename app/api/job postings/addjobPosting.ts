import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for job posting data
export interface JobPostingData {
  entity_id: string;
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
  skills_required: Array<{ skill: string }>;
  preferred_qualifications: string;
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
    
    const response = await axios.post<AddJobPostingResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.opportunity_posting.form.create_or_update_opportunity_posting`,
      jobData,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Add job posting response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Add job posting error details:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Headers:', error.response?.headers);
    console.error('Full error:', error);
    throw error;
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