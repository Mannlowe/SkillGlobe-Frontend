'use client';

import { useCallback, useRef, useEffect } from 'react';

interface LongPressOptions {
  onLongPress: (event: TouchEvent | MouseEvent) => void;
  onLongPressStart?: () => void;
  onLongPressEnd?: () => void;
  threshold?: number; // Duration in milliseconds
  captureEvent?: boolean;
  detect?: 'touch' | 'mouse' | 'both';
  cancelOnMovement?: boolean;
  movementThreshold?: number; // Pixels
}

interface Position {
  x: number;
  y: number;
}

export function useLongPress(options: LongPressOptions) {
  const {
    onLongPress,
    onLongPressStart,
    onLongPressEnd,
    threshold = 500,
    captureEvent = true,
    detect = 'both',
    cancelOnMovement = true,
    movementThreshold = 10
  } = options;

  const timeout = useRef<NodeJS.Timeout>();
  const startPosition = useRef<Position>();
  const isLongPressing = useRef(false);
  const elementRef = useRef<HTMLElement>(null);

  const start = useCallback((event: TouchEvent | MouseEvent) => {
    if (captureEvent) {
      event.preventDefault();
    }

    // Store start position for movement detection
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    startPosition.current = { x: clientX, y: clientY };

    isLongPressing.current = false;
    onLongPressStart?.();

    timeout.current = setTimeout(() => {
      isLongPressing.current = true;
      onLongPress(event);
    }, threshold);
  }, [onLongPress, onLongPressStart, threshold, captureEvent]);

  const clear = useCallback((shouldTriggerEnd = true) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }

    if (shouldTriggerEnd && isLongPressing.current) {
      onLongPressEnd?.();
    }

    isLongPressing.current = false;
    startPosition.current = undefined;
  }, [onLongPressEnd]);

  const move = useCallback((event: TouchEvent | MouseEvent) => {
    if (!cancelOnMovement || !startPosition.current || !timeout.current) return;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const deltaX = Math.abs(clientX - startPosition.current.x);
    const deltaY = Math.abs(clientY - startPosition.current.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > movementThreshold) {
      clear(false);
    }
  }, [cancelOnMovement, movementThreshold, clear]);

  const onMouseDown = useCallback((event: MouseEvent) => {
    if (detect === 'touch') return;
    start(event);
  }, [detect, start]);

  const onMouseUp = useCallback(() => {
    if (detect === 'touch') return;
    clear();
  }, [detect, clear]);

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (detect === 'touch') return;
    move(event);
  }, [detect, move]);

  const onTouchStart = useCallback((event: TouchEvent) => {
    if (detect === 'mouse') return;
    start(event);
  }, [detect, start]);

  const onTouchEnd = useCallback(() => {
    if (detect === 'mouse') return;
    clear();
  }, [detect, clear]);

  const onTouchMove = useCallback((event: TouchEvent) => {
    if (detect === 'mouse') return;
    move(event);
  }, [detect, move]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Mouse events
    if (detect === 'mouse' || detect === 'both') {
      element.addEventListener('mousedown', onMouseDown);
      element.addEventListener('mouseup', onMouseUp);
      element.addEventListener('mousemove', onMouseMove);
      element.addEventListener('mouseleave', onMouseUp);
    }

    // Touch events
    if (detect === 'touch' || detect === 'both') {
      element.addEventListener('touchstart', onTouchStart, { passive: false });
      element.addEventListener('touchend', onTouchEnd);
      element.addEventListener('touchmove', onTouchMove, { passive: false });
      element.addEventListener('touchcancel', onTouchEnd);
    }

    return () => {
      if (detect === 'mouse' || detect === 'both') {
        element.removeEventListener('mousedown', onMouseDown);
        element.removeEventListener('mouseup', onMouseUp);
        element.removeEventListener('mousemove', onMouseMove);
        element.removeEventListener('mouseleave', onMouseUp);
      }

      if (detect === 'touch' || detect === 'both') {
        element.removeEventListener('touchstart', onTouchStart);
        element.removeEventListener('touchend', onTouchEnd);
        element.removeEventListener('touchmove', onTouchMove);
        element.removeEventListener('touchcancel', onTouchEnd);
      }
      
      clear(false);
    };
  }, [
    detect,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    clear
  ]);

  return {
    elementRef,
    isLongPressing: isLongPressing.current
  };
}

// Specialized hook for context menus
export function useContextMenu(options: {
  onContextMenu: (event: TouchEvent | MouseEvent) => void;
  threshold?: number;
}) {
  return useLongPress({
    onLongPress: options.onContextMenu,
    threshold: options.threshold || 600,
    cancelOnMovement: true,
    movementThreshold: 5,
    detect: 'both'
  });
}

// Hook for selection mode (like iOS photo selection)
export function useSelectionMode(options: {
  onEnterSelectionMode: () => void;
  threshold?: number;
}) {
  return useLongPress({
    onLongPress: options.onEnterSelectionMode,
    threshold: options.threshold || 400,
    cancelOnMovement: true,
    movementThreshold: 8,
    detect: 'touch' // Primarily for mobile
  });
}