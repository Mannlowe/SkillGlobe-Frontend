'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Calendar, Target, BookOpen, User, TrendingUp, Award, Clock, Zap, CheckCircle } from 'lucide-react';
import type { StreakData, StreakTrackerProps } from '@/types/gamification';

const getStreakIcon = (type: StreakData['type']) => {
  switch (type) {
    case 'daily_login':
      return Calendar;
    case 'weekly_application':
      return Target;
    case 'monthly_learning':
      return BookOpen;
    case 'profile_update':
      return User;
    default:
      return Flame;
  }
};

const getStreakColor = (streak: number, isActive: boolean) => {
  if (!isActive) return 'bg-gray-100 text-gray-600 border-gray-200';
  if (streak >= 30) return 'bg-purple-100 text-purple-700 border-purple-300';
  if (streak >= 14) return 'bg-blue-100 text-blue-700 border-blue-300';
  if (streak >= 7) return 'bg-green-100 text-green-700 border-green-300';
  if (streak >= 3) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  return 'bg-orange-100 text-orange-700 border-orange-300';
};

const getStreakTitle = (type: StreakData['type']) => {
  switch (type) {
    case 'daily_login':
      return 'Daily Login';
    case 'weekly_application':
      return 'Weekly Applications';
    case 'monthly_learning':
      return 'Monthly Learning';
    case 'profile_update':
      return 'Profile Updates';
    default:
      return 'Streak';
  }
};

const getStreakDescription = (type: StreakData['type']) => {
  switch (type) {
    case 'daily_login':
      return 'Login every day to maintain streak';
    case 'weekly_application':
      return 'Apply to jobs weekly';
    case 'monthly_learning':
      return 'Complete courses monthly';
    case 'profile_update':
      return 'Update profile regularly';
    default:
      return 'Keep up the momentum';
  }
};

interface StreakCardProps {
  type: StreakData['type'];
  streak: StreakData;
  onClick?: (type: string) => void;
}

function StreakCard({ type, streak, onClick }: StreakCardProps) {
  const Icon = getStreakIcon(type);
  const [daysUntilBreak, setDaysUntilBreak] = useState(0);

  useEffect(() => {
    const lastActivity = new Date(streak.last_activity);
    const now = new Date();
    const diffTime = now.getTime() - lastActivity.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate how many days until streak breaks based on streak type
    let breakThreshold = 1; // daily
    if (type === 'weekly_application') breakThreshold = 7;
    if (type === 'monthly_learning') breakThreshold = 30;
    if (type === 'profile_update') breakThreshold = 7;
    
    setDaysUntilBreak(Math.max(0, breakThreshold - diffDays));
  }, [streak.last_activity, type]);

  const progressToMilestone = (streak.current_streak / streak.next_milestone) * 100;

  return (
    <div
      onClick={() => onClick?.(type)}
      className={`
        bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg
        ${streak.is_active ? 'border-green-200 hover:border-green-300' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${getStreakColor(streak.current_streak, streak.is_active)}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{getStreakTitle(type)}</h3>
            <p className="text-sm text-gray-600">{getStreakDescription(type)}</p>
          </div>
        </div>
        {streak.is_active && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Active</span>
          </div>
        )}
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{streak.current_streak}</div>
          <div className="text-xs text-gray-600">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{streak.best_streak}</div>
          <div className="text-xs text-gray-600">Best Streak</div>
        </div>
      </div>

      {/* Progress to Next Milestone */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Next Milestone</span>
          <span className="text-sm font-medium text-gray-900">
            {streak.current_streak} / {streak.next_milestone}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              streak.is_active ? 'bg-green-500' : 'bg-gray-400'
            }`}
            style={{ width: `${Math.min(progressToMilestone, 100)}%` }}
          >
            {streak.is_active && (
              <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Reward: {streak.milestone_reward}
        </div>
      </div>

      {/* Status */}
      <div className={`
        p-3 rounded-lg text-sm
        ${streak.is_active 
          ? daysUntilBreak <= 1 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-gray-50 text-gray-600 border border-gray-200'
        }
      `}>
        {streak.is_active ? (
          daysUntilBreak <= 1 ? (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Act soon to maintain streak!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Streak is active - keep it up!</span>
            </div>
          )
        ) : (
          <div className="flex items-center gap-2">
            <span>Streak broken - time to start again!</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface StreakOverviewProps {
  streaks: Record<string, StreakData>;
}

function StreakOverview({ streaks }: StreakOverviewProps) {
  const activeStreaks = Object.values(streaks).filter(s => s.is_active);
  const totalStreakDays = Object.values(streaks).reduce((sum, s) => sum + s.current_streak, 0);
  const bestOverallStreak = Math.max(...Object.values(streaks).map(s => s.best_streak));
  
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
        <Flame className="w-5 h-5 text-orange-500" />
        Streak Overview
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">{activeStreaks.length}</div>
          <div className="text-sm text-orange-700">Active Streaks</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600">{totalStreakDays}</div>
          <div className="text-sm text-red-700">Total Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{bestOverallStreak}</div>
          <div className="text-sm text-purple-700">Best Streak</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {activeStreaks.length > 0 ? Math.round((activeStreaks.length / Object.keys(streaks).length) * 100) : 0}%
          </div>
          <div className="text-sm text-blue-700">Success Rate</div>
        </div>
      </div>

      {/* Streak Calendar Visualization */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-3">This Week</h4>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            const dayIndex = i;
            const hasActivity = activeStreaks.length > 0 && Math.random() > 0.3; // Mock activity
            const isToday = i === 6; // Assume today is the last day
            
            return (
              <div
                key={i}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                  ${isToday 
                    ? 'border-2 border-blue-500 bg-blue-100 text-blue-700'
                    : hasActivity 
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-white/50 rounded-lg p-4 text-center">
        <div className="text-lg font-semibold text-gray-900 mb-1">
          {activeStreaks.length === Object.keys(streaks).length 
            ? "🔥 All streaks active! You're on fire!"
            : activeStreaks.length > 0
              ? `Keep going! ${activeStreaks.length} streak${activeStreaks.length > 1 ? 's' : ''} active`
              : "Start a new streak today!"
          }
        </div>
        <div className="text-sm text-gray-600">
          Consistency is the key to success
        </div>
      </div>
    </div>
  );
}

export default function StreakTracker({ streaks, onStreakClick }: StreakTrackerProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'active' | 'broken'>('all');

  const filteredStreaks = Object.entries(streaks).filter(([type, streak]) => {
    if (selectedCategory === 'active') return streak.is_active;
    if (selectedCategory === 'broken') return !streak.is_active;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview */}
      <StreakOverview streaks={streaks} />

      {/* Individual Streaks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Your Streaks</h3>
          
          {/* Filter */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'broken', label: 'Broken' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as any)}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-all
                  ${selectedCategory === key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStreaks.map(([type, streak]) => (
            <StreakCard
              key={type}
              type={type as StreakData['type']}
              streak={streak}
              onClick={onStreakClick}
            />
          ))}
        </div>

        {filteredStreaks.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Flame className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">
              {selectedCategory === 'active' && "No active streaks right now"}
              {selectedCategory === 'broken' && "No broken streaks - great job!"}
              {selectedCategory === 'all' && "No streaks found"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Start building consistent habits today
            </p>
          </div>
        )}
      </div>
    </div>
  );
}