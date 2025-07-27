// Verification system types and interfaces for SkillGlobe
import { ReactNode } from 'react';

export enum VerificationType {
  IDENTITY = 'identity',              // Government ID - Gold badge
  EMAIL = 'email',                   // Email verification - Blue badge  
  PHONE = 'phone',                   // Phone verification - Blue badge
  EDUCATION = 'education',           // Degree verification - Purple badge
  EMPLOYMENT = 'employment',         // Job history verification - Purple badge
  SKILL_ASSESSMENT = 'skill_test',   // Skill test passed - Green badge
  SKILL_ENDORSEMENT = 'skill_endorse', // Peer endorsed - Green badge
  CERTIFICATION = 'certification',    // Professional cert - Gold badge
  PORTFOLIO = 'portfolio',           // Work verified - Green badge
  SOCIAL_LINKEDIN = 'social_linkedin', // LinkedIn verified - Blue badge
  SOCIAL_GITHUB = 'social_github',   // GitHub verified - Green badge
  BACKGROUND_CHECK = 'background',   // Professional background - Gold badge
}

export interface VerificationBadge {
  type: VerificationType;
  status: 'verified' | 'pending' | 'failed' | 'not_started';
  verifiedDate?: string;
  expiryDate?: string;
  verificationMethod: string;
  trustValue: number;                       // Contribution to overall trust score
  displayColor: 'green' | 'blue' | 'gold' | 'purple'; // Badge color tier
  icon?: ReactNode;
  description: string;
  benefits: string[];                       // What this verification unlocks
}

export interface VerificationBadgeSystem {
  identityVerification: VerificationBadge;      // Government ID verified
  emailVerification: VerificationBadge;         // Email address verified
  phoneVerification: VerificationBadge;         // Phone number verified
  educationVerification: VerificationBadge;     // Degree/education verified
  employmentVerification: VerificationBadge;    // Work history verified  
  skillVerification: VerificationBadge[];       // Skills verified through tests/endorsements
  certificationVerification: VerificationBadge[]; // Professional certifications verified
  portfolioVerification: VerificationBadge[];   // Work samples verified
  socialVerification: VerificationBadge;        // Social media profiles verified
  overallTrustScore: number;                    // 0-100 comprehensive trust score
}

export interface VerificationTier {
  name: string;
  color: 'green' | 'blue' | 'purple' | 'gold';
  requiredVerifications: VerificationType[];
  benefits: string[];
  trustScoreBonus: number;
}

export interface VerificationStep {
  id: string;
  type: VerificationType;
  title: string;
  description: string;
  requirements: string[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  trustScoreImpact: number;
  benefits: string[];
  verificationMethod: string;
  documentsRequired?: string[];
  automatedVerification: boolean;
}

export interface VerificationWorkflow {
  steps: VerificationStep[];
  currentStep: number;
  completedSteps: VerificationStep[];
  estimatedTimeToComplete: string;
  priorityRecommendations: VerificationStep[];
}

export interface ProfileDetailsPage {
  profileId: string;
  personalInfo: PersonalInfoDisplay;
  verificationStatus: VerificationBadgeSystem;
  skillsSection: VerifiedSkillsDisplay;
  experienceSection: VerifiedExperienceDisplay;
  certificationsSection: VerifiedCertificationsDisplay;
  portfolioSection: VerifiedPortfolioDisplay;
  socialProof: SocialProofSection;
  completionScore: ProfileCompletionScore;
}

// Supporting interfaces
export interface PersonalInfoDisplay {
  name: string;
  email: string;
  phone?: string;
  location: string;
  profilePhoto?: string;
  headline: string;
  bio: string;
}

export interface VerifiedSkillsDisplay {
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    verified: boolean;
    verificationMethod?: 'test' | 'endorsement' | 'certification';
    endorsementCount?: number;
  }>;
}

export interface VerifiedExperienceDisplay {
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    duration: string;
    verified: boolean;
    verificationDate?: string;
  }>;
}

export interface VerifiedCertificationsDisplay {
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    verified: boolean;
    verificationUrl?: string;
  }>;
}

export interface VerifiedPortfolioDisplay {
  items: Array<{
    id: string;
    title: string;
    type: 'project' | 'article' | 'code' | 'design';
    url?: string;
    verified: boolean;
    views: number;
    likes: number;
  }>;
}

export interface SocialProofSection {
  totalEndorsements: number;
  recentEndorsements: Array<{
    from: string;
    skill: string;
    date: string;
  }>;
  recommendations: Array<{
    from: string;
    role: string;
    text: string;
    date: string;
  }>;
}

export interface ProfileCompletionScore {
  overall: number;
  sections: {
    personal: number;
    skills: number;
    experience: number;
    education: number;
    certifications: number;
    portfolio: number;
  };
  suggestions: string[];
}

// Verification tier definitions
export const VERIFICATION_TIERS: VerificationTier[] = [
  {
    name: 'Basic Verified',
    color: 'blue',
    requiredVerifications: [VerificationType.EMAIL, VerificationType.PHONE],
    benefits: [
      'Profile appears in search results',
      'Can apply to basic opportunities',
      'Basic messaging capabilities'
    ],
    trustScoreBonus: 20
  },
  {
    name: 'Identity Verified',
    color: 'green', 
    requiredVerifications: [
      VerificationType.EMAIL, 
      VerificationType.PHONE, 
      VerificationType.IDENTITY
    ],
    benefits: [
      'Higher ranking in search results',
      'Access to premium opportunities',
      'Enhanced profile visibility',
      'Trusted applicant status'
    ],
    trustScoreBonus: 40
  },
  {
    name: 'Professional Verified',
    color: 'purple',
    requiredVerifications: [
      VerificationType.EMAIL,
      VerificationType.PHONE, 
      VerificationType.IDENTITY,
      VerificationType.EDUCATION,
      VerificationType.EMPLOYMENT
    ],
    benefits: [
      'Access to exclusive opportunities',
      'Direct recruiter contact',
      'Priority application processing',
      'Professional networking features',
      'Enhanced credibility score'
    ],
    trustScoreBonus: 60
  },
  {
    name: 'Expert Verified',
    color: 'gold',
    requiredVerifications: [
      VerificationType.EMAIL,
      VerificationType.PHONE,
      VerificationType.IDENTITY, 
      VerificationType.EDUCATION,
      VerificationType.EMPLOYMENT,
      VerificationType.CERTIFICATION,
      VerificationType.SKILL_ASSESSMENT
    ],
    benefits: [
      'Top-tier opportunity access',
      'Premium recruiter visibility',
      'Mentoring opportunities',
      'Industry expert recognition',
      'Maximum trust score',
      'Featured profile status'
    ],
    trustScoreBonus: 100
  }
];

// Example verification steps
export const IDENTITY_VERIFICATION_STEP: VerificationStep = {
  id: 'identity_verification',
  type: VerificationType.IDENTITY,
  title: 'Identity Verification',
  description: 'Verify your identity using government-issued ID',
  requirements: [
    'Government-issued photo ID (passport, driver\'s license, national ID)',
    'Clear, well-lit photo of ID',
    'Selfie for identity matching'
  ],
  estimatedTime: '5-10 minutes',
  difficulty: 'easy',
  trustScoreImpact: 25,
  benefits: [
    'Gold verification badge',
    'Access to premium opportunities',
    'Enhanced profile credibility',
    'Priority in search results'
  ],
  verificationMethod: 'AI-powered ID verification + manual review',
  documentsRequired: ['government_id', 'selfie'],
  automatedVerification: true
};

export const EMAIL_VERIFICATION_STEP: VerificationStep = {
  id: 'email_verification',
  type: VerificationType.EMAIL,
  title: 'Email Verification',
  description: 'Verify your email address',
  requirements: [
    'Access to your email inbox',
    'Click verification link sent to your email'
  ],
  estimatedTime: '1-2 minutes',
  difficulty: 'easy',
  trustScoreImpact: 10,
  benefits: [
    'Blue verification badge',
    'Enable email notifications',
    'Basic platform access'
  ],
  verificationMethod: 'Email link verification',
  automatedVerification: true
};

export const EDUCATION_VERIFICATION_STEP: VerificationStep = {
  id: 'education_verification',
  type: VerificationType.EDUCATION,
  title: 'Education Verification',
  description: 'Verify your educational qualifications',
  requirements: [
    'Degree certificate or transcript',
    'Institution name and graduation year',
    'Student ID (if available)'
  ],
  estimatedTime: '24-48 hours',
  difficulty: 'medium',
  trustScoreImpact: 20,
  benefits: [
    'Purple verification badge',
    'Educational credentials displayed',
    'Access to alumni networks',
    'Enhanced recruiter trust'
  ],
  verificationMethod: 'Database verification + document review',
  documentsRequired: ['degree_certificate', 'transcript'],
  automatedVerification: false
};