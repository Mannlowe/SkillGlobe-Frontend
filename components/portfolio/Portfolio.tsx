'use client';

import { useState } from 'react';
import { Upload, User, GraduationCap, Briefcase, Award, FileText, Plus } from 'lucide-react';
import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import CertificateForm from './CertificateForm';

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
  };
  
  const updatePersonalInfoCompleted = (value: boolean) => {
    setLocalPersonalInfoCompleted(value);
    if (propSetPersonalInfoCompleted) propSetPersonalInfoCompleted(value);
  };
  
  const updateEducationCompleted = (value: boolean) => {
    setLocalEducationCompleted(value);
    if (propSetEducationCompleted) propSetEducationCompleted(value);
  };
  
  const updateExperienceCompleted = (value: boolean) => {
    setLocalExperienceCompleted(value);
    if (propSetExperienceCompleted) propSetExperienceCompleted(value);
  };
  
  const updateCertificatesCompleted = (value: boolean) => {
    setLocalCertificatesCompleted(value);
    if (propSetCertificatesCompleted) propSetCertificatesCompleted(value);
  };
  
  // Other state
  const [personalInfo, setPersonalInfo] = useState({});
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certificates, setCertificates] = useState([]);

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
    updatePersonalInfoCompleted(true);
    // Move to next section after completing personal info
    setActiveSection('education');
  };
  
  const handleEducationSave = (data: any) => {
    setEducation(data);
    updateEducationCompleted(true);
    // Move to next section after completing education
    setActiveSection('experience');
  };
  
  const handleExperienceSave = (data: any) => {
    setExperience(data);
    updateExperienceCompleted(true);
    // Move to next section after completing experience
    setActiveSection('certificates');
  };
  
  const handleCertificatesSave = (data: any) => {
    setCertificates(data);
    updateCertificatesCompleted(true);
    // Portfolio is complete
    if (onPortfolioComplete) {
      onPortfolioComplete();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  const handleContinue = () => {
    if (onPortfolioComplete) {
      onPortfolioComplete();
    }
  };

  return (
      <div className={`bg-white rounded-xl max-w-full shadow-sm p-3 space-y-6 font-rubik ${className}`}>

      {/* Active Section Content */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
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
        {/* <button
          onClick={handleSkip}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
        >
          Skip for Now
        </button> */}
        <button
          onClick={handleContinue}
          className="max-w-xs mx-auto flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          Submit
        </button>
      </div>
    </div>
  );
}