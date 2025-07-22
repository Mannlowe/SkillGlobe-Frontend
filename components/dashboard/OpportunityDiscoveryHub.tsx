'use client';

import { useState } from 'react';
import { Search, Filter, Bookmark, Bell, MapPin, DollarSign, Clock, Briefcase, Building, Target, Zap, Star } from 'lucide-react';
import type { JobOpportunity } from '@/types/dashboard';
import type { OpportunitySearchFilters, SavedSearch } from '@/types/opportunities';
import CompactOpportunityCard from './CompactOpportunityCard';

interface OpportunityDiscoveryHubProps {
  opportunities: JobOpportunity[];
  savedSearches: SavedSearch[];
  onSearch: (filters: OpportunitySearchFilters) => void;
  onSaveSearch: (search: SavedSearch) => void;
  onApply: (jobId: string) => void;
  onSave: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
}

export default function OpportunityDiscoveryHub({ 
  opportunities, 
  savedSearches,
  onSearch, 
  onSaveSearch,
  onApply, 
  onSave, 
  onViewDetails 
}: OpportunityDiscoveryHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Partial<OpportunitySearchFilters>>({});
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'salary' | 'match_score'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const handleSearch = () => {
    const filters: Partial<OpportunitySearchFilters> = {
      keywords: searchQuery.split(' ').filter(k => k.length > 0),
      ...selectedFilters
    };
    onSearch(filters as OpportunitySearchFilters);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const sortedOpportunities = [...opportunities].sort((a, b) => {
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
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-orange-50 border-orange-200 text-orange-600' 
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Filter size={18} />
              Filters
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Search
            </button>
          </div>
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

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Saved Searches</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">Manage all</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {savedSearches.slice(0, 5).map((search) => (
              <button
                key={search.id}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bookmark size={14} className="text-gray-600" />
                <span className="text-sm text-gray-700">{search.name}</span>
                {search.new_results_count > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {search.new_results_count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {opportunities.length} opportunities found
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target size={16} />
            <span>Avg match: {Math.round(opportunities.reduce((acc, job) => acc + job.match_score, 0) / opportunities.length)}%</span>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Star className="text-yellow-500" size={16} />
            <span className="text-sm text-gray-600">High Match</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {opportunities.filter(job => job.match_score >= 90).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="text-green-500" size={16} />
            <span className="text-sm text-gray-600">Remote</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {opportunities.filter(job => job.remote_option).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="text-orange-500" size={16} />
            <span className="text-sm text-gray-600">Urgent</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {opportunities.filter(job => job.hiring_urgency === 'Urgent').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="text-blue-500" size={16} />
            <span className="text-sm text-gray-600">High Salary</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {opportunities.filter(job => job.salary_range[1] >= 100000).length}
          </p>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-4'
        }
      `}>
        {sortedOpportunities.map((job) => (
          <div key={job.id} className={viewMode === 'list' ? 'max-w-none' : ''}>
            <CompactOpportunityCard 
              opportunity={job}
              onApply={onApply}
              onSave={onSave}
              onViewDetails={onViewDetails}
            />
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Load more opportunities
        </button>
      </div>
    </div>
  );
}