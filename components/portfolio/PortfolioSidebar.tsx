'use client';

import { useState, useMemo } from 'react';
import { Upload, User, GraduationCap, Briefcase, Award, FileText, X, ChevronLeft } from 'lucide-react';

interface PortfolioSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sections: {
    id: string;
    name: string;
    icon: any;
    completed: boolean;
  }[];
  onClose: () => void;
}

export default function PortfolioSidebar({ 
  activeSection, 
  setActiveSection, 
  sections,
  onClose
}: PortfolioSidebarProps) {
  // Function to determine the color of each progress bar segment
  const getProgressBarColor = (index: number, completedCount: number): string => {
    // Calculate how many segments should be colored
    const completedIndex = completedCount - 1;
    
    if (index <= completedIndex) {
      // Use a gradient of colors for completed segments
      if (index < 3) return 'bg-red-500'; // First few are red
      if (index < 5) return 'bg-orange-400'; // Next few are orange
      return 'bg-gray-300'; // Rest are gray
    }
    
    // Incomplete segments
    return 'bg-gray-200';
  };
  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 h-[82px]">
        <h2 className="font-semibold text-gray-900">Portfolio</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title="Close portfolio sidebar"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto font-rubik">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex items-center w-full px-4 py-3 rounded-lg transition-colors relative
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' 
                  : section.completed
                  ? 'text-green-600 hover:bg-gray-100'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon size={20} className="mr-3" />
              <span className="font-medium">{section.name}</span>
              {section.completed && (
                <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
              )}
            </button>
          );
        })}
      </nav>
      
      {/* Progress indicator */}
      <div className="p-4 border-t border-gray-200">
        {/* Progress Card - Styled like the reference image */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-gray-900">
              {sections.filter(s => s.completed).length === sections.length 
                ? "All Done!" 
                : "Almost There!"}
            </h3>
            <span className="text-sm font-medium text-white bg-red-500 px-2 py-0.5 rounded-full">
              {Math.round((sections.filter(s => s.completed).length / sections.length) * 100)}%
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mb-3">
            {sections.filter(s => s.completed).length === sections.length 
              ? "You've completed all steps in your portfolio." 
              : "Complete the remaining steps in the checklist before going live."}
          </p>
          
          {/* Progress bar with colored segments */}
          <div className="flex space-x-0.5">
            {sections.map((section, index) => (
              <div 
                key={section.id}
                className={`h-2 flex-1 ${getProgressBarColor(index, sections.filter(s => s.completed).length)}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
