'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-gray-200 rounded",
        animate && "animate-pulse",
        className
      )}
    />
  );
}

// Opportunity Card Skeleton
export function OpportunityCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      
      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  );
}

// Profile Card Skeleton
export function ProfileCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

// Skill Card Skeleton
export function SkillCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex justify-between text-xs">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

// Portfolio Item Skeleton
export function PortfolioItemSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Dashboard Stats Skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

// Message Thread Skeleton
export function MessageThreadSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Notification Item Skeleton
export function NotificationSkeleton() {
  return (
    <div className="flex items-start space-x-3 p-3 border-b border-gray-100">
      <Skeleton className="h-6 w-6 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// List Skeleton - Generic list with customizable items
interface ListSkeletonProps {
  itemCount?: number;
  itemHeight?: string;
  spacing?: string;
  renderItem?: () => React.ReactNode;
}

export function ListSkeleton({ 
  itemCount = 5, 
  itemHeight = "h-16", 
  spacing = "space-y-4",
  renderItem
}: ListSkeletonProps) {
  return (
    <div className={spacing}>
      {Array.from({ length: itemCount }).map((_, i) => (
        <div key={i}>
          {renderItem ? renderItem() : <Skeleton className={`w-full ${itemHeight}`} />}
        </div>
      ))}
    </div>
  );
}

// Table Skeleton
interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function TableSkeleton({ columns = 4, rows = 5 }: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}