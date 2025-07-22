'use client';

import React, { useState } from 'react';
import { Trophy, Star, TrendingUp, Users, Medal, Award, Crown, Zap, Share2, Eye, ThumbsUp } from 'lucide-react';
import type { GamificationHub, LeaderboardEntry } from '@/types/gamification';

interface SkillRankingProps {
  skill: string;
  percentile: number;
  badge?: string;
  trend?: 'up' | 'down' | 'stable';
}

function SkillRankingCard({ skill, percentile, badge, trend = 'stable' }: SkillRankingProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return null;
    }
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'text-purple-600 bg-purple-50 border-purple-200';
    if (percentile >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentile >= 50) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{skill}</h4>
        {getTrendIcon()}
      </div>
      <div className="flex items-center justify-between">
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getPercentileColor(percentile)}`}>
          Top {100 - percentile}%
        </div>
        {badge && (
          <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  timeframe: 'weekly' | 'monthly' | 'all-time';
  onTimeframeChange?: (timeframe: 'weekly' | 'monthly' | 'all-time') => void;
  onUserClick?: (userId: string) => void;
}

function LeaderboardCard({ entries, timeframe, onTimeframeChange, onUserClick }: LeaderboardCardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const currentUser = entries.find(entry => entry.is_current_user);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Leaderboard
          </h3>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'weekly', label: 'Weekly' },
            { key: 'monthly', label: 'Monthly' },
            { key: 'all-time', label: 'All Time' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onTimeframeChange?.(key as any)}
              className={`
                flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                ${timeframe === key
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

      <div className="p-4">
        {/* Top 3 Podium */}
        {entries.slice(0, 3).length > 0 && (
          <div className="flex items-end justify-center gap-4 mb-6">
            {/* 2nd Place */}
            {entries[1] && (
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 relative">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">2</span>
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Medal className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-900">{entries[1].user_name}</div>
                <div className="text-xs text-gray-500">{entries[1].weekly_points} pts</div>
              </div>
            )}

            {/* 1st Place */}
            {entries[0] && (
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-2 relative">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">1</span>
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Crown className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900">{entries[0].user_name}</div>
                <div className="text-xs text-gray-500">{entries[0].weekly_points} pts</div>
              </div>
            )}

            {/* 3rd Place */}
            {entries[2] && (
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2 relative">
                  <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">3</span>
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Award className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-900">{entries[2].user_name}</div>
                <div className="text-xs text-gray-500">{entries[2].weekly_points} pts</div>
              </div>
            )}
          </div>
        )}

        {/* Full List */}
        <div className="space-y-2">
          {entries.slice(0, 10).map((entry) => (
            <div
              key={entry.user_id}
              onClick={() => onUserClick?.(entry.user_id)}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                ${entry.is_current_user 
                  ? 'bg-blue-50 border-2 border-blue-200 ring-1 ring-blue-100' 
                  : 'hover:bg-gray-50'
                }
              `}
            >
              <div className="flex-shrink-0">
                {getRankIcon(entry.rank)}
              </div>
              
              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                {entry.avatar ? (
                  <img src={entry.avatar} alt={entry.user_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                    {entry.user_name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${entry.is_current_user ? 'text-blue-900' : 'text-gray-900'}`}>
                    {entry.user_name}
                  </span>
                  {entry.is_current_user && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">You</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {entry.level} • {entry.achievements_count} achievements
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900">{entry.weekly_points}</div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          ))}
        </div>

        {/* Current User Position (if not in top 10) */}
        {currentUser && currentUser.rank > 10 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex-shrink-0">
                <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-blue-600">
                  #{currentUser.rank}
                </span>
              </div>
              <div className="flex-1">
                <span className="font-medium text-blue-900">
                  {currentUser.user_name} (You)
                </span>
                <div className="text-xs text-blue-600">
                  {currentUser.level} • {currentUser.achievements_count} achievements
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-900">{currentUser.weekly_points}</div>
                <div className="text-xs text-blue-600">points</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SocialRecognitionProps {
  socialData: GamificationHub['social_recognition'];
  leaderboard: LeaderboardEntry[];
  onShareAchievement?: (achievementName: string) => void;
  onViewProfile?: (userId: string) => void;
}

export default function SocialRecognition({
  socialData,
  leaderboard,
  onShareAchievement,
  onViewProfile
}: SocialRecognitionProps) {
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');

  return (
    <div className="space-y-6">
      {/* Recognition Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Star className="w-5 h-5 text-yellow-500" />
          Social Recognition
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Displayed Badges */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" />
              Featured Badges
            </h4>
            <div className="space-y-2">
              {socialData.badges_displayed.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <span className="font-medium text-blue-900">{badge}</span>
                  <button
                    onClick={() => onShareAchievement?.(badge)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all text-sm">
                + Customize badges
              </button>
            </div>
          </div>

          {/* Peer Endorsements */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-green-500" />
              Peer Endorsements
            </h4>
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {socialData.peer_endorsements}
              </div>
              <div className="text-sm text-green-700 mb-3">Total Endorsements</div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Request Endorsements
              </button>
            </div>
          </div>

          {/* Profile Visibility */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-500" />
              Profile Impact
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-purple-700">Profile Views</span>
                <span className="font-semibold text-purple-900">247</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-purple-700">Search Appearances</span>
                <span className="font-semibold text-purple-900">89</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-purple-700">This Week</span>
                <span className="font-semibold text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +23%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Rankings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Skill Rankings
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Skills
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialData.skill_rankings.map((skill, index) => (
            <SkillRankingCard
              key={index}
              skill={skill.skill}
              percentile={skill.percentile}
              badge={skill.badge}
              trend={index === 0 ? 'up' : index === 1 ? 'stable' : 'down'}
            />
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <LeaderboardCard
        entries={leaderboard}
        timeframe={leaderboardTimeframe}
        onTimeframeChange={setLeaderboardTimeframe}
        onUserClick={onViewProfile}
      />
    </div>
  );
}