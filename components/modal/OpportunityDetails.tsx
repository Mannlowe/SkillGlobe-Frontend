'use client';

import { useState } from 'react';
import { 
  X, 
  MapPin, 
  DollarSign, 
  Target, 
  Clock, 
  Zap, 
  Building, 
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Send,
  Bookmark,
  ExternalLink,
  Star
} from 'lucide-react';
import type { JobOpportunity } from '@/types/dashboard';
import { StandardizedButton } from '@/components/ui/StandardizedButton';

interface OpportunityDetailsProps {
  opportunity: JobOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
}

export default function OpportunityDetails({ 
  opportunity, 
  isOpen, 
  onClose, 
  onApply, 
  onSave 
}: OpportunityDetailsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!isOpen || !opportunity) return null;

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getGrowthPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onSave?.(opportunity.id);
  };

  const handleApply = () => {
    onApply?.(opportunity.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">{opportunity.title}</h2>
                {opportunity.buyer_interested && (
                  <span className="px-2 py-1 rounded-full text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium">
                    ⭐ Buyer Interested
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Company & Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building className="text-gray-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{opportunity.company}</h3>
                    <p className="text-sm text-gray-600">Company</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getMatchScoreColor(opportunity.match_score)}`}>
                  <Target size={14} className="inline mr-1" />
                  {opportunity.match_score}% Match
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{opportunity.location}</p>
                    {opportunity.remote_option && (
                      <p className="text-xs text-green-600">Remote Available</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ${Math.floor(opportunity.salary_range[0]/1000)}k - ${Math.floor(opportunity.salary_range[1]/1000)}k
                    </p>
                    <p className="text-xs text-gray-600">Annual Salary</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{opportunity.application_deadline}</p>
                    <p className="text-xs text-gray-600">Deadline</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{opportunity.estimated_response_time}</p>
                    <p className="text-xs text-gray-600">Response Time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Analysis */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Target className="text-blue-600" size={20} />
                Why You're a Great Match
              </h3>
              
              <div className="space-y-3">
                {opportunity.match_reasons.map((reason, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Gaps (if any) */}
            {opportunity.skill_gaps.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-600" size={20} />
                  Areas for Growth
                </h3>
                
                <div className="space-y-3">
                  {opportunity.skill_gaps.map((gap, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{gap}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opportunity Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-blue-600" size={16} />
                  <h4 className="font-medium text-gray-900">Growth Potential</h4>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getGrowthPotentialColor(opportunity.growth_potential)}`}>
                  {opportunity.growth_potential}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-purple-600" size={16} />
                  <h4 className="font-medium text-gray-900">Competition</h4>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCompetitionColor(opportunity.application_competition)}`}>
                  {opportunity.application_competition}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-orange-600" size={16} />
                  <h4 className="font-medium text-gray-900">Culture Fit</h4>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {opportunity.culture_fit_score}%
                </div>
              </div>
            </div>

            {/* Hiring Insights */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="text-blue-600" size={20} />
                Hiring Insights
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Hiring Urgency</p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    opportunity.hiring_urgency === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {opportunity.hiring_urgency === 'Urgent' && <Zap size={12} />}
                    {opportunity.hiring_urgency}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Recruiter Activity</p>
                  <p className="text-sm text-gray-600">{opportunity.recruiter_activity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-end justify-end rounded-b-xl">
            {/* <div className="flex items-center gap-3">
              <StandardizedButton
                onClick={handleBookmark}
                variant="ghost"
                size="sm"
                leftIcon={<Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />}
                className={isBookmarked ? 'text-orange-600' : 'text-gray-600'}
              >
                {isBookmarked ? 'Saved' : 'Save'}
              </StandardizedButton>
              
              <StandardizedButton
                variant="ghost"
                size="sm"
                leftIcon={<ExternalLink size={16} />}
                className="text-gray-600"
              >
                View Original
              </StandardizedButton>
            </div> */}
            
            <div className="flex items-center gap-3">
              <StandardizedButton
                onClick={onClose}
                variant="ghost"
                size="default"
              >
                Close
              </StandardizedButton>
              
              <StandardizedButton
                onClick={handleApply}
                variant="primary"
                size="default"
                leftIcon={<Send size={16} />}
              >
                Apply Now
              </StandardizedButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}