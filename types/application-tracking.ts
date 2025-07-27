// Application tracking types for multi-profile system

export interface JobApplication {
  id: string;
  opportunityId: string;
  profileId: string;
  userId: string;
  appliedDate: string;
  status: ApplicationStatus;
  
  // Opportunity details (snapshot at time of application)
  jobTitle: string;
  company: string;
  location: string;
  salaryRange: [number, number];
  workType: 'remote' | 'hybrid' | 'onsite';
  
  // Profile context
  profileName: string;
  matchScore: number;
  
  // Application tracking
  statusHistory: ApplicationStatusChange[];
  notes: string[];
  documents: ApplicationDocument[];
  
  // Communication tracking
  interviews: Interview[];
  communications: Communication[];
  
  // Analytics
  viewCount?: number;
  responseTime?: number; // days to get response
  lastUpdated: string;
}

export type ApplicationStatus = 
  | 'draft'
  | 'submitted' 
  | 'under_review'
  | 'phone_screening'
  | 'technical_interview'
  | 'final_interview'
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_declined'
  | 'rejected'
  | 'withdrawn';

export interface ApplicationStatusChange {
  id: string;
  status: ApplicationStatus;
  changedDate: string;
  notes?: string;
  changedBy: 'user' | 'system' | 'company';
}

export interface ApplicationDocument {
  id: string;
  type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate' | 'other';
  name: string;
  url: string;
  uploadedDate: string;
  profileId: string; // which profile this document is associated with
}

export interface Interview {
  id: string;
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'final';
  scheduledDate: string;
  duration: number; // minutes
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  feedback?: string;
  outcome?: 'passed' | 'failed' | 'pending';
}

export interface Communication {
  id: string;
  type: 'email' | 'phone' | 'message' | 'meeting';
  direction: 'inbound' | 'outbound';
  subject: string;
  content: string;
  date: string;
  from: string;
  to: string;
  important: boolean;
}

// Application analytics and insights
export interface ApplicationAnalytics {
  totalApplications: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
  applicationsByProfile: Record<string, number>;
  averageMatchScore: number;
  averageResponseTime: number;
  successRate: number; // offers received / applications submitted
  
  // Time-based analytics
  applicationsThisMonth: number;
  applicationsThisWeek: number;
  
  // Profile performance
  topPerformingProfile: {
    profileId: string;
    profileName: string;
    applications: number;
    successRate: number;
  };
  
  // Industry insights
  industriesAppliedTo: Array<{
    industry: string;
    count: number;
    successRate: number;
  }>;
  
  // Company insights
  companiesAppliedTo: Array<{
    company: string;
    applicationCount: number;
    status: ApplicationStatus;
  }>;
}

// Filters and search
export interface ApplicationFilters {
  status?: ApplicationStatus[];
  profileId?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  company?: string[];
  industry?: string[];
  location?: string[];
  salaryRange?: [number, number];
  matchScoreRange?: [number, number];
}

export interface ApplicationSearchParams {
  query?: string;
  filters?: ApplicationFilters;
  sortBy?: 'date' | 'company' | 'status' | 'matchScore' | 'salary';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Bulk operations
export interface BulkApplicationOperation {
  type: 'status_update' | 'add_note' | 'delete' | 'export';
  applicationIds: string[];
  data?: any;
}

// Application templates and automation
export interface ApplicationTemplate {
  id: string;
  name: string;
  profileId: string;
  coverLetterTemplate: string;
  emailTemplate: string;
  isDefault: boolean;
  createdDate: string;
  lastUsed?: string;
}

// Application reminders and notifications
export interface ApplicationReminder {
  id: string;
  applicationId: string;
  type: 'follow_up' | 'interview_prep' | 'status_check' | 'deadline';
  title: string;
  description: string;
  scheduledDate: string;
  completed: boolean;
  createdDate: string;
}

export interface ApplicationNotification {
  id: string;
  type: 'status_change' | 'interview_scheduled' | 'reminder' | 'deadline_approaching';
  title: string;
  message: string;
  applicationId: string;
  read: boolean;
  createdDate: string;
  actionUrl?: string;
}