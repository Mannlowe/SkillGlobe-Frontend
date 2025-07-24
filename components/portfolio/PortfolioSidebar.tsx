'use client';

import { useState } from 'react';
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
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Completion</span>
          <span className="text-sm font-medium text-gray-900">
            {sections.filter(s => s.completed).length}/{sections.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${(sections.filter(s => s.completed).length / sections.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
