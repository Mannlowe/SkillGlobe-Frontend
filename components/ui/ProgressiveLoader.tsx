'use client';

import React from 'react';
import { useProgressiveLoading } from '@/hooks/useIntersectionObserver';
import { Skeleton, ListSkeleton } from './SkeletonLoader';
import { cn } from '@/lib/utils';

interface ProgressiveLoaderProps<T> {
  loadingFunction: () => Promise<T>;
  skeletonComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  children: (data: T) => React.ReactNode;
  className?: string;
  dependencies?: React.DependencyList;
}

export default function ProgressiveLoader<T>({
  loadingFunction,
  skeletonComponent,
  errorComponent,
  children,
  className,
  dependencies = []
}: ProgressiveLoaderProps<T>) {
  const { ref, data, isLoading, error } = useProgressiveLoading(
    loadingFunction,
    dependencies
  );

  if (error) {
    return (
      <div ref={ref} className={className}>
        {errorComponent || (
          <div className="text-center py-8 text-gray-500">
            <p>Failed to load content</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-orange-500 hover:text-orange-600 mt-2"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div ref={ref} className={className}>
        {skeletonComponent || <Skeleton className="h-32 w-full" />}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {children(data)}
    </div>
  );
}

// Specialized progressive loaders for common use cases

interface ProgressiveListProps<T> {
  loadingFunction: () => Promise<T[]>;
  renderItem: (item: T, index: number) => React.ReactNode;
  skeletonCount?: number;
  skeletonHeight?: string;
  emptyState?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  dependencies?: React.DependencyList;
}

export function ProgressiveList<T>({
  loadingFunction,
  renderItem,
  skeletonCount = 5,
  skeletonHeight = "h-16",
  emptyState,
  className,
  itemClassName,
  dependencies = []
}: ProgressiveListProps<T>) {
  return (
    <ProgressiveLoader
      loadingFunction={loadingFunction}
      dependencies={dependencies}
      skeletonComponent={
        <ListSkeleton 
          itemCount={skeletonCount} 
          itemHeight={skeletonHeight}
          spacing={cn("space-y-4", className)}
        />
      }
      className={className}
    >
      {(data) => {
        if (data.length === 0) {
          return emptyState || (
            <div className="text-center py-8 text-gray-500">
              No items found
            </div>
          );
        }

        return (
          <div className={cn("space-y-4", className)}>
            {data.map((item, index) => (
              <div key={index} className={itemClassName}>
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        );
      }}
    </ProgressiveLoader>
  );
}

interface ProgressiveGridProps<T> {
  loadingFunction: () => Promise<T[]>;
  renderItem: (item: T, index: number) => React.ReactNode;
  skeletonCount?: number;
  columns?: number;
  gap?: string;
  emptyState?: React.ReactNode;
  className?: string;
  dependencies?: React.DependencyList;
}

export function ProgressiveGrid<T>({
  loadingFunction,
  renderItem,
  skeletonCount = 8,
  columns = 2,
  gap = "gap-4",
  emptyState,
  className,
  dependencies = []
}: ProgressiveGridProps<T>) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <ProgressiveLoader
      loadingFunction={loadingFunction}
      dependencies={dependencies}
      skeletonComponent={
        <div className={cn("grid", gridCols[columns as keyof typeof gridCols] || gridCols[2], gap)}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      }
      className={className}
    >
      {(data) => {
        if (data.length === 0) {
          return emptyState || (
            <div className="text-center py-8 text-gray-500">
              No items found
            </div>
          );
        }

        return (
          <div className={cn("grid", gridCols[columns as keyof typeof gridCols] || gridCols[2], gap)}>
            {data.map((item, index) => (
              <div key={index}>
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        );
      }}
    </ProgressiveLoader>
  );
}

// Progressive card component for individual cards
interface ProgressiveCardProps<T> {
  loadingFunction: () => Promise<T>;
  skeletonComponent: React.ReactNode;
  children: (data: T) => React.ReactNode;
  className?: string;
  dependencies?: React.DependencyList;
}

export function ProgressiveCard<T>({
  loadingFunction,
  skeletonComponent,
  children,
  className,
  dependencies = []
}: ProgressiveCardProps<T>) {
  return (
    <ProgressiveLoader
      loadingFunction={loadingFunction}
      dependencies={dependencies}
      skeletonComponent={skeletonComponent}
      className={className}
    >
      {children}
    </ProgressiveLoader>
  );
}

// Infinite scroll component with progressive loading
interface InfiniteScrollProps<T> {
  initialData: T[];
  loadMore: () => Promise<T[]>;
  hasNextPage: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  className?: string;
}

export function InfiniteScroll<T>({
  initialData,
  loadMore,
  hasNextPage,
  renderItem,
  loadingComponent,
  className
}: InfiniteScrollProps<T>) {
  const [data, setData] = React.useState<T[]>(initialData);
  const { ref, isLoadingMore } = useInfiniteLoading({
    loadMore: async () => {
      const newData = await loadMore();
      setData(prev => [...prev, ...newData]);
      return newData;
    },
    hasNextPage
  });

  return (
    <div className={className}>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {hasNextPage && (
        <div ref={ref} className="mt-8">
          {isLoadingMore ? (
            loadingComponent || <ListSkeleton itemCount={3} />
          ) : (
            <div className="h-4" /> // Trigger area
          )}
        </div>
      )}
    </div>
  );
}