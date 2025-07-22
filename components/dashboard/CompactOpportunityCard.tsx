'use client';

import { MapPin, DollarSign, Target, Clock, Zap, Bookmark, Send } from 'lucide-react';
import type { JobOpportunity } from '@/types/dashboard';

interface CompactOpportunityCardProps {
  opportunity: JobOpportunity;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

export default function CompactOpportunityCard({ opportunity, onApply, onSave, onViewDetails }: CompactOpportunityCardProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getUrgencyColor = (urgency: string) => {
    return urgency === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-4">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate" title={opportunity.title}>
            {opportunity.title}
          </h3>
          <p className="text-sm text-gray-600">{opportunity.company}</p>
        </div>
        
        {/* Match Score Badge */}
        <div className={`ml-3 px-3 py-1 rounded-full flex items-center gap-1 ${getMatchScoreColor(opportunity.match_score)}`}>
          <Target size={14} />
          <span className="font-bold text-sm">{opportunity.match_score}%</span>
        </div>
      </div>

      {/* Key Details - Single Row */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <MapPin size={12} />
          <span>{opportunity.location}</span>
          {opportunity.remote_option && <span className="text-green-600">(Remote)</span>}
        </div>
        <div className="flex items-center gap-1">
          <DollarSign size={12} />
          <span>${Math.floor(opportunity.salary_range[0]/1000)}k-${Math.floor(opportunity.salary_range[1]/1000)}k</span>
        </div>
        {opportunity.hiring_urgency === 'Urgent' && (
          <span className={`px-2 py-0.5 rounded-full text-xs ${getUrgencyColor(opportunity.hiring_urgency)}`}>
            <Zap size={10} className="inline mr-0.5" />
            Urgent
          </span>
        )}
      </div>

      {/* Top Match Reasons - Compact */}
      <div className="mb-3">
        <div className="flex items-start gap-1">
          <span className="text-green-500 text-xs mt-0.5">✓</span>
          <p className="text-xs text-gray-700 line-clamp-2">{opportunity.match_reasons[0]}</p>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onApply?.(opportunity.id)}
          className="flex-1 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-medium py-2 px-3 rounded-lg hover:shadow-md transition-all duration-300 text-sm flex items-center justify-center gap-1"
        >
          <Send size={14} />
          Apply
        </button>
        <button
          onClick={() => onSave?.(opportunity.id)}
          className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          title="Save for later"
        >
          <Bookmark size={16} />
        </button>
        <button
          onClick={() => onViewDetails?.(opportunity.id)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Details
        </button>
      </div>
    </div>
  );
}