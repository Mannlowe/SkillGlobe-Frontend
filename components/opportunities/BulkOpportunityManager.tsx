'use client';

import React, { useMemo } from 'react';
import { useBulkSelectionWithKeyboard } from '@/hooks/useBulkSelection';
import BulkActionBar, { opportunityBulkActions } from '@/components/ui/BulkActionBar';
import { SelectableOpportunityCard } from '@/components/ui/SelectableCard';
import { cn } from '@/lib/utils';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  matchScore?: number;
  tags: string[];
  postedDate: string;
  applicationDeadline?: string;
  description: string;
}

interface BulkOpportunityManagerProps {
  opportunities: Opportunity[];
  onApply?: (opportunityIds: string[]) => void;
  onSave?: (opportunityIds: string[]) => void;
  onHide?: (opportunityIds: string[]) => void;
  onArchive?: (opportunityIds: string[]) => void;
  className?: string;
}

export default function BulkOpportunityManager({
  opportunities,
  onApply,
  onSave,
  onHide,
  onArchive,
  className
}: BulkOpportunityManagerProps) {
  const opportunityIds = useMemo(() => 
    opportunities.map(opp => opp.id), 
    [opportunities]
  );

  const {
    selectedIds,
    isSelected,
    selectAll,
    clearSelection,
    handleItemClick,
    handleKeyDown,
    hasSelection,
    selectedCount,
    totalCount
  } = useBulkSelectionWithKeyboard(opportunityIds);

  // Enhanced bulk actions with custom handlers
  const enhancedActions = useMemo(() => [
    {
      ...opportunityBulkActions[0], // Apply
      onClick: (ids: string[]) => {
        onApply?.(ids);
        clearSelection();
      },
      disabled: selectedIds.length === 0
    },
    {
      ...opportunityBulkActions[1], // Save
      onClick: (ids: string[]) => {
        onSave?.(ids);
        clearSelection();
      },
      disabled: selectedIds.length === 0
    },
    {
      ...opportunityBulkActions[2], // Hide
      onClick: (ids: string[]) => {
        onHide?.(ids);
        clearSelection();
      },
      disabled: selectedIds.length === 0
    },
    {
      ...opportunityBulkActions[3], // Archive
      onClick: (ids: string[]) => {
        onArchive?.(ids);
        clearSelection();
      },
      disabled: selectedIds.length === 0
    }
  ], [selectedIds, onApply, onSave, onHide, onArchive, clearSelection]);

  return (
    <div 
      className={cn("space-y-6", className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Selection Instructions */}
      {!hasSelection && opportunities.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <span>💡</span>
            <span>
              Click to select opportunities. Hold <kbd className="bg-blue-100 px-1 rounded">Ctrl</kbd> for multiple selection, 
              <kbd className="bg-blue-100 px-1 rounded">Shift</kbd> for range selection.
            </span>
          </div>
        </div>
      )}

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedItems={selectedIds}
        totalItems={totalCount}
        actions={enhancedActions}
        onClearSelection={clearSelection}
        onSelectAll={selectAll}
        position="top"
      />

      {/* Opportunity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <SelectableOpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            isSelected={isSelected(opportunity.id)}
            onSelectionChange={handleItemClick}
            className="transition-all duration-200"
          />
        ))}
      </div>

      {/* Empty State */}
      {opportunities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
          <p>Try adjusting your search filters or check back later for new opportunities.</p>
        </div>
      )}

      {/* Selection Summary */}
      {hasSelection && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <strong>{selectedCount}</strong> of <strong>{totalCount}</strong> opportunities selected
            </div>
            <div className="text-xs text-gray-500">
              Press <kbd className="bg-gray-200 px-1 rounded">Esc</kbd> to clear selection
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced opportunity card with additional bulk action support
interface EnhancedOpportunityCardProps {
  opportunity: Opportunity;
  isSelected: boolean;
  onSelectionChange: (id: string, event: React.MouseEvent) => void;
  onQuickApply?: (opportunityId: string) => void;
  onViewDetails?: (opportunityId: string) => void;
  className?: string;
}

export function EnhancedOpportunityCard({
  opportunity,
  isSelected,
  onSelectionChange,
  onQuickApply,
  onViewDetails,
  className
}: EnhancedOpportunityCardProps) {
  const handleQuickApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickApply?.(opportunity.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(opportunity.id);
  };

  return (
    <SelectableOpportunityCard
      opportunity={opportunity}
      isSelected={isSelected}
      onSelectionChange={onSelectionChange}
      className={className}
    />
  );
}