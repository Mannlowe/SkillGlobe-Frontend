'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import BusinessDashboardHeader from '@/components/dashboard/BusinessDashboardHeader';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Eye, 
  Plus, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Check as CheckIcon
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import JobPostingModal, { JobFormState } from './job-postings/jobPostingModal';
import { getJobPostingList, JobPosting as ApiJobPosting } from '@/app/api/job postings/jobpostingList';

const stats = [
  {
    title: 'Active Opportunities',
    value: '8',
    change: '+2 this week',
    trend: 'up',
    icon: Briefcase,
    color: 'bg-blue-500',
  },
  {
    title: 'Total Profiles',
    value: '156',
    change: '+23 this week',
    trend: 'up',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    title: 'Profile Views',
    value: '2,340',
    change: '+12% this month',
    trend: 'up',
    icon: Eye,
    color: 'bg-purple-500',
  },
  {
    title: 'Hiring Success Rate',
    value: '78%',
    change: '+5% improvement',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
];


const recentApplications = [
  {
    id: 1,
    candidateName: 'Sarah Johnson',
    position: 'Senior React Developer',
    appliedDate: '2024-01-10',
    status: 'shortlisted',
    experience: '5 years',
    skills: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: 2,
    candidateName: 'Michael Chen',
    position: 'UX Designer',
    appliedDate: '2024-01-09',
    status: 'under-review',
    experience: '3 years',
    skills: ['Figma', 'User Research', 'Prototyping'],
  },
  {
    id: 3,
    candidateName: 'Emily Rodriguez',
    position: 'Marketing Specialist',
    appliedDate: '2024-01-08',
    status: 'new',
    experience: '4 years',
    skills: ['Digital Marketing', 'SEO', 'Analytics'],
  },
];

export default function BusinessDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, entity, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [apiJobPostings, setApiJobPostings] = useState<ApiJobPosting[]>([]);

  // Get business name from entity details or fall back to user name
  const businessName = entity?.details?.name || 'Your Business';

  // Fetch job postings from API
  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        if (entity?.details?.entity_id) {
          const response = await getJobPostingList(entity.details.entity_id);
          setApiJobPostings(response.message.data.opportunity_posting || []);
        }
      } catch (error) {
        console.error('Error fetching job postings:', error);
      }
    };

    fetchJobPostings();
  }, [entity?.details?.entity_id]);

  // Handle job creation
  const handleCreateJob = (jobData: JobFormState) => {
    console.log('Creating job:', jobData);
    // Here you would typically call an API to create the job
    // For now, we'll just close the modal
    setShowJobModal(false);
    
    // Optionally refresh the job postings list
    if (entity?.details?.entity_id) {
      getJobPostingList(entity.details.entity_id)
        .then(response => {
          setApiJobPostings(response.message.data.opportunity_posting || []);
        })
        .catch(error => {
          console.error('Error refreshing job postings:', error);
        });
    }
  };
  // const userName = user?.full_name || user?.name || 'User';
  // const userEmail = user?.email || 'business@example.com';

  // Helper function to get user role from localStorage
  const getUserRole = (): string | null => {
    if (typeof window !== 'undefined') {
      try {
        const entityDataStr = localStorage.getItem('entity_data');
        const userDataStr = localStorage.getItem('user_data');

        if (entityDataStr && userDataStr) {
          const entityData = JSON.parse(entityDataStr);
          const userData = JSON.parse(userDataStr);

          // Get current user's email
          const currentUserEmail = userData.email;

          // Find user's role in business_users array
          const businessUsers = entityData.details?.business_users;
          if (businessUsers && Array.isArray(businessUsers)) {
            const currentUser = businessUsers.find(user => user.email === currentUserEmail);
            return currentUser?.role || null;
          }
        }
      } catch (error) {
        console.error('Error getting user role:', error);
      }
    }
    return null;
  };

  useEffect(() => {
    // Check user role and redirect Business Users to opportunity postings
    const userRole = getUserRole();
    if (userRole === 'Business User' && window.location.pathname === '/business-dashboard') {
      router.push('/business-dashboard/job-postings');
      return;
    }

    if (isAuthenticated && user && window.location.pathname.includes('business-dashboard')) {      
      // Show toast notification for Business Buyer
      const roles = user.roles;
      let isBusinessBuyer = false;
      
      // Check roles in different formats
      if (Array.isArray(roles)) {
        isBusinessBuyer = roles.includes('Business Buyer');
      } else if (typeof roles === 'string') {
        isBusinessBuyer = (roles as string).indexOf('Business Buyer') >= 0;
      }
      
      // Use URL parameter to detect fresh login vs refresh
      const urlParams = new URLSearchParams(window.location.search);
      const fromLogin = urlParams.get('fromLogin') === 'true';
      
      // Show toast on fresh login or if fromLogin parameter is present
      if (isBusinessBuyer && fromLogin) {
        // Create toast with custom timeout
        const { dismiss } = toast({
          title: "Login Successful",
          description: `You are logged in as ${user.full_name || user.name}`,
          variant: "default",
          action: <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center"><CheckIcon className="h-4 w-4 text-green-600" /></div>,
        });
        
        // Set custom timeout (e.g., 3000ms = 3 seconds)
        setTimeout(() => {
          dismiss();
        }, 20000);
        
        // Remove the fromLogin parameter from URL without refreshing
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [isAuthenticated, user, toast, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-orange-100 text-orange-800';
      case 'new': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to format date difference as "X days/hours/minutes ago"
  const formatDateDifference = (dateString: string): string => {
    try {
      const postDate = new Date(dateString);
      const currentDate = new Date();
      const diffInMs = currentDate.getTime() - postDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays > 0) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
      }
      
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours > 0) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
      }
      
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes > 0) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      
      return 'just now';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'recently';
    }
  };

  // State for mobile sidebar toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-rubik">
      <BusinessSidebar mobileOpen={mobileMenuOpen} />
      
      <div className="lg:pl-64 pt-1">
        <BusinessDashboardHeader 
          title="Business Dashboard" 
          onMenuClick={toggleMobileMenu}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome to {businessName}! 🚀
              </h1>
              {/* <p className="text-gray-600">{userName} ({userEmail})</p> */}
              <p className="text-gray-600">
                Manage your opportunities, review applications, and grow your team.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600 font-medium mt-1">{stat.change}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Opportunities */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Recent Opportunities</h2>
                      {/* <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center">
                        <Plus size={16} className="mr-2" />
                        Post New
                      </button> */}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {apiJobPostings.length > 0 ? (
                        apiJobPostings.slice(0, 5).map((opportunity: ApiJobPosting) => (
                          <div key={opportunity.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{opportunity.opportunity_title}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor('active')}`}>
                                  active
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{opportunity.employment_type}</span>
                                <span>{opportunity.application_count || 0} applications</span>
                                <span>Posted {opportunity.created_date ? formatDateDifference(opportunity.created_date) : 'recently'}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Deadline</p>
                              <p className="font-medium text-gray-900">{opportunity.application_deadline || 'No deadline'}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-gray-500 mb-2">No opportunities found</div>
                          <div className="text-sm text-gray-400">
                            Create your first job posting to get started
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Applications */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowJobModal(true)}
                        className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Post New Opportunity
                      </button>
                      {/* <button className="w-full border-2 border-orange-500 text-orange-600 font-semibold py-3 px-4 rounded-lg hover:bg-orange-50 transition-all duration-300">
                        Review Profiles
                      </button> */}
                      <button 
                        onClick={() => router.push('/business-dashboard/business-team-member')}
                        className="w-full border-2 border-blue-500 text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Manage Team
                      </button>
                      {/* <button className="w-full border-2 border-purple-500 text-purple-600 font-semibold py-3 px-4 rounded-lg hover:bg-purple-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                        View Analytics
                      </button> */}
                    </div>
                  </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentApplications.map((application) => (
                        <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{application.candidateName}</h4>
                              <p className="text-sm text-gray-600">{application.position}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                              {application.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <p>{application.experience} experience</p>
                            <p>Applied {application.appliedDate}</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {application.skills.slice(0, 2).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                            {application.skills.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{application.skills.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Job Posting Modal */}
      <JobPostingModal 
        showModal={showJobModal}
        setShowModal={setShowJobModal}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}