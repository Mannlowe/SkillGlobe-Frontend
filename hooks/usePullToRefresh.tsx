'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number; // Distance to trigger refresh
  resistance?: number; // Resistance factor (0-1, lower = more resistance)
  snapBackDuration?: number; // Animation duration for snap back
  disabled?: boolean;
  refreshingText?: string;
  pullText?: string;
  releaseText?: string;
}

interface PullState {
  pulling: boolean;
  distance: number;
  canRefresh: boolean;
  refreshing: boolean;
}

export function usePullToRefresh(options: PullToRefreshOptions) {
  const {
    onRefresh,
    threshold = 80,
    resistance = 0.5,
    snapBackDuration = 300,
    disabled = false,
    refreshingText = 'Refreshing...',
    pullText = 'Pull to refresh',
    releaseText = 'Release to refresh'
  } = options;

  const [pullState, setPullState] = useState<PullState>({
    pulling: false,
    distance: 0,
    canRefresh: false,
    refreshing: false
  });

  const elementRef = useRef<HTMLElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isScrollAtTop = useRef<boolean>(true);

  // Check if element is scrolled to top
  const checkScrollPosition = useCallback(() => {
    const element = elementRef.current;
    if (!element) return false;
    
    return element.scrollTop <= 0;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return;
    
    isScrollAtTop.current = checkScrollPosition();
    if (!isScrollAtTop.current) return;

    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
  }, [disabled, checkScrollPosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || !isScrollAtTop.current || pullState.refreshing) return;

    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;

    if (deltaY > 0) {
      // Pulling down
      const distance = Math.pow(deltaY * resistance, 0.8);
      const canRefresh = distance >= threshold;

      setPullState(prev => ({
        ...prev,
        pulling: true,
        distance,
        canRefresh
      }));

      // Prevent scrolling when pulling
      e.preventDefault();
    }
  }, [disabled, threshold, resistance, pullState.refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || !pullState.pulling) return;

    if (pullState.canRefresh && !pullState.refreshing) {
      // Trigger refresh
      setPullState(prev => ({
        ...prev,
        refreshing: true,
        distance: threshold
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        // Snap back after refresh
        setTimeout(() => {
          setPullState({
            pulling: false,
            distance: 0,
            canRefresh: false,
            refreshing: false
          });
        }, 500); // Brief delay to show completion
      }
    } else {
      // Snap back without refreshing
      setPullState({
        pulling: false,
        distance: 0,
        canRefresh: false,
        refreshing: false
      });
    }
  }, [disabled, pullState, threshold, onRefresh]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Get status text based on state
  const getStatusText = useCallback(() => {
    if (pullState.refreshing) return refreshingText;
    if (pullState.canRefresh) return releaseText;
    return pullText;
  }, [pullState, refreshingText, releaseText, pullText]);

  return {
    elementRef,
    pullState,
    statusText: getStatusText(),
    // Styles for the pull indicator
    pullIndicatorStyle: {
      transform: `translateY(${pullState.distance}px)`,
      transition: pullState.pulling ? 'none' : `transform ${snapBackDuration}ms ease-out`,
      opacity: Math.min(pullState.distance / threshold, 1)
    }
  };
}

// Pull-to-refresh component
interface PullToRefreshIndicatorProps {
  distance: number;
  threshold: number;
  refreshing: boolean;
  statusText: string;
  className?: string;
}

export function PullToRefreshIndicator({
  distance,
  threshold,
  refreshing,
  statusText,
  className
}: PullToRefreshIndicatorProps) {
  const progress = Math.min(distance / threshold, 1);
  const rotation = progress * 180;

  return (
    <div
      className={`absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-gray-50 border-b border-gray-200 ${className}`}
      style={{
        transform: `translateY(-100%) translateY(${Math.min(distance, threshold)}px)`,
        transition: refreshing ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      <div className="flex items-center space-x-3 text-gray-600">
        {refreshing ? (
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            className="w-5 h-5 text-gray-400 transition-transform duration-200"
            style={{ transform: `rotate(${rotation}deg)` }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        )}
        <span className="text-sm font-medium">{statusText}</span>
      </div>
    </div>
  );
}