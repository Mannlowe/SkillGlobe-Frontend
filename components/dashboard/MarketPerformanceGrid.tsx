'use client';

import { TrendingUp, TrendingDown, Eye, Target, DollarSign, Users, Brain, Briefcase } from 'lucide-react';
import type { DashboardHeaderMetrics, MarketMetricCard } from '@/types/dashboard';

interface MarketPerformanceGridProps {
  metrics: DashboardHeaderMetrics;
  onDrillDown?: (metric: string) => void;
}

export default function MarketPerformanceGrid({ metrics, onDrillDown }: MarketPerformanceGridProps) {
  const formatPercentile = (percentile: number) => {
    if (percentile <= 10) return 'Top 10%';
    if (percentile <= 25) return 'Top 25%';
    if (percentile <= 50) return 'Top 50%';
    return 'Average';
  };

  const performanceCards: MarketMetricCard[] = [
    {
      title: 'Market Visibility',
      value: metrics.market_visibility.profile_views_30d.toLocaleString(),
      change: `${formatPercentile(metrics.market_visibility.search_rank_percentile)}`,
      trend: metrics.market_visibility.trending_direction,
      icon: Eye,
      color: 'bg-blue-500',
      benchmark: metrics.market_visibility.industry_comparison,
    },
    {
      title: 'Application Success',
      value: `${metrics.opportunity_pipeline.response_rate}%`,
      change: metrics.opportunity_pipeline.response_rate > 20 ? '+Above avg' : 'Below avg',
      trend: metrics.opportunity_pipeline.response_rate > 20 ? 'up' : 'down',
      icon: Target,
      color: 'bg-green-500',
      benchmark: 'Industry avg: 15-25%',
    },
    {
      title: 'Market Rate Position',
      value: metrics.earning_metrics.market_rate_position,
      change: `${metrics.earning_metrics.earning_trend_6m > 0 ? '+' : ''}${metrics.earning_metrics.earning_trend_6m}%`,
      trend: metrics.earning_metrics.earning_trend_6m > 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'bg-orange-500',
      benchmark: `Target: $${metrics.earning_metrics.next_rate_target}/hr`,
    },
    {
      title: 'Career Momentum',
      value: `${metrics.career_momentum.skill_demand_score}/100`,
      change: `${metrics.career_momentum.network_growth_rate} connections/mo`,
      trend: metrics.career_momentum.skill_demand_score > 70 ? 'up' : 'stable',
      icon: Brain,
      color: 'bg-purple-500',
      benchmark: 'Skill demand score',
    },
  ];

  return (
    <div className="mb-8">
      {/* Header KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onDrillDown?.(card.title.toLowerCase().replace(' ', '_'))}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{card.value}</p>
                
                {/* Change indicator */}
                <div className="flex items-center gap-2 mb-2">
                  {card.trend && (
                    <>
                      {card.trend === 'up' ? (
                        <TrendingUp className="text-green-500" size={16} />
                      ) : card.trend === 'down' ? (
                        <TrendingDown className="text-red-500" size={16} />
                      ) : (
                        <div className="w-4 h-[2px] bg-gray-400" />
                      )}
                    </>
                  )}
                  <span className={`text-sm font-medium ${
                    card.trend === 'up' ? 'text-green-600' : 
                    card.trend === 'down' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {card.change}
                  </span>
                </div>
                
                {/* Benchmark */}
                {card.benchmark && (
                  <p className="text-xs text-gray-500">{card.benchmark}</p>
                )}
              </div>
              
              {/* Icon */}
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Market Position:</span> You're outperforming {metrics.market_visibility.search_rank_percentile}% of similar profiles
            </p>
          </div>
          
          <button 
            className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
            onClick={() => onDrillDown?.('full_analysis')}
          >
            View detailed analysis →
          </button>
        </div>
      </div>
    </div>
  );
}