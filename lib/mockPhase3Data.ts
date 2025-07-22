import type { 
  ProfileOptimizationHub, 
  ProfileTask, 
  FloatingCareerCoach,
  ProfileAnalytics 
} from '@/types/profile-optimization';

export const mockProfileOptimizationHub: ProfileOptimizationHub = {
  strategic_completion: {
    market_impact_score: 68,
    completion_priorities: [
      {
        id: 'task-1',
        title: 'Add Portfolio Projects',
        description: 'Showcase 3-5 recent projects with live demos and code repositories',
        market_impact: 'High',
        time_investment: '2 hours',
        completion_boost: 15,
        market_rationale: 'React developers with portfolios get 40% more interviews',
        priority_score: 95,
        category: 'portfolio',
        status: 'pending'
      },
      {
        id: 'task-2',
        title: 'Optimize LinkedIn Headline',
        description: 'Include key skills and value proposition in your headline',
        market_impact: 'High',
        time_investment: '15 minutes',
        completion_boost: 8,
        market_rationale: 'Optimized headlines increase profile views by 30%',
        priority_score: 92,
        category: 'profile',
        status: 'pending'
      },
      {
        id: 'task-3',
        title: 'Add AWS Certification',
        description: 'Complete and add AWS Solutions Architect certification',
        market_impact: 'High',
        time_investment: '40 hours',
        completion_boost: 12,
        market_rationale: 'AWS certified developers earn 25% higher salaries',
        priority_score: 88,
        category: 'certification',
        status: 'pending'
      },
      {
        id: 'task-4',
        title: 'Expand Professional Summary',
        description: 'Write a compelling 150-word summary with keywords and achievements',
        market_impact: 'Medium',
        time_investment: '30 minutes',
        completion_boost: 6,
        market_rationale: 'Complete summaries improve recruiter engagement by 50%',
        priority_score: 75,
        category: 'profile',
        status: 'in_progress'
      },
      {
        id: 'task-5',
        title: 'Add TypeScript to Skills',
        description: 'TypeScript is trending - add with proficiency level and projects',
        market_impact: 'Medium',
        time_investment: '5 minutes',
        completion_boost: 4,
        market_rationale: 'TypeScript skills increase job matches by 35%',
        priority_score: 70,
        category: 'skills',
        status: 'pending'
      }
    ],
    competitive_gaps: [
      'No GitHub contributions shown',
      'Missing industry certifications',
      'No leadership experience highlighted',
      'Limited networking activity'
    ],
    optimization_roi: [
      {
        task: 'Portfolio Addition',
        impact: '+40% interview rate',
        time: '2 hours'
      },
      {
        task: 'Skill Certifications',
        impact: '+25% salary potential',
        time: '40 hours'
      },
      {
        task: 'Profile Optimization',
        impact: '+30% visibility',
        time: '1 hour'
      }
    ]
  },
  
  skill_intelligence: {
    trending_skills_to_add: [
      'Next.js 14',
      'AI/ML Integration',
      'Kubernetes',
      'GraphQL',
      'Web3/Blockchain'
    ],
    certification_recommendations: [
      {
        id: 'cert-1',
        name: 'AWS Solutions Architect - Associate',
        provider: 'Amazon Web Services',
        cost: '$150',
        duration: '1-2 months',
        market_value: 'High',
        roi_score: 92,
        job_impact: '25% salary increase on average',
        trending: true
      },
      {
        id: 'cert-2',
        name: 'Google Cloud Professional Developer',
        provider: 'Google Cloud',
        cost: '$200',
        duration: '2-3 months',
        market_value: 'High',
        roi_score: 88,
        job_impact: '20% more job opportunities',
        trending: true
      },
      {
        id: 'cert-3',
        name: 'Certified Kubernetes Administrator',
        provider: 'CNCF',
        cost: '$395',
        duration: '3-4 months',
        market_value: 'Medium',
        roi_score: 75,
        job_impact: 'Access to DevOps roles',
        trending: false
      }
    ],
    portfolio_enhancement_tips: [
      'Add live demo links to all projects',
      'Include case studies with metrics',
      'Show problem-solving process',
      'Add client testimonials'
    ],
    endorsement_strategies: [
      'Endorse colleagues weekly for reciprocity',
      'Request endorsements after project completion',
      'Focus on top 5 most marketable skills',
      'Engage in skill-specific communities'
    ]
  },
  
  brand_optimization: {
    headline_suggestions: [
      'Senior React Developer | Building Scalable Web Apps | AWS Certified',
      'Full-Stack Engineer | React + Node.js Expert | 50+ Projects Delivered',
      'Frontend Architect | Performance Optimization Specialist | Open Source Contributor'
    ],
    summary_optimization_tips: [
      'Start with a strong value proposition',
      'Include quantifiable achievements',
      'Add relevant keywords naturally',
      'End with a call-to-action'
    ],
    keyword_optimization: [
      'React.js',
      'TypeScript',
      'Node.js',
      'AWS',
      'Microservices',
      'CI/CD',
      'Agile/Scrum'
    ],
    industry_positioning: 'Top 25% Frontend Developer in your region'
  }
};

export const mockFloatingCareerCoach: FloatingCareerCoach = {
  activation_triggers: {
    profile_optimization_opportunity: true,
    new_skill_trending: true,
    application_performance_drop: false,
    market_opportunity_detected: true
  },
  
  coaching_modules: {
    profile_optimization: [
      {
        id: 'tip-1',
        title: 'Portfolio Impact Alert',
        description: 'Adding 3 portfolio projects could increase your interview rate by 40%',
        impact_score: 95,
        time_to_complete: '2 hours',
        action_type: 'add',
        target_section: 'portfolio'
      },
      {
        id: 'tip-2',
        title: 'Headline Optimization',
        description: 'Your headline is missing key skills. Update for 30% more views',
        impact_score: 85,
        time_to_complete: '15 minutes',
        action_type: 'edit',
        target_section: 'headline'
      }
    ],
    application_strategy: [
      {
        id: 'app-tip-1',
        title: 'Application Timing',
        content: 'Apply within 24 hours of posting for 3x higher response rate',
        category: 'timing',
        success_rate_increase: '+200%'
      },
      {
        id: 'app-tip-2',
        title: 'Cover Letter Personalization',
        content: 'Mention specific company projects to stand out',
        category: 'cover_letter',
        success_rate_increase: '+45%'
      }
    ],
    networking_suggestions: [
      {
        id: 'net-1',
        title: 'Connect with React Community',
        action: 'Join React developers in your city',
        potential_connections: 150,
        industry_relevance: 'High'
      },
      {
        id: 'net-2',
        title: 'Engage with Thought Leaders',
        action: 'Comment on posts by industry experts',
        potential_connections: 50,
        industry_relevance: 'High'
      }
    ],
    skill_development: [
      {
        id: 'skill-1',
        skill_name: 'Next.js 14',
        learning_path: 'Official docs + 2 projects',
        market_demand: 'High',
        salary_impact: '+15% average',
        time_to_proficiency: '3 weeks'
      },
      {
        id: 'skill-2',
        skill_name: 'AI Integration',
        learning_path: 'OpenAI API + LangChain basics',
        market_demand: 'High',
        salary_impact: '+20% for AI-enabled roles',
        time_to_proficiency: '6 weeks'
      }
    ]
  },
  
  milestones: {
    profile_completion_levels: [
      {
        level: 1,
        name: 'Starter',
        completion_percentage: 25,
        benefits: ['Basic visibility', 'Entry-level matches'],
        unlocked: true
      },
      {
        level: 2,
        name: 'Professional',
        completion_percentage: 50,
        benefits: ['2x profile views', 'Mid-level opportunities'],
        unlocked: true
      },
      {
        level: 3,
        name: 'Expert',
        completion_percentage: 75,
        benefits: ['Featured in searches', 'Senior role access'],
        unlocked: false
      },
      {
        level: 4,
        name: 'Industry Leader',
        completion_percentage: 90,
        benefits: ['Top search results', 'Executive opportunities'],
        unlocked: false
      }
    ],
    skill_endorsements: [
      {
        skill: 'React.js',
        endorsers: 23,
        credibility_score: 85,
        market_relevance: 95
      },
      {
        skill: 'JavaScript',
        endorsers: 18,
        credibility_score: 78,
        market_relevance: 90
      },
      {
        skill: 'Node.js',
        endorsers: 12,
        credibility_score: 65,
        market_relevance: 85
      }
    ],
    career_achievements: [
      {
        id: 'ach-1',
        title: 'Profile Power User',
        description: 'Reached 70% profile completion',
        date_achieved: '2025-01-20',
        category: 'profile',
        badge_icon: '🏆'
      },
      {
        id: 'ach-2',
        title: 'Application Pro',
        description: 'Submitted 10 quality applications',
        date_achieved: '2025-01-18',
        category: 'applications',
        badge_icon: '🎯'
      }
    ]
  },
  
  current_focus: 'profile',
  is_minimized: false,
  last_interaction: '2025-01-21T10:30:00Z'
};

export const mockProfileAnalytics: ProfileAnalytics = {
  visibility_metrics: {
    profile_views: 287,
    search_appearances: 1420,
    click_through_rate: 20.2,
    view_trend: 'up'
  },
  
  competitive_analysis: {
    market_position: 72, // 72nd percentile
    peer_comparison: {
      skills: 78,
      experience: 65,
      education: 70,
      overall: 71
    },
    improvement_areas: [
      'Add more technical certifications',
      'Increase GitHub activity',
      'Expand professional network',
      'Publish technical articles'
    ]
  },
  
  optimization_impact: {
    before_optimization: 45,
    after_optimization: 72,
    improvement_percentage: 60,
    key_changes: [
      'Added portfolio section',
      'Optimized headline with keywords',
      'Expanded skills section',
      'Added quantifiable achievements'
    ]
  }
};