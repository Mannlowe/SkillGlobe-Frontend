'use client';

import { Clock, MapPin, DollarSign, Zap, Target, TrendingUp, Building } from 'lucide-react';
import type { JobOpportunity } from '@/types/dashboard';

interface OpportunityFeedProps {
  opportunities: JobOpportunity[];
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

export default function OpportunityFeed({ opportunities, onApply, onSave, onViewDetails }: OpportunityFeedProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {opportunities.map((job) => (
        <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building className="text-gray-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
              </div>
            </div>
            
            {/* Match Score */}
            <div className={`px-4 py-2 rounded-lg border ${getMatchScoreColor(job.match_score)}`}>
              <div className="flex items-center gap-2">
                <Target size={16} />
                <span className="font-bold">{job.match_score}%</span>
              </div>
              <p className="text-xs mt-1">Match</p>
            </div>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{job.location}</span>
              {job.remote_option && <span className="text-green-600 font-medium ml-1">(Remote)</span>}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={16} />
              <span>${job.salary_range[0].toLocaleString()} - ${job.salary_range[1].toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>Apply by {new Date(job.application_deadline).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Match Insights */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Why you're a great match:</h4>
            <ul className="space-y-1">
              {job.match_reasons.slice(0, 3).map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            
            {job.skill_gaps.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Skills to highlight:</span> {job.skill_gaps.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Application Intelligence */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Zap className={getCompetitionColor(job.application_competition)} size={16} />
                <span className={getCompetitionColor(job.application_competition)}>
                  {job.application_competition} competition
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="text-gray-500" size={16} />
                <span className="text-gray-600">Response in {job.estimated_response_time}</span>
              </div>
            </div>
            
            {job.hiring_urgency === 'Urgent' && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                Urgent hire
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onApply?.(job.id)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Quick Apply
            </button>
            <button
              onClick={() => onSave?.(job.id)}
              className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => onViewDetails?.(job.id)}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium"
            >
              Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}