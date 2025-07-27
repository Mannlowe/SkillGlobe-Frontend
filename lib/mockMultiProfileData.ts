import { 
  UserProfile, 
  ProfileCategory,
  SkillLevel,
  User,
  ProfilePerformanceMetrics,
  ProfileAnalytics,
  PersonalInfo
} from '@/types/multi-profile';
import { 
  VerificationBadgeSystem,
  VerificationType
} from '@/types/verification';

// Mock personal information
export const mockPersonalInfo: PersonalInfo = {
  firstName: 'Amit',
  lastName: 'Verma',
  email: 'amit.verma@skillglobe.com',
  phone: '+91 98765 43210',
  location: 'Mumbai, India',
  profilePhoto: '/api/placeholder/160/160',
  linkedInUrl: 'https://linkedin.com/in/amitverma',
  githubUrl: 'https://github.com/amitverma',
  portfolioUrl: 'https://amitverma.dev'
};

// Mock verification status
export const mockVerificationStatus: VerificationBadgeSystem = {
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
};

// Mock Full Stack Developer Profile
export const mockFullStackProfile: UserProfile = {
  id: 'profile-fullstack-1',
  userId: 'user-123',
  name: 'Senior Full Stack Developer',
  description: 'Experienced full-stack developer specializing in React, Node.js, and cloud technologies. Proven track record in building scalable web applications for fintech and e-commerce.',
  category: ProfileCategory.FULL_STACK_DEVELOPER,
  subCategories: ['Frontend Architecture', 'Backend APIs', 'Cloud Infrastructure'],
  
  primarySkills: [
    {
      name: 'React',
      level: SkillLevel.EXPERT,
      yearsExperience: 6,
      lastUsed: '2024-02-15',
      certifications: ['React Certified Developer'],
      projects: ['E-commerce Platform', 'Real-time Chat App', 'Dashboard Analytics']
    },
    {
      name: 'Node.js',
      level: SkillLevel.EXPERT,
      yearsExperience: 5,
      lastUsed: '2024-02-15',
      certifications: [],
      projects: ['API Gateway', 'Microservices Backend', 'Real-time Chat App']
    },
    {
      name: 'TypeScript',
      level: SkillLevel.ADVANCED,
      yearsExperience: 4,
      lastUsed: '2024-02-15',
      certifications: [],
      projects: ['Enterprise Dashboard', 'Type-safe APIs', 'Component Library']
    },
    {
      name: 'JavaScript',
      level: SkillLevel.EXPERT,
      yearsExperience: 8,
      lastUsed: '2024-02-15',
      certifications: [],
      projects: ['Web Applications', 'Browser Extensions', 'NPM Packages']
    }
  ],
  
  secondarySkills: [
    {
      name: 'AWS',
      level: SkillLevel.ADVANCED,
      yearsExperience: 3,
      lastUsed: '2024-02-10',
      certifications: ['AWS Solutions Architect'],
      projects: ['Cloud Infrastructure', 'Serverless APIs']
    },
    {
      name: 'MongoDB',
      level: SkillLevel.PROFICIENT,
      yearsExperience: 4,
      lastUsed: '2024-02-01',
      certifications: [],
      projects: ['User Management System', 'Content Management']
    },
    {
      name: 'Docker',
      level: SkillLevel.INTERMEDIATE,
      yearsExperience: 2,
      lastUsed: '2024-01-15',
      certifications: [],
      projects: ['Containerized Applications', 'Development Environment']
    },
    {
      name: 'GraphQL',
      level: SkillLevel.INTERMEDIATE,
      yearsExperience: 2,
      lastUsed: '2024-01-20',
      certifications: [],
      projects: ['API Layer', 'Client-Server Communication']
    }
  ],
  
  learningSkills: [
    {
      name: 'Next.js',
      level: SkillLevel.BEGINNER,
      yearsExperience: 0.5,
      lastUsed: '2024-02-01',
      certifications: [],
      projects: ['Personal Website', 'Learning Projects']
    },
    {
      name: 'Kubernetes',
      level: SkillLevel.BEGINNER,
      yearsExperience: 0.3,
      lastUsed: '2024-01-10',
      certifications: [],
      projects: []
    }
  ],
  
  relevantExperience: [
    {
      id: 'exp-1',
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Solutions',
      duration: '4 years',
      startDate: '2020-03-01',
      description: 'Lead development of scalable web applications serving 100k+ users. Architected microservices backend and modern React frontend.',
      skills: ['React', 'Node.js', 'AWS', 'MongoDB', 'TypeScript'],
      achievements: [
        'Reduced application load time by 60% through performance optimization',
        'Led team of 6 developers in delivering 3 major product releases',
        'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
        'Mentored 4 junior developers and conducted technical interviews'
      ],
      verified: false
    },
    {
      id: 'exp-2',
      title: 'Full Stack Developer',
      company: 'Digital Innovations Ltd',
      duration: '2 years',
      startDate: '2018-01-15',
      endDate: '2020-02-28',
      description: 'Developed customer-facing web applications and internal tools. Collaborated with design and product teams.',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Express.js'],
      achievements: [
        'Built e-commerce platform handling $2M+ in annual transactions',
        'Improved code coverage from 40% to 85% by implementing comprehensive testing',
        'Developed reusable component library used across 5 different projects'
      ],
      verified: true
    },
    {
      id: 'exp-3',
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      duration: '2 years',
      startDate: '2016-06-01',
      endDate: '2018-01-10',
      description: 'Responsible for frontend development and user experience optimization.',
      skills: ['JavaScript', 'HTML', 'CSS', 'jQuery'],
      achievements: [
        'Redesigned user interface increasing user engagement by 40%',
        'Implemented responsive design supporting mobile and tablet devices',
        'Optimized website performance achieving 95+ Lighthouse score'
      ],
      verified: false
    }
  ],
  
  achievements: [
    {
      id: 'achievement-1',
      title: 'AWS Solutions Architect Certification',
      description: 'Achieved AWS Solutions Architect Associate certification demonstrating cloud architecture expertise',
      date: '2023-06-15',
      category: 'Certification',
      verified: true
    },
    {
      id: 'achievement-2',
      title: 'Open Source Contributor',
      description: 'Contributed to 15+ open source projects with 500+ GitHub stars combined',
      date: '2024-01-01',
      category: 'Community',
      verified: false
    },
    {
      id: 'achievement-3',
      title: 'Tech Conference Speaker',
      description: 'Presented "Building Scalable React Applications" at ReactConf Mumbai 2023',
      date: '2023-11-20',
      category: 'Speaking',
      verified: false
    }
  ],
  
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2023-06-15',
      expiryDate: '2026-06-15',
      credentialId: 'AWS-SA-123456',
      verificationUrl: 'https://aws.amazon.com/verification/cert-1',
      verified: true
    },
    {
      id: 'cert-2',
      name: 'Professional Scrum Master I',
      issuer: 'Scrum.org',
      issueDate: '2022-03-10',
      credentialId: 'PSM-789012',
      verified: false
    },
    {
      id: 'cert-3',
      name: 'MongoDB Certified Developer',
      issuer: 'MongoDB University',
      issueDate: '2021-11-20',
      verified: false
    }
  ],
  
  jobPreferences: {
    salaryRange: [120000, 180000],
    workType: ['remote', 'hybrid'],
    jobTypes: ['full_time', 'contract'],
    industries: ['Technology', 'Fintech', 'E-commerce', 'Healthcare'],
    companySize: ['medium', 'large', 'enterprise'],
    locations: ['Mumbai', 'Bangalore', 'Remote'],
    travelWillingness: 20,
    availabilityDate: '2024-04-01'
  },
  
  matchingWeight: 1.0,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  lastUpdated: '2024-02-15T10:30:00Z'
};

// Mock Data Analyst Profile
export const mockDataAnalystProfile: UserProfile = {
  id: 'profile-analyst-1',
  userId: 'user-123',
  name: 'Senior Data Analyst',
  description: 'Results-driven data analyst with expertise in SQL, Python, and data visualization. Specialized in turning complex data into actionable business insights.',
  category: ProfileCategory.DATA_ANALYST,
  subCategories: ['Business Intelligence', 'Data Visualization', 'Statistical Analysis'],
  
  primarySkills: [
    {
      name: 'SQL',
      level: SkillLevel.EXPERT,
      yearsExperience: 5,
      lastUsed: '2024-02-15',
      certifications: [],
      projects: ['Sales Analytics', 'Customer Segmentation', 'Performance Dashboards']
    },
    {
      name: 'Python',
      level: SkillLevel.ADVANCED,
      yearsExperience: 4,
      lastUsed: '2024-02-14',
      certifications: [],
      projects: ['Predictive Modeling', 'Data Pipeline', 'Statistical Analysis']
    },
    {
      name: 'Tableau',
      level: SkillLevel.EXPERT,
      yearsExperience: 4,
      lastUsed: '2024-02-15',
      certifications: ['Tableau Desktop Specialist'],
      projects: ['Executive Dashboards', 'Sales Reports', 'Customer Analytics']
    },
    {
      name: 'Excel',
      level: SkillLevel.EXPERT,
      yearsExperience: 6,
      lastUsed: '2024-02-15',
      certifications: ['Microsoft Excel Expert'],
      projects: ['Financial Models', 'Pivot Tables', 'Advanced Formulas']
    }
  ],
  
  secondarySkills: [
    {
      name: 'Power BI',
      level: SkillLevel.ADVANCED,
      yearsExperience: 3,
      lastUsed: '2024-02-10',
      certifications: [],
      projects: ['Business Dashboards', 'KPI Tracking']
    },
    {
      name: 'R',
      level: SkillLevel.INTERMEDIATE,
      yearsExperience: 2,
      lastUsed: '2024-01-20',
      certifications: [],
      projects: ['Statistical Analysis', 'Data Modeling']
    },
    {
      name: 'Google Analytics',
      level: SkillLevel.PROFICIENT,
      yearsExperience: 3,
      lastUsed: '2024-02-05',
      certifications: ['Google Analytics Certified'],
      projects: ['Web Analytics', 'Conversion Tracking']
    }
  ],
  
  learningSkills: [
    {
      name: 'Machine Learning',
      level: SkillLevel.BEGINNER,
      yearsExperience: 0.5,
      lastUsed: '2024-01-30',
      certifications: [],
      projects: ['Learning Projects']
    }
  ],
  
  relevantExperience: [
    {
      id: 'exp-analyst-1',
      title: 'Senior Data Analyst',
      company: 'Analytics Corp',
      duration: '3 years',
      startDate: '2021-02-01',
      description: 'Lead data analyst responsible for business intelligence and reporting across multiple departments.',
      skills: ['SQL', 'Python', 'Tableau', 'Excel'],
      achievements: [
        'Increased reporting efficiency by 70% through automation',
        'Identified cost-saving opportunities worth $2M annually',
        'Built 20+ interactive dashboards for executive team'
      ],
      verified: false
    }
  ],
  
  achievements: [
    {
      id: 'achievement-analyst-1',
      title: 'Tableau Desktop Specialist Certification',
      description: 'Achieved Tableau certification demonstrating advanced data visualization skills',
      date: '2023-05-10',
      category: 'Certification',
      verified: true
    }
  ],
  
  certifications: [
    {
      id: 'cert-analyst-1',
      name: 'Tableau Desktop Specialist',
      issuer: 'Tableau',
      issueDate: '2023-05-10',
      verified: true
    },
    {
      id: 'cert-analyst-2',
      name: 'Google Analytics Certified',
      issuer: 'Google',
      issueDate: '2023-02-15',
      verified: true
    }
  ],
  
  jobPreferences: {
    salaryRange: [80000, 130000],
    workType: ['remote', 'hybrid', 'onsite'],
    jobTypes: ['full_time'],
    industries: ['Technology', 'Finance', 'E-commerce', 'Consulting'],
    companySize: ['small', 'medium', 'large'],
    locations: ['Mumbai', 'Delhi', 'Remote'],
    travelWillingness: 30,
    availabilityDate: '2024-03-15'
  },
  
  matchingWeight: 0.8,
  isActive: true,
  createdAt: '2024-01-15T00:00:00Z',
  lastUpdated: '2024-02-10T14:20:00Z'
};

// Mock User with Multiple Profiles
export const mockUser: User = {
  id: 'user-123',
  personalInfo: mockPersonalInfo,
  profiles: [mockFullStackProfile, mockDataAnalystProfile],
  defaultProfile: 'profile-fullstack-1',
  settings: {
    privacy: {
      profileVisibility: 'public',
      showSalaryExpectations: true,
      allowDirectMessages: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      opportunityAlerts: true,
      profileViewAlerts: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'Asia/Kolkata'
    }
  }
};

// Mock Performance Metrics
export const mockPerformanceMetrics: Map<string, ProfilePerformanceMetrics> = new Map([
  ['profile-fullstack-1', {
    profileId: 'profile-fullstack-1',
    totalOpportunities: 45,
    applicationsSubmitted: 12,
    responseRate: 78,
    interviewRate: 42,
    offerRate: 25,
    avgSalaryOffered: 160000,
    topPerformingSkills: ['React', 'Node.js', 'AWS'],
    improvementAreas: ['Add more certifications', 'Complete portfolio projects'],
    marketTrend: 'increasing',
    lastUpdated: '2024-02-15T10:30:00Z'
  }],
  ['profile-analyst-1', {
    profileId: 'profile-analyst-1',
    totalOpportunities: 32,
    applicationsSubmitted: 8,
    responseRate: 65,
    interviewRate: 38,
    offerRate: 19,
    avgSalaryOffered: 110000,
    topPerformingSkills: ['SQL', 'Tableau', 'Python'],
    improvementAreas: ['Learn machine learning', 'Get Power BI certification'],
    marketTrend: 'stable',
    lastUpdated: '2024-02-10T14:20:00Z'
  }]
]);

// Mock Analytics Data
export const mockProfileAnalytics: ProfileAnalytics = {
  profileId: 'profile-fullstack-1',
  marketCompetitiveness: 85,
  skillRelevanceScore: 92,
  experienceAlignment: 88,
  improvementSuggestions: [
    {
      type: 'certification_get',
      priority: 'high',
      description: 'Get Google Cloud Professional certification',
      expectedImpact: 'Could increase match rate by 15%',
      timeToComplete: '2-3 months',
      resources: [
        {
          id: 'gcp-course-1',
          title: 'Google Cloud Architect Certification Course',
          type: 'course',
          provider: 'Coursera',
          duration: '6 weeks',
          cost: 'paid',
          rating: 4.8,
          difficulty: 'intermediate'
        }
      ]
    },
    {
      type: 'skill_add',
      priority: 'medium',
      description: 'Add Kubernetes to your skill set',
      expectedImpact: 'Could increase opportunities by 20%',
      timeToComplete: '1-2 months',
      resources: [
        {
          id: 'k8s-tutorial-1',
          title: 'Kubernetes Fundamentals',
          type: 'tutorial',
          provider: 'Official Docs',
          duration: '4 weeks',
          cost: 'free',
          rating: 4.5,
          difficulty: 'intermediate'
        }
      ]
    }
  ],
  marketDemandTrends: [
    {
      skill: 'React',
      demandChange: 12,
      averageSalaryChange: 8,
      jobPostingsChange: 15,
      timeFrame: 'last 6 months',
      forecast: 'growing'
    },
    {
      skill: 'Node.js',
      demandChange: 10,
      averageSalaryChange: 6,
      jobPostingsChange: 12,
      timeFrame: 'last 6 months',
      forecast: 'growing'
    }
  ]
};