// Multi-Profile System Types for SkillGlobe Phase 3
// Based on the 03_profiles.md plan document

export enum ProfileCategory {
  DATA_ENGINEER = 'data_engineer',
  DATA_ANALYST = 'data_analyst', 
  DATA_SCIENTIST = 'data_scientist',
  FULL_STACK_DEVELOPER = 'full_stack_developer',
  FRONTEND_DEVELOPER = 'frontend_developer',
  BACKEND_DEVELOPER = 'backend_developer',
  DEVOPS_ENGINEER = 'devops_engineer',
  ML_ENGINEER = 'ml_engineer',
  PRODUCT_MANAGER = 'product_manager',
  BUSINESS_ANALYST = 'business_analyst',
  CUSTOM = 'custom'
}

export enum SkillLevel {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  PROFICIENT = 3,
  ADVANCED = 4,
  EXPERT = 5
}

export interface Skill {
  name: string;
  level: SkillLevel;               // 1-5 proficiency scale
  yearsExperience: number;
  lastUsed: string;                // When last used professionally
  certifications: string[];       // Related certifications
  projects: string[];              // Projects using this skill
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  startDate: string;
  endDate?: string;
  description: string;
  skills: string[];
  achievements: string[];
  verified: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  verified: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  verified: boolean;
}

export interface ProfileJobPreferences {
  salaryRange: [number, number];
  workType: ('remote' | 'hybrid' | 'onsite')[];
  jobTypes: ('full_time' | 'contract' | 'part_time')[];
  industries: string[];
  companySize: ('startup' | 'small' | 'medium' | 'large' | 'enterprise')[];
  locations: string[];
  travelWillingness: number;       // 0-100%
  availabilityDate: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;                    // "Senior Data Engineer"
  description: string;             // Brief profile description
  category: ProfileCategory;       // Primary career path
  subCategories: string[];         // Secondary specializations
  
  // Skills organized by relevance
  primarySkills: Skill[];          // Core competencies (Python, SQL)
  secondarySkills: Skill[];        // Supporting skills (Docker, AWS)
  learningSkills: Skill[];         // Currently developing
  
  // Experience tailored to profile
  relevantExperience: Experience[];
  achievements: Achievement[];
  certifications: Certification[];
  
  // Profile-specific preferences
  jobPreferences: ProfileJobPreferences;
  
  // Matching & Analytics
  matchingWeight: number;          // Profile priority for matching
  isActive: boolean;
  createdAt: string;
  lastUpdated: string;
}

export interface User {
  id: string;
  personalInfo: PersonalInfo;
  profiles: UserProfile[];         // Multiple specialized profiles
  defaultProfile: string;          // Primary profile ID
  settings: UserSettings;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: string;
  profilePhoto?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface UserSettings {
  privacy: {
    profileVisibility: 'public' | 'private' | 'limited';
    showSalaryExpectations: boolean;
    allowDirectMessages: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    opportunityAlerts: boolean;
    profileViewAlerts: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };
}

// Profile Templates & Presets
export interface ProfileTemplate {
  id: string;
  name: string;
  category: ProfileCategory;
  description: string;
  icon: string;
  suggestedSkills: {
    primary: string[];
    secondary: string[];
    optional: string[];
  };
  typicalRoles: string[];
  careerProgression: string[];
  avgSalaryRange: [number, number];
  marketDemand: 'high' | 'medium' | 'low';
  growthRate: number; // percentage
}

// Matching & Analytics
export interface MatchingResult {
  opportunityId: string;
  bestMatchingProfile: UserProfile;
  matchScore: number;               // Overall compatibility
  profileMatches: ProfileMatch[];   // All profile matches
  reasoning: MatchReasoning;
}

export interface ProfileMatch {
  profileId: string;
  profileName: string;
  matchScore: number;
  skillMatch: SkillMatchAnalysis;
  experienceMatch: ExperienceMatchAnalysis;  
  preferenceMatch: PreferenceMatchAnalysis;
  gapAnalysis: GapAnalysis;
}

export interface SkillMatchAnalysis {
  matchedSkills: MatchedSkill[];
  missingCriticalSkills: string[];
  missingPreferredSkills: string[];
  overqualifiedSkills: string[];
  skillMatchPercentage: number;
}

export interface MatchedSkill {
  skill: string;
  required: boolean;
  userLevel: number;                // 1-5
  requiredLevel: number;            // 1-5
  matchQuality: 'perfect' | 'good' | 'adequate' | 'below';
}

export interface ExperienceMatchAnalysis {
  yearsExperienceMatch: number;     // 0-100
  roleRelevanceScore: number;       // 0-100
  industryAlignment: number;        // 0-100
  seniorityMatch: 'under' | 'match' | 'over';
}

export interface PreferenceMatchAnalysis {
  salaryAlignment: number;          // 0-100
  locationMatch: boolean;
  workTypeMatch: boolean;
  industryPreferenceMatch: number;  // 0-100
  companySizeMatch: boolean;
}

export interface GapAnalysis {
  skillGaps: string[];
  experienceGaps: string[];
  certificationGaps: string[];
  timeToQualify: string;            // "3-6 months"
  improvementSuggestions: string[];
}

export interface MatchReasoning {
  whyGoodMatch: string[];
  potentialConcerns: string[];
  improvementAreas: string[];
  overallAssessment: string;
}

// Analytics & Performance
export interface ProfilePerformanceMetrics {
  profileId: string;
  totalOpportunities: number;
  applicationsSubmitted: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  avgSalaryOffered: number;
  topPerformingSkills: string[];
  improvementAreas: string[];
  marketTrend: 'increasing' | 'stable' | 'declining';
  lastUpdated: string;
}

export interface ProfileAnalytics {
  profileId: string;
  marketCompetitiveness: number;    // 0-100 score
  skillRelevanceScore: number;      // How relevant skills are
  experienceAlignment: number;      // Experience vs role requirements
  improvementSuggestions: Suggestion[];
  marketDemandTrends: MarketTrend[];
}

export interface Suggestion {
  type: 'skill_add' | 'skill_upgrade' | 'experience_highlight' | 'certification_get';
  priority: 'high' | 'medium' | 'low';
  description: string;
  expectedImpact: string;           // "Could increase match rate by 25%"
  timeToComplete: string;           // "2-3 months"
  resources: Resource[];            // Learning resources
}

export interface Resource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'tutorial' | 'certification' | 'practice';
  url?: string;
  provider: string;
  duration: string;
  cost: 'free' | 'paid';
  rating: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface MarketTrend {
  skill: string;
  demandChange: number;             // percentage change
  averageSalaryChange: number;      // percentage change
  jobPostingsChange: number;        // percentage change
  timeFrame: string;                // "last 6 months"
  forecast: 'growing' | 'stable' | 'declining';
}

// Application System
export interface ProfileApplication {
  id: string;
  opportunityId: string;
  profileUsed: UserProfile;         // Which profile was used
  customizedResume: string;         // Profile-optimized resume
  coverLetterTemplate: string;      // Profile-specific template
  skillsHighlighted: string[];      // Skills emphasized for this role
  applicationNotes: string;
  submittedAt: string;
  status: 'submitted' | 'viewed' | 'interview' | 'rejected' | 'offer';
}

// Profile Creation & Management
export interface ProfileCreationData {
  templateId?: string;
  name: string;
  description: string;
  category: ProfileCategory;
  skills: string[];
  experience: Partial<Experience>[];
  preferences: Partial<ProfileJobPreferences>;
}

export interface ProfileValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  completionScore: number;
  missingFields: string[];
}