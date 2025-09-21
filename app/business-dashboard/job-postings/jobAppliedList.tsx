'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star
} from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import BusinessDashboardHeader from '@/components/dashboard/BusinessDashboardHeader';

// Applicant interface
interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'hired' | 'interested';
  experience: string;
  skills: string[];
  resumeUrl?: string;
  profileImage?: string;
  rating?: number;
  coverLetter?: string;
}

// Job interface
interface JobDetails {
  id: string;
  title: string;
  skillCategory: string;
  employmentType: string;
  workMode: string;
  location: string;
  postedDate: string;
  applicationDeadline?: string;
  totalApplicants: number;
}

export default function JobAppliedListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Sample job details
  const sampleJobDetails: JobDetails = {
    id: jobId || '1',
    title: 'Senior Frontend Developer',
    skillCategory: 'IT & Software',
    employmentType: 'Full-time',
    workMode: 'Remote',
    location: 'Remote',
    postedDate: '2 days ago',
    applicationDeadline: '2024-01-15',
    totalApplicants: 4
  };

  // Sample applicants data
  const sampleApplicants: Applicant[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+91 9876543210',
      location: 'Bangalore, India',
      appliedDate: '2024-01-10',
      status: 'pending',
      experience: '4 years',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      rating: 4.5,
      coverLetter: 'I am excited to apply for this position...'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+91 9876543211',
      location: 'Mumbai, India',
      appliedDate: '2024-01-09',
      status: 'shortlisted',
      experience: '6 years',
      skills: ['React', 'Vue.js', 'Python', 'Docker'],
      rating: 4.8,
      coverLetter: 'With over 6 years of experience in frontend development...'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+91 9876543212',
      location: 'Pune, India',
      appliedDate: '2024-01-08',
      status: 'rejected',
      experience: '2 years',
      skills: ['JavaScript', 'React', 'CSS'],
      rating: 3.5,
      coverLetter: 'I am a passionate developer looking to grow...'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+91 9876543213',
      location: 'Delhi, India',
      appliedDate: '2024-01-07',
      status: 'hired',
      experience: '5 years',
      skills: ['React', 'Angular', 'TypeScript', 'GraphQL'],
      rating: 4.9,
      coverLetter: 'I bring extensive experience in modern frontend technologies...'
    }
  ];

  useEffect(() => {
    // Load job details and applicants
    setJobDetails(sampleJobDetails);
    setApplicants(sampleApplicants);
  }, [jobId]);

  const handleStatusChange = (applicantId: string, newStatus: Applicant['status']) => {
    setApplicants(prev =>
      prev.map(applicant =>
        applicant.id === applicantId
          ? { ...applicant, status: newStatus }
          : applicant
      )
    );
  };


  const handleViewProfile = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowProfileModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'interested': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'shortlisted': return <Star size={14} />;
      case 'rejected': return <XCircle size={14} />;
      case 'hired': return <CheckCircle size={14} />;
      case 'interested': return <Star size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === 'all' || 
      applicant.status === statusFilter || 
      (statusFilter === 'pending' && applicant.status === 'interested');

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applicants.length,
    pending: applicants.filter(a => a.status === 'pending' || a.status === 'interested').length,
    shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
    rejected: applicants.filter(a => a.status === 'rejected').length,
    hired: applicants.filter(a => a.status === 'hired').length,
  };

  return (
    <div className="bg-gray-100 font-rubik">
      <BusinessSidebar />

      <div className="pl-64">
        <BusinessDashboardHeader title="Job Applicants" />

        <div className="bg-gray-50 p-8">
          {/* Header Section */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center transition-all duration-300 mb-4"
            >
              <ArrowLeft size={20} className="mr-1" /> Back
            </button>

            {jobDetails && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{jobDetails.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} /> {jobDetails.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={16} /> Posted {jobDetails.postedDate}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {jobDetails.employmentType}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {jobDetails.workMode}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{jobDetails.totalApplicants}</div>
                    <div className="text-sm text-gray-600">Total Applicants</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                {/* <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search applicants by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div> */}
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === status
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Applicants List */}
            <div className="p-6 max-h-none">
              {filteredApplicants.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">No applicants found</div>
                  <div className="text-sm text-gray-400">
                    {searchTerm ? 'Try adjusting your search criteria' : 'No applications received yet'}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pb-8">
                  {filteredApplicants.map((applicant) => (
                    <div key={applicant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Mail size={14} /> {applicant.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone size={14} /> {applicant.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={14} /> {applicant.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-gray-600">Experience: {applicant.experience}</span>
                              {applicant.rating && (
                                <div className="flex items-center gap-1">
                                  <Star size={14} className="text-yellow-500 fill-current" />
                                  <span className="text-sm text-gray-600">{applicant.rating}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {applicant.skills.slice(0, 4).map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                              {applicant.skills.length > 4 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  +{applicant.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {applicant.status === 'interested' && (
                            <>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor('pending')}`}>
                                {getStatusIcon('pending')}
                                Pending
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor('interested')}`}>
                                {getStatusIcon('interested')}
                                Interested
                              </span>
                            </>
                          )}
                          {applicant.status !== 'interested' && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(applicant.status)}`}>
                              {getStatusIcon(applicant.status)}
                              {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                            </span>
                          )}

                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => handleViewProfile(applicant)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Profile"
                            >
                              <Eye size={16} />
                            </button>

                            {applicant.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(applicant.id, 'shortlisted')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Shortlist"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(applicant.id, 'rejected')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}

                            {applicant.status === 'pending' && (
                              <button
                                onClick={() => handleStatusChange(applicant.id, 'interested')}
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Show Interest
                              </button>
                            )}


                            {applicant.status === 'shortlisted' && (
                              <button
                                onClick={() => handleStatusChange(applicant.id, 'hired')}
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                              >
                                Hire
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        Applied on {new Date(applicant.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedApplicant && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{selectedApplicant.name}</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedApplicant.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedApplicant.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900">{selectedApplicant.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Experience</label>
                  <p className="text-gray-900">{selectedApplicant.experience}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Skills</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedApplicant.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {selectedApplicant.coverLetter && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Cover Letter</label>
                  <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedApplicant.coverLetter}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                {selectedApplicant.resumeUrl && (
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Download size={16} />
                    Download Resume
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}