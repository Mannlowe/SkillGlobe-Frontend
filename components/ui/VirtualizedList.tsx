'use client';

import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { cn } from '@/lib/utils';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
}

export default function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className,
  overscan = 5,
  onScroll
}: VirtualizedListProps<T>) {
  const ItemRenderer = useMemo(() => {
    return ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = items[index];
      if (!item) return null;
      
      return (
        <div style={style}>
          {renderItem(item, index, style)}
        </div>
      );
    };
  }, [items, renderItem]);

  const handleScroll = ({ scrollTop }: { scrollTop: number }) => {
    onScroll?.(scrollTop);
  };

  if (items.length === 0) {
    return (
      <div 
        className={cn("flex items-center justify-center text-gray-500", className)}
        style={{ height }}
      >
        No items to display
      </div>
    );
  }

  return (
    <List
      className={cn("scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100", className)}
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      overscanCount={overscan}
      onScroll={handleScroll}
    >
      {ItemRenderer}
    </List>
  );
}

// Specialized components for common use cases
interface OpportunityListProps {
  opportunities: any[];
  height: number;
  onOpportunityClick: (opportunity: any) => void;
  onApply: (opportunityId: string) => void;
  onSave: (opportunityId: string) => void;
}

export function VirtualizedOpportunityList({
  opportunities,
  height,
  onOpportunityClick,
  onApply,
  onSave
}: OpportunityListProps) {
  const renderOpportunity = (opportunity: any, index: number, style: React.CSSProperties) => (
    <div className="px-4 py-2">
      <div 
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onOpportunityClick(opportunity)}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 truncate">{opportunity.title}</h3>
          <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded flex-shrink-0 ml-2">
            {opportunity.matchScore}% match
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3">{opportunity.company} • {opportunity.location}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            ${opportunity.salary?.min}k - ${opportunity.salary?.max}k
          </span>
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave(opportunity.id);
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Save
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(opportunity.id);
              }}
              className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <VirtualizedList
      items={opportunities}
      height={height}
      itemHeight={120} // Approximate height of each opportunity card
      renderItem={renderOpportunity}
      className="w-full"
    />
  );
}

interface MessageListProps {
  messages: any[];
  height: number;
  onMessageClick: (message: any) => void;
  onMarkAsRead: (messageId: string) => void;
}

export function VirtualizedMessageList({
  messages,
  height,
  onMessageClick,
  onMarkAsRead
}: MessageListProps) {
  const renderMessage = (message: any, index: number, style: React.CSSProperties) => (
    <div className="px-4 py-2">
      <div 
        className={cn(
          "border-b border-gray-200 p-3 hover:bg-gray-50 cursor-pointer transition-colors",
          !message.read && "bg-blue-50 border-blue-200"
        )}
        onClick={() => onMessageClick(message)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={cn("font-medium", !message.read ? "text-gray-900" : "text-gray-600")}>
              {message.from}
            </span>
            {!message.read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </div>
          <span className="text-xs text-gray-500">{message.timestamp}</span>
        </div>
        <p className={cn("text-sm", !message.read ? "text-gray-900" : "text-gray-600")}>
          {message.subject}
        </p>
        <p className="text-xs text-gray-500 mt-1 truncate">{message.preview}</p>
      </div>
    </div>
  );

  return (
    <VirtualizedList
      items={messages}
      height={height}
      itemHeight={80} // Approximate height of each message item
      renderItem={renderMessage}
      className="w-full"
    />
  );
}