import React from 'react';
import {
  DndContext as DndKitContext,
  closestCenter as dndClosestCenter,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext as SortableKitContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

// Create wrapper components to avoid TypeScript errors
export const DndContext = (props: any) => {
  // @ts-ignore - Ignoring type error with DndContext
  return <DndKitContext {...props} />;
};

export const SortableContext = (props: any) => {
  // @ts-ignore - Ignoring type error with SortableContext
  return <SortableKitContext {...props} />;
};

// Re-export other utilities
export const closestCenter = dndClosestCenter;
export const verticalStrategy = verticalListSortingStrategy;
export type { DragEndEvent };
