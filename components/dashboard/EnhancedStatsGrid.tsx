'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Star, Award, Info } from 'lucide-react';
import type { EnhancedMarketplaceStats } from '@/types/dashboard';

interface EnhancedStatsGridProps {
  stats: EnhancedMarketplaceStats;
  onActionClick?: (action: string) => void;
  timeframe?: '7d' | '30d' | '90d' | '1y';
}

export default function EnhancedStatsGrid({ stats, onActionClick, timeframe = '30d' }: EnhancedStatsGridProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const statSections = [
    {
      id: 'visibility',
      title: 'Visibility & Reach',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      stats: [
        {
          label: 'Profile Views',
          value: stats.visibility_stats.profile_views.current.toLocaleString(),
          change: `${stats.visibility_stats.profile_views.vs_last_month > 0 ? '+' : ''}${stats.visibility_stats.profile_views.vs_last_month}%`,
          benchmark: stats.visibility_stats.profile_views.benchmark_message,
          isPositive: stats.visibility_stats.profile_views.vs_last_month > 0,
        },
        {
          label: 'Search Rank',
          value: `#${stats.visibility_stats.search_appearances.search_rank_average}`,
          sublabel: `Found for: ${stats.visibility_stats.search_appearances.keywords_found_for.slice(0, 3).join(', ')}`,
          action: { label: 'Optimize keywords', id: 'optimize_keywords' },
        },
      ],
    },
    {
      id: 'applications',
      title: 'Application Performance',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      stats: [
        {
          label: 'Response Rate',
          value: `${stats.application_analytics.success_metrics.response_rate}%`,
          benchmark: 'Industry avg: 15-25%',
          status: stats.application_analytics.competitive_analysis.vs_similar_profiles,
          isPositive: stats.application_analytics.success_metrics.response_rate > 20,
        },
        {
          label: 'Interview Rate',
          value: `${stats.application_analytics.success_metrics.interview_rate}%`,
          benchmark: 'Industry avg: 5-10%',
          isPositive: stats.application_analytics.success_metrics.interview_rate > 7,
        },
      ],
    },
    {
      id: 'skills',
      title: 'Skill Market Intelligence',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      stats: [
        {
          label: 'Skill Demand Score',
          value: `${stats.skill_market_intel.competitive_position.skill_rarity_score}/100`,
          sublabel: stats.skill_market_intel.competitive_position.specialization_recommendation,
          action: { label: 'View hot skills', id: 'view_hot_skills' },
        },
        {
          label: 'Trending Skills',
          value: `${stats.skill_market_intel.demand_analysis.hot_skills.length}`,
          sublabel: `to add: ${stats.skill_market_intel.demand_analysis.hot_skills.slice(0, 2).join(', ')}`,
          isPositive: true,
        },
      ],
    },
    {
      id: 'compensation',
      title: 'Compensation Insights',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      stats: [
        {
          label: 'Market Position',
          value: `${stats.compensation_insights.market_rate_analysis.percentile_position}th %ile`,
          benchmark: `$${stats.compensation_insights.market_rate_analysis.market_min}-$${stats.compensation_insights.market_rate_analysis.market_max}/hr`,
          action: { label: 'Salary negotiation guide', id: 'salary_guide' },
        },
        {
          label: 'Rate Increase Potential',
          value: `${stats.compensation_insights.market_rate_analysis.rate_increase_confidence}%`,
          sublabel: 'confidence score',
          isPositive: stats.compensation_insights.market_rate_analysis.rate_increase_confidence > 50,
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {statSections.map((section) => (
        <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Section Header */}
          <div 
            className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                  <section.icon className={section.color} size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Info size={16} />
              </button>
            </div>
          </div>

          {/* Stats Content */}
          <div className="p-6">
            <div className="space-y-4">
              {section.stats.map((stat, idx) => (
                <div key={idx} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    {'change' in stat && stat.change && (
                      <span className={`text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  
                  {'benchmark' in stat && stat.benchmark && (
                    <p className="text-xs text-gray-500 mb-1">{stat.benchmark}</p>
                  )}
                  
                  {'sublabel' in stat && stat.sublabel && (
                    <p className="text-xs text-gray-600 mb-2">{stat.sublabel}</p>
                  )}
                  
                  {'status' in stat && stat.status && (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      stat.status === 'Outperforming' ? 'bg-green-100 text-green-800' :
                      stat.status === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {stat.status}
                    </span>
                  )}
                  
                  {'action' in stat && stat.action && (
                    <button 
                      onClick={() => onActionClick?.(stat.action.id)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 mt-2"
                    >
                      {stat.action.label} →
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Expanded Details */}
            {expandedSection === section.id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  {section.id === 'visibility' && (
                    <>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Top Keywords:</span> {stats.visibility_stats.search_appearances.keywords_found_for.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Improvement Tips:</span> {stats.visibility_stats.search_appearances.improvement_suggestions.join(', ')}
                      </p>
                    </>
                  )}
                  
                  {section.id === 'applications' && (
                    <>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Success Factors:</span> {stats.application_analytics.competitive_analysis.success_factors.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Areas to Improve:</span> {stats.application_analytics.competitive_analysis.improvement_areas.join(', ')}
                      </p>
                    </>
                  )}
                  
                  {section.id === 'skills' && (
                    <>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Hot Skills:</span> {stats.skill_market_intel.demand_analysis.hot_skills.join(', ')}
                      </p>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Salary Premium Skills:</p>
                        {stats.skill_market_intel.demand_analysis.salary_premium_skills.slice(0, 3).map((skill, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-gray-600">
                            <span>{skill.skill}</span>
                            <span className="text-green-600">+{skill.premium}%</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {section.id === 'compensation' && (
                    <>
                      <div className="space-y-1">
                        {stats.compensation_insights.earning_opportunities.high_paying_skills.slice(0, 3).map((skill, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-600">
                            <span>{skill.skill}</span>
                            <span className="font-medium">${skill.avg_salary}/hr</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}