// Resume API functions for job applicants
import axios from "axios";

// Base URL for API calls
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://skillglobedev.m.frappe.cloud";

/**
 * Get authentication data from local storage
 * @returns Object containing entity ID, API key, and API secret
 */
export const getAuthData = () => {
  if (typeof window !== "undefined") {
    try {
      // Get entity data from localStorage
      const entityDataStr = localStorage.getItem("entity_data");
      const entityData = entityDataStr ? JSON.parse(entityDataStr) : {};

      // Get API credentials from localStorage
      const apiKey = localStorage.getItem("auth_api_key");
      const apiSecret = localStorage.getItem("auth_api_secret");

      // If we don't have the API credentials in localStorage, try to get them from auth-storage
      if (!apiKey || !apiSecret) {
        const authString = localStorage.getItem("auth-storage");

        if (authString) {
          const authStorage = JSON.parse(authString);
          const state = authStorage.state;

          return {
            entityId: entityData.entity_id || state?.entityId,
            apiKey: state?.apiKey,
            apiSecret: state?.apiSecret,
          };
        }
      }

      return {
        entityId: entityData.entity_id,
        apiKey,
        apiSecret,
      };
    } catch (error) {
      console.error("Error getting auth data:", error);
      return null;
    }
  }
  return null;
};

// Interface for resume request
export interface ResumeRequest {
  role_based_profile: string;
}

// Interface for education
export interface Education {
  university_board: string | null;
  year_of_completion: number;
  stream: string;
}

// Interface for work experience
export interface WorkExperience {
  designation: string;
  company: string;
}

// Interface for skills
export interface Skill {
  skill: string;
  skill_name: string;
}

// Interface for portfolio data
export interface Portfolio {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  city: string;
  country: string;
  linkedin_profile: string;
  facebook_profile: string;
  twitter_handle: string;
  instagram_handle: string;
  github_profile?: string;
  website?: string;
  professional_summary: string;
  education: Education[];
  work_experience: WorkExperience[];
}

// Interface for role based profile
export interface RoleBasedProfile {
  name: string;
  role: string;
  desired_job_role: string | null;
  space: string;
  industry: string | null;
  career_level: string | null;
  employment_type: string;
  nature_of_work: string;
  work_mode: string;
  relevant_experience: number;
  total_experience_years: string;
  certifications: string | null;
  primary_skills: Skill[];
  secondary_skills: Skill[];
}

// Interface for resume response data
export interface ResumeData {
  portfolio: Portfolio;
  role_based_profile: RoleBasedProfile;
}

// Interface for resume response
export interface ResumeResponse {
  message: {
    status: string;
    message: string;
    data: ResumeData;
    timestamp: string;
  };
}

export const getResumeForBuyer = async (
  roleBasedProfile: string,
  apiKey: string,
  apiSecret: string
): Promise<ResumeResponse> => {
  try {
    console.log("Fetching resume for role based profile:", roleBasedProfile);

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    const response = await axios.get<ResumeResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.opportunity_posting.dashboard.resume_for_buyer?role_based_profile=${roleBasedProfile}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: authHeader,
        },
      }
    );

    console.log("Resume response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Resume fetch error:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};
