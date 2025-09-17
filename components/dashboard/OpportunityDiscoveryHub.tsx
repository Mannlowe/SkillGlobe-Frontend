'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Bookmark, Bell, MapPin, DollarSign, Clock, Briefcase, Building, Target, Zap, Star } from 'lucide-react';
import type { JobOpportunity } from '@/types/dashboard';
import type { OpportunitySearchFilters, SavedSearch } from '@/types/opportunities';
import { useIndividualDashboardStore } from '@/store/dashboard/individualdashboardStore';
import CompactOpportunityCard from './CompactOpportunityCard';

interface OpportunityDiscoveryHubProps {
  savedSearches: SavedSearch[];
  onSearch: (filters: OpportunitySearchFilters) => void;
  onSaveSearch: (search: SavedSearch) => void;
  onApply: (jobId: string) => void;
  onSave: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
}

export default function OpportunityDiscoveryHub({
  savedSearches,
  onSearch,
  onSaveSearch,
  onApply,
  onSave,
  onViewDetails
}: OpportunityDiscoveryHubProps) {
  // Get opportunities from store instead of props
  const {
    opportunities,
    isLoadingOpportunities,
    opportunityError,
    fetchOpportunityMatches,
    bookmarkedOpportunities,
    isLoadingBookmarks,
    bookmarkError,
    fetchBookmarkedOpportunities,
    opportunityMatches
  } = useIndividualDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Partial<OpportunitySearchFilters>>({});
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'salary' | 'match_score'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Fetch opportunities and bookmarked opportunities on component mount
  useEffect(() => {
    if (!opportunities || opportunities.length === 0) {
      fetchOpportunityMatches();
    }
    
    // Fetch bookmarked opportunities
    fetchBookmarkedOpportunities();
    // Only run this effect once on component mount
  }, [/* removed dependencies to prevent re-fetching */]);

  const filterOptions = {
    jobTypes: [
      { id: 'ft', label: 'Full-time', value: 'full-time' },
      { id: 'pt', label: 'Part-time', value: 'part-time' },
      { id: 'contract', label: 'Contract', value: 'contract' },
      { id: 'freelance', label: 'Freelance', value: 'freelance' },
    ],
    experienceLevels: [
      { id: 'entry', label: 'Entry Level (0-2 years)', value: 'entry', years_range: [0, 2] },
      { id: 'junior', label: 'Junior (2-4 years)', value: 'junior', years_range: [2, 4] },
      { id: 'mid', label: 'Mid Level (4-7 years)', value: 'mid', years_range: [4, 7] },
      { id: 'senior', label: 'Senior (7+ years)', value: 'senior', years_range: [7, 15] },
    ],
    remoteOptions: [
      { id: 'onsite', label: 'On-site', value: 'onsite' },
      { id: 'remote', label: 'Remote', value: 'remote' },
      { id: 'hybrid', label: 'Hybrid', value: 'hybrid' },
    ],
    postedWithin: [
      { id: '1d', label: 'Last 24 hours', value: '1d', days: 1 },
      { id: '3d', label: 'Last 3 days', value: '3d', days: 3 },
      { id: '1w', label: 'Last week', value: '1w', days: 7 },
      { id: '1m', label: 'Last month', value: '1m', days: 30 },
    ]
  };

  const handleSearch = async () => {
    // Set hasSearched to true when user performs a search
    setHasSearched(!!searchQuery.trim());
    
    // Use the store to fetch opportunities with search query
    await fetchOpportunityMatches(searchQuery.trim() || undefined);

    // Also call the onSearch prop for any additional handling
    const filters: Partial<OpportunitySearchFilters> = {
      keywords: searchQuery.split(' ').filter(k => k.length > 0),
      ...selectedFilters
    };
    onSearch(filters as OpportunitySearchFilters);
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    setHasSearched(false);
    // Fetch all opportunities without search filter
    await fetchOpportunityMatches();
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, sortedOpportunities.length));
    setIsExpanded(true);
  };

  const handleShowLess = () => {
    setVisibleCount(3);
    setIsExpanded(false);
  };

  // Apply client-side filtering - show all opportunities (API handles search filtering)
  const filteredOpportunities = opportunities ? opportunities.filter(job => {
    // Since API handles search filtering, we only apply additional client-side filters here
    // For now, show all opportunities since filters aren't fully implemented
    // Future: Add proper filter logic when filter state management is implemented
    return true;
  }) : [];

  const sortedOpportunities = filteredOpportunities.sort((a, b) => {
    switch (sortBy) {
      case 'match_score':
        return b.match_score - a.match_score;
      case 'salary':
        return b.salary_range[1] - a.salary_range[1];
      case 'date':
        return new Date(b.application_deadline).getTime() - new Date(a.application_deadline).getTime();
      default:
        return b.match_score - a.match_score; // Default to relevance
    }
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex w-2/5 items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-orange-500">
          {/* Search Icon */}
          <Search className="ml-3 text-gray-400" size={20} />

          {/* Input */}
          <input
            type="text"
            placeholder="Search jobs, companies, or skills..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === '') {
                handleClearSearch();
              }
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onBlur={() => {
              if (searchQuery.trim()) {
                handleSearch();
              }
            }}
            className="flex-1 pl-2 pr-4 py-3 focus:outline-none"
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-medium rounded-r-lg hover:shadow-lg transition-all duration-300"
          >
            Search
          </button>
        </div>


        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <div className="space-y-1">
                  {filterOptions.jobTypes.map((type) => (
                    <label key={type.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <div className="space-y-1">
                  {filterOptions.experienceLevels.map((level) => (
                    <label key={level.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Remote Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Style</label>
                <div className="space-y-1">
                  {filterOptions.remoteOptions.map((option) => (
                    <label key={option.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="30000"
                    max="200000"
                    step="5000"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>$30K</span>
                    <span>$200K+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Opportunities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Saved Opportunities</h3>
        </div>
        
        {isLoadingBookmarks ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-gray-600">Loading saved opportunities...</span>
          </div>
        ) : bookmarkError ? (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-gray-500 text-center mb-2">
              We couldn't load your saved opportunities right now.
            </p>
            <button
              onClick={() => fetchBookmarkedOpportunities()}
              className="px-3 py-1 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm"
            >
              Retry
            </button>
          </div>
        ) : bookmarkedOpportunities && bookmarkedOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {bookmarkedOpportunities.slice(0, 6).map((job) => (
              <div 
                key={job.id} 
                className="border border-gray-200 rounded-lg p-3 text-center"
                onClick={() => onViewDetails(job.id)}
              >
                <p className="text-gray-800 truncate cursor-pointer">
                  {job.title}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <p>We couldn't load your saved opportunities right now.</p>
            <button
              onClick={() => fetchBookmarkedOpportunities()}
              className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {opportunities?.length || 0} opportunities found
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target size={16} />
            <span>Avg match: {opportunities && opportunities.length > 0 ? Math.round(opportunities.reduce((acc, job) => acc + job.match_score, 0) / opportunities.length) : 0}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="match_score">Sort by: Match Score</option>
            <option value="date">Sort by: Date Posted</option>
            <option value="salary">Sort by: Salary</option>
          </select>

          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Building size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
            >
              <Briefcase size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Star className="text-yellow-500" size={16} />
            <span className="text-sm text-gray-600">High Match</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {opportunities?.filter(job => job.match_score >= 90).length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="text-green-500" size={16} />
            <span className="text-sm text-gray-600">Remote</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {opportunities?.filter(job => job.remote_option).length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="text-orange-500" size={16} />
            <span className="text-sm text-gray-600">Urgent</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {opportunities?.filter(job => job.hiring_urgency === 'Urgent').length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="text-blue-500" size={16} />
            <span className="text-sm text-gray-600">High Salary</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {opportunities?.filter(job => job.salary_range[1] >= 100000).length || 0}
          </p>
        </div>
      </div> */}

      {/* Opportunities Grid */}
      <div className={`
        ${viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-4'
        }
      `}>
        {isLoadingOpportunities ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading opportunities...</span>
          </div>
        ) : opportunityError ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="bg-red-50 rounded-full p-4 mb-4">
              <Briefcase className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Opportunities Found</h3>
            <p className="text-gray-500 text-center max-w-sm mb-4">
              We couldn't load your opportunities right now.
            </p>
            <button
              onClick={() => fetchOpportunityMatches()}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
            >
              Refresh
            </button>
          </div>
        ) : sortedOpportunities.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="bg-yellow-50 rounded-full p-4 mb-4">
              <Search className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasSearched ? `No results found for "${searchQuery}"` : "No opportunities match your current filters"}
            </h3>
            <p className="text-gray-500 text-center max-w-sm mb-4">
              {hasSearched ? "Try different keywords or remove some filters" : "Try adjusting your filters to see more opportunities"}
            </p>
            {hasSearched && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          sortedOpportunities.slice(0, visibleCount).map((job) => (
            <div key={job.id} className={viewMode === 'list' ? 'max-w-none' : ''}>
              <CompactOpportunityCard
                opportunity={job}
                onApply={onApply}
                onSave={onSave}
                onViewDetails={onViewDetails} 
                opportunityMatches={opportunityMatches || []} 
              />
            </div>
          ))
        )}
      </div>

      {/* Load More or Show Less */}
      {!isLoadingOpportunities && !opportunityError && sortedOpportunities.length > 0 && (
        <div className="text-center">
          {visibleCount < sortedOpportunities.length ? (
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Load more opportunities
            </button>
          ) : isExpanded && (
            <button
              onClick={handleShowLess}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Show less Opportunities
            </button>
          )}
        </div>
      )}
    </div>
  );
}