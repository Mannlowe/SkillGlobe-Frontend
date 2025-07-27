'use client';

import React from 'react';
import { Plus, Briefcase, CheckCircle, Calendar, Building2 } from 'lucide-react';
import { VerifiedExperienceDisplay } from '@/types/verification';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VerifiedExperienceSectionProps {
  experienceData: VerifiedExperienceDisplay;
  compact?: boolean;
  onAddExperience?: () => void;
  onVerifyExperience?: (id: string) => void;
}

export default function VerifiedExperienceSection({
  experienceData,
  compact = false,
  onAddExperience,
  onVerifyExperience
}: VerifiedExperienceSectionProps) {
  
  const displayExperiences = compact 
    ? experienceData.experiences.slice(0, 2) 
    : experienceData.experiences;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Work Experience
          </h2>
          {!compact && (
            <p className="text-sm text-gray-600 mt-1">
              Verified employment adds credibility to your profile
            </p>
          )}
        </div>
        
        {onAddExperience && !compact && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddExperience}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {displayExperiences.map((experience) => (
          <div
            key={experience.id}
            className={cn(
              'p-4 rounded-lg border transition-all',
              experience.verified 
                ? 'border-purple-200 bg-purple-50' 
                : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{experience.title}</h3>
                  {experience.verified && (
                    <div className="flex items-center gap-1 text-purple-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {experience.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {experience.duration}
                  </div>
                </div>

                {experience.verified && experience.verificationDate && (
                  <p className="text-xs text-purple-600 mt-2">
                    Verified on {new Date(experience.verificationDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {!experience.verified && onVerifyExperience && !compact && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVerifyExperience(experience.id)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Verify
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {compact && experienceData.experiences.length > 2 && (
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-4">
          View all {experienceData.experiences.length} experiences →
        </button>
      )}

      {!compact && experienceData.experiences.some(exp => !exp.verified) && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900">Employment Verification</h4>
              <p className="text-sm text-purple-700 mt-1">
                Verify your work history to build trust with recruiters and unlock exclusive opportunities.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}