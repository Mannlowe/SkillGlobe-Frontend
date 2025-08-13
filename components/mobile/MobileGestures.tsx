'use client';

import React from 'react';
import { usePullToRefresh, PullToRefreshIndicator } from '@/hooks/usePullToRefresh';
import { useNavigationSwipes } from '@/hooks/useSwipeGestures';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface MobileGesturesWrapperProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
  enablePullToRefresh?: boolean;
  enableNavigationSwipes?: boolean;
  className?: string;
  refreshThreshold?: number;
}

export default function MobileGesturesWrapper({
  children,
  onRefresh,
  enablePullToRefresh = true,
  enableNavigationSwipes = true,
  className,
  refreshThreshold = 80
}: MobileGesturesWrapperProps) {
  const router = useRouter();

  // Pull to refresh
  const {
    elementRef: pullRef,
    pullState,
    statusText,
    pullIndicatorStyle
  } = usePullToRefresh({
    onRefresh: onRefresh || (() => Promise.resolve()),
    threshold: refreshThreshold,
    disabled: !enablePullToRefresh || !onRefresh
  });

  // Navigation swipes
  const navigationRef = useNavigationSwipes({
    onSwipeLeft: () => {
      // Navigate forward (if applicable)
      console.log('Swipe left - navigate forward');
    },
    onSwipeRight: () => {
      // Navigate back
      router.back();
    },
    disabled: !enableNavigationSwipes
  });

  // Combine refs
  const combinedRef = (element: HTMLDivElement | null) => {
    if (pullRef.current !== element) {
      pullRef.current = element;
    }
    if (navigationRef.current !== element) {
      navigationRef.current = element;
    }
  };

  return (
    <div
      ref={combinedRef}
      className={cn(
        "relative min-h-screen overflow-auto",
        className
      )}
      style={pullIndicatorStyle}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && onRefresh && (
        <PullToRefreshIndicator
          distance={pullState.distance}
          threshold={refreshThreshold}
          refreshing={pullState.refreshing}
          statusText={statusText}
          className="z-10"
        />
      )}

      {/* Main content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

// Specialized mobile container for opportunities
interface MobileOpportunitiesContainerProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export function MobileOpportunitiesContainer({
  children,
  onRefresh,
  className
}: MobileOpportunitiesContainerProps) {
  return (
    <MobileGesturesWrapper
      onRefresh={onRefresh}
      enablePullToRefresh={true}
      enableNavigationSwipes={true}
      className={className}
    >
      {children}
    </MobileGesturesWrapper>
  );
}

// Mobile page container with common gestures
interface MobilePageContainerProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
  enableSwipeBack?: boolean;
  className?: string;
}

export function MobilePageContainer({
  children,
  onRefresh,
  enableSwipeBack = true,
  className
}: MobilePageContainerProps) {
  return (
    <MobileGesturesWrapper
      onRefresh={onRefresh}
      enablePullToRefresh={!!onRefresh}
      enableNavigationSwipes={enableSwipeBack}
      className={className}
    >
      {children}
    </MobileGesturesWrapper>
  );
}

// Touch feedback component
interface TouchFeedbackProps {
  children: React.ReactNode;
  onTap?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export function TouchFeedback({
  children,
  onTap,
  onLongPress,
  disabled = false,
  className
}: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleTouchStart = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (onTap && !disabled) {
      onTap();
    }
  };

  const handleTouchCancel = () => {
    setIsPressed(false);
  };

  return (
    <div
      className={cn(
        "transition-transform duration-150 select-none",
        isPressed && "scale-95 opacity-80",
        !disabled && "cursor-pointer",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={onTap}
    >
      {children}
    </div>
  );
}