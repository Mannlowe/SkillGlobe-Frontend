'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAccessibilityContext } from './AccessibilityProvider';
import { cn } from '@/lib/utils';

// Landmark types for navigation
export interface Landmark {
  id: string;
  label: string;
  role: string;
  element?: HTMLElement;
  level?: number;
}

// Hook for landmark management
export function useLandmarkNavigation() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [currentLandmark, setCurrentLandmark] = useState<string | null>(null);
  const { announcePolite } = useAccessibilityContext();

  useEffect(() => {
    const discoverLandmarks = () => {
      const landmarkElements = document.querySelectorAll(
        '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"], main, nav, header, footer, aside, section[aria-labelledby], section[aria-label]'
      );

      const discovered: Landmark[] = [];

      landmarkElements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        const role = element.getAttribute('role') || 
                    (element.tagName.toLowerCase() === 'main' ? 'main' :
                     element.tagName.toLowerCase() === 'nav' ? 'navigation' :
                     element.tagName.toLowerCase() === 'header' ? 'banner' :
                     element.tagName.toLowerCase() === 'footer' ? 'contentinfo' :
                     element.tagName.toLowerCase() === 'aside' ? 'complementary' :
                     'region');

        const label = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     (element.querySelector('h1, h2, h3, h4, h5, h6')?.textContent) ||
                     `${role} ${index + 1}`;

        discovered.push({
          id: element.id || `landmark-${index}`,
          label: label.substring(0, 50),
          role,
          element: htmlElement
        });
      });

      setLandmarks(discovered);
    };

    // Initial discovery
    discoverLandmarks();

    // Re-discover on DOM changes
    const observer = new MutationObserver(discoverLandmarks);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['role', 'aria-label', 'aria-labelledby']
    });

    return () => observer.disconnect();
  }, []);

  const navigateToLandmark = (landmarkId: string) => {
    const landmark = landmarks.find(l => l.id === landmarkId);
    if (!landmark?.element) return;

    landmark.element.focus();
    landmark.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCurrentLandmark(landmarkId);
    announcePolite(`Navigated to ${landmark.label}`);
  };

  const nextLandmark = () => {
    const currentIndex = landmarks.findIndex(l => l.id === currentLandmark);
    const nextIndex = currentIndex < landmarks.length - 1 ? currentIndex + 1 : 0;
    navigateToLandmark(landmarks[nextIndex].id);
  };

  const previousLandmark = () => {
    const currentIndex = landmarks.findIndex(l => l.id === currentLandmark);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : landmarks.length - 1;
    navigateToLandmark(landmarks[prevIndex].id);
  };

  return {
    landmarks,
    currentLandmark,
    navigateToLandmark,
    nextLandmark,
    previousLandmark
  };
}

// Landmark Navigation Panel
interface LandmarkNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LandmarkNavigation({ isOpen, onClose }: LandmarkNavigationProps) {
  const { landmarks, currentLandmark, navigateToLandmark } = useLandmarkNavigation();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          const currentIndex = landmarks.findIndex(l => l.id === currentLandmark);
          const nextIndex = currentIndex < landmarks.length - 1 ? currentIndex + 1 : 0;
          navigateToLandmark(landmarks[nextIndex].id);
          break;
        case 'ArrowUp':
          e.preventDefault();
          const currentIdx = landmarks.findIndex(l => l.id === currentLandmark);
          const prevIndex = currentIdx > 0 ? currentIdx - 1 : landmarks.length - 1;
          navigateToLandmark(landmarks[prevIndex].id);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, landmarks, currentLandmark, navigateToLandmark, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 w-80 max-h-96 overflow-y-auto"
        role="dialog"
        aria-labelledby="landmark-nav-title"
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="landmark-nav-title" className="text-lg font-semibold text-gray-900">
            Page Landmarks
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md p-1"
            aria-label="Close landmark navigation"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          {landmarks.length === 0 ? (
            <p className="text-gray-500 text-sm">No landmarks found on this page</p>
          ) : (
            landmarks.map((landmark) => (
              <button
                key={landmark.id}
                onClick={() => {
                  navigateToLandmark(landmark.id);
                  onClose();
                }}
                className={cn(
                  "w-full text-left p-3 rounded-md transition-colors",
                  "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500",
                  currentLandmark === landmark.id && "bg-orange-100 border-l-4 border-orange-500"
                )}
                aria-pressed={currentLandmark === landmark.id}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    landmark.role === 'main' ? "bg-blue-500" :
                    landmark.role === 'navigation' ? "bg-green-500" :
                    landmark.role === 'banner' ? "bg-purple-500" :
                    landmark.role === 'contentinfo' ? "bg-red-500" :
                    landmark.role === 'complementary' ? "bg-yellow-500" :
                    "bg-gray-500"
                  )} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {landmark.label}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {landmark.role}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <p><kbd className="bg-gray-100 px-1 rounded">↑↓</kbd> Navigate landmarks</p>
            <p><kbd className="bg-gray-100 px-1 rounded">Enter</kbd> Go to landmark</p>
            <p><kbd className="bg-gray-100 px-1 rounded">Esc</kbd> Close panel</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Landmark Quick Access Component
export function LandmarkQuickAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const { landmarks, navigateToLandmark } = useLandmarkNavigation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + L to open landmark navigation
      if (e.altKey && e.key === 'l') {
        e.preventDefault();
        setIsOpen(true);
      }

      // Alt + M to go to main content
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const mainLandmark = landmarks.find(l => l.role === 'main');
        if (mainLandmark) {
          navigateToLandmark(mainLandmark.id);
        }
      }

      // Alt + N to go to navigation
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        const navLandmark = landmarks.find(l => l.role === 'navigation');
        if (navLandmark) {
          navigateToLandmark(navLandmark.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [landmarks, navigateToLandmark]);

  return (
    <>
      {/* Quick access button (hidden by default, visible on focus) */}
      <button
        onClick={() => setIsOpen(true)}
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-50 bg-orange-500 text-white px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-600"
        aria-label="Open landmark navigation (Alt+L)"
      >
        Landmarks (Alt+L)
      </button>

      <LandmarkNavigation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

// Enhanced Skip Links with more options
export function EnhancedSkipLinks() {
  const { landmarks } = useLandmarkNavigation();

  return (
    <div className="sr-only focus-within:not-sr-only">
      {/* Traditional skip links */}
      <a
        href="#main-content"
        className="absolute top-0 left-0 z-50 p-4 bg-orange-500 text-white font-medium focus:block transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        Skip to main content
      </a>
      
      <a
        href="#main-navigation"
        className="absolute top-0 left-32 z-50 p-4 bg-orange-500 text-white font-medium focus:block transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        Skip to navigation
      </a>

      {/* Dynamic skip links based on landmarks */}
      {landmarks.slice(0, 3).map((landmark, index) => (
        <a
          key={landmark.id}
          href={`#${landmark.id}`}
          className={cn(
            "absolute top-0 z-50 p-4 bg-orange-500 text-white font-medium focus:block",
            "transform -translate-y-full focus:translate-y-0 transition-transform"
          )}
          style={{ left: `${64 + (index * 32)}px` }}
        >
          Skip to {landmark.label}
        </a>
      ))}
    </div>
  );
}

// Heading Navigation (H1-H6)
export function useHeadingNavigation() {
  const [headings, setHeadings] = useState<Array<{
    id: string;
    text: string;
    level: number;
    element: HTMLElement;
  }>>([]);

  useEffect(() => {
    const discoverHeadings = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const discovered = Array.from(headingElements).map((element, index) => {
        const htmlElement = element as HTMLElement;
        const level = parseInt(element.tagName.charAt(1));
        
        // Ensure heading has an ID
        if (!element.id) {
          element.id = `heading-${level}-${index}`;
        }

        return {
          id: element.id,
          text: element.textContent?.substring(0, 50) || `Heading ${level}`,
          level,
          element: htmlElement
        };
      });

      setHeadings(discovered);
    };

    discoverHeadings();

    const observer = new MutationObserver(discoverHeadings);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  const navigateToHeading = (headingId: string) => {
    const heading = headings.find(h => h.id === headingId);
    if (heading) {
      heading.element.focus();
      heading.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return { headings, navigateToHeading };
}