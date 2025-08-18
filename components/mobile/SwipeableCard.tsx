'use client';

import React, { useState, useRef } from 'react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import { useLongPress } from '@/hooks/useLongPress';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  leftAction?: {
    icon: React.ReactNode;
    color: string;
    label: string;
  };
  rightAction?: {
    icon: React.ReactNode;
    color: string;
    label: string;
  };
  className?: string;
  disabled?: boolean;
}

export default function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onLongPress,
  leftAction,
  rightAction,
  className,
  disabled = false
}: SwipeableCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);
  
  const startX = useRef<number>(0);
  const currentX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Handle swipe gestures
  const swipeRef = useSwipeGestures({
    onSwipeLeft: () => {
      if (onSwipeLeft && !disabled) {
        onSwipeLeft();
        setSwipeOffset(0);
      }
    },
    onSwipeRight: () => {
      if (onSwipeRight && !disabled) {
        onSwipeRight();
        setSwipeOffset(0);
      }
    },
    threshold: 60,
    velocity: 0.3,
    disabled
  });

  // Handle long press
  const { elementRef: longPressRef } = useLongPress({
    onLongPress: () => {
      if (onLongPress && !disabled) {
        setIsLongPressing(true);
        onLongPress();
        // Reset after animation
        setTimeout(() => setIsLongPressing(false), 200);
      }
    },
    threshold: 500,
    cancelOnMovement: true,
    movementThreshold: 10,
    disabled: disabled || !onLongPress
  });

  // Custom touch handling for reveal actions
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled) return;
    
    currentX.current = e.touches[0].clientX;
    const deltaX = currentX.current - startX.current;
    
    if (Math.abs(deltaX) > 10) {
      isDragging.current = true;
      
      // Apply resistance for overswiping
      let offset = deltaX;
      const maxOffset = 100;
      
      if (Math.abs(offset) > maxOffset) {
        const excess = Math.abs(offset) - maxOffset;
        const resistance = Math.pow(excess / maxOffset, 0.5);
        offset = (offset > 0 ? 1 : -1) * (maxOffset + resistance * 20);
      }
      
      setSwipeOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (disabled) return;
    
    const threshold = 80;
    
    if (Math.abs(swipeOffset) > threshold) {
      if (swipeOffset > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (swipeOffset < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    // Reset position
    setSwipeOffset(0);
    isDragging.current = false;
  };

  // Create a local ref for the DOM element
  const localRef = useRef<HTMLDivElement | null>(null);
  
  // Use a callback ref pattern
  const combinedRef = (element: HTMLDivElement | null) => {
    // Store the element in our local ref
    localRef.current = element;
  };
  
  // Let the hooks handle their own refs through their APIs
  // No need to try to modify their .current properties directly

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Left action background */}
      {rightAction && swipeOffset > 0 && (
        <div 
          className={cn(
            "absolute inset-y-0 left-0 flex items-center justify-start pl-4",
            rightAction.color
          )}
          style={{ width: Math.min(swipeOffset, 100) }}
        >
          <div className="flex items-center space-x-2 text-white">
            {rightAction.icon}
            {swipeOffset > 60 && (
              <span className="text-sm font-medium">{rightAction.label}</span>
            )}
          </div>
        </div>
      )}
      
      {/* Right action background */}
      {leftAction && swipeOffset < 0 && (
        <div 
          className={cn(
            "absolute inset-y-0 right-0 flex items-center justify-end pr-4",
            leftAction.color
          )}
          style={{ width: Math.min(Math.abs(swipeOffset), 100) }}
        >
          <div className="flex items-center space-x-2 text-white">
            {Math.abs(swipeOffset) > 60 && (
              <span className="text-sm font-medium">{leftAction.label}</span>
            )}
            {leftAction.icon}
          </div>
        </div>
      )}
      
      {/* Main card content */}
      <div
        ref={combinedRef}
        className={cn(
          "relative bg-white transition-transform duration-200 ease-out",
          isLongPressing && "scale-95",
          className
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

// Specialized swipeable components
interface SwipeableOpportunityCardProps {
  opportunity: any;
  onSave?: () => void;
  onApply?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SwipeableOpportunityCard({
  opportunity,
  onSave,
  onApply,
  onLongPress,
  children,
  className
}: SwipeableOpportunityCardProps) {
  return (
    <SwipeableCard
      onSwipeRight={onSave}
      onSwipeLeft={onApply}
      onLongPress={onLongPress}
      rightAction={{
        icon: <span>💾</span>,
        color: 'bg-blue-500',
        label: 'Save'
      }}
      leftAction={{
        icon: <span>🚀</span>,
        color: 'bg-green-500',
        label: 'Apply'
      }}
      className={className}
    >
      {children}
    </SwipeableCard>
  );
}

interface SwipeableMessageCardProps {
  message: any;
  onArchive?: () => void;
  onDelete?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SwipeableMessageCard({
  message,
  onArchive,
  onDelete,
  onLongPress,
  children,
  className
}: SwipeableMessageCardProps) {
  return (
    <SwipeableCard
      onSwipeRight={onArchive}
      onSwipeLeft={onDelete}
      onLongPress={onLongPress}
      rightAction={{
        icon: <span>📦</span>,
        color: 'bg-yellow-500',
        label: 'Archive'
      }}
      leftAction={{
        icon: <span>🗑️</span>,
        color: 'bg-red-500',
        label: 'Delete'
      }}
      className={className}
    >
      {children}
    </SwipeableCard>
  );
}