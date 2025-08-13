'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Modal {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

interface LoadingState {
  [key: string]: boolean;
}

interface UIState {
  // Theme and layout
  theme: 'light' | 'dark' | 'system';
  layout: 'modern' | 'classic';
  sidebarCollapsed: boolean;
  compactMode: boolean;
  
  // Global UI state
  isGlobalSearchOpen: boolean;
  isCommandPaletteOpen: boolean;
  isMobileMenuOpen: boolean;
  
  // Loading states
  loadingStates: LoadingState;
  
  // Notifications and feedback
  toasts: ToastNotification[];
  modals: Modal[];
  
  // User preferences
  enableAnimations: boolean;
  enableSounds: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  
  // Recent activity
  recentSearches: string[];
  recentlyViewed: Array<{
    id: string;
    type: 'opportunity' | 'profile' | 'skill';
    title: string;
    url: string;
    timestamp: string;
  }>;
  
  // Actions
  // Theme and layout
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLayout: (layout: 'modern' | 'classic') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCompactMode: (compact: boolean) => void;
  
  // Global UI
  openGlobalSearch: () => void;
  closeGlobalSearch: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  // Loading states
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;
  
  // Toast notifications
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  
  // Modals
  openModal: (modal: Omit<Modal, 'id'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Preferences
  setPreferences: (preferences: Partial<Pick<UIState, 'enableAnimations' | 'enableSounds' | 'reducedMotion' | 'highContrast'>>) => void;
  
  // Recent activity
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  addRecentlyViewed: (item: Omit<UIState['recentlyViewed'][0], 'timestamp'>) => void;
  clearRecentlyViewed: () => void;
  
  // Computed getters
  getActiveToasts: () => ToastNotification[];
  getActiveModals: () => Modal[];
  getCurrentTheme: () => 'light' | 'dark';
}

export const useUIStore = create<UIState>()(
  persist(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial state
        theme: 'system',
        layout: 'modern',
        sidebarCollapsed: false,
        compactMode: false,
        
        isGlobalSearchOpen: false,
        isCommandPaletteOpen: false,
        isMobileMenuOpen: false,
        
        loadingStates: {},
        
        toasts: [],
        modals: [],
        
        enableAnimations: true,
        enableSounds: false,
        reducedMotion: false,
        highContrast: false,
        
        recentSearches: [],
        recentlyViewed: [],
        
        // Actions
        setTheme: (theme) => {
          set((state) => {
            state.theme = theme;
          });
        },
        
        setLayout: (layout) => {
          set((state) => {
            state.layout = layout;
          });
        },
        
        toggleSidebar: () => {
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          });
        },
        
        setSidebarCollapsed: (collapsed) => {
          set((state) => {
            state.sidebarCollapsed = collapsed;
          });
        },
        
        setCompactMode: (compact) => {
          set((state) => {
            state.compactMode = compact;
          });
        },
        
        // Global UI
        openGlobalSearch: () => {
          set((state) => {
            state.isGlobalSearchOpen = true;
            state.isCommandPaletteOpen = false; // Close command palette if open
          });
        },
        
        closeGlobalSearch: () => {
          set((state) => {
            state.isGlobalSearchOpen = false;
          });
        },
        
        openCommandPalette: () => {
          set((state) => {
            state.isCommandPaletteOpen = true;
            state.isGlobalSearchOpen = false; // Close search if open
          });
        },
        
        closeCommandPalette: () => {
          set((state) => {
            state.isCommandPaletteOpen = false;
          });
        },
        
        toggleMobileMenu: () => {
          set((state) => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen;
          });
        },
        
        closeMobileMenu: () => {
          set((state) => {
            state.isMobileMenuOpen = false;
          });
        },
        
        // Loading states
        setLoading: (key, loading) => {
          set((state) => {
            if (loading) {
              state.loadingStates[key] = true;
            } else {
              delete state.loadingStates[key];
            }
          });
        },
        
        isLoading: (key) => {
          return Boolean(get().loadingStates[key]);
        },
        
        // Toast notifications
        showToast: (toastData) => {
          const toast: ToastNotification = {
            ...toastData,
            id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            duration: toastData.duration || 5000
          };
          
          set((state) => {
            state.toasts.push(toast);
          });
          
          // Auto-hide toast after duration
          if (toast.duration > 0) {
            setTimeout(() => {
              get().hideToast(toast.id);
            }, toast.duration);
          }
        },
        
        hideToast: (id) => {
          set((state) => {
            state.toasts = state.toasts.filter(toast => toast.id !== id);
          });
        },
        
        clearToasts: () => {
          set((state) => {
            state.toasts = [];
          });
        },
        
        // Modals
        openModal: (modalData) => {
          const modal: Modal = {
            ...modalData,
            id: `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            size: modalData.size || 'md',
            closable: modalData.closable !== false
          };
          
          set((state) => {
            state.modals.push(modal);
          });
        },
        
        closeModal: (id) => {
          set((state) => {
            state.modals = state.modals.filter(modal => modal.id !== id);
          });
        },
        
        closeAllModals: () => {
          set((state) => {
            state.modals = [];
          });
        },
        
        // Preferences
        setPreferences: (preferences) => {
          set((state) => {
            Object.assign(state, preferences);
          });
        },
        
        // Recent activity
        addRecentSearch: (query) => {
          if (!query.trim()) return;
          
          set((state) => {
            // Remove if already exists
            state.recentSearches = state.recentSearches.filter(search => search !== query);
            // Add to beginning
            state.recentSearches.unshift(query);
            // Keep only last 10
            state.recentSearches = state.recentSearches.slice(0, 10);
          });
        },
        
        clearRecentSearches: () => {
          set((state) => {
            state.recentSearches = [];
          });
        },
        
        addRecentlyViewed: (item) => {
          const viewedItem = {
            ...item,
            timestamp: new Date().toISOString()
          };
          
          set((state) => {
            // Remove if already exists
            state.recentlyViewed = state.recentlyViewed.filter(viewed => 
              !(viewed.type === item.type && viewed.id === item.id)
            );
            // Add to beginning
            state.recentlyViewed.unshift(viewedItem);
            // Keep only last 20
            state.recentlyViewed = state.recentlyViewed.slice(0, 20);
          });
        },
        
        clearRecentlyViewed: () => {
          set((state) => {
            state.recentlyViewed = [];
          });
        },
        
        // Computed getters
        getActiveToasts: () => {
          return get().toasts;
        },
        
        getActiveModals: () => {
          return get().modals;
        },
        
        getCurrentTheme: () => {
          const theme = get().theme;
          
          if (theme === 'system') {
            // Check system preference
            if (typeof window !== 'undefined') {
              return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            return 'light';
          }
          
          return theme;
        }
      }))
    ),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        layout: state.layout,
        sidebarCollapsed: state.sidebarCollapsed,
        compactMode: state.compactMode,
        enableAnimations: state.enableAnimations,
        enableSounds: state.enableSounds,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
        recentSearches: state.recentSearches,
        recentlyViewed: state.recentlyViewed
      })
    }
  )
);

// Selectors for performance
export const useTheme = () => useUIStore(state => state.getCurrentTheme());
export const useLayout = () => useUIStore(state => state.layout);
export const useSidebar = () => useUIStore(state => ({
  collapsed: state.sidebarCollapsed,
  toggle: state.toggleSidebar,
  setCollapsed: state.setSidebarCollapsed
}));

export const useGlobalSearch = () => useUIStore(state => ({
  isOpen: state.isGlobalSearchOpen,
  open: state.openGlobalSearch,
  close: state.closeGlobalSearch
}));

export const useToasts = () => useUIStore(state => ({
  toasts: state.toasts,
  showToast: state.showToast,
  hideToast: state.hideToast,
  clearToasts: state.clearToasts
}));

export const useModals = () => useUIStore(state => ({
  modals: state.modals,
  openModal: state.openModal,
  closeModal: state.closeModal,
  closeAllModals: state.closeAllModals
}));

export const useRecentActivity = () => useUIStore(state => ({
  recentSearches: state.recentSearches,
  recentlyViewed: state.recentlyViewed,
  addRecentSearch: state.addRecentSearch,
  addRecentlyViewed: state.addRecentlyViewed
}));

export const useLoadingState = () => useUIStore(state => ({
  setLoading: state.setLoading,
  isLoading: state.isLoading
}));

// Initialize UI store
export const initializeUIStore = () => {
  const store = useUIStore.getState();
  
  // Set up system theme listener
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => {
      // Force re-render when system theme changes
      if (store.theme === 'system') {
        store.setTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleThemeChange);
    
    // Set up reduced motion listener
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = () => {
      store.setPreferences({ reducedMotion: reducedMotionQuery.matches });
    };
    
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    handleReducedMotionChange(); // Set initial value
    
    // Clean up listeners
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }
};