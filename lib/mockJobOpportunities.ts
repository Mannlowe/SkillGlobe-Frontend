import { JobOpportunity, RequiredSkill } from './profileMatchingEngine';
import { SkillLevel } from '@/types/multi-profile';

// Mock job opportunities for testing the matching algorithm
export const mockJobOpportunities: JobOpportunity[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    location: 'Mumbai',
    workType: 'hybrid',
    jobType: 'full_time',
    industry: 'Technology',
    companySize: 'large',
    salaryRange: [140000, 180000],
    description: 'We are looking for a Senior Full Stack Developer to join our growing engineering team. You will be responsible for developing scalable web applications using modern technologies.',
    
    requiredSkills: [
      { name: 'React', level: SkillLevel.ADVANCED, required: true, weight: 0.9 },
      { name: 'Node.js', level: SkillLevel.ADVANCED, required: true, weight: 0.9 },
      { name: 'TypeScript', level: SkillLevel.PROFICIENT, required: true, weight: 0.8 },
      { name: 'JavaScript', level: SkillLevel.EXPERT, required: true, weight: 0.7 },
      { name: 'MongoDB', level: SkillLevel.PROFICIENT, required: true, weight: 0.6 }
    ],
    
    preferredSkills: [
      { name: 'AWS', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.5 },
      { name: 'Docker', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.4 },
      { name: 'GraphQL', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.3 },
      { name: 'Next.js', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.3 }
    ],
    
    yearsExperienceRequired: 5,
    seniorityLevel: 'senior',
    educationRequired: 'Bachelor\'s degree in Computer Science or related field',
    certifications: ['AWS Solutions Architect'],
    
    urgency: 'high',
    postedDate: '2024-02-10',
    applicationDeadline: '2024-03-10',
    
    skillWeight: 0.5,
    experienceWeight: 0.3,
    preferencesWeight: 0.2
  },
  
  {
    id: 'job-2', 
    title: 'Data Engineer',
    company: 'DataFlow Analytics',
    location: 'Bangalore',
    workType: 'remote',
    jobType: 'full_time',
    industry: 'Technology',
    companySize: 'medium',
    salaryRange: [120000, 160000],
    description: 'Join our data engineering team to build robust data pipelines and infrastructure. You will work with large-scale data processing and cloud technologies.',
    
    requiredSkills: [
      { name: 'Python', level: SkillLevel.ADVANCED, required: true, weight: 0.9 },
      { name: 'SQL', level: SkillLevel.EXPERT, required: true, weight: 0.9 },
      { name: 'Apache Spark', level: SkillLevel.PROFICIENT, required: true, weight: 0.8 },
      { name: 'Apache Airflow', level: SkillLevel.PROFICIENT, required: true, weight: 0.8 },
      { name: 'AWS', level: SkillLevel.ADVANCED, required: true, weight: 0.7 }
    ],
    
    preferredSkills: [
      { name: 'Kubernetes', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.5 },
      { name: 'Apache Kafka', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.5 },
      { name: 'Snowflake', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.4 },
      { name: 'dbt', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.4 }
    ],
    
    yearsExperienceRequired: 4,
    seniorityLevel: 'senior',
    educationRequired: 'Bachelor\'s degree in Computer Science, Engineering, or related field',
    certifications: ['AWS Certified Data Engineer', 'Snowflake SnowPro'],
    
    urgency: 'medium',
    postedDate: '2024-02-12',
    applicationDeadline: '2024-03-15',
    
    skillWeight: 0.6,
    experienceWeight: 0.25,
    preferencesWeight: 0.15
  },
  
  {
    id: 'job-3',
    title: 'Senior Data Analyst',
    company: 'InsightCorp',
    location: 'Delhi',
    workType: 'hybrid',
    jobType: 'full_time', 
    industry: 'Finance',
    companySize: 'large',
    salaryRange: [100000, 140000],
    description: 'We are seeking a Senior Data Analyst to drive data-driven decision making across the organization. You will work with business stakeholders to deliver actionable insights.',
    
    requiredSkills: [
      { name: 'SQL', level: SkillLevel.EXPERT, required: true, weight: 0.9 },
      { name: 'Python', level: SkillLevel.ADVANCED, required: true, weight: 0.8 },
      { name: 'Tableau', level: SkillLevel.ADVANCED, required: true, weight: 0.8 },
      { name: 'Excel', level: SkillLevel.EXPERT, required: true, weight: 0.7 }
    ],
    
    preferredSkills: [
      { name: 'R', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.5 },
      { name: 'Power BI', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.4 },
      { name: 'Google Analytics', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.3 },
      { name: 'Machine Learning', level: SkillLevel.BEGINNER, required: false, weight: 0.3 }
    ],
    
    yearsExperienceRequired: 4,
    seniorityLevel: 'senior',
    educationRequired: 'Bachelor\'s degree in Mathematics, Statistics, Economics, or related field',
    certifications: ['Tableau Desktop Specialist'],
    
    urgency: 'medium',
    postedDate: '2024-02-08',
    applicationDeadline: '2024-03-01',
    
    skillWeight: 0.4,
    experienceWeight: 0.3,
    preferencesWeight: 0.3
  },
  
  {
    id: 'job-4',
    title: 'Frontend Developer',
    company: 'UX Design Studio',
    location: 'Pune',
    workType: 'onsite',
    jobType: 'full_time',
    industry: 'Technology',
    companySize: 'small',
    salaryRange: [80000, 120000],
    description: 'Join our creative team as a Frontend Developer to build beautiful and responsive user interfaces. You will collaborate closely with designers and UX teams.',
    
    requiredSkills: [
      { name: 'React', level: SkillLevel.ADVANCED, required: true, weight: 0.9 },
      { name: 'JavaScript', level: SkillLevel.ADVANCED, required: true, weight: 0.8 },
      { name: 'CSS', level: SkillLevel.ADVANCED, required: true, weight: 0.8 },
      { name: 'HTML', level: SkillLevel.EXPERT, required: true, weight: 0.7 }
    ],
    
    preferredSkills: [
      { name: 'TypeScript', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.6 },
      { name: 'Tailwind CSS', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.5 },
      { name: 'Next.js', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.5 },
      { name: 'Figma', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.4 }
    ],
    
    yearsExperienceRequired: 3,
    seniorityLevel: 'mid',
    educationRequired: 'Bachelor\'s degree or equivalent experience',
    
    urgency: 'low',
    postedDate: '2024-02-14',
    applicationDeadline: '2024-03-20',
    
    skillWeight: 0.6,
    experienceWeight: 0.2,
    preferencesWeight: 0.2
  },
  
  {
    id: 'job-5',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Remote',
    workType: 'remote',
    jobType: 'full_time',
    industry: 'Technology',
    companySize: 'startup',
    salaryRange: [110000, 150000],
    description: 'We are looking for a DevOps Engineer to help scale our infrastructure and improve our deployment processes. You will work with cutting-edge cloud technologies.',
    
    requiredSkills: [
      { name: 'Kubernetes', level: SkillLevel.ADVANCED, required: true, weight: 0.9 },
      { name: 'Docker', level: SkillLevel.ADVANCED, required: true, weight: 0.9 },
      { name: 'AWS', level: SkillLevel.ADVANCED, required: true, weight: 0.8 },
      { name: 'Terraform', level: SkillLevel.PROFICIENT, required: true, weight: 0.8 },
      { name: 'Jenkins', level: SkillLevel.PROFICIENT, required: true, weight: 0.7 }
    ],
    
    preferredSkills: [
      { name: 'Ansible', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.5 },
      { name: 'Prometheus', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.5 },
      { name: 'Grafana', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.4 },
      { name: 'Helm', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.4 }
    ],
    
    yearsExperienceRequired: 4,
    seniorityLevel: 'senior',
    educationRequired: 'Bachelor\'s degree in Computer Science or related field',
    certifications: ['AWS Solutions Architect', 'Certified Kubernetes Administrator'],
    
    urgency: 'high',
    postedDate: '2024-02-11',
    applicationDeadline: '2024-02-28',
    
    skillWeight: 0.5,
    experienceWeight: 0.3,
    preferencesWeight: 0.2
  },
  
  {
    id: 'job-6',
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'Hyderabad',
    workType: 'hybrid',
    jobType: 'full_time',
    industry: 'Technology',
    companySize: 'medium',
    salaryRange: [150000, 200000],
    description: 'Join our AI team to build and deploy machine learning models at scale. You will work on cutting-edge ML infrastructure and model optimization.',
    
    requiredSkills: [
      { name: 'Python', level: SkillLevel.EXPERT, required: true, weight: 0.9 },
      { name: 'TensorFlow', level: SkillLevel.ADVANCED, required: true, weight: 0.9 },
      { name: 'PyTorch', level: SkillLevel.ADVANCED, required: true, weight: 0.8 },
      { name: 'MLflow', level: SkillLevel.PROFICIENT, required: true, weight: 0.7 },
      { name: 'Kubernetes', level: SkillLevel.PROFICIENT, required: true, weight: 0.7 }
    ],
    
    preferredSkills: [
      { name: 'Docker', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.5 },
      { name: 'AWS SageMaker', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.5 },
      { name: 'Kubeflow', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.4 },
      { name: 'Apache Airflow', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.4 }
    ],
    
    yearsExperienceRequired: 5,
    seniorityLevel: 'senior',
    educationRequired: 'Master\'s degree in Computer Science, ML, or related field',
    certifications: ['AWS Machine Learning Specialist'],
    
    urgency: 'high',
    postedDate: '2024-02-09',
    applicationDeadline: '2024-03-05',
    
    skillWeight: 0.6,
    experienceWeight: 0.25,
    preferencesWeight: 0.15
  },
  
  {
    id: 'job-7',
    title: 'Product Manager',
    company: 'Growth Ventures',
    location: 'Mumbai',
    workType: 'hybrid',
    jobType: 'full_time',
    industry: 'Fintech',
    companySize: 'startup',
    salaryRange: [130000, 170000],
    description: 'We are seeking a Product Manager to drive product strategy and execution. You will work closely with engineering, design, and business teams.',
    
    requiredSkills: [
      { name: 'Product Strategy', level: SkillLevel.ADVANCED, required: true, weight: 0.9 },
      { name: 'Agile', level: SkillLevel.ADVANCED, required: true, weight: 0.8 },
      { name: 'User Research', level: SkillLevel.PROFICIENT, required: true, weight: 0.8 },
      { name: 'Analytics', level: SkillLevel.PROFICIENT, required: true, weight: 0.7 },
      { name: 'Communication', level: SkillLevel.EXPERT, required: true, weight: 0.7 }
    ],
    
    preferredSkills: [
      { name: 'SQL', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.5 },
      { name: 'Figma', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.4 },
      { name: 'A/B Testing', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.4 },
      { name: 'Python', level: SkillLevel.BEGINNER, required: false, weight: 0.3 }
    ],
    
    yearsExperienceRequired: 4,
    seniorityLevel: 'senior',
    educationRequired: 'Bachelor\'s degree in Business, Engineering, or related field',
    
    urgency: 'medium',
    postedDate: '2024-02-13',
    applicationDeadline: '2024-03-12',
    
    skillWeight: 0.4,
    experienceWeight: 0.3,
    preferencesWeight: 0.3
  },
  
  {
    id: 'job-8',
    title: 'Junior Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Bangalore',
    workType: 'onsite',
    jobType: 'full_time',
    industry: 'Technology',
    companySize: 'startup',
    salaryRange: [60000, 90000],
    description: 'Perfect opportunity for a junior developer to grow their skills. You will work on web applications and learn from experienced developers.',
    
    requiredSkills: [
      { name: 'JavaScript', level: SkillLevel.INTERMEDIATE, required: true, weight: 0.9 },
      { name: 'React', level: SkillLevel.INTERMEDIATE, required: true, weight: 0.8 },
      { name: 'Node.js', level: SkillLevel.BEGINNER, required: true, weight: 0.7 },
      { name: 'HTML', level: SkillLevel.PROFICIENT, required: true, weight: 0.6 },
      { name: 'CSS', level: SkillLevel.PROFICIENT, required: true, weight: 0.6 }
    ],
    
    preferredSkills: [
      { name: 'TypeScript', level: SkillLevel.BEGINNER, required: false, weight: 0.4 },
      { name: 'MongoDB', level: SkillLevel.BEGINNER, required: false, weight: 0.3 },
      { name: 'Git', level: SkillLevel.INTERMEDIATE, required: false, weight: 0.3 }
    ],
    
    yearsExperienceRequired: 1,
    seniorityLevel: 'junior',
    educationRequired: 'Bachelor\'s degree in Computer Science or related field',
    
    urgency: 'low',
    postedDate: '2024-02-15',
    applicationDeadline: '2024-03-25',
    
    skillWeight: 0.5,
    experienceWeight: 0.2,
    preferencesWeight: 0.3
  }
];

// Helper function to get opportunities by industry
export const getOpportunitiesByIndustry = (industry: string): JobOpportunity[] => {
  return mockJobOpportunities.filter(job => 
    job.industry.toLowerCase() === industry.toLowerCase()
  );
};

// Helper function to get opportunities by work type
export const getOpportunitiesByWorkType = (workType: 'remote' | 'hybrid' | 'onsite'): JobOpportunity[] => {
  return mockJobOpportunities.filter(job => job.workType === workType);
};

// Helper function to get opportunities by salary range
export const getOpportunitiesBySalaryRange = (minSalary: number, maxSalary: number): JobOpportunity[] => {
  return mockJobOpportunities.filter(job => 
    job.salaryRange[0] <= maxSalary && job.salaryRange[1] >= minSalary
  );
};

// Helper function to get urgent opportunities
export const getUrgentOpportunities = (): JobOpportunity[] => {
  return mockJobOpportunities.filter(job => job.urgency === 'high');
};

// Helper function to get opportunities by seniority level
export const getOpportunitiesBySeniority = (seniority: string): JobOpportunity[] => {
  return mockJobOpportunities.filter(job => job.seniorityLevel === seniority);
};