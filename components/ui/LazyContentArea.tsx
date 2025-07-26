'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Skeleton } from './SkeletonLoader';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface LazyContentAreaProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorComponent?: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  minHeight?: string;
  triggerOnce?: boolean;
  loadingDelay?: number;
  retryAttempts?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  priority?: 'high' | 'medium' | 'low';
}

export default function LazyContentArea({
  children,
  fallback,
  errorComponent,
  className,
  threshold = 0.1,
  rootMargin = '100px',
  minHeight = 'min-h-[200px]',
  triggerOnce = true,
  loadingDelay = 0,
  retryAttempts = 3,
  onLoad,
  onError,
  priority = 'medium'
}: LazyContentAreaProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { ref, isInView } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce
  });

  const loadContent = useCallback(async () => {
    if (isLoaded || hasError) return;

    try {
      // Apply loading delay based on priority
      const delay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 300;
      
      loadingTimeoutRef.current = setTimeout(async () => {
        setIsLoaded(true);
        onLoad?.();
      }, delay + loadingDelay);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Content loading failed');
      setError(error);
      setHasError(true);
      onError?.(error);
    }
  }, [isLoaded, hasError, priority, loadingDelay, onLoad, onError]);

  const handleRetry = useCallback(() => {
    if (retryCount >= retryAttempts) return;
    
    setHasError(false);
    setError(null);
    setRetryCount(prev => prev + 1);
    setIsLoaded(false);
    
    // Retry with exponential backoff
    const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    setTimeout(loadContent, backoffDelay);
  }, [retryCount, retryAttempts, loadContent]);

  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      loadContent();
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isInView, isLoaded, hasError, loadContent]);

  if (hasError && errorComponent) {
    return <div ref={ref} className={className}>{errorComponent}</div>;
  }

  if (hasError) {
    return (
      <div ref={ref} className={cn('flex flex-col items-center justify-center p-8 text-center', minHeight, className)}>
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load content</h3>
        <p className="text-gray-600 mb-4">{error?.message || 'An error occurred while loading this content'}</p>
        {retryCount < retryAttempts && (
          <button
            onClick={handleRetry}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry ({retryAttempts - retryCount} attempts left)</span>
          </button>
        )}
      </div>
    );
  }

  if (!isInView || !isLoaded) {
    return (
      <div ref={ref} className={cn(minHeight, className)}>
        {fallback || <ContentAreaSkeleton />}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Default skeleton for content areas
function ContentAreaSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

// Specialized lazy content components for different sections

interface LazyDashboardSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
}

export function LazyDashboardSection({ 
  title, 
  children, 
  className, 
  priority = 'medium' 
}: LazyDashboardSectionProps) {
  return (
    <LazyContentArea
      className={className}
      priority={priority}
      fallback={
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </div>
      }
    >
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        {children}
      </div>
    </LazyContentArea>
  );
}

interface LazyOpportunityFeedProps {
  children: React.ReactNode;
  className?: string;
}

export function LazyOpportunityFeed({ children, className }: LazyOpportunityFeedProps) {
  return (
    <LazyContentArea
      className={className}
      priority="high"
      threshold={0.25}
      rootMargin="200px"
      fallback={
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Skeleton className="h-5 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    >
      {children}
    </LazyContentArea>
  );
}

interface LazySkillsSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function LazySkillsSection({ children, className }: LazySkillsSectionProps) {
  return (
    <LazyContentArea
      className={className}
      priority="medium"
      fallback={
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      {children}
    </LazyContentArea>
  );
}

interface LazyPortfolioSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function LazyPortfolioSection({ children, className }: LazyPortfolioSectionProps) {
  return (
    <LazyContentArea
      className={className}
      priority="low"
      rootMargin="50px"
      fallback={
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      {children}
    </LazyContentArea>
  );
}

interface LazyAnalyticsSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function LazyAnalyticsSection({ children, className }: LazyAnalyticsSectionProps) {
  return (
    <LazyContentArea
      className={className}
      priority="low"
      loadingDelay={500}
      fallback={
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Skeleton className="h-6 w-1/4 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      }
    >
      {children}
    </LazyContentArea>
  );
}

// Hook for managing multiple lazy content areas
export function useLazyContentManager() {
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set());
  const [priorityQueue, setPriorityQueue] = useState<Array<{
    id: string;
    priority: 'high' | 'medium' | 'low';
    loadFn: () => void;
  }>>([]);

  const registerSection = useCallback((
    id: string, 
    priority: 'high' | 'medium' | 'low',
    loadFn: () => void
  ) => {
    setPriorityQueue(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) return prev;
      
      const newItem = { id, priority, loadFn };
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      
      return [...prev, newItem].sort((a, b) => 
        priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    });
  }, []);

  const markSectionLoaded = useCallback((id: string) => {
    setLoadedSections(prev => new Set([...prev, id]));
  }, []);

  const processPriorityQueue = useCallback(() => {
    const unloadedItems = priorityQueue.filter(item => !loadedSections.has(item.id));
    
    // Load high priority items immediately
    unloadedItems
      .filter(item => item.priority === 'high')
      .forEach(item => {
        item.loadFn();
        markSectionLoaded(item.id);
      });
    
    // Load medium priority items with small delay
    setTimeout(() => {
      unloadedItems
        .filter(item => item.priority === 'medium')
        .forEach(item => {
          item.loadFn();
          markSectionLoaded(item.id);
        });
    }, 100);
    
    // Load low priority items with larger delay
    setTimeout(() => {
      unloadedItems
        .filter(item => item.priority === 'low')
        .forEach(item => {
          item.loadFn();
          markSectionLoaded(item.id);
        });
    }, 500);
  }, [priorityQueue, loadedSections, markSectionLoaded]);

  useEffect(() => {
    if (priorityQueue.length > 0) {
      processPriorityQueue();
    }
  }, [priorityQueue, processPriorityQueue]);

  return {
    registerSection,
    markSectionLoaded,
    loadedSections,
    isLoaded: (id: string) => loadedSections.has(id)
  };
}