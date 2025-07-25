'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true
}: UseIntersectionObserverProps = {}) {
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        
        if (inView && (!triggerOnce || !hasTriggered)) {
          setIsInView(true);
          setHasTriggered(true);
          
          if (triggerOnce) {
            observer.unobserve(currentElement);
          }
        } else if (!triggerOnce && !inView) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref: elementRef, isInView, hasTriggered };
}

// Hook for progressive loading with skeleton states
export function useProgressiveLoading<T>(
  loadingFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    if (!isInView) return;

    let cancelled = false;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await loadingFunction();
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [isInView, ...dependencies]);

  return { ref, data, isLoading, error };
}

// Hook for infinite loading with intersection observer
interface UseInfiniteLoadingProps<T> {
  loadMore: () => Promise<T[]>;
  hasNextPage: boolean;
  threshold?: number;
}

export function useInfiniteLoading<T>({
  loadMore,
  hasNextPage,
  threshold = 0.5
}: UseInfiniteLoadingProps<T>) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { ref, isInView } = useIntersectionObserver({ 
    threshold, 
    triggerOnce: false 
  });

  useEffect(() => {
    if (isInView && hasNextPage && !isLoadingMore) {
      setIsLoadingMore(true);
      
      loadMore()
        .finally(() => {
          setIsLoadingMore(false);
        });
    }
  }, [isInView, hasNextPage, isLoadingMore, loadMore]);

  return { ref, isLoadingMore };
}