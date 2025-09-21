import { create } from 'zustand';
import { 
  getRoleBasedProfiles, 
  getAuthData, 
  RoleBasedProfilesResponse, 
  createOrUpdateRoleBasedProfile,
  CreateUpdateRoleBasedProfileRequest,
  CreateUpdateRoleBasedProfileResponse
} from '@/app/api/Role Based Profile/rolebasedProfile';

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
}

// Interface for transformed profile data for UI
export interface Profile {
  id: string;
  name: string;
  type: string;
  completeness: number;
  views: number;
  isActive: boolean;
  template: string | null;
  formData: any;
  space?: string;
  role?: string;
  workMode?: string;
  employmentType?: string;
  experience?: number;
  location?: string;
  minEarnings?: number;
  currency?: string;
}

// Helper function to map space back to profile type
const mapSpaceToProfileType = (space: string): string => {
  const mapping: { [key: string]: string } = {
    'Information Technology (IT)': 'IT',
    'Manufacturing & Industrials': 'Manufacturing',
    'Banking & Financial Services': 'Banking',
    'Hospitality & Services': 'Hospitality',
    'Pharmaceuticals & Healthcare': 'Pharma & Healthcare'
  };
  return mapping[space] || 'Others';
};

// Utility function to convert API profile data to Profile format
const mapRoleBasedProfileToProfile = (profile: RoleBasedProfileData, index: number): Profile => {
  // Calculate completeness based on filled fields
  const fields = [
    profile.space,
    profile.role,
    profile.nature_of_work,
    profile.work_mode,
    profile.employment_type,
    profile.preferred_country,
    profile.relevant_experience,
    profile.work_eligibility,
    profile.total_experience_years
  ];
  
  const filledFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
  const completeness = Math.round((filledFields / fields.length) * 100);
  
  // Generate mock views (in real scenario, this would come from analytics)
  const mockViews = Math.floor(Math.random() * 1000) + 100;
  
  // Determine profile type
  const profileType = profile.role ? 'Specialized' : 'General';
  
  // Format location
  const location = profile.preferred_city 
    ? `${profile.preferred_city}, ${profile.preferred_country}`
    : profile.preferred_country;
  
  // Helper function to safely convert field to array
  const toArray = (field: any): string[] => {
    if (Array.isArray(field)) {
      return field;
    }
    if (typeof field === 'string' && field.trim()) {
      return field.split(', ').map(item => item.trim()).filter(item => item);
    }
    return [];
  };

  // Helper function to map API field names to frontend field names
  const mapDomainSpecificFields = (profileData: any) => {
    const mappedFields: any = {};
    
    // Debug: Log all available fields in the profile data
    console.log('Profile data keys:', Object.keys(profileData));
    console.log('Full profile data:', profileData);
    
    // Check if we have any domain-specific fields at all
    const hasAnyDomainFields = Object.keys(profileData).some(key => 
      key.includes('github__') || key.includes('development_') || key.includes('domain_') ||
      key.includes('production_') || key.includes('banking_') || key.includes('compliance_') ||
      key.includes('department') || key.includes('property_')
    );
    
    console.log('Has any domain fields:', hasAnyDomainFields);
    
    // IT Domain field mappings
    if (profileData.github__portfolio) mappedFields.it_portfolio = profileData.github__portfolio;
    if (profileData.development_methodology) mappedFields.it_dev_method = profileData.development_methodology;
    if (profileData.domain_expertise) mappedFields.it_domain_exp = toArray(profileData.domain_expertise);
    if (profileData.tools_platforms) mappedFields.it_tools_used = toArray(profileData.tools_platforms);
    if (profileData.tools_used) mappedFields.it_tools = toArray(profileData.tools_used);
    if (profileData.research__papers) mappedFields.it_research = profileData.research__papers;
    if (profileData.data_domain_focus) mappedFields.it_data_domain_exp = toArray(profileData.data_domain_focus);
    if (profileData.major_projects) mappedFields.it_data_projects = profileData.major_projects;
    if (profileData.compliance) mappedFields.it_compliance = toArray(profileData.compliance);
    if (profileData.security_tools_used) mappedFields.it_security_tools = toArray(profileData.security_tools_used);
    if (profileData.incident_handling) mappedFields.it_incident_exp = toArray(profileData.incident_handling);
    if (profileData.security_clearance) mappedFields.it_security_clearance = profileData.security_clearance;
    if (profileData.network_expertise) mappedFields.it_network_exp = toArray(profileData.network_expertise);
    
    // Manufacturing Domain field mappings
    if (profileData.production_area) mappedFields.mf_production_area = toArray(profileData.production_area);
    if (profileData.machine_handling) mappedFields.mf_machine_handling = toArray(profileData.machine_handling);
    if (profileData.shift_preference) mappedFields.mf_shift_preference = profileData.shift_preference;
    if (profileData.safety_training) mappedFields.mf_safety_cert = toArray(profileData.safety_training);
    if (profileData.engineering_domain) mappedFields.mf_engineering_domain = toArray(profileData.engineering_domain);
    if (profileData.design_tools) mappedFields.mf_design_tools = toArray(profileData.design_tools);
    if (profileData.prototyping_experience) mappedFields.mf_prototyping_exp = toArray(profileData.prototyping_experience);
    if (profileData.regulatory_standards) mappedFields.mf_regulatory_knowledge = toArray(profileData.regulatory_standards);
    if (profileData.quality_tools) mappedFields.mf_quality_tools = toArray(profileData.quality_tools);
    if (profileData.testing_methods) mappedFields.mf_testing_methods = toArray(profileData.testing_methods);
    if (profileData.quality_certifications) mappedFields.mf_certifications_qm = toArray(profileData.quality_certifications);
    if (profileData.maintenance_expertise) mappedFields.mf_maintenance_exp = toArray(profileData.maintenance_expertise);
    if (profileData.supply_chain_area) mappedFields.mf_supply_area = toArray(profileData.supply_chain_area);
    if (profileData.material_expertise) mappedFields.mf_material_expertise = toArray(profileData.material_expertise);
    if (profileData.scm_tools) mappedFields.mf_tools_used = toArray(profileData.scm_tools);
    if (profileData.regulatory_compliance) mappedFields.mf_regulatory_compliance = toArray(profileData.regulatory_compliance);
    
    // Banking Domain field mappings
    if (profileData.banking_domain) mappedFields.bf_banking_domain = toArray(profileData.banking_domain);
    if (profileData.core_banking_systems) mappedFields.bf_core_banking_systems = toArray(profileData.core_banking_systems);
    if (profileData.regulatory_exposure) mappedFields.bf_regulatory_exp = toArray(profileData.regulatory_exposure);
    if (profileData.compliance_knowledge) mappedFields.bf_compliance_knowledge = toArray(profileData.compliance_knowledge);
    if (profileData.finance_focus_area) mappedFields.bf_finance_area = toArray(profileData.finance_focus_area);
    if (profileData.erp__financial_tools) mappedFields.bf_erp_tools = toArray(profileData.erp__financial_tools);
    if (profileData.reporting_standards) mappedFields.bf_reporting_standards = toArray(profileData.reporting_standards);
    if (profileData.industry_finance_exp) mappedFields.bf_industry_experience = toArray(profileData.industry_finance_exp);
    if (profileData.insurance_domain) mappedFields.bf_insurance_domain = toArray(profileData.insurance_domain);
    if (profileData.insurance_products) mappedFields.bf_insurance_products = toArray(profileData.insurance_products);
    if (profileData.regulatory_licenses) mappedFields.bf_licensing = toArray(profileData.regulatory_licenses);
    if (profileData.claims_underwriting) mappedFields.bf_claims_exp = toArray(profileData.claims_underwriting);
    if (profileData.payment_systems) mappedFields.bf_payment_systems = toArray(profileData.payment_systems);
    if (profileData.fintech_platforms) mappedFields.bf_digital_platforms = toArray(profileData.fintech_platforms);
    if (profileData.regulatory_tech) mappedFields.bf_regtech_knowledge = toArray(profileData.regulatory_tech);
    if (profileData.security_standards) mappedFields.bf_security_compliance = toArray(profileData.security_standards);
    
    // Pharma Domain field mappings
    if (profileData.compliance_standards) mappedFields.ph_compliance = toArray(profileData.compliance_standards);
    if (profileData.equipment_handling) mappedFields.ph_equipment_handling = toArray(profileData.equipment_handling);
    if (profileData.ph1_shift_preference) mappedFields.ph_shift_preference = profileData.ph1_shift_preference;
    if (profileData.quality_tools_used) mappedFields.ph_quality_tools = toArray(profileData.quality_tools_used);
    if (profileData.supply_chain_focus) mappedFields.ph_supply_chain_area = toArray(profileData.supply_chain_focus);
    if (profileData.regulatory_knowledge) mappedFields.ph_regulatory_knowledge = toArray(profileData.regulatory_knowledge);
    if (profileData.scm_tools_used) mappedFields.ph_tools_used = toArray(profileData.scm_tools_used);
    if (profileData.clinical_trial_phases) mappedFields.ph_trial_phase_exp = toArray(profileData.clinical_trial_phases);
    if (profileData.regulatory_documents) mappedFields.ph_regulatory_docs = toArray(profileData.regulatory_documents);
    if (profileData.publications__papers) mappedFields.ph_publications = profileData.publications__papers;
    if (profileData.lab_tools__platforms) mappedFields.ph_lab_tools = toArray(profileData.lab_tools__platforms);
    if (profileData.medical_licenses) mappedFields.ph_licenses = toArray(profileData.medical_licenses);
    if (profileData.languages_known) mappedFields.ph_languages = toArray(profileData.languages_known);
    if (profileData.ph4_shift_preference) mappedFields.ph_shift_preference = profileData.ph4_shift_preference;
    if (profileData.department) mappedFields.ph_department = profileData.department;
    
    // Hospitality Domain field mappings
    if (profileData.department) mappedFields.hs_department = profileData.department;
    if (profileData.property_type) mappedFields.hs_property_type = toArray(profileData.property_type);
    if (profileData.guest_mgmt_system) mappedFields.hs_guest_mgmt_system = toArray(profileData.guest_mgmt_system);
    if (profileData.hs1_languages_known) mappedFields.hs_languages_known = toArray(profileData.hs1_languages_known);
    if (profileData.fb_specialization) mappedFields.hs_fnb_specialization = toArray(profileData.fb_specialization);
    if (profileData.service_type) mappedFields.hs_service_type = toArray(profileData.service_type);
    if (profileData.fb_certifications) mappedFields.hs_fnb_certifications = toArray(profileData.fb_certifications);
    if (profileData.beverage_knowledge) mappedFields.hs_beverage_knowledge = toArray(profileData.beverage_knowledge);
    if (profileData.travel_domain) mappedFields.hs_travel_domain = toArray(profileData.travel_domain);
    if (profileData.ticketing_systems) mappedFields.hs_ticketing_systems = toArray(profileData.ticketing_systems);
    if (profileData.destination_expertise) mappedFields.hs_destination_expertise = toArray(profileData.destination_expertise);
    if (profileData.customer_type) mappedFields.hs_customer_type = toArray(profileData.customer_type);
    if (profileData.event_type) mappedFields.hs_event_type = toArray(profileData.event_type);
    if (profileData.event_skills) mappedFields.hs_event_skills = toArray(profileData.event_skills);
    if (profileData.ticketing_platforms) mappedFields.hs_ticketing_platforms = toArray(profileData.ticketing_platforms);
    if (profileData.venue_type) mappedFields.hs_property_type_event = toArray(profileData.venue_type);
    
    return mappedFields;
  };

  // Create formData from API profile data
  const formData = {
    id: profile.name,
    role: profile.role || '',
    profileType: mapSpaceToProfileType(profile.space || ''),
  
    employmentType: profile.employment_type || 'Permanent',
    natureOfWork: profile.nature_of_work || 'Full-time',
    workMode: profile.work_mode || 'No Preference',
    minimumEarnings: profile.minimum_earnings?.toString() || '',
    currency: profile.currency || '',
    preferredCity: profile.preferred_city || '',
    preferredCountry: profile.preferred_country || '',
    totalExperience: profile.total_experience_years?.toString() || '',
    relevantExperience: profile.relevant_experience?.toString() || '',
    resume: profile.resume,
    primarySkills: profile.primary_skills ? profile.primary_skills.map((s: {skill: string; canonical_name?: string}) => ({ name: s.skill, canonical_name: s.canonical_name || s.skill })) : [],
    secondarySkills: profile.secondary_skills ? profile.secondary_skills.map((s: {skill: string; canonical_name?: string}) => ({ name: s.skill, canonical_name: s.canonical_name || s.skill })) : [],
    
    // Add mapped domain-specific fields
    ...mapDomainSpecificFields(profile as any)
  };

  // Determine template based on profile data (default to 'classic' if profile has sufficient data)
  const hasCompleteData = profile.role && profile.space;
  const template = hasCompleteData ? 'classic' : null;

  return {
    id: profile.name,
    name: profile.role || `Profile ${index + 1}`,
    type: profileType,
    completeness: completeness,
    views: mockViews,
    isActive: index === 0, // First profile is active by default
    template: template,
    formData: formData,
    space: profile.space,
    role: profile.role,
    workMode: profile.work_mode,
    employmentType: profile.employment_type,
    experience: profile.relevant_experience,
    location: location,
    minEarnings: profile.minimum_earnings,
    currency: profile.currency,
  };
};

// Interface for the store state
interface RoleBasedProfileState {
  // Profiles data
  profiles: Profile[] | null;
  rawProfiles: RoleBasedProfileData[] | null;
  isLoading: boolean;
  error: string | null;
  activeProfile: string | null;
  
  // Create/Update state
  isCreating: boolean;
  isUpdating: boolean;
  createError: string | null;
  updateError: string | null;
  
  // Actions
  fetchRoleBasedProfiles: () => Promise<void>;
  setActiveProfile: (profileId: string) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (profileId: string, updatedProfile: Partial<Profile>) => void;
  createRoleBasedProfile: (profileData: CreateUpdateRoleBasedProfileRequest) => Promise<CreateUpdateRoleBasedProfileResponse | null>;
  updateRoleBasedProfile: (profileData: CreateUpdateRoleBasedProfileRequest) => Promise<CreateUpdateRoleBasedProfileResponse | null>;
  clearError: () => void;
  clearCreateError: () => void;
  clearUpdateError: () => void;
  resetStore: () => void;
}

// Initial state
const initialState = {
  profiles: null,
  rawProfiles: null,
  isLoading: false,
  error: null,
  activeProfile: null,
  isCreating: false,
  isUpdating: false,
  createError: null,
  updateError: null,
};

// Create the store
export const useRoleBasedProfileStore = create<RoleBasedProfileState>((set, get) => ({
  ...initialState,

  // Fetch role based profiles data
  fetchRoleBasedProfiles: async () => {
    try {
      set({ isLoading: true, error: null });

      // Get authentication data
      const authData = getAuthData();
      if (!authData) {
        throw new Error('Authentication data not found. Please login again.');
      }

      const { entityId, apiKey, apiSecret } = authData;

      if (!apiKey || !apiSecret) {
        throw new Error('API credentials not found. Please login again.');
      }

      console.log('Fetching role based profiles for entity:', entityId);

      // Call the API
      const response: RoleBasedProfilesResponse = await getRoleBasedProfiles(
        entityId,
        apiKey,
        apiSecret
      );

      // Check if the response is successful
      if (response.message.status === 'success') {
        // Debug: Log the raw API response to see what fields are available
        console.log('Raw API profiles response:', response.message.data.profiles);
        
        // Transform API data to UI format
        const transformedProfiles = response.message.data.profiles.map(mapRoleBasedProfileToProfile);
        
        // Set first profile as active if none is set
        const activeProfileId = transformedProfiles.length > 0 ? transformedProfiles[0].id : null;
        
        set({
          profiles: transformedProfiles,
          rawProfiles: response.message.data.profiles,
          activeProfile: activeProfileId,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.message.message || 'Failed to fetch role based profiles');
      }
    } catch (error: any) {
      console.error('Error fetching role based profiles:', error);
      
      // For authentication errors or API failures, show empty data instead of error
      if (error.message?.includes('Authentication data not found') || 
          error.message?.includes('API credentials not found') ||
          error.message?.includes('Entity ID not found') ||
          error.message?.includes('Entity ID is required')) {
        console.log('Setting empty profiles due to auth issues');
        set({
          profiles: [],
          rawProfiles: [],
          activeProfile: null,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: error.message || 'Failed to fetch role based profiles',
          profiles: null,
          rawProfiles: null,
        });
      }
    }
  },

  // Set active profile
  setActiveProfile: (profileId: string) => {
    const { profiles } = get();
    if (profiles) {
      const updatedProfiles = profiles.map(profile => ({
        ...profile,
        isActive: profile.id === profileId
      }));
      set({ profiles: updatedProfiles, activeProfile: profileId });
    }
  },

  // Add new profile
  addProfile: (profile: Profile) => {
    const { profiles } = get();
    const currentProfiles = profiles || [];
    set({ profiles: [...currentProfiles, profile] });
  },

  // Update existing profile
  updateProfile: (profileId: string, updatedProfile: Partial<Profile>) => {
    const { profiles } = get();
    if (profiles) {
      const updatedProfiles = profiles.map(profile => 
        profile.id === profileId ? { ...profile, ...updatedProfile } : profile
      );
      set({ profiles: updatedProfiles });
    }
  },

  // Create new role-based profile
  createRoleBasedProfile: async (profileData: CreateUpdateRoleBasedProfileRequest) => {
    try {
      set({ isCreating: true, createError: null });

      // Get authentication data
      const authData = getAuthData();
      if (!authData) {
        throw new Error('Authentication data not found. Please login again.');
      }

      const { entityId, apiKey, apiSecret } = authData;

      if (!apiKey || !apiSecret) {
        throw new Error('API credentials not found. Please login again.');
      }

      // Add entity_id to profile data
      const requestData = {
        ...profileData,
        entity_id: entityId
      };

      console.log('Creating role based profile:', requestData);

      // Call the API
      const response: CreateUpdateRoleBasedProfileResponse = await createOrUpdateRoleBasedProfile(
        requestData,
        apiKey,
        apiSecret
      );

      // Check if the response is successful
      if (response.message.status === 'success') {
        console.log('Profile created successfully:', response.message.data);
        
        // Refresh the profiles list to include the new profile
        await get().fetchRoleBasedProfiles();
        
        set({
          isCreating: false,
          createError: null,
        });
        
        return response;
      } else {
        throw new Error(response.message.message || 'Failed to create role based profile');
      }
    } catch (error: any) {
      console.error('Error creating role based profile:', error);
      
      set({
        isCreating: false,
        createError: error.message || 'Failed to create role based profile',
      });
      
      return null;
    }
  },

  // Update existing role-based profile
  updateRoleBasedProfile: async (profileData: CreateUpdateRoleBasedProfileRequest) => {
    try {
      set({ isUpdating: true, updateError: null });

      // Get authentication data
      const authData = getAuthData();
      if (!authData) {
        throw new Error('Authentication data not found. Please login again.');
      }

      const { entityId, apiKey, apiSecret } = authData;

      if (!apiKey || !apiSecret) {
        throw new Error('API credentials not found. Please login again.');
      }

      // Add entity_id to profile data
      const requestData = {
        ...profileData,
        entity_id: entityId
      };

      console.log('Updating role based profile:', requestData);

      // Call the API
      const response: CreateUpdateRoleBasedProfileResponse = await createOrUpdateRoleBasedProfile(
        requestData,
        apiKey,
        apiSecret
      );

      // Check if the response is successful
      if (response.message.status === 'success') {
        console.log('Profile updated successfully:', response.message.data);
        
        // Refresh the profiles list to reflect the updates
        await get().fetchRoleBasedProfiles();
        
        set({
          isUpdating: false,
          updateError: null,
        });
        
        return response;
      } else {
        throw new Error(response.message.message || 'Failed to update role based profile');
      }
    } catch (error: any) {
      console.error('Error updating role based profile:', error);
      
      set({
        isUpdating: false,
        updateError: error.message || 'Failed to update role based profile',
      });
      
      return null;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Clear create error
  clearCreateError: () => {
    set({ createError: null });
  },

  // Clear update error
  clearUpdateError: () => {
    set({ updateError: null });
  },

  // Reset store to initial state
  resetStore: () => {
    set(initialState);
  },
}));