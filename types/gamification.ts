// Gamification & Engagement Types for Phase 4

export interface ProfileLevel {
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  name: string;
  score_range: [number, number];
  benefits: string[];
  badge_icon: string;
  badge_color: string;
  next_level_requirements: string[];
  current_score: number;
  progress_percentage: number;
}

export interface Achievement {
  id: string;
  category: 'profile' | 'activity' | 'social' | 'learning' | 'special';
  name: string;
  description: string;
  icon: string;
  badge_color: string;
  points: number;
  earned_date?: string;
  progress?: number;
  requirement?: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface WeeklyChallenge {
  id: string;
  type: 'skill' | 'application' | 'network' | 'learning';
  title: string;
  description: string;
  target: number;
  current: number;
  points_reward: number;
  deadline: string;
  status: 'active' | 'completed' | 'expired';
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StreakData {
  type: 'daily_login' | 'weekly_application' | 'monthly_learning' | 'profile_update';
  current_streak: number;
  best_streak: number;
  last_activity: string;
  next_milestone: number;
  milestone_reward: string;
  is_active: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  avatar?: string;
  level: ProfileLevel['level'];
  total_points: number;
  weekly_points: number;
  achievements_count: number;
  is_current_user?: boolean;
}

export interface GamificationHub {
  // User Progress
  user_stats: {
    total_points: number;
    weekly_points: number;
    monthly_points: number;
    current_level: ProfileLevel;
    next_level_points: number;
    global_rank?: number;
    percentile?: number;
  };
  
  // Achievements
  achievements: {
    earned: Achievement[];
    available: Achievement[];
    recent_unlocks: Achievement[];
    categories: {
      profile: { earned: number; total: number };
      activity: { earned: number; total: number };
      social: { earned: number; total: number };
      learning: { earned: number; total: number };
    };
  };
  
  // Challenges
  weekly_challenges: {
    active: WeeklyChallenge[];
    completed: WeeklyChallenge[];
    upcoming: WeeklyChallenge[];
  };
  
  // Streaks
  streaks: {
    daily_login: StreakData;
    weekly_application: StreakData;
    monthly_learning: StreakData;
    profile_update: StreakData;
  };
  
  // Social Recognition
  social_recognition: {
    badges_displayed: string[];
    peer_endorsements: number;
    skill_rankings: Array<{
      skill: string;
      percentile: number;
      badge?: string;
    }>;
  };
}

// Component Props Interfaces
export interface ProfileLevelIndicatorProps {
  level: ProfileLevel;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  onClick?: (achievement: Achievement) => void;
}

export interface WeeklyChallengeCardProps {
  challenge: WeeklyChallenge;
  onAccept?: (challengeId: string) => void;
  onComplete?: (challengeId: string) => void;
}

export interface StreakTrackerProps {
  streaks: GamificationHub['streaks'];
  onStreakClick?: (type: string) => void;
}

export interface LeaderboardProps {
  entries: LeaderboardEntry[];
  timeframe: 'weekly' | 'monthly' | 'all-time';
  onUserClick?: (userId: string) => void;
}

// Animation & Celebration Types
export interface AchievementUnlockAnimation {
  achievementId: string;
  onComplete?: () => void;
  duration?: number;
}

export interface LevelUpCelebration {
  fromLevel: ProfileLevel['level'];
  toLevel: ProfileLevel['level'];
  pointsEarned: number;
  newBenefits: string[];
  onComplete?: () => void;
}

// Notification Types
export interface GamificationNotification {
  id: string;
  type: 'achievement_unlock' | 'level_up' | 'challenge_complete' | 'streak_milestone' | 'leaderboard_rank';
  title: string;
  message: string;
  icon: string;
  timestamp: string;
  read: boolean;
  action_url?: string;
}