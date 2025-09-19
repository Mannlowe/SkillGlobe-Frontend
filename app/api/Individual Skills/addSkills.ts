import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for skill data - updated to match new API payload
export interface SkillData {
  skill: string;
  skill_name: string;
}

// Interface for add skills request - updated to match new API payload
export interface AddSkillsRequest {
  entity_id: string;
  skill: SkillData[];
}

// Interface for delete skill request
export interface DeleteSkillRequest {
  entity_id: string;
  name: string;
}

// Interface for add skills response
export interface AddSkillsResponse {
  message: {
    status: string;
    data?: any;
  };
}

// Interface for skill list response - updated to match actual API response
export interface SkillListResponse {
  message?: {
    status: string;
    message: string;
    data?: {
      portfolio?: string;
      entity_id?: string;
      skills_list?: Array<{
        name?: string;
        skill?: string;
        skill_name?: string;
      }>
    }
    timestamp?: string;
  };
  exception?: string;
  exc_type?: string;
  exc?: string;
  _server_messages?: string;
}

// Interface for skills by category response
export interface SkillsByCategoryResponse {
  message?: {
    status: string;
    message: string;
    data?: {
      [category: string]: string[];
    }
    timestamp?: string;
  };
  exception?: string;
  exc_type?: string;
  exc?: string;
  _server_messages?: string;
}

export const getSkillsByCategory = async (
  apiKey: string,
  apiSecret: string
): Promise<SkillsByCategoryResponse> => {
  try {
    console.log('Getting skills by category');

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    // Make API call - using GET method
    const response = await axios.get<SkillsByCategoryResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.skill.get_skills_by_category`,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Get skills by category response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get skills by category error:', error.response?.data || error.message || error);
    throw error;
  }
};


export const getSkillsList = async (
  entityId: string,
  apiKey: string,
  apiSecret: string
): Promise<SkillListResponse> => {
  try {
    console.log('Getting skills list for entity ID:', entityId);

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    // Make API call - using GET method
    const response = await axios.get<SkillListResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.skill.get_skills_list?entity_id=${entityId}`,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Get skills list response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get skills list error:', error.response?.data || error.message || error);
    throw error;
  }
};

export const addSkills = async (
  skillsData: AddSkillsRequest,
  apiKey: string,
  apiSecret: string
): Promise<AddSkillsResponse> => {
  try {
    console.log('Adding skills with entity ID:', skillsData.entity_id);
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    // Make API call
    const response = await axios.post<AddSkillsResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.skill.add_skills`,
      skillsData,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Add skills response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Add skills error:', error.response?.data || error.message || error);
    throw error;
  }
};

/**
 * Delete a skill from the user's portfolio
 * @param deleteData Object containing entity_id and name of the skill to delete
 * @param apiKey API key for authentication
 * @param apiSecret API secret for authentication
 * @returns API response
 */
export const deleteSkill = async (
  deleteData: DeleteSkillRequest,
  apiKey: string,
  apiSecret: string
): Promise<AddSkillsResponse> => {
  try {
    console.log('Deleting skill with name:', deleteData.name, 'for entity ID:', deleteData.entity_id);
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    // Make API call using DELETE method
    // For axios.delete, the data needs to be passed as a config object
    const response = await axios.delete<AddSkillsResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.skill.delete_skill`,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: deleteData // For DELETE requests, data is passed in the config object
      }
    );
    
    console.log('Delete skill response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Delete skill error:', error.response?.data || error.message || error);
    throw error;
  }
};

/**
 * Get authentication data from localStorage
 * @returns Object containing auth data or null if not found
 */
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