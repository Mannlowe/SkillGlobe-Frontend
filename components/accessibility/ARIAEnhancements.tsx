'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccessibilityContext } from './AccessibilityProvider';

// ARIA Label Context for dynamic label management
interface ARIAContextType {
  registerElement: (id: string, label: string, description?: string) => void;
  updateLabel: (id: string, label: string) => void;
  updateDescription: (id: string, description: string) => void;
  getLabel: (id: string) => string | undefined;
  getDescription: (id: string) => string | undefined;
}

const ARIAContext = createContext<ARIAContextType | undefined>(undefined);

export function ARIAProvider({ children }: { children: React.ReactNode }) {
  const [labels, setLabels] = useState<Map<string, string>>(new Map());
  const [descriptions, setDescriptions] = useState<Map<string, string>>(new Map());

  const registerElement = (id: string, label: string, description?: string) => {
    setLabels(prev => new Map(prev).set(id, label));
    if (description) {
      setDescriptions(prev => new Map(prev).set(id, description));
    }
  };

  const updateLabel = (id: string, label: string) => {
    setLabels(prev => new Map(prev).set(id, label));
  };

  const updateDescription = (id: string, description: string) => {
    setDescriptions(prev => new Map(prev).set(id, description));
  };

  const getLabel = (id: string) => labels.get(id);
  const getDescription = (id: string) => descriptions.get(id);

  return (
    <ARIAContext.Provider value={{
      registerElement,
      updateLabel,
      updateDescription,
      getLabel,
      getDescription
    }}>
      {children}
    </ARIAContext.Provider>
  );
}

export function useARIA() {
  const context = useContext(ARIAContext);
  if (!context) {
    throw new Error('useARIA must be used within an ARIAProvider');
  }
  return context;
}

// Enhanced Clickable Element with comprehensive ARIA support
interface AccessibleClickableProps {
  children: React.ReactNode;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  role?: string;
  label?: string;
  description?: string;
  pressed?: boolean;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  haspopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  controls?: string;
  describedby?: string;
  labelledby?: string;
  className?: string;
  as?: 'button' | 'div' | 'span';
}

export function AccessibleClickable({
  children,
  onClick,
  onKeyDown,
  role = 'button',
  label,
  description,
  pressed,
  expanded,
  selected,
  disabled,
  haspopup,
  controls,
  describedby,
  labelledby,
  className,
  as = 'button'
}: AccessibleClickableProps) {
  const { announcePolite } = useAccessibilityContext();
  const elementId = `clickable-${Math.random().toString(36).substr(2, 9)}`;
  const descriptionId = description ? `${elementId}-desc` : undefined;

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    if (label) {
      announcePolite(`${label} activated`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    onKeyDown?.(e);
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const ariaProps = {
    role: as === 'button' ? undefined : role,
    'aria-label': label,
    'aria-describedby': [describedby, descriptionId].filter(Boolean).join(' ') || undefined,
    'aria-labelledby': labelledby,
    'aria-pressed': pressed,
    'aria-expanded': expanded,
    'aria-selected': selected,
    'aria-disabled': disabled,
    'aria-haspopup': haspopup,
    'aria-controls': controls,
    tabIndex: disabled ? -1 : 0,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    className
  };

  if (as === 'button') {
    return (
      <>
        <button {...ariaProps} disabled={disabled}>
          {children}
        </button>
        {description && (
          <div id={descriptionId} className="sr-only">
            {description}
          </div>
        )}
      </>
    );
  }

  const Element = as as keyof JSX.IntrinsicElements;
  return (
    <>
      <Element {...ariaProps}>
        {children}
      </Element>
      {description && (
        <div id={descriptionId} className="sr-only">
          {description}
        </div>
      )}
    </>
  );
}

// Status and Alert Manager
interface StatusMessage {
  id: string;
  message: string;
  type: 'status' | 'alert' | 'error';
  priority: 'polite' | 'assertive';
  timestamp: number;
}

export function useStatusManager() {
  const [messages, setMessages] = useState<StatusMessage[]>([]);
  const { announcePolite, announceAssertive } = useAccessibilityContext();

  const addStatus = (message: string, type: 'status' | 'alert' | 'error' = 'status') => {
    const id = `status-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const priority = type === 'error' ? 'assertive' : 'polite';
    
    const statusMessage: StatusMessage = {
      id,
      message,
      type,
      priority,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, statusMessage]);

    // Announce to screen readers
    if (priority === 'assertive') {
      announceAssertive(message);
    } else {
      announcePolite(message);
    }

    // Auto-remove after 5 seconds for status messages
    if (type === 'status') {
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
      }, 5000);
    }
  };

  const removeStatus = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const clearAll = () => {
    setMessages([]);
  };

  return {
    messages,
    addStatus,
    removeStatus,
    clearAll
  };
}

// Progress Indicator with ARIA support
interface AccessibleProgressProps {
  value: number;
  max?: number;
  min?: number;
  label?: string;
  description?: string;
  showPercentage?: boolean;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'orange' | 'red';
  className?: string;
}

export function AccessibleProgress({
  value,
  max = 100,
  min = 0,
  label,
  description,
  showPercentage = true,
  showValue = false,
  size = 'md',
  color = 'blue',
  className
}: AccessibleProgressProps) {
  const percentage = Math.round(((value - min) / (max - min)) * 100);
  const progressId = `progress-${Math.random().toString(36).substr(2, 9)}`;
  const descriptionId = description ? `${progressId}-desc` : undefined;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label htmlFor={progressId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {(showPercentage || showValue) && (
            <span className="text-sm text-gray-600">
              {showValue && `${value}/${max}`}
              {showValue && showPercentage && ' • '}
              {showPercentage && `${percentage}%`}
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          id={progressId}
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={label}
          aria-describedby={descriptionId}
          aria-valuetext={`${percentage}% complete`}
        />
      </div>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}

// Breadcrumb Navigation with ARIA
interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  onClick?: () => void;
}

interface AccessibleBreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function AccessibleBreadcrumb({
  items,
  separator = '/',
  className
}: AccessibleBreadcrumbProps) {
  const { announcePolite } = useAccessibilityContext();

  const handleNavigation = (item: BreadcrumbItem) => {
    if (item.current) return;
    
    if (item.onClick) {
      item.onClick();
    }
    
    announcePolite(`Navigated to ${item.label}`);
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol role="list" className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="text-gray-400 mx-2" aria-hidden="true">
                {separator}
              </span>
            )}
            
            {item.current ? (
              <span
                className="text-gray-500 font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <AccessibleClickable
                onClick={() => handleNavigation(item)}
                label={item.label}
                className="text-orange-600 hover:text-orange-800 font-medium"
                as="span"
                role="link"
              >
                {item.label}
              </AccessibleClickable>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Enhanced Notification Component
interface AccessibleNotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    primary?: boolean;
  }>;
  className?: string;
}

export function AccessibleNotification({
  type,
  title,
  message,
  dismissible = true,
  onDismiss,
  actions,
  className
}: AccessibleNotificationProps) {
  const notificationId = `notification-${Math.random().toString(36).substr(2, 9)}`;
  const { announceAssertive } = useAccessibilityContext();

  useEffect(() => {
    // Announce important notifications
    if (type === 'error' || type === 'warning') {
      announceAssertive(`${type}: ${title || message}`);
    }
  }, [type, title, message, announceAssertive]);

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: '✓',
    error: '⚠',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div
      id={notificationId}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={`rounded-md border p-4 ${typeStyles[type]} ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-lg" aria-hidden="true">
            {icons[type]}
          </span>
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm">
            {message}
          </p>
          
          {actions && actions.length > 0 && (
            <div className="mt-3 flex space-x-2">
              {actions.map((action, index) => (
                <AccessibleClickable
                  key={index}
                  onClick={action.onClick}
                  label={action.label}
                  className={`text-xs font-medium px-3 py-1 rounded-md ${
                    action.primary 
                      ? 'bg-current text-white' 
                      : 'bg-transparent border border-current'
                  }`}
                >
                  {action.label}
                </AccessibleClickable>
              ))}
            </div>
          )}
        </div>
        
        {dismissible && onDismiss && (
          <div className="ml-3 flex-shrink-0">
            <AccessibleClickable
              onClick={onDismiss}
              label="Dismiss notification"
              className="text-lg hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
            >
              ×
            </AccessibleClickable>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading State with ARIA
interface AccessibleLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
  className?: string;
}

export function AccessibleLoading({
  message = 'Loading...',
  size = 'md',
  overlay = false,
  className
}: AccessibleLoadingProps) {
  const loadingId = `loading-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const LoadingSpinner = () => (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-orange-500 ${sizeClasses[size]}`}
      aria-hidden="true"
    />
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
          <LoadingSpinner />
          <div
            id={loadingId}
            role="status"
            aria-live="polite"
            className="text-gray-700 font-medium"
          >
            {message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <LoadingSpinner />
      <div
        id={loadingId}
        role="status"
        aria-live="polite"
        className="text-gray-700"
      >
        {message}
      </div>
    </div>
  );
}