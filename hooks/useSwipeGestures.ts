'use client';

import { useEffect, useRef, useCallback } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance for swipe
  velocity?: number; // Minimum velocity for swipe
  preventDefaultTouchmove?: boolean;
  disabled?: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export function useSwipeGestures(options: SwipeGestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocity = 0.3,
    preventDefaultTouchmove = true,
    disabled = false
  } = options;

  const startPos = useRef<TouchPosition | null>(null);
  const elementRef = useRef<HTMLElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    startPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || !startPos.current) return;
    
    if (preventDefaultTouchmove) {
      e.preventDefault();
    }
  }, [disabled, preventDefaultTouchmove]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (disabled || !startPos.current) return;

    const touch = e.changedTouches[0];
    const endPos = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = endPos.x - startPos.current.x;
    const deltaY = endPos.y - startPos.current.y;
    const deltaTime = endPos.time - startPos.current.time;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const velocityX = absX / deltaTime;
    const velocityY = absY / deltaTime;

    // Check if gesture meets minimum requirements
    if (Math.max(absX, absY) < threshold) {
      startPos.current = null;
      return;
    }

    // Determine primary direction
    if (absX > absY) {
      // Horizontal swipe
      if (velocityX >= velocity) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    } else {
      // Vertical swipe
      if (velocityY >= velocity) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }

    startPos.current = null;
  }, [disabled, threshold, velocity, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchmove });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefaultTouchmove]);

  return elementRef;
}

// Specialized hook for navigation swipes
export function useNavigationSwipes(options: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
}) {
  return useSwipeGestures({
    ...options,
    threshold: 100, // Longer swipe for navigation
    velocity: 0.5, // Faster swipe for navigation
    preventDefaultTouchmove: false // Allow scrolling
  });
}

// Hook for card interactions (like Tinder-style swipes)
export function useCardSwipes(options: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
}) {
  return useSwipeGestures({
    ...options,
    threshold: 80,
    velocity: 0.4,
    preventDefaultTouchmove: true
  });
}