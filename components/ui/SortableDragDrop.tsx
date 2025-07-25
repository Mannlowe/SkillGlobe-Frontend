'use client';

import React, { useState, useRef, useCallback } from 'react';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableItem {
  id: string;
  [key: string]: any;
}

interface SortableDragDropProps<T extends SortableItem> {
  items: T[];
  onReorder: (reorderedItems: T[]) => void;
  renderItem: (item: T, index: number, isDragging?: boolean) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  dragHandleClassName?: string;
  showDragHandle?: boolean;
  disabled?: boolean;
}

export default function SortableDragDrop<T extends SortableItem>({
  items,
  onReorder,
  renderItem,
  className,
  itemClassName,
  dragHandleClassName,
  showDragHandle = true,
  disabled = false
}: SortableDragDropProps<T>) {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = useCallback((e: React.DragEvent, item: T, index: number) => {
    if (disabled) return;
    
    setDraggedItem(item);
    setDraggedIndex(index);
    
    // Set drag image
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
    
    // Style the drag ghost
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.7';
    dragImage.style.transform = 'rotate(5deg)';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  }, [disabled]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null) return;
    
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, [disabled, draggedIndex]);

  const handleDragEnter = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (disabled) return;
    
    dragCounter.current++;
    setDragOverIndex(index);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null || draggedItem === null) return;

    if (draggedIndex !== dropIndex) {
      const newItems = [...items];
      const draggedItem = newItems[draggedIndex];
      
      // Remove dragged item
      newItems.splice(draggedIndex, 1);
      
      // Insert at new position
      newItems.splice(dropIndex, 0, draggedItem);
      
      onReorder(newItems);
    }

    handleDragEnd();
  }, [disabled, draggedIndex, draggedItem, items, onReorder, handleDragEnd]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    if (disabled || fromIndex === toIndex || toIndex < 0 || toIndex >= items.length) return;
    
    const newItems = [...items];
    const item = newItems[fromIndex];
    newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, item);
    onReorder(newItems);
  }, [disabled, items, onReorder]);

  const moveUp = useCallback((index: number) => {
    moveItem(index, index - 1);
  }, [moveItem]);

  const moveDown = useCallback((index: number) => {
    moveItem(index, index + 1);
  }, [moveItem]);

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => {
        const isDragging = draggedIndex === index;
        const isDragOver = dragOverIndex === index && draggedIndex !== index;
        const isAboveDrop = dragOverIndex !== null && index === dragOverIndex - 1 && draggedIndex !== null && draggedIndex > dragOverIndex;
        const isBelowDrop = dragOverIndex !== null && index === dragOverIndex + 1 && draggedIndex !== null && draggedIndex < dragOverIndex;

        return (
          <div
            key={item.id}
            className={cn(
              "relative group transition-all duration-200",
              isDragging && "opacity-50 scale-95",
              isDragOver && "scale-102",
              itemClassName
            )}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, item, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            {/* Drop indicators */}
            {isAboveDrop && (
              <div className="absolute -top-1 left-0 right-0 h-0.5 bg-orange-500 rounded-full z-10" />
            )}
            {isBelowDrop && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500 rounded-full z-10" />
            )}

            <div className="flex items-center space-x-2">
              {/* Drag Handle */}
              {showDragHandle && (
                <div className={cn(
                  "flex flex-col items-center space-y-1 p-2 cursor-grab active:cursor-grabbing",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  disabled && "cursor-not-allowed opacity-50",
                  dragHandleClassName
                )}>
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={disabled || index === 0}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={disabled || index === items.length - 1}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Item Content */}
              <div className="flex-1">
                {renderItem(item, index, isDragging)}
              </div>
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p>No items to sort</p>
        </div>
      )}
    </div>
  );
}

// Specialized sortable components

interface SortableSkillsProps {
  skills: Array<{ id: string; name: string; level: string; }>;
  onReorder: (skills: Array<{ id: string; name: string; level: string; }>) => void;
  disabled?: boolean;
}

export function SortableSkills({ skills, onReorder, disabled }: SortableSkillsProps) {
  return (
    <SortableDragDrop
      items={skills}
      onReorder={onReorder}
      disabled={disabled}
      renderItem={(skill, index) => (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{skill.name}</h3>
              <p className="text-sm text-gray-600">{skill.level}</p>
            </div>
            <div className="text-sm text-gray-500">
              #{index + 1}
            </div>
          </div>
        </div>
      )}
    />
  );
}

interface SortablePortfolioProps {
  items: Array<{ 
    id: string; 
    title: string; 
    type: string; 
    thumbnail?: string;
  }>;
  onReorder: (items: Array<{ 
    id: string; 
    title: string; 
    type: string; 
    thumbnail?: string;
  }>) => void;
  disabled?: boolean;
}

export function SortablePortfolio({ items, onReorder, disabled }: SortablePortfolioProps) {
  return (
    <SortableDragDrop
      items={items}
      onReorder={onReorder}
      disabled={disabled}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      renderItem={(item) => (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
          {item.thumbnail && (
            <div className="aspect-video bg-gray-100">
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.type}</p>
          </div>
        </div>
      )}
    />
  );
}

interface SortableListProps {
  items: Array<{ id: string; label: string; }>;
  onReorder: (items: Array<{ id: string; label: string; }>) => void;
  disabled?: boolean;
  className?: string;
}

export function SortableList({ items, onReorder, disabled, className }: SortableListProps) {
  return (
    <SortableDragDrop
      items={items}
      onReorder={onReorder}
      disabled={disabled}
      className={className}
      renderItem={(item, index) => (
        <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-gray-900">{item.label}</span>
            <span className="text-sm text-gray-500">#{index + 1}</span>
          </div>
        </div>
      )}
    />
  );
}