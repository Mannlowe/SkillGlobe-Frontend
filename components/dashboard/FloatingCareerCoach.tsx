'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Briefcase, 
  BookOpen,
  MessageCircle,
  Bell,
  ChevronRight,
  Target,
  Zap,
  Trophy,
  AlertCircle
} from 'lucide-react';
import type { FloatingCareerCoach } from '@/types/profile-optimization';

interface FloatingCareerCoachProps {
  coachData: FloatingCareerCoach;
  onClose?: () => void;
  onMinimize?: () => void;
  onActionClick?: (actionType: string, actionId: string) => void;
}

export default function FloatingCareerCoach({
  coachData,
  onClose,
  onMinimize,
  onActionClick
}: FloatingCareerCoachProps) {
  const [isMinimized, setIsMinimized] = useState(coachData.is_minimized);
  const [activeTab, setActiveTab] = useState<string>('suggestions');
  const [hasNewSuggestions, setHasNewSuggestions] = useState(false);

  // Check for activation triggers
  useEffect(() => {
    const hasActiveTriggers = Object.values(coachData.activation_triggers).some(trigger => trigger);
    setHasNewSuggestions(hasActiveTriggers);
  }, [coachData.activation_triggers]);

  const tabs = [
    { id: 'suggestions', label: 'Smart Suggestions', icon: Sparkles },
    { id: 'milestones', label: 'Achievements', icon: Trophy },
    { id: 'insights', label: 'Quick Tips', icon: Zap }
  ];

  const getActiveCount = () => {
    return Object.values(coachData.activation_triggers).filter(trigger => trigger).length;
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    onMinimize?.();
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleMinimize}
          className="relative bg-gradient-to-r from-orange-500 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles size={24} />
          {hasNewSuggestions && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-blue-500 text-white p-4 rounded-t-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Career Coach</h3>
              <p className="text-xs text-white/80">
                {getActiveCount()} new insights available
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleMinimize}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Active Triggers */}
        {hasNewSuggestions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {coachData.activation_triggers.profile_optimization_opportunity && (
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs flex items-center gap-1">
                <Users size={12} />
                Profile Boost Available
              </span>
            )}
            {coachData.activation_triggers.new_skill_trending && (
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs flex items-center gap-1">
                <TrendingUp size={12} />
                Trending Skills Alert
              </span>
            )}
            {coachData.activation_triggers.market_opportunity_detected && (
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs flex items-center gap-1">
                <Briefcase size={12} />
                New Opportunities
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {/* Profile Optimization Tips */}
            {coachData.coaching_modules.profile_optimization.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Users size={16} />
                  Profile Optimization
                </h4>
                <div className="space-y-2">
                  {coachData.coaching_modules.profile_optimization.slice(0, 2).map((tip) => (
                    <div
                      key={tip.id}
                      className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => onActionClick?.('profile', tip.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-gray-900">{tip.title}</h5>
                          <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-blue-600 font-medium">
                              Impact: {tip.impact_score}%
                            </span>
                            <span className="text-xs text-gray-500">
                              {tip.time_to_complete}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="text-gray-400 mt-1" size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Development */}
            {coachData.coaching_modules.skill_development.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen size={16} />
                  Trending Skills to Learn
                </h4>
                <div className="space-y-2">
                  {coachData.coaching_modules.skill_development.slice(0, 2).map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => onActionClick?.('skill', skill.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-gray-900">{skill.skill_name}</h5>
                          <p className="text-xs text-gray-600 mt-1">{skill.learning_path}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`text-xs font-medium ${
                              skill.market_demand === 'High' ? 'text-red-600' : 'text-orange-600'
                            }`}>
                              {skill.market_demand} Demand
                            </span>
                            <span className="text-xs text-green-600">
                              {skill.salary_impact}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="text-gray-400 mt-1" size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Tips */}
            {coachData.coaching_modules.application_strategy.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase size={16} />
                  Application Strategy
                </h4>
                <div className="space-y-2">
                  {coachData.coaching_modules.application_strategy.slice(0, 2).map((tip) => (
                    <div
                      key={tip.id}
                      className="p-3 bg-green-50 rounded-lg"
                    >
                      <h5 className="font-medium text-sm text-gray-900">{tip.title}</h5>
                      <p className="text-xs text-gray-600 mt-1">{tip.content}</p>
                      <span className="text-xs text-green-600 font-medium mt-2 inline-block">
                        Success Rate: {tip.success_rate_increase}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-4">
            {/* Profile Levels */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Profile Completion Levels</h4>
              <div className="space-y-2">
                {coachData.milestones.profile_completion_levels.map((level) => (
                  <div
                    key={level.level}
                    className={`p-3 rounded-lg border ${
                      level.unlocked 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className={`font-medium text-sm ${
                          level.unlocked ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          Level {level.level}: {level.name}
                        </h5>
                        <p className="text-xs text-gray-600 mt-1">
                          {level.completion_percentage}% completion required
                        </p>
                      </div>
                      {level.unlocked && (
                        <Trophy className="text-green-600" size={20} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recent Achievements</h4>
              <div className="space-y-2">
                {coachData.milestones.career_achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg"
                  >
                    <span className="text-2xl">{achievement.badge_icon}</span>
                    <div>
                      <h5 className="font-medium text-sm text-gray-900">
                        {achievement.title}
                      </h5>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            {/* Quick Tips */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <AlertCircle size={16} />
                Did You Know?
              </h4>
              <p className="text-sm text-gray-600">
                Profiles with 3+ portfolio projects receive 40% more interview invitations. 
                Consider adding your recent work!
              </p>
            </div>

            {/* Networking Tips */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <MessageCircle size={16} />
                Networking Opportunities
              </h4>
              <div className="space-y-2">
                {coachData.coaching_modules.networking_suggestions.map((tip) => (
                  <div
                    key={tip.id}
                    className="p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => onActionClick?.('networking', tip.id)}
                  >
                    <h5 className="font-medium text-sm text-gray-900">{tip.title}</h5>
                    <p className="text-xs text-gray-600 mt-1">{tip.action}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-orange-600">
                        +{tip.potential_connections} connections
                      </span>
                      <span className={`text-xs ${
                        tip.industry_relevance === 'High' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {tip.industry_relevance} relevance
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => onActionClick?.('full-optimization', 'all')}
          className="w-full py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
        >
          View Full Optimization Plan
        </button>
      </div>
    </div>
  );
}