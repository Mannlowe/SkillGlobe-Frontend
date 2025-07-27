'use client';

import React from 'react';
import { Users, MessageSquare, ThumbsUp, Award, Plus } from 'lucide-react';
import { SocialProofSection as SocialProofSectionType } from '@/types/verification';
import { Button } from '@/components/ui/button';

interface SocialProofSectionProps {
  socialData: SocialProofSectionType;
  onRequestEndorsement?: () => void;
  onRequestRecommendation?: () => void;
}

export default function SocialProofSection({
  socialData,
  onRequestEndorsement,
  onRequestRecommendation
}: SocialProofSectionProps) {
  return (
    <div className="space-y-6">
      {/* Endorsements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-blue-600" />
              Skill Endorsements
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {socialData.totalEndorsements} endorsements from your network
            </p>
          </div>
          
          {onRequestEndorsement && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRequestEndorsement}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Request
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {socialData.recentEndorsements.map((endorsement, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {endorsement.from} endorsed your {endorsement.skill} skills
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(endorsement.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Recommendations
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Professional recommendations from colleagues
            </p>
          </div>
          
          {onRequestRecommendation && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRequestRecommendation}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Request
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {socialData.recommendations.map((rec, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{rec.from}</h4>
                      <p className="text-sm text-gray-600">{rec.role}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(rec.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 italic">"{rec.text}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}