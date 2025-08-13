'use client';

import { useState, useCallback, useMemo } from 'react';

export interface BulkSelectionOptions {
  allowSelectAll?: boolean;
  maxSelection?: number;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function useBulkSelection(
  allItems: string[] = [],
  options: BulkSelectionOptions = {}
) {
  const {
    allowSelectAll = true,
    maxSelection,
    onSelectionChange
  } = options;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isSelected = useCallback((id: string) => {
    return selectedIds.includes(id);
  }, [selectedIds]);

  const selectItem = useCallback((id: string) => {
    if (selectedIds.includes(id)) return;
    
    const newSelection = maxSelection && selectedIds.length >= maxSelection
      ? [...selectedIds.slice(1), id] // Replace oldest selection if max reached
      : [...selectedIds, id];
    
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  }, [selectedIds, maxSelection, onSelectionChange]);

  const deselectItem = useCallback((id: string) => {
    const newSelection = selectedIds.filter(selectedId => selectedId !== id);
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  }, [selectedIds, onSelectionChange]);

  const toggleItem = useCallback((id: string) => {
    if (selectedIds.includes(id)) {
      deselectItem(id);
    } else {
      selectItem(id);
    }
  }, [selectedIds, selectItem, deselectItem]);

  const selectAll = useCallback(() => {
    if (!allowSelectAll) return;
    
    const newSelection = maxSelection 
      ? allItems.slice(0, maxSelection)
      : allItems;
    
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  }, [allItems, allowSelectAll, maxSelection, onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const selectMultiple = useCallback((ids: string[]) => {
    const validIds = ids.filter(id => allItems.includes(id));
    const newSelection = maxSelection 
      ? validIds.slice(0, maxSelection)
      : validIds;
    
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  }, [allItems, maxSelection, onSelectionChange]);

  const selectRange = useCallback((startId: string, endId: string) => {
    const startIndex = allItems.indexOf(startId);
    const endIndex = allItems.indexOf(endId);
    
    if (startIndex === -1 || endIndex === -1) return;
    
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    const rangeIds = allItems.slice(start, end + 1);
    
    const newSelection = maxSelection 
      ? rangeIds.slice(0, maxSelection)
      : rangeIds;
    
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  }, [allItems, maxSelection, onSelectionChange]);

  const computed = useMemo(() => ({
    selectedCount: selectedIds.length,
    totalCount: allItems.length,
    isAllSelected: allowSelectAll && selectedIds.length === allItems.length && allItems.length > 0,
    isPartiallySelected: selectedIds.length > 0 && selectedIds.length < allItems.length,
    hasSelection: selectedIds.length > 0,
    canSelectMore: !maxSelection || selectedIds.length < maxSelection,
    remainingSlots: maxSelection ? maxSelection - selectedIds.length : Infinity
  }), [selectedIds, allItems, allowSelectAll, maxSelection]);

  return {
    selectedIds,
    isSelected,
    selectItem,
    deselectItem,
    toggleItem,
    selectAll,
    clearSelection,
    selectMultiple,
    selectRange,
    ...computed
  };
}

// Enhanced hook with keyboard support
export function useBulkSelectionWithKeyboard(
  allItems: string[] = [],
  options: BulkSelectionOptions = {}
) {
  const bulkSelection = useBulkSelection(allItems, options);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const handleItemClick = useCallback((
    id: string, 
    event: React.MouseEvent | React.KeyboardEvent
  ) => {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;

    if (isShift && lastSelectedId) {
      // Range selection
      event.preventDefault();
      bulkSelection.selectRange(lastSelectedId, id);
    } else if (isCtrlOrCmd) {
      // Toggle individual item
      event.preventDefault();
      bulkSelection.toggleItem(id);
      setLastSelectedId(id);
    } else {
      // Single selection (replace current selection)
      bulkSelection.selectMultiple([id]);
      setLastSelectedId(id);
    }
  }, [bulkSelection, lastSelectedId]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Select all with Ctrl+A
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      bulkSelection.selectAll();
    }
    
    // Clear selection with Escape
    if (event.key === 'Escape') {
      bulkSelection.clearSelection();
      setLastSelectedId(null);
    }
  }, [bulkSelection]);

  return {
    ...bulkSelection,
    handleItemClick,
    handleKeyDown,
    lastSelectedId
  };
}

// Context-aware bulk selection for different item types
export function useTypedBulkSelection<T extends { id: string }>(
  items: T[] = [],
  options: BulkSelectionOptions = {}
) {
  const allIds = useMemo(() => items.map(item => item.id), [items]);
  const bulkSelection = useBulkSelection(allIds, options);

  const selectedItems = useMemo(() => {
    return items.filter(item => bulkSelection.selectedIds.includes(item.id));
  }, [items, bulkSelection.selectedIds]);

  const unselectedItems = useMemo(() => {
    return items.filter(item => !bulkSelection.selectedIds.includes(item.id));
  }, [items, bulkSelection.selectedIds]);

  return {
    ...bulkSelection,
    selectedItems,
    unselectedItems,
    // Type-safe item operations
    selectItems: (itemsToSelect: T[]) => {
      bulkSelection.selectMultiple(itemsToSelect.map(item => item.id));
    },
    toggleItems: (itemsToToggle: T[]) => {
      itemsToToggle.forEach(item => bulkSelection.toggleItem(item.id));
    }
  };
}