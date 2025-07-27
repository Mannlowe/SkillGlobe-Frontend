// Profile Templates and Presets for SkillGlobe Multi-Profile System
import { ProfileTemplate, ProfileCategory } from '@/types/multi-profile';

export const PROFILE_TEMPLATES: ProfileTemplate[] = [
  {
    id: 'data_engineer_template',
    name: 'Data Engineer',
    category: ProfileCategory.DATA_ENGINEER,
    description: 'Build and maintain data pipelines, ETL processes, and data infrastructure',
    icon: '🔧',
    suggestedSkills: {
      primary: ['Python', 'SQL', 'Apache Airflow', 'Docker', 'Kubernetes'],
      secondary: ['Apache Spark', 'Apache Kafka', 'PostgreSQL', 'MongoDB', 'AWS', 'GCP'],
      optional: ['Scala', 'Java', 'Terraform', 'Jenkins', 'Snowflake', 'dbt']
    },
    typicalRoles: ['Data Engineer', 'ETL Developer', 'Pipeline Engineer', 'Data Platform Engineer'],
    careerProgression: ['Junior Data Engineer', 'Data Engineer', 'Senior Data Engineer', 'Lead Data Engineer', 'Data Engineering Manager'],
    avgSalaryRange: [90000, 160000],
    marketDemand: 'high',
    growthRate: 25
  },
  {
    id: 'data_analyst_template',
    name: 'Data Analyst',
    category: ProfileCategory.DATA_ANALYST,
    description: 'Analyze data to drive business insights and create reports and dashboards',
    icon: '📊',
    suggestedSkills: {
      primary: ['SQL', 'Excel', 'Power BI', 'Tableau', 'Python'],
      secondary: ['R', 'Google Analytics', 'Looker', 'Statistics', 'Data Visualization'],
      optional: ['Jupyter', 'Pandas', 'NumPy', 'SAS', 'SPSS', 'Qlik']
    },
    typicalRoles: ['Data Analyst', 'Business Analyst', 'Reporting Analyst', 'Market Research Analyst'],
    careerProgression: ['Junior Data Analyst', 'Data Analyst', 'Senior Data Analyst', 'Lead Analyst', 'Analytics Manager'],
    avgSalaryRange: [65000, 120000],
    marketDemand: 'high',
    growthRate: 20
  },
  {
    id: 'data_scientist_template',
    name: 'Data Scientist',
    category: ProfileCategory.DATA_SCIENTIST,
    description: 'Apply statistical analysis and machine learning to solve complex business problems',
    icon: '🧬',
    suggestedSkills: {
      primary: ['Python', 'R', 'Machine Learning', 'Statistics', 'SQL'],
      secondary: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Jupyter', 'Pandas', 'NumPy'],
      optional: ['Deep Learning', 'NLP', 'Computer Vision', 'MLflow', 'Spark', 'Hadoop']
    },
    typicalRoles: ['Data Scientist', 'ML Engineer', 'Research Scientist', 'Applied Scientist'],
    careerProgression: ['Junior Data Scientist', 'Data Scientist', 'Senior Data Scientist', 'Principal Data Scientist', 'Head of Data Science'],
    avgSalaryRange: [100000, 180000],
    marketDemand: 'high',
    growthRate: 22
  },
  {
    id: 'full_stack_developer_template',
    name: 'Full Stack Developer',
    category: ProfileCategory.FULL_STACK_DEVELOPER,
    description: 'Develop both front-end and back-end components of web applications',
    icon: '💻',
    suggestedSkills: {
      primary: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'],
      secondary: ['TypeScript', 'Express.js', 'MongoDB', 'PostgreSQL', 'Git', 'REST APIs'],
      optional: ['Next.js', 'Vue.js', 'Angular', 'GraphQL', 'Docker', 'AWS', 'Redux']
    },
    typicalRoles: ['Full Stack Developer', 'Web Developer', 'Software Engineer', 'Application Developer'],
    careerProgression: ['Junior Full Stack Developer', 'Full Stack Developer', 'Senior Full Stack Developer', 'Lead Developer', 'Engineering Manager'],
    avgSalaryRange: [75000, 140000],
    marketDemand: 'high',
    growthRate: 18
  },
  {
    id: 'frontend_developer_template',
    name: 'Frontend Developer',
    category: ProfileCategory.FRONTEND_DEVELOPER,
    description: 'Create user interfaces and user experiences for web applications',
    icon: '🎨',
    suggestedSkills: {
      primary: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript'],
      secondary: ['Redux', 'Sass', 'Webpack', 'Git', 'Figma', 'Responsive Design'],
      optional: ['Vue.js', 'Angular', 'Next.js', 'Tailwind CSS', 'Jest', 'Cypress']
    },
    typicalRoles: ['Frontend Developer', 'UI Developer', 'React Developer', 'Web Developer'],
    careerProgression: ['Junior Frontend Developer', 'Frontend Developer', 'Senior Frontend Developer', 'Frontend Lead', 'Frontend Architect'],
    avgSalaryRange: [70000, 130000],
    marketDemand: 'high',
    growthRate: 15
  },
  {
    id: 'backend_developer_template',
    name: 'Backend Developer',
    category: ProfileCategory.BACKEND_DEVELOPER,
    description: 'Build and maintain server-side logic, databases, and APIs',
    icon: '⚙️',
    suggestedSkills: {
      primary: ['Node.js', 'Python', 'Java', 'SQL', 'REST APIs'],
      secondary: ['Express.js', 'Django', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'Redis'],
      optional: ['GraphQL', 'Microservices', 'Docker', 'Kubernetes', 'AWS', 'Go']
    },
    typicalRoles: ['Backend Developer', 'API Developer', 'Server-side Developer', 'Software Engineer'],
    careerProgression: ['Junior Backend Developer', 'Backend Developer', 'Senior Backend Developer', 'Backend Lead', 'Backend Architect'],
    avgSalaryRange: [75000, 135000],
    marketDemand: 'high',
    growthRate: 16
  },
  {
    id: 'devops_engineer_template',
    name: 'DevOps Engineer',
    category: ProfileCategory.DEVOPS_ENGINEER,
    description: 'Automate deployment, monitor systems, and improve development workflows',
    icon: '🔄',
    suggestedSkills: {
      primary: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
      secondary: ['Linux', 'Git', 'Ansible', 'Prometheus', 'Grafana', 'Bash'],
      optional: ['GCP', 'Azure', 'Helm', 'ArgoCD', 'Vault', 'Istio']
    },
    typicalRoles: ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer', 'Platform Engineer'],
    careerProgression: ['Junior DevOps Engineer', 'DevOps Engineer', 'Senior DevOps Engineer', 'DevOps Lead', 'DevOps Architect'],
    avgSalaryRange: [85000, 150000],
    marketDemand: 'high',
    growthRate: 28
  },
  {
    id: 'ml_engineer_template',
    name: 'ML Engineer',
    category: ProfileCategory.ML_ENGINEER,
    description: 'Deploy and maintain machine learning models in production systems',
    icon: '🤖',
    suggestedSkills: {
      primary: ['Python', 'TensorFlow', 'PyTorch', 'MLflow', 'Kubernetes'],
      secondary: ['Docker', 'AWS SageMaker', 'Scikit-learn', 'Pandas', 'NumPy', 'Git'],
      optional: ['Kubeflow', 'Apache Airflow', 'Redis', 'Kafka', 'Spark', 'ONNX']
    },
    typicalRoles: ['ML Engineer', 'MLOps Engineer', 'AI Engineer', 'Applied ML Engineer'],
    careerProgression: ['Junior ML Engineer', 'ML Engineer', 'Senior ML Engineer', 'Principal ML Engineer', 'ML Engineering Manager'],
    avgSalaryRange: [110000, 190000],
    marketDemand: 'high',
    growthRate: 35
  },
  {
    id: 'product_manager_template',
    name: 'Product Manager',
    category: ProfileCategory.PRODUCT_MANAGER,
    description: 'Guide product development strategy and work with cross-functional teams',
    icon: '📱',
    suggestedSkills: {
      primary: ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'Communication'],
      secondary: ['Roadmapping', 'Wireframing', 'A/B Testing', 'SQL', 'Jira', 'Figma'],
      optional: ['Python', 'R', 'Product Marketing', 'Growth Hacking', 'Competitive Analysis']
    },
    typicalRoles: ['Product Manager', 'Associate Product Manager', 'Technical Product Manager', 'Senior Product Manager'],
    careerProgression: ['Associate PM', 'Product Manager', 'Senior PM', 'Group PM', 'VP of Product'],
    avgSalaryRange: [90000, 160000],
    marketDemand: 'high',
    growthRate: 19
  },
  {
    id: 'business_analyst_template',
    name: 'Business Analyst',
    category: ProfileCategory.BUSINESS_ANALYST,
    description: 'Analyze business processes and requirements to improve operations',
    icon: '📈',
    suggestedSkills: {
      primary: ['Business Analysis', 'Requirements Gathering', 'Process Mapping', 'Excel', 'SQL'],
      secondary: ['Tableau', 'Power BI', 'Visio', 'JIRA', 'Confluence', 'Agile'],
      optional: ['Python', 'R', 'Salesforce', 'SAP', 'Project Management', 'UML']
    },
    typicalRoles: ['Business Analyst', 'Systems Analyst', 'Process Analyst', 'Requirements Analyst'],
    careerProgression: ['Junior Business Analyst', 'Business Analyst', 'Senior BA', 'Lead BA', 'BA Manager'],
    avgSalaryRange: [65000, 115000],
    marketDemand: 'medium',
    growthRate: 14
  }
];

// Helper functions
export const getTemplateById = (templateId: string): ProfileTemplate | undefined => {
  return PROFILE_TEMPLATES.find(template => template.id === templateId);
};

export const getTemplatesByCategory = (category: ProfileCategory): ProfileTemplate[] => {
  return PROFILE_TEMPLATES.filter(template => template.category === category);
};

export const getPopularTemplates = (): ProfileTemplate[] => {
  return PROFILE_TEMPLATES
    .filter(template => template.marketDemand === 'high')
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 6);
};

export const getTrendingTemplates = (): ProfileTemplate[] => {
  return PROFILE_TEMPLATES
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 5);
};

export const searchTemplates = (query: string): ProfileTemplate[] => {
  const searchTerm = query.toLowerCase();
  return PROFILE_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.typicalRoles.some(role => role.toLowerCase().includes(searchTerm)) ||
    template.suggestedSkills.primary.some(skill => skill.toLowerCase().includes(searchTerm))
  );
};

// Template categories for UI organization
export const TEMPLATE_CATEGORIES = [
  {
    name: 'Data & Analytics',
    description: 'Work with data to drive business insights',
    categories: [
      ProfileCategory.DATA_ENGINEER,
      ProfileCategory.DATA_ANALYST,
      ProfileCategory.DATA_SCIENTIST
    ]
  },
  {
    name: 'Software Development',
    description: 'Build applications and software systems',
    categories: [
      ProfileCategory.FULL_STACK_DEVELOPER,
      ProfileCategory.FRONTEND_DEVELOPER,
      ProfileCategory.BACKEND_DEVELOPER
    ]
  },
  {
    name: 'Infrastructure & Operations',
    description: 'Manage systems, deployment, and operations',
    categories: [
      ProfileCategory.DEVOPS_ENGINEER,
      ProfileCategory.ML_ENGINEER
    ]
  },
  {
    name: 'Business & Strategy',
    description: 'Drive business strategy and process improvement',
    categories: [
      ProfileCategory.PRODUCT_MANAGER,
      ProfileCategory.BUSINESS_ANALYST
    ]
  }
];