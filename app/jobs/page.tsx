'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Search, MapPin, Briefcase, Banknote, Clock, Users } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    company: 'TechFlow Solutions',
    location: 'Remote',
    salary: 'Rs.120,000 - Rs.160,000',
    type: 'Full-time',
    experience: '5+ years',
    applicants: 23,
    posted: '2 days ago',
    description: 'We are looking for a senior full stack developer to join our growing team...',
    requirements: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Creative Labs',
    location: 'San Francisco, CA',
    salary: 'Rs.90,000 - Rs.130,000',
    type: 'Full-time',
    experience: '3+ years',
    applicants: 45,
    posted: '1 day ago',
    description: 'Join our design team to create beautiful and intuitive user experiences...',
    requirements: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
    logo: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    company: 'CloudTech Inc.',
    location: 'Austin, TX',
    salary: 'Rs.110,000 - Rs.150,000',
    type: 'Full-time',
    experience: '4+ years',
    applicants: 18,
    posted: '3 days ago',
    description: 'Help us scale our infrastructure and improve deployment processes...',
    requirements: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    logo: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
  },
];

export default function JobsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(jobs[0]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 font-rubik">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Job Opportunities
              </h1>
              <p className="text-gray-600">
                Find your perfect job match from top companies
              </p>
            </div>

            {/* Search Bar */}
            {/* <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="md:w-64 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                  />
                </div>
                <button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300">
                  Search Jobs
                </button>
              </div>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job List */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {jobs.length} Jobs Found
                </h2>
                
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all duration-300 border border-gray-100 hover:shadow-lg ${
                      selectedJob.id === job.id ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                        <p className="text-gray-600 text-sm">{job.company}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <MapPin size={14} className="mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-orange-600 font-semibold text-sm">
                            {job.salary.split(' - ')[0]}+
                          </span>
                          <span className="text-gray-500 text-xs">{job.posted}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Job Details */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={selectedJob.logo}
                        alt={selectedJob.company}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedJob.title}
                        </h1>
                        <p className="text-lg text-gray-600 mb-2">{selectedJob.company}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-1" />
                            {selectedJob.location}
                          </div>
                          <div className="flex items-center">
                            <Briefcase size={16} className="mr-1" />
                            {selectedJob.type}
                          </div>
                          <div className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            {selectedJob.experience}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="btn-gradient-border py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300">
                      Apply Now
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Banknote className="text-green-600" size={20} />
                        <span className="ml-2 font-semibold text-green-800">Salary</span>
                      </div>
                      <p className="text-green-700">{selectedJob.salary}</p>
                    </div>
                    
                    {/* <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Users className="text-blue-600" size={20} />
                        <span className="ml-2 font-semibold text-blue-800">Applicants</span>
                      </div>
                      <p className="text-blue-700">{selectedJob.applicants} applied</p>
                    </div> */}
                    
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Clock className="text-orange-600" size={20} />
                        <span className="ml-2 font-semibold text-orange-800">Posted</span>
                      </div>
                      <p className="text-orange-700">{selectedJob.posted}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* <div className="flex flex-col sm:flex-row gap-4">
                    <button className="btn-gradient-border py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300">
                      Apply for this Job
                    </button>
                    <button className="border-2 border-orange-500 text-orange-600 font-semibold py-3 px-6 rounded-xl hover:bg-orange-50 transition-all duration-300">
                      Save Job
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}