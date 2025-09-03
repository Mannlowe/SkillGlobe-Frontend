'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Standardized button variants based on the analysis
const buttonVariants = cva(
  // Base styles - consistent across all buttons
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
  {
    variants: {
      variant: {
        // Primary gradient button (most common in SkillGlobe)
        primary: 'bg-gradient-to-r from-orange-500 to-blue-500 text-white hover:shadow-lg hover:from-orange-600 hover:to-blue-600 focus:ring-orange-500',
        
        // Secondary solid button
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        
        // Outline button
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-orange-500',
        
        // Ghost button (minimal styling)
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        
        // Destructive/danger button
        destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        
        // Link-style button
        link: 'text-orange-600 underline-offset-4 hover:underline focus:ring-orange-500',
        
        // Success button
        success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
        
        // Orange solid (for consistency with existing patterns)
        orange: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500',
        
        // Blue solid  
        blue: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
        
        // Gradient border button
        'gradient-border': 'border-2 border-transparent bg-white text-transparent bg-clip-padding hover:shadow-lg relative before:absolute before:inset-0 before:p-[2px] before:rounded-full before:bg-gradient-to-r before:from-orange-500 before:to-blue-500 before:content-[""] before:-z-10 before:m-[-2px]',
        
        // Get Started button style (from first image)
        'gradient-text': 'bg-white text-[#4a7bfc] border border-orange-500 rounded-lg px-6 py-2 font-medium hover:translate-y-[-4px]',
        
        // Gradient text only (for use inside other elements)
        'gradient-text-only': 'bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent'
      },
      size: {
        // Small buttons (32px height)
        sm: 'h-8 px-3 text-sm',
        
        // Default buttons (40px height) 
        default: 'h-10 px-4 text-sm',
        
        // Large buttons (48px height)
        lg: 'h-12 px-6 text-base',
        
        // Extra large (for hero sections, 56px height)
        xl: 'h-14 px-8 text-lg',
        
        // Icon only buttons
        icon: 'h-10 w-10 p-0',
        
        // Small icon buttons
        'icon-sm': 'h-8 w-8 p-0',
        
        // Large icon buttons
        'icon-lg': 'h-12 w-12 p-0'
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      fullWidth: false
    }
  }
);

interface StandardizedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export const StandardizedButton = React.forwardRef<HTMLButtonElement, StandardizedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        
        {leftIcon && !loading && (
          <span className="mr-2 flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        {variant === 'gradient-text' ? (
          <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
            {children}
          </span>
        ) : (
          children
        )}
        
        {rightIcon && (
          <span className="ml-2 flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
        
        {loading && (
          <span className="sr-only">Loading...</span>
        )}
      </button>
    );
  }
);

StandardizedButton.displayName = 'StandardizedButton';

// Button Group Component for consistent spacing
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ButtonGroup({ 
  children, 
  orientation = 'horizontal',
  spacing = 'md',
  className 
}: ButtonGroupProps) {
  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    md: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
    lg: orientation === 'horizontal' ? 'space-x-6' : 'space-y-6',
  };

  return (
    <div 
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        spacingClasses[spacing],
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
}

// Export variants for external use
export { buttonVariants };
export type ButtonVariants = VariantProps<typeof buttonVariants>;