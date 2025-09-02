'use client';

import { MapPin, DollarSign, Target, Clock, Zap, Bookmark, Send, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { JobOpportunity } from '@/types/dashboard';
import { StandardizedButton } from '@/components/ui/StandardizedButton';
import { useState } from 'react';
import OpportunityDetails from '@/components/modal/OpportunityDetails';
import SkillsSuccessModal from '@/components/modal/SkillsSuccessModal';

interface CompactOpportunityCardProps {
  opportunity: JobOpportunity;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  onExpressInterest?: (jobId: string, interest: 'yes' | 'maybe' | 'no') => void;
  showInterestButtons?: boolean;
  userInterest?: 'yes' | 'maybe' | 'no';
  hideHeader?: boolean; // Hide header when wrapped in employer interest
}

export default function CompactOpportunityCard({ 
  opportunity, 
  onApply, 
  onSave, 
  onViewDetails, 
  onExpressInterest,
  showInterestButtons = false,
  userInterest,
  hideHeader = false
}: CompactOpportunityCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getMatchScoreTooltip = (score: number) => {
    if (score >= 90) return 'Excellent match - Your skills align perfectly';
    if (score >= 75) return 'Great match - Most requirements met';
    if (score >= 60) return 'Good match - Several skills align';
    return 'Partial match - Some skills relevant';
  };

  const getUrgencyColor = (urgency: string) => {
    return urgency === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700';
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onSave?.(opportunity.id);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsApplicationModalOpen(true);
    onApply?.(opportunity.id);
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
    onViewDetails?.(opportunity.id);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
    onViewDetails?.(opportunity.id);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleApplicationModalClose = () => {
    setIsApplicationModalOpen(false);
  };

  return (
    <div 
      className={`${
        opportunity.buyer_interested ? 'buyer-interested-border' : ''
      } rounded-lg`}
    >
      <div 
        onClick={handleCardClick}
        className="inner bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-orange-200 transition-all duration-200 p-4 cursor-pointer group relative"
      >
      {/* Bookmark Button - Top Right Corner */}
      <button
        onClick={handleBookmark}
        className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all duration-200 ${
          isBookmarked 
            ? 'text-orange-500 bg-orange-50 hover:bg-orange-100' 
            : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
        }`}
        aria-label={isBookmarked ? 'Remove from saved jobs' : 'Save job for later'}
      >
        <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
      </button>

      {/* Header Row */}
      <div className="flex items-start justify-between mb-3 pr-10">
        <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
  <h3
    className="font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors"
    title={opportunity.title}
  >
    {opportunity.title}
  </h3>

  {opportunity.buyer_interested && (
    <span className="px-2 py-0.5 rounded-full text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium">
      ⭐ Buyer Interested
    </span>
  )}
</div>

          
          {/* Company and Match Score on same line */}
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-600">{opportunity.company}</p>
            <span className="text-gray-400">•</span>
            
            {/* Company and Match Score on same line */}
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-600">{opportunity.company}</p>
              <span className="text-gray-400">•</span>
              
              {/* Inline Match Score with Tooltip */}
              <div 
                className={`relative px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getMatchScoreColor(opportunity.match_score)}`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Target size={12} />
                <span>{opportunity.match_score}% match</span>
                
                {/* Tooltip */}
                {showTooltip && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-10 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap">
                    {getMatchScoreTooltip(opportunity.match_score)}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Top Match Reasons - Compact with subtle styling */}
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <span className="text-green-500 text-xs mt-0.5 flex-shrink-0">✓</span>
          <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">{opportunity.match_reasons[0]}</p>
        </div>
      </div>

      {/* Actions Row - Grouped Primary & Secondary */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {/* Primary Action */}
        <StandardizedButton
          onClick={handleApply}
          variant="primary"
          size="sm"
          leftIcon={<Send size={14} />}
          className="flex-1 mr-3"
        >
          Quick Apply
        </StandardizedButton>
        
        {/* Secondary Actions */}
        <div className="flex items-center gap-2">
          <StandardizedButton
            onClick={handleViewClick}
            variant="ghost"
            size="sm"
            leftIcon={<Eye size={14} />}
            className="text-gray-600 hover:text-orange-600"
          >
            View
          </StandardizedButton>
        </div>
      </div>
      
      {/* Subtle indication this card is clickable */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-orange-200 pointer-events-none transition-colors duration-200"></div>
      </div>

      {/* Opportunity Details Modal */}
      <OpportunityDetails
        opportunity={opportunity}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onApply={onApply}
        onSave={onSave}
      />

      {/* Application Success Modal */}
      <SkillsSuccessModal
        isOpen={isApplicationModalOpen}
        onClose={handleApplicationModalClose}
        type="application"
        jobTitle={opportunity.title}
        companyName={opportunity.company}
      />
    </div>
  );
}