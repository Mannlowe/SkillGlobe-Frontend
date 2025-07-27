import { 
  ProfileDetailsPage, 
  VerificationBadgeSystem, 
  VerificationType,
  VerifiedSkillsDisplay,
  VerifiedExperienceDisplay,
  VerifiedCertificationsDisplay,
  VerifiedPortfolioDisplay,
  SocialProofSection,
  ProfileCompletionScore
} from '@/types/verification';

// Mock user profile data
export const mockProfileData: ProfileDetailsPage = {
  profileId: 'profile-123',
  personalInfo: {
    name: 'Amit Verma',
    email: 'amit.verma@skillglobe.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    profilePhoto: '/api/placeholder/160/160',
    headline: 'Senior Full Stack Developer | React & Node.js Expert',
    bio: 'Passionate full-stack developer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. Open to exciting opportunities in fintech and e-commerce sectors.'
  },
  verificationStatus: {
    identityVerification: {
      type: VerificationType.IDENTITY,
      status: 'verified',
      verifiedDate: '2024-01-15',
      verificationMethod: 'Government ID verification',
      trustValue: 25,
      displayColor: 'gold',
      description: 'Identity verified with government-issued ID',
      benefits: ['Access to premium opportunities', 'Priority in search results', 'Trusted profile badge']
    },
    emailVerification: {
      type: VerificationType.EMAIL,
      status: 'verified',
      verifiedDate: '2024-01-10',
      verificationMethod: 'Email confirmation',
      trustValue: 10,
      displayColor: 'blue',
      description: 'Email address verified',
      benefits: ['Receive job alerts', 'Enable notifications']
    },
    phoneVerification: {
      type: VerificationType.PHONE,
      status: 'verified',
      verifiedDate: '2024-01-10',
      verificationMethod: 'SMS verification',
      trustValue: 10,
      displayColor: 'blue',
      description: 'Phone number verified',
      benefits: ['SMS notifications', 'Two-factor authentication']
    },
    educationVerification: {
      type: VerificationType.EDUCATION,
      status: 'verified',
      verifiedDate: '2024-01-20',
      verificationMethod: 'University database check',
      trustValue: 15,
      displayColor: 'purple',
      description: 'Education credentials verified',
      benefits: ['Display verified degree', 'Alumni network access']
    },
    employmentVerification: {
      type: VerificationType.EMPLOYMENT,
      status: 'pending',
      verificationMethod: 'Employment verification service',
      trustValue: 15,
      displayColor: 'purple',
      description: 'Employment history verification in progress',
      benefits: ['Verified work experience', 'Enhanced credibility']
    },
    skillVerification: [
      {
        type: VerificationType.SKILL_ASSESSMENT,
        status: 'verified',
        verifiedDate: '2024-02-01',
        verificationMethod: 'React skill assessment',
        trustValue: 5,
        displayColor: 'green',
        description: 'React skills verified',
        benefits: ['Skill badge', 'Higher ranking for React jobs']
      },
      {
        type: VerificationType.SKILL_ASSESSMENT,
        status: 'verified',
        verifiedDate: '2024-02-05',
        verificationMethod: 'Node.js skill assessment',
        trustValue: 5,
        displayColor: 'green',
        description: 'Node.js skills verified',
        benefits: ['Skill badge', 'Higher ranking for Node.js jobs']
      }
    ],
    certificationVerification: [
      {
        type: VerificationType.CERTIFICATION,
        status: 'verified',
        verifiedDate: '2024-01-25',
        verificationMethod: 'AWS certification database',
        trustValue: 10,
        displayColor: 'gold',
        description: 'AWS Solutions Architect verified',
        benefits: ['Display verified certification', 'Cloud job opportunities']
      }
    ],
    portfolioVerification: [],
    socialVerification: {
      type: VerificationType.SOCIAL_LINKEDIN,
      status: 'not_started',
      verificationMethod: 'LinkedIn profile connection',
      trustValue: 5,
      displayColor: 'blue',
      description: 'Connect your LinkedIn profile',
      benefits: ['Import work history', 'Professional network']
    },
    overallTrustScore: 75
  },
  skillsSection: {
    skills: [
      { name: 'React', level: 'expert', verified: true, verificationMethod: 'test', endorsementCount: 23 },
      { name: 'Node.js', level: 'expert', verified: true, verificationMethod: 'test', endorsementCount: 18 },
      { name: 'TypeScript', level: 'advanced', verified: false, endorsementCount: 12 },
      { name: 'MongoDB', level: 'advanced', verified: false, endorsementCount: 8 },
      { name: 'AWS', level: 'advanced', verified: true, verificationMethod: 'certification' },
      { name: 'Docker', level: 'intermediate', verified: false, endorsementCount: 5 },
      { name: 'GraphQL', level: 'intermediate', verified: false },
      { name: 'Python', level: 'intermediate', verified: false }
    ]
  },
  experienceSection: {
    experiences: [
      {
        id: 'exp-1',
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Solutions',
        duration: '2020 - Present',
        verified: false
      },
      {
        id: 'exp-2',
        title: 'Full Stack Developer',
        company: 'Digital Innovations Ltd',
        duration: '2018 - 2020',
        verified: true,
        verificationDate: '2024-01-22'
      },
      {
        id: 'exp-3',
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        duration: '2016 - 2018',
        verified: false
      }
    ]
  },
  certificationsSection: {
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Solutions Architect - Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2023-06-15',
        expiryDate: '2026-06-15',
        verified: true,
        verificationUrl: 'https://aws.amazon.com/verification/...'
      },
      {
        id: 'cert-2',
        name: 'Professional Scrum Master I',
        issuer: 'Scrum.org',
        issueDate: '2022-03-10',
        verified: false
      },
      {
        id: 'cert-3',
        name: 'MongoDB Certified Developer',
        issuer: 'MongoDB University',
        issueDate: '2021-11-20',
        verified: false
      }
    ]
  },
  portfolioSection: {
    items: [
      {
        id: 'port-1',
        title: 'E-commerce Platform',
        type: 'project',
        url: 'https://github.com/amitverma/ecommerce',
        verified: false,
        views: 234,
        likes: 45
      },
      {
        id: 'port-2',
        title: 'Real-time Chat Application',
        type: 'project',
        url: 'https://github.com/amitverma/chat-app',
        verified: false,
        views: 189,
        likes: 32
      },
      {
        id: 'port-3',
        title: 'Building Scalable APIs with Node.js',
        type: 'article',
        url: 'https://medium.com/@amitverma/scalable-apis',
        verified: false,
        views: 567,
        likes: 89
      }
    ]
  },
  socialProof: {
    totalEndorsements: 47,
    recentEndorsements: [
      {
        from: 'Priya Sharma',
        skill: 'React',
        date: '2024-02-10'
      },
      {
        from: 'Rajesh Kumar',
        skill: 'Node.js',
        date: '2024-02-08'
      },
      {
        from: 'Sarah Johnson',
        skill: 'TypeScript',
        date: '2024-02-05'
      }
    ],
    recommendations: [
      {
        from: 'Michael Chen',
        role: 'CTO at TechCorp Solutions',
        text: 'Amit is an exceptional developer who consistently delivers high-quality code. His expertise in React and Node.js has been invaluable to our team.',
        date: '2024-01-15'
      },
      {
        from: 'Lisa Anderson',
        role: 'Product Manager at Digital Innovations',
        text: 'I had the pleasure of working with Amit for 2 years. He is a problem solver who brings innovative solutions to complex challenges.',
        date: '2023-08-20'
      }
    ]
  },
  completionScore: {
    overall: 78,
    sections: {
      personal: 100,
      skills: 85,
      experience: 70,
      education: 80,
      certifications: 60,
      portfolio: 75
    },
    suggestions: [
      'Verify your current employment to boost credibility',
      'Add more certifications to showcase expertise',
      'Complete skill assessments for TypeScript and MongoDB',
      'Connect your LinkedIn profile for social verification'
    ]
  }
};

// Mock data for users with different verification levels
export const mockProfileBasicVerified = {
  ...mockProfileData,
  verificationStatus: {
    ...mockProfileData.verificationStatus,
    identityVerification: { ...mockProfileData.verificationStatus.identityVerification, status: 'not_started' as const },
    educationVerification: { ...mockProfileData.verificationStatus.educationVerification, status: 'not_started' as const },
    employmentVerification: { ...mockProfileData.verificationStatus.employmentVerification, status: 'not_started' as const },
    skillVerification: [],
    certificationVerification: [],
    overallTrustScore: 20
  }
};

export const mockProfileExpertVerified = {
  ...mockProfileData,
  verificationStatus: {
    ...mockProfileData.verificationStatus,
    employmentVerification: { ...mockProfileData.verificationStatus.employmentVerification, status: 'verified' as const, verifiedDate: '2024-01-25' },
    socialVerification: { ...mockProfileData.verificationStatus.socialVerification, status: 'verified' as const, verifiedDate: '2024-01-12' },
    skillVerification: [
      ...mockProfileData.verificationStatus.skillVerification,
      {
        type: VerificationType.SKILL_ASSESSMENT,
        status: 'verified' as const,
        verifiedDate: '2024-02-10',
        verificationMethod: 'TypeScript skill assessment',
        trustValue: 5,
        displayColor: 'green' as const,
        description: 'TypeScript skills verified',
        benefits: ['Skill badge', 'Higher ranking for TypeScript jobs']
      }
    ],
    overallTrustScore: 95
  }
};