'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Ripple effect component
interface RippleProps {
  duration?: number;
  color?: string;
}

export function useRipple({ duration = 600, color = 'rgba(255, 255, 255, 0.6)' }: RippleProps = {}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; size: number; id: number }>>([]);
  
  const addRipple = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const id = Date.now();

    const newRipple = { x, y, size, id };
    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, duration);
  };

  const rippleElements = ripples.map(ripple => (
    <span
      key={ripple.id}
      className="absolute rounded-full pointer-events-none animate-ping"
      style={{
        left: ripple.x,
        top: ripple.y,
        width: ripple.size,
        height: ripple.size,
        backgroundColor: color,
        animationDuration: `${duration}ms`,
      }}
    />
  ));

  return { addRipple, rippleElements };
}

// Magnetic button component
interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticButton({ 
  children, 
  strength = 15, 
  className, 
  ...props 
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    
    const x = deltaX * strength;
    const y = deltaY * strength;
    
    setTransform(`translate(${x}px, ${y}px)`);
  };

  const handleMouseLeave = () => {
    setTransform('');
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "transition-transform duration-300 ease-out active:scale-95",
        className
      )}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}

// Floating action button with micro-interactions
interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  tooltip?: string;
}

export function FloatingActionButton({
  icon,
  onClick,
  className,
  size = 'md',
  color = 'bg-orange-500',
  tooltip
}: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const { addRipple, rippleElements } = useRipple();

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  return (
    <div className="relative">
      <button
        className={cn(
          "relative overflow-hidden rounded-full shadow-lg text-white",
          "transition-all duration-200 ease-out",
          "hover:shadow-xl hover:scale-110",
          "active:scale-95",
          sizes[size],
          color,
          isPressed && "scale-95",
          className
        )}
        onClick={(e) => {
          addRipple(e);
          onClick?.();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        title={tooltip}
      >
        <div className={cn(
          "flex items-center justify-center transition-transform duration-200",
          isHovered && "scale-110",
          iconSizes[size]
        )}>
          {icon}
        </div>
        {rippleElements}
      </button>
      
      {/* Tooltip */}
      {tooltip && isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

// Interactive card with hover effects
interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverScale?: boolean;
  shadowIntensity?: 'sm' | 'md' | 'lg';
}

export function InteractiveCard({
  children,
  onClick,
  className,
  hoverScale = true,
  shadowIntensity = 'md'
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addRipple, rippleElements } = useRipple();

  const shadows = {
    sm: 'shadow-sm hover:shadow-md',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl'
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white rounded-lg transition-all duration-300 ease-out cursor-pointer",
        shadows[shadowIntensity],
        hoverScale && "hover:scale-105",
        "active:scale-95",
        className
      )}
      onClick={(e) => {
        addRipple(e);
        onClick?.();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {rippleElements}
      
      {/* Hover overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )} />
    </div>
  );
}

// Animated checkbox
interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedCheckbox({
  checked,
  onChange,
  label,
  className,
  size = 'md'
}: AnimatedCheckboxProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <label className={cn("flex items-center space-x-2 cursor-pointer", className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={cn(
          "relative border-2 rounded transition-all duration-200",
          sizes[size],
          checked 
            ? "bg-orange-500 border-orange-500" 
            : "bg-white border-gray-300 hover:border-gray-400"
        )}>
          {/* Checkmark */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-200",
            checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}>
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>
      {label && (
        <span className="text-gray-700 select-none">{label}</span>
      )}
    </label>
  );
}

// Animated toggle switch
interface AnimatedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedToggle({
  checked,
  onChange,
  label,
  className,
  size = 'md'
}: AnimatedToggleProps) {
  const sizes = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-8'
  };

  const knobSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const translateX = {
    sm: checked ? 'translate-x-4' : 'translate-x-0.5',
    md: checked ? 'translate-x-6' : 'translate-x-1',
    lg: checked ? 'translate-x-7' : 'translate-x-1'
  };

  return (
    <label className={cn("flex items-center space-x-3 cursor-pointer", className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={cn(
          "relative rounded-full transition-all duration-300 ease-in-out",
          sizes[size],
          checked 
            ? "bg-orange-500" 
            : "bg-gray-300"
        )}>
          <div className={cn(
            "absolute top-0.5 bg-white rounded-full shadow-lg transition-all duration-300 ease-in-out",
            knobSizes[size],
            translateX[size]
          )} />
        </div>
      </div>
      {label && (
        <span className="text-gray-700 select-none">{label}</span>
      )}
    </label>
  );
}