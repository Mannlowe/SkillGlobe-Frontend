'use client';

import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Circle, 
  Shield,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Award,
  Users,
  FileCheck,
  FolderOpen,
  Linkedin,
  Github,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerificationBadge as VerificationBadgeType, VerificationType } from '@/types/verification';

interface VerificationBadgeProps {
  badge: VerificationBadgeType;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  onClick?: () => void;
}

export default function VerificationBadge({ 
  badge, 
  size = 'medium',
  showDetails = true,
  onClick 
}: VerificationBadgeProps) {
  
  const getIcon = () => {
    switch (badge.type) {
      case VerificationType.IDENTITY:
        return Shield;
      case VerificationType.EMAIL:
        return Mail;
      case VerificationType.PHONE:
        return Phone;
      case VerificationType.EDUCATION:
        return GraduationCap;
      case VerificationType.EMPLOYMENT:
        return Briefcase;
      case VerificationType.SKILL_ASSESSMENT:
      case VerificationType.SKILL_ENDORSEMENT:
        return Award;
      case VerificationType.CERTIFICATION:
        return FileCheck;
      case VerificationType.PORTFOLIO:
        return FolderOpen;
      case VerificationType.SOCIAL_LINKEDIN:
        return Linkedin;
      case VerificationType.SOCIAL_GITHUB:
        return Github;
      case VerificationType.BACKGROUND_CHECK:
        return ShieldCheck;
      default:
        return Circle;
    }
  };

  const getStatusIcon = () => {
    const iconSize = size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-5 h-5';
    
    switch (badge.status) {
      case 'verified':
        return <CheckCircle className={cn(iconSize, `text-${badge.displayColor}-500`)} />;
      case 'pending':
        return <Clock className={cn(iconSize, 'text-yellow-500')} />;
      case 'failed':
        return <XCircle className={cn(iconSize, 'text-red-500')} />;
      default:
        return <Circle className={cn(iconSize, 'text-gray-400')} />;
    }
  };

  const getColorClasses = () => {
    if (badge.status !== 'verified') {
      return {
        border: 'border-gray-200',
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        badge: ''
      };
    }

    switch (badge.displayColor) {
      case 'gold':
        return {
          border: 'border-yellow-200',
          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
          text: 'text-yellow-700',
          badge: 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white'
        };
      case 'purple':
        return {
          border: 'border-purple-200',
          bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
          text: 'text-purple-700',
          badge: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
        };
      case 'green':
        return {
          border: 'border-green-200',
          bg: 'bg-green-50',
          text: 'text-green-700',
          badge: 'bg-green-500 text-white'
        };
      case 'blue':
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          badge: 'bg-blue-500 text-white'
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          badge: ''
        };
    }
  };

  const getTitle = () => {
    switch (badge.type) {
      case VerificationType.IDENTITY:
        return 'Identity Verified';
      case VerificationType.EMAIL:
        return 'Email Verified';
      case VerificationType.PHONE:
        return 'Phone Verified';
      case VerificationType.EDUCATION:
        return 'Education Verified';
      case VerificationType.EMPLOYMENT:
        return 'Employment Verified';
      case VerificationType.SKILL_ASSESSMENT:
        return 'Skills Tested';
      case VerificationType.SKILL_ENDORSEMENT:
        return 'Skills Endorsed';
      case VerificationType.CERTIFICATION:
        return 'Certifications Verified';
      case VerificationType.PORTFOLIO:
        return 'Portfolio Verified';
      case VerificationType.SOCIAL_LINKEDIN:
        return 'LinkedIn Connected';
      case VerificationType.SOCIAL_GITHUB:
        return 'GitHub Connected';
      case VerificationType.BACKGROUND_CHECK:
        return 'Background Checked';
      default:
        return 'Verification';
    }
  };

  const colors = getColorClasses();
  const Icon = getIcon();
  const sizeClasses = {
    small: 'p-2',
    medium: 'p-3',
    large: 'p-4'
  };

  if (!showDetails) {
    // Compact badge view (icon only)
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all',
          sizeClasses[size],
          colors.bg,
          colors.border,
          'border',
          onClick && 'cursor-pointer hover:shadow-md',
          badge.status === 'verified' && badge.displayColor === 'gold' && 'ring-2 ring-yellow-400 ring-opacity-30'
        )}
        onClick={onClick}
        title={getTitle()}
      >
        <Icon className={cn(
          size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-5 h-5',
          colors.text
        )} />
      </div>
    );
  }

  // Full badge view with details
  return (
    <div
      className={cn(
        'flex items-center space-x-3 p-4 rounded-lg border transition-all',
        colors.border,
        colors.bg,
        onClick && 'cursor-pointer hover:shadow-md',
        badge.status === 'verified' && badge.displayColor === 'gold' && 'ring-2 ring-yellow-400 ring-opacity-30'
      )}
      onClick={onClick}
    >
      {getStatusIcon()}
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h3 className={cn('font-medium', colors.text)}>{getTitle()}</h3>
          {badge.status === 'verified' && (
            <span className={cn(
              'px-2 py-1 text-xs font-medium rounded-full',
              colors.badge
            )}>
              Verified
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
        
        {badge.status === 'verified' && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              Verified on {new Date(badge.verifiedDate!).toLocaleDateString()}
            </p>
            {badge.benefits.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {badge.benefits.slice(0, 3).map((benefit, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {benefit}
                  </span>
                ))}
                {badge.benefits.length > 3 && (
                  <span className="text-xs text-gray-500">+{badge.benefits.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {badge.status === 'not_started' && (
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Verify Now
        </button>
      )}
      
      {badge.status === 'pending' && (
        <span className="text-yellow-600 text-sm font-medium">
          In Progress
        </span>
      )}
    </div>
  );
}