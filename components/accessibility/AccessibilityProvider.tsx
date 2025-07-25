'use client';

import React, { createContext, useContext } from 'react';
import { useAccessibility, useKeyboardNavigation, useLiveRegion, useColorContrast } from '@/hooks/useAccessibility';

interface AccessibilityContextType {
  isReducedMotion: boolean;
  isHighContrast: boolean;
  fontSize: string;
  announceToScreenReader: (message: string) => void;
  updateFontSize: (size: 'small' | 'medium' | 'large' | 'extra-large') => void;
  screenReaderAnnouncement: string;
  focusVisible: boolean;
  politeMessage: string;
  assertiveMessage: string;
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
  contrastMode: 'normal' | 'high';
  toggleContrastMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const accessibility = useAccessibility();
  const keyboard = useKeyboardNavigation();
  const liveRegion = useLiveRegion();
  const colorContrast = useColorContrast();

  const value: AccessibilityContextType = {
    ...accessibility,
    ...keyboard,
    ...liveRegion,
    ...colorContrast
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      
      {/* Screen Reader Announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {accessibility.screenReaderAnnouncement}
      </div>
      
      {/* Live Region for Polite Announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveRegion.politeMessage}
      </div>
      
      {/* Live Region for Assertive Announcements */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {liveRegion.assertiveMessage}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider');
  }
  return context;
}

// Skip Links Component
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-0 left-0 z-50 p-4 bg-orange-500 text-white font-medium focus:block"
      >
        Skip to main content
      </a>
      <a
        href="#main-navigation"
        className="absolute top-0 left-20 z-50 p-4 bg-orange-500 text-white font-medium focus:block"
      >
        Skip to navigation
      </a>
    </div>
  );
}

// Accessibility Settings Panel
export function AccessibilitySettings() {
  const {
    fontSize,
    updateFontSize,
    contrastMode,
    toggleContrastMode,
    announcePolite
  } = useAccessibilityContext();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Accessibility Settings</h2>
      
      {/* Font Size */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Font Size</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'extra-large', label: 'Extra Large' }
          ].map((size) => (
            <button
              key={size.value}
              onClick={() => {
                updateFontSize(size.value as any);
                announcePolite(`Font size changed to ${size.label}`);
              }}
              className={`
                px-3 py-2 text-sm border rounded-md transition-colors
                ${fontSize === size.value
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }
              `}
              aria-pressed={fontSize === size.value}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contrast Mode */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Contrast</h3>
        <button
          onClick={() => {
            toggleContrastMode();
            announcePolite(`Switched to ${contrastMode === 'normal' ? 'high' : 'normal'} contrast mode`);
          }}
          className={`
            px-4 py-2 text-sm border rounded-md transition-colors
            ${contrastMode === 'high'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }
          `}
          aria-pressed={contrastMode === 'high'}
        >
          {contrastMode === 'high' ? 'High Contrast On' : 'Enable High Contrast'}
        </button>
      </div>

      {/* Keyboard Navigation Help */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Keyboard Navigation</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><kbd className="bg-gray-100 px-1 rounded">Tab</kbd> - Navigate forward</p>
          <p><kbd className="bg-gray-100 px-1 rounded">Shift + Tab</kbd> - Navigate backward</p>
          <p><kbd className="bg-gray-100 px-1 rounded">Enter</kbd> or <kbd className="bg-gray-100 px-1 rounded">Space</kbd> - Activate button</p>
          <p><kbd className="bg-gray-100 px-1 rounded">Escape</kbd> - Close dialog</p>
          <p><kbd className="bg-gray-100 px-1 rounded">Ctrl + /</kbd> - Open search</p>
        </div>
      </div>
    </div>
  );
}