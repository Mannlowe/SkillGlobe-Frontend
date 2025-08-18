'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  ChevronRight, 
  Sparkles,
  BarChart3,
  Users,
  Briefcase,
  BookOpen,
  CheckCircle,
  Circle,
  Info
} from 'lucide-react';
import type { ProfileOptimizationHub, ProfileTask } from '@/types/profile-optimization';

interface StrategicProfileOptimizerProps {
  profileData: ProfileOptimizationHub;
  completionTasks: ProfileTask[];
  onTaskComplete: (taskId: string) => void;
  onSkillAdd: (skill: string) => void;
  marketImpactMode?: boolean;
}

export default function StrategicProfileOptimizer({
  profileData,
  completionTasks,
  onTaskComplete,
  onSkillAdd,
  marketImpactMode = true
}: StrategicProfileOptimizerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Tasks', icon: Target },
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'certification', label: 'Certifications', icon: Award }
  ];

  const filteredTasks = selectedCategory === 'all' 
    ? completionTasks 
    : completionTasks.filter(task => task.category === selectedCategory);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-orange-600 bg-orange-50';
      case 'Low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTaskIcon = (category: string) => {
    switch (category) {
      case 'profile': return Users;
      case 'skills': return BookOpen;
      case 'portfolio': return Briefcase;
      case 'certification': return Award;
      default: return Target;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Strategic Profile Optimization</h2>
          <p className="text-gray-600 mt-1">
            Market-driven tasks to boost your visibility and opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {profileData.strategic_completion.market_impact_score}%
            </p>
            <p className="text-xs text-gray-600">Market Impact Score</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Market Impact Summary */}
      {marketImpactMode && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-purple-600" size={20} />
            <h3 className="font-semibold text-gray-900">Optimization ROI</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {profileData.strategic_completion.optimization_roi.map((roi, index) => (
              <div key={index} className="bg-white rounded-lg p-3">
                <p className="font-medium text-sm text-gray-900">{roi.task}</p>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-semibold text-green-600">{roi.impact}</span>
                  {' for '}
                  <span className="font-semibold text-blue-600">{roi.time}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filters */}
      {/* <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const count = category.id === 'all' 
            ? completionTasks.length 
            : completionTasks.filter(t => t.category === category.id).length;
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={16} />
              {category.label}
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div> */}

      {/* Task List */}
      {/* <div className="space-y-3">
        {filteredTasks.map((task) => {
          const TaskIcon = getTaskIcon(task.category);
          const isExpanded = expandedTask === task.id;
          
          return (
            <div
              key={task.id}
              className={`border rounded-lg transition-all ${
                task.status === 'completed' 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedTask(isExpanded ? null : task.id)}
              >
                <div className="flex items-start gap-3">
               
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (task.status !== 'completed') {
                        onTaskComplete(task.id);
                      }
                    }}
                    className="mt-0.5"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <Circle className="text-gray-400 hover:text-gray-600" size={20} />
                    )}
                  </button>

               
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className={`font-medium ${
                          task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      </div>
                      
            
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{task.priority_score}</p>
                          <p className="text-xs text-gray-600">Priority</p>
                        </div>
                      </div>
                    </div>

                 
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(task.market_impact)}`}>
                        {task.market_impact} Impact
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock size={12} />
                        {task.time_investment}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <TrendingUp size={12} />
                        +{task.completion_boost}% completion
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <TaskIcon size={12} />
                        {task.category}
                      </span>
                    </div>
                  </div>

                 
                  <ChevronRight 
                    className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                    size={20} 
                  />
                </div>
              </div>

           
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <div className="pt-4">
                    <div className="flex items-start gap-2">
                      <Info className="text-blue-600 mt-0.5" size={16} />
                      <div>
                        <h5 className="font-medium text-sm text-gray-900 mb-1">Market Rationale</h5>
                        <p className="text-sm text-gray-600">{task.market_rationale}</p>
                      </div>
                    </div>
                    
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => onTaskComplete(task.id)}
                        className="mt-4 w-full py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                      >
                        Complete Task
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div> */}

      {/* Competitive Gaps */}
      {/* {profileData.strategic_completion.competitive_gaps.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 size={18} />
            Competitive Gaps to Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {profileData.strategic_completion.competitive_gaps.map((gap, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-gray-600">{gap}</span>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}