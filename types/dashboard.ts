// Dashboard Types for Individual Seller
export interface DashboardHeaderMetrics {
  // Primary Performance Indicators
  market_visibility: {
    profile_views_30d: number;
    search_rank_percentile: number; // Top 10%, 25%, etc.
    industry_comparison: 'Above Average' | 'Average' | 'Below Average';
    trending_direction: 'up' | 'down' | 'stable';
  };
  
  // Opportunity Pipeline
  opportunity_pipeline: {
    active_applications: number;
    response_rate: number; // vs industry average 15-25%
    interview_conversion: number; // vs industry average 5-10%
    avg_application_to_offer: string; // "21 days"
  };
  
  // Financial Performance
  earning_metrics: {
    current_rate: number;
    market_rate_position: 'Top 10%' | 'Top 25%' | 'Average' | 'Below Average';
    earning_trend_6m: number; // percentage change
    next_rate_target: number; // suggested rate increase
  };
  
  // Professional Growth
  career_momentum: {
    skill_demand_score: number; // 0-100 based on market analysis
    network_growth_rate: number; // connections per month
    learning_activity_score: number; // courses, certifications
    industry_engagement: number; // posts, comments, shares
  };
}

export interface EnhancedMarketplaceStats {
  // Visibility & Reach (Based on LinkedIn insights)
  visibility_stats: {
    profile_views: {
      current: number;
      vs_last_month: number;
      industry_percentile: number;
      benchmark_message: string; // "Your profile gets 3x more views than average React developers"
    };
    search_appearances: {
      keywords_found_for: string[];
      search_rank_average: number;
      improvement_suggestions: string[];
    };
    content_reach: {
      post_engagement_rate: number;
      follower_growth_rate: number;
      industry_influence_score: number;
    };
  };
  
  // Application Performance (Based on Upwork/Indeed research)
  application_analytics: {
    success_metrics: {
      applications_sent: number;
      response_rate: number; // industry avg: 15-25%
      interview_rate: number; // industry avg: 5-10%
      offer_rate: number; // industry avg: 2-5%
      time_to_first_response: string;
    };
    competitive_analysis: {
      vs_similar_profiles: 'Outperforming' | 'Average' | 'Underperforming';
      success_factors: string[]; // ["Strong portfolio", "Quick response time"]
      improvement_areas: string[];
    };
  };
  
  // Skill Market Analysis (Based on Stack Overflow/GitHub trends)
  skill_market_intel: {
    demand_analysis: {
      hot_skills: string[]; // trending up in job postings
      declining_skills: string[]; // trending down
      skill_gap_opportunities: string[]; // high demand, low supply
      salary_premium_skills: Array<{skill: string, premium: number}>;
    };
    competitive_position: {
      skill_rarity_score: number; // how unique your skill set is
      market_saturation: number; // how many others have similar skills
      specialization_recommendation: string;
    };
  };
  
  // Financial Intelligence (Based on Glassdoor/PayScale data)
  compensation_insights: {
    market_rate_analysis: {
      current_rate: number;
      market_min: number;
      market_max: number;
      percentile_position: number;
      rate_increase_confidence: number; // likelihood of getting increase
    };
    earning_opportunities: {
      high_paying_skills: Array<{skill: string, avg_salary: number}>;
      premium_industries: Array<{industry: string, premium: number}>;
      contract_vs_fulltime: {contract_premium: number, stability_score: number};
    };
  };
}

// Interface for skill item in opportunity
export interface SkillItem {
  skill: string;
  skill_name: string | null;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  match_score: number;
  salary_range: [number, number];
  location: string;
  remote_option: boolean;
  application_deadline: string;
  
  // AI Analysis
  match_reasons: string[];
  skill_gaps: string[];
  growth_potential: 'High' | 'Medium' | 'Low';
  culture_fit_score: number;
  
  // Application Intelligence
  estimated_response_time: string;
  application_competition: 'Low' | 'Medium' | 'High';
  hiring_urgency: 'Urgent' | 'Normal' | 'Flexible';
  recruiter_activity: string; // "Actively hiring", "Recently posted"
  buyer_interested?: boolean; // Indicates if buyer has shown special interest
  seller_interested?: boolean; // Indicates if seller has shown interest
  bookmarked?: boolean; // Indicates if opportunity is bookmarked by the user

  // New fields from API response
  opportunity_type: string; // Permanent, Contract, etc.
  experience_required: string; // 0-2 years, etc.
  employment_type: string; // Full-Time, Part-Time, etc.
  work_mode: string; // WFO, WFH, Hybrid
  opportunity_closed: boolean; // Whether the opportunity is closed
  description: string; // Job description
  preferred_qualifications: string | null; // Preferred qualifications
  primary_skills: SkillItem[]; // Primary skills required
  secondary_skills: SkillItem[]; // Secondary skills required
}

export interface MarketMetricCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: any;
  color?: string;
  benchmark?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}