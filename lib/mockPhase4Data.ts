import type { 
  GamificationHub, 
  ProfileLevel, 
  Achievement, 
  WeeklyChallenge,
  LeaderboardEntry 
} from '@/types/gamification';

export const mockProfileLevels: ProfileLevel[] = [
  {
    level: 'Bronze',
    name: 'Rising Talent',
    score_range: [0, 1000],
    benefits: [
      'Basic profile visibility',
      'Access to job alerts',
      'Community forum access'
    ],
    badge_icon: '🥉',
    badge_color: 'bg-orange-600',
    next_level_requirements: [
      'Complete profile to 60%',
      'Apply to 5 jobs',
      'Earn 1000 points'
    ],
    current_score: 750,
    progress_percentage: 75
  },
  {
    level: 'Silver',
    name: 'Skilled Professional',
    score_range: [1001, 5000],
    benefits: [
      'Priority in search results',
      'Weekly personalized job matches',
      'Skills assessment access',
      'Profile analytics'
    ],
    badge_icon: '🥈',
    badge_color: 'bg-gray-400',
    next_level_requirements: [
      'Complete profile to 80%',
      'Get 3 skill endorsements',
      'Complete 2 weekly challenges'
    ],
    current_score: 0,
    progress_percentage: 0
  },
  {
    level: 'Gold',
    name: 'Industry Expert',
    score_range: [5001, 15000],
    benefits: [
      'Featured profile badge',
      'Direct recruiter messaging',
      'Advanced analytics dashboard',
      'Priority support',
      'Exclusive webinars'
    ],
    badge_icon: '🥇',
    badge_color: 'bg-yellow-500',
    next_level_requirements: [
      'Complete profile to 95%',
      'Maintain 30-day streak',
      'Help 5 community members'
    ],
    current_score: 0,
    progress_percentage: 0
  },
  {
    level: 'Platinum',
    name: 'Elite Achiever',
    score_range: [15001, 999999],
    benefits: [
      'VIP status and badge',
      'Personal career coach',
      'Executive job opportunities',
      'Speaking opportunities',
      'Mentor program access',
      'Annual conference ticket'
    ],
    badge_icon: '💎',
    badge_color: 'bg-purple-600',
    next_level_requirements: [],
    current_score: 0,
    progress_percentage: 0
  }
];

export const mockAchievements: Achievement[] = [
  // Profile Achievements
  {
    id: 'ach-profile-1',
    category: 'profile',
    name: 'First Steps',
    description: 'Complete your basic profile information',
    icon: '👤',
    badge_color: 'bg-blue-500',
    points: 100,
    earned_date: '2025-01-15',
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'ach-profile-2',
    category: 'profile',
    name: 'Picture Perfect',
    description: 'Upload a professional profile photo',
    icon: '📸',
    badge_color: 'bg-purple-500',
    points: 50,
    earned_date: '2025-01-16',
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'ach-profile-3',
    category: 'profile',
    name: 'Skill Master',
    description: 'Add 10 or more skills to your profile',
    icon: '🎯',
    badge_color: 'bg-green-500',
    points: 200,
    progress: 7,
    requirement: 10,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'ach-profile-4',
    category: 'profile',
    name: 'Portfolio Showcase',
    description: 'Upload 5 portfolio projects',
    icon: '💼',
    badge_color: 'bg-indigo-500',
    points: 300,
    progress: 2,
    requirement: 5,
    unlocked: false,
    rarity: 'rare'
  },
  
  // Activity Achievements
  {
    id: 'ach-activity-1',
    category: 'activity',
    name: 'Early Bird',
    description: 'Apply to a job within 24 hours of posting',
    icon: '🐦',
    badge_color: 'bg-yellow-500',
    points: 150,
    earned_date: '2025-01-20',
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'ach-activity-2',
    category: 'activity',
    name: 'Application Pro',
    description: 'Submit 10 job applications',
    icon: '📝',
    badge_color: 'bg-blue-600',
    points: 250,
    progress: 6,
    requirement: 10,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'ach-activity-3',
    category: 'activity',
    name: 'Interview Champion',
    description: 'Complete 5 interviews',
    icon: '🏆',
    badge_color: 'bg-gold-500',
    points: 500,
    progress: 2,
    requirement: 5,
    unlocked: false,
    rarity: 'epic'
  },
  
  // Social Achievements
  {
    id: 'ach-social-1',
    category: 'social',
    name: 'Networker',
    description: 'Connect with 20 professionals',
    icon: '🤝',
    badge_color: 'bg-pink-500',
    points: 200,
    progress: 12,
    requirement: 20,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'ach-social-2',
    category: 'social',
    name: 'Helpful Hero',
    description: 'Answer 10 community questions',
    icon: '💡',
    badge_color: 'bg-teal-500',
    points: 300,
    progress: 3,
    requirement: 10,
    unlocked: false,
    rarity: 'rare'
  },
  
  // Learning Achievements
  {
    id: 'ach-learning-1',
    category: 'learning',
    name: 'Knowledge Seeker',
    description: 'Complete your first course',
    icon: '📚',
    badge_color: 'bg-orange-500',
    points: 200,
    earned_date: '2025-01-18',
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'ach-learning-2',
    category: 'learning',
    name: 'Certified Professional',
    description: 'Earn 3 certifications',
    icon: '🎓',
    badge_color: 'bg-red-500',
    points: 500,
    progress: 1,
    requirement: 3,
    unlocked: false,
    rarity: 'epic'
  },
  
  // Special Achievements
  {
    id: 'ach-special-1',
    category: 'special',
    name: 'Rising Star',
    description: 'Featured as top talent of the week',
    icon: '⭐',
    badge_color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    points: 1000,
    unlocked: false,
    rarity: 'legendary'
  }
];

export const mockWeeklyChallenges: WeeklyChallenge[] = [
  {
    id: 'wc-1',
    type: 'skill',
    title: 'Skill Builder',
    description: 'Add 3 new trending skills to your profile',
    target: 3,
    current: 1,
    points_reward: 300,
    deadline: '2025-01-28',
    status: 'active',
    icon: '🎯',
    difficulty: 'easy'
  },
  {
    id: 'wc-2',
    type: 'application',
    title: 'Application Sprint',
    description: 'Apply to 5 jobs that match your skills',
    target: 5,
    current: 2,
    points_reward: 500,
    deadline: '2025-01-28',
    status: 'active',
    icon: '🚀',
    difficulty: 'medium'
  },
  {
    id: 'wc-3',
    type: 'network',
    title: 'Network Expansion',
    description: 'Connect with 10 professionals in your field',
    target: 10,
    current: 0,
    points_reward: 400,
    deadline: '2025-01-28',
    status: 'active',
    icon: '🌐',
    difficulty: 'medium'
  },
  {
    id: 'wc-4',
    type: 'learning',
    title: 'Knowledge Quest',
    description: 'Complete a skill assessment or course',
    target: 1,
    current: 0,
    points_reward: 600,
    deadline: '2025-01-28',
    status: 'active',
    icon: '📖',
    difficulty: 'hard'
  }
];

export const mockGamificationHub: GamificationHub = {
  user_stats: {
    total_points: 3250,
    weekly_points: 450,
    monthly_points: 1200,
    current_level: mockProfileLevels[0], // Bronze
    next_level_points: 1001,
    global_rank: 1542,
    percentile: 78
  },
  
  achievements: {
    earned: mockAchievements.filter(a => a.unlocked),
    available: mockAchievements.filter(a => !a.unlocked),
    recent_unlocks: mockAchievements.filter(a => a.unlocked).slice(0, 3),
    categories: {
      profile: { earned: 2, total: 4 },
      activity: { earned: 1, total: 3 },
      social: { earned: 0, total: 2 },
      learning: { earned: 1, total: 2 }
    }
  },
  
  weekly_challenges: {
    active: mockWeeklyChallenges.filter(c => c.status === 'active'),
    completed: [],
    upcoming: []
  },
  
  streaks: {
    daily_login: {
      type: 'daily_login',
      current_streak: 7,
      best_streak: 15,
      last_activity: '2025-01-22',
      next_milestone: 10,
      milestone_reward: '100 bonus points',
      is_active: true
    },
    weekly_application: {
      type: 'weekly_application',
      current_streak: 3,
      best_streak: 8,
      last_activity: '2025-01-21',
      next_milestone: 4,
      milestone_reward: 'Application Boost Badge',
      is_active: true
    },
    monthly_learning: {
      type: 'monthly_learning',
      current_streak: 2,
      best_streak: 5,
      last_activity: '2025-01-15',
      next_milestone: 3,
      milestone_reward: 'Free Course Credit',
      is_active: true
    },
    profile_update: {
      type: 'profile_update',
      current_streak: 1,
      best_streak: 10,
      last_activity: '2025-01-20',
      next_milestone: 5,
      milestone_reward: 'Profile Highlight',
      is_active: false
    }
  },
  
  social_recognition: {
    badges_displayed: ['Early Bird', 'Knowledge Seeker', 'First Steps'],
    peer_endorsements: 23,
    skill_rankings: [
      { skill: 'React.js', percentile: 85, badge: 'Top 15%' },
      { skill: 'JavaScript', percentile: 78 },
      { skill: 'TypeScript', percentile: 72 },
      { skill: 'Node.js', percentile: 65 }
    ]
  }
};

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user_id: 'user-123',
    user_name: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    level: 'Platinum',
    total_points: 18750,
    weekly_points: 2100,
    achievements_count: 45
  },
  {
    rank: 2,
    user_id: 'user-456',
    user_name: 'Alex Kumar',
    avatar: '/avatars/alex.jpg',
    level: 'Gold',
    total_points: 12300,
    weekly_points: 1850,
    achievements_count: 38
  },
  {
    rank: 3,
    user_id: 'user-789',
    user_name: 'Maria Garcia',
    avatar: '/avatars/maria.jpg',
    level: 'Gold',
    total_points: 10500,
    weekly_points: 1600,
    achievements_count: 35
  },
  {
    rank: 12,
    user_id: 'current-user',
    user_name: 'John Doe',
    level: 'Silver',
    total_points: 3250,
    weekly_points: 450,
    achievements_count: 12,
    is_current_user: true
  },
  {
    rank: 13,
    user_id: 'user-101',
    user_name: 'David Park',
    avatar: '/avatars/david.jpg',
    level: 'Silver',
    total_points: 3100,
    weekly_points: 420,
    achievements_count: 11
  }
];