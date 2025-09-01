'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Briefcase, 
  Calendar,
  X,
  Pencil,
  Trash2,
  Plus,
  FileText,
  Upload
} from 'lucide-react';
import DomainFields, { itSubDomains, manufacturingSubDomains, bankingSubDomains, hospitalitySubDomains } from './DomainFields';
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
  primarySkills: string[];
  secondarySkills: string[];
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
}

export default function ProfileForm({ onSave, onCancel, initialData = [], showFormDirectly = false, isEditing = false, selectedTemplate }: ProfileFormProps) {
  const [profileEntries, setProfileEntries] = useState<ProfileEntry[]>(
    initialData.length > 0 ? initialData : []
  );
  
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
        primarySkills: selectedTemplate.sampleData?.skills?.slice(0, 3) || [],
        secondarySkills: selectedTemplate.sampleData?.skills?.slice(3) || [],
        resume: null
      };
      setEditingEntry(templateEntry);
      setShowEditForm(true);
    }
  }, [selectedTemplate, initialData.length]);
  
  const [editingEntry, setEditingEntry] = useState<ProfileEntry | null>(null);
  const [showEditForm, setShowEditForm] = useState(showFormDirectly || isEditing);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [activeSection, setActiveSection] = useState('resume');
  
  // Skills dropdown states
  const [primarySkillsDropdownOpen, setPrimarySkillsDropdownOpen] = useState(false);
  const [secondarySkillsDropdownOpen, setSecondarySkillsDropdownOpen] = useState(false);
  
  // Refs for click outside handling
  const primarySkillsDropdownRef = useRef<HTMLDivElement>(null);
  const secondarySkillsDropdownRef = useRef<HTMLDivElement>(null);
  
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
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle and remove functions for skills
  const togglePrimarySkill = (skill: string) => {
    if (!editingEntry) return;
    
    // Initialize primarySkills as an empty array if it doesn't exist
    const currentSkills = editingEntry.primarySkills || [];
    
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    
    setEditingEntry({
      ...editingEntry,
      primarySkills: updatedSkills
    });
  };
  
  const toggleSecondarySkill = (skill: string) => {
    if (!editingEntry) return;
    
    // Initialize secondarySkills as an empty array if it doesn't exist
    const currentSkills = editingEntry.secondarySkills || [];
    
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    
    setEditingEntry({
      ...editingEntry,
      secondarySkills: updatedSkills
    });
  };
  
  const removePrimarySkill = (skill: string) => {
    if (!editingEntry) return;
    
    // Initialize primarySkills as an empty array if it doesn't exist
    const currentSkills = editingEntry.primarySkills || [];
    
    setEditingEntry({
      ...editingEntry,
      primarySkills: currentSkills.filter(s => s !== skill)
    });
  };
  
  const removeSecondarySkill = (skill: string) => {
    if (!editingEntry) return;
    
    // Initialize secondarySkills as an empty array if it doesn't exist
    const currentSkills = editingEntry.secondarySkills || [];
    
    setEditingEntry({
      ...editingEntry,
      secondarySkills: currentSkills.filter(s => s !== skill)
    });
  };
  
  // Initialize the form with initial data or create a new entry
  useEffect(() => {
    // If we have initial data (for editing), use that
    if (initialData.length > 0 && !editingEntry) {
      const initialEntry = initialData[0];
      // Ensure skills arrays are properly initialized
      const entryWithSkills = {
        ...initialEntry,
        profileType: initialEntry.profileType || '', // Ensure profileType is always initialized
        primarySkills: Array.isArray(initialEntry.primarySkills) ? [...initialEntry.primarySkills] : [],
        secondarySkills: Array.isArray(initialEntry.secondarySkills) ? [...initialEntry.secondarySkills] : []
      };
      console.log('Initializing from initial data:', JSON.stringify(entryWithSkills));
      setEditingEntry(entryWithSkills);
      setShowEditForm(true); // Always show the form when we have initial data
    } 
    // Otherwise if showFormDirectly is true, create a new entry
    else if (showFormDirectly && !editingEntry) {
      setEditingEntry({
        id: crypto.randomUUID(),
        role: '',
        profileType: '', // Added required profileType field
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
        resume: null
      });
      setShowEditForm(true);
    }
  }, [showFormDirectly, editingEntry, initialData, isEditing]);
  
  const employmentTypes = ['Permanent', 'Contract', 'Internship'];
  const workNatures = ['Full-time', 'Part-time'];
  const workModes = ['WFO', 'WFH', 'Hybrid', 'No Preference'];
  const profileTypes = ['IT', 'Manufacturing', 'Banking', 'Hospitality', 'Others'];

  // IT Subdomain options
  const itSubDomains = [
    { value: 'IT1', label: 'Software Development & Services' },
    { value: 'IT2', label: 'Data & Emerging Tech' },
    { value: 'IT3', label: 'Cybersecurity & Networks' }
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
      resume: null
    });
    setShowEditForm(true);
  };

  const handleEditProfile = (entry: ProfileEntry) => {
    console.log('Original entry before edit:', JSON.stringify(entry));
    
    // Ensure skills arrays are initialized even for older entries that might not have them
    const entryToEdit = { 
      ...entry,
      profileType: entry.profileType || '', // Ensure profileType is always initialized
      primarySkills: Array.isArray(entry.primarySkills) ? [...entry.primarySkills] : [],
      secondarySkills: Array.isArray(entry.secondarySkills) ? [...entry.secondarySkills] : []
    };
    
    console.log('Editing profile with skills:', JSON.stringify(entryToEdit));
    
    setEditingEntry(entryToEdit);
    setShowEditForm(true);
  };

  const handleDeleteProfile = (id: string) => {
    setProfileEntries(profileEntries.filter(entry => entry.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingEntry) {
      setEditingEntry({
        ...editingEntry,
        [name]: value
      });
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

  const handleSaveEntry = () => {
    if (!editingEntry) return;
    
    // Validation
    if (!editingEntry.role || !editingEntry.employmentType || !editingEntry.natureOfWork || !editingEntry.workMode) {
      alert('Please fill in all required fields');
      return;
    }

    // Ensure skills arrays are properly initialized
    const updatedEntry = {
      ...editingEntry,
      primarySkills: Array.isArray(editingEntry.primarySkills) ? [...editingEntry.primarySkills] : [],
      secondarySkills: Array.isArray(editingEntry.secondarySkills) ? [...editingEntry.secondarySkills] : []
    };
    
    console.log('Saving entry with skills:', JSON.stringify(updatedEntry));

    // If editing existing entry, update it
    if (profileEntries.some(entry => entry.id === updatedEntry.id)) {
      setProfileEntries(profileEntries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ));
    } else {
      // Otherwise add new entry
      setProfileEntries([...profileEntries, updatedEntry]);
    }
    
    // If showFormDirectly is true, save the profile immediately
    if (showFormDirectly) {
      onSave([updatedEntry]);
    } else {
      setEditingEntry(null);
      setShowEditForm(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setShowEditForm(false);
    onCancel(); // Call the onCancel prop to close the modal
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                                  <span key={skill} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                    {skill}
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
                                  <span key={skill} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                    {skill}
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
                        subDomain: (newProfileType === 'IT' || newProfileType === 'Manufacturing') ? prev.subDomain : '' // Reset subdomain if not IT or Manufacturing
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
          {/* Resume Upload Button */}
          <div className="flex justify-center">
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
          </div>
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
                <input
                  type="text"
                  name="preferredCity"
                  value={editingEntry?.preferredCity || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Bangalore"
                />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Skills
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
                          {editingEntry?.primarySkills?.includes(skill) && (
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
                  {editingEntry?.primarySkills && Array.isArray(editingEntry.primarySkills) && editingEntry.primarySkills.length > 0 ? (
                    editingEntry.primarySkills.map((skill) => (
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
                    <span className={editingEntry?.secondarySkills?.length === 0 ? "text-gray-500" : ""}>
                      {editingEntry?.secondarySkills?.length === 0 ? 'Select secondary skills' : 'Secondary skills selected'}
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
                          {editingEntry?.secondarySkills?.includes(skill) && (
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
                  {editingEntry?.secondarySkills && Array.isArray(editingEntry.secondarySkills) && editingEntry.secondarySkills.length > 0 ? (
                    editingEntry.secondarySkills.map((skill) => (
                      <div key={skill} className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                        {skill}
                        <button 
                          type="button"
                          className="ml-1 text-green-600 hover:text-green-800"
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
              className="px-4 py-2 bg-[#007BCA] text-white rounded-lg hover:bg-[#007BCA]/80"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
