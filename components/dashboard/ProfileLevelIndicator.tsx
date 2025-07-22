'use client';

import React, { useEffect, useState } from 'react';
import type { ProfileLevelIndicatorProps } from '@/types/gamification';

export default function ProfileLevelIndicator({
  level,
  showProgress = true,
  size = 'medium',
  animated = true
}: ProfileLevelIndicatorProps) {
  const [progressWidth, setProgressWidth] = useState(animated ? 0 : level.progress_percentage);
  const [isVisible, setIsVisible] = useState(!animated);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setProgressWidth(level.progress_percentage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animated, level.progress_percentage]);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-32',
          badge: 'w-16 h-16 text-2xl',
          text: 'text-xs',
          title: 'text-sm',
          progress: 'h-1'
        };
      case 'large':
        return {
          container: 'w-64',
          badge: 'w-32 h-32 text-5xl',
          text: 'text-base',
          title: 'text-xl',
          progress: 'h-3'
        };
      default:
        return {
          container: 'w-48',
          badge: 'w-24 h-24 text-3xl',
          text: 'text-sm',
          title: 'text-lg',
          progress: 'h-2'
        };
    }
  };

  const sizes = getSizeClasses();

  return (
    <div className={`flex flex-col items-center ${sizes.container} ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Level Badge */}
      <div
        className={`${sizes.badge} ${level.badge_color} rounded-full flex items-center justify-center text-white shadow-lg relative overflow-hidden transform transition-transform duration-500 ${
          isVisible ? 'scale-100' : 'scale-0'
        }`}
      >
        {/* Gradient overlay for shine effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/20" />
        
        {/* Badge icon */}
        <span className="relative z-10">{level.badge_icon}</span>
        
        {/* Animated ring */}
        {animated && (
          <div
            className={`absolute inset-0 border-4 border-white/30 rounded-full transition-all duration-500 ${
              isVisible ? 'scale-100 opacity-100' : 'scale-150 opacity-0'
            }`}
          />
        )}
      </div>

      {/* Level Name */}
      <h3
        className={`${sizes.title} font-bold text-gray-900 mt-3 transition-all duration-500 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {level.name}
      </h3>

      {/* Level Tier */}
      <p
        className={`${sizes.text} text-gray-600 transition-all duration-500 delay-400 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {level.level} Level
      </p>

      {/* Progress Bar */}
      {showProgress && (
        <div
          className={`w-full mt-4 transition-opacity duration-500 delay-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`${sizes.text} text-gray-600`}>
              {level.current_score.toLocaleString()} pts
            </span>
            <span className={`${sizes.text} text-gray-600`}>
              {level.score_range[1].toLocaleString()} pts
            </span>
          </div>
          
          <div className={`w-full bg-gray-200 rounded-full ${sizes.progress} overflow-hidden`}>
            <div
              className={`h-full ${level.badge_color} rounded-full relative overflow-hidden transition-all duration-1000 ease-out`}
              style={{ width: `${progressWidth}%` }}
            >
              {/* Animated shimmer effect */}
              {animated && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                />
              )}
            </div>
          </div>
          
          <p className={`${sizes.text} text-center text-gray-600 mt-1`}>
            {level.progress_percentage}% to next level
          </p>
        </div>
      )}

      {/* Benefits Preview */}
      {size !== 'small' && level.benefits.length > 0 && (
        <div
          className={`mt-4 text-center transition-opacity duration-500 delay-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className={`${sizes.text} text-gray-500 mb-2`}>Current Benefits:</p>
          <div className="flex flex-wrap justify-center gap-1">
            {level.benefits.slice(0, 2).map((benefit, index) => (
              <span
                key={index}
                className={`${sizes.text} px-2 py-1 bg-gray-100 text-gray-700 rounded-full`}
              >
                {benefit}
              </span>
            ))}
            {level.benefits.length > 2 && (
              <span className={`${sizes.text} text-gray-500`}>
                +{level.benefits.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}