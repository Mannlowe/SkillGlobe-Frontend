'use client';

import React from 'react';
import { Plus, Award, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { VerifiedSkillsDisplay } from '@/types/verification';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VerifiedSkillsSectionProps {
  skillsData: VerifiedSkillsDisplay;
  compact?: boolean;
  onAddSkill?: () => void;
  onVerifySkill?: (skill: string) => void;
}

export default function VerifiedSkillsSection({
  skillsData,
  compact = false,
  onAddSkill,
  onVerifySkill
}: VerifiedSkillsSectionProps) {
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-purple-600 bg-purple-100';
      case 'advanced': return 'text-blue-600 bg-blue-100';
      case 'intermediate': return 'text-green-600 bg-green-100';
      case 'beginner': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sortedSkills = [...skillsData.skills].sort((a, b) => {
    // Sort by verification status first, then by level
    if (a.verified && !b.verified) return -1;
    if (!a.verified && b.verified) return 1;
    
    const levelOrder = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 };
    return (levelOrder[b.level] || 0) - (levelOrder[a.level] || 0);
  });

  const displaySkills = compact ? sortedSkills.slice(0, 6) : sortedSkills;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Skills & Expertise
          </h2>
          {!compact && (
            <p className="text-sm text-gray-600 mt-1">
              Verified skills have higher visibility to recruiters
            </p>
          )}
        </div>
        
        {onAddSkill && !compact && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddSkill}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {displaySkills.map((skill, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg border transition-all',
              skill.verified 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            )}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                {skill.verified ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium text-gray-900">{skill.name}</span>
              </div>
              
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getLevelColor(skill.level)
              )}>
                {skill.level}
              </span>

              {skill.verified && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {skill.verificationMethod === 'test' && (
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-green-600" />
                      Tested
                    </span>
                  )}
                  {skill.verificationMethod === 'certification' && (
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-gold-600" />
                      Certified
                    </span>
                  )}
                  {skill.endorsementCount && skill.endorsementCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      {skill.endorsementCount}
                    </span>
                  )}
                </div>
              )}
            </div>

            {!skill.verified && onVerifySkill && !compact && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVerifySkill(skill.name)}
                className="text-blue-600 hover:text-blue-700"
              >
                Verify
              </Button>
            )}
          </div>
        ))}
      </div>

      {compact && skillsData.skills.length > 6 && (
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-4">
          View all {skillsData.skills.length} skills →
        </button>
      )}

      {!compact && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Boost Your Profile</h4>
              <p className="text-sm text-blue-700 mt-1">
                Verify your skills through assessments to stand out to recruiters and unlock premium opportunities.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}