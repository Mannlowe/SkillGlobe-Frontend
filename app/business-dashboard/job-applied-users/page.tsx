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
  Star,
  Loader2,
  AlertCircle
} from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import BusinessDashboardHeader from '@/components/dashboard/BusinessDashboardHeader';
import { useProfilesByOpportunityStore, type Applicant, type JobDetails } from '@/store/job-postings/profilesbyopportunityStore';
import { getResumeForBuyer, getAuthData, type ResumeData } from '@/app/api/job postings/resumeagainstopportunity';
import { formatDate } from '@/utils/dateformat';
// Interfaces are now imported from the store

export default function JobAppliedUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  // Store state
  const {
    applicants,
    jobDetails,
    isLoading,
    error,
    totalProfiles,
    fetchProfilesByOpportunity,
    updateApplicantStatus,
    clearError,
    resetStore
  } = useProfilesByOpportunityStore();

  // Local UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [detailedProfile, setDetailedProfile] = useState<ResumeData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    if (jobId) {
      fetchProfilesByOpportunity(jobId);
    }

    // Cleanup on unmount
    return () => {
      resetStore();
    };
  }, [jobId, fetchProfilesByOpportunity, resetStore]);


  const handleStatusChange = (applicantId: string, newStatus: Applicant['status']) => {
    updateApplicantStatus(applicantId, newStatus);
  };

  const handleViewProfile = async (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowProfileModal(true);
    setDetailedProfile(null);
    setProfileError(null);
    
    if (applicant.roleBasedProfile) {
      setProfileLoading(true);
      try {
        // Get authentication data
        const authData = getAuthData();
        if (!authData) {
          throw new Error('Authentication data not found. Please login again.');
        }

        const response = await getResumeForBuyer(
          applicant.roleBasedProfile,
          authData.apiKey,
          authData.apiSecret
        );
        setDetailedProfile(response.message.data);
      } catch (error: any) {
        console.error('Error fetching detailed profile:', error);
        setProfileError('Failed to load detailed profile information');
      } finally {
        setProfileLoading(false);
      }
    } else {
      setProfileError('Role based profile ID not available');
    }
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

  const filteredApplicants = (applicants || []).filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      applicant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applicants?.length || 0,
    pending: applicants?.filter(a => a.status === 'pending').length || 0,
    shortlisted: applicants?.filter(a => a.status === 'shortlisted').length || 0,
    rejected: applicants?.filter(a => a.status === 'rejected').length || 0,
    hired: applicants?.filter(a => a.status === 'hired').length || 0,
  };

  return (
    <div className="bg-gray-100 font-rubik">
      <BusinessSidebar />

      <div className="pl-64">
        <BusinessDashboardHeader title="Opportunity Applicants" />

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
                        <Calendar size={16} /> Posted {formatDate(jobDetails.postedDate)}
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
                    <div className="text-2xl font-bold text-blue-600">{totalProfiles}</div>
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
                <div className="flex-1 relative">
                  {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search applicants by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  /> */}
                </div>
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
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-blue-500 mr-2" size={24} />
                  <span className="text-gray-600">Loading applicants...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-gray-100 rounded-full p-4 mb-4">
                    <User className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Applicants Found</h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">There are currently no applicants for this opportunity.</p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && filteredApplicants.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">No applicants found</div>
                  <div className="text-sm text-gray-400">
                    {searchTerm ? 'Try adjusting your search criteria' : 'No applications received yet'}
                  </div>
                </div>
              )}

              {/* Applicants List */}
              {!isLoading && !error && filteredApplicants.length > 0 && (
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
                                  <span className="text-sm text-gray-600">{applicant.rating.toFixed(1)}</span>
                                </div>
                              )}
                              {applicant.matchScore && (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm text-blue-600 font-medium">{applicant.matchScore}% match</span>
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
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(applicant.status.toLowerCase())}`}>
                            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                          </span>

                          <div className="flex gap-2">
                            {applicant.status !== 'pending' && (
                              <button
                                onClick={() => handleViewProfile(applicant)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Profile"
                              >
                                <Eye size={16} />
                              </button>
                            )}

                            {applicant.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(applicant.id, 'interested')}
                                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                  title="Show Interest"
                                >
                                  <Star size={16} />
                                </button>
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

                      <div className="mt-3 ml-4 flex items-center gap-3 text-sm text-gray-600">
                        <span>
                          Applied On: {formatDate(applicant.appliedDate)}
                        </span>

                        {/* <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          View Resume
                        </button> */}
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
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                {detailedProfile ? `${detailedProfile.portfolio.first_name} ${detailedProfile.portfolio.last_name}` : selectedApplicant.name}
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            {profileLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin mr-2" size={24} />
                <span>Loading detailed profile...</span>
              </div>
            )}

            {profileError && (
              <div className="flex items-center justify-center py-8 text-red-600">
                <AlertCircle className="mr-2" size={24} />
                <span>{profileError}</span>
              </div>
            )}

            {detailedProfile && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{detailedProfile.portfolio.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Mobile</label>
                      <p className="text-gray-900">{detailedProfile.portfolio.mobile_no || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900">{detailedProfile.portfolio.city}, {detailedProfile.portfolio.country}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                {detailedProfile.portfolio.professional_summary && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h4>
                    <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                      {detailedProfile.portfolio.professional_summary}
                    </p>
                  </div>
                )}

                {/* Role Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Role Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Role</label>
                      <p className="text-gray-900">{detailedProfile.role_based_profile.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Space/Domain</label>
                      <p className="text-gray-900">{detailedProfile.role_based_profile.space}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Employment Type</label>
                      <p className="text-gray-900">{detailedProfile.role_based_profile.employment_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Work Mode</label>
                      <p className="text-gray-900">{detailedProfile.role_based_profile.work_mode}</p>
                    </div>
                    {detailedProfile.role_based_profile.relevant_experience > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Relevant Experience</label>
                        <p className="text-gray-900">{detailedProfile.role_based_profile.relevant_experience} years</p>
                      </div>
                    )}
                    {Number(detailedProfile.role_based_profile.total_experience_years) > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Total Experience</label>
                        <p className="text-gray-900">{detailedProfile.role_based_profile.total_experience_years} years</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills</h4>
                  <div className="space-y-3">
                    {detailedProfile.role_based_profile.primary_skills.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Primary Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {detailedProfile.role_based_profile.primary_skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {skill.skill_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {detailedProfile.role_based_profile.secondary_skills.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Secondary Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {detailedProfile.role_based_profile.secondary_skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                              {skill.skill_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Work Experience */}
                {detailedProfile.portfolio.work_experience.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Work Experience</h4>
                    <div className="space-y-3">
                      {detailedProfile.portfolio.work_experience.map((exp, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">{exp.designation}</p>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {detailedProfile.portfolio.education.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Education</h4>
                    <div className="space-y-3">
                      {detailedProfile.portfolio.education.map((edu, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">{edu.stream}</p>
                          <p className="text-gray-600">
                            {edu.university_board && `${edu.university_board} • `}
                            Completed: {edu.year_of_completion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Profiles */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Social Profiles</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {detailedProfile.portfolio.linkedin_profile && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">LinkedIn</label>
                        <a 
                          href={detailedProfile.portfolio.linkedin_profile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 block truncate"
                        >
                          {detailedProfile.portfolio.linkedin_profile}
                        </a>
                      </div>
                    )}
                    {detailedProfile.portfolio.facebook_profile && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Facebook</label>
                        <a 
                          href={detailedProfile.portfolio.facebook_profile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 block truncate"
                        >
                          {detailedProfile.portfolio.facebook_profile}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
