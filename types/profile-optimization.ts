// Profile Optimization Types for Phase 3

export interface ProfileOptimizationHub {
  // Market-Driven Completion
  strategic_completion: {
    market_impact_score: number; // how profile changes affect visibility
    completion_priorities: ProfileTask[]; // ranked by market impact
    competitive_gaps: string[]; // what competitors have that you don't
    optimization_roi: Array<{
      task: string;
      impact: string;
      time: string;
    }>;
  };
  
  // Skill Development Guidance
  skill_intelligence: {
    trending_skills_to_add: string[];
    certification_recommendations: Certification[];
    portfolio_enhancement_tips: string[];
    endorsement_strategies: string[];
  };
  
  // Professional Branding
  brand_optimization: {
    headline_suggestions: string[];
    summary_optimization_tips: string[];
    keyword_optimization: string[];
    industry_positioning: string;
  };
}

export interface ProfileTask {
  id: string;
  title: string;
  description: string;
  market_impact: 'High' | 'Medium' | 'Low';
  time_investment: string;
  completion_boost: number;
  market_rationale: string; // "React developers with portfolios get 40% more interviews"
  priority_score: number; // calculated based on user's current goals
  category: 'profile' | 'skills' | 'portfolio' | 'networking' | 'certification';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Certification {
  id: string;
  name: string;
  provider: string;
  cost: string;
  duration: string;
  market_value: 'High' | 'Medium' | 'Low';
  roi_score: number;
  job_impact: string; // "15% salary increase on average"
  trending: boolean;
}

export interface FloatingCareerCoach {
  // Smart Triggers
  activation_triggers: {
    profile_optimization_opportunity: boolean;
    new_skill_trending: boolean;
    application_performance_drop: boolean;
    market_opportunity_detected: boolean;
  };
  
  // Contextual Guidance
  coaching_modules: {
    profile_optimization: ProfileOptimizationTip[];
    application_strategy: ApplicationTip[];
    networking_suggestions: NetworkingTip[];
    skill_development: SkillDevelopmentTip[];
  };
  
  // Achievement Celebrations
  milestones: {
    profile_completion_levels: ProfileLevel[];
    skill_endorsements: SkillEndorsement[];
    career_achievements: CareerAchievement[];
  };
  
  // Current State
  current_focus: 'profile' | 'skills' | 'applications' | 'networking' | null;
  is_minimized: boolean;
  last_interaction: string;
}

export interface ProfileOptimizationTip {
  id: string;
  title: string;
  description: string;
  impact_score: number;
  time_to_complete: string;
  action_type: 'add' | 'edit' | 'remove' | 'optimize';
  target_section: string;
}

export interface ApplicationTip {
  id: string;
  title: string;
  content: string;
  category: 'cover_letter' | 'resume' | 'portfolio' | 'timing' | 'follow_up';
  success_rate_increase: string;
}

export interface NetworkingTip {
  id: string;
  title: string;
  action: string;
  potential_connections: number;
  industry_relevance: 'High' | 'Medium' | 'Low';
}

export interface SkillDevelopmentTip {
  id: string;
  skill_name: string;
  learning_path: string;
  market_demand: 'High' | 'Medium' | 'Low';
  salary_impact: string;
  time_to_proficiency: string;
}

export interface ProfileLevel {
  level: number;
  name: string;
  completion_percentage: number;
  benefits: string[];
  unlocked: boolean;
}

export interface SkillEndorsement {
  skill: string;
  endorsers: number;
  credibility_score: number;
  market_relevance: number;
}

export interface CareerAchievement {
  id: string;
  title: string;
  description: string;
  date_achieved: string;
  category: 'profile' | 'applications' | 'skills' | 'networking';
  badge_icon: string;
}

// Analytics Types
export interface ProfileAnalytics {
  visibility_metrics: {
    profile_views: number;
    search_appearances: number;
    click_through_rate: number;
    view_trend: 'up' | 'down' | 'stable';
  };
  
  competitive_analysis: {
    market_position: number; // percentile
    peer_comparison: {
      skills: number;
      experience: number;
      education: number;
      overall: number;
    };
    improvement_areas: string[];
  };
  
  optimization_impact: {
    before_optimization: number;
    after_optimization: number;
    improvement_percentage: number;
    key_changes: string[];
  };
}