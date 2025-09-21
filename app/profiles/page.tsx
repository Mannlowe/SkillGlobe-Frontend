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
import { useRoleBasedProfileStore, type Profile } from '@/store/role-based-profile/rolebasedprofileStore';
import { useResumeTemplateStore } from '@/store/resume-template/resumetemplateStore';
import { Plus, User, Settings, Eye, Share2, Pencil, Trash2, AlertCircle, FileText, Download, X, Loader2, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { getAuthData } from '@/utils/auth';
import { deleteRoleBasedProfile } from '@/app/api/Role Based Profile/rolebasedProfile';

// Profile interface is now imported from the store

export default function ProfilesPage() {
  const { toast } = useToast();

  // Store state
  const {
    profiles,
    isLoading,
    error,
    activeProfile,
    fetchRoleBasedProfiles,
    setActiveProfile,
    addProfile,
    updateProfile,
    clearError,
    resetStore
  } = useRoleBasedProfileStore();

  // Resume template store
  const {
    profilePreviewData,
    isLoadingPreview,
    previewError,
    fetchProfilePreview,
    clearPreviewData,
    clearPreviewError
  } = useResumeTemplateStore();

  // Local UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Define a type for our modal content
  type ModalContentType = {
    component: React.ComponentType<any>;
    props: Record<string, any>;
  } | null;
  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<Profile | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchRoleBasedProfiles();

    // Cleanup on unmount
    return () => {
      resetStore();
    };
  }, [fetchRoleBasedProfiles, resetStore]);

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
          // Note: The ProfileForm's createRoleBasedProfile already handles adding the profile
          // and refreshing the list, so we don't need to manually add it here
          if (entries.length > 0) {
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

    if (!profileData.length || !profiles) return;

    const profileEntry = profileData[0];
    const existingProfileIndex = profiles.findIndex(p => p.id === profileEntry.id);

    if (existingProfileIndex >= 0) {
      // Update the profile using the store action
      updateProfile(profileEntry.id, {
        name: profileEntry.role || profiles[existingProfileIndex].name,
        completeness: Math.min(profiles[existingProfileIndex].completeness + 5, 100),
        formData: profileEntry
      });

      // Show toast notification
      setTimeout(() => {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }, 100);
    } else {
      console.log('New profile creation should be handled by the store\'s createRoleBasedProfile function');

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

  const handleSetActiveProfile = (profileId: string) => {
    setActiveProfile(profileId);
    toast({
      title: "Profile Switched",
      description: `Switched to ${profileId} profile.`,
    });
  };

  const handleProfileSelect = (profileId: string) => {
    handleSetActiveProfile(profileId);
  };

  const handleEditProfile = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation(); // Prevent profile selection
    const profileToEdit = (profiles || []).find(p => p.id === profileId);

    if (profileToEdit) {
      // Use the formData from the profile which already has the correct domain and subdomain
      const profileEntry: ProfileEntry = profileToEdit.formData ? {
        ...profileToEdit.formData,
        // Ensure required fields are present
        id: profileToEdit.id,
        primarySkills: profileToEdit.formData.primarySkills || [],
        secondarySkills: profileToEdit.formData.secondarySkills || []
      } : {
        // Fallback if formData is not available
        id: profileToEdit.id,
        role: profileToEdit.name,
        profileType: profileToEdit.space || 'General',
        subDomain: '',
        employmentType: profileToEdit.employmentType || 'Permanent',
        natureOfWork: 'Full-time',
        workMode: profileToEdit.workMode || 'No Preference',
        minimumEarnings: profileToEdit.minEarnings?.toString() || '',
        currency: profileToEdit.currency || '',
        preferredCity: '',
        preferredCountry: '',
        totalExperience: profileToEdit.experience?.toString() || '',
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

  const confirmDeleteProfile = async () => {
    if (profileToDelete) {
      try {
        const authData = getAuthData();
        if (!authData || !authData.entityId || !authData.apiKey || !authData.apiSecret) {
          throw new Error('Authentication data not found');
        }

        await deleteRoleBasedProfile(
          authData.entityId,
          profileToDelete,
          authData.apiKey,
          authData.apiSecret
        );

        // Refresh profiles list after successful deletion
        await fetchRoleBasedProfiles();

        setDeleteModalOpen(false);
        setProfileToDelete(null);
        toast({
          title: "Profile Deleted",
          description: "The profile has been successfully deleted.",
        });
      } catch (error: any) {
        console.error('Delete profile error:', error);
        toast({
          title: "Delete Failed",
          description: error.message || "Failed to delete profile. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePreviewResume = async (profile: Profile) => {
    try {
      // Clear any previous preview data and errors
      clearPreviewData();
      clearPreviewError();

      // Get auth data for entity_id
      const authData = getAuthData();
      if (!authData?.entityId) {
        toast({
          title: "Error",
          description: "Authentication data not found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      // Debug logs
      console.log('Profile object:', profile);
      console.log('Profile ID (should be RBP00001):', profile.id);
      console.log('Profile name (role title):', profile.name);
      console.log('Entity ID:', authData.entityId);

      // Fetch profile preview data from API - use profile.id instead of profile.name
      await fetchProfilePreview(profile.id); // Pass the profile ID (e.g., "RBP00001")

      // Set the profile for preview and show modal
      setPreviewProfile(profile);
      setShowResumePreview(true);

    } catch (error) {
      console.error('Error fetching profile preview:', error);
      toast({
        title: "Error",
        description: "Failed to load profile preview data. Please try again.",
        variant: "destructive",
      });
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
    const resumeHTML = generateResumeHTML(formData);

    // Create a temporary element to render the resume
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${formData.role || 'Resume'}</title>
          <style>
            body { font-family: 'Nunito', Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .resume-container { max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 25px; }
            .section { margin-bottom: 25px; }
            .section-title { font-weight: bold; font-size: 16px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #111; }
            h1 { font-size: 28px; margin: 0 0 5px 0; }
            h2 { font-size: 20px; margin: 0 0 10px 0; color: #444; font-weight: 500; }
            h3 { font-size: 16px; margin: 10px 0 8px 0; font-weight: 600; }
            h4 { font-size: 15px; margin: 0; font-weight: 500; }
            p { margin: 5px 0; line-height: 1.5; }
            strong { font-weight: 600; }
            
            /* Skills styling */
            .skills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
            
            /* Print optimization */
            @media print { 
              body { margin: 0; }
              .resume-container { max-width: 100%; }
              .section { page-break-inside: avoid; }
            }
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

  const generateResumeHTML = (formData: ProfileEntry): string => {
    // Get portfolio and role-based profile data from the store
    const { profilePreviewData } = useResumeTemplateStore.getState();

    // If we have preview data, use it; otherwise, fall back to form data
    const portfolio = profilePreviewData?.portfolio || {
      first_name: '',
      last_name: '',
      email: '',
      mobile_no: '',
      city: formData.preferredCity || '',
      country: '',
      linkedin_profile: '',
      facebook_profile: '',
      twitter_handle: '',
      instagram_handle: '',
      professional_summary: '',
      education: [],
      work_experience: []
    };

    const role_based_profile = profilePreviewData?.role_based_profile || {
      name: formData.id || '',
      role: formData.role || 'Professional',
      desired_job_role: '',
      space: formData.profileType || '',
      industry: '',
      career_level: '',
      employment_type: formData.employmentType || '',
      nature_of_work: formData.natureOfWork || '',
      work_mode: formData.workMode || '',
      relevant_experience: parseInt(formData.relevantExperience || '0'),
      total_experience_years: formData.totalExperience || '',
      certifications: '',
      primary_skills: formData.primarySkills || [],
      secondary_skills: formData.secondarySkills || []
    };

    // Generate resume HTML that matches the preview
    return `
      <div class="resume-container">
        <!-- Header Section -->
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">${portfolio.first_name || ''} ${portfolio.last_name || ''}</h1>
          <h2 style="margin: 5px 0; font-size: 18px; color: #444;">${role_based_profile.role || ''}</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px; font-size: 14px; color: #666;">
            ${portfolio.email ? `<div>${portfolio.email}</div>` : ''}
            ${portfolio.mobile_no ? `<div>${portfolio.mobile_no}</div>` : ''}
            ${(portfolio.city || portfolio.country) ? `<div>${[portfolio.city, portfolio.country].filter(Boolean).join(', ')}</div>` : ''}
            ${portfolio.linkedin_profile ? `<div>LinkedIn: ${portfolio.linkedin_profile}</div>` : ''}
            ${portfolio.facebook_profile ? `<div>Facebook: ${portfolio.facebook_profile}</div>` : ''}
            ${portfolio.twitter_handle ? `<div>Twitter: ${portfolio.twitter_handle}</div>` : ''}
            ${portfolio.instagram_handle ? `<div>Instagram: ${portfolio.instagram_handle}</div>` : ''}
          </div>
        </div>
        
        <!-- Professional Summary -->
        ${portfolio.professional_summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p style="margin-top: 5px; line-height: 1.5;">${portfolio.professional_summary}</p>
        </div>
        ` : ''}
        
        <!-- Experience Section -->
        <div class="section">
          <div class="section-title">Experience</div>
          <div style="margin-top: 10px;">
            <p><strong>Total Experience:</strong> ${role_based_profile.total_experience_years || 'N/A'} ${role_based_profile.total_experience_years ? 'years' : ''}</p>
            <p><strong>Relevant Experience:</strong> ${role_based_profile.relevant_experience || 'N/A'} ${role_based_profile.relevant_experience ? 'years' : ''}</p>
            <p><strong>Employment Type:</strong> ${role_based_profile.employment_type || 'N/A'}</p>
            <p><strong>Work Mode:</strong> ${role_based_profile.work_mode || 'N/A'}</p>
            <p><strong>Nature of Work:</strong> ${role_based_profile.nature_of_work || 'N/A'}</p>
          </div>
          
          <!-- Work Experience Details -->
          ${portfolio.work_experience && portfolio.work_experience.length > 0 ? `
          <div style="margin-top: 15px;">
            <h3 style="font-size: 16px; margin-bottom: 10px;">Work History</h3>
            <div>
              ${portfolio.work_experience.map((exp: any) => `
                <div style="border-left: 2px solid #3b82f6; padding-left: 15px; margin-bottom: 15px;">
                  <h4 style="margin: 0; font-size: 15px;">Designation: ${exp.designation || 'Position'}</h4>
                  <p style="margin: 3px 0; color: #555;">Company: ${exp.company || 'Company'}</p>
                  ${exp.description ? `<p style="margin: 5px 0; font-size: 14px;">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>
        
        <!-- Skills Section -->
        <div class="section">
          <div class="section-title">Skills</div>
          
          <!-- Primary Skills -->
          ${role_based_profile.primary_skills && role_based_profile.primary_skills.length > 0 ? `
          <div style="margin-top: 10px;">
            <h3 style="font-size: 16px; margin-bottom: 8px;">Primary Skills</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${role_based_profile.primary_skills.map((skill: any) => `
                <span style="background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 15px; font-size: 13px;">
                  ${typeof skill === 'string' ? skill : skill.skill_name || skill.canonical_name || skill.skill || ''}
                </span>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          <!-- Secondary Skills -->
          ${role_based_profile.secondary_skills && role_based_profile.secondary_skills.length > 0 ? `
          <div style="margin-top: 15px;">
            <h3 style="font-size: 16px; margin-bottom: 8px;">Secondary Skills</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${role_based_profile.secondary_skills.map((skill: any) => `
                <span style="background: #f3f4f6; color: #4b5563; padding: 4px 10px; border-radius: 15px; font-size: 13px;">
                  ${typeof skill === 'string' ? skill : skill.skill_name || skill.canonical_name || skill.skill || ''}
                </span>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>
        
        <!-- Education Section -->
        ${portfolio.education && portfolio.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          <div style="margin-top: 10px;">
            ${portfolio.education.map((edu: any) => `
              <div style="border-left: 2px solid #22c55e; padding-left: 15px; margin-bottom: 15px;">
                <p style="margin: 3px 0; font-weight: 500;">Stream: ${edu.stream || 'Degree'}</p>
                <p style="margin: 3px 0;">University: ${edu.university_board || 'Institution'}</p>
                <p style="margin: 3px 0;">Year of Completion: ${edu.year_of_completion || 'Year'}</p>
                ${edu.grade ? `<p style="margin: 3px 0;">Grade: ${edu.grade}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <!-- Certifications -->
        ${role_based_profile.certifications ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          <p style="margin-top: 5px;">${role_based_profile.certifications}</p>
        </div>
        ` : ''}
        
        <!-- Additional Information -->
        <div class="section">
          <div class="section-title">Additional Information</div>
          <div style="margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <p><strong>Space:</strong> ${role_based_profile.space || 'N/A'}</p>
              ${role_based_profile.industry ? `<p><strong>Industry:</strong> ${role_based_profile.industry}</p>` : ''}
              ${role_based_profile.career_level ? `<p><strong>Career Level:</strong> ${role_based_profile.career_level}</p>` : ''}
            </div>
            <div>
              ${role_based_profile.desired_job_role ? `<p><strong>Desired Role:</strong> ${role_based_profile.desired_job_role}</p>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderResumePreview = (profile: Profile) => {
    if (!profile.template || !profile.formData) return null;

    const { template, formData } = profile;

    return (
      <div className="mt-4 bg-white rounded-lg p-4 h-12">
        <div className="flex items-end justify-end mb-3">
          {/* <h4 className="font-medium text-gray-900">Resume Preview</h4> */}
          <div className="flex space-x-2">
            <button
              onClick={() => handlePreviewResume(profile)}
              className="flex items-center px-3 py-1.5 text-sm bg-[#007BCA] text-white rounded-md hover:bg-white hover:text-[#007BCA] border hover:border-[#007BCA] transition-colors"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview & Download
            </button>
            {/* <button
            onClick={() => handleDownloadResume(profile)}
              className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </button> */}
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

    const profileName = (profiles || []).find(p => p.id === profileToDelete)?.name || 'this profile';

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

    // Show loading state while fetching data
    if (isLoadingPreview) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading resume preview...</p>
          </div>
        </div>
      );
    }

    // Show error state if API call failed
    if (previewError) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Preview</h3>
            <p className="text-gray-600 mb-4">{previewError}</p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => handlePreviewResume(previewProfile)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => setShowResumePreview(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Show resume preview with API data
    if (!profilePreviewData) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600">No preview data available</p>
            <button
              onClick={() => setShowResumePreview(false)}
              className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    const { portfolio, role_based_profile } = profilePreviewData;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-nunito">
        <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              Resume Preview - {role_based_profile.role}
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
                onClick={() => {
                  setShowResumePreview(false);
                  clearPreviewData();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 font-nunito">
            <div className="bg-white border rounded-lg p-8 min-h-[600px]">
              {/* Header Section */}
              <div className="border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-3xl font-bold mb-2">
                  {portfolio.first_name} {portfolio.last_name}
                </h1>
                <h2 className="text-xl text-gray-700 mb-2">{role_based_profile.role}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {portfolio.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {portfolio.email}
                    </div>
                  )}
                  {portfolio.mobile_no && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {portfolio.mobile_no}
                    </div>
                  )}
                  {(portfolio.city || portfolio.country) && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {[portfolio.city, portfolio.country].filter(Boolean).join(', ')}
                    </div>
                  )}
                  {portfolio.linkedin_profile && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {portfolio.linkedin_profile}
                    </div>
                  )}
                  {portfolio.facebook_profile && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {portfolio.facebook_profile}
                    </div>
                  )}
                  {portfolio.twitter_handle && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {portfolio.twitter_handle}
                    </div>
                  )}
                  {portfolio.instagram_handle && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {portfolio.instagram_handle}
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              {portfolio.professional_summary && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3 uppercase">Professional Summary</h2>
                  <p className="text-gray-700 leading-relaxed">{portfolio.professional_summary}</p>
                </div>
              )}

              {/* Experience Section */}
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-3 uppercase">Experience</h2>
                <div className="space-y-2">
                  {role_based_profile.total_experience_years !== null && (
                    <p>
                      <strong>Total Experience:</strong> {role_based_profile.total_experience_years} years
                    </p>
                  )}
                  {role_based_profile.relevant_experience !== null && (
                    <p>
                      <strong>Relevant Experience:</strong> {role_based_profile.relevant_experience} years
                    </p>
                  )}

                  <p><strong>Employment Type:</strong> {role_based_profile.employment_type}</p>
                  <p><strong>Work Mode:</strong> {role_based_profile.work_mode}</p>
                  <p><strong>Nature of Work:</strong> {role_based_profile.nature_of_work}</p>
                </div>

                {/* Work Experience Details */}
                {portfolio.work_experience && portfolio.work_experience.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Work History</h3>
                    <div className="space-y-3">
                      {portfolio.work_experience.map((exp: any, index: number) => (
                        <div key={index} className="border-l-2 border-blue-500 pl-4">
                          <h4 className="font-medium">Designation : {exp.designation || 'designation'}</h4>
                          <p className="text-gray-600">Company : {exp.company || 'Company'}</p>
                          {/* <p className="text-sm text-gray-500">{exp.duration || 'Duration'}</p> */}
                          {exp.description && <p className="text-sm mt-1">Description : {exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {portfolio.education && portfolio.education.length > 0 && (
                <div className="mb-6 font-nunito">
                  <h2 className="text-lg font-bold mb-3 uppercase">Education</h2>
                  <div className="space-y-3">
                    {portfolio.education.map((edu: any, index: number) => (
                      <div key={index} className="border-l-2 border-green-500 pl-4">
                        <p className="font-medium text-md">Stream: {edu.stream || 'Degree'}</p>
                        <p className="text-md">University: {edu.university_board || 'Institution'}</p>
                        <p className="text-md">Year of Completion: {edu.year_of_completion || 'Year'}</p>
                        {edu.grade && <p className="text-md">Grade: {edu.grade}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-3 uppercase">Skills</h2>
                <div className="space-y-3">
                  {role_based_profile.primary_skills && role_based_profile.primary_skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Primary Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {role_based_profile.primary_skills.map((skill: any, index: number) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {typeof skill === 'string' ? skill : skill.skill_name || skill.skill_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {role_based_profile.secondary_skills && role_based_profile.secondary_skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Secondary Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {role_based_profile.secondary_skills.map((skill: any, index: number) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {typeof skill === 'string' ? skill : skill.skill_name || skill.skill_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Education Section */}


              {/* Certifications */}
              {role_based_profile.certifications && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3 uppercase">Certifications</h2>
                  <p className="text-gray-700">{role_based_profile.certifications}</p>
                </div>
              )}

              {/* Additional Information */}
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-3 uppercase">Additional Information</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Space:</strong> {role_based_profile.space}</p>
                    {role_based_profile.industry && <p><strong>Industry:</strong> {role_based_profile.industry}</p>}
                    {role_based_profile.career_level && <p><strong>Career Level:</strong> {role_based_profile.career_level}</p>}
                  </div>
                  <div>
                    {role_based_profile.desired_job_role && (
                      <p><strong>Desired Role:</strong> {role_based_profile.desired_job_role}</p>
                    )}
                  </div>
                </div>
              </div>
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-500 mr-2" size={24} />
            <span className="text-gray-600">Loading profiles...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <div>
                <div className="text-red-800 font-medium">Error loading profiles</div>
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            </div>
            <button
              onClick={() => {
                clearError();
                fetchRoleBasedProfiles();
              }}
              className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Profiles Grid */}
        {!isLoading && !error && (
          <>
            {profiles && profiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => handleProfileSelect(profile.id)}
                    className={`bg-white rounded-xl shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${activeProfile === profile.id ? 'border-orange-500 ring-2 ring-orange-100' : 'border-gray-200'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeProfile === profile.id ? 'bg-orange-100' : 'bg-gray-100'
                          }`}>
                          <User className={`w-6 h-6 ${activeProfile === profile.id ? 'text-orange-600' : 'text-gray-600'
                            }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                          {/* <p className="text-sm text-gray-600">{profile.subdomain}</p> */}
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
                      {/* <div>
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
                    </div> */}

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
                ))
                }
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gray-50 rounded-full p-6 mb-6">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Profile Found</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  No profiles available. Please create your profile to get started with SkillGlobe.
                </p>
              </div>
            )}
          </>
        )}


      </div>
    </ModernLayoutWrapper>
  );
}