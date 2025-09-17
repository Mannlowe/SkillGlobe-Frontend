import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Interface for role based profile request (GET)
export interface RoleBasedProfileRequest {
  entity_id: string;
}

// Interface for create/update role based profile request
export interface CreateUpdateRoleBasedProfileRequest {
  entity_id: string;
  name?: string; // Only required for updates
  space: string;
  subdomain: string;
  portfolio?: string;
  role: string;
  nature_of_work: string;
  work_mode: string;
  employment_type: string;
  minimum_earnings?: string;
  currency?: number;
  preferred_city?: string;
  preferred_country?: string;
  relevant_experience?: string;
  work_eligibility?: string;
  primary_skills?: Array<{skill: string}>;
  secondary_skills?: Array<{skill: string}>;
  template_id?: string; // ID of the selected resume template
  
  // Banking & Financial Services fields
  banking_domain?: string;
  core_banking_systems?: string;
  regulatory_exposure?: string;
  compliance_knowledge?: string;
  regulatory_experience?: string;
  finance_focus_area?: string;
  erp__financial_tools?: string;
  reporting_standards?: string;
  industry_finance_exp?: string;
  insurance_domain?: string;
  insurance_products?: string;
  regulatory_licenses?: string;
  claims_underwriting?: string;
  payment_systems?: string;
  fintech_platforms?: string;
  regulatory_tech?: string;
  security_standards?: string;
  
  // Information Technology fields
  github__portfolio?: string;
  development_methodology?: string;
  domain_expertise?: string;
  tools_platforms?: string;
  tools_used?: string;
  research__papers?: string;
  data_domain_focus?: string;
  major_projects?: string;
  compliance?: string;
  security_tools_used?: string;
  incident_handling?: string;
  security_clearance?: string;
  network_expertise?: string;
  
  // Manufacturing & Industrials fields
  production_area?: string;
  machine_handling?: string;
  shift_preference?: string;
  safety_training?: string;
  engineering_domain?: string;
  design_tools?: string;
  prototyping_experience?: string;
  regulatory_standards?: string;
  quality_tools?: string;
  testing_methods?: string;
  quality_certifications?: string;
  maintenance_expertise?: string;
  supply_chain_area?: string;
  material_expertise?: string;
  scm_tools?: string;
  regulatory_compliance?: string;
  
  // Pharmaceuticals & Healthcare fields
  compliance_standards?: string;
  equipment_handling?: string;
  ph1_shift_preference?: string;
  quality_tools_used?: string;
  supply_chain_focus?: string;
  regulatory_knowledge?: string;
  scm_tools_used?: string;
  clinical_trial_phases?: string;
  regulatory_documents?: string;
  publications__papers?: string;
  lab_tools__platforms?: string;
  medical_licenses?: string;
  languages_known?: string;
  ph4_shift_preference?: string;
  
  // Hospitality & Services fields
  department?: string;
  property_type?: string;
  guest_mgmt_system?: string;
  hs1_languages_known?: string;
  fb_specialization?: string;
  service_type?: string;
  fb_certifications?: string;
  beverage_knowledge?: string;
  travel_domain?: string;
  ticketing_systems?: string;
  destination_expertise?: string;
  customer_type?: string;
  event_type?: string;
  event_skills?: string;
  ticketing_platforms?: string;
  venue_type?: string;
}

// Interface for create/update role based profile response
export interface CreateUpdateRoleBasedProfileResponse {
  message: {
    status: string;
    message: string;
    data: {
      entity_id: string;
      name?: string;
      space: string;
      subdomain: string;
      portfolio?: string;
      role: string;
      nature_of_work: string;
      work_mode: string;
      employment_type: string;
      minimum_earnings?: string;
      currency?: number;
      preferred_city?: string;
      preferred_country?: string;
      relevant_experience?: string;
      work_eligibility?: string;
      primary_skills?: Array<{skill: string}>;
      secondary_skills?: Array<{skill: string}>;
      [key: string]: any; // For domain-specific fields
    };
    timestamp: string;
  };
}

// Interface for individual role based profile data
export interface RoleBasedProfileData {
  name: string;
  entity: string;
  space: string;
  subdomain: string | null;
  role: string;
  portfolio: string | null;
  nature_of_work: string;
  work_mode: string;
  employment_type: string;
  minimum_earnings: number;
  currency: string;
  preferred_city: string | null;
  preferred_country: string;
  relevant_experience: number;
  work_eligibility: string;
  career_level: string | null;
  willing_to_relocate: string | null;
  certifications: string | null;
  resume: string | null;
  total_experience_years: string;
  primary_skills?: Array<{skill: string; canonical_name?: string}>;
  secondary_skills?: Array<{skill: string; canonical_name?: string}>;
  [key: string]: any; // For domain-specific fields
}

// Interface for role based profiles response
export interface RoleBasedProfilesResponse {
  message: {
    status: string;
    message: string;
    data: {
      profiles: RoleBasedProfileData[];
    };
    timestamp: string;
  };
}

/**
 * Get authentication data from local storage
 * @returns Object containing entity ID, API key, and API secret
 */
export const getAuthData = () => {
  if (typeof window !== 'undefined') {
    try {
      // Get entity data from localStorage
      const entityDataStr = localStorage.getItem('entity_data');
      console.log('Entity data from localStorage:', entityDataStr);
      
      const entityData = entityDataStr ? JSON.parse(entityDataStr) : {};
      console.log('Parsed entity data:', entityData);
      
      // Get API credentials from localStorage
      const apiKey = localStorage.getItem('auth_api_key');
      const apiSecret = localStorage.getItem('auth_api_secret');
      
      console.log('Direct localStorage API credentials:', { apiKey: !!apiKey, apiSecret: !!apiSecret });
      
      // If we don't have the API credentials in localStorage, try to get them from auth-storage
      if (!apiKey || !apiSecret) {
        console.log('API credentials not found in direct localStorage, checking auth-storage...');
        const authString = localStorage.getItem('auth-storage');
        
        if (authString) {
          const authStorage = JSON.parse(authString);
          const state = authStorage.state;
          
          console.log('Auth storage state:', { 
            hasToken: !!state?.token, 
            hasApiKey: !!state?.apiKey, 
            hasApiSecret: !!state?.apiSecret 
          });
          
          // Try to get API credentials from state
          if (state && state.token) {
            const retrievedEntityId = entityData.details?.entity_id || entityData.entity_id || state.entityId || '';
            
            if (!retrievedEntityId) {
              console.error('Entity ID not found in auth storage');
              return null;
            }
            
            console.log('Using entity ID from auth-storage:', retrievedEntityId);
            
            return {
              entityId: retrievedEntityId,
              apiKey: state.apiKey || '',
              apiSecret: state.apiSecret || ''
            };
          }
        }
        
        console.log('No valid auth-storage found, returning null');
        return null;
      }
      
      const retrievedEntityId = entityData.details?.entity_id || entityData.entity_id || '';
      
      if (!retrievedEntityId) {
        console.error('Entity ID not found in localStorage');
        return null;
      }
      
      // Check if we have valid API credentials
      if (!apiKey || !apiSecret) {
        console.error('API credentials not found in localStorage');
        return null;
      }
      
      // Log the entity ID being used
      console.log('Using entity ID:', retrievedEntityId);
      
      return {
        entityId: retrievedEntityId,
        apiKey,
        apiSecret
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return null;
    }
  }
  
  return null;
};

export const getRoleBasedProfiles = async (
  entityId: string,
  apiKey: string,
  apiSecret: string
): Promise<RoleBasedProfilesResponse> => {
  try {
    // Validate required parameters
    if (!entityId) {
      console.error('Entity ID is missing or empty');
      throw new Error('Entity ID is required but was not provided');
    }
    
    console.log('Getting role based profiles for entity ID:', entityId);

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    // API endpoint
    const url = `${API_BASE_URL}/api/method/skillglobe_be.api.role_based_profile.list.get_role_based_profiles`;

    const response = await axios.get<RoleBasedProfilesResponse>(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        entity_id: entityId
      }
    });

    console.log('Role based profiles response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Role based profiles error:', error.response?.data || error.message || error);
    throw error;
  }
};

/**
 * Create or update a role-based profile
 * @param profileData - The profile data to create/update
 * @param apiKey - API key for authentication
 * @param apiSecret - API secret for authentication
 * @returns Promise with the API response
 */
// Interface for delete role based profile request
export interface DeleteRoleBasedProfileRequest {
  entity_id: string;
  name: string;
}

// Interface for delete role based profile response
export interface DeleteRoleBasedProfileResponse {
  message: {
    status: string;
    message: string;
    timestamp: string;
  };
}

/**
 * Delete a role-based profile
 * @param entityId - Entity ID
 * @param profileName - Profile name to delete
 * @param apiKey - API key for authentication
 * @param apiSecret - API secret for authentication
 * @returns Promise with the API response
 */
export const deleteRoleBasedProfile = async (
  entityId: string,
  profileName: string,
  apiKey: string,
  apiSecret: string
): Promise<DeleteRoleBasedProfileResponse> => {
  try {
    if (!entityId || !profileName || !apiKey || !apiSecret) {
      throw new Error('All parameters are required');
    }

    const authHeader = `token ${apiKey}:${apiSecret}`;
    const url = `${API_BASE_URL}/api/method/skillglobe_be.api.role_based_profile.delete.delete_role_based_profile`;

    const response = await axios.delete<DeleteRoleBasedProfileResponse>(url, {
      data: {
        entity_id: entityId,
        name: profileName
      },
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Delete profile error:', error.response?.data || error.message);
    throw error;
  }
};

export const createOrUpdateRoleBasedProfile = async (
  profileData: CreateUpdateRoleBasedProfileRequest,
  apiKey: string,
  apiSecret: string
): Promise<CreateUpdateRoleBasedProfileResponse> => {
  try {
    // Validate required parameters
    if (!profileData.entity_id) {
      console.error('Entity ID is missing or empty');
      throw new Error('Entity ID is required but was not provided');
    }
    
    if (!apiKey || !apiSecret) {
      console.error('API credentials are missing');
      throw new Error('API credentials are required');
    }
    
    console.log('Creating/updating role based profile for entity ID:', profileData.entity_id);
    console.log('Profile data:', profileData);

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    // API endpoint
    const url = `${API_BASE_URL}/api/method/skillglobe_be.api.role_based_profile.form.create_or_update_role_based_profile`;

    const response = await axios.post<CreateUpdateRoleBasedProfileResponse>(url, profileData, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Create/update role based profile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create/update role based profile error:', error.response?.data || error.message || error);
    throw error;
  }
};