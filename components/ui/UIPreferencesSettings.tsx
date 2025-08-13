'use client';

import React from 'react';
import { Monitor, Smartphone, RotateCcw, Zap, Keyboard, Layout, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIPreferences } from '@/contexts/UIPreferencesContext';
import { cn } from '@/lib/utils';

interface UIPreferencesSettingsProps {
  className?: string;
}

export default function UIPreferencesSettings({ className }: UIPreferencesSettingsProps) {
  const { 
    preferences, 
    updatePreference, 
    toggleLayout, 
    resetToDefaults, 
    isModernLayout 
  } = useUIPreferences();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Layout Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Layout className="w-5 h-5 mr-2" />
          Layout Style
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Modern Layout */}
          <div
            onClick={() => updatePreference('layout', 'modern')}
            className={cn(
              "relative p-4 border-2 rounded-lg cursor-pointer transition-all",
              isModernLayout 
                ? "border-orange-500 bg-orange-50" 
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Modern UI</h4>
              {isModernLayout && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Context-aware sidebar, horizontal navigation, smart features
            </p>
            {/* Mock preview */}
            <div className="bg-white border border-gray-200 rounded p-2 text-xs">
              <div className="flex items-center space-x-1 mb-1">
                <div className="w-8 h-1 bg-orange-300 rounded"></div>
                <div className="w-12 h-1 bg-gray-300 rounded"></div>
                <div className="w-10 h-1 bg-gray-300 rounded"></div>
              </div>
              <div className="flex space-x-1">
                <div className="w-6 h-8 bg-blue-100 rounded"></div>
                <div className="flex-1 h-8 bg-gray-100 rounded"></div>
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
              <Zap className="w-3 h-3" />
              <span>Smart features</span>
              <Keyboard className="w-3 h-3" />
              <span>Shortcuts</span>
            </div>
          </div>

          {/* Classic Layout */}
          <div
            onClick={() => updatePreference('layout', 'classic')}
            className={cn(
              "relative p-4 border-2 rounded-lg cursor-pointer transition-all",
              !isModernLayout 
                ? "border-orange-500 bg-orange-50" 
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Classic UI</h4>
              {!isModernLayout && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Traditional sidebar navigation, familiar interface
            </p>
            {/* Mock preview */}
            <div className="bg-white border border-gray-200 rounded p-2 text-xs">
              <div className="w-full h-1 bg-gray-300 rounded mb-1"></div>
              <div className="flex space-x-1">
                <div className="w-4 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 h-8 bg-gray-100 rounded"></div>
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
              <Monitor className="w-3 h-3" />
              <span>Familiar</span>
              <span>•</span>
              <span>Stable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern UI Specific Settings */}
      {isModernLayout && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Modern UI Settings</h3>
          <div className="space-y-4">
            {/* Contextual Actions */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Contextual Actions</h4>
                <p className="text-sm text-gray-600">Show smart actions based on current page</p>
              </div>
              <button
                onClick={() => updatePreference('enableContextualActions', !preferences.enableContextualActions)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  preferences.enableContextualActions ? "bg-orange-500" : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    preferences.enableContextualActions ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Keyboard Shortcuts</h4>
                <p className="text-sm text-gray-600">Enable keyboard navigation (Ctrl+/, Ctrl+K, etc.)</p>
              </div>
              <button
                onClick={() => updatePreference('enableKeyboardShortcuts', !preferences.enableKeyboardShortcuts)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  preferences.enableKeyboardShortcuts ? "bg-orange-500" : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    preferences.enableKeyboardShortcuts ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {/* Compact Mode */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Compact Mode</h4>
                <p className="text-sm text-gray-600">Reduce spacing and use smaller components</p>
              </div>
              <button
                onClick={() => updatePreference('compactMode', !preferences.compactMode)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  preferences.compactMode ? "bg-orange-500" : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    preferences.compactMode ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={toggleLayout}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Switch to {isModernLayout ? 'Classic' : 'Modern'}</span>
          </Button>
          
          <Button
            onClick={resetToDefaults}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Defaults</span>
          </Button>
        </div>
      </div>

      {/* Migration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Palette className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">UI Migration</h4>
            <p className="text-sm text-blue-700 mt-1">
              You can switch between layouts anytime. Your preference is saved automatically. 
              Use <code className="bg-blue-100 px-1 rounded">?ui=modern</code> or <code className="bg-blue-100 px-1 rounded">?ui=classic</code> 
              in the URL to override your preference temporarily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}