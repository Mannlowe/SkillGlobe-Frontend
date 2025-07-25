'use client';

import React from 'react';
import { useOpportunitiesStore } from '@/store/opportunitiesStore';
import { useToast } from '@/components/ui/ToastNotification';
import { SwipeableOpportunityCard } from './SwipeableCard';
import { MobileOpportunitiesContainer, TouchFeedback } from './MobileGestures';
import { useLongPress } from '@/hooks/useLongPress';
import { ListSkeleton } from '@/components/ui/SkeletonLoader';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function MobileOpportunitiesPage() {
  const {
    opportunities,
    isLoading,
    error,
    searchQuery,
    viewMode,
    fetchOpportunities,
    searchOpportunities,
    saveOpportunity,
    applyToOpportunity,
    setViewMode
  } = useOpportunitiesStore();

  const toast = useToast();
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [selectionMode, setSelectionMode] = React.useState(false);

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await fetchOpportunities();
      toast.success('Opportunities refreshed');
    } catch (error: any) {
      toast.error('Refresh failed', error.message);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
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
      toast.success('Opportunity saved');
    } catch (error: any) {
      toast.error('Save failed', error.message);
    }
  };

  const handleApply = async (id: string) => {
    try {
      await applyToOpportunity(id, { coverLetter: 'Mobile application' });
      toast.success('Application submitted');
    } catch (error: any) {
      toast.error('Application failed', error.message);
    }
  };

  // Handle long press for selection mode
  const handleLongPress = (id: string) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedItems([id]);
      toast.info('Selection mode enabled', 'Tap items to select more');
    }
  };

  // Handle item tap in selection mode
  const handleItemTap = (id: string) => {
    if (selectionMode) {
      setSelectedItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    }
  };

  // Exit selection mode
  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedItems([]);
  };

  // Bulk actions
  const handleBulkSave = async () => {
    try {
      for (const id of selectedItems) {
        await saveOpportunity(id);
      }
      toast.success(`Saved ${selectedItems.length} opportunities`);
      exitSelectionMode();
    } catch (error: any) {
      toast.error('Bulk save failed', error.message);
    }
  };

  const handleBulkApply = async () => {
    try {
      for (const id of selectedItems) {
        await applyToOpportunity(id, { coverLetter: 'Bulk mobile application' });
      }
      toast.success(`Applied to ${selectedItems.length} opportunities`);
      exitSelectionMode();
    } catch (error: any) {
      toast.error('Bulk apply failed', error.message);
    }
  };

  return (
    <MobileOpportunitiesContainer onRefresh={handleRefresh}>
      <div className="px-4 pb-20"> {/* Extra bottom padding for mobile navigation */}
        
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white z-10 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Opportunities</h1>
              <p className="text-sm text-gray-600">
                {opportunities.length} jobs found
              </p>
            </div>
            
            {/* View toggle */}
            <div className="flex items-center space-x-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search opportunities..."
              defaultValue={searchQuery}
              onChange={(e) => {
                const query = e.target.value;
                if (query.length === 0 || query.length > 2) {
                  handleSearch(query);
                }
              }}
              className="pl-10 pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selection mode header */}
        {selectionMode && (
          <div className="sticky top-20 bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 z-10">
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-800">
                {selectedItems.length} selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleBulkSave}>
                  Save All
                </Button>
                <Button size="sm" onClick={handleBulkApply}>
                  Apply All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={exitSelectionMode}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && <ListSkeleton itemCount={5} itemHeight="h-32" />}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Opportunities List */}
        {!isLoading && !error && (
          <div className={cn(
            "space-y-4",
            viewMode === 'grid' && "grid grid-cols-1 gap-4 space-y-0"
          )}>
            {opportunities.map((opportunity) => (
              <TouchFeedback
                key={opportunity.id}
                onTap={() => handleItemTap(opportunity.id)}
                className={cn(
                  "relative",
                  selectionMode && selectedItems.includes(opportunity.id) && 
                  "ring-2 ring-orange-500 ring-opacity-50 rounded-lg"
                )}
              >
                <SwipeableOpportunityCard
                  opportunity={opportunity}
                  onSave={() => handleSave(opportunity.id)}
                  onApply={() => handleApply(opportunity.id)}
                  onLongPress={() => handleLongPress(opportunity.id)}
                  className="relative"
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    {/* Selection indicator */}
                    {selectionMode && (
                      <div className="absolute top-2 right-2">
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          selectedItems.includes(opportunity.id)
                            ? "bg-orange-500 border-orange-500"
                            : "border-gray-300"
                        )}>
                          {selectedItems.includes(opportunity.id) && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Opportunity content */}
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {opportunity.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{opportunity.company}</p>
                      <p className="text-gray-500 text-sm">{opportunity.location}</p>
                    </div>

                    {/* Match score and salary */}
                    <div className="flex justify-between items-center">
                      {opportunity.match_percentage && (
                        <div className="text-sm font-medium text-green-600">
                          {opportunity.match_percentage}% match
                        </div>
                      )}
                      {opportunity.salary && (
                        <div className="text-sm text-gray-600">
                          {opportunity.salary}
                        </div>
                      )}
                    </div>

                    {/* Status indicators */}
                    <div className="flex space-x-2">
                      {opportunity.saved && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Saved
                        </span>
                      )}
                      {opportunity.applied && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Applied
                        </span>
                      )}
                    </div>
                  </div>
                </SwipeableOpportunityCard>
              </TouchFeedback>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && opportunities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No opportunities found
            </h3>
            <p className="text-sm mb-4">
              Try adjusting your search or pull down to refresh
            </p>
            <Button variant="outline" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        )}

        {/* Pull to refresh hint */}
        {!isLoading && opportunities.length > 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-xs">Pull down to refresh</p>
          </div>
        )}
      </div>
    </MobileOpportunitiesContainer>
  );
}