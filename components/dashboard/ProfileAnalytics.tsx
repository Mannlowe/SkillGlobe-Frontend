'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Search, 
  MousePointer, 
  Users,
  Target,
  Award,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import type { ProfileAnalytics } from '@/types/profile-optimization';

interface ProfileAnalyticsProps {
  analytics: ProfileAnalytics;
  onViewDetails?: (section: string) => void;
}

export default function ProfileAnalytics({ analytics, onViewDetails }: ProfileAnalyticsProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-green-600" size={16} />;
      case 'down': return <TrendingDown className="text-red-600" size={16} />;
      case 'stable': return <Minus className="text-gray-600" size={16} />;
    }
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'text-purple-600 bg-purple-50';
    if (percentile >= 75) return 'text-green-600 bg-green-50';
    if (percentile >= 50) return 'text-blue-600 bg-blue-50';
    if (percentile >= 25) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getImprovementColor = (percentage: number) => {
    if (percentage >= 50) return 'text-green-600';
    if (percentage >= 25) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className="space-y-6">
      {/* Visibility Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Profile Visibility</h3>
          {getTrendIcon(analytics.visibility_metrics.view_trend)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Eye className="text-blue-600" size={20} />
              <span className="text-xs text-blue-600 font-medium">
                {analytics.visibility_metrics.view_trend === 'up' ? '+23%' : '-5%'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.visibility_metrics.profile_views}
            </p>
            <p className="text-sm text-gray-600">Profile Views</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Search className="text-green-600" size={20} />
              <span className="text-xs text-green-600 font-medium">
                {analytics.visibility_metrics.view_trend === 'up' ? '+15%' : '-3%'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.visibility_metrics.search_appearances.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Search Appearances</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <MousePointer className="text-purple-600" size={20} />
              <span className="text-xs text-purple-600 font-medium">
                {analytics.visibility_metrics.click_through_rate}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(analytics.visibility_metrics.profile_views / analytics.visibility_metrics.search_appearances * 100)}%
            </p>
            <p className="text-sm text-gray-600">Click-through Rate</p>
          </div>
        </div>
      </div>

      {/* Competitive Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Competitive Analysis</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPercentileColor(analytics.competitive_analysis.market_position)}`}>
            Top {100 - analytics.competitive_analysis.market_position}%
          </div>
        </div>

        {/* Market Position */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Market Position</span>
            <span className="text-sm font-medium text-gray-900">
              {analytics.competitive_analysis.market_position}th percentile
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-blue-500 h-2 rounded-full"
              style={{ width: `${analytics.competitive_analysis.market_position}%` }}
            />
          </div>
        </div>

        {/* Peer Comparison */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Peer Comparison</h4>
          {Object.entries(analytics.competitive_analysis.peer_comparison).map(([category, score]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 capitalize">{category}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-10 text-right">
                  {score}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Improvement Areas */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
          <div className="flex flex-wrap gap-2">
            {analytics.competitive_analysis.improvement_areas.map((area, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Optimization Impact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Impact</h3>
        
        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {analytics.optimization_impact.before_optimization}%
            </p>
            <p className="text-sm text-gray-600">Before</p>
          </div>
          
          <div className="flex-1 mx-6">
            <div className="flex items-center justify-center">
              <ArrowUpRight className={`${getImprovementColor(analytics.optimization_impact.improvement_percentage)}`} size={32} />
              <span className={`text-2xl font-bold ml-2 ${getImprovementColor(analytics.optimization_impact.improvement_percentage)}`}>
                +{analytics.optimization_impact.improvement_percentage}%
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {analytics.optimization_impact.after_optimization}%
            </p>
            <p className="text-sm text-gray-600">After</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Key Improvements Made</h4>
          {analytics.optimization_impact.key_changes.map((change, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">{change}</span>
            </div>
          ))}
        </div>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails('full-report')}
            className="mt-4 w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Detailed Report
          </button>
        )}
      </div>
    </div>
  );
}