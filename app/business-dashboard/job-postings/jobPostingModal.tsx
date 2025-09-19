'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useJobPostingStore } from '@/store/job-postings/addjobpostingStore';
import { getSkills, getApplyOpportunities, getAuthData, type Skill } from '@/app/api/job postings/addjobPosting';

// Define document type interface
export interface DocumentFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// Define job posting interface for edit functionality
export interface JobPosting {
  id: string;
  title: string;
  skillCategory?: string;
  employmentType: string;
  workMode?: string;
  experienceRequired?: string;
  location: string;
  salary?: string;
  primarySkills?: string[];
  secondarySkills?: string[];
  genderPreference?: string[];
  languageRequirement?: string[];
  description?: string;
  documents?: DocumentFile[];
  applicationDeadline?: string;
  postedDate: string;
  status: string;
}

// Define job form state interface
export interface JobFormState {
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
  location: string;
  gender: string[];
  language: string[];
  visibilitySettings: string;
  anticipatedApplications: string;
  documents: DocumentFile[];
}

interface JobPostingModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSubmit: (job: JobFormState) => void;
  editData?: JobPosting;
}

export default function JobPostingModal({ showModal, setShowModal, onSubmit, editData }: JobPostingModalProps) {
  const [primarySkillsDropdownOpen, setPrimarySkillsDropdownOpen] = useState(false);
  const [secondarySkillsDropdownOpen, setSecondarySkillsDropdownOpen] = useState(false);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const primarySkillsDropdownRef = useRef<HTMLDivElement>(null);
  const secondarySkillsDropdownRef = useRef<HTMLDivElement>(null);
  const genderDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  
  // Skills API state
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [primarySkillsSearch, setPrimarySkillsSearch] = useState('');
  const [secondarySkillsSearch, setSecondarySkillsSearch] = useState('');
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [filteredPrimarySkills, setFilteredPrimarySkills] = useState<Skill[]>([]);
  const [filteredSecondarySkills, setFilteredSecondarySkills] = useState<Skill[]>([]);
  
  // Apply opportunities API state
  const [applyOpportunities, setApplyOpportunities] = useState<string[]>([]);
  const [applyOpportunitiesLoading, setApplyOpportunitiesLoading] = useState(false);
  
  const [newJob, setNewJob] = useState<JobFormState>({
    title: '',
    skillCategory: '',
    opportunityType: 'Permanent',
    employmentType: 'Full-Time',
    workMode: 'WFO',
    experienceRequired: '0-2 years',
    minRemuneration: '',
    applicationDeadline: '',
    opportunityClosed: false,
    numberOfOpenings: '1',
    description: '',
    primarySkills: [],
    secondarySkills: [],
    preferredQualifications: '',
    location: '',
    gender: [],
    language: [],
    visibilitySettings: 'all',
    anticipatedApplications: '10',
    documents: []

  });

  // Function to fetch skills from API
  const fetchSkills = useCallback(async (searchTerm: string = '') => {
    const authData = getAuthData();
    if (!authData) {
      console.error('No auth data available for skills API');
      return [];
    }

    setSkillsLoading(true);
    try {
      const skills = await getSkills(searchTerm, authData.apiKey, authData.apiSecret);
      return skills;
    } catch (error) {
      console.error('Error fetching skills:', error);
      return [];
    } finally {
      setSkillsLoading(false);
    }
  }, []);

  // Function to fetch apply opportunities from API
  const fetchApplyOpportunities = useCallback(async () => {
    const authData = getAuthData();
    if (!authData) {
      console.error('No auth data available for apply opportunities API');
      return [];
    }

    setApplyOpportunitiesLoading(true);
    try {
      const opportunities = await getApplyOpportunities(authData.apiKey, authData.apiSecret);
      return opportunities;
    } catch (error) {
      console.error('Error fetching apply opportunities:', error);
      return [];
    } finally {
      setApplyOpportunitiesLoading(false);
    }
  }, []);

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      const [skills, opportunities] = await Promise.all([
        fetchSkills(),
        fetchApplyOpportunities()
      ]);
      
      setAvailableSkills(skills);
      setFilteredPrimarySkills(skills);
      setFilteredSecondarySkills(skills);
      setApplyOpportunities(opportunities);
    };
    
    if (showModal) {
      loadInitialData();
    }
  }, [showModal, fetchSkills, fetchApplyOpportunities]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for date fields to ensure proper format
    if (name === 'applicationDeadline' && value) {
      // Ensure date is in YYYY-MM-DD format for HTML date input
      const dateValue = new Date(value).toISOString().split('T')[0];
      setNewJob(prev => ({
        ...prev,
        [name]: dateValue
      }));
    } else {
      setNewJob(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const togglePrimarySkill = (skillId: string) => {
    console.log('Toggling primary skill ID:', skillId);
    setNewJob(prev => {
      if (prev.primarySkills.includes(skillId)) {
        const newSkills = prev.primarySkills.filter(s => s !== skillId);
        console.log('Removed skill, new primary skills:', newSkills);
        return {
          ...prev,
          primarySkills: newSkills
        };
      } else {
        const newSkills = [...prev.primarySkills, skillId];
        console.log('Added skill, new primary skills:', newSkills);
        return {
          ...prev,
          primarySkills: newSkills
        };
      }
    });
  };
  
  const toggleSecondarySkill = (skillId: string) => {
    setNewJob(prev => {
      if (prev.secondarySkills.includes(skillId)) {
        return {
          ...prev,
          secondarySkills: prev.secondarySkills.filter(s => s !== skillId)
        };
      } else {
        return {
          ...prev,
          secondarySkills: [...prev.secondarySkills, skillId]
        };
      }
    });
  };
  
  const toggleGender = (gender: string) => {
    setNewJob(prev => {
      if (prev.gender.includes(gender)) {
        return {
          ...prev,
          gender: prev.gender.filter(g => g !== gender)
        };
      } else {
        return {
          ...prev,
          gender: [...prev.gender, gender]
        };
      }
    });
  };
  
  const toggleLanguage = (language: string) => {
    setNewJob(prev => {
      if (prev.language.includes(language)) {
        return {
          ...prev,
          language: prev.language.filter(l => l !== language)
        };
      } else {
        return {
          ...prev,
          language: [...prev.language, language]
        };
      }
    });
  };
  
  // Effect to populate form with edit data when provided
  useEffect(() => {
    if (editData) {
      // Format application deadline if available
      let formattedDeadline = '';
      try {
        // Try to format the date if it exists
        if (editData.applicationDeadline) {
          formattedDeadline = new Date(editData.applicationDeadline).toISOString().split('T')[0];
        }
      } catch (error) {
        console.error('Error formatting application deadline:', error);
      }
      
      // Handle backward compatibility with old data format
      let primarySkills: string[] = [];
      let secondarySkills: string[] = [];
      
      // If we have the new data structure with separate primary and secondary skills
      if (editData.primarySkills || editData.secondarySkills) {
        primarySkills = editData.primarySkills || [];
        secondarySkills = editData.secondarySkills || [];
      } 
      // For backward compatibility with old data structure
      else if ('skillsRequired' in editData && Array.isArray(editData.skillsRequired)) {
        // Put all skills in primary skills for backward compatibility
        primarySkills = editData.skillsRequired;
      }
      
      setNewJob({
        title: editData.title || '',
        skillCategory: editData.skillCategory || '',
        opportunityType: 'Permanent', // Default value if not in editData
        employmentType: editData.employmentType || 'Full-Time',
        workMode: editData.workMode || 'WFO',
        experienceRequired: editData.experienceRequired || '0-2 years',
        minRemuneration: editData.salary || '',
        applicationDeadline: formattedDeadline,
        opportunityClosed: false,
        numberOfOpenings: '1',
        description: editData.description || '',
        primarySkills: primarySkills,
        secondarySkills: secondarySkills,
        preferredQualifications: '',
        location: editData.location || '',
        gender: editData.genderPreference || [],
        language: editData.languageRequirement || [],
        visibilitySettings: 'all',
        anticipatedApplications: '10',
        documents: editData.documents || []
      });
    }
  }, [editData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (primarySkillsDropdownRef.current && !primarySkillsDropdownRef.current.contains(event.target as Node)) {
        setPrimarySkillsDropdownOpen(false);
      }
      if (secondarySkillsDropdownRef.current && !secondarySkillsDropdownRef.current.contains(event.target as Node)) {
        setSecondarySkillsDropdownOpen(false);
      }
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
        setGenderDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const removePrimarySkill = (skillIdToRemove: string) => {
    setNewJob(prev => ({
      ...prev,
      primarySkills: prev.primarySkills.filter(skillId => skillId !== skillIdToRemove)
    }));
  };
  
  const removeSecondarySkill = (skillIdToRemove: string) => {
    setNewJob(prev => ({
      ...prev,
      secondarySkills: prev.secondarySkills.filter(skillId => skillId !== skillIdToRemove)
    }));
  };
  
  const removeGender = (genderToRemove: string) => {
    setNewJob(prev => ({
      ...prev,
      gender: prev.gender.filter(gender => gender !== genderToRemove)
    }));
  };
  
  const removeLanguage = (languageToRemove: string) => {
    setNewJob(prev => ({
      ...prev,
      language: prev.language.filter(language => language !== languageToRemove)
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      const newDocuments = fileList.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }));
      
      setNewJob(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments]
      }));
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files) {
      const fileList = Array.from(e.dataTransfer.files);
      const newDocuments = fileList.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }));
      
      setNewJob(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments]
      }));
    }
  };
  
  const removeDocument = (fileName: string) => {
    setNewJob(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.name !== fileName)
    }));
  };

  const { submitJobPosting, isSubmitting, submitSuccess, submitError, resetSubmitState } = useJobPostingStore();

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await submitJobPosting(newJob);
      
      if (response) {
        // Success - call the original onSubmit for any additional handling
        onSubmit(newJob);
        setShowModal(false);
        // Reset form
        setNewJob({
          title: '',
          skillCategory: '',
          opportunityType: 'Permanent',
          employmentType: 'Full-Time',
          workMode: 'WFO',
          experienceRequired: '0-2 years',
          minRemuneration: '',
          applicationDeadline: '',
          opportunityClosed: false,
          numberOfOpenings: '1',
          description: '',
          primarySkills: [],
          secondarySkills: [],
          preferredQualifications: '',
          location: '',
          gender: [],
          language: [],
          visibilitySettings: 'all',
          anticipatedApplications: '10',
          documents: []
        });
      }
    } catch (error) {
      console.error('Error submitting job posting:', error);
    }
  };

  if (!showModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">New Job Posting</h3>
          <button 
            onClick={() => setShowModal(false)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
      <X size={20} />
    </button>
  </div>
  
  <form onSubmit={handleCreateJob} className="p-6 space-y-6 font-rubik">
  <div>
      {/* <label className="block text-sm font-medium text-gray-700 mb-1">
        Attach Documents
      </label> */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <label className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg cursor-pointer group hover:shadow-xl">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 mr-2" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="relative z-10 text-sm font-semibold">Upload Documents</span>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </label>
        
        {newJob.documents.length > 0 && (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Attached Documents:</p>
            <div className="space-y-2">
              {newJob.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">{doc.name}</p>
                      <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeDocument(doc.name)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    <h4 className="text-md font-semibold text-blue-600 mb-2">Step 1: Basic Information</h4>
    
    {/* Job Title */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Opportunity Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="title"
        value={newJob.title}
        onChange={handleInputChange}
        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        placeholder="Clear and descriptive title"
        required
      />
    </div>
    
    {/* Role/Skill Category */}
    <div className='grid grid-cols-2 gap-4'>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Role / Skill Category <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="skillCategory"
        value={newJob.skillCategory}
        onChange={handleInputChange}
        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        placeholder="e.g. Frontend Development, Data Science"
        required
      />
    </div>
    
    {/* Opportunity Type */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Opportunity Type <span className="text-red-500">*</span>
      </label>
      <select
        name="opportunityType"
        value={newJob.opportunityType}
        onChange={handleInputChange}
        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        required
      >
        <option value="Permanent">Permanent</option>
        <option value="Internship">Internship</option>
        <option value="Contract">Contract</option>
      </select>
    </div>
    </div>
    
    {/* Employment Type */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Employment Type <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="employmentType"
            value="Full-Time"
            checked={newJob.employmentType === 'Full-Time'}
            onChange={handleInputChange}
            className="form-radio h-4 w-4 text-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Full-Time</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="employmentType"
            value="Part-Time"
            checked={newJob.employmentType === 'Part-Time'}
            onChange={handleInputChange}
            className="form-radio h-4 w-4 text-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Part-Time</span>
        </label>
      </div>
    </div>
    
    {/* Work Mode */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Work Mode <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="workMode"
            value="WFO"
            checked={newJob.workMode === 'WFO'}
            onChange={handleInputChange}
            className="form-radio h-4 w-4 text-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">WFO (Office)</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="workMode"
            value="WFH"
            checked={newJob.workMode === 'WFH'}
            onChange={handleInputChange}
            className="form-radio h-4 w-4 text-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">WFH (Remote)</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="workMode"
            value="Hybrid"
            checked={newJob.workMode === 'Hybrid'}
            onChange={handleInputChange}
            className="form-radio h-4 w-4 text-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Hybrid</span>
        </label>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Experience Required */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Experience Required
        </label>
        <select
          name="experienceRequired"
          value={newJob.experienceRequired}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        >
          <option value="0-2 years">0-2 years</option>
          <option value="2-5 years">2-5 years</option>
          <option value="5-10 years">5-10 years</option>
          <option value="10+ years">10+ years</option>
        </select>
      </div>
      
      {/* Min Remuneration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Min Remuneration
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
          <input
            type="text"
            name="minRemuneration"
            value={newJob.minRemuneration}
            onChange={handleInputChange}
            className="w-full pl-8 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="e.g. 500000"
          />
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Application Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Application Deadline <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="applicationDeadline"
          value={newJob.applicationDeadline}
          onChange={(e) => {
            // Direct update to ensure date format is preserved
            setNewJob(prev => ({
              ...prev,
              applicationDeadline: e.target.value
            }));
          }}
          className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          required
        />
      </div>
      
      {/* Number of Openings */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Openings
        </label>
        <input
          type="number"
          name="numberOfOpenings"
          value={newJob.numberOfOpenings}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          placeholder="e.g. 3"
          min="1"
        />
      </div>
    </div>
    
    <h4 className="text-md font-semibold text-blue-600 mt-6 mb-2">Step 2: Detailed Information</h4>
    
    {/* Description */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description <span className="text-red-500">*</span>
      </label>
      <textarea
        name="description"
        value={newJob.description}
        onChange={handleInputChange}
        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        rows={5}
        placeholder="Opportunity summary, responsibilities, etc."
        required
      ></textarea>
    </div>
    
    {/* Primary Skills */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Primary Skills <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-4">
        <div className="w-1/2 relative" ref={primarySkillsDropdownRef}>
          <div 
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all flex justify-between items-center cursor-pointer"
            onClick={() => setPrimarySkillsDropdownOpen(!primarySkillsDropdownOpen)}
          >
            <span className={newJob.primarySkills.length === 0 ? "text-gray-500" : ""}>
              {newJob.primarySkills.length === 0 ? 'Select primary skills' : 'Primary skills selected'}
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
                    onClick={() => togglePrimarySkill(skill.name)}
                  >
                    <span>{skill.canonical_name}</span>
                    {newJob.primarySkills.includes(skill.name) && (
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
          {newJob.primarySkills.length > 0 ? (
            newJob.primarySkills.map((skillId) => {
              const skill = availableSkills.find(s => s.name === skillId);
              return (
                <div key={skillId} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                  {skill?.canonical_name || skillId}
                  <button 
                    type="button"
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    onClick={() => removePrimarySkill(skillId)}
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
            <span className={newJob.secondarySkills.length === 0 ? "text-gray-500" : ""}>
              {newJob.secondarySkills.length === 0 ? 'Select secondary skills' : 'Secondary skills selected'}
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
                    onClick={() => toggleSecondarySkill(skill.name)}
                  >
                    <span>{skill.canonical_name}</span>
                    {newJob.secondarySkills.includes(skill.name) && (
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
          {newJob.secondarySkills.length > 0 ? (
            newJob.secondarySkills.map((skillId) => {
              const skill = availableSkills.find(s => s.name === skillId);
              return (
                <div key={skillId} className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                  {skill?.canonical_name}
                  <button 
                    type="button"
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    onClick={() => removeSecondarySkill(skillId)}
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
    
    {/* Preferred Qualifications */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Preferred Qualifications
      </label>
      <input
        type="text"
        name="preferredQualifications"
        value={newJob.preferredQualifications}
        onChange={handleInputChange}
        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        placeholder="Education, certifications"
      />
    </div>
    
    {/* Location */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Location <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="location"
        value={newJob.location}
        onChange={handleInputChange}
        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        placeholder="e.g. Bangalore, Remote, Hybrid"
        required
      />
    </div>
    
    <h4 className="text-md font-semibold text-blue-600 mt-6 mb-2">Step 3: Additional Filters</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      
      {/* Language Requirement */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Language Requirement
      </label>
      <div className="flex gap-4">
        <div className="w-1/2 relative" ref={languageDropdownRef}>
          <div 
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all flex justify-between items-center cursor-pointer"
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
          >
            <span className={newJob.language.length === 0 ? "text-gray-500" : ""}>
              {newJob.language.length === 0 ? 'Select language requirements' : 'Languages selected'}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          {languageDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto">
              {[
                { value: "english", label: "English" },
                { value: "spanish", label: "Spanish" },
                { value: "french", label: "French" },
                { value: "german", label: "German" },
                { value: "chinese", label: "Chinese" },
                { value: "japanese", label: "Japanese" },
                { value: "arabic", label: "Arabic" },
                { value: "hindi", label: "Hindi" }
              ].map((option) => (
                <div 
                  key={option.value} 
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleLanguage(option.value)}
                >
                  <span>{option.label}</span>
                  {newJob.language.includes(option.value) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-1/2 bg-gray-50 border border-gray-200 rounded-lg p-2 min-h-[42px] max-h-[150px] overflow-y-auto">
          {newJob.language.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {newJob.language.map((language) => (
                <div key={language} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md flex items-center">
                  {language === 'english' ? 'English' : 
                   language === 'spanish' ? 'Spanish' : 
                   language === 'french' ? 'French' : 
                   language === 'german' ? 'German' : 
                   language === 'chinese' ? 'Chinese' : 
                   language === 'japanese' ? 'Japanese' : 
                   language === 'arabic' ? 'Arabic' : 
                   language === 'hindi' ? 'Hindi' : language}
                  <button 
                    type="button" 
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    onClick={() => removeLanguage(language)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No languages selected</p>
          )}
        </div>
      </div>
    </div>
    </div>
    
    <h4 className="text-md font-semibold text-blue-600 mt-6 mb-2">Step 4: Visibility Settings</h4>
    
    {/* Visibility Settings */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Who can view or apply to this opportunity?
      </label>
      <select
        name="visibilitySettings"
        value={newJob.visibilitySettings}
        onChange={handleInputChange}
        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        disabled={applyOpportunitiesLoading}
      >
        {applyOpportunitiesLoading ? (
          <option value="">Loading options...</option>
        ) : applyOpportunities.length > 0 ? (
          applyOpportunities.map((opportunity, index) => (
            <option key={index} value={opportunity.toLowerCase().replace(/[^a-z0-9]/g, '-')}>
              {opportunity}
            </option>
          ))
        ) : (
          <option value="all">All verified users</option>
        )}
      </select>
    </div>
    
    {/* Anticipated Applications */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Anticipated Number of Applications
      </label>
      <select
        name="anticipatedApplications"
        value={newJob.anticipatedApplications}
        onChange={handleInputChange}
        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
      >
        <option value="10">~10</option>
        <option value="25">~25</option>
        <option value="50">~50</option>
        <option value="100">~100</option>
        <option value="200">200+</option>
      </select>
    </div>
    
    <div className="flex justify-center pt-4">
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#007BCA] border text-white font-semibold py-2 px-8 rounded-lg hover:bg-white hover:text-[#007BCA] hover:border-[#007BCA] hover:shadow-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Posting...' : 'Job Post'}
      </button>
      
      {/* Error message */}
      {submitError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="text-sm font-medium">Error:</p>
          <p className="text-sm">{submitError}</p>
        </div>
      )}
      
      {/* Success message */}
      {submitSuccess && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <p className="text-sm">Job posting submitted successfully!</p>
        </div>
      )}
    </div>
  </form>
      </div>
    </div>
  );
}