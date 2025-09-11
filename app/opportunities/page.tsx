'use client';

import { useState } from 'react';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import OpportunityDiscoveryHub from '@/components/dashboard/OpportunityDiscoveryHub';
import { ProgressiveCard } from '@/components/ui/ProgressiveLoader';
import { DashboardStatsSkeleton, OpportunityCardSkeleton } from '@/components/ui/SkeletonLoader';
import { dataService } from '@/lib/dataService';
import { mockSavedSearches } from '@/lib/mockPhase2Data';

export default function OpportunitiesPage() {
  const [searchFilters, setSearchFilters] = useState({});

  const handleSearch = (filters: any) => {
    console.log('Search with filters:', filters);
    setSearchFilters(filters);
  };

  const handleSaveSearch = (search: any) => {
    console.log('Save search:', search);
  };

  const handleApply = (jobId: string) => {
    console.log('Apply to job:', jobId);
  };

  const handleSave = (jobId: string) => {
    console.log('Save job:', jobId);
  };

  const handleViewDetails = (jobId: string) => {
    console.log('View job details:', jobId);
  };

  return (
    <ModernLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Job Opportunities</h1>
            <p className="text-gray-600 mt-2">Discover and apply to opportunities that match your skills</p>
          </div>
        </div>

        {/* Opportunity Discovery Hub - Progressive Loading */}
        <ProgressiveCard
          loadingFunction={async () => {
            // Only load saved searches since opportunities come from store
            const savedSearches = await Promise.resolve(mockSavedSearches);
            
            return {
              savedSearches
            };
          }}
          dependencies={[searchFilters]}
          skeletonComponent={
            <div className="space-y-6">
              <DashboardStatsSkeleton />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <OpportunityCardSkeleton key={i} />
                ))}
              </div>
            </div>
          }
        >
          {(data) => (
            <OpportunityDiscoveryHub
              savedSearches={data.savedSearches}
              onSearch={handleSearch}
              onSaveSearch={handleSaveSearch}
              onApply={handleApply}
              onSave={handleSave}
              onViewDetails={handleViewDetails}
            />
          )}
        </ProgressiveCard>
      </div>
    </ModernLayoutWrapper>
  );
}