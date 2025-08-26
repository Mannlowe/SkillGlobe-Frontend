'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Search, Users, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import BusinessDashboardHeader from '@/components/dashboard/BusinessDashboardHeader';

// Job posting interface
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
  applicationDeadline?: string;
  postedDate: string;
  status: string;
  applicantCount?: number;
  closedDate?: string;
}

export default function ClosedOpportunitiesPage() {
  const router = useRouter();
  const [closedJobs, setClosedJobs] = useState<JobPosting[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample closed job postings data
  const sampleClosedJobs: JobPosting[] = [
    {
      id: '1',
      title: 'Marketing Manager',
      skillCategory: 'Marketing',
      employmentType: 'Full-time',
      workMode: 'On-site',
      experienceRequired: '5+ years',
      location: 'Mumbai, India',
      postedDate: '2 weeks ago',
      closedDate: '3 days ago',
      status: 'Closed',
      applicantCount: 25
    },
    {
      id: '2',
      title: 'Data Analyst',
      skillCategory: 'IT & Software',
      employmentType: 'Contract',
      workMode: 'Remote',
      experienceRequired: '2-3 years',
      location: 'Remote',
      postedDate: '1 month ago',
      closedDate: '1 week ago',
      status: 'Closed',
      applicantCount: 18
    }
  ];

  useEffect(() => {
    // Load closed jobs from localStorage or API
    const storedClosedJobs = localStorage.getItem('closedJobs');
    if (storedClosedJobs) {
      setClosedJobs(JSON.parse(storedClosedJobs));
    } else {
      setClosedJobs(sampleClosedJobs);
    }
  }, []);

  const handleTitleClick = (jobId: string) => {
    router.push(`/business-dashboard/job-applied-users?jobId=${jobId}`);
  };

  const navigateBack = () => {
    router.push('/business-dashboard/job-postings');
  };

  const filteredJobs = closedJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skillCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 font-rubik">
      <BusinessSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden pl-64">
        <BusinessDashboardHeader title="Closed Opportunities" />
        
        <div className="flex-1 bg-gray-50 p-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={navigateBack}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center transition-all duration-300"
            >
              <ArrowLeft size={20} className="mr-1" /> Back to Job Postings
            </button>
            
            <div className="text-sm text-gray-600">
              Total Closed Opportunities: {closedJobs.length}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search closed opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">No closed opportunities found</div>
                  <div className="text-sm text-gray-400">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Closed job postings will appear here'}
                  </div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Mode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closed Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="ml-4">
                              <button
                                onClick={() => handleTitleClick(job.id)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-2"
                              >
                                {job.title}
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
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
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.closedDate || 'Not specified'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
