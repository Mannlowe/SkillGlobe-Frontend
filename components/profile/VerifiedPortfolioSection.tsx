'use client';

import React from 'react';
import { Plus, FolderOpen, Eye, Heart, ExternalLink, FileText, Code, Palette } from 'lucide-react';
import { VerifiedPortfolioDisplay } from '@/types/verification';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VerifiedPortfolioSectionProps {
  portfolioData: VerifiedPortfolioDisplay;
  onAddItem?: () => void;
  onVerifyItem?: (id: string) => void;
}

export default function VerifiedPortfolioSection({
  portfolioData,
  onAddItem,
  onVerifyItem
}: VerifiedPortfolioSectionProps) {
  
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'project': return Code;
      case 'article': return FileText;
      case 'design': return Palette;
      default: return FolderOpen;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            Portfolio
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Showcase your best work and projects
          </p>
        </div>
        
        {onAddItem && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddItem}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolioData.items.map((item) => {
          const Icon = getItemIcon(item.type);
          
          return (
            <div
              key={item.id}
              className={cn(
                'p-4 rounded-lg border transition-all hover:shadow-md',
                item.verified 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-white'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className="w-5 h-5 text-gray-600" />
                {item.url && (
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {item.views}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {item.likes}
                </div>
              </div>

              {!item.verified && onVerifyItem && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVerifyItem(item.id)}
                  className="w-full mt-3 text-green-600 hover:text-green-700"
                >
                  Verify
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}