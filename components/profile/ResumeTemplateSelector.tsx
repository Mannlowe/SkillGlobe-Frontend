'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  fields: {
    personalInfo: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    certifications: boolean;
    languages: boolean;
    achievements: boolean;
  };
  sampleData?: any;
}

const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional layout with clean sections and professional formatting',
    fields: {
      personalInfo: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      languages: false,
      achievements: true,
    },
    sampleData: {
      personalInfo: {
        fullName: 'Alexander Taylor',
        email: 'alexander.taylor@email.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        summary: 'Experienced professional with 8+ years in project management'
      },
      skills: ['Project Management', 'Leadership', 'Strategic Planning', 'Team Building']
    }
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean, centered layout with emphasis on content hierarchy',
    fields: {
      personalInfo: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      languages: true,
      achievements: false,
    },
    sampleData: {
      personalInfo: {
        fullName: 'Abigail Hall',
        email: 'abigail.hall@email.com',
        phone: '+1 (555) 987-6543',
        location: 'San Francisco, CA',
        summary: 'Marketing specialist with expertise in digital campaigns'
      },
      skills: ['Digital Marketing', 'Content Strategy', 'Analytics', 'Social Media']
    }
  },
  // {
  //   id: 'creative',
  //   name: 'Creative Professional',
  //   description: 'Modern layout with sidebar and visual elements for creative roles',
  //   fields: {
  //     personalInfo: true,
  //     experience: true,
  //     education: true,
  //     skills: true,
  //     projects: true,
  //     certifications: false,
  //     languages: false,
  //     achievements: true,
  //   },
  //   sampleData: {
  //     personalInfo: {
  //       fullName: 'Aiden Williams',
  //       email: 'aiden.williams@email.com',
  //       phone: '+1 (555) 456-7890',
  //       location: 'Los Angeles, CA',
  //       summary: 'Creative designer with passion for innovative solutions'
  //     },
  //     skills: ['UI/UX Design', 'Adobe Creative Suite', 'Figma', 'Prototyping']
  //   }
  // }
];

// Resume Template Preview Components
const ClassicTemplate = () => (
  <div className="bg-white h-[500px] border rounded shadow-sm overflow-hidden">
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">ALEXANDER TAYLOR</h3>
        <p className="text-sm text-gray-600 mb-1">Senior Project Manager</p>
        <p className="text-xs text-gray-500">New York, NY • alexander.taylor@email.com</p>
      </div>
      
      {/* Summary */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">Summary</h4>
        <p className="text-xs text-gray-700 leading-relaxed">Experienced project manager with 8+ years leading cross-functional teams.</p>
      </div>
      
      {/* Experience */}
      <div className="flex-1 mb-4">
        <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">Experience</h4>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-900">Senior Project Manager</p>
            <p className="text-xs text-gray-600 mb-1">Tech Corp • 2020-Present</p>
            <p className="text-xs text-gray-700">• Led high-impact projects worth $5M+</p>
            <p className="text-xs text-gray-700">• Managed teams of 15+ members</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900">Project Manager</p>
            <p className="text-xs text-gray-600 mb-1">Innovation Labs • 2018-2020</p>
            <p className="text-xs text-gray-700">• Coordinated product development</p>
          </div>
        </div>
      </div>
      
      {/* Skills & Education */}
      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">Skills</h4>
          <p className="text-xs text-gray-700">Project Management, Leadership, Agile, Scrum</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">Education</h4>
          <p className="text-xs text-gray-900">MBA, Business Administration</p>
          <p className="text-xs text-gray-600">Stanford University • 2018</p>
        </div>
      </div>
    </div>
  </div>
);

const CreativeTemplate = () => (
  <div className="bg-white h-[500px] border rounded shadow-sm overflow-hidden flex">
    {/* Main Content */}
    <div className="w-2/3 p-6 flex flex-col">
      {/* Header */}
      <div className="mb-4 -mt-3">
        <h3 className="text-lg font-bold text-gray-900 mb-1">AIDEN WILLIAMS</h3>
        <p className="text-sm text-gray-600 mb-1">UI/UX Designer</p>
        <p className="text-xs text-gray-500">Los Angeles, CA</p>
      </div>
      
      {/* Objective */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">Objective</h4>
        <p className="text-xs text-gray-700 leading-relaxed">Creative designer passionate about user-centered design and innovative digital experiences.</p>
      </div>
      
      {/* Experience */}
      <div className="flex-1 mb-4">
        <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">Experience</h4>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-900">Senior UI/UX Designer</p>
            <p className="text-xs text-gray-600 mb-1">Design Studio • 2018-Present</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900">UI Designer</p>
            <p className="text-xs text-gray-600 mb-1">Tech Startup • 2016-2018</p>
            <p className="text-xs text-gray-700">• Designed mobile app interfaces</p>
          </div>
        </div>
      </div>
      
      {/* Education */}
      <div>
        <h4 className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">Education</h4>
        <p className="text-xs text-gray-900">Bachelor of Fine Arts</p>
        <p className="text-xs text-gray-600">Art Institute • 2018</p>
      </div>
    </div>
    
    {/* Sidebar */}
    <div className="w-2/5 bg-blue-900 text-white p-4 flex flex-col">
      {/* Contact */}
      <div className="mb-3 ">
        {/* <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
          <div className="w-12 h-12 bg-blue-900 rounded-full"></div>
        </div> */}
        <p className="text-xs mb-1">aiden.williams@email.com</p>
        <p className="text-xs">(555) 456-7890</p>
      </div>
      
      {/* Skills */}
      <div className="mb-4">
        <h4 className="text-xs font-bold mb-3 uppercase tracking-wide">Skills</h4>
        <div className="space-y-1">
          <p className="text-xs">• Figma</p>
          <p className="text-xs">• Adobe Creative Suite</p>
          <p className="text-xs">• Prototyping</p>
          <p className="text-xs">• User Research</p>
        </div>
      </div>
      
      {/* Languages */}
      <div className="mb-6">
        <h4 className="text-xs font-bold mb-2 uppercase tracking-wide">Languages</h4>
        <p className="text-xs mb-1">English (Native)</p>
      </div>
      
      {/* Projects */}
      <div className="flex-1">
        <h4 className="text-xs font-bold mb-2 uppercase tracking-wide">Projects</h4>
        <div className="space-y-1">
          <p className="text-xs">• E-commerce Platform</p>
          <p className="text-xs">• Mobile Banking App</p>
          <p className="text-xs">• SaaS Dashboard</p>
        </div>
      </div>
    </div>
  </div>
);

const ModernTemplate = () => (
  <div className="bg-white h-[500px] border rounded shadow-sm overflow-hidden">
    <div className="p-6 h-full flex flex-col text-center">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">ABIGAIL HALL</h3>
        <p className="text-sm text-gray-600 mb-1">Marketing Specialist</p>
        <p className="text-xs text-gray-500">San Francisco, CA • abigail.hall@email.com</p>
      </div>
      
      {/* Summary */}
      <div className="mb-4 text-left">
        <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide text-center">Summary</h4>
        <p className="text-xs text-gray-700 leading-relaxed">Marketing professional with expertise in digital campaigns and analytics.</p>
      </div>
      
      {/* Experience */}
      <div className="flex-1 mb-4 text-left">
        <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide text-center">Experience</h4>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-900">Digital Marketing Manager</p>
            <p className="text-xs text-gray-600 mb-1">Marketing Agency • 2019-Present</p>
            <p className="text-xs text-gray-700">• Developed strategies for 50+ clients</p>
            <p className="text-xs text-gray-700">• Managed $2M+ advertising budget</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900">Marketing Coordinator</p>
            <p className="text-xs text-gray-600 mb-1">StartupCo • 2017-2019</p>
            <p className="text-xs text-gray-700">• Launched social media campaigns</p>
          </div>
        </div>
      </div>
      
      {/* Achievements & Education */}
      <div className="space-y-3 text-left">
        <div>
          <h4 className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide text-center">Key Achievements</h4>
          <p className="text-xs text-gray-700">• Increased ROI by 150%</p>
          <p className="text-xs text-gray-700">• Won Marketing Excellence Award 2023</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide text-center">Education</h4>
          <p className="text-xs text-gray-900">Bachelor of Marketing</p>
          <p className="text-xs text-gray-600">UC Berkeley • 2017</p>
        </div>
      </div>
    </div>
  </div>
);


const getTemplatePreview = (templateId: string) => {
  switch (templateId) {
    case 'classic':
      return <ClassicTemplate />;
    case 'modern':
      return <ModernTemplate />;
    // case 'creative':
    //   return <CreativeTemplate />;
    default:
      return <ClassicTemplate />;
  }
};

interface ResumeTemplateSelectorProps {
  onTemplateSelect: (template: ResumeTemplate) => void;
  onCancel: () => void;
}

export default function ResumeTemplateSelector({ onTemplateSelect, onCancel }: ResumeTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    const template = resumeTemplates.find(t => t.id === selectedTemplate);
    if (template) {
      onTemplateSelect(template);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center mb-2">Choose a Resume Template</h2>
        <p className="text-gray-600 text-center mb-6">Select a template that best fits your professional profile</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 h-[600px]">
          {resumeTemplates.map((template) => {
            return (
              <div
                key={template.id}
                className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                {/* Template Preview */}
                <div className="h-[500px] bg-gray-50 relative">
                  {getTemplatePreview(template.id)}
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Template Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                  
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedTemplate}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedTemplate
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue with Template
          </button>
        </div>
      </div>
    </div>
  );
}

export { resumeTemplates };
