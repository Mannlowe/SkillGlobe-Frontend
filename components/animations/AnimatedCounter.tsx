'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatValue?: (value: number) => string;
  triggerOnce?: boolean;
}

export default function AnimatedCounter({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  className,
  formatValue,
  triggerOnce = true
}: AnimatedCounterProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { ref, isInView } = useIntersectionObserver({ 
    threshold: 0.3,
    triggerOnce 
  });
  
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef<number>(0);

  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    
    const nextValue = startValueRef.current + (value - startValueRef.current) * easedProgress;
    setCurrentValue(nextValue);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      setCurrentValue(value);
    }
  };

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    startTimeRef.current = undefined;
    startValueRef.current = currentValue;
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isInView && value !== currentValue) {
      startAnimation();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, value]);

  const displayValue = formatValue 
    ? formatValue(currentValue) 
    : Math.round(currentValue).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

// Specialized counter components
interface StatCounterProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

export function StatCounter({ 
  value, 
  label, 
  icon, 
  className, 
  trend, 
  trendValue 
}: StatCounterProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };

  return (
    <div className={`bg-white rounded-lg p-4 border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-gray-400">{icon}</div>}
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 text-xs ${trendColors[trend]}`}>
            <span>{trendIcons[trend]}</span>
            <AnimatedCounter value={trendValue} suffix="%" duration={1500} />
          </div>
        )}
      </div>
      <div className="mt-2">
        <AnimatedCounter 
          value={value} 
          className="text-2xl font-bold text-gray-900"
          duration={2000}
        />
      </div>
    </div>
  );
}

// Progress counter for skill levels, completion rates, etc.
interface ProgressCounterProps {
  value: number;
  max?: number;
  label: string;
  className?: string;
  color?: string;
}

export function ProgressCounter({ 
  value, 
  max = 100, 
  label, 
  className,
  color = 'bg-orange-500'
}: ProgressCounterProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <AnimatedCounter 
          value={percentage} 
          suffix="%" 
          className="text-sm font-semibold text-gray-900"
          formatValue={(val) => Math.round(val).toString()}
        />
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-2000 ease-out rounded-full`}
          style={{ 
            width: `${percentage}%`,
            transform: 'translateX(-100%)',
            animation: 'slideIn 2s ease-out forwards'
          }}
        />
      </div>
      <style jsx>{`
        @keyframes slideIn {
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}