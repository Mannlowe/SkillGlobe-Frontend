'use client';

import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star, Target, BookOpen, Users, Briefcase, TrendingUp, Lock, CheckCircle } from 'lucide-react';
import type { Achievement, AchievementBadgeProps } from '@/types/gamification';

const getCategoryIcon = (category: Achievement['category']) => {
  switch (category) {
    case 'profile':
      return Award;
    case 'activity':
      return Briefcase;
    case 'social':
      return Users;
    case 'learning':
      return BookOpen;
    case 'special':
      return Star;
    default:
      return Trophy;
  }
};

const getRarityStyles = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'border-gray-300 bg-gray-50';
    case 'rare':
      return 'border-blue-400 bg-blue-50';
    case 'epic':
      return 'border-purple-400 bg-purple-50';
    case 'legendary':
      return 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50';
    default:
      return 'border-gray-300 bg-gray-50';
  }
};

export function AchievementBadge({
  achievement,
  size = 'medium',
  showTooltip = true,
  onClick
}: AchievementBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = getCategoryIcon(achievement.category);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-12 h-12',
          icon: 'w-6 h-6',
          text: 'text-xs'
        };
      case 'large':
        return {
          container: 'w-24 h-24',
          icon: 'w-12 h-12',
          text: 'text-base'
        };
      default:
        return {
          container: 'w-16 h-16',
          icon: 'w-8 h-8',
          text: 'text-sm'
        };
    }
  };

  const sizes = getSizeClasses();

  return (
    <div className="relative inline-block">
      <button
        onClick={() => onClick?.(achievement)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${sizes.container}
          ${achievement.unlocked ? achievement.badge_color : 'bg-gray-200'}
          ${achievement.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
          ${achievement.unlocked && onClick ? 'hover:scale-110' : ''}
          rounded-full flex items-center justify-center
          shadow-lg border-2 ${getRarityStyles(achievement.rarity)}
          transition-all duration-300 relative overflow-hidden
        `}
        disabled={!achievement.unlocked}
      >
        {/* Background Pattern for locked achievements */}
        {!achievement.unlocked && (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
          </div>
        )}

        {/* Icon */}
        <div className={`relative z-10 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
          {achievement.unlocked ? (
            <span className="text-2xl">{achievement.icon}</span>
          ) : (
            <Lock className={sizes.icon} />
          )}
        </div>

        {/* Progress Ring for locked achievements */}
        {!achievement.unlocked && achievement.progress !== undefined && achievement.requirement !== undefined && (
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-gray-300"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${(achievement.progress / achievement.requirement) * 283} 283`}
              className="text-blue-500"
            />
          </svg>
        )}

        {/* Completion checkmark */}
        {achievement.unlocked && (
          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && isHovered && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white rounded-lg whitespace-nowrap">
          <div className="text-sm font-semibold">{achievement.name}</div>
          <div className="text-xs opacity-80">{achievement.description}</div>
          {achievement.unlocked ? (
            <div className="text-xs text-green-400 mt-1">
              Earned: {new Date(achievement.earned_date!).toLocaleDateString()}
            </div>
          ) : achievement.progress !== undefined && achievement.requirement !== undefined ? (
            <div className="text-xs text-yellow-400 mt-1">
              Progress: {achievement.progress}/{achievement.requirement}
            </div>
          ) : (
            <div className="text-xs text-gray-400 mt-1">Locked</div>
          )}
          <div className="text-xs text-yellow-300 mt-1">+{achievement.points} points</div>
        </div>
      )}
    </div>
  );
}

interface AchievementShowcaseProps {
  achievements: Achievement[];
  title?: string;
  maxDisplay?: number;
  onViewAll?: () => void;
  onAchievementClick?: (achievement: Achievement) => void;
}

export default function AchievementShowcase({
  achievements,
  title = "Achievements",
  maxDisplay = 8,
  onViewAll,
  onAchievementClick
}: AchievementShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all');
  const [showUnlocked, setShowUnlocked] = useState(true);
  const [animatedAchievements, setAnimatedAchievements] = useState<string[]>([]);

  // Animate new achievements
  useEffect(() => {
    const newUnlocks = achievements
      .filter(a => a.unlocked && a.earned_date)
      .sort((a, b) => new Date(b.earned_date!).getTime() - new Date(a.earned_date!).getTime())
      .slice(0, 3)
      .map(a => a.id);
    
    setAnimatedAchievements(newUnlocks);
  }, [achievements]);

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const unlockedMatch = showUnlocked ? achievement.unlocked : !achievement.unlocked;
    return categoryMatch && unlockedMatch;
  });

  const displayedAchievements = filteredAchievements.slice(0, maxDisplay);

  const categories: Array<{ value: Achievement['category'] | 'all'; label: string; icon: React.ElementType }> = [
    { value: 'all', label: 'All', icon: Trophy },
    { value: 'profile', label: 'Profile', icon: Award },
    { value: 'activity', label: 'Activity', icon: Briefcase },
    { value: 'social', label: 'Social', icon: Users },
    { value: 'learning', label: 'Learning', icon: BookOpen },
    { value: 'special', label: 'Special', icon: Star }
  ];

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    points: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {stats.unlocked} of {stats.total} unlocked • {stats.points.toLocaleString()} points earned
          </p>
        </div>
        {onViewAll && filteredAchievements.length > maxDisplay && (
          <button
            onClick={onViewAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All ({filteredAchievements.length})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSelectedCategory(value)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${selectedCategory === value
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                }
              `}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 sm:ml-auto">
          <button
            onClick={() => setShowUnlocked(true)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${showUnlocked
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            Unlocked
          </button>
          <button
            onClick={() => setShowUnlocked(false)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${!showUnlocked
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            Locked
          </button>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {displayedAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`
              transform transition-all duration-500
              ${animatedAchievements.includes(achievement.id) ? 'animate-bounce' : ''}
            `}
          >
            <AchievementBadge
              achievement={achievement}
              size="medium"
              onClick={onAchievementClick}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayedAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">
            {showUnlocked 
              ? "No achievements unlocked in this category yet"
              : "All achievements in this category are unlocked!"
            }
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Keep working on your profile to unlock more achievements
          </p>
        </div>
      )}
    </div>
  );
}