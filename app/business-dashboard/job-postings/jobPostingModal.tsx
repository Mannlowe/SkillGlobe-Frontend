'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

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
  
  const [newJob, setNewJob] = useState<JobFormState>({
    title: '',
    skillCategory: '',
    opportunityType: 'Permanent',
    employmentType: 'Full-Time',
    workMode: 'WFO',
    experienceRequired: '0-2',
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
  
  const togglePrimarySkill = (skill: string) => {
    setNewJob(prev => {
      if (prev.primarySkills.includes(skill)) {
        return {
          ...prev,
          primarySkills: prev.primarySkills.filter(s => s !== skill)
        };
      } else {
        return {
          ...prev,
          primarySkills: [...prev.primarySkills, skill]
        };
      }
    });
  };
  
  const toggleSecondarySkill = (skill: string) => {
    setNewJob(prev => {
      if (prev.secondarySkills.includes(skill)) {
        return {
          ...prev,
          secondarySkills: prev.secondarySkills.filter(s => s !== skill)
        };
      } else {
        return {
          ...prev,
          secondarySkills: [...prev.secondarySkills, skill]
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
        experienceRequired: editData.experienceRequired || '0-2',
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
  
  const removePrimarySkill = (skillToRemove: string) => {
    setNewJob(prev => ({
      ...prev,
      primarySkills: prev.primarySkills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const removeSecondarySkill = (skillToRemove: string) => {
    setNewJob(prev => ({
      ...prev,
      secondarySkills: prev.secondarySkills.filter(skill => skill !== skillToRemove)
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
  
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newJob);
    setShowModal(false);
  };

  if (!showModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Job Posting</h3>
          <button 
            onClick={() => setShowModal(false)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
      <X size={20} />
    </button>
  </div>
  
  <form onSubmit={handleCreateJob} className="p-6 space-y-6 font-rubik">
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
      <select
        name="skillCategory"
        value={newJob.skillCategory}
        onChange={handleInputChange}
        className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        required
      >
        <option value="">Select a category</option>
        <option value="frontend">Frontend Development</option>
        <option value="backend">Backend Development</option>
        <option value="fullstack">Full Stack Development</option>
        <option value="mobile">Mobile Development</option>
        <option value="devops">DevOps</option>
        <option value="data">Data Science</option>
        <option value="design">UI/UX Design</option>
        <option value="product">Product Management</option>
        <option value="marketing">Marketing</option>
        <option value="sales">Sales</option>
      </select>
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
          <option value="0-2">0-2 years</option>
          <option value="2-5">2-5 years</option>
          <option value="5-8">5-8 years</option>
          <option value="8+">8+ years</option>
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
              {[
                "React", "Angular", "Vue", "Node.js", "Python", "Java", ".NET", 
                "AWS", "Azure", "Docker", "Kubernetes"
              ].map((skill) => (
                <div 
                  key={skill} 
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                  onClick={() => togglePrimarySkill(skill)}
                >
                  <span>{skill}</span>
                  {newJob.primarySkills.includes(skill) && (
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
          {newJob.primarySkills.length > 0 ? (
            newJob.primarySkills.map((skill) => (
              <div key={skill} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                {skill}
                <button 
                  type="button"
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  onClick={() => removePrimarySkill(skill)}
                >
                  ×
                </button>
              </div>
            ))
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
              {[
                "React", "Angular", "Vue", "Node.js", "Python", "Java", ".NET", 
                "AWS", "Azure", "Docker", "Kubernetes"
              ].map((skill) => (
                <div 
                  key={skill} 
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleSecondarySkill(skill)}
                >
                  <span>{skill}</span>
                  {newJob.secondarySkills.includes(skill) && (
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
          {newJob.secondarySkills.length > 0 ? (
            newJob.secondarySkills.map((skill) => (
              <div key={skill} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                {skill}
                <button 
                  type="button"
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  onClick={() => removeSecondarySkill(skill)}
                >
                  ×
                </button>
              </div>
            ))
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
    
    {/* Attach Documents */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Attach Documents
      </label>
      <div className="flex flex-col gap-2">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PDF, JPG or PNG (max 5MB)</p>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
        
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
      >
        <option value="all">All verified users</option>
        <option value="skill-matched">Skill-matched profiles only (AI-recommended)</option>
        <option value="location-matched">Location-matched only</option>
        <option value="private">Private (shared via link or invite only)</option>
        <option value="remuneration-matched">Remuneration match only</option>
        <option value="availability-matched">Availability match only</option>
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
        className="bg-blue-500 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Create Job Posting
      </button>
    </div>
  </form>
      </div>
    </div>
  );
}