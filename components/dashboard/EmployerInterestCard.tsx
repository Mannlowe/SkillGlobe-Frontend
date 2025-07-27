'use client';

import { MapPin, DollarSign, Building, Clock, ThumbsUp, ThumbsDown, Eye, Heart, Briefcase } from 'lucide-react';
import type { JobOpportunity } from '@/types/dashboard';
import { StandardizedButton } from '@/components/ui/StandardizedButton';

interface EmployerInterestCardProps {
  opportunity: JobOpportunity;
  onExpressInterest: (jobId: string, interest: 'yes' | 'maybe' | 'no') => void;
  onViewDetails: (jobId: string) => void;
  userInterest?: 'yes' | 'maybe' | 'no';
}

export default function EmployerInterestCard({ 
  opportunity, 
  onExpressInterest,
  onViewDetails,
  userInterest 
}: EmployerInterestCardProps) {
  
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="border border-blue-200 rounded-lg p-3 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-white transition-all duration-200">
      {/* Single line header with all key info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Building className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-blue-900 truncate">
              <span className="font-medium">{opportunity.company}</span> • {opportunity.title}
            </p>
          </div>
        </div>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ml-2 ${getMatchScoreColor(opportunity.match_score)}`}>
          {opportunity.match_score}%
        </span>
      </div>

      {/* Compact details row */}
      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {opportunity.location}{opportunity.remote_option && <span className="text-green-600"> (Remote)</span>}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={12} />
            ${Math.floor(opportunity.salary_range[0]/1000)}k-${Math.floor(opportunity.salary_range[1]/1000)}k
          </span>
        </div>
      </div>

      {/* One line match reason */}
      <div className="text-xs text-gray-600 mb-3 flex items-start gap-1">
        <span className="text-green-500 mt-0.5">✓</span>
        <span className="line-clamp-1">{opportunity.match_reasons[0]}</span>
      </div>

      {/* Compact Action Buttons */}
      {userInterest ? (
        <div className="flex items-center justify-center py-1.5 px-2 bg-gray-50 rounded text-xs text-gray-600">
          {userInterest === 'yes' ? 'Interested' : userInterest === 'maybe' ? 'Maybe Later' : 'Declined'} • Waiting for response
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <StandardizedButton
            onClick={() => onExpressInterest(opportunity.id, 'yes')}
            variant="primary"
            size="sm"
            leftIcon={<ThumbsUp size={12} />}
            className="flex-1 text-xs py-1.5"
          >
            Interested
          </StandardizedButton>
          <StandardizedButton
            onClick={() => onExpressInterest(opportunity.id, 'maybe')}
            variant="secondary"
            size="sm"
            leftIcon={<Clock size={12} />}
            className="flex-1 text-xs py-1.5"
          >
            Maybe
          </StandardizedButton>
          <StandardizedButton
            onClick={() => onExpressInterest(opportunity.id, 'no')}
            variant="ghost"
            size="sm"
            leftIcon={<ThumbsDown size={12} />}
            className="px-2 text-xs py-1.5"
          >
          </StandardizedButton>
          <StandardizedButton
            onClick={() => onViewDetails(opportunity.id)}
            variant="ghost"
            size="sm"
            leftIcon={<Eye size={12} />}
            className="px-2 text-xs py-1.5"
          >
          </StandardizedButton>
        </div>
      )}
    </div>
  );
}