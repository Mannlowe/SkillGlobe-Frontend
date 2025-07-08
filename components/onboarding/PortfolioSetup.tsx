'use client';

import { useState } from 'react';
import { Upload, User, GraduationCap, Briefcase, Award, FileText, Plus } from 'lucide-react';

interface PortfolioSetupProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function PortfolioSetup({ data, updateData, nextStep }: PortfolioSetupProps) {
  const [activeSection, setActiveSection] = useState('resume');
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const sections = [
    { id: 'resume', name: 'Resume Upload', icon: FileText, completed: resumeUploaded },
    { id: 'personal', name: 'Personal Info', icon: User, completed: false },
    { id: 'education', name: 'Education', icon: GraduationCap, completed: false },
    { id: 'experience', name: 'Experience', icon: Briefcase, completed: false },
    { id: 'certificates', name: 'Certificates', icon: Award, completed: false },
  ];

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeUploaded(true);
      // Simulate parsing
      setTimeout(() => {
        updateData({ portfolioCompleted: true });
      }, 1000);
    }
  };

  const handleSkip = () => {
    updateData({ portfolioCompleted: false });
    nextStep();
  };

  const handleContinue = () => {
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Build Your Portfolio
        </h1>
        <p className="text-gray-600">
          Create a comprehensive profile to showcase your skills and experience
        </p>
        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mt-2">
          Optional - Complete later
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Portfolio Completion</h3>
          <span className="text-sm text-gray-500">
            {sections.filter(s => s.completed).length}/{sections.length} sections
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`p-3 rounded-lg border transition-all ${
                  activeSection === section.id
                    ? 'border-orange-500 bg-orange-50'
                    : section.completed
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Icon 
                  className={
                    section.completed ? 'text-green-600' :
                    activeSection === section.id ? 'text-orange-600' : 'text-gray-600'
                  } 
                  size={16} 
                />
                <p className="text-xs font-medium text-gray-900 mt-1">{section.name}</p>
                {section.completed && (
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Content */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        {activeSection === 'resume' && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resume Upload & Smart Parsing</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your resume and we'll automatically extract your information to build your profile
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
                    <p className="text-sm text-gray-600">We're parsing your information...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection !== 'resume' && (
          <div className="text-center py-8">
            <Plus className="mx-auto text-gray-400 mb-3" size={32} />
            <h3 className="font-semibold text-gray-900 mb-2">
              {sections.find(s => s.id === activeSection)?.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              This section will be available after you complete the initial setup
            </p>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              Complete Later
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
          onClick={handleSkip}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
        >
          Skip for Now
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
}