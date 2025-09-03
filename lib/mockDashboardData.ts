import type { DashboardHeaderMetrics, EnhancedMarketplaceStats, JobOpportunity } from '@/types/dashboard';

export const mockHeaderMetrics: DashboardHeaderMetrics = {
  market_visibility: {
    profile_views_30d: 5,
    search_rank_percentile: 15, // Top 15%
    industry_comparison: 'Above Average',
    trending_direction: 'up',
  },
  opportunity_pipeline: {
    active_applications: 12,
    response_rate: 3, // Above industry average
    interview_conversion: 4, // Above industry average
    avg_application_to_offer: '21 days',
  },
  earning_metrics: {
    current_rate: 85,
    market_rate_position: 'Top 25%',
    earning_trend_6m: 18.7,
    next_rate_target: 95,
  },
  career_momentum: {
    skill_demand_score: 10,
    network_growth_rate: 15,
    learning_activity_score: 70,
    industry_engagement: 72,
  },
};

export const mockEnhancedStats: EnhancedMarketplaceStats = {
  visibility_stats: {
    profile_views: {
      current: 1247,
      vs_last_month: 23.5,
      industry_percentile: 85,
      benchmark_message: 'Your profile gets 3x more views than average React developers',
    },
    search_appearances: {
      keywords_found_for: ['React Developer', 'Full Stack Engineer', 'TypeScript Expert', 'Next.js Developer'],
      search_rank_average: 12,
      improvement_suggestions: ['Add Node.js certification', 'Include AWS skills', 'Update portfolio examples'],
    },
    content_reach: {
      post_engagement_rate: 4.2,
      follower_growth_rate: 12.5,
      industry_influence_score: 68,
    },
  },
  application_analytics: {
    success_metrics: {
      applications_sent: 24,
      response_rate: 32,
      interview_rate: 12,
      offer_rate: 4.2,
      time_to_first_response: '2.3 days',
    },
    competitive_analysis: {
      vs_similar_profiles: 'Outperforming',
      success_factors: ['Strong portfolio', 'Quick response time', 'Tailored applications'],
      improvement_areas: ['Add video introduction', 'Expand network connections'],
    },
  },
  skill_market_intel: {
    demand_analysis: {
      hot_skills: ['AI/ML Integration', 'Web3', 'Rust', 'Flutter', 'GraphQL'],
      declining_skills: ['jQuery', 'AngularJS', 'PHP'],
      skill_gap_opportunities: ['AWS Solutions Architect', 'Kubernetes', 'System Design'],
      salary_premium_skills: [
        { skill: 'AI/ML', premium: 35 },
        { skill: 'Blockchain', premium: 28 },
        { skill: 'Go', premium: 22 },
        { skill: 'Rust', premium: 25 },
      ],
    },
    competitive_position: {
      skill_rarity_score: 78,
      market_saturation: 42,
      specialization_recommendation: 'Consider specializing in AI-powered web applications',
    },
  },
  compensation_insights: {
    market_rate_analysis: {
      current_rate: 85,
      market_min: 65,
      market_max: 120,
      percentile_position: 75,
      rate_increase_confidence: 82,
    },
    earning_opportunities: {
      high_paying_skills: [
        { skill: 'AI/ML + React', avg_salary: 135 },
        { skill: 'Blockchain Development', avg_salary: 125 },
        { skill: 'Cloud Architecture', avg_salary: 115 },
      ],
      premium_industries: [
        { industry: 'FinTech', premium: 25 },
        { industry: 'Healthcare Tech', premium: 20 },
        { industry: 'AI/ML Startups', premium: 30 },
      ],
      contract_vs_fulltime: { contract_premium: 35, stability_score: 72 },
    },
  },
};

export const mockJobOpportunities: JobOpportunity[] = [
  {
    id: 'job-001',
    title: 'Senior React Developer',
    company: 'TechCorp Solutions',
    match_score: 92,
    salary_range: [90000, 120000],
    location: 'San Francisco, CA',
    remote_option: true,
    application_deadline: '2025-02-15',
    match_reasons: [
      'Strong React and TypeScript experience matches requirements',
      'Your portfolio includes similar e-commerce projects',
      'Experience level aligns perfectly (5+ years)',
    ],
    skill_gaps: ['GraphQL', 'Docker'],
    growth_potential: 'High',
    culture_fit_score: 88,
    estimated_response_time: '2-3 days',
    application_competition: 'Medium',
    hiring_urgency: 'Urgent',
    recruiter_activity: 'Actively reviewing applications',
    buyer_interested: true,
  },
  {
    id: 'job-002',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    match_score: 85,
    salary_range: [80000, 110000],
    location: 'New York, NY',
    remote_option: true,
    application_deadline: '2025-02-20',
    match_reasons: [
      'Your Next.js expertise is a key requirement',
      'Startup experience in your background',
      'Strong problem-solving skills demonstrated',
    ],
    skill_gaps: ['Ruby on Rails'],
    growth_potential: 'High',
    culture_fit_score: 82,
    estimated_response_time: '1-2 days',
    application_competition: 'Low',
    hiring_urgency: 'Normal',
    recruiter_activity: 'Recently posted',
    buyer_interested: false,
  },
  {
    id: 'job-003',
    title: 'Frontend Architect',
    company: 'Enterprise Corp',
    match_score: 78,
    salary_range: [110000, 140000],
    location: 'Austin, TX',
    remote_option: false,
    application_deadline: '2025-02-25',
    match_reasons: [
      'Architecture experience in previous roles',
      'Team leadership background',
      'Performance optimization expertise',
    ],
    skill_gaps: ['Micro-frontends', 'Web Components'],
    growth_potential: 'Medium',
    culture_fit_score: 75,
    estimated_response_time: '5-7 days',
    application_competition: 'High',
    hiring_urgency: 'Flexible',
    recruiter_activity: 'Multiple rounds of interviews',
    buyer_interested: false,
  },
  {
    id: 'job-004',
    title: 'React Developer',
    company: 'StartupXYZ',
    match_score: 85,
    salary_range: [80000, 110000],
    location: 'New York, NY',
    remote_option: true,
    application_deadline: '2025-02-24',
    match_reasons: [
      'Your React expertise is a key requirement',
      'Startup experience in your background',
      'Strong problem-solving skills demonstrated',
    ],
    skill_gaps: ['Next.js'],
    growth_potential: 'High',
    culture_fit_score: 82,
    estimated_response_time: '1-2 days',
    application_competition: 'Low',
    hiring_urgency: 'Normal',
    recruiter_activity: 'Recently posted',
    buyer_interested: false,
  },
];