// Enhanced Types for Phase 2 Opportunity Management

export interface OpportunitySearchFilters {
  keywords: string[];
  location: LocationFilter;
  salary_range: [number, number];
  job_type: JobType[];
  experience_level: ExperienceLevel[];
  remote_options: RemoteOption[];
  company_size: CompanySize[];
  industry: Industry[];
  posted_within: PostedWithin;
  match_score_min: number;
}

export interface LocationFilter {
  city?: string;
  state?: string;
  country?: string;
  radius?: number; // miles
  remote_only?: boolean;
  hybrid_ok?: boolean;
}

export interface JobType {
  id: string;
  label: string;
  value: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship' | 'temporary';
}

export interface ExperienceLevel {
  id: string;
  label: string;
  value: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  years_range: [number, number];
}

export interface RemoteOption {
  id: string;
  label: string;
  value: 'onsite' | 'remote' | 'hybrid';
}

export interface CompanySize {
  id: string;
  label: string;
  value: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  employee_range: [number, number];
}

export interface Industry {
  id: string;
  label: string;
  value: string;
}

export interface PostedWithin {
  id: string;
  label: string;
  value: '1d' | '3d' | '1w' | '2w' | '1m' | 'any';
  days: number | null;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: OpportunitySearchFilters;
  created_at: string;
  last_run: string;
  new_results_count: number;
  alert_enabled: boolean;
  alert_frequency: 'immediate' | 'daily' | 'weekly';
}

export interface JobAlert {
  id: string;
  saved_search_id: string;
  frequency: 'immediate' | 'daily' | 'weekly';
  enabled: boolean;
  last_sent: string;
  total_sent: number;
}

export interface ApplicationRecord {
  id: string;
  job_opportunity_id: string;
  job_title: string;
  company_name: string;
  applied_date: string;
  status: ApplicationStatus;
  stage: ApplicationStage;
  last_update: string;
  next_action: string;
  notes: string;
  documents: ApplicationDocument[];
  communication_history: ApplicationCommunication[];
}

export interface ApplicationStatus {
  current: 'draft' | 'submitted' | 'under_review' | 'interview' | 'offer' | 'rejected' | 'withdrawn' | 'accepted';
  updated_at: string;
  updated_by: 'user' | 'system' | 'employer';
}

export interface ApplicationStage {
  current: 'applied' | 'phone_screen' | 'technical_interview' | 'onsite_interview' | 'final_interview' | 'reference_check' | 'offer_negotiation' | 'completed';
  stages_completed: string[];
  next_stage?: string;
  estimated_timeline: string;
}

export interface ApplicationDocument {
  id: string;
  type: 'resume' | 'cover_letter' | 'portfolio' | 'references' | 'other';
  name: string;
  url: string;
  uploaded_at: string;
  file_size: number;
}

export interface ApplicationCommunication {
  id: string;
  type: 'email' | 'phone' | 'message' | 'interview' | 'note';
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  subject?: string;
  content: string;
  timestamp: string;
  attachments?: ApplicationDocument[];
}

export interface ApplicationAnalytics {
  total_applications: number;
  applications_this_month: number;
  response_rate: number;
  interview_rate: number;
  offer_rate: number;
  avg_time_to_response: number; // days
  avg_time_to_offer: number; // days
  most_successful_keywords: string[];
  best_performing_job_types: JobType[];
  recommended_improvements: string[];
}

export interface SuccessPrediction {
  job_opportunity_id: string;
  overall_score: number; // 0-100
  factors: PredictionFactor[];
  recommendations: string[];
  similar_applications: ApplicationRecord[];
  estimated_response_time: string;
  application_strength: 'weak' | 'average' | 'strong' | 'excellent';
}

export interface PredictionFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  score: number;
  description: string;
  improvement_tip?: string;
}

export interface ApplicationOptimizer {
  job_opportunity_id: string;
  optimizations: OptimizationSuggestion[];
  cover_letter_suggestions: string[];
  resume_keywords: string[];
  application_timing: TimingRecommendation;
}

export interface OptimizationSuggestion {
  type: 'keyword' | 'skill' | 'experience' | 'format' | 'timing';
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  reason: string;
}

export interface TimingRecommendation {
  best_time_to_apply: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  competition_level: 'low' | 'medium' | 'high';
  application_window: string; // "Apply within next 3 days"
}

export interface ConversationThread {
  id: string;
  participant: {
    name: string;
    company: string;
    avatar: string;
    role: string;
    status: 'online' | 'offline' | 'busy';
  };
  messages: ThreadMessage[];
  lastMessage: {
    content: string;
    timestamp: string;
    sender: 'self' | 'other';
  };
  unreadCount: number;
  type: 'job_inquiry' | 'interview' | 'offer' | 'networking';
}

export interface ThreadMessage {
  id: string;
  sender: 'self' | 'other';
  content: string;
  timestamp: string;
  attachments?: { name: string; url: string; type: string }[];
}