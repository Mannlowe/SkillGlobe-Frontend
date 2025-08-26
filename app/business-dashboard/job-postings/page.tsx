'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Users, Archive } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import BusinessDashboardHeader from '@/components/dashboard/BusinessDashboardHeader';
import JobPostingModal, { JobFormState, DocumentFile } from './jobPostingModal';
import { useJobPostingListStore } from '@/store/job-postings/jobpostinglistStore';
import { JobPosting as ApiJobPosting } from '@/app/api/job postings/jobpostingList';
import { useAuthStore } from '@/store/authStore';

// Job posting interface to match the form fields
interface JobPosting {
  id: string;
  title: string;
  skillCategory?: string;
  employmentType: string;
  workMode?: string;
  experienceRequired?: string;
  location: string;
  salary?: string;
  skillsRequired?: string[];
  genderPreference?: string[];
  languageRequirement?: string[];
  description?: string;
  documents?: DocumentFile[];
  applicationDeadline?: string;
  postedDate: string;
  status: string;
  applicantCount?: number;
}

// Sample job postings data with applicant counts
const sampleJobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    skillCategory: 'IT & Software',
    employmentType: 'Full-time',
    workMode: 'Remote',
    experienceRequired: '3-5 years',
    location: 'Remote',
    postedDate: '2 days ago',
    status: 'Active',
    applicantCount: 4
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    skillCategory: 'Design',
    employmentType: 'Full-time',
    workMode: 'On-site',
    experienceRequired: '2-4 years',
    location: 'Bangalore, India',
    postedDate: '1 week ago',
    status: 'Active',
    applicantCount: 4
  },
  {
    id: '3',
    title: 'Backend Engineer',
    skillCategory: 'IT & Software',
    employmentType: 'Contract',
    workMode: 'Hybrid',
    experienceRequired: '4+ years',
    location: 'Hybrid',
    postedDate: '3 days ago',
    status: 'Active',
    applicantCount: 4
  }
];

export default function JobPostingsPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [closedJobs, setClosedJobs] = useState<JobPosting[]>([]);
  const [currentJob, setCurrentJob] = useState<JobPosting | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Use the job posting list store
  const { 
    jobPostings: apiJobPostings, 
    isLoading, 
    error, 
    getJobPostings 
  } = useJobPostingListStore();
  
  // Get entity ID from auth store
  const { entity } = useAuthStore();
  const entityId = entity?.details?.entity_id || "";
  
  // Log entity information for debugging
  useEffect(() => {
    console.log('Auth entity:', entity);
    console.log('Using entity ID:', entityId);
  }, [entity, entityId]);
  
  // Fetch job postings when component mounts and entity_id is available
  useEffect(() => {
    const fetchJobPostings = async () => {
      // Only fetch if we have a valid entity_id
      if (!entityId) {
        console.log('Waiting for entity_id to be loaded...');
        return;
      }
      
      try {
        console.log('Fetching job postings for entity_id:', entityId);
        await getJobPostings(entityId);
      } catch (error) {
        console.error('Error fetching job postings:', error);
      }
    };
    
    fetchJobPostings();
  }, [getJobPostings, entityId]);
  
  // Map API job postings to UI job postings format when apiJobPostings changes
  useEffect(() => {
    if (apiJobPostings && apiJobPostings.length > 0) {
      const mappedJobPostings: JobPosting[] = apiJobPostings.map((job: ApiJobPosting, index: number) => ({
        id: job.name,
        title: job.opportunity_title,
        skillCategory: job.role_skill_category,
        employmentType: job.employment_type,
        workMode: job.work_mode,
        experienceRequired: job.experience_required,
        location: job.location || 'Not specified',
        postedDate: '2 days ago', // This would ideally come from the API
        status: 'Active', // This would ideally come from the API
        applicantCount: 4 // Fixed count to match sample data
      }));
      
      setJobPostings(mappedJobPostings);
    }
  }, [apiJobPostings]);
  
  const handleCreateJob = (job: JobFormState) => {
    console.log('Creating new job:', job);
    
    if (editMode && currentJob) {
      // Update existing job
      const updatedJobPosting: JobPosting = {
        ...currentJob,
        title: job.title,
        skillCategory: job.skillCategory,
        employmentType: job.employmentType,
        workMode: job.workMode,
        experienceRequired: job.experienceRequired,
        location: job.location || 'Not specified',
        // Additional fields stored but not displayed in table
        salary: job.minRemuneration,
        skillsRequired: [...job.primarySkills, ...job.secondarySkills], // Combine both primary and secondary skills for backward compatibility
        genderPreference: job.gender,
        languageRequirement: job.language,
        description: job.description,
        documents: job.documents,
        applicationDeadline: job.applicationDeadline
      };
      
      const updatedJobPostings = jobPostings.map(jp => 
        jp.id === currentJob.id ? updatedJobPosting : jp
      );
      
      setJobPostings(updatedJobPostings);
    } else {
      // Create new job
      const newJobPosting: JobPosting = {
        id: (jobPostings.length + 1).toString(),
        title: job.title,
        skillCategory: job.skillCategory,
        employmentType: job.employmentType,
        workMode: job.workMode,
        experienceRequired: job.experienceRequired,
        location: job.location || 'Not specified',
        // Additional fields stored but not displayed in table
        salary: job.minRemuneration,
        skillsRequired: [...job.primarySkills, ...job.secondarySkills], // Combine both primary and secondary skills for backward compatibility
        genderPreference: job.gender,
        languageRequirement: job.language,
        description: job.description,
        documents: job.documents,
        applicationDeadline: job.applicationDeadline,
        postedDate: new Date().toLocaleDateString(),
        status: 'Active',
        applicantCount: 0
      };
      
      setJobPostings([...jobPostings, newJobPosting]);
    }
    
    // Reset state
    setShowModal(false);
    setEditMode(false);
    setCurrentJob(null);
  };
  
  const handleEditJob = (job: JobPosting) => {
    setCurrentJob(job);
    setEditMode(true);
    setShowModal(true);
  };
  
  const handleDeleteClick = (job: JobPosting) => {
    setCurrentJob(job);
    setShowDeleteModal(true);
  };
  
  const handleCloseJob = () => {
    if (currentJob) {
      // Move job to closed opportunities with closed date
      const closedJob = { 
        ...currentJob, 
        status: 'Closed',
        closedDate: new Date().toLocaleDateString()
      };
      
      // Update closed jobs state and localStorage
      const updatedClosedJobs = [...closedJobs, closedJob];
      setClosedJobs(updatedClosedJobs);
      localStorage.setItem('closedJobs', JSON.stringify(updatedClosedJobs));
      
      // Remove from active job postings
      const updatedJobPostings = jobPostings.filter(jp => jp.id !== currentJob.id);
      setJobPostings(updatedJobPostings);
      setShowDeleteModal(false);
      setCurrentJob(null);
    }
  };
  
  const handleTitleClick = (jobId: string) => {
    router.push(`/business-dashboard/job-applied-users?jobId=${jobId}`);
  };
  
  const navigateToClosedOpportunities = () => {
    router.push('/business-dashboard/closed-opportunities');
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCurrentJob(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-rubik">
      <BusinessSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden pl-64">
        <BusinessDashboardHeader title="Job Postings" />
        
        <div className="flex-1 bg-gray-50 p-8">
          <div className="flex justify-end items-center mb-3 gap-3">
            <button
              onClick={navigateToClosedOpportunities}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center transition-all duration-300"
            >
              <Archive size={20} className="mr-1" /> Closed Opportunities
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setCurrentJob(null);
                setShowModal(true);
              }}
              className="bg-[#007BCA] hover:bg-[#007BCA] text-white py-2 px-4 rounded-lg flex items-center transition-all duration-300"
            >
              <Plus size={20} className="mr-1" /> Create Job Posting
            </button>
          </div>
          
          {/* Loading and error states */}
          {(!entityId || isLoading) && (
            <div className="flex justify-center items-center p-8">
              <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2">
                {!entityId ? 'Loading user session...' : 'Loading job postings...'}
              </span>
            </div>
          )}
          
          {error && entityId && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search job postings..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobPostings.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => handleTitleClick(job.id)}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-2"
                            >
                              {job.title}
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Users size={12} />
                                {job.applicantCount || 0}
                              </span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.skillCategory || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {job.employmentType || 'Not specified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.workMode || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.experienceRequired || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{job.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleEditJob(job)} 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(job)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job Posting Modal */}
      <JobPostingModal 
        showModal={showModal}
        setShowModal={setShowModal}
        onSubmit={handleCreateJob}
        editData={editMode && currentJob ? currentJob : undefined}
      />
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Close Job Posting</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to close the job posting &ldquo;{currentJob?.title}&rdquo;? This will move it to closed opportunities.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseJob}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Close Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

