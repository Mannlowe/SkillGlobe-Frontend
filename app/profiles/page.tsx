'use client';

import { useState, useEffect } from 'react';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import StrategicProfileOptimizer from '@/components/dashboard/StrategicProfileOptimizer';
import ProfileAnalytics from '@/components/dashboard/ProfileAnalytics';
import ProfileForm, { ProfileEntry } from '@/components/profile/ProfileForm';
import ResumeTemplateSelector, { ResumeTemplate } from '@/components/profile/ResumeTemplateSelector';
import { mockProfileOptimizationHub, mockProfileAnalytics } from '@/lib/mockPhase3Data';
import { useToast } from '@/hooks/use-toast';
// Import useModals but use it inside useEffect to prevent infinite loop
import { useModals } from '@/store/uiStore';
import { Plus, User, Settings, Eye, Share2, Pencil, Trash2, AlertCircle, FileText, Download, X } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  type: string;
  completeness: number;
  views: number;
  isActive: boolean;
  template?: ResumeTemplate | null;
  formData?: ProfileEntry | null;
}

export default function ProfilesPage() {
  const { toast } = useToast();
  // Temporarily disable modal functionality to fix the infinite loop
  // We'll implement a simple local state modal system instead
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Define a type for our modal content
  type ModalContentType = {
    component: React.ComponentType<any>;
    props: Record<string, any>;
  } | null;
  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const [activeProfile, setActiveProfile] = useState('default');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<Profile | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: 'default',
      name: 'Main Profile',
      type: 'General',
      completeness: 85,
      views: 1247,
      isActive: true,
      template: null,
      formData: null
    },
    {
      id: 'frontend',
      name: 'Frontend Developer',
      type: 'Specialized',
      completeness: 92,
      views: 823,
      isActive: false,
      template: null,
      formData: null
    },
    {
      id: 'fullstack',
      name: 'Full Stack Engineer',
      type: 'Specialized',
      completeness: 78,
      views: 654,
      isActive: false,
      template: null,
      formData: null
    }
  ]);

  const handleTaskComplete = (taskId: string) => {
    console.log('Task completed:', taskId);
    toast({
      title: "Task Completed!",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleSkillAdd = (skill: string) => {
    console.log('Add skill:', skill);
    toast({
      title: "Skill Added!",
      description: `${skill} has been added to your profile.`,
    });
  };

  const handleCreateProfile = () => {
    setShowTemplateSelector(true);
    setIsModalOpen(true);
  };

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
    
    // Open ProfileForm with selected template
    setModalContent({
      component: ProfileForm,
      props: {
        selectedTemplate: template,
        showFormDirectly: true,
        onCancel: () => {
          setIsModalOpen(false);
          setSelectedTemplate(null);
          setShowTemplateSelector(false);
        },
        onSave: (entries: ProfileEntry[]) => {
          if (entries.length > 0) {
            const entry = entries[0];
            const newProfile = {
              id: entry.id || `profile-${Date.now()}`,
              name: entry.role || template.name,
              type: entry.profileType || 'Specialized',
              completeness: 60,
              views: 0,
              isActive: false,
              template: template,
              formData: entry
            };
            
            setProfiles(prevProfiles => [...prevProfiles, newProfile]);
            
            toast({
              title: "Profile Created",
              description: `Your new ${template.name} profile has been created successfully.`,
            });
          }
          setIsModalOpen(false);
          setSelectedTemplate(null);
          setShowTemplateSelector(false);
        }
      }
    });
  };

  const handleTemplateSelectorCancel = () => {
    setIsModalOpen(false);
    setShowTemplateSelector(false);
    setSelectedTemplate(null);
  };

  const handleProfileFormSave = (profileData: ProfileEntry[]) => {
    console.log('Profile data saved:', profileData);
    
    if (!profileData.length) return;
    
    const profileEntry = profileData[0];
    const existingProfileIndex = profiles.findIndex(p => p.id === profileEntry.id);
    
    if (existingProfileIndex >= 0) {
      // Update existing profile
      const updatedProfiles = [...profiles];
      updatedProfiles[existingProfileIndex] = {
        ...updatedProfiles[existingProfileIndex],
        name: profileEntry.role || updatedProfiles[existingProfileIndex].name,
        completeness: Math.min(updatedProfiles[existingProfileIndex].completeness + 5, 100), // Increase completeness slightly
        template: updatedProfiles[existingProfileIndex].template,
        formData: profileEntry
      };
      
      setProfiles(updatedProfiles);
      
      // Show toast notification
      setTimeout(() => {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }, 100);
    } else {
      // Create a new profile based on the form data
      const newProfile: Profile = {
        id: profileEntry.id || `profile-${Date.now()}`,
        name: profileEntry.role || 'New Profile',
        type: 'Specialized',
        completeness: 60,
        views: 0,
        isActive: false,
        template: null,
        formData: profileEntry
      };

      // Add the new profile to the list using a callback to avoid stale state
      setProfiles(prevProfiles => [...prevProfiles, newProfile]);
      
      // Show toast notification
      setTimeout(() => {
        toast({
          title: "Profile Created",
          description: "Your new profile has been created successfully.",
        });
      }, 100);
    }
    
    // Close the modal
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleProfileSelect = (profileId: string) => {
    setActiveProfile(profileId);
    const profile = profiles.find(p => p.id === profileId);
    toast({
      title: "Profile Switched",
      description: `Switched to ${profile?.name} profile.`,
    });
  };
  
  const handleEditProfile = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation(); // Prevent profile selection
    const profileToEdit = profiles.find(p => p.id === profileId);
    
    if (profileToEdit) {
      // Use stored form data if available, otherwise use defaults
      const profileEntry: ProfileEntry = profileToEdit.formData || {
        id: profileToEdit.id,
        role: profileToEdit.name,
        profileType: 'General',
        employmentType: 'Permanent',
        natureOfWork: 'Full-time',
        workMode: 'No Preference',
        minimumEarnings: '',
        currency: '',
        preferredCity: '',
        preferredCountry: '',
        totalExperience: '',
        relevantExperience: '',
        resume: null,
        primarySkills: [],
        secondarySkills: []
      };
      
      // Directly show the form with the profile data
      setModalContent({
        component: ProfileForm,
        props: {
          onSave: handleProfileFormSave,
          onCancel: () => setIsModalOpen(false),
          initialData: [profileEntry],
          showFormDirectly: true,
          isEditing: true
        }
      });
      setIsModalOpen(true);
    }
  };
  
  const handleDeleteClick = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation(); // Prevent profile selection
    setProfileToDelete(profileId);
    setDeleteModalOpen(true);
  };
  
  const confirmDeleteProfile = () => {
    if (profileToDelete) {
      setProfiles(profiles.filter(p => p.id !== profileToDelete));
      
      // If the deleted profile was active, set another one as active
      if (profileToDelete === activeProfile && profiles.length > 1) {
        const newActiveProfile = profiles.find(p => p.id !== profileToDelete)?.id || '';
        setActiveProfile(newActiveProfile);
      }
      
      toast({
        title: "Profile Deleted",
        description: "The profile has been deleted successfully.",
      });
      
      setDeleteModalOpen(false);
      setProfileToDelete(null);
    }
  };

  const handlePreviewResume = (profile: Profile) => {
    if (profile.template && profile.formData) {
      setPreviewProfile(profile);
      setShowResumePreview(true);
    }
  };

  const handleDownloadResume = (profile: Profile) => {
    if (profile.template && profile.formData) {
      downloadResumeAsPDF(profile);
    }
  };

  // Unified function to render all subdomain fields
  const renderSubdomainFields = (formData: ProfileEntry) => {
    if (!formData.profileType || !formData.subDomain) return null;

    const getSubdomainLabel = (profileType: string, subDomain: string) => {
      const labels: Record<string, Record<string, string>> = {
        'IT': {
          'IT1': 'Software Development & Services',
          'IT2': 'Data & Emerging Tech',
          'IT3': 'Cybersecurity & Networks'
        },
        'Manufacturing': {
          'MF1': 'Production & Operations',
          'MF2': 'Automotive & Engineering', 
          'MF3': 'Quality & Maintenance',
          'MF4': 'Supply Chain & Materials'
        },
        'Banking': {
          'BF1': 'Banking',
          'BF2': 'Finance & Investments',
          'BF3': 'Insurance',
          'BF4': 'FinTech & Payments'
        },
        'Hospitality': {
          'HS1': 'Hotels & Lodging',
          'HS2': 'Food & Beverages',
          'HS3': 'Travel & Tourism',
          'HS4': 'Events & Recreation'
        }
      };
      return labels[profileType]?.[subDomain] || subDomain;
    };

    const renderFieldArray = (fieldName: string, label: string) => {
      const values = (formData as any)[fieldName];
      if (!values || !Array.isArray(values) || values.length === 0) return null;
      
      return (
        <div className="mb-3">
          <p><strong>{label}:</strong></p>
          <div className="flex flex-wrap gap-1 mt-1">
            {values.map((value: string, index: number) => (
              <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                {value}
              </span>
            ))}
          </div>
        </div>
      );
    };

    const renderSingleField = (fieldName: string, label: string) => {
      const value = (formData as any)[fieldName];
      if (!value) return null;
      
      return (
        <div className="mb-2">
          <p><strong>{label}:</strong> {value}</p>
        </div>
      );
    };

    const renderSubdomainContent = () => {
      // IT Subdomain Fields
      if (formData.profileType === 'IT') {
        switch (formData.subDomain) {
          case 'IT1': // Software Development & Services
            return (
              <div>
                {renderSingleField('it_portfolio', 'Portfolio/GitHub')}
                {renderSingleField('it_dev_method', 'Development Methodology')}
                {renderFieldArray('it_domain_exp', 'Domain Expertise')}
                {renderFieldArray('it_tools_used', 'Tools & Platforms')}
              </div>
            );
          case 'IT2': // Data & Emerging Tech
            return (
              <div>
                {renderFieldArray('it_tools', 'Tools Used')}
                {renderFieldArray('it_data_domain_exp', 'Data Domain Focus')}
                {renderSingleField('it_research', 'Research/Papers')}
                {renderSingleField('it_data_projects', 'Major Projects')}
              </div>
            );
          case 'IT3': // Cybersecurity & Networks
            return (
              <div>
                {renderFieldArray('it_compliance', 'Compliance Standards')}
                {renderFieldArray('it_security_tools', 'Security Tools')}
                {renderFieldArray('it_incident_exp', 'Incident Handling')}
                {renderSingleField('it_security_clearance', 'Security Clearance')}
                {renderFieldArray('it_network_exp', 'Network Experience')}
              </div>
            );
        }
      }

      // Manufacturing Subdomain Fields
      if (formData.profileType === 'Manufacturing') {
        switch (formData.subDomain) {
          case 'MF1': // Production & Operations
            return (
              <div>
                {renderFieldArray('mf_production_area', 'Production Areas')}
                {renderFieldArray('mf_machine_handling', 'Machine Handling')}
                {renderSingleField('mf_shift_preference', 'Shift Preference')}
                {renderFieldArray('mf_safety_cert', 'Safety Certifications')}
              </div>
            );
          case 'MF2': // Automotive & Engineering
            return (
              <div>
                {renderFieldArray('mf_engineering_domain', 'Engineering Domain')}
                {renderFieldArray('mf_design_tools', 'Design Tools')}
                {renderFieldArray('mf_prototyping_exp', 'Prototyping Experience')}
                {renderFieldArray('mf_regulatory_knowledge', 'Regulatory Knowledge')}
              </div>
            );
          case 'MF3': // Quality & Maintenance
            return (
              <div>
                {renderFieldArray('mf_quality_tools', 'Quality Tools')}
                {renderFieldArray('mf_testing_methods', 'Testing Methods')}
                {renderFieldArray('mf_certifications_qm', 'QM Certifications')}
                {renderFieldArray('mf_maintenance_exp', 'Maintenance Experience')}
              </div>
            );
          case 'MF4': // Supply Chain & Materials
            return (
              <div>
                {renderFieldArray('mf_supply_area', 'Supply Chain Areas')}
                {renderFieldArray('mf_material_expertise', 'Material Expertise')}
                {renderFieldArray('mf_tools_used', 'Tools Used')}
                {renderFieldArray('mf_regulatory_compliance', 'Regulatory Compliance')}
              </div>
            );
        }
      }

      // Banking Subdomain Fields
      if (formData.profileType === 'Banking') {
        switch (formData.subDomain) {
          case 'BF1': // Banking
            return (
              <div>
                {renderFieldArray('bf_banking_domain', 'Banking Domain')}
                {renderFieldArray('bf_core_banking_systems', 'Core Banking Systems')}
                {renderFieldArray('bf_regulatory_exp', 'Regulatory Experience')}
                {renderFieldArray('bf_compliance_knowledge', 'Compliance Knowledge')}
              </div>
            );
          case 'BF2': // Finance & Investments
            return (
              <div>
                {renderFieldArray('bf_finance_area', 'Finance Focus Areas')}
                {renderFieldArray('bf_erp_tools', 'ERP Tools')}
                {renderFieldArray('bf_reporting_standards', 'Reporting Standards')}
                {renderFieldArray('bf_industry_experience', 'Industry Experience')}
              </div>
            );
          case 'BF3': // Insurance
            return (
              <div>
                {renderFieldArray('bf_insurance_domain', 'Insurance Domain')}
                {renderFieldArray('bf_insurance_products', 'Insurance Products')}
                {renderFieldArray('bf_licensing', 'Licensing')}
                {renderFieldArray('bf_claims_exp', 'Claims Experience')}
              </div>
            );
          case 'BF4': // FinTech & Payments
            return (
              <div>
                {renderFieldArray('bf_payment_systems', 'Payment Systems')}
                {renderFieldArray('bf_digital_platforms', 'Digital Platforms')}
                {renderFieldArray('bf_regtech_knowledge', 'RegTech Knowledge')}
                {renderFieldArray('bf_security_compliance', 'Security Compliance')}
              </div>
            );
        }
      }

      // Hospitality Subdomain Fields
      if (formData.profileType === 'Hospitality') {
        switch (formData.subDomain) {
          case 'HS1': // Hotels & Lodging
            return (
              <div>
                {renderSingleField('hs_department', 'Department')}
                {renderFieldArray('hs_property_type', 'Property Types')}
                {renderFieldArray('hs_guest_mgmt_system', 'Guest Management Systems')}
                {renderFieldArray('hs_languages_known', 'Languages Known')}
              </div>
            );
          case 'HS2': // Food & Beverages
            return (
              <div>
                {renderFieldArray('hs_fnb_specialization', 'F&B Specialization')}
                {renderFieldArray('hs_service_type', 'Service Types')}
                {renderFieldArray('hs_fnb_certifications', 'F&B Certifications')}
                {renderFieldArray('hs_beverage_knowledge', 'Beverage Knowledge')}
              </div>
            );
          case 'HS3': // Travel & Tourism
            return (
              <div>
                {renderFieldArray('hs_travel_domain', 'Travel Domain')}
                {renderFieldArray('hs_ticketing_systems', 'Ticketing Systems')}
                {renderFieldArray('hs_destination_expertise', 'Destination Expertise')}
                {renderFieldArray('hs_customer_type', 'Customer Types')}
              </div>
            );
          case 'HS4': // Events & Recreation
            return (
              <div>
                {renderFieldArray('hs_event_type', 'Event Types')}
                {renderFieldArray('hs_event_skills', 'Event Skills')}
                {renderFieldArray('hs_ticketing_platforms', 'Ticketing Platforms')}
                {renderFieldArray('hs_property_type_event', 'Venue Types')}
              </div>
            );
        }
      }

      return null;
    };

    const content = renderSubdomainContent();
    if (!content) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">
          {getSubdomainLabel(formData.profileType, formData.subDomain)} Specialization
        </h4>
        {content}
      </div>
    );
  };

  const downloadResumeAsPDF = (profile: Profile) => {
    const { template, formData } = profile;
    if (!template || !formData) return;

    // Create HTML content for the resume
    const resumeHTML = generateResumeHTML(template, formData);
    
    // Create a temporary element to render the resume
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${formData.role || 'Resume'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .resume-container { max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; }
            .skills { display: flex; flex-wrap: wrap; gap: 8px; }
            .skill-tag { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${resumeHTML}
        </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
      toast({
        title: "Download Started",
        description: "Your resume is being downloaded...",
      });
    }
  };

  const generateResumeHTML = (template: ResumeTemplate, formData: ProfileEntry): string => {
    const commonData = {
      name: formData.role || 'Professional',
      location: formData.preferredCity || 'Location',
      totalExp: formData.totalExperience || 'N/A',
      relevantExp: formData.relevantExperience || 'N/A',
      primarySkills: formData.primarySkills || [],
      secondarySkills: formData.secondarySkills || [],
      employmentType: formData.employmentType || '',
      workMode: formData.workMode || '',
      earnings: formData.minimumEarnings || ''
    };

    switch (template.id) {
      case 'classic':
        return `
          <div class="resume-container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">${commonData.name.toUpperCase()}</h1>
              <p style="margin: 5px 0; color: #666;">${commonData.location}</p>
            </div>
            
            <div class="section">
              <div class="section-title">Experience</div>
              <p>Total Experience: ${commonData.totalExp} years</p>
              <p>Relevant Experience: ${commonData.relevantExp} years</p>
              <p>Employment Type: ${commonData.employmentType}</p>
              <p>Work Mode: ${commonData.workMode}</p>
            </div>
            
            <div class="section">
              <div class="section-title">Primary Skills</div>
              <div class="skills">
                ${commonData.primarySkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Secondary Skills</div>
              <div class="skills">
                ${commonData.secondarySkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
          </div>
        `;
      
      case 'modern':
        return `
          <div class="resume-container" style="text-align: center;">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">${commonData.name.toUpperCase()}</h1>
              <p style="margin: 5px 0; color: #666;">${commonData.location}</p>
            </div>
            
            <div class="section">
              <div class="section-title">Professional Summary</div>
              <p>${commonData.totalExp} years of professional experience in ${commonData.name.toLowerCase()}</p>
            </div>
            
            <div class="section">
              <div class="section-title">Key Skills</div>
              <div class="skills" style="justify-content: center;">
                ${commonData.primarySkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Additional Skills</div>
              <div class="skills" style="justify-content: center;">
                ${commonData.secondarySkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
          </div>
        `;
      
      case 'creative':
        return `
          <div class="resume-container" style="display: flex; min-height: 600px;">
            <div style="width: 65%; padding-right: 20px;">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">${commonData.name.toUpperCase()}</h1>
                <p style="margin: 5px 0; color: #666;">${commonData.location}</p>
              </div>
              
              <div class="section">
                <div class="section-title">Objective</div>
                <p>Creative professional with ${commonData.totalExp} years of experience seeking opportunities in ${commonData.name.toLowerCase()}.</p>
              </div>
              
              <div class="section">
                <div class="section-title">Experience</div>
                <p>Total Experience: ${commonData.totalExp} years</p>
                <p>Relevant Experience: ${commonData.relevantExp} years</p>
              </div>
            </div>
            
            <div style="width: 35%; background: #1e3a8a; color: white; padding: 20px;">
              <div class="section">
                <div class="section-title" style="color: white;">Skills</div>
                ${commonData.primarySkills.map(skill => `<p style="margin: 5px 0;">• ${skill}</p>`).join('')}
              </div>
              
              <div class="section">
                <div class="section-title" style="color: white;">Additional Skills</div>
                ${commonData.secondarySkills.slice(0, 5).map(skill => `<p style="margin: 5px 0;">• ${skill}</p>`).join('')}
              </div>
            </div>
          </div>
        `;
      
      default:
        return `<div class="resume-container"><h1>${commonData.name}</h1><p>${commonData.location}</p></div>`;
    }
  };

  const renderResumePreview = (profile: Profile) => {
    if (!profile.template || !profile.formData) return null;

    const { template, formData } = profile;
    
    return (
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Resume Preview - {template.name}</h4>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePreviewResume(profile)}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </button>
            <button
              onClick={() => handleDownloadResume(profile)}
              className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render the modal if it's open and has content
  const renderModal = () => {
    if (isModalOpen) {
      if (showTemplateSelector) {
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <ResumeTemplateSelector
                onTemplateSelect={handleTemplateSelect}
                onCancel={handleTemplateSelectorCancel}
              />
            </div>
          </div>
        );
      } else if (modalContent) {
        const ModalComponent = modalContent.component;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl p-6 shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <ModalComponent {...modalContent.props} />
            </div>
          </div>
        );
      }
    }
    return null;
  };
  
  // Render delete confirmation modal
  const renderDeleteModal = () => {
    if (!deleteModalOpen) return null;
    
    const profileName = profiles.find(p => p.id === profileToDelete)?.name || 'this profile';
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Delete Profile</h3>
            <p className="text-gray-600">
              Are you sure you want to delete <span className="font-medium">{profileName}</span>? This action cannot be undone.
            </p>
            <div className="flex space-x-3 w-full pt-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProfile}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render full-size resume preview modal
  const renderResumePreviewModal = () => {
    if (!showResumePreview || !previewProfile) return null;

    const { template, formData } = previewProfile;
    if (!template || !formData) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              Resume Preview - {template.name}
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDownloadResume(previewProfile)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => setShowResumePreview(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 font-nunito">
            <div className="bg-white border rounded-lg p-8 min-h-[600px]" style={{ fontFamily: 'Arial, sans-serif' }}>
              {template.id === 'classic' && (
                <div>
                  <div className="border-b-2 border-gray-800 pb-4 mb-6">
                    <h1 className="text-3xl font-bold mb-2">{formData.role?.toUpperCase() || 'PROFESSIONAL'}</h1>
                    <p className="text-gray-600 text-lg">{formData.preferredCity || 'Location'}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3 uppercase">Experience</h2>
                    <div className="space-y-2">
                      <p><strong>Total Experience:</strong> {formData.totalExperience || 'N/A'} years</p>
                      <p><strong>Relevant Experience:</strong> {formData.relevantExperience || 'N/A'} years</p>
                      <p><strong>Employment Type:</strong> {formData.employmentType || 'Not specified'}</p>
                      <p><strong>Work Mode:</strong> {formData.workMode || 'Not specified'}</p>
                      {formData.minimumEarnings && (
                        <p><strong>Expected Salary:</strong> {formData.minimumEarnings} {formData.currency || ''}</p>
                      )}
                    </div>
                  </div>
                  
                  {formData.profileType && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold mb-3 uppercase">{formData.profileType} Specialization</h2>
                      <div className="space-y-2">
                        <p className="text-gray-700">Specialized in {formData.profileType} domain</p>
                        {renderSubdomainFields(formData)}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3 uppercase">Primary Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {formData.primarySkills?.map(skill => (
                        <span key={skill} className="bg-gray-200 px-3 py-1 rounded text-sm">{skill}</span>
                      )) || <p className="text-gray-500">No primary skills added</p>}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3 uppercase">Secondary Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {formData.secondarySkills?.map(skill => (
                        <span key={skill} className="bg-gray-100 px-3 py-1 rounded text-sm">{skill}</span>
                      )) || <p className="text-gray-500">No secondary skills added</p>}
                    </div>
                  </div>
                </div>
              )}
              
              {template.id === 'modern' && (
                <div className="text-center">
                  <div className="border-b-2 border-gray-800 pb-4 mb-6">
                    <h1 className="text-3xl font-bold mb-2">{formData.role?.toUpperCase() || 'PROFESSIONAL'}</h1>
                    <p className="text-gray-600 text-lg">{formData.preferredCity || 'Location'}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3 uppercase">Professional Summary</h2>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                      {formData.totalExperience || 'N/A'} years of professional experience in {formData.role?.toLowerCase() || 'the field'}
                      {formData.profileType && `, specializing in ${formData.profileType}`}, 
                      with expertise in {formData.primarySkills?.slice(0, 3).join(', ') || 'various technologies'}.
                    </p>
                  </div>
                  
                  {formData.profileType && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold mb-3 uppercase">{formData.profileType} Specialization</h2>
                      <p className="text-gray-700 max-w-2xl mx-auto">
                        Specialized expertise in {formData.profileType} domain with focus on industry best practices.
                      </p>
                      {renderSubdomainFields(formData)}
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3 uppercase">Key Skills</h2>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {formData.primarySkills?.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">{skill}</span>
                      )) || <p className="text-gray-500">No skills added</p>}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3 uppercase">Additional Skills</h2>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {formData.secondarySkills?.map(skill => (
                        <span key={skill} className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">{skill}</span>
                      )) || <p className="text-gray-500">No additional skills added</p>}
                    </div>
                  </div>
                </div>
              )}
              
              {template.id === 'creative' && (
                <div className="flex min-h-[600px] font-nunito">
                  <div className="w-2/3 pr-8">
                    <div className="mb-6">
                      <h1 className="text-3xl font-bold mb-2">{formData.role?.toUpperCase() || 'PROFESSIONAL'}</h1>
                      <p className="text-gray-600 text-lg">{formData.preferredCity || 'Location'}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h2 className="text-lg font-bold mb-3 uppercase">Objective</h2>
                      <p className="text-gray-700">
                        Creative professional with {formData.totalExperience || 'N/A'} years of experience seeking opportunities 
                        in {formData.role?.toLowerCase() || 'the creative field'}. Passionate about delivering innovative solutions 
                        and exceptional user experiences.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h2 className="text-lg font-bold mb-3 uppercase">Experience</h2>
                      <div className="space-y-2">
                        <p><strong>Total Experience:</strong> {formData.totalExperience || 'N/A'} years</p>
                        <p><strong>Relevant Experience:</strong> {formData.relevantExperience || 'N/A'} years</p>
                        <p><strong>Work Preference:</strong> {formData.workMode || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    {formData.profileType && (
                      <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3 uppercase">{formData.profileType} Expertise</h2>
                        <p className="text-gray-700">
                          Specialized knowledge and experience in {formData.profileType} domain.
                        </p>
                        {renderSubdomainFields(formData)}
                      </div>
                    )}
                  </div>
                  
                  <div className="w-1/3 bg-blue-900 text-white p-6">
                    <div className="mb-6">
                      {/* <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4"></div> */}
                      <div className="text-center text-sm">
                        <p>{formData.preferredCity || 'Location'}</p>
                        {formData.minimumEarnings && (
                          <p>Expected: {formData.minimumEarnings} {formData.currency || ''}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-bold mb-3 uppercase">Skills</h3>
                      <div className="space-y-2">
                        {formData.primarySkills?.map(skill => (
                          <p key={skill} className="text-sm">• {skill}</p>
                        )) || <p className="text-sm">No skills added</p>}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-bold mb-3 uppercase">Additional Skills</h3>
                      <div className="space-y-2">
                        {formData.secondarySkills?.slice(0, 5).map(skill => (
                          <p key={skill} className="text-sm">• {skill}</p>
                        )) || <p className="text-sm">No additional skills</p>}
                      </div>
                    </div>
                    
                    {formData.profileType && (
                      <div className="mb-6">
                        <p className="text-sm">Domain Specialization</p>
                        <h3 className="font-bold mb-3 uppercase">{formData.profileType}</h3>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ModernLayoutWrapper>
      {renderModal()}
      {renderDeleteModal()}
      {renderResumePreviewModal()}
      <div className="space-y-8 font-rubik">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Professional Profiles</h1>
            <p className="text-gray-600 mt-2">Manage multiple professional profiles for different career paths</p>
          </div>
          
          <button 
            onClick={handleCreateProfile}
            className=" flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            Add Profile
          </button>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => handleProfileSelect(profile.id)}
              className={`bg-white rounded-xl shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${
                activeProfile === profile.id ? 'border-orange-500 ring-2 ring-orange-100' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    activeProfile === profile.id ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    <User className={`w-6 h-6 ${
                      activeProfile === profile.id ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                    {/* <p className="text-sm text-gray-600">{profile.type}</p> */}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {profile.isActive && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mr-2">
                      Active
                    </span>
                  )}
                  <button 
                    onClick={(e) => handleEditProfile(e, profile.id)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteClick(e, profile.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completeness</span>
                    <span className="font-medium">{profile.completeness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${profile.completeness}%` }}
                    ></div>
                  </div>
                </div>

                {/* Resume Preview Section */}
                {renderResumePreview(profile)}

                {/* <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{profile.views} views</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* Active Profile Management */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Optimize: {profiles.find(p => p.id === activeProfile)?.name}
          </h2>

          {/* Strategic Profile Optimizer */}
          <StrategicProfileOptimizer
            profileData={mockProfileOptimizationHub}
            completionTasks={mockProfileOptimizationHub.strategic_completion.completion_priorities}
            onTaskComplete={handleTaskComplete}
            onSkillAdd={handleSkillAdd}
            marketImpactMode={true}
          />
          
          {/* Profile Analytics */}
          <ProfileAnalytics
            analytics={mockProfileAnalytics}
            onViewDetails={(section) => console.log('View details:', section)}
          />
        </div>
      </div>
    </ModernLayoutWrapper>
  );
}