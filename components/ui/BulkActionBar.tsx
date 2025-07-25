'use client';

import React from 'react';
import { 
  X, 
  Check, 
  Trash2, 
  Archive, 
  Star, 
  Download, 
  Share2,
  Eye,
  EyeOff,
  Copy,
  Edit,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  disabled?: boolean;
  onClick: (selectedIds: string[]) => void;
}

interface BulkActionBarProps {
  selectedItems: string[];
  totalItems: number;
  actions: BulkAction[];
  onClearSelection: () => void;
  onSelectAll: () => void;
  className?: string;
  position?: 'top' | 'bottom' | 'floating';
}

export default function BulkActionBar({
  selectedItems,
  totalItems,
  actions,
  onClearSelection,
  onSelectAll,
  className,
  position = 'floating'
}: BulkActionBarProps) {
  if (selectedItems.length === 0) return null;

  const isAllSelected = selectedItems.length === totalItems;

  const positionClasses = {
    top: 'sticky top-0 z-10',
    bottom: 'sticky bottom-0 z-10',
    floating: 'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 shadow-lg'
  };

  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-lg p-4",
      positionClasses[position],
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        {/* Selection Info */}
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {selectedItems.length} selected
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={isAllSelected ? onClearSelection : onSelectAll}
            className="text-sm"
          >
            {isAllSelected ? 'Deselect all' : `Select all (${totalItems})`}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              size="sm"
              disabled={action.disabled}
              onClick={() => action.onClick(selectedItems)}
              className="flex items-center space-x-1"
            >
              {action.icon}
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Pre-configured bulk action sets for common use cases

export const opportunityBulkActions: BulkAction[] = [
  {
    id: 'apply',
    label: 'Apply',
    icon: <Send className="w-4 h-4" />,
    variant: 'default',
    onClick: (ids) => console.log('Bulk apply to:', ids)
  },
  {
    id: 'save',
    label: 'Save',
    icon: <Star className="w-4 h-4" />,
    onClick: (ids) => console.log('Bulk save:', ids)
  },
  {
    id: 'hide',
    label: 'Hide',
    icon: <EyeOff className="w-4 h-4" />,
    onClick: (ids) => console.log('Bulk hide:', ids)
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: <Archive className="w-4 h-4" />,
    onClick: (ids) => console.log('Bulk archive:', ids)
  }
];

export const skillBulkActions: BulkAction[] = [
  {
    id: 'endorse',
    label: 'Endorse',
    icon: <Check className="w-4 h-4" />,
    variant: 'default',
    onClick: (ids) => console.log('Bulk endorse skills:', ids)
  },
  {
    id: 'verify',
    label: 'Verify',
    icon: <Star className="w-4 h-4" />,
    onClick: (ids) => console.log('Bulk verify skills:', ids)
  },
  {
    id: 'remove',
    label: 'Remove',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'destructive',
    onClick: (ids) => console.log('Bulk remove skills:', ids)
  }
];

export const messageBulkActions: BulkAction[] = [
  {
    id: 'mark-read',
    label: 'Mark Read',
    icon: <Check className="w-4 h-4" />,
    onClick: (ids) => console.log('Bulk mark read:', ids)
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: <Archive className="w-4 h-4" />,
    onClick: (ids) => console.log('Bulk archive messages:', ids)
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'destructive',
    onClick: (ids) => console.log('Bulk delete messages:', ids)
  }
];

export const portfolioBulkActions: BulkAction[] = [
  {
    id: 'publish',
    label: 'Publish',
    icon: <Eye className="w-4 h-4" />,
    variant: 'default',
    onClick: (ids) => console.log('Bulk publish:', ids)
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit className="w-4 h-4" />,
    onClick: (ids) => console.log('Bulk edit:', ids)
  },
  {
    id: 'download',
    label: 'Download',
    icon: <Download className="w-4 h-4" />,
    onClick: (ids) => console.log('Bulk download:', ids)
  },
  {
    id: 'share',
    label: 'Share',
    icon: <Share2 className="w-4 h-4" />,
    onClick: (ids) => console.log('Bulk share:', ids)
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'destructive',
    onClick: (ids) => console.log('Bulk delete:', ids)
  }
];