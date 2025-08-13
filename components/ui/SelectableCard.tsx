'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectableCardProps {
  id: string;
  isSelected: boolean;
  onSelectionChange: (id: string, event: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  showCheckbox?: boolean;
  selectionPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export default function SelectableCard({
  id,
  isSelected,
  onSelectionChange,
  disabled = false,
  className,
  children,
  showCheckbox = true,
  selectionPosition = 'top-right'
}: SelectableCardProps) {
  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return;
    onSelectionChange(id, event);
  };

  const positionClasses = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3'
  };

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-200",
        "hover:shadow-md",
        isSelected && "ring-2 ring-orange-500 ring-opacity-50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleClick}
    >
      {/* Selection Checkbox */}
      {showCheckbox && (
        <div className={cn(
          "absolute z-10 transition-all duration-200",
          positionClasses[selectionPosition],
          "opacity-0 group-hover:opacity-100",
          isSelected && "opacity-100"
        )}>
          <div className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
            "bg-white shadow-sm transition-all duration-200",
            isSelected 
              ? "border-orange-500 bg-orange-500" 
              : "border-gray-300 group-hover:border-orange-300"
          )}>
            {isSelected && (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
        </div>
      )}

      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-orange-500 bg-opacity-5 rounded-lg pointer-events-none" />
      )}

      {/* Card Content */}
      <div className={cn(
        "transition-all duration-200",
        isSelected && "transform scale-[0.98]"
      )}>
        {children}
      </div>
    </div>
  );
}

// Specialized selectable cards for different content types

interface SelectableOpportunityCardProps {
  opportunity: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    matchScore?: number;
  };
  isSelected: boolean;
  onSelectionChange: (id: string, event: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}

export function SelectableOpportunityCard({
  opportunity,
  isSelected,
  onSelectionChange,
  disabled,
  className
}: SelectableOpportunityCardProps) {
  return (
    <SelectableCard
      id={opportunity.id}
      isSelected={isSelected}
      onSelectionChange={onSelectionChange}
      disabled={disabled}
      className={className}
    >
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
            <p className="text-gray-600">{opportunity.company}</p>
            <p className="text-sm text-gray-500">{opportunity.location}</p>
          </div>
          {opportunity.matchScore && (
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">
                {opportunity.matchScore}% match
              </div>
            </div>
          )}
        </div>
        {opportunity.salary && (
          <div className="text-sm text-gray-600">
            {opportunity.salary}
          </div>
        )}
      </div>
    </SelectableCard>
  );
}

interface SelectableSkillCardProps {
  skill: {
    id: string;
    name: string;
    level: string;
    endorsed: boolean;
    verified: boolean;
  };
  isSelected: boolean;
  onSelectionChange: (id: string, event: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}

export function SelectableSkillCard({
  skill,
  isSelected,
  onSelectionChange,
  disabled,
  className
}: SelectableSkillCardProps) {
  return (
    <SelectableCard
      id={skill.id}
      isSelected={isSelected}
      onSelectionChange={onSelectionChange}
      disabled={disabled}
      className={className}
      selectionPosition="top-left"
    >
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">{skill.name}</h3>
          <div className="flex space-x-1">
            {skill.verified && (
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Verified" />
            )}
            {skill.endorsed && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" title="Endorsed" />
            )}
          </div>
        </div>
        <div className="text-sm text-gray-600">{skill.level}</div>
      </div>
    </SelectableCard>
  );
}

interface SelectablePortfolioItemProps {
  item: {
    id: string;
    title: string;
    type: string;
    thumbnail?: string;
    status: 'draft' | 'published' | 'private';
  };
  isSelected: boolean;
  onSelectionChange: (id: string, event: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}

export function SelectablePortfolioItem({
  item,
  isSelected,
  onSelectionChange,
  disabled,
  className
}: SelectablePortfolioItemProps) {
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    private: 'bg-gray-100 text-gray-800'
  };

  return (
    <SelectableCard
      id={item.id}
      isSelected={isSelected}
      onSelectionChange={onSelectionChange}
      disabled={disabled}
      className={className}
    >
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {item.thumbnail && (
          <div className="aspect-video bg-gray-100">
            <img 
              src={item.thumbnail} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              statusColors[item.status]
            )}>
              {item.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">{item.type}</p>
        </div>
      </div>
    </SelectableCard>
  );
}