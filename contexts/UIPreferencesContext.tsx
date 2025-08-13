'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UILayoutType = 'modern' | 'classic';

export interface UIPreferences {
  layout: UILayoutType;
  sidebarPosition: 'left' | 'top';
  enableContextualActions: boolean;
  enableKeyboardShortcuts: boolean;
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
}

interface UIPreferencesContextType {
  preferences: UIPreferences;
  updatePreference: <K extends keyof UIPreferences>(key: K, value: UIPreferences[K]) => void;
  toggleLayout: () => void;
  resetToDefaults: () => void;
  isModernLayout: boolean;
}

const defaultPreferences: UIPreferences = {
  layout: 'modern',
  sidebarPosition: 'left',
  enableContextualActions: true,
  enableKeyboardShortcuts: true,
  theme: 'light',
  compactMode: false
};

const UIPreferencesContext = createContext<UIPreferencesContextType | undefined>(undefined);

export function UIPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UIPreferences>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('skillglobe-ui-preferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.warn('Failed to parse UI preferences from localStorage');
      }
    }

    // Check URL parameter for layout override
    const urlParams = new URLSearchParams(window.location.search);
    const layoutParam = urlParams.get('ui') as UILayoutType;
    if (layoutParam && ['modern', 'classic'].includes(layoutParam)) {
      setPreferences(prev => ({ ...prev, layout: layoutParam }));
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('skillglobe-ui-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof UIPreferences>(
    key: K, 
    value: UIPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleLayout = () => {
    setPreferences(prev => ({
      ...prev,
      layout: prev.layout === 'modern' ? 'classic' : 'modern'
    }));
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('skillglobe-ui-preferences');
  };

  const isModernLayout = preferences.layout === 'modern';

  const value: UIPreferencesContextType = {
    preferences,
    updatePreference,
    toggleLayout,
    resetToDefaults,
    isModernLayout
  };

  return (
    <UIPreferencesContext.Provider value={value}>
      {children}
    </UIPreferencesContext.Provider>
  );
}

export function useUIPreferences() {
  const context = useContext(UIPreferencesContext);
  if (context === undefined) {
    throw new Error('useUIPreferences must be used within a UIPreferencesProvider');
  }
  return context;
}