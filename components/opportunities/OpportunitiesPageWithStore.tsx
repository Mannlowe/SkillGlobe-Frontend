'use client';

import React, { useEffect } from 'react';
import { useOpportunitiesStore } from '@/store/opportunitiesStore';
import { useToast } from '@/components/ui/ToastNotification';
import { SelectableOpportunityCard } from '@/components/ui/SelectableCard';
import { useBulkSelectionWithKeyboard } from '@/hooks/useBulkSelection';
import BulkActionBar from '@/components/ui/BulkActionBar';
import { ListSkeleton } from '@/components/ui/SkeletonLoader';
import { Filter, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function OpportunitiesPageWithStore() {
  const {
    opportunities,
    isLoading,
    error,
    searchQuery,
    viewMode,
    sortBy,
    sortOrder,
    filters,
    fetchOpportunities,
    searchOpportunities,
    saveOpportunity,
    applyToOpportunity,
    setViewMode,
    setSorting,
    bulkSave,
    bulkApply,
    bulkHide
  } = useOpportunitiesStore();

  const toast = useToast();

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
  } = useBulkSelectionWithKeyboard(opportunities.map(opp => opp.id));

  // Fetch opportunities on mount
  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Handle search
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    
    try {
      await searchOpportunities(query);
    } catch (error: any) {
      toast.error('Search failed', error.message);
    }
  };

  // Handle individual actions
  const handleSave = async (id: string) => {
    try {
      await saveOpportunity(id);
      toast.success('Opportunity saved', 'Added to your saved opportunities');
    } catch (error: any) {
      toast.error('Save failed', error.message);
    }
  };

  const handleApply = async (id: string) => {
    try {
      await applyToOpportunity(id, { coverLetter: 'Default application' });
      toast.success('Application submitted', 'Your application has been sent');
    } catch (error: any) {
      toast.error('Application failed', error.message);
    }
  };

  // Handle bulk actions
  const handleBulkSave = async () => {
    try {
      await bulkSave(selectedIds);
      toast.success(`Saved ${selectedIds.length} opportunities`);
      clearSelection();
    } catch (error: any) {
      toast.error('Bulk save failed', error.message);
    }
  };

  const handleBulkApply = async () => {
    try {
      await bulkApply(selectedIds, { coverLetter: 'Bulk application' });
      toast.success(`Applied to ${selectedIds.length} opportunities`);
      clearSelection();
    } catch (error: any) {
      toast.error('Bulk apply failed', error.message);
    }
  };

  const handleBulkHide = async () => {
    try {
      await bulkHide(selectedIds);
      toast.success(`Hidden ${selectedIds.length} opportunities`);
      clearSelection();
    } catch (error: any) {
      toast.error('Bulk hide failed', error.message);
    }
  };

  // Bulk actions configuration
  const bulkActions = [
    {
      id: 'apply',
      label: 'Apply',
      icon: <Search className="w-4 h-4" />,
      variant: 'default' as const,
      onClick: handleBulkApply
    },
    {
      id: 'save',
      label: 'Save',
      icon: <Grid className="w-4 h-4" />,
      onClick: handleBulkSave
    },
    {
      id: 'hide',
      label: 'Hide',
      icon: <List className="w-4 h-4" />,
      onClick: handleBulkHide
    }
  ];

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Job Opportunities
          </h1>
          <p className="text-gray-600 mt-2">
            Discover and apply to jobs that match your skills
          </p>
        </div>

        {/* View controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              name="search"
              placeholder="Search opportunities..."
              defaultValue={searchQuery}
              className="pl-10"
            />
          </div>
        </form>
        
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Bulk action bar */}
      {hasSelection && (
        <BulkActionBar
          selectedItems={selectedIds}
          totalItems={totalCount}
          actions={bulkActions}
          onClearSelection={clearSelection}
          onSelectAll={selectAll}
          position="top"
        />
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchOpportunities()}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <ListSkeleton itemCount={6} itemHeight="h-32" />
      )}

      {/* Opportunities grid/list */}
      {!isLoading && !error && (
        <>
          <div className={cn(
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          )}>
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

          {/* Empty state */}
          {opportunities.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No opportunities found
              </h3>
              <p>Try adjusting your search filters or check back later for new opportunities.</p>
            </div>
          )}
        </>
      )}

      {/* Selection summary */}
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