'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSkills, type Skill } from '@/app/api/job postings/addjobPosting';

// Import DocumentFile interface from jobPostingModal
import { DocumentFile } from './jobPostingModal';

// Define JobPosting interface here to avoid circular imports
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
  applicantCount?: number;
  closedDate?: string;
}

interface JobPreviewModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  jobData?: JobPosting | null;
}

export default function JobPreviewModal({ showModal, setShowModal, jobData }: JobPreviewModalProps) {
  const [primarySkills, setPrimarySkills] = useState<Skill[]>([]);
  const [secondarySkills, setSecondarySkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  // Fetch skill details for display
  useEffect(() => {
    const fetchSkillDetails = async () => {
      if (!jobData || (!jobData.primarySkills && !jobData.secondarySkills)) return;
      
      setSkillsLoading(true);
      try {
        // Get auth data from local storage
        const apiKey = localStorage.getItem('auth_api_key');
        const apiSecret = localStorage.getItem('auth_api_secret');
        
        if (!apiKey || !apiSecret) {
          console.error('Authentication credentials not found');
          return;
        }

        // Fetch all skills to get canonical names
        const allSkills = await getSkills('', apiKey, apiSecret);
        
        // Map skill IDs to their full details
        if (jobData.primarySkills && jobData.primarySkills.length > 0) {
          const primarySkillDetails = jobData.primarySkills
            .map((skillId: string) => allSkills.find((s: Skill) => s.name === skillId))
            .filter((skill: Skill | undefined) => skill !== undefined) as Skill[];
          setPrimarySkills(primarySkillDetails);
        }
        
        if (jobData.secondarySkills && jobData.secondarySkills.length > 0) {
          const secondarySkillDetails = jobData.secondarySkills
            .map((skillId: string) => allSkills.find((s: Skill) => s.name === skillId))
            .filter((skill: Skill | undefined) => skill !== undefined) as Skill[];
          setSecondarySkills(secondarySkillDetails);
        }
      } catch (error) {
        console.error('Error fetching skill details:', error);
      } finally {
        setSkillsLoading(false);
      }
    };
    
    if (showModal && jobData) {
      fetchSkillDetails();
    }
  }, [showModal, jobData]);

  if (!showModal || !jobData) return null;
  
  return showModal ? (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Close button */}
        <div className="sticky top-0 z-10 flex justify-end items-center p-1 rounded-t-xl">
          {/* <h2 className="text-2xl font-bold text-blue-800">{jobData?.title || 'Job Preview'}</h2> */}
          <button
            onClick={() => setShowModal(false)}
            className="p-2 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-blue-800" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 font-rubik">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <h2 className="text-xl font-bold text-blue-800 mb-2">{jobData.title}</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{jobData.employmentType}</span>
              {jobData.workMode && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">{jobData.workMode}</span>
              )}
              {jobData.experienceRequired && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">{jobData.experienceRequired}</span>
              )}
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">{jobData.location}</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full">Posted: {jobData.postedDate}</span>
            </div>
          </div>
          
          {/* Summary section */}
          <div className="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {/* Employment Type */}
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-blue-600 mb-1">Employment Type</h4>
                <p className="text-gray-900 font-medium">{jobData?.employmentType || 'Not specified'}</p>
              </div>
              
              {/* Work Mode */}
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-blue-600 mb-1">Work Mode</h4>
                <p className="text-gray-900 font-medium">{jobData?.workMode || 'Not specified'}</p>
              </div>
              
              {/* Experience Required */}
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-blue-600 mb-1">Experience</h4>
                <p className="text-gray-900 font-medium">{jobData?.experienceRequired || 'Not specified'}</p>
              </div>
              
              {/* Location */}
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-blue-600 mb-1">Location</h4>
                <p className="text-gray-900 font-medium">{jobData?.location || 'Not specified'}</p>
              </div>
              
              {/* Posted Date */}
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium text-blue-600 mb-1">Posted</h4>
                <p className="text-gray-900 font-medium">{jobData?.postedDate || 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          {/* Skills section */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-blue-700 mb-4 border-b border-blue-100 pb-2">Skills Required</h3>
            
            {/* Loading state */}
            {skillsLoading && (
              <div className="flex items-center justify-center p-6 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-blue-700 font-medium">Loading skills...</span>
              </div>
            )}
            
            {!skillsLoading && (
              <div className="space-y-6">
                {/* Primary Skills */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-md font-medium text-blue-700 mb-3">Primary Skills</h4>
                  {primarySkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {primarySkills.map((skill) => (
                        <span key={skill.name} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200 font-medium">
                          {skill.canonical_name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No primary skills specified</p>
                  )}
                </div>
                
                {/* Secondary Skills */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Secondary Skills</h4>
                  {secondarySkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {secondarySkills.map((skill) => (
                        <span key={skill.name} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200 font-medium">
                          {skill.canonical_name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No secondary skills specified</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Job Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-blue-700 mb-4 border-b border-blue-100 pb-2">Job Description</h3>
            {jobData.description ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 whitespace-pre-wrap text-gray-800 leading-relaxed">
                {jobData.description}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <p className="text-gray-500 italic">No description provided</p>
              </div>
            )}
          </div>
          
          {/* Documents */}
          {jobData.documents && Array.isArray(jobData.documents) && jobData.documents.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-blue-700 mb-4 border-b border-blue-100 pb-2">Attached Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {jobData.documents.map((doc: DocumentFile, index: number) => (
                  <div key={index} className="flex items-center bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-all">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-blue-600 font-medium">{(doc.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null
}
