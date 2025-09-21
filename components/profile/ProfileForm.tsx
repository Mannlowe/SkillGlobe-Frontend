'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MapPin, 
  Briefcase, 
  Calendar,
  X,
  Pencil,
  Plus,
  Trash2,
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import DomainFields from './DomainFields';
import { useRoleBasedProfileStore } from '@/store/role-based-profile/rolebasedprofileStore';
import { CreateUpdateRoleBasedProfileRequest } from '@/app/api/Role Based Profile/rolebasedProfile';
import { getSkills, getAuthData, getCityList, type Skill, type City } from '@/app/api/job postings/addjobPosting';
import { ResumeTemplate } from './ResumeTemplateSelector';

interface ProfileFormProps {
  onSave: (data: ProfileEntry[]) => void;
  onCancel: () => void;
  initialData?: ProfileEntry[];
  showFormDirectly?: boolean;
  isEditing?: boolean;
  selectedTemplate?: ResumeTemplate;
}

export interface ProfileEntry {
  subdomain: any;
  id: string;
  role: string;
  profileType: string; // Changed to required (removed optional '?')
  subDomain?: string; // Added subdomain field
  employmentType: string;
  natureOfWork: string;
  workMode: string;
  minimumEarnings?: string;
  currency?: string;
  preferredCity?: string;
  preferredCountry?: string;
  totalExperience?: string;
  relevantExperience?: string;
  primarySkills: Array<{name: string, canonical_name: string}>;
  secondarySkills: Array<{name: string, canonical_name: string}>;
  resume?: File | null;
  // IT-specific fields
  it_portfolio?: string;
  it_dev_method?: string;
  it_domain_exp?: string[];
  it_tools_used?: string[];
  it_tools?: string[];
  it_research?: string;
  it_data_domain_exp?: string[];
  it_data_projects?: string;
  it_compliance?: string[];
  it_security_tools?: string[];
  it_incident_exp?: string[];
  it_security_clearance?: string;
  it_network_exp?: string[];
  // Pharma & Healthcare-specific fields
  ph_compliance?: string[];
  ph_equipment_handling?: string[];
  ph_shift_preference?: string;
  ph_quality_tools?: string[];
  ph_supply_chain_area?: string[];
  ph_regulatory_knowledge?: string[];
  ph_tools_used?: string[];
  ph_trial_phase_exp?: string[];
  ph_regulatory_docs?: string[];
  ph_publications?: string;
  ph_lab_tools?: string[];
  ph_department?: string;
  ph_licenses?: string[];
  ph_languages?: string[];
  workEligibility?: string;
  customWorkEligibility?: string;
}

export default function ProfileForm({ onSave, onCancel, initialData = [], showFormDirectly = false, isEditing = false, selectedTemplate }: ProfileFormProps) {
  const [profileEntries, setProfileEntries] = useState<ProfileEntry[]>(
    initialData.length > 0 ? initialData : []
  );
  
  // Store integration
  const { 
    createRoleBasedProfile, 
    updateRoleBasedProfile, 
    isCreating, 
    isUpdating, 
    createError, 
    updateError,
    clearCreateError,
    clearUpdateError,
    rawProfiles
  } = useRoleBasedProfileStore();

  // Function to populate form with existing profile data for editing
  const populateFormWithProfileData = (profileName: string) => {
    if (!rawProfiles) return null;
    
    const existingProfile = rawProfiles.find(profile => profile.name === profileName);
    if (!existingProfile) return null;

    // Helper function to map API field names to frontend field names
    const mapDomainSpecificFields = (profileData: any) => {
      const mappedFields: any = {};
      
      // IT Domain field mappings
      if (profileData.github__portfolio) mappedFields.it_portfolio = profileData.github__portfolio;
      if (profileData.development_methodology) mappedFields.it_dev_method = profileData.development_methodology;
      if (profileData.domain_expertise) mappedFields.it_domain_exp = profileData.domain_expertise?.split(', ') || [];
      if (profileData.tools_platforms) mappedFields.it_tools_used = profileData.tools_platforms?.split(', ') || [];
      if (profileData.tools_used) mappedFields.it_tools = profileData.tools_used?.split(', ') || [];
      if (profileData.research__papers) mappedFields.it_research = profileData.research__papers;
      if (profileData.data_domain_focus) mappedFields.it_data_domain_exp = profileData.data_domain_focus?.split(', ') || [];
      if (profileData.major_projects) mappedFields.it_data_projects = profileData.major_projects;
      if (profileData.compliance) mappedFields.it_compliance = profileData.compliance?.split(', ') || [];
      if (profileData.security_tools_used) mappedFields.it_security_tools = profileData.security_tools_used?.split(', ') || [];
      if (profileData.incident_handling) mappedFields.it_incident_exp = profileData.incident_handling?.split(', ') || [];
      if (profileData.security_clearance) mappedFields.it_security_clearance = profileData.security_clearance;
      if (profileData.network_expertise) mappedFields.it_network_exp = profileData.network_expertise?.split(', ') || [];
      
      // Manufacturing Domain field mappings
      if (profileData.production_area) mappedFields.mf_production_area = profileData.production_area?.split(', ') || [];
      if (profileData.machine_handling) mappedFields.mf_machine_handling = profileData.machine_handling?.split(', ') || [];
      if (profileData.shift_preference) mappedFields.mf_shift_preference = profileData.shift_preference;
      if (profileData.safety_training) mappedFields.mf_safety_cert = profileData.safety_training?.split(', ') || [];
      
      // Add other domain mappings as needed...
      
      return mappedFields;
    };

    // Map API data back to ProfileEntry format
    const profileEntry: ProfileEntry = {
      id: existingProfile.name,
      role: existingProfile.role,
      profileType: mapSpaceToProfileType(existingProfile.space),
  
      employmentType: existingProfile.employment_type,
      natureOfWork: existingProfile.nature_of_work,
      workMode: existingProfile.work_mode,
      minimumEarnings: existingProfile.minimum_earnings?.toString() || '',
      currency: existingProfile.currency || '',
      preferredCity: existingProfile.preferred_city || '',
      preferredCountry: existingProfile.preferred_country,
      totalExperience: existingProfile.total_experience_years || '',
      relevantExperience: existingProfile.relevant_experience?.toString() || '',
      primarySkills: existingProfile.primary_skills ? existingProfile.primary_skills.map((s: {skill: string; canonical_name?: string}) => ({ name: s.skill, canonical_name: s.canonical_name || s.skill })) : [],
      secondarySkills: existingProfile.secondary_skills ? existingProfile.secondary_skills.map((s: {skill: string; canonical_name?: string}) => ({ name: s.skill, canonical_name: s.canonical_name || s.skill })) : [],
      resume: null,
      
      // Add mapped domain-specific fields
      ...mapDomainSpecificFields(existingProfile as any)
    };

    console.log('Populated profile entry with domain fields:', profileEntry);
    return profileEntry;
  };

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
  
  // Initialize form with template data if provided
  useEffect(() => {
    if (selectedTemplate && !initialData.length) {
      const templateEntry: ProfileEntry = {
        id: `profile-${Date.now()}`,
        role: selectedTemplate.name + ' Profile',
        profileType: selectedTemplate.name,
       
        employmentType: 'Permanent',
        natureOfWork: 'Full-time',
        workMode: 'No Preference',
        minimumEarnings: '',
        currency: 'USD',
        preferredCity: selectedTemplate.sampleData?.personalInfo?.location?.split(', ')[0] || '',
        preferredCountry: selectedTemplate.sampleData?.personalInfo?.location?.split(', ')[1] || '',
        totalExperience: '',
        relevantExperience: '',
        primarySkills: selectedTemplate.sampleData?.skills?.slice(0, 3).map((skill: string) => ({ name: skill, canonical_name: skill })) || [],
        secondarySkills: selectedTemplate.sampleData?.skills?.slice(3).map((skill: string) => ({ name: skill, canonical_name: skill })) || [],
        resume: null,
        subdomain: undefined
      };
      setEditingEntry(templateEntry);
      setShowEditForm(true);
    }
  }, [selectedTemplate, initialData.length]);
  
  const [editingEntry, setEditingEntry] = useState<ProfileEntry | null>(null);
  const [showEditForm, setShowEditForm] = useState(showFormDirectly || isEditing);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [activeSection, setActiveSection] = useState('resume');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState("");
  
  // Skills dropdown states
  const [primarySkillsDropdownOpen, setPrimarySkillsDropdownOpen] = useState(false);
  const [secondarySkillsDropdownOpen, setSecondarySkillsDropdownOpen] = useState(false);
  
  // City dropdown state
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  
  // Skills API state
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [primarySkillsSearch, setPrimarySkillsSearch] = useState('');
  const [secondarySkillsSearch, setSecondarySkillsSearch] = useState('');
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [filteredPrimarySkills, setFilteredPrimarySkills] = useState<Skill[]>([]);
  const [filteredSecondarySkills, setFilteredSecondarySkills] = useState<Skill[]>([]);
  
  // Cities API state
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [cityListLoading, setCityListLoading] = useState(false);
  
  // Refs for click outside handling
  const primarySkillsDropdownRef = useRef<HTMLDivElement>(null);
  const secondarySkillsDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  
  // Fetch cities from API
  const fetchCityList = useCallback(async () => {
    const authData = getAuthData();
    if (!authData) {
      console.error('No auth data available for city list API');
      return [];
    }

    setCityListLoading(true);
    try {
      const cities = await getCityList(authData.apiKey, authData.apiSecret);
      setAvailableCities(cities);
      return cities;
    } catch (error) {
      console.error('Error fetching city list:', error);
      return [];
    } finally {
      setCityListLoading(false);
    }
  }, []);

  // Fetch skills on component mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setSkillsLoading(true);
        const authData = getAuthData();
        if (authData && authData.apiKey && authData.apiSecret) {
          const skills = await getSkills('', authData.apiKey, authData.apiSecret);
          setAvailableSkills(skills);
          setFilteredPrimarySkills(skills);
          setFilteredSecondarySkills(skills);
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setSkillsLoading(false);
      }
    };

    fetchSkills();
    fetchCityList(); // Fetch cities when component mounts
  }, [fetchCityList]);

  // Filter skills based on search terms
  useEffect(() => {
    if (primarySkillsSearch.trim()) {
      const filtered = availableSkills.filter(skill => 
        skill.canonical_name.toLowerCase().includes(primarySkillsSearch.toLowerCase())
      );
      setFilteredPrimarySkills(filtered);
    } else {
      setFilteredPrimarySkills(availableSkills);
    }
  }, [primarySkillsSearch, availableSkills]);

  useEffect(() => {
    if (secondarySkillsSearch.trim()) {
      const filtered = availableSkills.filter(skill => 
        skill.canonical_name.toLowerCase().includes(secondarySkillsSearch.toLowerCase())
      );
      setFilteredSecondarySkills(filtered);
    } else {
      setFilteredSecondarySkills(availableSkills);
    }
  }, [secondarySkillsSearch, availableSkills]);

  // Click outside handlers for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        primarySkillsDropdownRef.current && 
        !primarySkillsDropdownRef.current.contains(event.target as Node)
      ) {
        setPrimarySkillsDropdownOpen(false);
      }
      
      if (
        secondarySkillsDropdownRef.current && 
        !secondarySkillsDropdownRef.current.contains(event.target as Node)
      ) {
        setSecondarySkillsDropdownOpen(false);
      }
      
      if (
        cityDropdownRef.current && 
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setCityDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle and remove functions for skills
  const togglePrimarySkill = (skillObj: {name: string, canonical_name: string}) => {
    if (!editingEntry) return;
    
    // Initialize primarySkills as an empty array if it doesn't exist
    const currentSkills = editingEntry.primarySkills || [];
    
    const updatedSkills = currentSkills.some(s => s.name === skillObj.name)
      ? currentSkills.filter(s => s.name !== skillObj.name)
      : [...currentSkills, {name: skillObj.name, canonical_name: skillObj.canonical_name}];
    
    setEditingEntry({
      ...editingEntry,
      primarySkills: updatedSkills
    });

    if (updatedSkills.length > 0) {
      setError("");
    } else {
      setError("Please select at least one primary skill.");
    }
  };
  
  const toggleSecondarySkill = (skillObj: {name: string, canonical_name: string}) => {
    if (!editingEntry) return;
    
    // Initialize secondarySkills as an empty array if it doesn't exist
    const currentSkills = editingEntry.secondarySkills || [];
    
    setEditingEntry({
      ...editingEntry,
      secondarySkills: currentSkills.some(s => s.name === skillObj.name)
        ? currentSkills.filter(s => s.name !== skillObj.name)
        : [...currentSkills, {name: skillObj.name, canonical_name: skillObj.canonical_name}]
    });
  };

  const removePrimarySkill = (skillIdToRemove: string) => {
    if (!editingEntry) return;
    setEditingEntry({
      ...editingEntry,
      primarySkills: (editingEntry.primarySkills || []).filter(skill => skill.name !== skillIdToRemove)
    });
  };
  
  const removeSecondarySkill = (skillIdToRemove: string) => {
    if (!editingEntry) return;
    setEditingEntry({
      ...editingEntry,
      secondarySkills: (editingEntry.secondarySkills || []).filter(skill => skill.name !== skillIdToRemove)
    });
  };
  
  // Function to ensure skills have canonical names
  const ensureSkillsHaveCanonicalNames = async (skills: Array<{name: string, canonical_name?: string}>) => {
    // If skills array is empty, return empty array
    if (!skills || skills.length === 0) return [];
    
    try {
      // Get all available skills
      const authData = getAuthData();
      if (!authData || !authData.apiKey || !authData.apiSecret) {
        return skills; // Return original skills if auth data not available
      }
      
      // Fetch all skills to get canonical names
      const allSkills = await getSkills('', authData.apiKey, authData.apiSecret);
      
      // Map each skill to include canonical name
      return skills.map(skill => {
        // Find matching skill in all skills
        const matchingSkill = allSkills.find(s => s.name === skill.name);
        
        // If matching skill found, use its canonical name, otherwise use the skill name
        // Ensure canonical_name is always a string (not undefined)
        return {
          name: skill.name,
          canonical_name: (matchingSkill?.canonical_name || skill.canonical_name || skill.name) as string
        };
      });
    } catch (error) {
      console.error('Error ensuring skills have canonical names:', error);
      return skills; // Return original skills on error
    }
  };

  // Initialize the form with initial data or create a new entry
  useEffect(() => {
    // If we have initial data (for editing), use that
    if (initialData.length > 0) {
      const initialEntry = initialData[0];
      
      // First set up the entry with existing skills
      const entryWithSkills = {
        ...initialEntry,
        profileType: initialEntry.profileType || '', // Ensure profileType is always initialized
        subDomain: initialEntry.subDomain || '', // Ensure subDomain is always initialized
        primarySkills: Array.isArray(initialEntry.primarySkills) ? [...initialEntry.primarySkills] : [],
        secondarySkills: Array.isArray(initialEntry.secondarySkills) ? [...initialEntry.secondarySkills] : []
      };
      
      console.log('Setting editingEntry with initial data:', entryWithSkills);
      
      // Set the initial entry
      setEditingEntry(entryWithSkills);
      setShowEditForm(true); // Always show the form when we have initial data
      
      // Then fetch canonical names for skills and update the entry
      const updateSkillsWithCanonicalNames = async () => {
        try {
          const primarySkillsWithCanonicalNames = await ensureSkillsHaveCanonicalNames(entryWithSkills.primarySkills);
          const secondarySkillsWithCanonicalNames = await ensureSkillsHaveCanonicalNames(entryWithSkills.secondarySkills);
          
          // Cast the skills arrays to the correct type to satisfy TypeScript
          const typedPrimarySkills = primarySkillsWithCanonicalNames as Array<{name: string, canonical_name: string}>;
          const typedSecondarySkills = secondarySkillsWithCanonicalNames as Array<{name: string, canonical_name: string}>;
          
          setEditingEntry(prev => prev ? {
            ...prev,
            primarySkills: typedPrimarySkills,
            secondarySkills: typedSecondarySkills
          } : null);
        } catch (error) {
          console.error('Error updating skills with canonical names:', error);
        }
      };
      
      updateSkillsWithCanonicalNames();
    } 
    // Otherwise if showFormDirectly is true, create a new entry
    else if (showFormDirectly && !editingEntry) {
      setEditingEntry({
        id: crypto.randomUUID(),
        role: '',
        profileType: '', // Added required profileType field
        subDomain: '', // Ensure subDomain is always initialized
        employmentType: '',
        natureOfWork: '',
        workMode: '',
        minimumEarnings: '',
        currency: '',
        preferredCity: '',
        preferredCountry: '',
        totalExperience: '',
        relevantExperience: '',
        subdomain: '',
        primarySkills: [],
        secondarySkills: [],
        resume: null
      });
      setShowEditForm(true);
    }
  }, [showFormDirectly, initialData, isEditing]);
  
  const employmentTypes = ['Permanent', 'Contract', 'Internship'];
  const workNatures = ['Full-time', 'Part-time'];
  const workModes = ['WFO', 'WFH', 'Hybrid', 'No Preference'];
  const profileTypes = ['IT', 'Manufacturing', 'Banking', 'Hospitality', 'Pharma & Healthcare', 'Others'];
  const workEligibilities = ['Citizen', 'Permanent Resident', 'Work Permit', 'Green Card', 'Other'];

  // IT Subdomain options - using full names as expected by backend
  const itSubDomains = [
    { value: 'Software Development & Services (IT1)', label: 'Software Development & Services' },
    { value: 'Data & Emerging Tech (IT2)', label: 'Data & Emerging Tech' },
    { value: 'Cybersecurity & Networks (IT3)', label: 'Cybersecurity & Networks' }
  ];

  // Manufacturing Subdomain options - matching backend stored names
  const manufacturingSubDomains = [
    { value: 'Production & Operations (MF1)', label: 'Production & Operations' },
    { value: 'Automotive & Engineering (MF2)', label: 'Automotive & Engineering' },
    { value: 'Quality & Maintenance (MF3)', label: 'Quality & Maintenance' },
    { value: 'Supply Chain & Materials (MF4)', label: 'Supply Chain & Materials' }
  ];

  // Banking Subdomain options - matching backend stored names
  const bankingSubDomains = [
    { value: 'Banking (BF1)', label: 'Banking' },
    { value: 'Finance & Investments (BF2)', label: 'Finance & Investments' },
    { value: 'Insurance (BF3)', label: 'Insurance' },
    { value: 'FinTech & Payments (BF4)', label: 'FinTech & Payments' }
  ];

  // Hospitality Subdomain options - matching backend stored names
  const hospitalitySubDomains = [
    { value: 'Hotels & Lodging (HS1)', label: 'Hotels & Lodging' },
    { value: 'Food & Beverages (HS2)', label: 'Food & Beverages' },
    { value: 'Travel & Tourism (HS3)', label: 'Travel & Tourism' },
    { value: 'Events & Recreation (HS4)', label: 'Events & Recreation' }
  ];

  // Pharma & Healthcare Subdomain options - matching backend stored names
  const pharmaSubDomains = [
    { value: 'Pharma Manufacturing & Quality (PH1)', label: 'Pharma Manufacturing & Quality' },
    { value: 'Distribution & Supply Chain (PH2)', label: 'Distribution & Supply Chain' },
    { value: 'Research & Clinical (PH3)', label: 'Research & Clinical' },
    { value: 'Healthcare Services (PH4)', label: 'Healthcare Services' }
  ];

  // Field options for IT subdomains
  const itFieldOptions = {
    it_dev_method: ['Agile', 'Scrum', 'Waterfall', 'DevOps'],
    it_domain_exp: ['FinTech', 'HealthTech', 'EdTech', 'eCommerce', 'SaaS'],
    it_tools_used: ['Jira', 'Confluence', 'Docker', 'Kubernetes'],
    it_tools: ['Tableau', 'PowerBI', 'Hadoop', 'Spark'],
    it_data_domain_exp: ['Healthcare', 'Finance', 'Retail', 'IoT'],
    it_compliance: ['ISO27001', 'GDPR', 'HIPAA', 'PCI-DSS'],
    it_security_tools: ['SIEM', 'IDS', 'Firewalls', 'Splunk'],
    it_incident_exp: ['SOC', 'Threat Hunting', 'Incident Response'],
    it_security_clearance: ['None', 'Confidential', 'Secret', 'Top Secret'],
    it_network_exp: ['Routing', 'Switching', 'VPNs', 'SD-WAN']
  };

  const handleAddProfile = () => {
    setEditingEntry({
      id: crypto.randomUUID(),
      role: '',
      profileType: '', // Empty string but required field
      subDomain: '', // No default subdomain
      employmentType: '',
      natureOfWork: '',
      workMode: '',
      minimumEarnings: '',
      currency: '',
      preferredCity: '',
      preferredCountry: '',
      totalExperience: '',
      relevantExperience: '',
      primarySkills: [],
      secondarySkills: [],
      subdomain: '',
      resume: null
    });
    setShowEditForm(true);
  };

  const handleEditProfile = (entry: ProfileEntry) => {
    console.log('Original entry before edit:', JSON.stringify(entry));
    
    // Try to get fresh data from API if available
    const apiProfileData = populateFormWithProfileData(entry.id);
    
    let entryToEdit: ProfileEntry;
    
    if (apiProfileData) {
      // Use API data if available (more up-to-date)
      entryToEdit = {
        ...apiProfileData,
        // Preserve any local-only fields
        primarySkills: Array.isArray(entry.primarySkills) ? [...entry.primarySkills] : [],
        secondarySkills: Array.isArray(entry.secondarySkills) ? [...entry.secondarySkills] : []
      };
      console.log('Using API data for editing:', JSON.stringify(entryToEdit));
    } else {
      // Fallback to local data
      entryToEdit = { 
        ...entry,
        profileType: entry.profileType || '',
        subDomain: entry.subDomain || '',
        primarySkills: Array.isArray(entry.primarySkills) ? [...entry.primarySkills] : [],
        secondarySkills: Array.isArray(entry.secondarySkills) ? [...entry.secondarySkills] : []
      };
      console.log('Using local data for editing:', JSON.stringify(entryToEdit));
    }
    
    console.log('Final entryToEdit - profileType:', entryToEdit.profileType, 'subDomain:', entryToEdit.subDomain);
    setEditingEntry(entryToEdit);
    setShowEditForm(true);
  };

  const handleDeleteProfile = (id: string) => {
    setProfileEntries(profileEntries.filter(entry => entry.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingEntry) {
      const updatedEntry = {
        ...editingEntry,
        [name]: value
      };
      
      if (name === 'workEligibility' && value !== 'Other') {
        updatedEntry.customWorkEligibility = '';
      }
      
      setEditingEntry(updatedEntry);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingEntry) {
      setEditingEntry({
        ...editingEntry,
        resume: file
      });
      setResumeUploaded(true);
      // After resume is uploaded, automatically switch to personal info section
      setTimeout(() => {
        setActiveSection('personal');
      }, 1000);
    }
  };

  const handleRemoveResume = () => {
    if (editingEntry) {
      setEditingEntry({
        ...editingEntry,
        resume: null
      });
      setResumeUploaded(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!editingEntry) return;
    
    // Validation
    if (!editingEntry.role || !editingEntry.employmentType || !editingEntry.natureOfWork || !editingEntry.workMode || !editingEntry.profileType) {
      alert('Please fill in all required fields including domain selection');
      return;
    }

    if (!editingEntry?.primarySkills || editingEntry.primarySkills.length === 0) {
      setError("Please select at least one primary skill.");
      return;
    }

    // Clear previous errors
    clearCreateError();
    clearUpdateError();

    try {
      // Map ProfileEntry to API request format
      const apiRequest: CreateUpdateRoleBasedProfileRequest = {
        entity_id: '', // Will be set by the store
        space: mapProfileTypeToSpace(editingEntry.profileType),
        subdomain: editingEntry.subDomain || '',
        role: editingEntry.role,
        nature_of_work: editingEntry.natureOfWork,
        work_mode: editingEntry.workMode,
        employment_type: editingEntry.employmentType,
        minimum_earnings: editingEntry.minimumEarnings || '',
        currency: editingEntry.currency ? parseInt(editingEntry.currency) : undefined,
        preferred_city: editingEntry.preferredCity || '',
        preferred_country: editingEntry.preferredCountry || '',
        relevant_experience: editingEntry.relevantExperience || '',
        work_eligibility: editingEntry.workEligibility === 'Other' 
          ? editingEntry.customWorkEligibility || '' 
          : editingEntry.workEligibility || '',
        primary_skills: editingEntry.primarySkills?.map(skill => ({ skill: skill.name })) || [],
        secondary_skills: editingEntry.secondarySkills?.map(skill => ({ skill: skill.name })) || [],
        
        // Add the selected template ID if available
        template_id: selectedTemplate?.id,
        
        // Add domain-specific fields based on profileType and subDomain
        ...mapDomainSpecificFields(editingEntry)
      };

      // Determine if this is an edit or create operation
      const isEditMode = profileEntries.some(entry => entry.id === editingEntry.id);
      
      if (isEditMode) {
        // For edit mode, add the name parameter
        apiRequest.name = editingEntry.id; // Use the ID as the name for updates
        const response = await updateRoleBasedProfile(apiRequest);
        
        if (response) {
          console.log('Profile updated successfully');
          // Update local state
          const updatedEntry = {
            ...editingEntry,
            primarySkills: Array.isArray(editingEntry.primarySkills) ? [...editingEntry.primarySkills] : [],
            secondarySkills: Array.isArray(editingEntry.secondarySkills) ? [...editingEntry.secondarySkills] : []
          };
          
          setProfileEntries(profileEntries.map(entry => 
            entry.id === updatedEntry.id ? updatedEntry : entry
          ));
          
          // Show success message
          setSuccessMessage('Profile updated successfully!');
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        }
      } else {
        // For create mode, don't include name parameter
        const response = await createRoleBasedProfile(apiRequest);
        
        if (response) {
          console.log('Profile created successfully');
          // Note: The store's createRoleBasedProfile already refreshes the profile list
          // so we don't need to add to local state here to avoid duplication
          
          // Show success message
          setSuccessMessage('Profile created successfully!');
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        }
      }
      
      // If showFormDirectly is true, save the profile immediately
      if (showFormDirectly) {
        const updatedEntry = {
          ...editingEntry,
          primarySkills: Array.isArray(editingEntry.primarySkills) ? [...editingEntry.primarySkills] : [],
          secondarySkills: Array.isArray(editingEntry.secondarySkills) ? [...editingEntry.secondarySkills] : []
        };
        onSave([updatedEntry]);
      } else {
        setEditingEntry(null);
        setShowEditForm(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // Error is handled by the store, just log it here
    }
  };

  // Helper function to map profile type to space
  const mapProfileTypeToSpace = (profileType: string): string => {
    const mapping: { [key: string]: string } = {
      'IT': 'Information Technology (IT)',
      'Manufacturing': 'Manufacturing & Industrials',
      'Banking': 'Banking & Financial Services',
      'Hospitality': 'Hospitality & Services',
      'Pharma & Healthcare': 'Pharmaceuticals & Healthcare',
      'Others': 'Others'
    };
    return mapping[profileType] || profileType;
  };

  // Helper function to map domain-specific fields
  const mapDomainSpecificFields = (entry: ProfileEntry): any => {
    const fields: any = {};
    
    // IT fields
    if (entry.profileType === 'IT') {
      if (entry.it_portfolio) fields.github__portfolio = entry.it_portfolio;
      if (entry.it_dev_method) fields.development_methodology = entry.it_dev_method;
      if (entry.it_domain_exp) fields.domain_expertise = Array.isArray(entry.it_domain_exp) ? entry.it_domain_exp.join(', ') : entry.it_domain_exp;
      if (entry.it_tools_used) fields.tools_platforms = Array.isArray(entry.it_tools_used) ? entry.it_tools_used.join(', ') : entry.it_tools_used;
      if (entry.it_tools) fields.tools_used = Array.isArray(entry.it_tools) ? entry.it_tools.join(', ') : entry.it_tools;
      if (entry.it_research) fields.research__papers = entry.it_research;
      if (entry.it_data_domain_exp) fields.data_domain_focus = Array.isArray(entry.it_data_domain_exp) ? entry.it_data_domain_exp.join(', ') : entry.it_data_domain_exp;
      if (entry.it_data_projects) fields.major_projects = entry.it_data_projects;
      if (entry.it_compliance) fields.compliance = Array.isArray(entry.it_compliance) ? entry.it_compliance.join(', ') : entry.it_compliance;
      if (entry.it_security_tools) fields.security_tools_used = Array.isArray(entry.it_security_tools) ? entry.it_security_tools.join(', ') : entry.it_security_tools;
      if (entry.it_incident_exp) fields.incident_handling = Array.isArray(entry.it_incident_exp) ? entry.it_incident_exp.join(', ') : entry.it_incident_exp;
      if (entry.it_security_clearance) fields.security_clearance = entry.it_security_clearance;
      if (entry.it_network_exp) fields.network_expertise = Array.isArray(entry.it_network_exp) ? entry.it_network_exp.join(', ') : entry.it_network_exp;
    }
    
    // Add other domain mappings as needed...
    
    return fields;
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setShowEditForm(false);
    onCancel(); // Call the onCancel prop to close the modal
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry?.primarySkills || editingEntry.primarySkills.length === 0) {
      setError("Please select at least one primary skill.");
      return;
    }
    
    onSave(profileEntries);
  };

  // Force show edit form if we're in edit mode or have initial data
  useEffect(() => {
    if (isEditing || initialData.length > 0) {
      setShowEditForm(true);
      
      // If we have initial data and no editing entry yet, set it
      if (initialData.length > 0 && !editingEntry) {
        setEditingEntry(initialData[0]);
      }
    }
  }, [isEditing, initialData, editingEntry]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-rubik">
      {!showEditForm ? (
        <>
          {profileEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="bg-blue-50 rounded-full p-4 mb-4">
                <Briefcase className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles created yet</h3>
              <p className="text-gray-500 text-center mb-6">Create a profile to showcase your professional details and preferences</p>
              <button
                type="button"
                onClick={handleAddProfile}
                className="btn-gradient-border py-2 px-4 rounded-lg flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Profile
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Profiles</h2>
                <button
                  type="button"
                  onClick={handleAddProfile}
                  className="btn-gradient-border py-2 px-4 rounded-lg flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Profile
                </button>
              </div>
              
              <div className="space-y-4">
                {profileEntries.map((entry) => (
                  
                  // eslint-disable-next-line react/jsx-key
                  <div className='grid grid-cols-2 gap-2'>
                  <div key={entry.id} className="bg-white p-4 rounded-lg shadow-2xl border border-gray-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-gray-900">{entry.role}</h3>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="h-4 w-4 mr-2" />
                            <span>{entry.employmentType} · {entry.natureOfWork} · {entry.workMode}</span>
                          </div>
                          {entry.profileType && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="font-medium">Domain:</span>
                              <span className="ml-1">{entry.profileType}</span>
                              {entry.subDomain && (
                                <>
                                  <span className="mx-1">·</span>
                                  <span>{entry.subDomain.includes('(') ? entry.subDomain.split('(')[0].trim() : entry.subDomain}</span>
                                </>
                              )}
                            </div>
                          )}
                          {entry.preferredCity && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{entry.preferredCity}{entry.preferredCountry ? `, ${entry.preferredCountry}` : ''}</span>
                            </div>
                          )}
                          {entry.totalExperience && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{entry.totalExperience} years experience</span>
                            </div>
                          )}
                          
                          {entry.primarySkills && entry.primarySkills.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-500 mb-1">Primary Skills</p>
                              <div className="flex flex-wrap gap-1">
                                {entry.primarySkills.map(skill => (
                                  <span key={skill.name} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                    {skill.canonical_name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {entry.secondarySkills && entry.secondarySkills.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-500 mb-1">Secondary Skills</p>
                              <div className="flex flex-wrap gap-1">
                                {entry.secondarySkills.map(skill => (
                                  <span key={skill.name} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                    {skill.canonical_name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditProfile(entry)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          aria-label="Edit profile"
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProfile(entry.id)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          aria-label="Delete profile"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
              
              {/* <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Profiles
                </button>
              </div> */}
            </>
          )}
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-medium">
                {editingEntry && profileEntries.some(e => e.id === editingEntry.id) 
                  ? 'Edit Profile' 
                  : 'Add New Profile'}
              </h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select
                    value={editingEntry?.profileType || ''}
                    onChange={(e) => {
                      const newProfileType = e.target.value;
                      setEditingEntry(prev => prev ? {
                        ...prev, 
                        profileType: newProfileType,
                        subDomain: (newProfileType === 'IT' || newProfileType === 'Manufacturing' || newProfileType === 'Banking' || newProfileType === 'Hospitality' || newProfileType === 'Pharma & Healthcare') ? prev.subDomain : '' // Reset subdomain if not supported domain
                      } : null);
                    }}
                    className="block w-44 pl-3 pr-10 py-1.5 text-base border border-orange-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select Domain</option>
                    {profileTypes.map((type) => (
                      <option className='border rounded-lg' key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Subdomain dropdown - show when IT or Manufacturing is selected */}
                {editingEntry?.profileType === 'IT' && (
                  <div className="relative">
                    <select
                      value={editingEntry?.subDomain || ''}
                      onChange={(e) => setEditingEntry(prev => prev ? {...prev, subDomain: e.target.value} : null)}
                      className="block w-56 pl-3 pr-10 py-1.5 text-base border border-blue-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select IT Subdomain</option>
                      {itSubDomains.map((subdomain) => (
                        <option key={subdomain.value} value={subdomain.value}>{subdomain.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {editingEntry?.profileType === 'Manufacturing' && (
                  <div className="relative">
                    <select
                      value={editingEntry?.subDomain || ''}
                      onChange={(e) => setEditingEntry(prev => prev ? {...prev, subDomain: e.target.value} : null)}
                      className="block w-56 pl-3 pr-10 py-1.5 text-base border border-orange-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select Manufacturing Subdomain</option>
                      {manufacturingSubDomains.map((subdomain) => (
                        <option key={subdomain.value} value={subdomain.value}>{subdomain.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {(editingEntry?.profileType === 'Finance' || editingEntry?.profileType === 'Banking') && (
                  <div className="relative">
                    <select
                      value={editingEntry?.subDomain || ''}
                      onChange={(e) => setEditingEntry(prev => prev ? {...prev, subDomain: e.target.value} : null)}
                      className="block w-56 pl-3 pr-10 py-1.5 text-base border border-green-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select Banking Subdomain</option>
                      {bankingSubDomains.map((subdomain) => (
                        <option key={subdomain.value} value={subdomain.value}>{subdomain.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {editingEntry?.profileType === 'Hospitality' && (
                  <div className="relative">
                    <select
                      value={editingEntry?.subDomain || ''}
                      onChange={(e) => setEditingEntry(prev => prev ? {...prev, subDomain: e.target.value} : null)}
                      className="block w-56 pl-3 pr-10 py-1.5 text-base border border-green-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select Hospitality Subdomain</option>
                      {hospitalitySubDomains.map((subdomain) => (
                        <option key={subdomain.value} value={subdomain.value}>{subdomain.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {editingEntry?.profileType === 'Pharma & Healthcare' && (
                  <div className="relative">
                    <select
                      value={editingEntry?.subDomain || ''}
                      onChange={(e) => setEditingEntry(prev => prev ? {...prev, subDomain: e.target.value} : null)}
                      className="block w-56 pl-3 pr-10 py-1.5 text-base border border-purple-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select Pharma Subdomain</option>
                      {pharmaSubDomains.map((subdomain) => (
                        <option key={subdomain.value} value={subdomain.value}>{subdomain.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Display */}
          {(createError || updateError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {createError ? 'Error creating profile' : 'Error updating profile'}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{createError || updateError}</p>
                  </div>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        clearCreateError();
                        clearUpdateError();
                      }}
                      className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Resume Upload Button */}
          {/* <div className="flex justify-center">
            {!resumeUploaded ? (
              <label className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg cursor-pointer group hover:shadow-xl">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Upload className="relative z-10 mr-2" size={18} />
                <span className="relative z-10 text-sm font-semibold">Upload Resume</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
            ) : (
              <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full border border-green-300 relative">
                <FileText className="mr-2" size={18} />
                <span className="text-sm font-semibold">Resume Uploaded ✓</span>
                <button
                  type="button"
                  onClick={handleRemoveResume}
                  className="ml-3 p-1 rounded-full hover:bg-green-200 transition-colors duration-200"
                  title="Remove resume and upload a different one"
                >
                  <X className="h-4 w-4 text-green-700 hover:text-red-600" />
                </button>
              </div>
            )}
          </div> */}
            {/* Required Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={editingEntry?.role || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Full Stack Developer"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                name="employmentType"
                value={editingEntry?.employmentType || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Employment Type</option>
                {employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nature of Work <span className="text-red-500">*</span>
              </label>
              <select
                name="natureOfWork"
                value={editingEntry?.natureOfWork || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Nature of Work</option>
                {workNatures.map(nature => (
                  <option key={nature} value={nature}>{nature}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Mode <span className="text-red-500">*</span>
              </label>
              <select
                name="workMode"
                value={editingEntry?.workMode || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Work Mode</option>
                {workModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
            </div>
            
            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Eligibility
                </label>
                <select 
                name="workEligibility" 
                value={editingEntry?.workEligibility || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                >
                  <option value="">Select Work Eligibility</option>
                  {workEligibilities.map(eligibility => (
                    <option key={eligibility} value={eligibility}>{eligibility}</option>
                  ))}
                </select>
                {editingEntry?.workEligibility === 'Other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      name="customWorkEligibility"
                      value={editingEntry?.customWorkEligibility || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please specify your work eligibility"
                      required
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Earnings
                </label>
                <input
                  type="text"
                  name="minimumEarnings"
                  value={editingEntry?.minimumEarnings || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 75000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <input
                  type="text"
                  name="currency"
                  value={editingEntry?.currency || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. INR, USD"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred City
                </label>
                <div className="relative" ref={cityDropdownRef}>
                  <div 
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all flex justify-between items-center cursor-pointer"
                    onClick={() => !cityListLoading && setCityDropdownOpen(!cityDropdownOpen)}
                  >
                    <span className={!editingEntry?.preferredCity ? "text-gray-500" : ""}>
                      {cityListLoading ? 'Loading cities...' : (editingEntry?.preferredCity || 'Select a city')}
                    </span>
                    {cityListLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {cityDropdownOpen && !cityListLoading && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      <div 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                        onClick={() => {
                          if (editingEntry) {
                            setEditingEntry({ ...editingEntry, preferredCity: '' });
                          }
                          setCityDropdownOpen(false);
                        }}
                      >
                        Select a city
                      </div>
                      {availableCities.map((city) => (
                        <div
                          key={city.name}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            if (editingEntry) {
                              setEditingEntry({ ...editingEntry, preferredCity: city.name });
                            }
                            setCityDropdownOpen(false);
                          }}
                        >
                          {city.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Country
                </label>
                <input
                  type="text"
                  name="preferredCountry"
                  value={editingEntry?.preferredCountry || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. India"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Experience (years)
                </label>
                <input
                  type="text"
                  name="totalExperience"
                  value={editingEntry?.totalExperience || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relevant Experience (years)
                </label>
                <input
                  type="text"
                  name="relevantExperience"
                  value={editingEntry?.relevantExperience || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 3"
                />
              </div>
            </div>
            
            {/* Primary Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ">
                Primary Skills <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <div className="w-1/2 relative" ref={primarySkillsDropdownRef}>
                  <div 
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all flex justify-between items-center cursor-pointer"
                    onClick={() => setPrimarySkillsDropdownOpen(!primarySkillsDropdownOpen)}
                  >
                    <span className={editingEntry?.primarySkills?.length === 0 ? "text-gray-500" : ""}>
                      {editingEntry?.primarySkills?.length === 0 ? 'Select primary skills' : 'Primary skills selected'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {primarySkillsDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Search skills..."
                          value={primarySkillsSearch}
                          onChange={(e) => setPrimarySkillsSearch(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        {error && (
  <p className="text-red-500 text-sm mt-1">{error}</p>
)}

                     
                      </div>
                      {skillsLoading ? (
                        <div className="px-4 py-2 text-center text-gray-500">
                          Loading skills...
                        </div>
                      ) : filteredPrimarySkills.length > 0 ? (
                        filteredPrimarySkills.map((skill) => (
                          <div 
                            key={skill.name} 
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                            onClick={() => togglePrimarySkill(skill)}
                          >
                            <span>{skill.canonical_name}</span>
                            {editingEntry?.primarySkills?.some(s => s.name === skill.name) && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-center text-gray-500">
                          No skills found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="w-1/2 bg-gray-50 border border-gray-200 rounded-lg p-2 min-h-[42px] max-h-[150px] overflow-y-auto">
                  {editingEntry?.primarySkills && Array.isArray(editingEntry.primarySkills) && editingEntry.primarySkills.length > 0 ? (
                    editingEntry.primarySkills.map((skillObj) => {
                      return (
                        <div key={skillObj.name} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                          {skillObj.canonical_name}
                          <button 
                            type="button"
                            className="ml-1 text-blue-600 hover:text-blue-800"
                            onClick={() => removePrimarySkill(skillObj.name)}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 italic">No primary skills selected</p>
                  )}
                </div>
              </div>
                 {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            
            {/* Secondary Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Skills
              </label>
              <div className="flex gap-4">
                <div className="w-1/2 relative" ref={secondarySkillsDropdownRef}>
                  <div 
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all flex justify-between items-center cursor-pointer"
                    onClick={() => setSecondarySkillsDropdownOpen(!secondarySkillsDropdownOpen)}
                  >
                    <span className={editingEntry?.secondarySkills?.length === 0 ? "text-gray-500" : ""}>
                      {editingEntry?.secondarySkills?.length === 0 ? 'Select secondary skills' : 'Secondary skills selected'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {secondarySkillsDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Search skills..."
                          value={secondarySkillsSearch}
                          onChange={(e) => setSecondarySkillsSearch(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      {skillsLoading ? (
                        <div className="px-4 py-2 text-center text-gray-500">
                          Loading skills...
                        </div>
                      ) : filteredSecondarySkills.length > 0 ? (
                        filteredSecondarySkills.map((skill) => (
                          <div 
                            key={skill.name} 
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                            onClick={() => toggleSecondarySkill(skill)}
                          >
                            <span>{skill.canonical_name}</span>
                            {editingEntry?.secondarySkills?.some(s => s.name === skill.name) && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-center text-gray-500">
                          No skills found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="w-1/2 bg-gray-50 border border-gray-200 rounded-lg p-2 min-h-[42px] max-h-[150px] overflow-y-auto">
                  {editingEntry?.secondarySkills && Array.isArray(editingEntry.secondarySkills) && editingEntry.secondarySkills.length > 0 ? (
                    editingEntry.secondarySkills.map((skillObj) => {
                      return (
                        <div key={skillObj.name} className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                          {skillObj.canonical_name}
                          <button 
                            type="button"
                            className="ml-1 text-green-600 hover:text-green-800"
                            onClick={() => removeSecondarySkill(skillObj.name)}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 italic">No secondary skills selected</p>
                  )}
                </div>
              </div>
            </div>
            
            
            {/* Domain-Specific Fields */}
            {editingEntry && (
              <DomainFields 
                profileType={editingEntry.profileType}
                subDomain={editingEntry.subDomain}
                editingEntry={editingEntry}
                setEditingEntry={setEditingEntry}
              />
            )}
            
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEntry}
              disabled={isCreating || isUpdating}
              className="px-4 py-2 bg-[#007BCA] text-white rounded-lg hover:bg-[#007BCA]/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {(isCreating || isUpdating) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingEntry && profileEntries.some(e => e.id === editingEntry.id) 
                ? (isUpdating ? 'Updating...' : 'Update') 
                : (isCreating ? 'Creating...' : 'Create')}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
function setError(arg0: string) {
  throw new Error('Function not implemented.');
}

