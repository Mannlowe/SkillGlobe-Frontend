'use client';

import { useState } from 'react';
import { Briefcase, Plus, X, Search } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import BusinessDashboardHeader from '@/components/dashboard/BusinessDashboardHeader';

// Sample job postings data
const sampleJobPostings = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    location: 'Remote',
    type: 'Full-time',
    applicants: 24,
    postedDate: '2 days ago',
    status: 'Active'
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    location: 'Bangalore, India',
    type: 'Full-time',
    applicants: 18,
    postedDate: '1 week ago',
    status: 'Active'
  },
  {
    id: '3',
    title: 'Backend Engineer',
    location: 'Hybrid',
    type: 'Contract',
    applicants: 12,
    postedDate: '3 days ago',
    status: 'Active'
  }
];

export default function JobPostingsPage() {
  const [showModal, setShowModal] = useState(false);
  const [jobPostings, setJobPostings] = useState(sampleJobPostings);
  const [newJob, setNewJob] = useState({
    title: '',
    location: '',
    type: 'Full-time'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new job posting
    const newJobPosting = {
      id: (jobPostings.length + 1).toString(),
      title: newJob.title,
      location: newJob.location,
      type: newJob.type,
      applicants: 0,
      postedDate: 'Just now',
      status: 'Active'
    };
    
    // Add to job postings
    setJobPostings(prev => [newJobPosting, ...prev]);
    
    // Reset form and close modal
    setNewJob({
      title: '',
      location: '',
      type: 'Full-time'
    });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessSidebar />
      
      <div className="lg:pl-64 pt-1">
        <BusinessDashboardHeader title="Job Postings" />
        
        <main className="p-4 md:p-6 max-w-full mx-auto">
          {/* Header with search and create button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search job postings..."
                className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              <span>Create Job Posting</span>
            </button>
          </div>
          
          {/* Job Postings List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobPostings.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Briefcase className="text-blue-600" size={18} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.applicants}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.postedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      
      {/* Create Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Job Posting</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateJob} className="p-4 space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={newJob.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="e.g. Senior Frontend Developer"
                  required
                />
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={newJob.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="e.g. Remote, Bangalore, Hybrid"
                  required
                />
              </div>
              
              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={newJob.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              
              <div className="flex justify-center">
              <button
                type="submit"
                className="w-28  bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
