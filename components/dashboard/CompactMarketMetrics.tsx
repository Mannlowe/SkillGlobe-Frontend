'use client';

import { TrendingUp, TrendingDown, Eye, Target, DollarSign, Brain, ArrowRight } from 'lucide-react';
import type { DashboardHeaderMetrics } from '@/types/dashboard';

interface CompactMarketMetricsProps {
  metrics: DashboardHeaderMetrics;
  onViewDetails?: () => void;
}

export default function CompactMarketMetrics({ metrics, onViewDetails }: CompactMarketMetricsProps) {
  const formatPercentile = (percentile: number) => {
    if (percentile <= 10) return 'Top 10%';
    if (percentile <= 25) return 'Top 25%';
    if (percentile <= 50) return 'Top 50%';
    return 'Average';
  };

  return (
    
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 w-full">
      {/* Compact Header with Key Metric */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Profile Insights</h3>
          {/* <p className="text-sm text-gray-600">
            You&apos;re in the {formatPercentile(metrics.market_visibility.search_rank_percentile)} of profiles
          </p> */}
        </div>
        {/* <button 
          onClick={onViewDetails}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View details
          <ArrowRight size={14} />
        </button> */}
      </div>

      {/* Horizontal Metrics Grid - 6 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 h-[120px]">
        {/* Profile Views */}
        <div className="bg-blue-50 rounded-lg p-3 ">
          <div className="flex items-center justify-between mb-1 mt-1">
            <Eye className="text-blue-500" size={16} />
            <span className={`text-xs font-medium ${
              metrics.market_visibility.trending_direction === 'up' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {metrics.market_visibility.trending_direction === 'up' ? '↑' : '→'}
            </span>
          </div>
          <p className="text-4xl font-bold text-blue-600">
            {metrics.market_visibility.profile_views_30d.toLocaleString()}
          </p>
          <p className="text-sm text-gray-700 font-medium mt-1">Matched Opportunities</p>
          {/* <p className="text-xs text-gray-600">{formatPercentile(metrics.market_visibility.search_rank_percentile)}</p> */}
        </div>

        {/* Response Rate */}
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1 mt-1">
            <Target className="text-green-500" size={16} />
            <span className={`text-xs font-medium ${
              metrics.opportunity_pipeline.response_rate > 20 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.opportunity_pipeline.response_rate > 20 ? '↑' : '↓'}
            </span>
          </div>
          <p className="text-4xl font-bold text-green-600">
            {metrics.opportunity_pipeline.response_rate}
          </p>
          <p className="text-sm text-gray-700 font-medium mt-1">Great Matches</p>
          {/* <p className="text-xs text-gray-600">Industry avg: 15-25%</p> */}
        </div>

        {/* Current Rate */}
        {/* <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <DollarSign className="text-orange-500" size={16} />
            <span className={`text-xs font-medium ${
              metrics.earning_metrics.earning_trend_6m > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.earning_metrics.earning_trend_6m > 0 ? '+' : ''}{metrics.earning_metrics.earning_trend_6m}%
            </span>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            ${metrics.earning_metrics.current_rate}
          </p>
          <p className="text-xs text-gray-700 font-medium">Current Rate</p>
          <p className="text-xs text-gray-600">{metrics.earning_metrics.market_rate_position}</p>
        </div> */}

        {/* Career Score */}
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1 mt-1">
            <Brain className="text-purple-500" size={16} />
            <span className="text-xs font-medium text-gray-600">
              /100
            </span>
          </div>
          <p className="text-4xl font-bold text-purple-600">
            {metrics.career_momentum.skill_demand_score}
          </p>
          <p className="text-sm text-gray-700 font-medium mt-1">Total Applications</p>
          {/* <p className="text-xs text-gray-600">Skill demand</p> */}
        </div>

        {/* Active Applications */}
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1 mt-1">
            <TrendingUp className="text-yellow-600" size={16} />
            <span className="text-xs font-medium text-blue-600">
              {metrics.opportunity_pipeline.interview_conversion}
            </span>
          </div>
          <p className="text-4xl font-bold text-yellow-600">
            {metrics.opportunity_pipeline.active_applications}
          </p>
          <p className="text-sm text-gray-700 font-medium mt-1">New This Week</p>
          {/* <p className="text-xs text-gray-600">Interview rate</p> */}
        </div>

        {/* Network Growth */}
        <div className="bg-indigo-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1 mt-1">
            <Brain className="text-indigo-500" size={16} />
            <span className="text-xs font-medium text-green-600">
              +{metrics.career_momentum.network_growth_rate}
            </span>
          </div>
          <p className="text-4xl font-bold text-indigo-600">
            {metrics.career_momentum.learning_activity_score}%
          </p>
          <p className="text-sm text-gray-700 font-medium mt-1">Response Rate</p>
          {/* <p className="text-xs text-gray-600">Connections/mo</p> */}
        </div>
      </div>
    </div>
  );
}