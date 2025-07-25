'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  transition?: 'fade' | 'slide' | 'scale' | 'blur';
  duration?: number;
}

export default function PageTransition({
  children,
  className,
  transition = 'fade',
  duration = 300
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Enter animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const transitionClasses = {
    fade: {
      enter: 'opacity-100',
      exit: 'opacity-0',
      base: 'transition-opacity'
    },
    slide: {
      enter: 'translate-x-0 opacity-100',
      exit: 'translate-x-full opacity-0',
      base: 'transition-all transform'
    },
    scale: {
      enter: 'scale-100 opacity-100',
      exit: 'scale-95 opacity-0',
      base: 'transition-all transform'
    },
    blur: {
      enter: 'blur-0 opacity-100',
      exit: 'blur-sm opacity-0',
      base: 'transition-all filter'
    }
  };

  const currentTransition = transitionClasses[transition];

  return (
    <div
      className={cn(
        currentTransition.base,
        isVisible && !isExiting ? currentTransition.enter : currentTransition.exit,
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

// Staggered list animation
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
  itemClassName?: string;
}

export function StaggeredList({
  children,
  staggerDelay = 100,
  className,
  itemClassName
}: StaggeredListProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    children.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, index * staggerDelay);
    });
  }, [children, staggerDelay]);

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-500 transform",
            visibleItems.includes(index)
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0",
            itemClassName
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Modal animation wrapper
interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'scale' | 'slide' | 'fade';
}

export function AnimatedModal({
  isOpen,
  onClose,
  children,
  size = 'md',
  animation = 'scale'
}: AnimatedModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-4xl'
  };

  const animationClasses = {
    scale: {
      enter: 'scale-100 opacity-100',
      exit: 'scale-95 opacity-0'
    },
    slide: {
      enter: 'translate-y-0 opacity-100',
      exit: 'translate-y-4 opacity-0'
    },
    fade: {
      enter: 'opacity-100',
      exit: 'opacity-0'
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black transition-opacity duration-200",
          isOpen ? "bg-opacity-50" : "bg-opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            "relative bg-white rounded-lg shadow-xl transition-all duration-200 transform",
            sizeClasses[size],
            isOpen 
              ? animationClasses[animation].enter 
              : animationClasses[animation].exit
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// Loading spinner with animations
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  type?: 'spinner' | 'dots' | 'pulse' | 'bars';
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'text-orange-500',
  type = 'spinner',
  className
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const spinners = {
    spinner: (
      <div className={cn("animate-spin rounded-full border-2 border-t-transparent", sizes[size], `border-current ${color}`)}>
      </div>
    ),
    dots: (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-current animate-pulse",
              size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3',
              color
            )}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    ),
    pulse: (
      <div className={cn("animate-pulse rounded-full bg-current", sizes[size], color)} />
    ),
    bars: (
      <div className="flex space-x-1 items-end">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-current animate-pulse",
              size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : 'w-2',
              color
            )}
            style={{
              height: `${12 + i * 4}px`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    )
  };

  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      {spinners[type]}
    </div>
  );
}

// Progress bar with smooth animation
interface AnimatedProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  className?: string;
  animated?: boolean;
}

export function AnimatedProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'bg-orange-500',
  className,
  animated = true
}: AnimatedProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!animated) {
      setAnimatedValue(percentage);
      return;
    }

    const timer = setTimeout(() => {
      setAnimatedValue(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage, animated]);

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            color
          )}
          style={{ width: `${animatedValue}%` }}
        />
      </div>
    </div>
  );
}

// Notification toast with slide animation
interface AnimatedToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function AnimatedToast({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000
}: AnimatedToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform",
        typeStyles[type],
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      )}
    >
      <div className="flex items-center space-x-2">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}