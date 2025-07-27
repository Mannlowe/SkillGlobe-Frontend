import { 
  JobApplication, 
  ApplicationStatus, 
  ApplicationAnalytics,
  ApplicationStatusChange,
  Interview,
  Communication
} from '@/types/application-tracking';

// Mock application data for testing the application tracking system
export const mockApplications: JobApplication[] = [
  {
    id: 'app-1',
    opportunityId: 'job-1',
    profileId: 'profile-1',
    userId: 'user-1',
    appliedDate: '2024-02-15',
    status: 'technical_interview',
    
    jobTitle: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    location: 'Mumbai',
    salaryRange: [140000, 180000],
    workType: 'hybrid',
    
    profileName: 'Senior Full Stack Developer',
    matchScore: 87,
    
    statusHistory: [
      {
        id: 'status-1-1',
        status: 'submitted',
        changedDate: '2024-02-15',
        changedBy: 'user'
      },
      {
        id: 'status-1-2',
        status: 'under_review',
        changedDate: '2024-02-17',
        changedBy: 'company'
      },
      {
        id: 'status-1-3',
        status: 'phone_screening',
        changedDate: '2024-02-20',
        changedBy: 'company'
      },
      {
        id: 'status-1-4',
        status: 'technical_interview',
        changedDate: '2024-02-25',
        changedBy: 'company',
        notes: 'Technical interview scheduled for next week'
      }
    ],
    
    notes: [
      'Applied using Full Stack Developer profile - strong React/Node.js match',
      'HR mentioned they are looking for someone with TypeScript experience',
      'Company culture seems very collaborative based on interview'
    ],
    
    documents: [
      {
        id: 'doc-1-1',
        type: 'resume',
        name: 'Resume_FullStack_Feb2024.pdf',
        url: '/documents/resume_fullstack.pdf',
        uploadedDate: '2024-02-15',
        profileId: 'profile-1'
      },
      {
        id: 'doc-1-2',
        type: 'cover_letter',
        name: 'CoverLetter_TechCorp.pdf',
        url: '/documents/cover_techcorp.pdf',
        uploadedDate: '2024-02-15',
        profileId: 'profile-1'
      }
    ],
    
    interviews: [
      {
        id: 'int-1-1',
        type: 'phone',
        scheduledDate: '2024-02-22T10:00:00Z',
        duration: 30,
        interviewer: 'Sarah Johnson - HR Manager',
        status: 'completed',
        notes: 'Discussed role requirements and company culture',
        feedback: 'Positive initial impression, moving to technical round',
        outcome: 'passed'
      },
      {
        id: 'int-1-2',
        type: 'technical',
        scheduledDate: '2024-03-01T14:00:00Z',
        duration: 90,
        interviewer: 'Mike Chen - Engineering Manager',
        status: 'scheduled',
        notes: 'Technical coding interview - React, Node.js, system design'
      }
    ],
    
    communications: [
      {
        id: 'comm-1-1',
        type: 'email',
        direction: 'inbound',
        subject: 'Application Received - Senior Full Stack Developer',
        content: 'Thank you for your application. We will review and get back to you within 5 business days.',
        date: '2024-02-15T16:30:00Z',
        from: 'careers@techcorp.com',
        to: 'user@example.com',
        important: false
      },
      {
        id: 'comm-1-2',
        type: 'email',
        direction: 'inbound',
        subject: 'Phone Interview Invitation',
        content: 'We would like to schedule a phone interview to discuss your application further.',
        date: '2024-02-20T09:15:00Z',
        from: 'sarah.johnson@techcorp.com',
        to: 'user@example.com',
        important: true
      }
    ],
    
    viewCount: 15,
    responseTime: 5, // days
    lastUpdated: '2024-02-25'
  },
  
  {
    id: 'app-2',
    opportunityId: 'job-2',
    profileId: 'profile-2',
    userId: 'user-1',
    appliedDate: '2024-02-10',
    status: 'offer_received',
    
    jobTitle: 'Data Engineer',
    company: 'DataFlow Analytics',
    location: 'Bangalore',
    salaryRange: [120000, 160000],
    workType: 'remote',
    
    profileName: 'Data Engineer',
    matchScore: 92,
    
    statusHistory: [
      {
        id: 'status-2-1',
        status: 'submitted',
        changedDate: '2024-02-10',
        changedBy: 'user'
      },
      {
        id: 'status-2-2',
        status: 'under_review',
        changedDate: '2024-02-12',
        changedBy: 'company'
      },
      {
        id: 'status-2-3',
        status: 'phone_screening',
        changedDate: '2024-02-15',
        changedBy: 'company'
      },
      {
        id: 'status-2-4',
        status: 'technical_interview',
        changedDate: '2024-02-18',
        changedBy: 'company'
      },
      {
        id: 'status-2-5',
        status: 'final_interview',
        changedDate: '2024-02-22',
        changedBy: 'company'
      },
      {
        id: 'status-2-6',
        status: 'offer_received',
        changedDate: '2024-02-26',
        changedBy: 'company',
        notes: 'Offer received - 155k salary, great benefits package'
      }
    ],
    
    notes: [
      'Perfect match for Data Engineer profile - all required skills matched',
      'Team lead was very impressed with Apache Spark experience',
      'Company offers excellent learning opportunities and career growth',
      'Offer includes stock options and comprehensive health benefits'
    ],
    
    documents: [
      {
        id: 'doc-2-1',
        type: 'resume',
        name: 'Resume_DataEngineer_Feb2024.pdf',
        url: '/documents/resume_dataeng.pdf',
        uploadedDate: '2024-02-10',
        profileId: 'profile-2'
      }
    ],
    
    interviews: [
      {
        id: 'int-2-1',
        type: 'phone',
        scheduledDate: '2024-02-16T11:00:00Z',
        duration: 45,
        interviewer: 'Rachel Kumar - Technical Recruiter',
        status: 'completed',
        outcome: 'passed'
      },
      {
        id: 'int-2-2',
        type: 'technical',
        scheduledDate: '2024-02-19T15:00:00Z',
        duration: 120,
        interviewer: 'David Rodriguez - Senior Data Engineer',
        status: 'completed',
        outcome: 'passed'
      },
      {
        id: 'int-2-3',
        type: 'final',
        scheduledDate: '2024-02-23T10:00:00Z',
        duration: 60,
        interviewer: 'Jennifer Lee - VP Engineering',
        status: 'completed',
        outcome: 'passed'
      }
    ],
    
    communications: [],
    
    viewCount: 12,
    responseTime: 2,
    lastUpdated: '2024-02-26'
  },
  
  {
    id: 'app-3',
    opportunityId: 'job-3',
    profileId: 'profile-3',
    userId: 'user-1',
    appliedDate: '2024-02-08',
    status: 'rejected',
    
    jobTitle: 'Senior Data Analyst',
    company: 'InsightCorp',
    location: 'Delhi',
    salaryRange: [100000, 140000],
    workType: 'hybrid',
    
    profileName: 'Data Analyst',
    matchScore: 76,
    
    statusHistory: [
      {
        id: 'status-3-1',
        status: 'submitted',
        changedDate: '2024-02-08',
        changedBy: 'user'
      },
      {
        id: 'status-3-2',
        status: 'under_review',
        changedDate: '2024-02-10',
        changedBy: 'company'
      },
      {
        id: 'status-3-3',
        status: 'phone_screening',
        changedDate: '2024-02-14',
        changedBy: 'company'
      },
      {
        id: 'status-3-4',
        status: 'rejected',
        changedDate: '2024-02-20',
        changedBy: 'company',
        notes: 'Position filled with candidate who had more domain experience'
      }
    ],
    
    notes: [
      'Used Data Analyst profile but may have needed more finance domain experience',
      'Good interview but they wanted someone with banking background',
      'Consider strengthening finance sector knowledge for similar roles'
    ],
    
    documents: [
      {
        id: 'doc-3-1',
        type: 'resume',
        name: 'Resume_DataAnalyst_Feb2024.pdf',
        url: '/documents/resume_analyst.pdf',
        uploadedDate: '2024-02-08',
        profileId: 'profile-3'
      }
    ],
    
    interviews: [
      {
        id: 'int-3-1',
        type: 'phone',
        scheduledDate: '2024-02-15T14:00:00Z',
        duration: 30,
        interviewer: 'Mark Thompson - Analytics Manager',
        status: 'completed',
        outcome: 'failed',
        feedback: 'Strong technical skills but lacking domain expertise in finance'
      }
    ],
    
    communications: [],
    
    viewCount: 8,
    responseTime: 12,
    lastUpdated: '2024-02-20'
  },
  
  {
    id: 'app-4',
    opportunityId: 'job-4',
    profileId: 'profile-1',
    userId: 'user-1',
    appliedDate: '2024-02-18',
    status: 'submitted',
    
    jobTitle: 'Frontend Developer',
    company: 'UX Design Studio',
    location: 'Pune',
    salaryRange: [80000, 120000],
    workType: 'onsite',
    
    profileName: 'Senior Full Stack Developer',
    matchScore: 82,
    
    statusHistory: [
      {
        id: 'status-4-1',
        status: 'submitted',
        changedDate: '2024-02-18',
        changedBy: 'user'
      }
    ],
    
    notes: [
      'Applied with Full Stack profile focusing on frontend expertise',
      'Strong React skills should be a good match'
    ],
    
    documents: [
      {
        id: 'doc-4-1',
        type: 'resume',
        name: 'Resume_Frontend_Feb2024.pdf',
        url: '/documents/resume_frontend.pdf',
        uploadedDate: '2024-02-18',
        profileId: 'profile-1'
      },
      {
        id: 'doc-4-2',
        type: 'portfolio',
        name: 'Frontend_Portfolio.pdf',
        url: '/documents/portfolio_frontend.pdf',
        uploadedDate: '2024-02-18',
        profileId: 'profile-1'
      }
    ],
    
    interviews: [],
    communications: [],
    
    viewCount: 3,
    lastUpdated: '2024-02-18'
  }
];

// Mock analytics data
export const mockApplicationAnalytics: ApplicationAnalytics = {
  totalApplications: 4,
  applicationsByStatus: {
    'draft': 0,
    'submitted': 1,
    'under_review': 0,
    'phone_screening': 0,
    'technical_interview': 1,
    'final_interview': 0,
    'offer_received': 1,
    'offer_accepted': 0,
    'offer_declined': 0,
    'rejected': 1,
    'withdrawn': 0
  },
  applicationsByProfile: {
    'profile-1': 2, // Senior Full Stack Developer
    'profile-2': 1, // Data Engineer
    'profile-3': 1  // Data Analyst
  },
  averageMatchScore: 84.25,
  averageResponseTime: 6.3,
  successRate: 25, // 1 offer out of 4 applications
  
  applicationsThisMonth: 4,
  applicationsThisWeek: 2,
  
  topPerformingProfile: {
    profileId: 'profile-2',
    profileName: 'Data Engineer',
    applications: 1,
    successRate: 100
  },
  
  industriesAppliedTo: [
    {
      industry: 'Technology',
      count: 3,
      successRate: 33.3
    },
    {
      industry: 'Finance',
      count: 1,
      successRate: 0
    }
  ],
  
  companiesAppliedTo: [
    {
      company: 'TechCorp Solutions',
      applicationCount: 1,
      status: 'technical_interview'
    },
    {
      company: 'DataFlow Analytics',
      applicationCount: 1,
      status: 'offer_received'
    },
    {
      company: 'InsightCorp',
      applicationCount: 1,
      status: 'rejected'
    },
    {
      company: 'UX Design Studio',
      applicationCount: 1,
      status: 'submitted'
    }
  ]
};

// Helper functions for application management
export const getApplicationsByStatus = (status: ApplicationStatus): JobApplication[] => {
  return mockApplications.filter(app => app.status === status);
};

export const getApplicationsByProfile = (profileId: string): JobApplication[] => {
  return mockApplications.filter(app => app.profileId === profileId);
};

export const getActiveApplications = (): JobApplication[] => {
  const activeStatuses: ApplicationStatus[] = [
    'submitted', 'under_review', 'phone_screening', 
    'technical_interview', 'final_interview', 'offer_received'
  ];
  return mockApplications.filter(app => activeStatuses.includes(app.status));
};

export const getRecentApplications = (days: number = 7): JobApplication[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return mockApplications.filter(app => 
    new Date(app.appliedDate) >= cutoffDate
  );
};

export const getApplicationById = (id: string): JobApplication | undefined => {
  return mockApplications.find(app => app.id === id);
};