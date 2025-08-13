'use client';

import React from 'react';
import { InteractiveCard, FloatingActionButton } from '@/components/animations/MicroInteractions';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { GradientText } from '@/components/animations/VisualEffects';
import { MapPin, Clock, DollarSign, Users, Bookmark, Send, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedOpportunityCardProps {
  opportunity: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    match_percentage?: number;
    description: string;
    posted_date: string;
    applicants?: number;
    viewed?: boolean;
    saved?: boolean;
    applied?: boolean;
    tags?: string[];
  };
  onSave?: () => void;
  onApply?: () => void;
  onView?: () => void;
  className?: string;
  compact?: boolean;
}

export default function EnhancedOpportunityCard({
  opportunity,
  onSave,
  onApply,
  onView,
  className,
  compact = false
}: EnhancedOpportunityCardProps) {
  const {
    title,
    company,
    location,
    salary,
    match_percentage,
    description,
    posted_date,
    applicants,
    viewed,
    saved,
    applied,
    tags
  } = opportunity;

  const handleCardClick = () => {
    onView?.();
  };

  // Calculate time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <InteractiveCard
      onClick={handleCardClick}
      className={cn(
        "relative p-6 border border-gray-200 space-y-4",
        compact && "p-4 space-y-3",
        viewed && "bg-gray-50",
        className
      )}
      hoverScale={!compact}
      shadowIntensity={compact ? 'sm' : 'md'}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <h3 className={cn(
              "font-semibold text-gray-900 line-clamp-2",
              compact ? "text-base" : "text-lg"
            )}>
              {title}
            </h3>
            {applied && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Applied
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="font-medium">{company}</span>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Match Score */}
        {match_percentage && match_percentage > 0 && (
          <div className="text-right">
            <div className={cn(
              "font-bold",
              match_percentage >= 80 ? "text-green-600" :
              match_percentage >= 60 ? "text-yellow-600" : "text-gray-600",
              compact ? "text-lg" : "text-xl"
            )}>
              <AnimatedCounter value={match_percentage} suffix="%" />
            </div>
            <div className="text-xs text-gray-500">match</div>
          </div>
        )}
      </div>

      {/* Description */}
      {!compact && (
        <p className="text-gray-600 text-sm line-clamp-2">
          {description}
        </p>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, compact ? 2 : 4).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {tags.length > (compact ? 2 : 4) && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{tags.length - (compact ? 2 : 4)} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeAgo(posted_date)}</span>
          </div>
          
          {salary && (
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3" />
              <span>{salary}</span>
            </div>
          )}
          
          {applicants && (
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <AnimatedCounter value={applicants} />
              <span>applicants</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {!compact && (
            <>
              <FloatingActionButton
                icon={<Bookmark className="w-4 h-4" />}
                onClick={(e) => {
                  e?.stopPropagation();
                  onSave?.();
                }}
                size="sm"
                color={saved ? "bg-blue-500" : "bg-gray-400"}
                tooltip={saved ? "Saved" : "Save"}
              />
              
              <FloatingActionButton
                icon={<Send className="w-4 h-4" />}
                onClick={(e) => {
                  e?.stopPropagation();
                  onApply?.();
                }}
                size="sm"
                color={applied ? "bg-green-500" : "bg-orange-500"}
                tooltip={applied ? "Applied" : "Apply"}
              />
            </>
          )}

          <FloatingActionButton
            icon={<Eye className="w-4 h-4" />}
            onClick={(e) => {
              e?.stopPropagation();
              onView?.();
            }}
            size="sm"
            color="bg-gray-600"
            tooltip="View Details"
          />
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute top-4 right-4 flex space-x-1">
        {saved && (
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        )}
        {applied && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
        {viewed && (
          <div className="w-2 h-2 bg-gray-400 rounded-full" />
        )}
      </div>

      {/* New Badge */}
      {getTimeAgo(posted_date).includes('h') && parseInt(getTimeAgo(posted_date)) < 24 && (
        <div className="absolute top-0 left-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-br-lg">
          <GradientText text="NEW" gradient="from-white to-orange-100" />
        </div>
      )}

      {/* High Match Badge */}
      {match_percentage && match_percentage >= 90 && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full transform rotate-12 shadow-lg">
          <GradientText text="🔥 HOT" gradient="from-yellow-200 to-orange-200" />
        </div>
      )}
    </InteractiveCard>
  );
}

// Enhanced opportunity list with animations
interface EnhancedOpportunityListProps {
  opportunities: any[];
  onSave?: (id: string) => void;
  onApply?: (id: string) => void;
  onView?: (id: string) => void;
  loading?: boolean;
  className?: string;
  compact?: boolean;
}

export function EnhancedOpportunityList({
  opportunities,
  onSave,
  onApply,
  onView,
  loading,
  className,
  compact = false
}: EnhancedOpportunityListProps) {
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 rounded-lg h-32"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {opportunities.map((opportunity, index) => (
        <div
          key={opportunity.id}
          className="transform transition-all duration-300"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'fadeInUp 0.6s ease-out forwards'
          }}
        >
          <EnhancedOpportunityCard
            opportunity={opportunity}
            onSave={() => onSave?.(opportunity.id)}
            onApply={() => onApply?.(opportunity.id)}
            onView={() => onView?.(opportunity.id)}
            compact={compact}
          />
        </div>
      ))}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}