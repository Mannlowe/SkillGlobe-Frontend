'use client';

import { useEffect, useState, useRef } from 'react';

// Hook for managing focus and accessibility states
export function useAccessibility() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');

  useEffect(() => {
    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(reducedMotionQuery.matches);
    
    const handleReducedMotionChange = () => setIsReducedMotion(reducedMotionQuery.matches);
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    // Check for high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(highContrastQuery.matches);
    
    const handleHighContrastChange = () => setIsHighContrast(highContrastQuery.matches);
    highContrastQuery.addEventListener('change', handleHighContrastChange);

    // Check for font size preference
    const fontSize = localStorage.getItem('skillglobe-font-size') || 'medium';
    setFontSize(fontSize);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  const announceToScreenReader = (message: string) => {
    setScreenReaderAnnouncement(message);
    // Clear after announcement
    setTimeout(() => setScreenReaderAnnouncement(''), 1000);
  };

  const updateFontSize = (size: 'small' | 'medium' | 'large' | 'extra-large') => {
    setFontSize(size);
    localStorage.setItem('skillglobe-font-size', size);
    
    // Apply to document
    const fontSizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    };
    
    document.documentElement.style.fontSize = fontSizeMap[size];
    announceToScreenReader(`Font size changed to ${size}`);
  };

  return {
    isReducedMotion,
    isHighContrast,
    fontSize,
    announceToScreenReader,
    updateFontSize,
    screenReaderAnnouncement
  };
}

// Hook for keyboard navigation
export function useKeyboardNavigation() {
  const [focusVisible, setFocusVisible] = useState(false);
  
  useEffect(() => {
    let hadKeyboardEvent = false;
    
    const handleKeyDown = () => {
      hadKeyboardEvent = true;
      setFocusVisible(true);
    };
    
    const handleMouseDown = () => {
      hadKeyboardEvent = false;
      setFocusVisible(false);
    };
    
    const handleFocus = () => {
      if (hadKeyboardEvent) {
        setFocusVisible(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('focus', handleFocus, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('focus', handleFocus, true);
    };
  }, []);

  return { focusVisible };
}

// Hook for managing skip links
export function useSkipLinks() {
  const skipLinksRef = useRef<HTMLDivElement>(null);
  
  const skipToContent = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  const skipToNavigation = () => {
    const navigation = document.getElementById('main-navigation');
    if (navigation) {
      navigation.focus();
      navigation.scrollIntoView();
    }
  };

  return {
    skipLinksRef,
    skipToContent,
    skipToNavigation
  };
}

// Hook for managing ARIA live regions
export function useLiveRegion() {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announcePolite = (message: string) => {
    setPoliteMessage(''); // Clear first to ensure announcement
    setTimeout(() => setPoliteMessage(message), 100);
  };

  const announceAssertive = (message: string) => {
    setAssertiveMessage(''); // Clear first to ensure announcement
    setTimeout(() => setAssertiveMessage(message), 100);
  };

  return {
    politeMessage,
    assertiveMessage,
    announcePolite,
    announceAssertive
  };
}

// Hook for focus management
export function useFocusManagement() {
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    lastFocusedElementRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    if (lastFocusedElementRef.current) {
      lastFocusedElementRef.current.focus();
    }
  };

  const trapFocus = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  };

  return {
    saveFocus,
    restoreFocus,
    trapFocus
  };
}

// Hook for color contrast checking
export function useColorContrast() {
  const [contrastMode, setContrastMode] = useState<'normal' | 'high'>('normal');

  useEffect(() => {
    const savedMode = localStorage.getItem('skillglobe-contrast-mode') as 'normal' | 'high';
    if (savedMode) {
      setContrastMode(savedMode);
      applyContrastMode(savedMode);
    }
  }, []);

  const applyContrastMode = (mode: 'normal' | 'high') => {
    const root = document.documentElement;
    
    if (mode === 'high') {
      root.classList.add('high-contrast');
      root.style.setProperty('--contrast-ratio', '7:1');
    } else {
      root.classList.remove('high-contrast');
      root.style.setProperty('--contrast-ratio', '4.5:1');
    }
  };

  const toggleContrastMode = () => {
    const newMode = contrastMode === 'normal' ? 'high' : 'normal';
    setContrastMode(newMode);
    localStorage.setItem('skillglobe-contrast-mode', newMode);
    applyContrastMode(newMode);
  };

  return {
    contrastMode,
    toggleContrastMode
  };
}