'use client';

import { useState, useEffect } from 'react';
import { Upload, User, GraduationCap, Briefcase, Award, FileText, Plus, X } from 'lucide-react';
import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import CertificateForm from './CertificateForm';
import SubmitFormModal from '../modal/SubmitFormModal';

interface PortfolioProps {
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  sections?: {
    id: string;
    name: string;
    icon: any;
    completed: boolean;
  }[];
  setResumeUploaded?: (value: boolean) => void;
  setPersonalInfoCompleted?: (value: boolean) => void;
  setEducationCompleted?: (value: boolean) => void;
  setExperienceCompleted?: (value: boolean) => void;
  setCertificatesCompleted?: (value: boolean) => void;
  onPortfolioComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

export default function Portfolio({ 
  activeSection: propActiveSection, 
  setActiveSection: propSetActiveSection,
  sections: propSections,
  setResumeUploaded: propSetResumeUploaded,
  setPersonalInfoCompleted: propSetPersonalInfoCompleted,
  setEducationCompleted: propSetEducationCompleted,
  setExperienceCompleted: propSetExperienceCompleted,
  setCertificatesCompleted: propSetCertificatesCompleted,
  onPortfolioComplete, 
  onSkip, 
  className = '' 
}: PortfolioProps) {
  // Use local state if props are not provided
  const [localActiveSection, setLocalActiveSection] = useState('resume');
  const [localResumeUploaded, setLocalResumeUploaded] = useState(false);
  const [localPersonalInfoCompleted, setLocalPersonalInfoCompleted] = useState(false);
  const [localEducationCompleted, setLocalEducationCompleted] = useState(false);
  const [localExperienceCompleted, setLocalExperienceCompleted] = useState(false);
  const [localCertificatesCompleted, setLocalCertificatesCompleted] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  
  // Use props if provided, otherwise use local state
  const activeSection = propActiveSection || localActiveSection;
  const setActiveSection = propSetActiveSection || setLocalActiveSection;
  const resumeUploaded = propSections ? propSections[0].completed : localResumeUploaded;
  const personalInfoCompleted = propSections ? propSections[1].completed : localPersonalInfoCompleted;
  const educationCompleted = propSections ? propSections[2].completed : localEducationCompleted;
  const experienceCompleted = propSections ? propSections[3].completed : localExperienceCompleted;
  const certificatesCompleted = propSections ? propSections[4].completed : localCertificatesCompleted;
  
  // Set completion functions that update both local state and parent state if provided
  const updateResumeUploaded = (value: boolean) => {
    setLocalResumeUploaded(value);
    if (propSetResumeUploaded) propSetResumeUploaded(value);
    localStorage.setItem('portfolioResumeUploaded', value.toString());
  };
  
  const updatePersonalInfoCompleted = (value: boolean) => {
    setLocalPersonalInfoCompleted(value);
    if (propSetPersonalInfoCompleted) propSetPersonalInfoCompleted(value);
    localStorage.setItem('portfolioPersonalInfoCompleted', value.toString());
  };
  
  const updateEducationCompleted = (value: boolean) => {
    setLocalEducationCompleted(value);
    if (propSetEducationCompleted) propSetEducationCompleted(value);
    localStorage.setItem('portfolioEducationCompleted', value.toString());
  };
  
  const updateExperienceCompleted = (value: boolean) => {
    setLocalExperienceCompleted(value);
    if (propSetExperienceCompleted) propSetExperienceCompleted(value);
    localStorage.setItem('portfolioExperienceCompleted', value.toString());
  };
  
  const updateCertificatesCompleted = (value: boolean) => {
    setLocalCertificatesCompleted(value);
    if (propSetCertificatesCompleted) propSetCertificatesCompleted(value);
    localStorage.setItem('portfolioCertificatesCompleted', value.toString());
  };
  
  // Other state
  const [personalInfo, setPersonalInfo] = useState({});
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certificates, setCertificates] = useState([]);
  
  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load active section
      const savedSection = localStorage.getItem('portfolioActiveSection');
      if (savedSection) {
        setLocalActiveSection(savedSection);
        // Also update the parent's active section if available
        if (propSetActiveSection) propSetActiveSection(savedSection);
      }
      
      // Load completion status
      const savedResumeUploaded = localStorage.getItem('portfolioResumeUploaded') === 'true';
      const savedPersonalInfoCompleted = localStorage.getItem('portfolioPersonalInfoCompleted') === 'true';
      const savedEducationCompleted = localStorage.getItem('portfolioEducationCompleted') === 'true';
      const savedExperienceCompleted = localStorage.getItem('portfolioExperienceCompleted') === 'true';
      const savedCertificatesCompleted = localStorage.getItem('portfolioCertificatesCompleted') === 'true';
      
      // Update local state
      setLocalResumeUploaded(savedResumeUploaded);
      setLocalPersonalInfoCompleted(savedPersonalInfoCompleted);
      setLocalEducationCompleted(savedEducationCompleted);
      setLocalExperienceCompleted(savedExperienceCompleted);
      setLocalCertificatesCompleted(savedCertificatesCompleted);
      
      // Also update parent state if available
      if (propSetResumeUploaded) propSetResumeUploaded(savedResumeUploaded);
      if (propSetPersonalInfoCompleted) propSetPersonalInfoCompleted(savedPersonalInfoCompleted);
      if (propSetEducationCompleted) propSetEducationCompleted(savedEducationCompleted);
      if (propSetExperienceCompleted) propSetExperienceCompleted(savedExperienceCompleted);
      if (propSetCertificatesCompleted) propSetCertificatesCompleted(savedCertificatesCompleted);
      
      // Load form data
      const savedPersonalInfo = localStorage.getItem('portfolioPersonalInfo');
      const savedEducation = localStorage.getItem('portfolioEducation');
      const savedExperience = localStorage.getItem('portfolioExperience');
      const savedCertificates = localStorage.getItem('portfolioCertificates');
      
      if (savedPersonalInfo) setPersonalInfo(JSON.parse(savedPersonalInfo));
      if (savedEducation) setEducation(JSON.parse(savedEducation));
      if (savedExperience) setExperience(JSON.parse(savedExperience));
      if (savedCertificates) setCertificates(JSON.parse(savedCertificates));
      
      // Check if we need to show the reminder modal
      const allCompleted = savedResumeUploaded && 
                          savedPersonalInfoCompleted && 
                          savedEducationCompleted && 
                          savedExperienceCompleted && 
                          savedCertificatesCompleted;
      
      const hasStarted = savedResumeUploaded || 
                        savedPersonalInfoCompleted || 
                        savedEducationCompleted || 
                        savedExperienceCompleted || 
                        savedCertificatesCompleted;
      
      // Only show reminder if user has started but not completed all steps
      if (hasStarted && !allCompleted) {
        setShowReminderModal(true);
      }
    }
  }, [propSetActiveSection, propSetResumeUploaded, propSetPersonalInfoCompleted, 
      propSetEducationCompleted, propSetExperienceCompleted, propSetCertificatesCompleted]);

  // Use provided sections or create local ones
  const sections = propSections || [
    { id: 'resume', name: 'Resume Upload', icon: FileText, completed: resumeUploaded },
    { id: 'personal', name: 'Personal Info', icon: User, completed: personalInfoCompleted },
    { id: 'education', name: 'Education', icon: GraduationCap, completed: educationCompleted },
    { id: 'experience', name: 'Experience', icon: Briefcase, completed: experienceCompleted },
    { id: 'certificates', name: 'Certificates', icon: Award, completed: certificatesCompleted },
  ];

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateResumeUploaded(true);
      // After resume is uploaded, automatically switch to personal info section
      setTimeout(() => {
        setActiveSection('personal');
      }, 1000);
    }
  };
  
  const handlePersonalInfoSave = (data: any) => {
    setPersonalInfo(data);
    localStorage.setItem('portfolioPersonalInfo', JSON.stringify(data));
    updatePersonalInfoCompleted(true);
    setActiveSection('education');
    localStorage.setItem('portfolioActiveSection', 'education');
  };
  
  const handleEducationSave = (data: any) => {
    setEducation(data);
    localStorage.setItem('portfolioEducation', JSON.stringify(data));
    updateEducationCompleted(true);
    setActiveSection('experience');
    localStorage.setItem('portfolioActiveSection', 'experience');
  };
  
  const handleExperienceSave = (data: any) => {
    setExperience(data);
    localStorage.setItem('portfolioExperience', JSON.stringify(data));
    updateExperienceCompleted(true);
    setActiveSection('certificates');
    localStorage.setItem('portfolioActiveSection', 'certificates');
  };
  
  const handleCertificatesSave = (data: any) => {
    setCertificates(data);
    localStorage.setItem('portfolioCertificates', JSON.stringify(data));
    updateCertificatesCompleted(true);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  const handleModalSubmit = () => {
    // Call the onPortfolioComplete callback when the form is successfully submitted
    if (onPortfolioComplete) {
      onPortfolioComplete();
    }
  };
  
  // Handle closing the reminder modal
  const handleCloseReminderModal = () => {
    setShowReminderModal(false);
  };
  
  // Handle continuing from the reminder modal
  const handleContinueFromReminder = () => {
    setShowReminderModal(false);
    // Find the first incomplete section and navigate to it
    if (!resumeUploaded) {
      setActiveSection('resume');
      localStorage.setItem('portfolioActiveSection', 'resume');
    } else if (!personalInfoCompleted) {
      setActiveSection('personal');
      localStorage.setItem('portfolioActiveSection', 'personal');
    } else if (!educationCompleted) {
      setActiveSection('education');
      localStorage.setItem('portfolioActiveSection', 'education');
    } else if (!experienceCompleted) {
      setActiveSection('experience');
      localStorage.setItem('portfolioActiveSection', 'experience');
    } else if (!certificatesCompleted) {
      setActiveSection('certificates');
      localStorage.setItem('portfolioActiveSection', 'certificates');
    }
  };

  const handleContinue = () => {
    // Open the modal instead of directly completing
    setIsModalOpen(true);
  };

  return (
      <div className={`bg-white rounded-xl max-w-full shadow-sm p-3 space-y-6 font-rubik ${className}`}>

      {/* Active Section Content */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        {activeSection === 'resume' && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resume Upload & Smart Parsing</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your resume and we&apos;ll automatically extract your information to build your profile
            </p>
            
            {!resumeUploaded ? (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm font-medium text-gray-900">Upload your resume</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (max 10MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FileText className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Resume uploaded successfully!</p>
                    <p className="text-sm text-gray-600">We&apos;re parsing your information...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'personal' && (
          <PersonalInfoForm 
            initialData={personalInfo}
            onSave={handlePersonalInfoSave}
            onCancel={() => setActiveSection('resume')}
          />
        )}
        
        {activeSection === 'education' && (
          <EducationForm
            initialData={education}
            onSave={handleEducationSave}
            onCancel={() => setActiveSection('personal')}
          />
        )}
        
        {activeSection === 'experience' && (
          <ExperienceForm
            initialData={experience}
            onSave={handleExperienceSave}
            onCancel={() => setActiveSection('education')}
          />
        )}
        
        {activeSection === 'certificates' && (
          <CertificateForm
            initialData={certificates}
            onSave={handleCertificatesSave}
            onCancel={() => setActiveSection('experience')}
          />
        )}
        
        {(activeSection !== 'resume' && activeSection !== 'personal' && 
          activeSection !== 'education' && activeSection !== 'experience' && 
          activeSection !== 'certificates') && (
          <div className="text-center py-8">
            <Plus className="mx-auto text-gray-400 mb-3" size={32} />
            <h3 className="font-semibold text-gray-900 mb-2">
              {sections.find(s => s.id === activeSection)?.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              This section will be available after you complete the previous sections
            </p>
            <button 
              onClick={() => {
                // Navigate to the appropriate previous section
                if (!personalInfoCompleted) {
                  setActiveSection('personal');
                } else if (!educationCompleted && activeSection === 'experience') {
                  setActiveSection('education');
                } else if (!experienceCompleted && activeSection === 'certificates') {
                  setActiveSection('experience');
                } else {
                  setActiveSection('personal');
                }
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Go to Previous Section
            </button>
          </div>
        )}
      </div>

      {/* Smart Parsing Benefits */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Smart Resume Parsing</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <p>Automatically extracts personal information, education, and experience</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <p>Identifies skills and technologies from your background</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <p>You can review and edit all extracted information</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
    
        <button
          onClick={handleContinue}
          className="max-w-xs mx-auto flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          Submit
        </button>
      </div>

      {/* Submit Form Modal */}
      <SubmitFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit} 
      />
      
      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-1 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Complete Your Portfolio</h3>
              <button 
                onClick={handleCloseReminderModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                You have started your portfolio but haven&apos;t completed all sections. Would you like to continue where you left off?
              </p>
              
              {/* Progress indicators */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${resumeUploaded ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={resumeUploaded ? 'text-green-600' : 'text-gray-500'}>Resume Upload</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${personalInfoCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={personalInfoCompleted ? 'text-green-600' : 'text-gray-500'}>Personal Information</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${educationCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={educationCompleted ? 'text-green-600' : 'text-gray-500'}>Education</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${experienceCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={experienceCompleted ? 'text-green-600' : 'text-gray-500'}>Experience</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${certificatesCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={certificatesCompleted ? 'text-green-600' : 'text-gray-500'}>Certificates</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseReminderModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Later
                </button>
                <button
                  onClick={handleContinueFromReminder}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}