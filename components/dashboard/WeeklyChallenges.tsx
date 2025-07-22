'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Target, Trophy, Clock, CheckCircle, ArrowRight, Flame, Star, Users, BookOpen, Briefcase, Zap } from 'lucide-react';
import type { WeeklyChallenge, WeeklyChallengeCardProps } from '@/types/gamification';

const getChallengeIcon = (type: WeeklyChallenge['type']) => {
  switch (type) {
    case 'skill':
      return Target;
    case 'application':
      return Briefcase;
    case 'network':
      return Users;
    case 'learning':
      return BookOpen;
    default:
      return Trophy;
  }
};

const getDifficultyColor = (difficulty: WeeklyChallenge['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'hard':
      return 'bg-red-100 text-red-700 border-red-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

export function WeeklyChallengeCard({ 
  challenge, 
  onAccept, 
  onComplete 
}: WeeklyChallengeCardProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const Icon = getChallengeIcon(challenge.type);
  const progress = (challenge.current / challenge.target) * 100;
  const isCompleted = challenge.current >= challenge.target;

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const deadline = new Date(challenge.deadline);
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expired');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h left`);
        } else {
          setTimeRemaining(`${hours}h left`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [challenge.deadline]);

  return (
    <div className={`
      bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-lg
      ${isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-300'}
    `}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className={`
              p-3 rounded-xl flex items-center justify-center
              ${isCompleted ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'}
            `}>
              {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{challenge.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{challenge.description}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty.toUpperCase()}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {challenge.current} / {challenge.target}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {!isCompleted && (
                <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              )}
            </div>
          </div>
          {progress > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {progress.toFixed(0)}% complete
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {timeRemaining}
            </div>
            <div className="flex items-center gap-1 text-sm text-yellow-600">
              <Star className="w-4 h-4" />
              {challenge.points_reward} pts
            </div>
          </div>
          
          {isCompleted ? (
            <button
              onClick={() => onComplete?.(challenge.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Claim Reward
            </button>
          ) : (
            <button
              onClick={() => onAccept?.(challenge.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface WeeklyChallengesProps {
  challenges: WeeklyChallenge[];
  onAcceptChallenge?: (challengeId: string) => void;
  onCompleteChallenge?: (challengeId: string) => void;
  onViewAll?: () => void;
}

export default function WeeklyChallenges({
  challenges,
  onAcceptChallenge,
  onCompleteChallenge,
  onViewAll
}: WeeklyChallengesProps) {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed' | 'upcoming'>('active');

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');
  const upcomingChallenges = challenges.filter(c => c.status === 'expired'); // Using expired for upcoming in this mock

  const currentChallenges = selectedTab === 'active' ? activeChallenges :
                           selectedTab === 'completed' ? completedChallenges :
                           upcomingChallenges;

  const stats = {
    totalActive: activeChallenges.length,
    completed: completedChallenges.length,
    totalPoints: completedChallenges.reduce((sum, c) => sum + c.points_reward, 0),
    completionRate: activeChallenges.length > 0 
      ? Math.round((activeChallenges.filter(c => c.current >= c.target).length / activeChallenges.length) * 100)
      : 0
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Weekly Challenges
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete challenges to earn points and unlock achievements
            </p>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalActive}</div>
            <div className="text-xs text-blue-600">Active</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.totalPoints}</div>
            <div className="text-xs text-yellow-600">Points Earned</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
            <div className="text-xs text-purple-600">Completion Rate</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'active', label: 'Active', count: activeChallenges.length },
            { key: 'completed', label: 'Completed', count: completedChallenges.length },
            { key: 'upcoming', label: 'Upcoming', count: upcomingChallenges.length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setSelectedTab(key as any)}
              className={`
                flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${selectedTab === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                }
              `}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentChallenges.length > 0 ? (
          <div className="grid gap-6">
            {currentChallenges.map((challenge) => (
              <WeeklyChallengeCard
                key={challenge.id}
                challenge={challenge}
                onAccept={onAcceptChallenge}
                onComplete={onCompleteChallenge}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">
              {selectedTab === 'active' && "No active challenges right now"}
              {selectedTab === 'completed' && "No completed challenges yet"}
              {selectedTab === 'upcoming' && "No upcoming challenges"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {selectedTab === 'active' && "New challenges appear every Monday"}
              {selectedTab === 'completed' && "Complete challenges to see them here"}
              {selectedTab === 'upcoming' && "Check back later for new challenges"}
            </p>
          </div>
        )}
      </div>

      {/* Weekly Progress Bar */}
      {activeChallenges.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Weekly Progress</span>
              <span className="text-sm text-gray-600">
                {activeChallenges.filter(c => c.current >= c.target).length} of {activeChallenges.length} completed
              </span>
            </div>
            <div className="w-full bg-white/60 rounded-full h-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ 
                  width: `${activeChallenges.length > 0 
                    ? (activeChallenges.filter(c => c.current >= c.target).length / activeChallenges.length) * 100 
                    : 0}%` 
                }}
              />
            </div>
            {stats.completionRate === 100 && (
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <Zap className="w-4 h-4" />
                All challenges completed! Great work!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}