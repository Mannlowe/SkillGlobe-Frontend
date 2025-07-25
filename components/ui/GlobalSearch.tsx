'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, User, Target, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { dataService } from '@/lib/dataService';

interface SearchResult {
  id: string;
  type: 'opportunity' | 'skill' | 'profile' | 'message' | 'page';
  title: string;
  description?: string;
  url: string;
  category?: string;
  metadata?: {
    company?: string;
    location?: string;
    salary?: string;
    matchScore?: number;
  };
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'React developer jobs',
    'Frontend opportunities',
    'Skills assessment'
  ]);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Search function using dataService (API/mock hybrid)
  const performSearch = useCallback(async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return [];

    try {
      const searchResults = await dataService.globalSearch(searchQuery);
      const results: SearchResult[] = [];

      // Convert opportunities to search results
      searchResults.opportunities.forEach(opp => {
        results.push({
          id: opp.id,
          type: 'opportunity',
          title: opp.title,
          description: `${opp.company} • ${opp.location}`,
          url: `/opportunities/${opp.id}`,
          category: 'Jobs',
          metadata: {
            company: opp.company,
            location: opp.location,
            salary: opp.salary,
            matchScore: opp.match_percentage
          }
        });
      });

      // Convert skills to search results
      searchResults.skills.forEach(skill => {
        results.push({
          id: skill.name,
          type: 'skill',
          title: skill.name,
          description: `${skill.level} level`,
          url: `/skills?highlight=${encodeURIComponent(skill.name)}`,
          category: 'Skills'
        });
      });

      // Convert pages to search results
      searchResults.pages.forEach(page => {
        results.push({
          id: page.path,
          type: 'page',
          title: page.name,
          description: 'Navigate to page',
          url: page.path,
          category: 'Pages'
        });
      });

      return results;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      const searchResults = await performSearch(query);
      setResults(searchResults);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches(prev => {
      const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 5);
      return newSearches;
    });

    router.push(result.url);
    onClose();
    setQuery('');
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'opportunity':
        return <Target className="w-4 h-4 text-blue-600" />;
      case 'skill':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'profile':
        return <User className="w-4 h-4 text-purple-600" />;
      case 'message':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'page':
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return <Search className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search opportunities, skills, pages..."
            className="flex-1 outline-none text-lg"
            id="global-search"
          />
          <button
            onClick={onClose}
            className="ml-3 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : query.trim() && results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No results found for "{query}"</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={cn(
                    "px-4 py-3 cursor-pointer transition-colors flex items-start space-x-3",
                    index === selectedIndex ? "bg-blue-50" : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getResultIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {result.title}
                      </h3>
                      {result.type === 'opportunity' && result.metadata?.matchScore && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          {result.metadata.matchScore}% match
                        </span>
                      )}
                    </div>
                    {result.description && (
                      <p className="text-sm text-gray-600 truncate mt-0.5">
                        {result.description}
                      </p>
                    )}
                    {result.metadata && (
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        {result.metadata.company && <span>{result.metadata.company}</span>}
                        {result.metadata.location && <span>• {result.metadata.location}</span>}
                        {result.metadata.salary && <span>• {result.metadata.salary}</span>}
                      </div>
                    )}
                    {result.category && (
                      <span className="inline-block mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {result.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : !query.trim() && recentSearches.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Recent Searches
              </div>
              {recentSearches.map((recentQuery, index) => (
                <div
                  key={index}
                  onClick={() => handleRecentSearchClick(recentQuery)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{recentQuery}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
          <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
          <span>Ctrl+/ to open search</span>
        </div>
      </div>
    </div>
  );
}