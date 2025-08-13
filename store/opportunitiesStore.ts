'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { dataService } from '@/lib/dataService';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  match_percentage?: number;
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
  posted_date: string;
  application_deadline?: string;
  saved: boolean;
  applied: boolean;
  viewed: boolean;
}

interface OpportunityFilters {
  search?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  remote?: boolean;
  job_type?: string[];
  experience_level?: string[];
  company_size?: string[];
}

interface OpportunitiesState {
  // Data
  opportunities: Opportunity[];
  savedOpportunities: Opportunity[];
  appliedOpportunities: Opportunity[];
  filters: OpportunityFilters;
  searchQuery: string;
  
  // UI State
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasNextPage: boolean;
  currentPage: number;
  selectedOpportunityId: string | null;
  
  // View preferences
  viewMode: 'grid' | 'list';
  sortBy: 'relevance' | 'date' | 'salary' | 'match';
  sortOrder: 'asc' | 'desc';
  
  // Actions
  fetchOpportunities: (filters?: OpportunityFilters) => Promise<void>;
  loadMoreOpportunities: () => Promise<void>;
  searchOpportunities: (query: string) => Promise<void>;
  applyFilters: (filters: OpportunityFilters) => Promise<void>;
  clearFilters: () => void;
  
  // Individual opportunity actions
  saveOpportunity: (id: string) => Promise<void>;
  unsaveOpportunity: (id: string) => Promise<void>;
  applyToOpportunity: (id: string, application: any) => Promise<void>;
  markAsViewed: (id: string) => void;
  
  // Bulk actions
  bulkSave: (ids: string[]) => Promise<void>;
  bulkApply: (ids: string[], application: any) => Promise<void>;
  bulkHide: (ids: string[]) => Promise<void>;
  
  // UI actions
  setSelectedOpportunity: (id: string | null) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  
  // Computed getters
  getFilteredOpportunities: () => Opportunity[];
  getSavedOpportunityIds: () => string[];
  getAppliedOpportunityIds: () => string[];
  getMatchingOpportunities: (minMatch: number) => Opportunity[];
}

export const useOpportunitiesStore = create<OpportunitiesState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      opportunities: [],
      savedOpportunities: [],
      appliedOpportunities: [],
      filters: {},
      searchQuery: '',
      
      isLoading: false,
      isLoadingMore: false,
      error: null,
      hasNextPage: true,
      currentPage: 1,
      selectedOpportunityId: null,
      
      viewMode: 'grid',
      sortBy: 'relevance',
      sortOrder: 'desc',
      
      // Actions
      fetchOpportunities: async (filters) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
          state.currentPage = 1;
          if (filters) state.filters = filters;
        });
        
        try {
          const params = {
            page: 1,
            limit: 20,
            ...get().filters,
            ...filters
          };
          
          const opportunities = await dataService.getOpportunities(params);
          
          set((state) => {
            state.opportunities = opportunities.map(opp => ({
              ...opp,
              saved: false,
              applied: false,
              viewed: false
            }));
            state.isLoading = false;
            state.hasNextPage = opportunities.length === 20;
          });
        } catch (error: any) {
          set((state) => {
            state.isLoading = false;
            state.error = error.message || 'Failed to fetch opportunities';
          });
        }
      },
      
      loadMoreOpportunities: async () => {
        if (get().isLoadingMore || !get().hasNextPage) return;
        
        set((state) => {
          state.isLoadingMore = true;
        });
        
        try {
          const nextPage = get().currentPage + 1;
          const params = {
            page: nextPage,
            limit: 20,
            ...get().filters
          };
          
          const newOpportunities = await dataService.getOpportunities(params);
          
          set((state) => {
            state.opportunities.push(...newOpportunities.map(opp => ({
              ...opp,
              saved: false,
              applied: false,
              viewed: false
            })));
            state.isLoadingMore = false;
            state.currentPage = nextPage;
            state.hasNextPage = newOpportunities.length === 20;
          });
        } catch (error: any) {
          set((state) => {
            state.isLoadingMore = false;
            state.error = error.message || 'Failed to load more opportunities';
          });
        }
      },
      
      searchOpportunities: async (query) => {
        set((state) => {
          state.searchQuery = query;
          state.filters.search = query;
        });
        
        await get().fetchOpportunities();
      },
      
      applyFilters: async (filters) => {
        await get().fetchOpportunities(filters);
      },
      
      clearFilters: () => {
        set((state) => {
          state.filters = {};
          state.searchQuery = '';
        });
        get().fetchOpportunities();
      },
      
      // Individual opportunity actions
      saveOpportunity: async (id) => {
        set((state) => {
          const opportunity = state.opportunities.find(opp => opp.id === id);
          if (opportunity) {
            opportunity.saved = true;
            state.savedOpportunities.push(opportunity);
          }
        });
        
        // TODO: Call API to save opportunity
        console.log('Saving opportunity:', id);
      },
      
      unsaveOpportunity: async (id) => {
        set((state) => {
          const opportunity = state.opportunities.find(opp => opp.id === id);
          if (opportunity) {
            opportunity.saved = false;
          }
          state.savedOpportunities = state.savedOpportunities.filter(opp => opp.id !== id);
        });
        
        // TODO: Call API to unsave opportunity
        console.log('Unsaving opportunity:', id);
      },
      
      applyToOpportunity: async (id, application) => {
        set((state) => {
          const opportunity = state.opportunities.find(opp => opp.id === id);
          if (opportunity) {
            opportunity.applied = true;
            state.appliedOpportunities.push(opportunity);
          }
        });
        
        try {
          await dataService.applyToOpportunity(id, application);
          console.log('Applied to opportunity:', id);
        } catch (error: any) {
          // Revert on error
          set((state) => {
            const opportunity = state.opportunities.find(opp => opp.id === id);
            if (opportunity) {
              opportunity.applied = false;
            }
            state.appliedOpportunities = state.appliedOpportunities.filter(opp => opp.id !== id);
          });
          throw error;
        }
      },
      
      markAsViewed: (id) => {
        set((state) => {
          const opportunity = state.opportunities.find(opp => opp.id === id);
          if (opportunity) {
            opportunity.viewed = true;
          }
        });
      },
      
      // Bulk actions
      bulkSave: async (ids) => {
        for (const id of ids) {
          await get().saveOpportunity(id);
        }
      },
      
      bulkApply: async (ids, application) => {
        for (const id of ids) {
          try {
            await get().applyToOpportunity(id, application);
          } catch (error) {
            console.error(`Failed to apply to opportunity ${id}:`, error);
          }
        }
      },
      
      bulkHide: async (ids) => {
        set((state) => {
          state.opportunities = state.opportunities.filter(opp => !ids.includes(opp.id));
        });
      },
      
      // UI actions
      setSelectedOpportunity: (id) => {
        set((state) => {
          state.selectedOpportunityId = id;
        });
        
        if (id) {
          get().markAsViewed(id);
        }
      },
      
      setViewMode: (mode) => {
        set((state) => {
          state.viewMode = mode;
        });
      },
      
      setSorting: (sortBy, sortOrder) => {
        set((state) => {
          state.sortBy = sortBy as any;
          state.sortOrder = sortOrder;
        });
        
        // Re-sort opportunities
        set((state) => {
          state.opportunities.sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (sortBy) {
              case 'date':
                aValue = new Date(a.posted_date);
                bValue = new Date(b.posted_date);
                break;
              case 'salary':
                aValue = a.salary ? parseInt(a.salary.replace(/\D/g, '')) : 0;
                bValue = b.salary ? parseInt(b.salary.replace(/\D/g, '')) : 0;
                break;
              case 'match':
                aValue = a.match_percentage || 0;
                bValue = b.match_percentage || 0;
                break;
              default:
                return 0;
            }
            
            if (sortOrder === 'asc') {
              return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
              return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
          });
        });
      },
      
      // Computed getters
      getFilteredOpportunities: () => {
        const { opportunities, searchQuery } = get();
        
        if (!searchQuery) return opportunities;
        
        const query = searchQuery.toLowerCase();
        return opportunities.filter(opp => 
          opp.title.toLowerCase().includes(query) ||
          opp.company.toLowerCase().includes(query) ||
          opp.location.toLowerCase().includes(query) ||
          opp.description.toLowerCase().includes(query)
        );
      },
      
      getSavedOpportunityIds: () => {
        return get().savedOpportunities.map(opp => opp.id);
      },
      
      getAppliedOpportunityIds: () => {
        return get().appliedOpportunities.map(opp => opp.id);
      },
      
      getMatchingOpportunities: (minMatch) => {
        return get().opportunities.filter(opp => 
          (opp.match_percentage || 0) >= minMatch
        );
      }
    }))
  )
);

// Selectors for performance optimization
export const useOpportunities = () => useOpportunitiesStore(state => state.opportunities);
export const useOpportunityFilters = () => useOpportunitiesStore(state => state.filters);
export const useOpportunityLoading = () => useOpportunitiesStore(state => state.isLoading);
export const useSelectedOpportunity = () => useOpportunitiesStore(state => 
  state.opportunities.find(opp => opp.id === state.selectedOpportunityId)
);

// Computed selectors
export const useSavedOpportunities = () => useOpportunitiesStore(state => state.savedOpportunities);
export const useAppliedOpportunities = () => useOpportunitiesStore(state => state.appliedOpportunities);
export const useHighMatchOpportunities = () => useOpportunitiesStore(state => 
  state.getMatchingOpportunities(80)
);