'use client';

import React from 'react';
import { CheckCircle, Circle, TrendingUp, AlertCircle } from 'lucide-react';
import { ProfileCompletionScore } from '@/types/verification';
import { cn } from '@/lib/utils';

interface ProfileCompletionCardProps {
  completionScore: ProfileCompletionScore;
  compact?: boolean;
  onImprove?: (section: string) => void;
}

export default function ProfileCompletionCard({
  completionScore,
  compact = false,
  onImprove
}: ProfileCompletionCardProps) {
  
  const sections = [
    { key: 'personal', label: 'Personal Info', value: completionScore.sections.personal },
    { key: 'skills', label: 'Skills', value: completionScore.sections.skills },
    { key: 'experience', label: 'Experience', value: completionScore.sections.experience },
    { key: 'education', label: 'Education', value: completionScore.sections.education },
    { key: 'certifications', label: 'Certifications', value: completionScore.sections.certifications },
    { key: 'portfolio', label: 'Portfolio', value: completionScore.sections.portfolio }
  ];

  const getCompletionColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Profile Strength</h3>
          <span className={cn(
            'text-2xl font-bold',
            completionScore.overall >= 80 ? 'text-green-600' :
            completionScore.overall >= 60 ? 'text-yellow-600' :
            'text-red-600'
          )}>
            {completionScore.overall}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              'h-2 rounded-full transition-all duration-500',
              getProgressBarColor(completionScore.overall)
            )}
            style={{ width: `${completionScore.overall}%` }}
          />
        </div>
        
        {completionScore.suggestions.length > 0 && (
          <p className="text-xs text-gray-600 mt-3">
            {completionScore.suggestions[0]}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Profile Completion
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete your profile to increase visibility
          </p>
        </div>
        
        <div className={cn(
          'px-4 py-2 rounded-lg text-center',
          getCompletionColor(completionScore.overall)
        )}>
          <div className="text-2xl font-bold">{completionScore.overall}%</div>
          <div className="text-xs">Complete</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={cn(
              'h-3 rounded-full transition-all duration-500',
              getProgressBarColor(completionScore.overall)
            )}
            style={{ width: `${completionScore.overall}%` }}
          />
        </div>
      </div>

      {/* Section Breakdown */}
      <div className="space-y-3 mb-6">
        {sections.map((section) => (
          <div key={section.key} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {section.value === 100 ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700">{section.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className={cn(
                    'h-2 rounded-full transition-all duration-500',
                    getProgressBarColor(section.value)
                  )}
                  style={{ width: `${section.value}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-10 text-right">{section.value}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {completionScore.suggestions.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-2">Suggestions to improve</h4>
              <ul className="space-y-1">
                {completionScore.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-1.5" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
              {onImprove && (
                <button 
                  onClick={() => onImprove(sections.find(s => s.value < 100)?.key || 'personal')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-3"
                >
                  Start Improving →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}