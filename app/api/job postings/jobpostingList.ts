import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Helper function to get API key and secret from localStorage
const getApiCredentials = (): { apiKey: string | null; apiSecret: string | null } => {
  if (typeof window !== 'undefined') {
    const apiKey = localStorage.getItem('auth_api_key');
    const apiSecret = localStorage.getItem('auth_api_secret');
    
    return { apiKey, apiSecret };
  }
  return { apiKey: null, apiSecret: null };
};

// Interface for job posting
export interface JobPosting {
  name: string;
  opportunity_title: string;
  role_skill_category: string;
  employment_type: string;
  work_mode: string;
  experience_required: string;
  location: string | null;
  created_date?: string;
  application_deadline?: string;
  application_count?: number;
  status?: string;
}

// Interface for job posting list response
export interface JobPostingListResponse {
  message: {
    status: string;
    message: string;
    data: {
      opportunity_posting: JobPosting[];
      entity_id: string;
    };
    timestamp: string;
  };
}

export const getJobPostingList = async (entityId: string): Promise<JobPostingListResponse> => {
  try {
    // Get API credentials
    const { apiKey, apiSecret } = getApiCredentials();
    
    // Create authorization header using API key and secret
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    const response = await axios.get<JobPostingListResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.opportunity_posting.list.get_job_posting_list?entity_id=${entityId}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader
        }
      }
    );
    
    console.log('Job posting list response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Job posting list error:', error.response?.data || error.message || error);
    throw error;
  }
};
