'use client';

import { useState } from 'react';
import { Briefcase, Plus, Search } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import BusinessDashboardHeader from '@/components/dashboard/BusinessDashboardHeader';
import JobPostingModal, { JobFormState, DocumentFile } from './jobPostingModal';

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
}

// Sample job postings data
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
    status: 'Active'
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
    status: 'Active'
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
    status: 'Active'
  }
];

export default function JobPostingsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobPostings, setJobPostings] = useState(sampleJobPostings);
  const [currentJob, setCurrentJob] = useState<JobPosting | null>(null);
  const [editMode, setEditMode] = useState(false);
  
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
        skillsRequired: job.skillsRequired,
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
        skillsRequired: job.skillsRequired,
        genderPreference: job.gender,
        languageRequirement: job.language,
        description: job.description,
        documents: job.documents,
        applicationDeadline: job.applicationDeadline,
        postedDate: new Date().toLocaleDateString(),
        status: 'Active'
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
  
  const handleDeleteConfirm = () => {
    if (currentJob) {
      const updatedJobPostings = jobPostings.filter(jp => jp.id !== currentJob.id);
      setJobPostings(updatedJobPostings);
      setShowDeleteModal(false);
      setCurrentJob(null);
    }
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
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Manage Job Postings</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              <span>Create New</span>
            </button>
          </div>
          
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
            
            <div className="overflow-x-auto">
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
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
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
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the job posting &ldquo;{currentJob?.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

